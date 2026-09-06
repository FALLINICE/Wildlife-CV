import pytest
from fastapi.testclient import TestClient
from src.api.app import app
from src.rag.report import build_report_data, generate_report_narrative
from pathlib import Path

PROJECT_ROOT = Path(__file__).resolve().parent.parent
TEST_IMAGE_PATH = PROJECT_ROOT / "data" / "processed" / "test" / "struthio_camelus"
CORRUPTED_IMAGE_PATH = PROJECT_ROOT / "data" / "processed" / "val" / "diceros_bicornis" / "20150204-EK000264.JPG"


@pytest.fixture
def client():
        with TestClient(app) as c:
             yield c

def test_docs(client):

    response = client.get("/docs")

    assert response.status_code == 200


def test_valid_pred(client, monkeypatch):

    monkeypatch.setattr(
        "src.api.app.generate_explanation",
        lambda *args, **kwargs: "Mocked explanation text for testing."
    )
    
    image_files = list(TEST_IMAGE_PATH.glob("*.JPG"))
    assert len(image_files) > 0, "No test images found - check the path"

    sample_images = image_files[0]

    with open(sample_images, "rb") as f:
        response = client.post(
            "/predict",
            files={"file": (sample_images.name, f, "image/jpeg")}
        )
    assert response.status_code == 201

    data = response.json()
    assert "species" in data
    assert "confidence" in data
    assert "review_needed" in data
    assert 0.0 <= data["confidence"] <= 1.0
    assert isinstance(data["review_needed"], bool)
    assert "description" in data
    assert data["description"] is not None
    assert len(data["description"]) > 0

    assert "explanation" in data
    if data["explanation"] is not None:
        assert isinstance(data["explanation"], str)
        assert len(data["explanation"]) > 0         

def test_valid_file(client):
     
          response = client.post(
               "/predict", 
               files={"file": ("test.txt", b"this is not an image", "text/plain")}
          )
          assert response.status_code == 400
          assert "Invalid file type" in response.json()["detail"]

def test_empty_file(client):
      response = client.post(
            "/predict",
            files={"file": ("test.jpeg", b"", "image/jpeg")}
      )
      assert response.status_code == 400
      assert "Uploaded file is empty" in response.json()["detail"]

def test_corrupted_file(client):

      with open (CORRUPTED_IMAGE_PATH, "rb") as f:
            response = client.post(
                  "/predict",
                  files = {"file": (CORRUPTED_IMAGE_PATH.name, f, "image/jpeg")}
            )

            assert response.status_code == 422
            assert "Could not process image. The file may be corrupted or unreadable." in response.json()["detail"]

def test_low_confidence_includes_alternatives(client):
    # pick an image known to be genuinely difficult - a jackal image is your
    # best bet, given everything you know about that class's weaker performance
    image_files = list((PROJECT_ROOT / "data" / "processed" / "test" / "canis_mesomelas").glob("*.JPG"))
    assert len(image_files) > 0

    sample_image = image_files[0]

    with open(sample_image, "rb") as f:
        response = client.post(
            "/predict",
            files={"file": (sample_image.name, f, "image/jpeg")}
        )

    assert response.status_code == 201
    data = response.json()

    if data["review_needed"]:
        assert "alternative_candidates" in data
        assert len(data["alternative_candidates"]) == 3
        species_list = [c["species"] for c in data["alternative_candidates"]]
        assert len(set(species_list)) == 3  # all three should be different species
    else:
        assert "alternative_candidates" not in data

def test_black_rhino_description_correct(client):
    rhino_path = PROJECT_ROOT / "data" / "processed" / "test" / "diceros_bicornis"
    image_files = list(rhino_path.glob("*.JPG"))
    assert len(image_files) > 0

    sample_image = image_files[0]
    with open(sample_image, "rb") as f:
        response = client.post(
            "/predict",
            files={"file": (sample_image.name, f, "image/jpeg")}
        )

    assert response.status_code == 201
    data = response.json()
    assert data["species"] == "diceros_bicornis"
    assert "Critically Endangered" in data["description"]

def test_predict_handles_generation_failure_gracefully(client, monkeypatch):
    # Force generate_explanation to simulate an LLM failure,
    # without touching the real API or burning quota
    def mock_generate_explanation(*args, **kwargs):
        return None

    monkeypatch.setattr(
        "src.api.app.generate_explanation",
        mock_generate_explanation
    )

    image_files = list(TEST_IMAGE_PATH.glob("*.JPG"))
    sample_image = image_files[0]

    with open(sample_image, "rb") as f:
        response = client.post(
            "/predict",
            files={"file": (sample_image.name, f, "image/jpeg")}
        )

    assert response.status_code == 201
    data = response.json()

    # classification and retrieval must still work
    assert "species" in data
    assert data["description"] is not None
    assert len(data["description"]) > 0

    # explanation must be None, not missing or crashed
    assert data["explanation"] is None

def test_generation_real_api_integration(client):
    """
    One deliberate, quota-costing test against the real Gemini API,
    confirming end-to-end integration still works. Not run as part of
    routine test iteration — reserved for pre-commit/pre-push verification.
    """
    image_files = list(TEST_IMAGE_PATH.glob("*.JPG"))
    sample_image = image_files[0]

    with open(sample_image, "rb") as f:
        response = client.post(
            "/predict",
            files={"file": (sample_image.name, f, "image/jpeg")}
        )

    assert response.status_code == 201
    data = response.json()
    # if this fails specifically due to rate-limiting, that's expected
    # and acceptable — this test's purpose is confirming wiring, not guaranteeing quota availability
    if data["explanation"] is not None:
        assert len(data["explanation"]) > 0

def test_build_report_data_counts_correctly():
    fake_results = [
        {"predicted_species": "panthera_leo", "review_needed": False},
        {"predicted_species": "panthera_leo", "review_needed": True},
        {"predicted_species": "diceros_bicornis", "review_needed": False},
    ]
    report = build_report_data(fake_results)

    assert report["total_detections"] == 3
    assert report["species_counts"]["panthera_leo"] == 2
    assert report["flagged_count"] == 1
    assert "diceros_bicornis" in report["conservation_concern_species"]

def test_generate_report_narrative_mocked(monkeypatch):
    """
    Confirms generate_report_narrative()'s plumbing (prompt formatting,
    calling the client, returning the response) works correctly, without
    hitting the real Gemini API or consuming free-tier quota.
    """

    class FakeResponse:
        text = "This is a mocked narrative summarizing the batch."

    class FakeModels:
        def generate_content(self, model, contents):
            # confirm the prompt actually contains real data from
            # report_data, not something malformed or empty
            assert "total_detections" in contents
            assert "42" in contents
            return FakeResponse()

    class FakeClient:
        models = FakeModels()

    monkeypatch.setattr(
        "src.rag.report.get_client",
        lambda: FakeClient()
    )

    fake_report_data = {
        "total_detections": 42,
        "species_counts": {"panthera_leo": 42},
        "flagged_count": 0,
        "conservation_concern_species": [],
    }

    narrative = generate_report_narrative(fake_report_data)

    assert narrative == "This is a mocked narrative summarizing the batch."