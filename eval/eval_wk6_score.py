# eval/score_week6_eval.py
import json
from pathlib import Path
import pandas as pd

PROJECT_ROOT = Path(__file__).resolve().parent.parent

with open(PROJECT_ROOT / "eval" / "week6_results.json") as f:
    results = json.load(f)

df = pd.DataFrame(results)

# --- Detection accuracy ---
df["correct"] = df["predicted_species"] == df["true_species"]
detection_acc = df["correct"].mean()
print(f"Detection accuracy on eval set (n={len(df)}): {detection_acc:.4f}")
print(f"(compare to Week 2's full 2,355-case test accuracy: 94.8% raw / 98.36% trusted)")

# --- Retrieval correctness (should be 100% by construction) ---
retrieval_correct = df["description"].notna().sum()
print(f"Retrieval succeeded: {retrieval_correct}/{len(df)}")

# --- Generation cases only ---
gen_df = df[df["include_in_generation_eval"] == True].copy()
gen_attempted = gen_df["explanation"].notna().sum()
print(f"\nGeneration attempted: {len(gen_df)}, succeeded: {gen_attempted} "
      f"(failures likely rate-limit related, per Week 5's known constraint)")

# Manual scoring columns to fill in by hand after reading each explanation
gen_df["grounded"] = None       # fill in True/False after manual review
gen_df["tone_correct"] = None   # fill in True/False after manual review

gen_df[["filepath", "true_species", "predicted_species", "confidence",
        "review_needed", "explanation", "grounded", "tone_correct"]].to_csv(
    PROJECT_ROOT / "eval" / "week6_generation_scoring.csv", index=False
)
print("\nSaved eval/week6_generation_scoring.csv — fill in 'grounded' and 'tone_correct' columns manually")