from ultralytics import YOLO
from torchvision import datasets
from pathlib import Path
import pandas as pd
import matplotlib.pyplot as plt

PROJECT_ROOT = Path(__file__).resolve().parent.parent



baseline_model = YOLO(str(PROJECT_ROOT / "src" / "models" / "runs" / "classify" / "train-5"/ "weights" / "best.pt"))

val_data = datasets.ImageFolder(root=str(PROJECT_ROOT / "data" / "processed" / "val"))

results = []
skipped = []

for filepath, true_idx in val_data.samples:
    true_label = val_data.classes[true_idx]

    baseline_result = baseline_model.predict(filepath, verbose=False)

    if len(baseline_result) == 0:
        skipped.append(filepath)
        continue

    result_obj = baseline_result[0]
    baseline_label = result_obj.names[result_obj.probs.top1]

    baseline_confidence = result_obj.probs.top1conf.item()

    results.append({
        "filepath": filepath,
        "true_label": true_label,
        "baseline_pred": baseline_label,
        "baseline_confidence": baseline_confidence
    })


# print(f"Skipped {len(skipped)} unreadable images out of {len(val_data.samples)}")


df = pd.DataFrame(results)
# df.to_csv(str(PROJECT_ROOT / "eval" / "baseline_confidence.csv"), index=False)
# print(df.head())

# print(df['baseline_pred'].unique())

correct_mask = df["baseline_pred"] == df["true_label"]

correct_confidence = df.loc[correct_mask, "baseline_confidence"]
incorrect_confidence = df.loc[~correct_mask, "baseline_confidence"]

print(f"\ncorrect predictions: {len(correct_confidence)}")
print(correct_confidence.describe())

print(f"\n Incorrect predictions: {len(incorrect_confidence)}")
print(incorrect_confidence.describe())

'''

plt.figure(figsize=(8, 5))

plt.hist(correct_confidence, bins=30, alpha=0.6, label="Correct", color="tab:blue")
plt.hist(incorrect_confidence, bins=30, alpha=0.6, label="Incorrect", color="tab:red")
plt.yscale("log")
plt.xlabel("Confidence")
plt.ylabel("Density (log scale)")
plt.title("Baseline Model: Confidence Distribution, Correct vs. Incorrect")
plt.legend()
plt.savefig(str(PROJECT_ROOT / "eval" / "confidence_distribution.png"))
plt.show()


for threshold in [0.75, 0.76, 0.77, 0.78, 0.79,
                  0.80, 0.81, 0.82, 0.83, 0.84, 0.85,
                  0.86, 0.87, 0.88, 0.89, 0.90]:
    above = df[df["baseline_confidence"] >= threshold]
    below = df[df["baseline_confidence"] < threshold]

    pct_flag = len(below) / len(df) * 100
    acc_above = (above["baseline_pred"] == above["true_label"]).mean()
    acc_below = (below["baseline_pred"] == below["true_label"]).mean() if len(below) > 0 else float("nan")

    print(f"Threshold {threshold}: {pct_flag:.1f}% flagged | trusted acc: {acc_above:.4f} | flagged acc: {acc_below:.4f}")

    '''

THRESHOLD = 0.85

df["correct"] = df["baseline_pred"] == df["true_label"]
df["trusted"] = df["baseline_confidence"] >= THRESHOLD

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

species_df.to_csv(str(PROJECT_ROOT / "eval" / "per_species_threshold_report.csv"), index=False)

watch_species = ["canis_mesomelas", "panthera_leo", "loxodanta_africana", "diceros_bicornis"]
print("\n--- Species of particular interest ---")
print(species_df[species_df["species"].isin(watch_species)].to_string(index=False))

overconfident_wrong = df[(~df["correct"]) & (df["baseline_confidence"] >= 0.95)]
print(f"\nHighly confident (>=0.95) but wrong: {len(overconfident_wrong)} cases")
print(overconfident_wrong[["true_label", "baseline_pred", "baseline_confidence"]].to_string(index=False))
    

