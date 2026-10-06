# ClauseGuard AI — API Specification

This document provides the full API specification for both the client-facing Node.js Express Gateway and the internal Python FastAPI AI Service.

---

## 1. Node.js Express Gateway API

Base URL: `http://localhost:5000/api` (Production: configurable via `PORT`)

All authenticated endpoints require the standard header:
```http
Authorization: Bearer <jwt_token>
```

---

### 1.1 Authentication Endpoints

#### `POST /auth/register`
Creates a new user account.
- **Access**: Public (Subject to Rate Limiting: 100 req / 15 min)
- **Request Body**:
  ```json
  {
    "name": "Alex Mercer",
    "email": "alex.mercer@legalcorp.com",
    "password": "SecurePassword123!"
  }
  ```
- **Responses**:
  - `201 Created`:
    ```json
    {
      "success": true,
      "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
      "user": {
        "id": "660c1ab4e3f8a...",
        "name": "Alex Mercer",
        "email": "alex.mercer@legalcorp.com"
      }
    }
    ```
  - `400 Bad Request`: Email already registered or invalid fields.

#### `POST /auth/login`
Authenticates an existing user.
- **Access**: Public
- **Request Body**:
  ```json
  {
    "email": "alex.mercer@legalcorp.com",
    "password": "SecurePassword123!"
  }
  ```
- **Responses**:
  - `200 OK`: Returns JWT token and user profile object.
  - `401 Unauthorized`: Invalid credentials.

#### `GET /auth/me`
Retrieves current authenticated user profile.
- **Access**: Private (Bearer JWT)
- **Responses**:
  - `200 OK`: `{ "success": true, "user": { "id": "...", "name": "...", "email": "..." } }`
  - `401 Unauthorized`: Missing or invalid token.

---

### 1.2 Document Management Endpoints

#### `POST /documents/upload`
Uploads and indexes a contract document.
- **Access**: Private (Bearer JWT)
- **Content-Type**: `multipart/form-data`
- **Form Field**: `file` (single binary: `.pdf`, `.docx`, or `.txt`, max 25 MB)
- **Responses**:
  - `201 Created`:
    ```json
    {
      "success": true,
      "document": {
        "_id": "660c2df8b1a3...",
        "fileName": "Master_Services_Agreement_2026.pdf",
        "fileSize": 1048576,
        "totalPages": 14,
        "totalClauses": 28,
        "processingStatus": "completed",
        "uploadDate": "2026-10-06T20:15:00.000Z"
      }
    }
    ```
  - `400 Bad Request`: Invalid file format, dangerous extension, or size exceeding 25 MB.
  - `503 Service Unavailable`: AI Service unreachable (no fake mock data returned).

#### `GET /documents`
Lists all documents belonging to the authenticated user.
- **Access**: Private (Bearer JWT)
- **Responses**:
  - `200 OK`: `{ "success": true, "documents": [ ... ] }`

#### `GET /documents/:id`
Retrieves details and extracted clauses for a specific document.
- **Access**: Private (Bearer JWT, IDOR-protected)
- **Responses**:
  - `200 OK`:
    ```json
    {
      "success": true,
      "document": { ... },
      "clauses": [
        {
          "_id": "660c2ef...",
          "category": "LIABILITY",
          "content": "Neither party shall be liable for indirect damages...",
          "pageNumber": 8,
          "confidence": 0.95
        }
      ]
    }
    ```
  - `404 Not Found`: Document not found or belongs to another user.

#### `DELETE /documents/:id`
Deletes a document and its associated clauses and vector indexes.
- **Access**: Private (Bearer JWT, IDOR-protected)
- **Responses**:
  - `200 OK`: `{ "success": true, "message": "Document deleted successfully" }`
  - `404 Not Found`: Document not found or unauthorized.

---

### 1.3 Contradiction Analysis Endpoints

#### `POST /analysis/compare`
Triggers cross-document contradiction detection across 2 or more contracts.
- **Access**: Private (Bearer JWT)
- **Request Body**:
  ```json
  {
    "documentIds": ["660c2df8b1a3...", "660c2e01b1a4..."]
  }
  ```
