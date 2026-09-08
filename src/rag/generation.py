import os
import time
import logging
from pathlib import Path
from dotenv import load_dotenv
from google import genai
from google.genai import types
from google.genai import errors as genai_errors
from src.rag.prompt_builder import build_prompt

PROJECT_ROOT = Path(__file__).resolve().parent.parent.parent
load_dotenv(PROJECT_ROOT / ".env")

_client = None
MODEL_NAME = "gemini-3.6-flash"


def get_client():
    """
    Returns the Gemini client, connecting once and reusing it —
    same pattern as get_collection() in retrieval.py.
    """
    global _client
    if _client is None:
        api_key = os.getenv("GEMINI_API_KEY")
        _client = genai.Client(api_key=api_key)
    return _client

_request_count = 0
_window_start = time.time()
WARNING_THRESHOLD = 15  # warn before hitting the actual limit of 20

def _track_request():
    global _request_count, _window_start
    _request_count += 1
    if _request_count >= WARNING_THRESHOLD:
        logging.warning(
            f"Approaching Gemini free-tier rate limit: {_request_count} requests "
            f"since tracking started. Limit is 20/period."
        )


def generate_explanation(species: str, confidence: float, review_needed: bool, retrieved_doc: str) -> str | None:
    """
    Generates a grounded natural-language explanation of a species detection.
    Returns None if generation fails (rate limit, API error, etc.) — callers
    should treat this as "explanation unavailable," not a fatal error.
    """
    prompt = build_prompt(species, confidence, review_needed, retrieved_doc)
    client = get_client()

    try:
        start = time.time()
        response = client.models.generate_content(
            model=MODEL_NAME,
            contents=prompt,
        )
        elapsed = time.time() - start
        logging.info(f"Gemini generation took {elapsed:.2f}s")
        return response.text

    except genai_errors.ClientError as e:
        if e.code == 429:
            logging.error(f"Gemini rate limit (429) for species={species}: {e}")
        else:
            logging.error(f"Gemini ClientError (code={e.code}) for species={species}: {e}")
        return None

    except Exception as e:
        logging.error(f"Gemini unexpected {type(e).__name__} for species={species}: {e}")
        return None



if __name__ == "__main__":
    from src.rag.retrieval import get_species_knowledge

    doc = get_species_knowledge("hyaena_brunnea")
    explanation = generate_explanation("hyaena_brunnea", 0.11, True, doc)
    print(explanation)