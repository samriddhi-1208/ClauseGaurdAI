# ClauseGuard AI — Security Architecture & Hardening

This document provides a comprehensive security review of ClauseGuard AI, detailing authentication mechanisms, access control, upload defense-in-depth, network policies, and tenant isolation.

---

## 1. Authentication & Session Management

- **Mechanism**: Stateless JSON Web Tokens (JWT) adhering to RFC 7519.
- **Token Signing**: Cryptographically signed using HMAC SHA-256 (`HS256`) against a high-entropy secret (`JWT_SECRET`).
- **Token Transmission**: Transported via the standard `Authorization` header:
  ```http
  Authorization: Bearer <jwt_token>
  ```
- **Password Protection**:
  - Hashed using `bcryptjs` with **10 salt rounds**.
  - Passwords are never stored in plain text, never logged, and are omitted from user lookup response projections (`select('-password')`).
- **Validation Middleware (`server/middleware/authMiddleware.js`)**:
  - Rejects missing, malformed, or expired tokens with `401 Unauthorized`.
  - Decodes token payload and attaches verified `req.userId` and `req.user` to the request object.

---

## 2. Insecure Direct Object Reference (IDOR / BOLA) Prevention

In a multi-tenant LegalTech application, unauthorized cross-tenant contract access represents a catastrophic vulnerability. ClauseGuard AI enforces strict tenant-scoping on every database operation:

### 2.1 Database-Level Scoping
Every retrieval, update, or deletion query explicitly checks both the target entity ID and the requesting user's ID:
```javascript
// Example from documentController.js
const document = await Document.findOne({ _id: documentId, userId: req.userId });
if (!document) {
  return res.status(404).json({ success: false, message: 'Document not found or access denied' });
}
```

### 2.2 Vector Store Multi-Tenant Filtering
ChromaDB vector queries enforce a compound metadata filter requiring matching `userId`:
```python
# vector_store.py
where_filter = {
    "$and": [
        {"userId": user_id},
        {"documentId": document_id}
    ]
}
results = collection.query(query_texts=[query_text], n_results=top_k, where=where_filter)
```
No user can retrieve or search embeddings belonging to another user, even if they guess a valid document UUID.

---

## 3. Secure File Upload Pipeline

Located in: `server/routes/documentRoutes.js` and `server/controllers/documentController.js`

```
User File ──► [ Multer Interceptor ]
                    │
                    ├──► [ 1. File Size Verification ] (Max 25 MB)
                    ├──► [ 2. Extension & MIME Validation ] (.pdf, .docx, .txt)
                    ├──► [ 3. Dangerous Extension Blacklist ] (.exe, .sh, .py, .php, etc.)
                    ├──► [ 4. Path Traversal & Null-Byte Sanitization ]
                    └──► [ 5. Cryptographic Disk Storage ] (Unique timestamp prefix)
```

### 3.1 Upload Security Controls:
1. **Size Limit**: Enforces a strict ceiling of **25 MB** (`25 * 1024 * 1024` bytes) per file, mitigating storage exhaustion and Denial of Service (DoS).
2. **Whitelist Validation**:
   - Only three extensions permitted: `.pdf`, `.docx`, `.txt`.
   - MIME types validated against:
     - `application/pdf`
     - `application/vnd.openxmlformats-officedocument.wordprocessingml.document`
     - `text/plain`
3. **Blacklist Protection**: Explicitly blocks executable extensions (`.exe`, `.bat`, `.cmd`, `.sh`, `.ps1`, `.js`, `.py`, `.php`, `.vbs`, `.dll`, `.bin`).
4. **Path Traversal & Null-Byte Neutralization**:
   - Filenames stripped of `../` directory traversal characters using `path.basename()`.
   - Null bytes (`\0`) and illegal filesystem characters stripped via regex.
   - Storage filenames prefixed with unique timestamps to prevent collision attacks.

---

## 4. HTTP Headers & Network Hardening

### 4.1 Helmet HTTP Security Headers
Configured via `helmet()` in `server/server.js`:
- `X-Content-Type-Options: nosniff`: Prevents MIME-sniffing attacks.
- `X-Frame-Options: SAMEORIGIN`: Protects against clickjacking.
- `X-XSS-Protection: 0`: Modern standard disabling buggy legacy XSS auditor.
- `Strict-Transport-Security`: Enforces HTTPS transport.
- `Content-Security-Policy`: Restricts resource injection.

### 4.2 Cross-Origin Resource Sharing (CORS) Policy
Configured with an explicit whitelist:
```javascript
const allowedOrigins = [
  process.env.CLIENT_URL,
  'http://localhost:5173',
  'http://127.0.0.1:5173'
].filter(Boolean);

app.use(cors({
  origin: (origin, callback) => {
    if (!origin || allowedOrigins.includes(origin)) {
      callback(null, true);
    } else {
      callback(new Error('Blocked by CORS policy'));
    }
  },
  credentials: true
}));
```

### 4.3 Rate Limiting
Enforces IP-based request throttling using `express-rate-limit`:
- **Auth Routes (`/api/auth/*`)**: Capped at **10 requests per 15-minute window** (configurable via `AUTH_RATE_LIMIT_MAX`) to prevent credential stuffing and brute-force attacks.
- **General API Routes (`/api/*`)**: Capped at **300 requests per 15-minute window** to protect against resource exhaustion.

---

## 5. Error Sanitization & Leakage Prevention

- **Production Errors**: Node.js and FastAPI omit internal stack traces and database error internals in API responses.
- **Transparent 503 Responses**: When the AI service is unreachable, the orchestrator returns clean `503 Service Unavailable` JSON rather than unhandled promise rejections or misleading synthetic mock data.
