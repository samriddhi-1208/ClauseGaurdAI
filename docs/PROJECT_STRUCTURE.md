# ClauseGuard AI — Project Structure

This document details the file and directory layout of the ClauseGuard AI repository.

---

## 1. Root Directory Layout

```
ClauseGuardAI/
├── client/                     # Vite + React frontend web application
├── server/                     # Node.js + Express backend orchestrator & API gateway
├── ai-service/                 # Python + FastAPI RAG and contradiction engine
├── docs/                       # Comprehensive technical and architecture documentation
│   ├── ARCHITECTURE.md         # High-level system architecture & end-to-end data flow
│   ├── ARCHITECTURE_PATTERNS.md# Architectural styles, MVC, and SOLID design principles
│   ├── AI_PIPELINE.md          # Parsing, chunking, indexing, extraction, and RAG specs
│   ├── DATABASE.md             # MongoDB schemas, indexes, and ChromaDB vector store
│   ├── SECURITY.md             # JWT, BOLA/IDOR protection, upload hardening, rate limits
│   ├── API.md                  # Complete Node.js and FastAPI endpoint specifications
│   ├── PROJECT_STRUCTURE.md    # Repository layout and module descriptions
│   ├── TECH_STACK.md           # Technology matrix and rationale
│   └── REQUIREMENTS.md         # Functional, Non-Functional, and MVP Traceability
├── docker-compose.yml          # Multi-container orchestration (MongoDB, AI, Server, Client)
└── README.md                   # Primary project overview, quickstart, and documentation links
```

---

## 2. Frontend Client (`client/`)

```
client/
├── public/                     # Static assets (favicons, manifest)
├── src/
│   ├── assets/                 # SVGs and UI branding graphics
│   ├── components/             # Reusable UI components
│   │   ├── Navbar.jsx          # Top navigation bar with branding, links, and user session
│   │   ├── ProtectedRoute.jsx  # Route guard redirecting unauthenticated visitors to login
│   │   └── Layout.jsx          # Standard application shell layout
│   ├── context/
│   │   └── AuthContext.jsx     # Global authentication state, JWT storage, and login/logout handlers
│   ├── pages/                  # Top-level view pages
│   │   ├── Landing.jsx         # Marketing and product introduction page
│   │   ├── Login.jsx           # User sign-in interface
│   │   ├── Register.jsx        # User account registration interface
│   │   ├── Dashboard.jsx       # Overview of uploaded contracts and past analysis sessions
│   │   ├── Upload.jsx          # Drag-and-drop document upload interface with file validation
│   │   ├── Analysis.jsx        # Core contradiction report view with risk badges and filter controls
│   │   ├── Clauses.jsx         # Categorized clause inspector per document
│   │   └── Chat.jsx            # Grounded contract QA assistant interface with citations
│   ├── services/
│   │   └── api.js              # Axios HTTP client configured with baseURL and JWT bearer interceptor
│   ├── App.jsx                 # Top-level React Router route definitions
│   ├── main.jsx                # React DOM entry point
│   └── index.css               # Tailwind CSS imports and custom design tokens
├── package.json                # Frontend dependencies (React, Vite, Tailwind, Lucide, Axios)
├── tailwind.config.js          # Tailwind CSS theme configuration
└── vite.config.js              # Vite bundler configuration with dev server proxy settings
```

---

## 3. Backend Server (`server/`)

```
server/
├── config/
│   ├── db.js                   # Mongoose connection manager with reconnection logic
│   └── dbFallback.js           # In-memory JSON persistence fallback engine
├── controllers/
│   ├── authController.js       # Register, login, and current user profile endpoints
│   ├── documentController.js   # File upload handling, document listing, deletion, IDOR checks
│   ├── analysisController.js   # Analysis trigger, pairwise orchestration, report retrieval
│   └── chatController.js       # Grounded RAG query dispatching to AI service
├── data/
│   └── db_fallback.json        # Persistent JSON storage file when MongoDB is offline
├── middleware/
│   ├── authMiddleware.js       # JWT extraction and cryptographic signature validation
│   └── uploadMiddleware.js     # Multer configuration with 25MB limits and MIME whitelisting
├── models/
│   ├── User.js                 # User schema (name, email, bcrypt password hash)
│   ├── Document.js             # Contract metadata schema (status, page counts, file type)
│   ├── Clause.js               # Categorized legal clause schema
│   ├── Analysis.js             # Analysis session schema
│   └── Contradiction.js        # Cross-document conflict finding schema (risk, explanation, advice)
├── routes/
│   ├── authRoutes.js           # /api/auth routes with rate limiting
│   ├── documentRoutes.js       # /api/documents upload and CRUD routes
│   ├── analysisRoutes.js       # /api/analysis execution and history routes
│   └── chatRoutes.js           # /api/chat QA query routes
├── services/
│   └── aiService.js            # HTTP client orchestrator communicating with FastAPI AI service
├── uploads/                    # Local filesystem directory for uploaded documents (.gitignore protected)
├── .env.example                # Template for required environment variables (PORT, MONGO_URI, JWT_SECRET, etc.)
├── package.json                # Server dependencies (Express, Mongoose, Multer, Helmet, JWT, Bcrypt)
└── server.js                   # Application entry point, middleware assembly, and server listener
```

---

## 4. Python AI Service (`ai-service/`)

```
ai-service/
├── chroma_db/                  # Persistent ChromaDB vector database directory on disk
├── models/
│   └── schemas.py              # Pydantic request/response validation schemas
├── services/
│   ├── pdf_processor.py        # PDF (PyMuPDF), DOCX (python-docx), and TXT text extractor & chunker
│   ├── vector_store.py         # Persistent ChromaDB client and in-memory cosine fallback store
│   ├── clause_extractor.py     # Gemini 2.5 Flash clause classifier with regex heuristic fallback
│   ├── contradiction_detector.py # Semantic cross-document contradiction reasoning & heuristic rules
│   └── rag_engine.py           # Grounded QA engine with top-k vector retrieval and structured citations
├── .env.example                # Template for AI service configuration (GEMINI_API_KEY, PORT)
├── requirements.txt            # Python dependencies (FastAPI, PyMuPDF, python-docx, ChromaDB, LangChain)
└── main.py                     # FastAPI application entry point, CORS, routes, and exception handlers
```
