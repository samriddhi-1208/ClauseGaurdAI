# ClauseGuard AI — Production Deployment Guide

This guide provides operational specifications, environment configurations, and deployment procedures for deploying ClauseGuard AI reliably, securely, and reproducibly to staging and production environments.

---

## 1. Production Deployment Architecture

```
                    ┌───────────────────────────────────────────────┐
                    │               Client Browser                  │
                    └───────────────────────┬───────────────────────┘
                                            │
                                            │ HTTPS / WSS
                                            ▼
                    ┌───────────────────────────────────────────────┐
                    │     Frontend Host (Vercel / Netlify / CDN)    │
                    │        Build: vite build (Static SPA)         │
                    └───────────────────────┬───────────────────────┘
                                            │
                                            │ HTTPS / REST (Bearer JWT)
                                            ▼
                    ┌───────────────────────────────────────────────┐
                    │       API Gateway (Node.js / Express)         │
                    │        Host: Render / Railway / ECS           │
                    │  Persistent Disk: /app/server/uploads (25MB)  │
                    └───┬───────────────────────────────────────┬───┘
                        │                                       │
                        │ Mongoose / TLS                        │ Internal HTTP / VPC
                        ▼                                       ▼
        ┌──────────────────────────────┐        ┌──────────────────────────────┐
        │   Managed MongoDB Atlas      │        │ Python AI Service (FastAPI)  │
        │   (Users, Docs, Analyses)    │        │ Host: Render / Railway / ECS │
        └──────────────────────────────┘        │ Persistent Disk: ./chroma_db │
                                                └───┬───────────────────────┬──┘
                                                    │                       │
                                                    │ Embeddings            │ HTTPS (API Key)
                                                    ▼                       ▼
                                        ┌──────────────────────┐ ┌──────────────────────┐
                                        │ Persistent ChromaDB  │ │ Google Gemini 2.5    │
                                        │ Vector Store on Disk │ │ (Heuristic Fallback) │
                                        └──────────────────────┘ └──────────────────────┘
```

---

## 2. Service Deployment Order

Deploy services in the following order to ensure downstream dependencies are immediately healthy:
1. **Database Layer**: Provision MongoDB cluster (e.g., MongoDB Atlas M0/M10+). Ensure IP Access List includes your backend egress IPs (or `0.0.0.0/0` with strong authentication).
2. **AI Inference Service (`ai-service/`)**: Deploy Python FastAPI service with an attached persistent disk for `./chroma_db`. Verify via `GET /health`.
3. **Backend API Gateway (`server/`)**: Deploy Node.js Express service configured with `MONGO_URI` and `AI_SERVICE_URL`. Verify via `GET /api/health`.
4. **Frontend Client (`client/`)**: Build and deploy Vite React static SPA configured with `VITE_API_URL` pointing to the public URL of the Express gateway.

---

## 3. Environment Variables Reference

### 3.1 Backend Server (`server/.env`)

| Variable | Required in Prod | Default | Purpose / Production Recommendation |
|---|:---:|---|---|
| `PORT` | Yes | `5000` | HTTP port for Express server (provided automatically by PaaS like Render/Heroku). |
| `MONGO_URI` | Yes | *None* | Connection string to MongoDB Atlas replica set (e.g., `mongodb+srv://user:pass@cluster.mongodb.net/clauseguard?retryWrites=true&w=majority`). |
| `JWT_SECRET` | Yes | *None* | Cryptographically secure high-entropy string (>= 32 random characters). |
| `AI_SERVICE_URL` | Yes | `http://127.0.0.1:8000` | Internal URL or VPC address of the Python AI service (e.g. `http://ai-service:8000` or private internal DNS). |
| `CLIENT_URL` | Yes | `http://localhost:5173` | Public URL of the frontend for CORS whitelist (e.g. `https://clauseguard.yourdomain.com`). |
| `ALLOWED_ORIGINS` | Optional | *CLIENT_URL* | Comma-separated list of allowed CORS origins. Never use `*` with credentials. |
| `AUTH_RATE_LIMIT_MAX`| Optional | `10` | Maximum login/registration attempts per 15-minute window per IP. |
| `NODE_ENV` | Yes | `development` | Set to `production` to suppress debug stack traces and optimize middleware. |

### 3.2 AI Service (`ai-service/.env`)

