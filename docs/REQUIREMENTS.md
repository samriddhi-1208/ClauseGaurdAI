# ClauseGuard AI — System Requirements & Traceability

This document details the functional and non-functional requirements of ClauseGuard AI and provides a traceability matrix mapping each requirement directly to its implementing codebase components.

---

## 1. Functional Requirements

### 1.1 Core MVP Capabilities (Primary Value Proposition)
ClauseGuard AI is fundamentally a contract risk and contradiction intelligence engine. Its core requirements are:

- **FR-01: Multi-Format Document Ingestion**: The system must ingest and parse legal contracts in `.pdf`, `.docx`, and `.txt` formats up to 25 MB, extracting text while maintaining page and paragraph structures.
- **FR-02: Semantic Text Chunking**: Ingested contracts must be split into overlapping chunks (1,000 characters, 200-character overlap) to preserve contextual boundaries.
- **FR-03: Vector Indexing & Persistence**: Text chunks must be converted into embeddings and stored in a persistent on-disk vector store (`ChromaDB`), segregated by user and document ID.
- **FR-04: Clause Extraction & Classification**: The system must segment contract text into individual clauses and categorize them into 10 legal taxonomy categories (`PAYMENT`, `CONFIDENTIALITY`, `TERMINATION`, `LIABILITY`, `DATA_PRIVACY`, `DATA_RETENTION`, `DATA_STORAGE`, `JURISDICTION`, `INTELLECTUAL_PROPERTY`, `OTHER`).
- **FR-05: Pairwise Cross-Document Matching**: The system must pair clauses from distinct documents that share the same legal category for comparative analysis.
- **FR-06: Semantic Contradiction Detection**: The system must evaluate clause pairs to detect direct conflicts, inconsistencies, alignment, or ambiguity.
- **FR-07: Risk Severity Classification**: Detected conflicts must be rated as `HIGH`, `MEDIUM`, or `LOW` risk based on legal exposure and operational liability.
- **FR-08: Explanation & Actionable Recommendation**: Every flagged finding must include a clear explanation of why the terms conflict and an actionable recommendation to reconcile them.
- **FR-09: Deterministic Heuristic Fallback**: In the event that the external LLM is offline, unconfigured, or rate-limited, the system must execute local rule-based heuristics for clause extraction and contradiction detection.

---

### 1.2 Supporting Platform Capabilities

- **FR-10: User Identity & Authentication**: The platform must support secure user registration, password hashing via bcrypt, and stateless JWT token authentication.
- **FR-11: Document Management**: Users must be able to view uploaded documents, check their processing status, inspect extracted clauses, and delete documents.
- **FR-12: Analysis Session Management**: Users must be able to select 2 or more contracts, trigger a multi-document analysis, and view historical analysis reports.
- **FR-13: Grounded Contract QA (RAG)**: Users must be able to ask natural language questions against uploaded contracts and receive answers strictly grounded in retrieved text chunks with exact page citations.

---

## 2. Non-Functional Requirements

- **NFR-01: Tenant Isolation & IDOR Protection**: The system must prevent unauthorized cross-tenant data access by strictly scoping every database and vector query to the authenticated `userId`.
- **NFR-02: File Upload Defense-in-Depth**: The system must enforce a 25 MB ceiling, validate MIME types and file extensions, blacklist executable extensions, and neutralize path traversal attempts.
- **NFR-03: Network & Header Security**: The system must enforce Helmet HTTP security headers, CORS origin whitelisting, and IP-based rate limiting on sensitive routes.
- **NFR-04: Graceful Degradation & Resilience**: The system must gracefully handle AI outages without returning fake mock data and handle database outages via an automatic local JSON persistence layer.
- **NFR-05: Professional LegalTech UX**: The interface must adhere to professional LegalTech standards: clean typography, clear risk indicators, responsive layouts, and zero placeholder emojis.

---

## 3. Requirements Traceability Matrix

| Requirement ID | Description | Primary Implementing Files | Verification Mechanism |
|---|---|---|---|
| **FR-01** | Multi-Format Ingestion (PDF, DOCX, TXT) | `server/middleware/uploadMiddleware.js`<br>`ai-service/services/pdf_processor.py` | Upload test with .pdf, .docx, and .txt files |
| **FR-02** | Semantic Text Chunking (1000/200) | `ai-service/services/pdf_processor.py` | Verify chunk lengths and 200-char overlap |
| **FR-03** | Vector Indexing & ChromaDB Persistence | `ai-service/services/vector_store.py` | Restart AI service and confirm vectors persist |
| **FR-04** | Clause Extraction (10 Categories) | `ai-service/services/clause_extractor.py`<br>`server/models/Clause.js` | Inspect categorized clauses in database |
| **FR-05** | Pairwise Cross-Document Matching | `ai-service/services/contradiction_detector.py` | Verify comparison loops only pair distinct documents |
| **FR-06** | Contradiction Detection | `ai-service/services/contradiction_detector.py` | Validate classification states in analysis output |
| **FR-07** | Risk Severity Classification | `ai-service/services/contradiction_detector.py`<br>`server/models/Contradiction.js` | Confirm HIGH/MEDIUM/LOW badges in UI and DB |
| **FR-08** | Explanation & Recommendation | `ai-service/services/contradiction_detector.py` | Verify explanation & recommendation text fields |
| **FR-09** | Deterministic Heuristic Fallback | `ai-service/services/clause_extractor.py`<br>`ai-service/services/contradiction_detector.py` | Unset GEMINI_API_KEY and run analysis |
| **FR-10** | User Auth (JWT & Bcrypt) | `server/controllers/authController.js`<br>`server/middleware/authMiddleware.js` | Register, login, and verify JWT token payload |
| **FR-11** | Document Management | `server/controllers/documentController.js`<br>`client/src/pages/Dashboard.jsx` | Upload and delete documents through UI |
| **FR-12** | Analysis Session Management | `server/controllers/analysisController.js`<br>`client/src/pages/Analysis.jsx` | Trigger analysis and review findings dashboard |
| **FR-13** | Grounded Contract QA (RAG) | `ai-service/services/rag_engine.py`<br>`client/src/pages/Chat.jsx` | Query contract and inspect snippet citations |
| **NFR-01** | IDOR / Tenant Isolation | `server/controllers/*`<br>`ai-service/services/vector_store.py` | Attempt querying cross-user document IDs |
| **NFR-02** | File Upload Security (25MB, Whitelist) | `server/routes/documentRoutes.js`<br>`server/middleware/uploadMiddleware.js` | Upload 30MB file and .exe file; verify rejection |
| **NFR-03** | Helmet, CORS, & Rate Limiting | `server/server.js` | Inspect HTTP response headers and rapid auth calls |
| **NFR-04** | Dual-Persistence & Fallback | `server/config/dbFallback.js`<br>`server/services/aiService.js` | Stop MongoDB; confirm local fallback activation |
| **NFR-05** | Professional LegalTech UI | `client/src/index.css`<br>`client/src/pages/*` | Frontend production build and visual inspection |
