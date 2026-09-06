import random
import json
from pathlib import Path

PROJECT_ROOT = Path(__file__).resolve().parent.parent
TEST_DIR = PROJECT_ROOT / "data" / "processed" / "test"

random.seed(42)  # reproducible, same discipline as your train/val/test split

PER_SPECIES = 4
GENERATION_SUBSET_SIZE = 15

eval_cases = []
for species_dir in sorted(TEST_DIR.iterdir()):
    if not species_dir.is_dir():
        continue
    images = list(species_dir.glob("*.JPG"))
    sampled = random.sample(images, min(PER_SPECIES, len(images)))
    for img in sampled:
        eval_cases.append({
            "filepath": str(img),
            "true_species": species_dir.name,
        })

print(f"Total eval cases: {len(eval_cases)}")

# Mark a subset for generation testing — guarantee jackal is well-represented
jackal_cases = [c for c in eval_cases if c["true_species"] == "canis_mesomelas"]
other_cases = [c for c in eval_cases if c["true_species"] != "canis_mesomelas"]
random.shuffle(other_cases)

generation_subset = jackal_cases + other_cases[: GENERATION_SUBSET_SIZE - len(jackal_cases)]
generation_ids = {c["filepath"] for c in generation_subset}

for c in eval_cases:
    c["include_in_generation_eval"] = c["filepath"] in generation_ids

with open(PROJECT_ROOT / "eval" / "week6_eval_set.json", "w") as f:
    json.dump(eval_cases, f, indent=2)

print(f"Generation subset size: {len(generation_subset)}")
print(f"Saved to eval/week6_eval_set.json")