import os
import json
from typing import List, Dict, Any, Optional
from services.vector_store import search_chunks

def answer_rag_question(userId: str, question: str, documentIds: Optional[List[str]] = None) -> Dict[str, Any]:
    """
    RAG Workflow:
    1. Retrieve relevant document chunks from ChromaDB vector store filtered by User ID.
    2. Pass retrieved context + question to Gemini API.
    3. Generate grounded response strictly based on provided document content.
    4. Include source document & page citations.
    """
    chunks = search_chunks(userId=userId, query=question, documentIds=documentIds, top_k=4)
    
    if not chunks or all(c.get("score", 0) < 0.05 for c in chunks):
        return {
            "answer": "I could not find sufficient information in the uploaded documents to answer this question.",
            "sources": []
        }

    sources = []
    context_blocks = []
    
    for c in chunks:
        sources.append({
            "documentId": c["documentId"],
            "documentName": c["documentName"],
            "pageNumber": c["pageNumber"],
            "snippet": c["content"][:150] + "..."
        })
        context_blocks.append(f"[Document: {c['documentName']}, Page {c['pageNumber']}]\n{c['content']}")

    context_str = "\n\n---\n\n".join(context_blocks)
    
    api_key = os.getenv("GEMINI_API_KEY", "")
    
    if api_key and api_key != "your_gemini_api_key_here":
        try:
            from google import genai
            client = genai.Client(api_key=api_key)
            
            prompt = f"""
You are ClauseGuard AI Legal Assistant. Answer the user's question STRICTLY based on the provided document excerpts.
Do not use outside general legal knowledge. If the provided document excerpts do not contain enough information to answer the question, state:
"I could not find sufficient information in the uploaded documents to answer this question."

DOCUMENT CONTEXT:
{context_str}

USER QUESTION:
{question}

Formulate a concise, clear legal intelligence response citing the document names and page numbers where appropriate:
"""
            response = client.models.generate_content(
                model='gemini-2.5-flash',
                contents=prompt,
            )
            answer = response.text.strip()
            return {
                "answer": answer,
                "sources": sources
            }
        except Exception as e:
            print(f"[Gemini RAG Notice] API call failed: {e}. Using fallback context grounded answer.")

    # Fallback RAG response generation using extracted context
    answer_summary = f"Based on the uploaded documents ({', '.join(set([s['documentName'] for s in sources]))}):\n\n"
    answer_summary += f"{chunks[0]['content']}\n\n"
    if len(chunks) > 1:
        answer_summary += f"Additionally, page {chunks[1]['pageNumber']} of {chunks[1]['documentName']} notes: {chunks[1]['content'][:200]}..."
        
    return {
        "answer": answer_summary,
        "sources": sources
    }
