from pathlib import Path
from weighted_sampler import WeightedClassificationTrainer, ResettableDataLoader

PROJECT_ROOT = Path(__file__).parent.parent.parent
IMAGE_PATH = PROJECT_ROOT / "data" / "processed"

overrides = {
    "model": "yolo11n-cls.pt",
    "data": str(IMAGE_PATH),
    "epochs": 30,
    "batch": 64,
    "imgsz": 224,
    "device": "mps",
    "patience": 10
}

trainer = WeightedClassificationTrainer(overrides=overrides)
trainer.train()