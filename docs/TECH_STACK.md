# ClauseGuard AI — Technology Stack

This document enumerates the technologies, frameworks, libraries, and tools powering ClauseGuard AI, providing a clear 1-sentence architectural rationale for each selection.

---

## 1. Frontend Technologies (`client/`)

| Technology | Version / Category | Architectural Rationale |
|---|---|---|
| **React** | `^18.2.0` / UI Library | Provides a reactive, component-driven architecture for rendering complex legal conflict cards and dynamic document views. |
| **Vite** | `^5.0.0` / Build Tool | Offers ultra-fast Hot Module Replacement (HMR) and optimized ES module bundling for efficient frontend development and production builds. |
| **Tailwind CSS** | `^3.4.0` / Styling Framework | Enables rapid, utility-first UI styling with a consistent, accessible LegalTech color palette. |
| **Lucide React** | `^0.344.0` / Iconography | Provides a lightweight, clean, and consistent set of modern icons without heavy runtime overhead. |
| **Axios** | `^1.6.7` / HTTP Client | Manages promise-based HTTP requests with automatic request interceptors for transparent JWT authorization injection. |
| **React Router DOM** | `^6.22.0` / Client Routing | Delivers declarative, client-side route navigation with route guards for authenticated application areas. |

---

## 2. Backend Orchestrator (`server/`)

| Technology | Version / Category | Architectural Rationale |
|---|---|---|
| **Node.js** | `>= 18.0.0` / Runtime | Delivers high-throughput, non-blocking asynchronous event I/O optimal for file streaming and API gateway orchestration. |
| **Express.js** | `^4.18.2` / Web Framework | Provides a minimalist, battle-tested HTTP routing and middleware framework for orchestrating services. |
| **Mongoose** | `^8.1.1` / ODM | Enforces strict schema definitions, validations, references, and indexes over MongoDB document collections. |
| **Multer** | `^1.4.5-lts.1` / Multipart Handler | Handles multipart file ingestion directly from HTTP requests with file size and MIME-type restrictions. |
| **JSONWebToken** | `^9.0.2` / Authentication | Issues and cryptographically validates stateless, signed authorization tokens for multi-tenant identity verification. |
| **Bcrypt.js** | `^2.4.3` / Security | Hashes user passwords using computational salt rounds to defend against rainbow table and brute-force attacks. |
| **Helmet** | `^7.1.0` / HTTP Security | Automatically injects security headers to defend against clickjacking, MIME sniffing, and cross-site scripting. |
| **Express-Rate-Limit** | `^7.1.5` / Rate Limiter | Protects authentication and file ingestion endpoints against brute-force and Denial-of-Service attacks. |
| **CORS** | `^2.8.5` / Network Security | Enforces strict Cross-Origin Resource Sharing whitelisting to prevent unauthorized third-party origin access. |
| **Dotenv** | `^16.4.1` / Configuration | Ingests environment configurations safely from `.env` files into Node's runtime environment. |

---

## 3. AI & Vector Inference Service (`ai-service/`)

| Technology | Version / Category | Architectural Rationale |
|---|---|---|
| **Python** | `>= 3.10` / Runtime | The premier ecosystem for AI, NLP, dense vector embeddings, and document parsing libraries. |
| **FastAPI** | `^0.109.0` / Web Framework | Provides high-performance, asynchronous REST APIs with automatic OpenAPI schema generation and Pydantic validation. |
| **Uvicorn** | `^0.27.0` / ASGI Server | Powers the FastAPI application with lightning-fast ASGI event loop concurrency. |
| **PyMuPDF (`fitz`)** | `^1.23.0` / Document Parsing | Extracts high-fidelity text from multi-page PDF documents with accurate page boundary tracking. |
| **python-docx** | `^1.1.0` / Document Parsing | Extracts text, paragraphs, and tables natively from Microsoft Word (`.docx`) contractual files. |
| **ChromaDB** | `^0.4.22` / Vector Database | Stores dense text embeddings on disk persistently, enabling fast metadata-filtered nearest-neighbor searches. |
| **LangChain Text Splitters** | `^0.0.1` / NLP Chunking | Recursively splits document text into overlapping 1000-character segments preserving semantic sentence boundaries. |
| **Google GenAI / Gemini** | `^0.3.0` / LLM API | Leverages Google Gemini 2.5 Flash for high-speed, cost-efficient clause classification, contradiction reasoning, and grounded QA. |
| **Pydantic** | `^2.6.0` / Data Validation | Enforces strict type validation and serialization for all incoming and outgoing AI service payloads. |
| **python-dotenv** | `^1.0.1` / Configuration | Loads environment variables and API keys from `.env` into Python's runtime environment. |

---

## 4. Databases & Persistence

| Technology | Category | Architectural Rationale |
|---|---|---|
| **MongoDB** | NoSQL Document Database | Persists complex hierarchical JSON entities (documents, clauses, contradiction reports, user profiles) with dynamic schema agility. |
| **ChromaDB Persistent** | Vector Database | Maintains on-disk vector embeddings across process restarts, ensuring zero data loss for document retrieval. |
| **JSON Local Storage** | Fallback Persistence | Provides an automatic file-backed fallback store when MongoDB is offline, allowing evaluation without external dependencies. |

---

## 5. DevOps & Containerization

| Technology | Category | Architectural Rationale |
|---|---|---|
| **Docker & Docker Compose** | Container Orchestration | Standardizes multi-service deployment across MongoDB, the Node backend, the Python AI service, and the React client. |
| **Git & GitHub** | Version Control | Provides version tracking, branch isolation, code audit histories, and team collaboration. |
