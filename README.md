# ClauseGuard AI

> **AI-Powered Legal Contract Intelligence & Cross-Document Contradiction Detection Platform**

ClauseGuard AI is an automated LegalTech contract intelligence platform designed to analyze multiple legal documents (e.g., Master Services Agreements, Statements of Work, Non-Disclosure Agreements, Service Level Agreements) and detect direct contradictions, operational inconsistencies, and risk exposure across related clauses.

---

## Technical Documentation Index

Detailed architectural and engineering documentation is available in the [`docs/`](docs/) directory:

| Document | Description |
|---|---|
| [System Architecture](docs/ARCHITECTURE.md) | High-level system architecture, service responsibilities, data flow sequence diagram, and resilience strategy. |
| [Architecture Patterns](docs/ARCHITECTURE_PATTERNS.md) | Layered architecture, Client-Server model, Modular Service-Oriented design, MVC separation, and SOLID principles. |
| [AI & RAG Pipeline](docs/AI_PIPELINE.md) | Ingestion (PDF/DOCX/TXT), recursive chunking (1000/200), persistent ChromaDB, 10 legal categories, pairwise matching, and grounded RAG citations. |
| [Database & Persistence](docs/DATABASE.md) | MongoDB schemas, indexes, relational entity model, local JSON fallback store, and comparison with ChromaDB. |
| [Security Architecture](docs/SECURITY.md) | JWT auth, IDOR/BOLA tenant isolation, 25MB upload validation, MIME whitelisting, Helmet headers, CORS policies, and rate limiting. |
| [API Specification](docs/API.md) | Full endpoint reference for the Node.js Express Gateway and the internal Python FastAPI AI Service. |
| [Project Structure](docs/PROJECT_STRUCTURE.md) | Complete directory tree layout and module breakdowns across client, server, and AI service. |
| [Technology Stack](docs/TECH_STACK.md) | Matrix of all technologies, libraries, and frameworks with 1-sentence architectural rationales. |
| [Requirements & Traceability](docs/REQUIREMENTS.md) | Functional MVP vs supporting features, non-functional criteria, and codebase traceability matrix. |
| [Production Deployment](docs/DEPLOYMENT.md) | Architecture, deployment order, environment variables, persistent volumes, health checks, and troubleshooting. |
| [Interview & Defense Prep](docs/INTERVIEW_PREPARATION.md) | 52 comprehensive viva/interview questions, 2-3 minute presentation script, demo flow, and roadmap. |

---

## Core Capabilities

1. **Multi-Format Contract Ingestion (PDF, DOCX, TXT)**
   - High-fidelity text extraction via PyMuPDF (`fitz`) and `python-docx`.
   - Layout and page awareness with synthetic pagination for unpaginated text.
   - Strict 25 MB size limits, MIME type verification, and path traversal defense.

2. **Automated Clause Extraction & Taxonomy Classification**
   - Automatically classifies contractual provisions into 10 discrete legal categories:
     - `PAYMENT`, `CONFIDENTIALITY`, `TERMINATION`, `LIABILITY`, `DATA_PRIVACY`, `DATA_RETENTION`, `DATA_STORAGE`, `JURISDICTION`, `INTELLECTUAL_PROPERTY`, and `OTHER`.
   - Powered by Google Gemini 2.5 Flash with an integrated deterministic regex keyword fallback.

3. **Cross-Document Contradiction Engine (Core Value Proposition)**
   - Performs category-bounded pairwise comparisons across distinct contracts.
   - Assigns objective classifications: `POTENTIAL_CONTRADICTION`, `POTENTIAL_INCONSISTENCY`, `NO_SIGNIFICANT_CONFLICT`, or `UNCERTAIN`.
   - Calculates operational and financial risk ratings: `HIGH`, `MEDIUM`, or `LOW`.
   - Provides plain-language explanations of legal exposure alongside concrete harmonization recommendations.
   - Features deterministic heuristic rules for offline operation (e.g., payment terms, confidentiality survival periods, liability caps).

4. **Grounded Legal Assistant (RAG)**
   - Semantic retrieval using persistent disk-backed ChromaDB vector storage (`top_k = 4`).
   - Tenant-isolated vector search scoped strictly to the user and target document.
   - Generates answers strictly grounded in retrieved contractual text, complete with document name, page number, and source snippet citations.

---

## High-Level Architecture

```
[ Web Browser Client (React / Vite) ]
             │
             │ HTTPS / REST / JWT Bearer
             ▼
[ Node.js / Express API Gateway ] ────────── [ MongoDB / Mongoose ]
             │                                (Users, Documents, Analyses, Fallback JSON)
             │ Internal HTTP REST
             ▼
[ Python / FastAPI AI Service ]
             ├── [ Recursive Character Chunking (1000 / 200) ]
             ├── [ Persistent ChromaDB Vector Store (./chroma_db) ]
             └── [ Google Gemini 2.5 Flash / Deterministic Heuristic Engine ]
```

---

## Quick Start Guide

### Prerequisites
- **Node.js**: v18+
- **Python**: v3.10+
- **MongoDB**: Optional (automatic local JSON persistence fallback activates if MongoDB is offline)
- **Google Gemini API Key**: Optional (deterministic heuristic rules activate if key is omitted)

### 1. Environment Configuration

```bash
# Server configuration: server/.env
PORT=5000
MONGO_URI=mongodb://127.0.0.1:27017/clauseguard
JWT_SECRET=clauseguard_secure_jwt_secret_key_2026
AI_SERVICE_URL=http://127.0.0.1:8000
CLIENT_URL=http://localhost:5173

# AI service configuration: ai-service/.env
PORT=8000
GEMINI_API_KEY=your_gemini_api_key_here
```

### 2. Launching the Python AI Service

```bash
cd ai-service
python -m venv venv

# Windows:
venv\Scripts\activate
# macOS/Linux:
source venv/bin/activate

pip install -r requirements.txt
python main.py
```
*FastAPI service runs at `http://localhost:8000`*

### 3. Launching the Node.js API Gateway

```bash
cd server
npm install
npm run dev
```
*Express gateway runs at `http://localhost:5000`*

### 4. Launching the React Client

```bash
cd client
npm install
npm run dev
```
*Frontend runs at `http://localhost:5173`*

---

## Testing Cross-Document Contradiction Analysis

1. Open `http://localhost:5173` and register a new account.
2. Navigate to the **Upload** page and upload two contracts (e.g., an MSA and an SOW).
3. Navigate to **Analysis**, select both contracts, and click **Start Cross-Document Analysis**.
4. Review the generated contradiction findings, risk severity badges, clause side-by-side comparisons, and legal recommendations.
5. Navigate to **AI Assistant** to query specific clauses with grounded page-level citations.

---

## License

This project is licensed under the MIT License.
