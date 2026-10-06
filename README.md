# ⚖️ ClauseGuard AI
> **AI-Powered Legal Contract Intelligence & Cross-Document Contradiction Detection System**

ClauseGuard AI is an advanced LegalTech web application that allows legal teams, risk managers, and business operators to upload multiple legal contracts, automatically extract and categorize clauses, perform semantic search, detect cross-document contradictions & inconsistencies, and converse with legal documents via grounded RAG AI.

---

## 🌟 Key Features

1. **📄 Multi-Document Processing & Text Extraction**
   - High-precision PDF text extraction retaining page-level metadata.
   - Smart chunking with configurable overlap.

2. **🧠 AI Clause Extraction & Categorization**
   - Extracts key clauses into standard legal categories: `PAYMENT`, `CONFIDENTIALITY`, `TERMINATION`, `LIABILITY`, `DATA_PRIVACY`, `DATA_RETENTION`, `DATA_STORAGE`, `JURISDICTION`, `INTELLECTUAL_PROPERTY`, and `OTHER`.
   - Confidence scoring and fallback keyword classification.

3. **⚖️ Cross-Document Contradiction Engine (Core USP)**
   - Category-grouped comparison across distinct legal documents.
   - Semantic candidate matching with vector embeddings.
   - Gemini AI evaluation assigning classifications (`NO_SIGNIFICANT_CONFLICT`, `POTENTIAL_INCONSISTENCY`, `POTENTIAL_CONTRADICTION`, `UNCERTAIN`) and risk ratings (`🔴 High`, `🟠 Medium`, `🟢 Low`).
   - Grounded legal evidence showing exact document names, clauses, page numbers, AI reasoning, and legal recommendations.

4. **💬 Document-Grounded RAG Legal Chatbot**
   - User document isolation in ChromaDB vector database.
   - Natural language Q&A strictly grounded in uploaded document context with page citations.

5. **⚡ 1-Click Instant Demo Mode**
   - Pre-loaded with Sample Contract A vs Sample Contract B (Data Retention: 5 yrs vs 2 yrs; Payment Terms: 30 days vs 60 days) for instant demonstration.

---

## 🏗️ Architecture

```
User (Browser)
   │
   ▼
React + Vite + Tailwind CSS Frontend (Port 5173)
   │
   ▼
Node.js + Express Backend API (Port 5000)
   ├── MongoDB Atlas / Local Persistence
   └── Multer PDF Storage
   │
   ▼
Python FastAPI AI Service (Port 8000)
   ├── PyMuPDF Text Extractor
   ├── LangChain Text Splitter
   ├── ChromaDB Vector Database
   └── Google Gemini API
```

---

## 🚀 Quick Start Guide

### Prerequisites
- **Node.js**: v18+
- **Python**: v3.10+
- **MongoDB**: (Optional, local persistence fallback included if MongoDB is not running)
- **Google Gemini API Key**: Obtain from [Google AI Studio](https://aistudio.google.com/)

### 1. Environment Setup

Copy `.env.example` to `.env` in both `server/` and `ai-service/`:

```bash
# server/.env
PORT=5000
MONGO_URI=mongodb://127.0.0.1:27017/clauseguard
JWT_SECRET=clauseguard_secret_jwt_key_2026
AI_SERVICE_URL=http://127.0.0.1:8000
GEMINI_API_KEY=your_gemini_api_key_here

# ai-service/.env
PORT=8000
GEMINI_API_KEY=your_gemini_api_key_here
```

---

### 2. Running the AI Service (Python FastAPI)

```bash
cd ai-service
python -m venv venv
# On Windows:
venv\Scripts\activate
# On Linux/macOS:
source venv/bin/activate

pip install -r requirements.txt
python main.py
```
*FastAPI runs on `http://localhost:8000`*

---

### 3. Running the Backend (Node.js Express)

```bash
cd server
npm install
npm run dev
```
*Backend runs on `http://localhost:5000`*

---

### 4. Running the Frontend (React Vite)

```bash
cd client
npm install
npm run dev
```
*Frontend runs on `http://localhost:5173`*

---

## 🧪 Testing Contradiction Detection

1. Register an account and log in.
2. Click **⚡ Instant Demo Mode** on the dashboard.
3. Select **Sample Contract A** and **Sample Contract B**.
4. Click **🔍 Start AI Analysis**.
5. View the detected contradictions:
   - **Data Retention**: 🔴 High Risk (5 years vs 2 years)
   - **Payment Terms**: 🟠 Medium Risk (30 days vs 60 days)
6. Open **AI Assistant** to ask questions such as: *"What are the data retention requirements across these documents?"*

---

## 🔒 Security & Privacy Architecture
ClauseGuard AI implements multi-layered security hardening across both the Node.js backend and the Python AI microservice:
- **HTTP Security Headers**: Enforced via `helmet` with custom resource policies.
- **Strict CORS Protection**: Whitelist-based origin filtering via `ALLOWED_ORIGINS` (server) and `AI_ALLOWED_ORIGINS` (FastAPI).
- **Brute Force Protection**: IP-based rate limiting via `express-rate-limit` on `/api/auth/login` and `/api/auth/register` (max 10 requests per 15-minute window), plus global API rate limiting.
- **Tenant Isolation & IDOR Prevention**: Every query for documents, clauses, cross-document analyses, and RAG retrieval strictly validates document and clause ownership against the authenticated JWT `userId`.
- **Upload Hardening**: Path traversal prevention (`..`), null byte stripping, filename sanitization, strict extension whitelist (`.pdf`, `.docx`, `.txt`), explicit rejection of macro-enabled/executable formats (`.docm`, `.exe`, etc.), and 25MB file size ceilings.
- **Secret Redaction**: Environment secrets are isolated, diagnostic health checks never leak API keys, and production error responses sanitize stack traces and database connection strings.
- **Ethical AI Framing**: ClauseGuard AI never issues definitive legal verdicts ("invalid contract"), strictly framing findings as *Potential Contradictions* or *Potential Inconsistencies* requiring human legal review.

