# ClauseGuard AI — AI & RAG Pipeline Specification

This document provides a detailed technical specification of the artificial intelligence, natural language processing, vector retrieval, and contradiction detection pipelines powering ClauseGuard AI.

---

## 1. Pipeline Overview

The AI service operates as a multi-stage deterministic and generative pipeline:

```
Document Upload (PDF / DOCX / TXT)
      │
      ▼
[ Stage 1: Document Parsing & Text Normalization ]
      │  - PyMuPDF (PDF)
      │  - python-docx (DOCX)
      │  - Native UTF-8 (TXT)
      │
      ├───► [ Stage 2: Recursive Text Chunking ]
      │       - chunk_size = 1000 characters
      │       - chunk_overlap = 200 characters
      │       - Metadata: userId, documentId, pageNumber
      │       │
      │       ▼
      │     [ Stage 3: Vector Indexing & ChromaDB ]
      │       - PersistentClient: ./chroma_db
      │       - Collection: clauseguard_contracts
      │       - Isolated tenant metadata filtering
      │
      ▼
[ Stage 4: Clause Extraction & Classification ]
      - Model: Google Gemini 2.5 Flash
      - 10 Discrete Legal Taxonomy Categories
      - Fallback: Regex Keyword Classifier
      │
      ▼
[ Stage 5: Cross-Document Contradiction Detection ]
      - Category-based Pairwise Cross-Document Matching
      - Semantic Evaluation (Gemini 2.5 Flash)
      - Classifications: CONTRADICTION | INCONSISTENCY | NO_CONFLICT | UNCERTAIN
      - Risk Levels: HIGH | MEDIUM | LOW
      - Fallback: Deterministic Legal Rule Engine
      │
      ▼
[ Stage 6: Grounded Contract QA (RAG) ]
      - Top-k = 4 Dense Vector Retrieval
      - Context Grounding Prompt (Zero Hallucination Tolerance)
      - Structured Citation Output ({ documentId, documentName, pageNumber, snippet })
```

---

## 2. Stage 1: Document Ingestion and Parsing

Located in: `ai-service/services/pdf_processor.py`

ClauseGuard AI handles three enterprise document formats with format-specific extractors:

| Format | Extractor Engine | Strategy & Handling |
|---|---|---|
| **PDF** (`.pdf`) | PyMuPDF (`fitz`) | Iterates across all pages, extracting text blocks while recording page numbers. Strips extraneous whitespace, headers, and footers. |
| **DOCX** (`.docx`) | `python-docx` (`docx.Document`) | Iterates across paragraphs and tables. Synthesizes virtual page numbers every ~3,000 characters to ensure downstream citation compatibility. |
| **TXT** (`.txt`) | Built-in Python I/O | Decodes UTF-8 and latin-1 text. Synthesizes virtual page numbers every ~3,000 characters. |

---

## 3. Stage 2: Recursive Character Chunking

Located in: `ai-service/services/pdf_processor.py`

Text extracted from documents is segmented into overlapping semantic chunks using LangChain's `RecursiveCharacterTextSplitter`:
- **`chunk_size`**: `1000` characters
- **`chunk_overlap`**: `200` characters
- **Separators**: `["\n\n", "\n", ". ", " ", ""]`
- **Metadata attached per chunk**:
  ```python
  {
      "chunk_id": f"{document_id}_p{page}_{chunk_idx}",
      "document_id": document_id,
      "user_id": user_id,
      "page_number": page_num,
      "text": chunk_text
  }
  ```

The 200-character overlap prevents sentences and legal definitions from being severed at chunk boundaries, ensuring complete contextual capture during embedding.

---

## 4. Stage 3: Vector Storage & Indexing

Located in: `ai-service/services/vector_store.py`

### 4.1 ChromaDB Configuration
- **Storage Type**: Persistent disk storage (`chromadb.PersistentClient(path="./chroma_db")`).
- **Collection Name**: `clauseguard_contracts`.
- **Tenant Isolation**: Every vector query enforces multi-tenant metadata filtering:
  ```python
  where_filter = {
      "$and": [
          {"userId": user_id},
          {"documentId": document_id}
      ]
  }
  ```
- **Top-K Retrieval**: `top_k = 4` nearest neighbors returned for grounded QA.

### 4.2 Local In-Memory Fallback
If ChromaDB encounters initialization or environment constraints, `vector_store.py` contains a self-contained in-memory cosine similarity fallback store. This guarantees that developer workstations and testing environments function without process termination.

---

## 5. Stage 4: Clause Extraction & Classification

Located in: `ai-service/services/clause_extractor.py`

