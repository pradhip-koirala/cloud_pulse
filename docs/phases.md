# CloudPulse — Build Phases

Each phase has a goal, concrete tasks, the files it touches, and a "done when"
checklist. Work through them in order — don't start a phase's tasks until the
previous phase's checklist is fully checked. Update `memory.md` when a phase
finishes or when work pauses mid-phase.

---

## Phase 0 — Setup & Decisions

**Goal:** repo skeleton exists and key decisions are locked in.

- [ ] Create folder structure per `architecture.md` (frontend/, backend/, docs/)
- [ ] Init git repo, add `.gitignore` (node_modules, .env, build/)
- [ ] `npm init` in both `frontend/` and `backend/`
- [ ] **Decide:** Firestore vs. MongoDB Atlas — record the choice in `memory.md`
- [ ] **Decide:** hosting targets (Vercel vs Firebase Hosting for frontend) — record
in `memory.md`
- [ ] Set up `.env.example` for both frontend and backend

**Done when:** repo builds/runs empty React app and empty Express server locally.

---

## Phase 1 — Backend Core: Latency Measurement

**Goal:** hit `POST /api/tests` with a URL and get back a real latency measurement.

- [ ] `backend/services/latency.service.js` — timer start/stop around an Axios
request to the target URL
- [ ] URL validation + SSRF guard (block private IPs/localhost) — see `rules.md`
- [ ] Timeout handling (e.g. 10s) and error categorization (`timeout`, `dns`,
`refused`, `invalid_url`)
- [ ] `backend/routes/tests.routes.js` + `backend/controllers/tests.controller.js`
- [ ] Centralized error-handling middleware (`backend/middleware/errorHandler.js`)
- [ ] Manual test via curl/Postman against a few real URLs (success + failure cases)

**Done when:** `POST /api/tests { url }` reliably returns responseTime, statusCode,
responseSize, timestamp — or a clean error result — for any input URL.

**Verify:**
```bash
curl -X POST http://localhost:5000/api/tests \
  -H "Content-Type: application/json" \
  -d '{"url":"https://example.com"}'
# expect: 200 with responseTime, statusCode, responseSize, timestamp, errorType:null

curl -X POST http://localhost:5000/api/tests \
  -H "Content-Type: application/json" \
  -d '{"url":"http://localhost:5000"}'
# expect: 400 INVALID_URL (SSRF guard blocking localhost)

curl -X POST http://localhost:5000/api/tests \
  -H "Content-Type: application/json" \
  -d '{"url":"not-a-url"}'
# expect: 400 INVALID_URL
```

---

## Phase 2 — Database Integration

**Goal:** every test result is persisted and retrievable.

- [ ] Connect to chosen DB (Firestore or MongoDB Atlas) from backend
- [ ] `backend/models/LatencyLog` — schema matching `architecture.md` §6
- [ ] Save each test result on completion (success or error)
- [ ] `GET /api/tests?url=` — history for one URL
- [ ] `GET /api/tests` — recent tests, paginated
- [ ] `DELETE /api/tests/:id` — remove a record
- [ ] `GET /api/stats?url=` — avg/min/max/count for a URL

**Done when:** results survive a server restart and can be queried back out via API.

**Verify:**
```bash
# run a test, note the returned "id", then restart the backend process
curl http://localhost:5000/api/tests
# expect: the earlier test still present in "results"

curl http://localhost:5000/api/stats?url=https://example.com
# expect: average/min/max/count reflecting all tests run against that URL so far
```

---

## Phase 3 — Frontend: Core Flow

**Goal:** a user can submit a URL and see a real result, end to end.

- [ ] `frontend/services/api.js` — Axios instance pointed at backend
- [ ] Home page: URL input + "Analyze" button + recent tests list
- [ ] Results page/section: shows latency, status, size, timestamp for latest run
- [ ] Basic loading and error states (submitting, timed out, invalid URL)
- [ ] Wire frontend to backend locally end-to-end

**Done when:** typing a URL and clicking Analyze shows a real measured result from
the backend, including a clean failure state for bad URLs.

---

## Phase 4 — Dashboard & Charts

**Goal:** historical data becomes visual and useful.

- [ ] Dashboard page: average / min / max / latest stat cards
- [ ] `charts/LineLatencyChart` — latency over time for a selected URL
- [ ] `charts/BarComparisonChart` — compare latency across multiple URLs
- [ ] History table with search-by-URL
- [ ] Delete-record action wired to `DELETE /api/tests/:id`

**Done when:** dashboard reflects real stored history, updates after new tests, and
charts render correctly with at least a handful of data points.

---

## Phase 5 — Compare View & Polish

**Goal:** multi-URL comparison works and the app feels finished.

- [ ] Compare page: run/view several URLs side-by-side (list-based, e.g. Google,
GitHub, Microsoft, OpenAI, Cloudflare)
- [ ] Empty states (no history yet, no results for a search)
- [ ] Responsive layout pass (mobile/tablet/desktop) per `design.md`
- [ ] Basic accessibility pass (labels, contrast, focus states)

**Done when:** the app is usable and coherent across the four pages
(Home/Results/Dashboard/Compare) without rough edges.

---

## Phase 6 — Testing & Hardening

**Goal:** confidence the app won't break on real-world input.

- [ ] Test with invalid URLs, unreachable hosts, slow hosts, HTTPS-only sites
- [ ] Test SSRF guard actually blocks localhost/private IPs
- [ ] Confirm centralized error handler never leaks stack traces to client
- [ ] Load a moderate amount of test history (100+ records) and confirm dashboard
stays responsive

**Done when:** all `success criteria` items in `requirements.md` §6 are checked off.

---

## Phase 7 — Deployment & Documentation

**Goal:** live, shareable, and documented.

- [ ] Deploy backend to Render (env vars configured)
- [ ] Deploy frontend to Vercel or Firebase Hosting, pointed at live backend
- [ ] Final `README.md` — setup instructions, screenshots, live link
- [ ] Confirm `docs/` folder is complete and up to date
- [ ] Prepare presentation/demo walkthrough

**Done when:** a stranger can open the live link, run a test, and see it work.

---

## Optional Phase 8 — Stretch Features

Only after Phase 7 is fully done. Pick from `requirements.md` §4 (CSV export, alerts,
auto-refresh, provider detection, prediction, PDF reports) one at a time, each as its
own mini-phase with its own checklist added here when started.
