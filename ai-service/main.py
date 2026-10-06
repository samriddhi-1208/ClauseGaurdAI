import os
import uvicorn
from fastapi import FastAPI, HTTPException, status
from fastapi.middleware.cors import CORSMiddleware
from pathlib import Path
from dotenv import load_dotenv

# Ensure ai-service .env is loaded regardless of current working directory
env_path = Path(__file__).resolve().parent / ".env"
if env_path.exists():
    load_dotenv(dotenv_path=env_path)
else:
    load_dotenv()

# Startup Diagnostic Check (never prints the actual key)
gemini_key = os.getenv("GEMINI_API_KEY", "")
is_gemini_configured = bool(gemini_key and gemini_key.strip() and gemini_key != "your_gemini_api_key_here")

if is_gemini_configured:
    print("[AI Service Startup] Gemini API key: configured")
else:
    print("[AI Service Startup] Gemini API key: not configured — heuristic fallback enabled")

from models.schemas import (
    ProcessDocumentRequest, ProcessDocumentResponse, ExtractedClause,
    CompareRequest, CompareResponse, Finding,
    RagChatRequest, RagChatResponse, SourceCitation
)
from services.pdf_processor import extract_pdf_pages, chunk_pages
from services.clause_extractor import extract_clauses_with_gemini
from services.vector_store import index_document_chunks, remove_document_vectors
from services.contradiction_detector import analyze_cross_document_contradictions
from services.rag_engine import answer_rag_question

app = FastAPI(
    title="ClauseGuard AI Service",
    description="Python FastAPI Service for PDF Extraction, Vector Indexing, Clause Extraction, Contradiction Detection, and RAG Chat",
    version="1.0.0"
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.get("/health")
def health_check():
    key = os.getenv("GEMINI_API_KEY", "")
    configured = bool(key and key.strip() and key != "your_gemini_api_key_here")
    return {
        "status": "ok",
        "service": "ClauseGuard Python AI Service",
        "port": int(os.getenv("AI_PORT", 8000)),
        "gemini_status": "configured" if configured else "heuristic_fallback"
    }

@app.post("/process-document", response_model=ProcessDocumentResponse)
def process_document(req: ProcessDocumentRequest):
    try:
        pages = extract_pdf_pages(req.filePath)
        chunks = chunk_pages(pages)
        
        # 1. Vector Indexing
        index_document_chunks(
            userId=req.userId,
            documentId=req.documentId,
            documentName=req.documentName,
            chunks=chunks
        )
        
        # 2. Extract & Categorize Clauses
        full_text = "\n\n".join([p["text"] for p in pages])
        clauses_raw = extract_clauses_with_gemini(full_text, pages)
        
        clauses = [
            ExtractedClause(
                category=c["category"],
                content=c["content"],
                pageNumber=c.get("pageNumber", 1),
                confidence=c.get("confidence", 0.9)
            )
            for c in clauses_raw
        ]
        
        return ProcessDocumentResponse(
            success=True,
            documentId=req.documentId,
            totalPages=len(pages),
            totalClauses=len(clauses),
            clauses=clauses
        )
    except Exception as e:
        print(f"[Process Document Error] {e}")
        raise HTTPException(status_code=500, detail=str(e))

@app.post("/compare-documents", response_model=CompareResponse)
def compare_documents(req: CompareRequest):
    try:
        raw_clauses = [c.dict() for c in req.clauses]
        raw_findings = analyze_cross_document_contradictions(raw_clauses)
        
        findings = [Finding(**f) for f in raw_findings]
        
        return CompareResponse(
            success=True,
            totalFindings=len(findings),
            findings=findings
        )
    except Exception as e:
        print(f"[Compare Documents Error] {e}")
        raise HTTPException(status_code=500, detail=str(e))

@app.post("/rag-chat", response_model=RagChatResponse)
def rag_chat(req: RagChatRequest):
    try:
        result = answer_rag_question(
            userId=req.userId,
            question=req.question,
            documentIds=req.documentIds
        )
        return RagChatResponse(
            answer=result["answer"],
            sources=[SourceCitation(**s) for s in result["sources"]]
        )
    except Exception as e:
        print(f"[RAG Chat Error] {e}")
        raise HTTPException(status_code=500, detail=str(e))

@app.delete("/documents/{userId}/{documentId}")
def delete_document_vectors(userId: str, documentId: str):
    try:
        remove_document_vectors(userId, documentId)
        return {"success": True, "message": "Vectors removed successfully"}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

if __name__ == "__main__":
    port = int(os.getenv("AI_PORT", 8000))
    uvicorn.run("main:app", host="0.0.0.0", port=port, reload=True)