### 5.1 Legal Taxonomy (10 Categories)
Every extracted contractual clause is categorized into one of ten strictly defined legal classifications:
1. `PAYMENT` — Compensation, invoicing intervals, billing terms, late fees, interest penalties.
2. `CONFIDENTIALITY` — Proprietary data protection, non-disclosure durations, trade secret survival periods.
3. `TERMINATION` — Notice periods, termination for cause/convenience, curing intervals.
4. `LIABILITY` — Limitation of liability, indemnification obligations, consequential damage waivers, aggregate liability caps.
5. `DATA_PRIVACY` — GDPR/CCPA compliance, sub-processor permissions, privacy controls.
6. `DATA_RETENTION` — Information archiving schedules, data return, post-termination destruction timelines.
7. `DATA_STORAGE` — Geographic residency requirements, cloud hosting restrictions, cross-border transfers.
8. `JURISDICTION` — Governing law, dispute resolution venues, arbitration mechanisms.
9. `INTELLECTUAL_PROPERTY` — Pre-existing IP rights, work-for-hire ownership, licensing scope.
10. `OTHER` — General boilerplate, severability, force majeure, assignment provisions.

### 5.2 Extraction Engine
- **Primary Engine**: Google Gemini 2.5 Flash via structured system instructions requesting a JSON array of `{ category, content, pageNumber, confidence }`.
- **Heuristic Fallback Engine**: If Gemini is unreachable or unconfigured, a deterministic regex keyword engine analyzes paragraph structures:
  - Searches for keywords (e.g., `"pay"`, `"invoice"`, `"net 30"`, `"confidential"`, `"terminate"`, `"indemnify"`, `"governing law"`, `"gdpr"`).
  - Assigns confidence scores (`0.75`–`0.85`) and preserves exact document page numbers.

---

## 6. Stage 5: Cross-Document Contradiction Detection

Located in: `ai-service/services/contradiction_detector.py`

### 6.1 Pairwise Cross-Document Matching
Contradiction analysis compares clauses between distinct documents within matching legal categories:
```
Document A (e.g. Master Services Agreement) ─── Clause (LIABILITY)
                                                    │
                                                    ▼ Pairwise Compare
Document B (e.g. Statement of Work 01)     ─── Clause (LIABILITY)
```

Only cross-document pairs within the same category are evaluated, preventing noisy comparisons (e.g., comparing a Payment clause against an IP clause).

### 6.2 Classification Schema
Each evaluated pair receives one of four classifications:
- `POTENTIAL_CONTRADICTION`: Direct mutual exclusivity (e.g., Doc A specifies 30-day termination notice; Doc B specifies immediate termination without notice).
- `POTENTIAL_INCONSISTENCY`: Divergent or ambiguous operational requirements (e.g., Doc A requires 5-year confidentiality; Doc B requires 2-year confidentiality).
- `NO_SIGNIFICANT_CONFLICT`: Harmonious or mutually consistent contractual terms.
- `UNCERTAIN`: Insufficient contextual detail to assess definitively without extrinsic evidence.

### 6.3 Risk Ratings
- `HIGH`: Direct financial or severe legal exposure (e.g., unlimited liability conflict, uncapped indemnification, conflicting governing laws).
- `MEDIUM`: Operational discrepancies (e.g., misaligned notice periods, contradictory audit rights).
- `LOW`: Minor phrasing differences or ambiguous non-critical definitions.

### 6.4 Deterministic Heuristic Fallback Rules
If LLM reasoning is offline, the deterministic rule engine executes domain-specific heuristics:
- **Payment Terms**: Detects conflicting payment windows (e.g., `Net 30` vs `Net 60`).
- **Confidentiality Durations**: Detects conflicting survival periods (e.g., `2 years` vs `5 years` vs `indefinite`).
- **Liability Caps**: Detects conflicts between capped (e.g., `12 months fees`) and uncapped provisions.
- **Notice Periods**: Flags discrepancies in termination notice intervals (e.g., `30 days` vs `90 days`).
- **Jurisdictions**: Flags conflicting governing states or forums (e.g., `State of New York` vs `State of California`).

---

## 7. Stage 6: Grounded Contract QA (RAG)

Located in: `ai-service/services/rag_engine.py`

### 7.1 Retrieval Workflow
1. User submits a question targeting a specific document or entire contract workspace.
2. The vector store conducts a similarity search returning the top 4 most relevant chunks (`top_k = 4`), strictly scoped by `userId` and `documentId`.
3. If no vector store results exist, the engine conducts a fallback textual search against the extracted clauses.

### 7.2 Strict Grounding System Prompt
The LLM is provided with the retrieved chunks and constrained with instructions:
- *Only answer based on the provided contract context.*
- *If the answer is not present in the text, explicitly respond that the contract does not specify the information.*
- *Do not extrapolate, assume industry standard practices, or fabricate clause numbers.*
- *Return citations containing document ID, document name, page number, and the exact text snippet referenced.*

### 7.3 Structured Citation Format
```json
{
  "answer": "The Master Services Agreement limits total liability to the aggregate fees paid in the prior twelve (12) months, excluding breaches of confidentiality.",
  "citations": [
    {
      "documentId": "651a2f9b8c...",
      "documentName": "MSA_Vendor_2026.pdf",
      "pageNumber": 7,
      "snippet": "In no event shall either party's aggregate liability exceed the total fees paid hereunder during the twelve (12) month period..."
    }
  ],
  "engine": "gemini-2.5-flash"
}
```
