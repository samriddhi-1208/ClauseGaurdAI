# ClauseGuard AI — Completion Walkthrough

⚖️ **ClauseGuard AI** is now fully built as a complete, working LegalTech web application for multi-document contract intelligence, cross-document contradiction detection, and document-grounded RAG assistance.

Project location: [`C:\Users\tiwar\OneDrive\Desktop\ClauseGuardAI`](file:///C:/Users/tiwar/OneDrive/Desktop/ClauseGuardAI)

---

## What Was Created & Configured

### 1. Monorepo Architecture
- **`client/`**: React 18 + Vite + Tailwind CSS + Lucide Icons + Axios + React Router v6.
- **`server/`**: Node.js + Express.js + Mongoose (MongoDB) + Multer + JWT + bcryptjs + Fallback persistence engine.
- **`ai-service/`**: Python FastAPI + PyMuPDF + LangChain Chunker + ChromaDB Vector Database + Google Gemini API.

### 2. Core Capabilities Implemented

#### 🚨 Cross-Document Contradiction Engine (Core USP)
- Automatically groups clauses across distinct uploaded contracts into standard legal categories (`PAYMENT`, `CONFIDENTIALITY`, `TERMINATION`, `LIABILITY`, `DATA_PRIVACY`, `DATA_RETENTION`, `DATA_STORAGE`, `JURISDICTION`, `INTELLECTUAL_PROPERTY`, `OTHER`).
- Performs semantic matrix matching to isolate candidate pairs.
- Calls Gemini AI (or smart semantic fallback rules) to classify conflict status:
  - `NO_SIGNIFICANT_CONFLICT`
  - `POTENTIAL_INCONSISTENCY` (🟠 Medium Risk)
  - `POTENTIAL_CONTRADICTION` (🔴 High Risk)
  - `UNCERTAIN`
- Renders side-by-side evidence with exact document names, page numbers, AI reasoning, and legal recommendations.

#### 💬 Document-Grounded RAG Assistant
- Isolates vectors in ChromaDB per authenticated user ID.
- Answers questions based strictly on uploaded document context with page citations.
- Gracefully handles missing information: *"I could not find sufficient information in the uploaded documents to answer this question."*

#### ⚡ 1-Click Instant Demo Mode
- Instantly preloads **Sample Contract A** (5-year retention, 30-day payment) vs **Sample Contract B** (2-year deletion, 60-day payment).
- Enables zero-setup instant demonstration of contradiction detection findings.

---

## Key Files Created

| Layer | File Path | Description |
|---|---|---|
| **Root** | [README.md](file:///C:/Users/tiwar/OneDrive/Desktop/ClauseGuardAI/README.md) | Comprehensive setup & running documentation |
| **Root** | [docker-compose.yml](file:///C:/Users/tiwar/OneDrive/Desktop/ClauseGuardAI/docker-compose.yml) | Multi-container Docker configuration |
| **AI Service** | [main.py](file:///C:/Users/tiwar/OneDrive/Desktop/ClauseGuardAI/ai-service/main.py) | FastAPI entrypoint for document processing, matrix comparison, and RAG chat |
| **AI Service** | [contradiction_detector.py](file:///C:/Users/tiwar/OneDrive/Desktop/ClauseGuardAI/ai-service/services/contradiction_detector.py) | Cross-document contradiction detection engine |
| **AI Service** | [vector_store.py](file:///C:/Users/tiwar/OneDrive/Desktop/ClauseGuardAI/ai-service/services/vector_store.py) | ChromaDB vector indexing and search with user isolation |
| **Server** | [server.js](file:///C:/Users/tiwar/OneDrive/Desktop/ClauseGuardAI/server/server.js) | Express backend server setup and API routing |
| **Server** | [aiService.js](file:///C:/Users/tiwar/OneDrive/Desktop/ClauseGuardAI/server/services/aiService.js) | Proxy service connecting Node.js backend to Python AI service |
| **Client** | [App.jsx](file:///C:/Users/tiwar/OneDrive/Desktop/ClauseGuardAI/client/src/App.jsx) | React Router application routing |
| **Client** | [LandingPage.jsx](file:///C:/Users/tiwar/OneDrive/Desktop/ClauseGuardAI/client/src/pages/LandingPage.jsx) | Professional LegalTech landing page |
| **Client** | [DashboardPage.jsx](file:///C:/Users/tiwar/OneDrive/Desktop/ClauseGuardAI/client/src/pages/DashboardPage.jsx) | Metrics cards, recent documents, and scan feeds |
| **Client** | [ComparePage.jsx](file:///C:/Users/tiwar/OneDrive/Desktop/ClauseGuardAI/client/src/pages/ComparePage.jsx) | Multi-document comparison selection & scan trigger |
| **Client** | [ResultsPage.jsx](file:///C:/Users/tiwar/OneDrive/Desktop/ClauseGuardAI/client/src/pages/ResultsPage.jsx) | Side-by-side evidence cards, risk badges, and AI explanations |
| **Client** | [ChatPage.jsx](file:///C:/Users/tiwar/OneDrive/Desktop/ClauseGuardAI/client/src/pages/ChatPage.jsx) | RAG document intelligence chatbot with page citations |

---

## How to Run the Application

### Option A: Local Execution

1. **Start Python AI Service (Port 8000)**:
   ```bash
   cd C:\Users\tiwar\OneDrive\Desktop\ClauseGuardAI\ai-service
   pip install -r requirements.txt
   python main.py
   ```

2. **Start Express Node.js Server (Port 5000)**:
   ```bash
   cd C:\Users\tiwar\OneDrive\Desktop\ClauseGuardAI\server
   npm install
   npm run dev
   ```

3. **Start React Vite Frontend (Port 5173)**:
   ```bash
   cd C:\Users\tiwar\OneDrive\Desktop\ClauseGuardAI\client
   npm install
   npm run dev
   ```

---

## Demonstration Guide

1. Open `http://localhost:5173` in your browser.
2. Click **Get Started** or **Sign In** (or click **⚡ Instant Demo Mode** directly from the sidebar).
3. In **Compare Contracts**, select **Sample Contract A** and **Sample Contract B**, then click **🔍 Start AI Analysis**.
4. Review the detected risks:
   - **Data Retention**: 🔴 High Risk (5-year retention vs 2-year deletion).
   - **Payment Terms**: 🟠 Medium Risk (30 days vs 60 days).
5. Open **AI Assistant** to ask: *"What are the data retention requirements across these contracts?"* to see grounded answers with page citations.
