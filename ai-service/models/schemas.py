from pydantic import BaseModel, Field
from typing import List, Optional, Dict, Any

class ProcessDocumentRequest(BaseModel):
    userId: str
    documentId: str
    documentName: str
    filePath: str

class ExtractedClause(BaseModel):
    category: str
    content: str
    pageNumber: int = 1
    confidence: float = 0.9

class ProcessDocumentResponse(BaseModel):
    success: bool
    documentId: str
    totalPages: int
    totalClauses: int
    clauses: List[ExtractedClause]

class ClauseItem(BaseModel):
    documentId: str
    documentName: str
    category: str
    content: str
    pageNumber: int = 1

class CompareRequest(BaseModel):
    userId: str
    documentIds: List[str]
    clauses: List[ClauseItem]

class Finding(BaseModel):
    category: str
    classification: str # NO_SIGNIFICANT_CONFLICT, POTENTIAL_INCONSISTENCY, POTENTIAL_CONTRADICTION, UNCERTAIN
    riskLevel: str # LOW, MEDIUM, HIGH
    confidence: float
    documentA: Dict[str, Any]
    documentB: Dict[str, Any]
    clauseA: Dict[str, Any]
    clauseB: Dict[str, Any]
    explanation: str
    recommendation: str

class CompareResponse(BaseModel):
    success: bool
    totalFindings: int
    findings: List[Finding]

class RagChatRequest(BaseModel):
    userId: str
    documentIds: Optional[List[str]] = None
    question: str

class SourceCitation(BaseModel):
    documentId: str
    documentName: str
    pageNumber: int
    snippet: str

class RagChatResponse(BaseModel):
    answer: str
    sources: List[SourceCitation]
