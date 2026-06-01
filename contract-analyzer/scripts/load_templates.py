from qdrant_client import QdrantClient
from sentence_transformers import SentenceTransformer
from qdrant_client.models import Distance, VectorParams, PointStruct

client = QdrantClient("localhost", port=6333)

model = SentenceTransformer(
    "sentence-transformers/all-MiniLM-L6-v2"
)

client.recreate_collection(
    collection_name="contract_templates",
    vectors_config=VectorParams(
        size=384,
        distance=Distance.COSINE
    )
)

clauses = [
    "Confidentiality obligations shall survive for two years after termination.",
    "Either party may terminate with thirty days notice.",
    "Intellectual property belongs to employer."
]

points = []

for idx, clause in enumerate(clauses):
    vector = model.encode(clause).tolist()

    points.append(
        PointStruct(
            id=idx,
            vector=vector,
            payload={"text": clause}
        )
    )

client.upsert(
    collection_name="contract_templates",
    points=points
)

print("Templates Loaded")