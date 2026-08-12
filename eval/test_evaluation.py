from pathlib import Path
from ultralytics import YOLO
from torchvision import datasets
import pandas as pd

PROJECT_ROOT = Path(__file__).resolve().parent.parent

CONFIDENCE_THRESHOLD = 0.85

baseline_model = YOLO(str(PROJECT_ROOT / "src" / "models" / "runs" / "classify" / "train-5" / "weights" / "best.pt"))
test_data = datasets.ImageFolder(root=str(PROJECT_ROOT / "data" / "processed" / "test"))


results = []
skipped = []

for filepath, true_idx in test_data.samples:
    true_label = test_data.classes[true_idx]

    baseline_result = baseline_model.predict(filepath, verbose=False)

    if len(baseline_result) == 0:
        skipped.append(filepath)
        continue

    result = baseline_result[0]
    baseline_label = result.names[result.probs.top1]

    baseline_confidence = result.probs.top1conf.item()

    results.append({
        "filepath": filepath,
        "true_label": true_label,
        "baseline_pred": baseline_label,
        "baseline_confidence": baseline_confidence
    }) 

df = pd.DataFrame(results)

# df.to_csv(str(PROJECT_ROOT / "eval" / "test_predictions.csv"))

df["correct"] = df["baseline_pred"] == df["true_label"]

correct_confidence = df.loc[df["correct"], "baseline_confidence"]
incorrect_confidence = df.loc[~df["correct"], "baseline_confidence"]

print(f"\ncorrect predictions: {len(correct_confidence)}")
print(correct_confidence.describe())

print(f"\n Incorrect predictions: {len(incorrect_confidence)}")
print(incorrect_confidence.describe())


df["correct"] = df["baseline_pred"] == df["true_label"]
df["trusted"] = df["baseline_confidence"] >= CONFIDENCE_THRESHOLD

trusted_df = df[df["trusted"]]
flagged_df = df[~df["trusted"]]

overall_trusted_acc = trusted_df["correct"].mean()
overall_flagged_acc = flagged_df["correct"].mean()
pct_flagged_overall = (~df["trusted"]).mean() * 100

print(f"\n=== TEST SET — OVERALL (threshold={CONFIDENCE_THRESHOLD}) ===")
print(f"Total evaluated: {len(df)}")
print(f"% flagged for review: {pct_flagged_overall:.2f}%")
print(f"Trusted accuracy: {overall_trusted_acc:.4f}")
print(f"Flagged accuracy: {overall_flagged_acc:.4f}")

species_report = []
for species in df["true_label"].unique():
    sub = df[df["true_label"] == species]
    trusted_sub = sub[sub["trusted"]]
    flagged_sub = sub[~sub["trusted"]]

    species_report.append({
        "species": species,
        "n_total": len(sub),
        "overall_acc": sub["correct"].mean(),
        "pct_flagged": (~sub["trusted"]).mean() * 100,
        "trusted_acc": trusted_sub["correct"].mean() if len(trusted_sub) > 0 else float("nan"),
        "flagged_acc": flagged_sub["correct"].mean() if len(flagged_sub) > 0 else float("nan"),
        "n_flagged": len(flagged_sub),
    })

species_df = pd.DataFrame(species_report).sort_values("trusted_acc")
print(species_df.to_string(index=False))

species_df.to_csv(str(PROJECT_ROOT / "eval" / "per_species_threshold_TEST.csv"), index=False)

watch_species = ["canis_mesomelas", "panthera_leo", "loxodanta_africana", "diceros_bicornis"]
print("\n--- Species of particular interest ---")
print(species_df[species_df["species"].isin(watch_species)].to_string(index=False))

overconfident_wrong = df[(~df["correct"]) & (df["baseline_confidence"] >= 0.95)]
print(f"\nHighly confident (>=0.95) but wrong: {len(overconfident_wrong)} cases")
print(overconfident_wrong[["true_label", "baseline_pred", "baseline_confidence"]].to_string(index=False))