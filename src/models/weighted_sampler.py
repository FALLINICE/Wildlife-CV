from pathlib import Path
from ultralytics.models.yolo.classify import ClassificationTrainer
from torch.utils.data import DataLoader, WeightedRandomSampler
from collections import Counter

PROJECT_ROOT = Path(__file__).resolve().parent.parent.parent
IMAGE_PATH = PROJECT_ROOT / "data" / "processed"
train = IMAGE_PATH / "train"

'''
def walk_through_dir(dir_path):
    for dirpath, dirname, filenames in os.walk(dir_path):
        print(f"There are {len(dirname)} directoris and {len(filenames)} images in '{dirpath}' directory")


class_weights = {}
total = 0
counts = {}


for species in train.iterdir():
    if species.is_dir():
        upper = len(list(species.glob("*.JPG")))
        lower = len(list(species.glob("*.jpg")))
        if lower > 0:
            # print(f"{species.name}: {upper} upper, {lower} lower")
            length = upper + lower
        else:
            length = upper
        counts[species.name] = length
        total += length

for species_name, length in counts.items():
    class_weights[species_name] = total / length


data_transform = transforms.Compose([
    transforms.Resize(size=(224, 224)),
    transforms.RandomHorizontalFlip(p=0.5),
    transforms.ToTensor()

])

train_df = datasets.ImageFolder(root = train, 
                                transform=data_transform,
                                target_transform=None)



# print(train_df.classes, "\n")

# print(train_df.samples[:6], "\n")

# print(train_df.class_to_idx, "\n")

# (print(idx_to_class))

sample_weights = [] 

for _, class_idx in train_df.samples:
    species_name = train_df.classes[class_idx]
    sample_weights.append(class_weights[species_name])

assert len(sample_weights) == len(train_df.samples)

print(len(sample_weights) == 10943, "\n")

jackal_indices = [i for i, (_, idx) in enumerate(train_df.samples) if train_df.classes[idx] == "canis_mesomelas"]
print(sample_weights[jackal_indices[0]])

'''

class ResettableDataLoader(DataLoader):
    def reset(self):
        pass  # mosaic-close reset is a no-op for classification; no mosaic augmentation used here

class WeightedClassificationTrainer(ClassificationTrainer):

    def get_dataloader(self, dataset_path, batch_size = 64, rank = 0, mode="train"):
        dataset = self.build_dataset(dataset_path, mode)

        if mode == "train":
            # Compute per-class weights from this specific dataset's actual samples
            class_counts_local = {}
            for _, class_idx, _, _ in dataset.samples:
                species = dataset.base.classes[class_idx]
                class_counts_local[species] = class_counts_local.get(species, 0) + 1

            total_local = sum(class_counts_local.values())
            local_class_weights = {
                species: total_local / count for species, count in class_counts_local.items()
            }

            sample_weights = [
            local_class_weights[dataset.base.classes[class_idx]]
            for _, class_idx, _, _ in dataset.samples
            ]

            sampler = WeightedRandomSampler(
                weights=sample_weights,
                num_samples=len(sample_weights),
                replacement=True

            )

            loader = ResettableDataLoader(
                dataset,
                batch_size = batch_size,
                sampler = sampler,
                num_workers=self.args.workers
            )

        else:
            loader = super().get_dataloader(dataset_path, batch_size, rank, mode)

        return loader



overrides = {
    "model": "yolo11n-cls.pt",
    "data": str(PROJECT_ROOT / "smoke_test"),
    "epochs": 1,
    "batch": 8,
    "device": "mps"
}

trainer = WeightedClassificationTrainer(overrides=overrides)
trainer.setup_model()


train_loader = trainer.get_dataloader(
    dataset_path=str(PROJECT_ROOT / "smoke_test"/ "train"),
    batch_size=8,
    mode="train"
)
class_counts = Counter()

for _ in range(50):
    batch = next(iter(train_loader))
    for cls_idx in batch["cls"].tolist():
        class_counts[cls_idx] += 1

print(class_counts)


