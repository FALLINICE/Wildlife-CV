import chromadb
from pathlib import Path

PROJECT_ROOT = Path(__file__).resolve().parent.parent.parent 
DATA_DIR = PROJECT_ROOT / "data"
KNOWLEDGE_DIR = PROJECT_ROOT / "data" / "knowledge"


chroma_client = chromadb.PersistentClient(path= str(DATA_DIR / "vector_store"))
collection = chroma_client.get_or_create_collection(name="species_knowledge")

# read each .md file, add to collection using the filename (minus extension) as the ID
for md_file in KNOWLEDGE_DIR.glob("*.md"):
    species_id = md_file.stem  # "canis_mesomelas.md" -> "canis_mesomelas"
    text = md_file.read_text()
    collection.upsert(documents=[text], ids=[species_id])

print(f"Documents in collection: {collection.count()}")

test_queries = [
    "What horns does the gemsbok have?",
    "How do brown hyenas find food?",
    "Why do lions live in groups?",
    "What makes springbok jump so high?",
    "Can Hartmann's zebra climb steep terrain?",
    "What is the conservation status of the black rhino?",
    "Tell me about jackal behavior and social structure.",
    "What do elephants eat?",
    "Why are giraffes vulnerable?",
    "How fast can an ostrich run?",
]

for q in test_queries:
    results = collection.query(query_texts=[q], n_results=1)
    print(f"Query: {q}")
    print(f"  Top match: {results['ids'][0][0]} (distance={results['distances'][0][0]:.4f})")

tricky_query = "Which African animals are threatened by poaching?"
results = collection.query(query_texts=[tricky_query], n_results=3)
print(f"Query: {tricky_query}")
for doc_id, distance in zip(results["ids"][0], results["distances"][0]):
    print(f"  {doc_id} (distance={distance:.4f})")