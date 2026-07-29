# CloudPulse — Architecture

## 1. High-Level App Flow

```
User opens CloudPulse
        │
        ▼
  Enters URL(s)
        │
        ▼
  Clicks "Analyze"
        │
        ▼
Frontend (React) ──POST /api/tests──▶ Backend (Express)
        │                                    │
        │                                    ▼
        │                          Backend starts a timer
        │                                    │
        │                          Sends HTTP request to target URL
        │                                    │
        │                          Receives response (or timeout/error)
        │                                    │
        │                          Stops timer, computes latency
        │                                    │
        │                          Saves record to database
        │                                    │
        │◀──────── JSON result ──────────────┘
        ▼
  Dashboard updates
  (stats + charts + history)
```

## 2. Request Lifecycle (Backend Detail)

```
POST /api/tests { url }
   │
   ▼
Validate URL (format, protocol, block private/internal IPs)
   │
   ▼
Start timer ──▶ axios.get(url, { timeout }) ──▶ Stop timer
   │
   ├── success ──▶ record { responseTime, statusCode, size, timestamp }
   │
   └── failure ──▶ record { error type: timeout | dns | refused | invalid }
   │
   ▼
Save to LatencyLogs collection/table
   │
   ▼
Return result to frontend
```

## 3. System Architecture

```
┌─────────────────────┐        ┌──────────────────────┐        ┌────────────────────┐
│   Frontend (React)  │  HTTP  │   Backend (Express)  │  Query │  Database           │
│  - Pages/Components  │◀──────▶│  - Routes            │◀──────▶│  Firestore or       │
│  - Chart.js views    │  JSON  │  - Controllers        │        │  MongoDB Atlas      │
│  - Axios client      │        │  - Latency service    │        │  (LatencyLogs)      │
└─────────────────────┘        └──────────────────────┘        └────────────────────┘
        ▲
        │ deployed on
        ▼
   Vercel / Firebase Hosting              Backend deployed on Render
```

## 4. Tech Stack

| Layer | Choice | Notes |
|---|---|---|
| Frontend | React + Vite + Tailwind CSS | Functional components + hooks only |
| Charts | Chart.js (via `react-chartjs-2`) | Line chart (trend) + Bar chart (comparison) |
| HTTP client | Axios | Used both frontend→backend and backend→target URL |
| Backend | Node.js + Express | REST API only, no server-rendered views |
| Database | **MongoDB Atlas (Free Tier)** via Mongoose | Locked decision — see `memory.md` |
| Hosting (frontend) | Vercel | Zero-config for a Vite build |
| Hosting (backend) | Render | Free web service tier |
| Testing | Vitest (frontend) + Jest/Supertest (backend) | See `rules.md` §5 |
| Linting/formatting | ESLint + Prettier | Default configs, no custom rule debates |

> All choices above are locked per `memory.md`'s Decisions Log. An agent should build
against these directly, not re-evaluate alternatives.

## 5. Folder & File Structure

```
cloudpulse/
│
├── frontend/
│   ├── src/
│   │   ├── components/        # Reusable UI: URLInput, StatCard, ResultTable, etc.
│   │   ├── pages/              # Home, Results, Dashboard, Compare
│   │   ├── charts/              # LineLatencyChart, BarComparisonChart
│   │   ├── services/             # api.js (axios instance + endpoint calls)
│   │   └── utils/                 # formatters (ms, bytes), validators
│   ├── index.html
│   └── package.json
│
├── backend/
│   ├── routes/                # tests.routes.js, history.routes.js
│   ├── controllers/           # tests.controller.js, history.controller.js
│   ├── models/                # LatencyLog schema/model
│   ├── middleware/            # errorHandler.js, validateUrl.js
│   ├── services/               # latency.service.js (timing + request logic)
│   ├── server.js
│   └── package.json
│
├── database/
│   └── (schema notes, seed scripts if any — actual data lives in Firestore/Atlas)
│
├── docs/
│   ├── requirements.md
│   ├── architecture.md
│   ├── rules.md
│   ├── phases.md
│   ├── design.md
│   └── memory.md
│
└── README.md
```

## 6. Database Design

**Collection/Table: `LatencyLogs`**

| Field | Type | Notes |
|---|---|---|
| `id` | string | auto-generated |
| `url` | string | normalized (protocol + host + path) |
| `responseTime` | number (ms) | null if request failed |
| `statusCode` | number | null if request failed before response |
| `timestamp` | ISO datetime | when the test ran |
| `responseSize` | number (bytes) | from `content-length` header when available |
| `provider` | string (optional) | reserved for future auto-detection |
| `errorType` | string (optional) | `timeout` \| `dns` \| `refused` \| `invalid_url` \| null |

## 7. API Contract (exact shapes — do not improvise different field names)

### `POST /api/tests`

Request:
```json
{ "url": "https://example.com" }
```

Response `200` — test ran (even if the target failed to respond; that's still a
successful *test*):
```json
{
  "id": "665f1a2b9c1e4a0012ab34cd",
  "url": "https://example.com",
  "responseTime": 143,
  "statusCode": 200,
  "responseSize": 12890,
  "timestamp": "2026-07-29T10:15:00.000Z",
  "errorType": null
}
```

Response `200` — target unreachable (still stored, not a server error):
```json
{
  "id": "665f1a2b9c1e4a0012ab34ce",
  "url": "https://badsite.doesnotexist",
  "responseTime": null,
  "statusCode": null,
  "responseSize": null,
  "timestamp": "2026-07-29T10:16:00.000Z",
  "errorType": "dns"
}
```

Response `400` — malformed or disallowed URL (rejected before any request is made):
```json
{ "error": { "message": "Invalid or disallowed URL", "code": "INVALID_URL" } }
```

### `GET /api/tests?url=<url>`

Response `200`:
```json
{ "results": [ /* array of test objects, shape as above, newest first */ ] }
```

### `GET /api/tests?page=1&limit=20`

Response `200`:
```json
{ "results": [ /* ... */ ], "page": 1, "limit": 20, "total": 57 }
```

### `DELETE /api/tests/:id`

Response `200`:
```json
{ "success": true, "id": "665f1a2b9c1e4a0012ab34cd" }
```

Response `404` if the id doesn't exist:
```json
{ "error": { "message": "Record not found", "code": "NOT_FOUND" } }
```

### `GET /api/stats?url=<url>`

Response `200`:
```json
{ "url": "https://example.com", "average": 45.2, "min": 38, "max": 56, "count": 12 }
```

## 8. Environment Variables (exact names — use these, don't invent alternatives)

**`backend/.env`**
```
PORT=5000
MONGODB_URI=mongodb+srv://<user>:<password>@<cluster>/cloudpulse
CORS_ORIGIN=http://localhost:5173
REQUEST_TIMEOUT_MS=10000
```

**`frontend/.env`**
```
VITE_API_BASE_URL=http://localhost:5000/api
```

## 9. CORS Policy

Backend only accepts requests from the origin(s) listed in `CORS_ORIGIN` (comma-
separated if more than one, e.g. local dev + production Vercel URL). Never set it to
`*` — this API accepts URLs to fetch on the caller's behalf, so an open CORS policy
widens the SSRF attack surface unnecessarily.

## 10. UI Pages

- **Home** — URL input + recent tests list
- **Results** — latency, status, and stats for the just-run test
- **Dashboard** — charts, history table, analytics
- **Compare** — side-by-side multi-URL view