| Variable | Required in Prod | Default | Purpose / Production Recommendation |
|---|:---:|---|---|
| `AI_PORT` | Optional | `8000` | Port for Uvicorn ASGI server. |
| `GEMINI_API_KEY` | Recommended | *None* | Google AI Studio Gemini API key. If omitted, deterministic heuristic fallback engine activates. |
| `AI_ALLOWED_ORIGINS`| Yes | `http://localhost:5000`| Comma-separated whitelist of origins permitted to call FastAPI directly. In private VPC, restrict to API Gateway. |

### 3.3 Frontend Client (`client/.env`)

| Variable | Required in Prod | Default | Purpose / Production Recommendation |
|---|:---:|---|---|
| `VITE_API_URL` | Yes (decoupled) | `/api` | Base URL for backend API requests (e.g. `https://api.clauseguard.yourdomain.com/api`). |

---

## 4. Build and Run Commands

### 4.1 Frontend Client (`client/`)
```bash
# Install dependencies
npm ci

# Production build (outputs to client/dist/)
npm run build

# Preview production build locally
npm run preview
```

### 4.2 Backend API Gateway (`server/`)
```bash
# Install dependencies
npm ci --only=production

# Start production server
NODE_ENV=production node server.js
```

### 4.3 Python AI Service (`ai-service/`)
```bash
# Install dependencies
pip install --no-cache-dir -r requirements.txt

# Start production ASGI server with multiple workers
uvicorn main:app --host 0.0.0.0 --port 8000 --workers 2
```

---

## 5. Persistent Storage & Cloud Considerations

### 5.1 ChromaDB Persistent Vector Storage
- **Current Configuration**: ChromaDB writes persistent index files to `ai-service/chroma_db/`.
- **Cloud Risk**: On container platforms with ephemeral storage (e.g. basic Render web services, Heroku dynos, Google Cloud Run), container restarts will wipe the `./chroma_db` directory, requiring re-indexing of documents.
- **Production Solution**:
  1. Attach a **Persistent Disk Volume** (e.g., Render Persistent Disk, AWS EBS volume, Kubernetes PersistentVolumeClaim) mounted to `/app/ai-service/chroma_db`.
  2. For distributed multi-instance clusters, migrate to an external vector service (e.g., ChromaDB Server mode, Pinecone, or pgvector).

### 5.2 Document Upload Storage
- **Current Configuration**: Uploaded contracts are temporarily stored in `server/uploads/` with 25 MB limits, extension validation, and filename sanitization.
- **Cloud Risk**: Ephemeral containers will lose uploaded binary files across restarts (though text and clauses remain preserved in MongoDB).
- **Production Solution**:
  1. Mount a persistent volume to `server/uploads/`.
  2. For enterprise cloud scaling, integrate an object storage provider (e.g. AWS S3, Google Cloud Storage, Cloudflare R2) using presigned upload URLs.

---

## 6. Health Checks & Monitoring

| Endpoint | Service | Expected Response | Monitored Indicators |
|---|---|---|---|
| `GET /api/health` | Node.js Gateway | HTTP 200 `{ status: "ok", mongoConnected: true }` | Server uptime, MongoDB connectivity. |
| `GET /health` | Python AI Service | HTTP 200 `{ status: "ok", gemini_status: "..." }` | FastAPI uptime, Gemini configuration state. |

---

## 7. Common Deployment Failures & Troubleshooting

1. **CORS Blocked Errors in Browser**:
   - *Cause*: `CLIENT_URL` or `ALLOWED_ORIGINS` on the backend does not match the exact scheme/domain of the deployed frontend (e.g., missing `https://` or trailing slashes).
   - *Fix*: Set `ALLOWED_ORIGINS=https://clauseguard.yourdomain.com` without trailing slashes.
2. **AI Service 503 Errors on Analysis / Upload**:
   - *Cause*: Express cannot reach `AI_SERVICE_URL`.
   - *Fix*: Ensure internal networking/DNS is resolving between the Express gateway and FastAPI service.
3. **ChromaDB Permission Denied**:
   - *Cause*: Running in Docker under a non-root user without write permissions on `ai-service/chroma_db`.
   - *Fix*: Ensure directory ownership is set to the application user (`chown -R 1000:1000 chroma_db`).
4. **Auth Rate Limiting in Staging/Testing**:
   - *Cause*: E2E testing from a shared corporate IP triggers the 10 req / 15 min brute-force limiter.
   - *Fix*: Temporarily set `AUTH_RATE_LIMIT_MAX=1000` during automated staging test runs.
