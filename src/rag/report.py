import json
import logging
from pathlib import Path
from src.rag.retrieval import get_species_knowledge
from src.rag.generation import get_client, MODEL_NAME


PROJECT_ROOT = Path(__file__).resolve().parent.parent.parent


CONSERVATION_CONCERN_STATUS = ["Critically Endangered", "Endangered"]

REPORT_PROMPT_TEMPLATE = """You are summarizing a batch of wildlife camera-trap detections for a conservation researcher.

STRUCTURED DATA (this is the complete and only data available — do not estimate, extrapolate, or add anything not explicitly present):
{report_data}

INSTRUCTIONS:
Using ONLY the data above, write a short summary (3-5 sentences) for the researcher. Lead with the single most important finding — if any conservation-concern species are listed, mention them first, by name. Then cover the total number of detections, the most common species observed, and the number of cases flagged for review. Do not add any information, statistic, or species not explicitly present in the data above.
"""


def build_report_data(detection_results: list[dict]) -> dict:
    """
    Aggregates a list of /predict-style results (each with species, 
    confidence, review_needed) into structures summary data.
    Does not call any LLM - pure computation over already-produced results.
    
    """

    total = len(detection_results)


    species_counts = {}

    for r in detection_results:
        species = r.get("predicted_species") or r.get("species")

        if species is None:
            continue

        species_counts[species] = species_counts.get(species, 0) + 1

    flagged = [
        r for r in detection_results
        if r.get("review_needed") is True
    ]

    conservation_concern = []

    for species in species_counts:
        doc = get_species_knowledge(species)

        if doc:
            doc_lower = doc.lower()
            
            if doc and any(status.lower() in doc_lower for status in CONSERVATION_CONCERN_STATUS):
                conservation_concern.append(species)


    failures = [
        r for r in detection_results
        if r.get("error") or r.get("predicted_species") is None
    ]

    missing_explanations = [
    r for r in detection_results
    if r.get("include_in_generation_eval") and r.get("explanation") is None
]


    successful = total - len(failures)

    return {
        "total_detections": total,
        "successful_detections": successful,
        "processing_failures": len(failures),
        "species_counts": species_counts,
        "flagged_count": len(flagged),
        "flagged_cases": flagged,
        "conservation_concern_species": conservation_concern,
        "explanation_unavailable_count": len(missing_explanations)
    }


def generate_report_narrative(report_data: dict) -> str | None:
    prompt = REPORT_PROMPT_TEMPLATE.format(
        report_data=json.dumps(report_data, indent=2, default=str)
    )
    client = get_client()

    try:
        response = client.models.generate_content(model=MODEL_NAME, contents=prompt)
        return response.text
    except Exception as e:
        logging.error(f"Report narrative generation failed: {e}")
        return None


if __name__ == "__main__":
    with open(PROJECT_ROOT / "eval" / "week6_results.json") as f:
        results = json.load(f)

    report_data = build_report_data(results)
    print(json.dumps(report_data, indent=2, default=str))

    narrative = generate_report_narrative(report_data)
    print("\n \tNARRATIVE \t \n ")
    print(narrative)