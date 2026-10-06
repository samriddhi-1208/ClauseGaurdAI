# ClauseGuard AI — Architecture Patterns & Design Principles

This document outlines the architectural patterns and design principles implemented across the ClauseGuard AI system. It differentiates between system-level architectural styles and component-level object-oriented design principles.

---

## 1. Primary Architectural Patterns

### 1.1 Layered Architecture Pattern (N-Tier)

ClauseGuard AI structures both backend services into distinct, unidirectional layers where each layer has a bounded responsibility:

```
┌─────────────────────────────────────────────────────────────┐
│                 Presentation Layer (React)                  │
│       Pages, Reusable Components, Context Providers         │
└──────────────────────────────┬──────────────────────────────┘
                               │ HTTPS / JSON / JWT
┌──────────────────────────────▼──────────────────────────────┐
│                  Routing Layer (Express / FastAPI)          │
│       authRoutes, documentRoutes, analysisRoutes, main.py   │
└──────────────────────────────┬──────────────────────────────┘
                               │ Validated DTOs / Requests
┌──────────────────────────────▼──────────────────────────────┐
│                 Controller / Application Layer              │
│       authController, documentController, analysisController│
└──────────────────────────────┬──────────────────────────────┘
                               │ Domain Operations
┌──────────────────────────────▼──────────────────────────────┐
│                    Service / Reasoning Layer                │
│       aiService.js, clause_extractor, contradiction_detector│
└──────────────────────────────┬──────────────────────────────┘
                               │ Queries & Persistence Calls
┌──────────────────────────────▼──────────────────────────────┐
│                  Persistence & Data Store Layer             │
│       Mongoose ODM / MongoDB, ChromaDB Persistent Vector    │
└─────────────────────────────────────────────────────────────┘
```

#### Layer Responsibilities:
1. **Presentation Layer (`client/src/`)**: Renders reactive UI, handles form states, displays analytical findings, and captures user interactions. Never performs direct business logic or DB calls.
2. **Routing Layer (`server/routes/`, `ai-service/main.py`)**: Maps HTTP verbs and URI paths to handlers, attaches security middleware (authentication, rate limiting, multer upload hooks).
3. **Controller Layer (`server/controllers/`)**: Extracts request parameters, enforces IDOR authorization checks, orchestrates calls between services, and formats HTTP responses.
4. **Service Layer (`server/services/`, `ai-service/services/`)**: Encapsulates core business algorithms: AI prompt composition, cross-document pairing, contradiction heuristic rules, and RAG retrieval.
5. **Persistence Layer (`server/models/`, `ai-service/services/vector_store.py`)**: Defines schemas, indexes, data constraints, and manages vector embedding storage.

---

### 1.2 Client-Server Architectural Pattern

The application strictly separates client and server concerns:
- **Stateless Communication**: The frontend communicates with the Node.js API server over standard RESTful HTTP APIs. Authentication state is transferred via cryptographically signed JSON Web Tokens (`Authorization: Bearer <token>`) rather than server-side session state.
- **Independent Evolutions**: The React frontend can be updated, rebuilt, or migrated without affecting backend route contracts or database schemas.
- **Cross-Origin Resource Sharing (CORS)**: The server strictly whitelists trusted client origins (`CLIENT_URL` / `http://localhost:5173`) and rejects unauthorized external web origins.

---

### 1.3 Modular Service-Oriented Architecture (SOA)

Rather than forcing Python AI workflows into Node.js (via unstable sub-processes or native bindings) or forcing high-concurrency file uploading and JWT management into Python, the architecture separates them into two dedicated services:
- **Node.js Orchestration Gateway (`server/`)**: Acts as the customer-facing gateway, managing identity, document records, persistent analyses, and request rate-limiting.
- **Python AI Inference Service (`ai-service/`)**: Acts as a private, high-performance computational service dedicated to text parsing, dense vector indexing, and LLM reasoning.

> [!NOTE]
> This pattern differs from a fully distributed microservices mesh: there is no complex service mesh or Kafka event bus; the boundary is clean, synchronous HTTP REST between an orchestrator and an inference engine.

---

### 1.4 MVC-Style Separation in Express Backend

The Express backend strictly enforces the Model-View-Controller design pattern (with the client acting as the View):
- **Models (`server/models/`)**: Mongoose schemas defining validation rules, relationship references, timestamps, and indexes (`User`, `Document`, `Clause`, `Analysis`, `Contradiction`).
- **Controllers (`server/controllers/`)**: Functions handling business flow (`register`, `login`, `uploadDocument`, `getDocuments`, `deleteDocument`, `startAnalysis`, `getAnalysisById`, `askChatQuestion`).
- **Services (`server/services/`)**: Reusable helper abstractions such as `aiService.js`, which handles network communication and fault tolerance when talking to the Python AI service.

---

## 2. Design Principles (SOLID)

While architectural patterns govern the macro-structure of the system, **SOLID principles** guide the micro-design of components and modules within the codebase:

### 2.1 Single Responsibility Principle (SRP)
- `pdf_processor.py` is solely responsible for extracting text and splitting documents into chunks. It has no knowledge of contradiction detection or vector databases.
- `vector_store.py` manages ChromaDB client initialization, embedding storage, and similarity querying. It does not parse documents or perform LLM prompting.
- `authController.js` only handles user authentication, password hashing, and token issuance. It does not process document uploads.

### 2.2 Open/Closed Principle (OCP)
- The document extraction pipeline is designed to be easily extensible to new file types. Adding DOCX support required adding a dedicated handler in `pdf_processor.py` without modifying the vector store or the clause extraction prompt.
- Contradiction rules in `contradiction_detector.py` allow adding new legal category heuristics without modifying the core pairwise comparison loop.

### 2.3 Liskov Substitution Principle (LSP)
- In `vector_store.py`, both persistent ChromaDB and the in-memory fallback store adhere to identical method signatures:
  ```python
  def add_documents(self, documents: List[Dict[str, Any]], user_id: str, document_id: str) -> bool: ...
  def query(self, query_text: str, user_id: str, document_id: Optional[str] = None, top_k: int = 4) -> List[Dict[str, Any]]: ...
  ```
  The RAG engine functions interchangeably regardless of whether persistent ChromaDB or the local cosine store is actively servicing the query.

### 2.4 Interface Segregation Principle (ISP)
- FastAPI endpoints expose narrow, focused request models (`ExtractClausesRequest`, `ContradictionRequest`, `RAGQueryRequest`) rather than one monolithic generic payload model.
- Each endpoint requires only the fields necessary for its specific operation.

### 2.5 Dependency Inversion Principle (DIP)
- High-level orchestration controllers in Express depend on the abstract interface provided by `aiService.js`. If the internal AI service URL or transport mechanism changes, the controllers remain unaffected.
- The Python AI services read API keys and configurations from standard environment variables via `os.getenv` rather than hardcoding credentials inside business logic.
