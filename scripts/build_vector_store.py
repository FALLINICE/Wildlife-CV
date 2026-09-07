from pathlib import Path
import chromadb

PROJECT_ROOT = Path(__file__).resolve().parent.parent
DATA_DIR = PROJECT_ROOT / "data"

client = chromadb.PersistentClient(
    path=str(DATA_DIR / "vector_store")
)

collection = client.get_or_create_collection(
    name="species_knowledge"
)

collection.delete(where={})   # optional, clears existing docs

species_dir = DATA_DIR / "species_docs"

for file in species_dir.glob("*.txt"):

    species_id = file.stem
    text = file.read_text(encoding="utf-8")

    collection.add(
        ids=[species_id],
        documents=[text]
    )

print(f"Built collection with {collection.count()} documents.")