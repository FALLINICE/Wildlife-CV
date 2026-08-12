from ultralytics import YOLO
from torchvision import datasets
from pathlib import Path
import pandas as pd
from statsmodels.stats.contingency_tables import mcnemar

PROJECT_ROOT = Path(__file__).resolve().parent.parent

baseline_model = YOLO(str(PROJECT_ROOT / "src" / "models" / "runs" / "classify" / "train-5" / "weights" / "best.pt"))
weighted_model = YOLO(str(PROJECT_ROOT / "src" / "models" / "runs" / "classify" / "train-21" / "weights" / "best.pt"))


val_data = datasets.ImageFolder(root=str(PROJECT_ROOT / "data" / "processed" / "val"))

results_table = []
skipped = []

for filepath, true_idx in val_data.samples:
    true_label = val_data.classes[true_idx]

    baseline_result = baseline_model.predict(filepath, verbose=False)
    weighted_result = weighted_model.predict(filepath, verbose=False)

    if len(baseline_result) == 0 or len(weighted_result) == 0:
        skipped.append(filepath)
        continue

    baseline_pred = baseline_model.predict(filepath, verbose=False)[0]
    weighted_pred = weighted_model.predict(filepath, verbose=False)[0]

    baseline_label = baseline_pred.names[baseline_pred.probs.top1]
    weighted_label = weighted_pred.names[weighted_pred.probs.top1]

    results_table.append({
        "filepath": filepath,
        "true_label": true_label,
        "baseline_pred": baseline_label,
        "weighted_pred": weighted_label
    })

print(f"Skipped {len(skipped)} unreadable images out of {len(val_data.samples)}")

pd.DataFrame(results_table).to_csv(str(PROJECT_ROOT / "eval" / "model_comparison.csv"), index=False)

correct_baseline_only = 0
correct_weighted_only = 0

for row in results_table:
    baseline_correct = row["baseline_pred"] == row["true_label"]
    weighted_correct = row["weighted_pred"] == row["true_label"]

    if baseline_correct and not weighted_correct:
        correct_baseline_only += 1
    elif weighted_correct and not baseline_correct:
        correct_weighted_only += 1

table = [[0, correct_baseline_only],
         [correct_weighted_only, 0]]

result = mcnemar(table, exact=True)
print(f"p-value: {result.pvalue}")


