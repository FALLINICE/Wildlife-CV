import chromadb
from pathlib import Path

PROJECT_ROOT = Path(__file__).resolve().parent.parent.parent
DATA_DIR = PROJECT_ROOT / "data"

_client = None
_collection = None

def get_collection():
    """
    Returns the chroma collection, collecting once and reusing the connection on 
    subsequent calls rather the reconnecting every time.

    """

    global _client, _collection

    if _collection is None:
        _client = chromadb.PersistentClient(path=str(DATA_DIR / "vector_store"))
        _collection = _client.get_or_create_collection(name="species_knowledge")
    return _collection

def get_species_knowledge(species_id: str) -> str | None:
    """
    Retrieves the knowledge document for a given species by exact ID lookup 
    (not semantic search), appropriate since the classifier already provides the 
    exact species identity, with no ambiguity to resolve.

    Returns the document text, or None if no matching document exists 
    (should not occur in normal operation, since all 10 trained classes have 
    a corresponding document, but handled defensively in case the classifier's
    classes and the knowledge base ever fall out of sync)

    """

    collection = get_collection()

    result = collection.get(ids=[species_id])

    if not result["documents"]:
        return None

    return result["documents"][0]


if __name__ == "__main__":

    test_species = "diceros_bicornis"
    text = get_species_knowledge(test_species)
    if text:
        print(f"Retrieved document for {test_species}:\n{text[:200]}...")
    else:
        print(f"No document forund for {test_species}")

