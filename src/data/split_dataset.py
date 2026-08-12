import shutil
import random
from pathlib import Path



PROJECT_ROOT = Path(__file__).resolve().parent.parent.parent
RAW_IMAGES_DIR = PROJECT_ROOT / "data" / "raw" / "images"
PROCESSED_DIR = PROJECT_ROOT / "data"/ "processed"


for split in ["train", "val", "test"]:
    split_path = PROCESSED_DIR / split
    if split_path.exists():
        shutil.rmtree(split_path)

TRAIN_RATIO = 0.70
VAL_RATIO = 0.15

SEED = 42
random.seed(SEED)


species_folder = [d for d in RAW_IMAGES_DIR.iterdir() if d.is_dir()]
print(f"Found {len(species_folder)} species folders.")


for species_dir in species_folder:
    images = list(species_dir.glob("*.JPG")) + list(species_dir.glob("*.jpg"))
    random.shuffle(images)

    total = len(images)
    len_train = int(total * TRAIN_RATIO)
    len_val = int(total * VAL_RATIO)


    train_images = images[: len_train]
    val_images = images[len_train: len_train + len_val]
    test_images = images[len_train + len_val: total]

    species_name = species_dir.name

    for split_name, split_images in [
        ("train", train_images),
        ("val", val_images),
        ("test", test_images)
    ]:
        split_folder = PROCESSED_DIR / split_name / species_name 
        split_folder.mkdir(parents=True, exist_ok=True)

        for img_path in split_images:
            shutil.copy(img_path, split_folder / img_path.name)

    print(f"{species_name}: {len(train_images)} train, {len(val_images)} val,{len(test_images)} test")

print("\nDone.")


