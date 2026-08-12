from ultralytics import YOLO
from pathlib import Path

model = YOLO("yolo11n-cls.pt")

PROJECT_ROOT = Path(__file__).resolve().parent.parent.parent
IMAGE_PATH = PROJECT_ROOT / "data" / "processed"

results = model.train(data=str(IMAGE_PATH), epochs = 30, batch=64, imgsz=224, device='mps', patience=10)