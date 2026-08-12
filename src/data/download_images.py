"""
import os
import time
import requests
import pandas as pd
from pathlib import Path
from urllib.parse import quote
from tqdm import tqdm


PROJECT_ROOT = Path(__file__).resolve().parent.parent.parent
manifest_path = PROJECT_ROOT/"data"/"processed"/"manifest_metadata.csv"
df = pd.read_csv(manifest_path)



BASE_URL = "https://storage.googleapis.com/public-datasets-lila/desert-lion-camera-traps/annotated-imgs/"
SAVE_ROOT = Path(PROJECT_ROOT/"data"/"raw"/"images")
MAX_RETRIES = 3

SAVE_ROOT.mkdir(parents = True, exist_ok = True)
failed_downloads = []

for row in tqdm(df.itertuples(), total=len(df)):
    file_name = row.image_id
    species = row.species

    encoded_path = quote(file_name, safe="/")
    url = BASE_URL + encoded_path

    species_folder = SAVE_ROOT / species.lower().replace(" ", "_")
    species_folder.mkdir(parents=True, exist_ok=True)
    local_filename = os.path.basename(file_name)
    save_path = species_folder / local_filename


    if save_path.exists():
        continue

    success = False

    for attempt in range(MAX_RETRIES):
        try:
            response = requests.get(url, timeout=15)
            if response.status_code == 200:
                with open(save_path, "wb") as f:
                    f.write(response.content)
                success = True
                break
            else:
                time.sleep(1)

        except requests.exceptions.RequestException:
            time.sleep(1)

    if not success:
        failed_downloads.append(file_name)

with open(PROJECT_ROOT/"data"/"raw"/'failed_downloads.txt', "w") as f:
    f.write("\n".join(failed_downloads))

print(f"Done. {len(failed_downloads)} failed out of {len(df)}.")

"""
import os
import time
import requests
import pandas as pd
from pathlib import Path
from urllib.parse import quote
from tqdm import tqdm
from concurrent.futures import ThreadPoolExecutor, as_completed

PROJECT_ROOT = Path(__file__).resolve().parent.parent.parent
manifest_path = PROJECT_ROOT / "data" / "processed" / "manifest_metadata.csv"
df = pd.read_csv(manifest_path)

BASE_URL = "https://storage.googleapis.com/public-datasets-lila/desert-lion-camera-traps/annotated-imgs/"
SAVE_ROOT = Path(PROJECT_ROOT / "data" / "raw" / "images")
MAX_RETRIES = 3
MAX_WORKERS = 12  # how many downloads run at once

SAVE_ROOT.mkdir(parents=True, exist_ok=True)


def download_one(file_name, species):
    encoded_path = quote(file_name, safe="/")
    url = BASE_URL + encoded_path

    species_folder = SAVE_ROOT / species.lower().replace(" ", "_")
    species_folder.mkdir(parents=True, exist_ok=True)
    save_path = species_folder / os.path.basename(file_name)

    if save_path.exists():
        return None  # already done, skip

    for attempt in range(MAX_RETRIES):
        try:
            response = requests.get(url, timeout=15)
            if response.status_code == 200:
                with open(save_path, "wb") as f:
                    f.write(response.content)
                return None
            time.sleep(1)
        except requests.exceptions.RequestException:
            time.sleep(1)

    return file_name  # only reached if all retries failed


failed_downloads = []                         
tasks = list(zip(df["image_id"], df["species"]))

with ThreadPoolExecutor(max_workers=MAX_WORKERS) as executor:
    futures = [executor.submit(download_one, fn, sp) for fn, sp in tasks]
    for future in tqdm(as_completed(futures), total=len(futures)):
        result = future.result()
        if result is not None:
            failed_downloads.append(result)

with open(PROJECT_ROOT / "data" / "raw" / "failed_downloads.txt", "w") as f:
    f.write("\n".join(failed_downloads))

print(f"Done. {len(failed_downloads)} failed out of {len(df)}.")
