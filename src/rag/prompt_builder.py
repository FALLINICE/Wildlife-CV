import os 
from dotenv import load_dotenv
from pathlib import Path
from google import genai


PROJECT_ROOT = Path(__file__).resolve().parent.parent.parent

load_dotenv(PROJECT_ROOT / ".env")

api_key = os.getenv("GEMINI_API_KEY")

PROMPT_TEMPLATE = """ You are helping a wildlife conservation researcher understand an automated species detection.

DETECTION RESULT:
- Predicted species: {species}
- Model confidence: {confidence}
- Requires human review: {review_needed}

SOURCE DOCUMENT (this is your ONLY source of information about this species):
{retrieved_doc}

INSTRUCTIONS:
Using ONLY the information in the source document above, write a short paragraph (4-7 sentences) explaining this detection for the researcher. Cover the species' conservation status and one or two other relevant details from the document (habitat, behaviour, or threats).

Do not include any facts, statistic, or claim that is not explicitly stated in the source document above, even if you believe it to be true from general knowledge. If the source document does not address something, do not guess or fill in the gap - simply omit it.

If the model confidence is low or human review is required, acknowledge this uncertainty in your explanation rather than stating the species identification as a definite fact.
"""

def build_prompt(species: str, confidence: float, review_needed: bool, retrieved_doc: str) -> str:

    return PROMPT_TEMPLATE.format(
        species=species,
        confidence=confidence,
        review_needed=review_needed,
        retrieved_doc=retrieved_doc
    )

if __name__ == "__main__":

    import sys

    sys.path.insert(0, str(Path(__file__).resolve().parent.parent.parent))
    from src.rag.retrieval import get_species_knowledge

    doc = get_species_knowledge("antidorcas_marsupialis")
    prompt = build_prompt("antidorcas_marsupialis", 0.95, False, doc)
    print(prompt)

    gemini = genai.Client(api_key=api_key)

    response = gemini.models.generate_content(
        model = "gemini-3.6-flash",
        contents = prompt
    )

    print(response.text)


