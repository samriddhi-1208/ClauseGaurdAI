import os
import math
from typing import List, Dict, Any, Optional

class LocalVectorStore:
    """Lightweight in-memory vector store with User ID metadata filtering fallback."""
    def __init__(self):
        self.store: List[Dict[str, Any]] = []

    def add_chunks(self, userId: str, documentId: str, documentName: str, chunks: List[Dict[str, Any]]):
        # Remove previous chunks for this documentId
        self.store = [item for item in self.store if item["documentId"] != documentId]
        
        for c in chunks:
            self.store.append({
                "userId": userId,
                "documentId": documentId,
                "documentName": documentName,
                "pageNumber": c["pageNumber"],
                "chunkId": c["chunkId"],
                "content": c["content"],
                "tokens": set(c["content"].lower().split())
            })

    def search(self, userId: str, query: str, documentIds: Optional[List[str]] = None, top_k: int = 4) -> List[Dict[str, Any]]:
        query_tokens = set(query.lower().split())
        results = []
        
        for item in self.store:
            # Enforce strict user isolation
            if item["userId"] != userId:
                continue
            if documentIds and item["documentId"] not in documentIds:
                continue
                
            # Jaccard / token overlap scoring fallback
            overlap = len(query_tokens.intersection(item["tokens"]))
            score = overlap / max(len(query_tokens), 1)
            
            results.append({
                "documentId": item["documentId"],
                "documentName": item["documentName"],
                "pageNumber": item["pageNumber"],
                "content": item["content"],
                "score": score
            })
            
        results.sort(key=lambda x: x["score"], reverse=True)
        return results[:top_k]

    def delete_document(self, userId: str, documentId: str):
        self.store = [item for item in self.store if not (item["userId"] == userId and item["documentId"] == documentId)]

# Global vector store instance
vector_db = LocalVectorStore()

from pathlib import Path

# Deterministic persistent storage directory
CHROMA_DATA_DIR = Path(__file__).resolve().parent.parent / "chroma_db"

try:
    import chromadb
    from chromadb.config import Settings
    
    # Ensure persistent storage directory exists
    CHROMA_DATA_DIR.mkdir(parents=True, exist_ok=True)
    
    # Initialize persistent ChromaDB client
    chroma_client = chromadb.PersistentClient(
        path=str(CHROMA_DATA_DIR),
        settings=Settings(anonymized_telemetry=False)
    )
    collection = chroma_client.get_or_create_collection(name="clauseguard_contracts")
    HAS_CHROMADB = True
    print(f"[ChromaDB Initialization] Persistent vector store active at: {CHROMA_DATA_DIR}")
except Exception as e:
    print(f"[ChromaDB Error] ChromaDB persistent client failed to initialize ({e}). Falling back to LocalVectorStore engine.")
    HAS_CHROMADB = False

def index_document_chunks(userId: str, documentId: str, documentName: str, chunks: List[Dict[str, Any]]):
    """Index document chunks into vector database with metadata user isolation."""
    if HAS_CHROMADB:
        try:
            ids = [f"{documentId}_{c['chunkId']}" for c in chunks]
            documents = [c["content"] for c in chunks]
            metadatas = [
                {
                    "userId": userId,
                    "documentId": documentId,
                    "documentName": documentName,
                    "pageNumber": c["pageNumber"]
                }
                for c in chunks
            ]
            collection.upsert(ids=ids, documents=documents, metadatas=metadatas)
        except Exception as err:
            print(f"[ChromaDB Upsert Warning] {err}")
            
    # Always keep local fallback store updated
    vector_db.add_chunks(userId, documentId, documentName, chunks)

def search_chunks(userId: str, query: str, documentIds: Optional[List[str]] = None, top_k: int = 4) -> List[Dict[str, Any]]:
    """Search relevant chunks for RAG or contradiction candidate matching."""
    if HAS_CHROMADB:
        try:
            where_clause = {"userId": userId}
            if documentIds and len(documentIds) == 1:
                where_clause = {"$and": [{"userId": userId}, {"documentId": documentIds[0]}]}
            elif documentIds and len(documentIds) > 1:
                where_clause = {"$and": [{"userId": userId}, {"documentId": {"$in": documentIds}}]}
                
            res = collection.query(query_texts=[query], n_results=top_k, where=where_clause)
            if res and res["documents"] and len(res["documents"][0]) > 0:
                results = []
                for i in range(len(res["documents"][0])):
                    doc_text = res["documents"][0][i]
                    meta = res["metadatas"][0][i]
                    results.append({
                        "documentId": meta["documentId"],
                        "documentName": meta["documentName"],
                        "pageNumber": meta["pageNumber"],
                        "content": doc_text,
                        "score": 0.9 - (i * 0.05)
                    })
                return results
        except Exception as e:
            print(f"[ChromaDB Query Warning] {e}, using local vector search.")
            
    return vector_db.search(userId, query, documentIds, top_k)

def remove_document_vectors(userId: str, documentId: str):
    """Remove vectors belonging to deleted document."""
    if HAS_CHROMADB:
        try:
            collection.delete(where={"$and": [{"userId": userId}, {"documentId": documentId}]})
        except Exception as e:
            print(f"[ChromaDB Delete Warning] {e}")
    vector_db.delete_document(userId, documentId)
