import os
import uuid
import torch
import logging 
from fastapi import FastAPI, UploadFile, File, HTTPException, status
from pathlib import Path
from contextlib import asynccontextmanager
from ultralytics import YOLO
from typing import Annotated

PROJECT_ROOT = Path(__file__).resolve().parent.parent.parent
MODEL_PATH = PROJECT_ROOT / "src" / "models" / "runs" / "classify" / "train-5" / "weights" / "best.pt"
UPLOAD_DIR = PROJECT_ROOT / "uploaded_images"


# Confidence threshold below which a prediction is flagged for human review.
# Selected through validation-set analysis (see eval/confidence_threshold.py)
# and README Section 6 for the full sweep and reasoning (0.85 balances trusted-
# prediction accuracy gain against review burden; confirmed on held-out test
# set in Day 15, 98.36% trusted accuracy).

CONFIDENCE_THRESHOLD = 0.85
MAX_FILE_SIZE_BYTES = 10 * 1024 * 1024  # 10MB

logging.basicConfig(level=logging.INFO, format="%(asctime)s - %(levelname)s - %(message)s")



os.makedirs(UPLOAD_DIR, exist_ok=True)

ml_models = {}

@asynccontextmanager
async def lifespan(app: FastAPI):
    ml_models["baseline"] = YOLO(str(MODEL_PATH))
    yield
    ml_models.clear()

app = FastAPI(lifespan=lifespan)

accepted_format = ["image/jpeg", "image/jpg", "image/png", "image/JPG", "image/JPEG", "image/PNG"]


@app.post("/predict", status_code=status.HTTP_201_CREATED)
async def predict_class(file: Annotated[UploadFile, File()]):

    """
    Classify a camera trap image into one of 10 wildlife species.

    Predictions below the confidence threshold (0.85) are flagged
    for human review via `review_needed`, and the response includes
    up to 3 alternative candidate species (`alternative_candidates`)
    in that case.
    """

    if file.content_type not in accepted_format:
        logging.warning(f"Rejected upload: invalid content type {file.content_type}")
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=f"Invalid file type: {file.content_type}. Only JPEG, JPG, PNG format accepted."
        )


    contents = await file.read()

    if len(contents) == 0:
        logging.warning("Uploaded file is empty")
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Uploaded file is empty."  
        )
        
    

    if len(contents) > MAX_FILE_SIZE_BYTES:
        logging.warning("File too large.")
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=f"File too large. Max size is {MAX_FILE_SIZE_BYTES // (1024*1024)}MB."
        )
        

    file_extension = Path(file.filename).suffix
    safe_filename = f"{uuid.uuid4()}{file_extension}"
    file_path = os.path.join(UPLOAD_DIR, safe_filename)

    try:
        with open(file_path, "wb") as f:
            f.write(contents)

        model = ml_models["baseline"]

        try:
            prediction = model.predict(file_path, verbose=False)
        except Exception:
            logging.error(f"Prediction failed - unreadable/corrupted file: {safe_filename}")
            raise HTTPException(
                status_code=status.HTTP_422_UNPROCESSABLE_CONTENT,
                detail="Could not process image. The file may be corrupted or unreadable."
            )
            

        if len(prediction) == 0:
            logging.error(f"Prediction returned empty result: {safe_filename}")
            raise HTTPException(
                status_code=status.HTTP_422_UNPROCESSABLE_CONTENT,
                detail="Could not process image. The file may be corrupted or unreadable."
            )
            

        result = prediction[0]
        predicted_label = result.names[result.probs.top1]
        confidence = result.probs.top1conf.item()
        review_needed = confidence < CONFIDENCE_THRESHOLD

        response = {
            "species": predicted_label,
            "confidence": round(confidence, 4),
            "review_needed": review_needed,
        }

        logging.info(f"Prediction: {predicted_label} (confidence={confidence:.4f}, review_needed={review_needed})")

        if review_needed:
            probs_tensor = result.probs.data
            top3_indices = torch.topk(probs_tensor, k=3).indices.tolist()
            response["alternative_candidates"] = [
                {"species": result.names[i], "confidence": round(probs_tensor[i].item(), 4)}
                for i in top3_indices
            ]

        return response

    finally:
        if os.path.exists(file_path):
            os.remove(file_path)