- **Responses**:
  - `200 OK`:
    ```json
    {
      "success": true,
      "analysisId": "660c3fa4e1b...",
      "findings": [
        {
          "documentA": "660c2df8b1a3...",
          "documentB": "660c2e01b1a4...",
          "category": "CONFIDENTIALITY",
          "classification": "POTENTIAL_CONTRADICTION",
          "riskLevel": "HIGH",
          "clauseA": { "content": "Confidentiality obligations expire two (2) years...", "pageNumber": 4 },
          "clauseB": { "content": "Obligations survive indefinitely...", "pageNumber": 11 },
          "explanation": "Document A specifies a 2-year survival period while Document B requires perpetual protection.",
          "recommendation": "Harmonize language using an addendum adopting the 5-year standard."
        }
      ],
      "summary": { "totalFindings": 1, "highRisk": 1, "mediumRisk": 0, "lowRisk": 0 }
    }
    ```
  - `400 Bad Request`: Fewer than 2 document IDs provided or invalid document ownership.
  - `503 Service Unavailable`: AI reasoning service unreachable.

#### `GET /analysis`
Retrieves past analysis runs for the authenticated user.
- **Access**: Private (Bearer JWT)
- **Responses**:
  - `200 OK`: `{ "success": true, "analyses": [ ... ] }`

#### `GET /analysis/:id`
Retrieves a specific analysis run with its complete findings.
- **Access**: Private (Bearer JWT, IDOR-protected)
- **Responses**:
  - `200 OK`: `{ "success": true, "analysis": { ... }, "findings": [ ... ] }`
  - `404 Not Found`: Analysis session not found.

---

### 1.4 Grounded QA Chat Endpoint

#### `POST /chat`
Queries a contract using grounded retrieval-augmented generation.
- **Access**: Private (Bearer JWT)
- **Request Body**:
  ```json
  {
    "documentIds": ["660c2df8b1a3..."],
    "question": "What is the penalty for late payment?"
  }
  ```
- **Responses**:
  - `200 OK`:
    ```json
    {
      "success": true,
      "answer": "Invoices unpaid after thirty (30) days accrue interest at 1.5% per month.",
      "citations": [
        {
          "documentId": "660c2df8b1a3...",
          "documentName": "MSA_Vendor_2026.pdf",
          "pageNumber": 5,
          "snippet": "Late payments shall incur interest at the rate of 1.5% per month..."
        }
      ]
    }
    ```

---

## 2. Python FastAPI Internal AI Service API

Base URL: `http://localhost:8000`

---

### 2.1 Endpoints

#### `POST /extract-clauses`
Parses document from disk, splits text, indexes chunks in ChromaDB, and classifies clauses.
- **Request Body**:
  ```json
  {
    "file_path": "C:/Users/.../server/uploads/1741290000000_contract.pdf",
    "user_id": "660c1ab4e3f8a...",
    "document_id": "660c2df8b1a3..."
  }
  ```
- **Responses**:
  - `200 OK`:
    ```json
    {
      "clauses": [
        {
          "category": "TERMINATION",
          "content": "Either party may terminate upon 30 days written notice...",
          "pageNumber": 3,
          "confidence": 0.95
        }
      ],
      "total_clauses": 1,
      "total_pages": 6
    }
    ```

#### `POST /analyze-contradictions`
Performs pairwise cross-document semantic comparison across categorized clauses.
- **Request Body**:
  ```json
  {
    "clauses": [ ... ],
    "document_ids": ["660c2df8b1a3...", "660c2e01b1a4..."]
  }
  ```
- **Responses**:
  - `200 OK`: `{ "findings": [ ... ], "total_findings": N }`

#### `POST /query-rag`
Conducts vector retrieval (top_k = 4) and grounded question answering with citations.
- **Request Body**:
  ```json
  {
    "query": "What is the notice period for contract termination?",
    "user_id": "660c1ab4e3f8a...",
    "document_id": "660c2df8b1a3..."
  }
  ```
- **Responses**:
  - `200 OK`:
    ```json
    {
      "answer": "The contract requires a thirty (30) day prior written notice.",
      "citations": [
        {
          "documentId": "660c2df8b1a3...",
          "documentName": "contract.pdf",
          "pageNumber": 3,
          "snippet": "Either party may terminate upon 30 days written notice..."
        }
      ]
    }
    ```

#### `GET /health`
Liveness and configuration probe.
- **Responses**:
  - `200 OK`: `{ "status": "healthy", "version": "1.0.0", "gemini_configured": true, "vector_store": "chromadb_persistent" }`
