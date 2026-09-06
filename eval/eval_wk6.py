# eval/run_week6_eval.py
import json
import time
from pathlib import Path
from ultralytics import YOLO
from src.rag.retrieval import get_species_knowledge
from src.rag.generation import generate_explanation

PROJECT_ROOT = Path(__file__).resolve().parent.parent
CONFIDENCE_THRESHOLD = 0.85

model = YOLO(str(PROJECT_ROOT / "src" / "models" / "runs" / "classify" / "train-5" / "weights" / "best.pt"))

with open(PROJECT_ROOT / "eval" / "week6_eval_set.json") as f:
    eval_cases = json.load(f)

results = []
generation_calls_made = 0

for case in eval_cases:
    pred = model.predict(case["filepath"], verbose=False)
    if len(pred) == 0:
        results.append({**case, "predicted_species": None, "error": "unreadable"})
        continue

    r = pred[0]
    predicted_species = r.names[r.probs.top1]
    confidence = r.probs.top1conf.item()
    review_needed = confidence < CONFIDENCE_THRESHOLD

    species_info = get_species_knowledge(predicted_species)

    explanation = None
    if case["include_in_generation_eval"]:
        explanation = generate_explanation(predicted_species, confidence, review_needed, species_info)
        generation_calls_made += 1
        time.sleep(3)  # basic spacing, respects the 20/period free-tier limit

    results.append({
        **case,
        "predicted_species": predicted_species,
        "confidence": round(confidence, 4),
        "review_needed": review_needed,
        "description": species_info,
        "explanation": explanation,
    })

    print(f"{case['true_species']} -> {predicted_species} (conf={confidence:.4f}) "
          f"[gen: {'yes' if case['include_in_generation_eval'] else 'no'}]")

with open(PROJECT_ROOT / "eval" / "week6_results.json", "w") as f:
    json.dump(results, f, indent=2)

print(f"\nTotal cases: {len(results)}, generation calls made: {generation_calls_made}")