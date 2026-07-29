# CloudPulse — Rules & Guardrails

This file is the single source of truth for **what's allowed, what's banned, and how
errors must be handled**. Any AI assistant (or human) working on this repo should read
this before writing code, and should treat it as binding, not a suggestion.

## 1. Locked-In Tech Choices

Do not introduce alternatives to these without updating this file first:

| Concern | Use | Do NOT use |
|---|---|---|
| Frontend framework | React (functional components + hooks) | Vue, Svelte, class components |
| Styling | Tailwind CSS | styled-components, plain CSS files, inline `style={}` for layout |
| Charts | Chart.js via `react-chartjs-2` | D3, Recharts, Victory, custom canvas charts |
| HTTP client | Axios | `fetch` in the frontend (keep it consistent), `request` (deprecated), `superagent` |
| Backend framework | Express | Fastify, Koa, NestJS — too heavy for this scope |
| Database | **MongoDB Atlas (Free Tier) via Mongoose** — locked, see `memory.md` | Do not add Firestore, Postgres, or MySQL |
| Build tool | Vite | Not Create React App (deprecated), not Next.js (unneeded SSR) |
| Testing | Vitest (frontend), Jest + Supertest (backend) | Not Mocha/Chai, not Cypress for this scope |
| Linting | ESLint + Prettier, default configs | Don't hand-roll custom rule sets |
| Dates | Native `Date` / `Intl.DateTimeFormat` | `moment.js` (unmaintained, heavy) |
| State management | React `useState`/`useContext` | Redux, Zustand, MobX — unnecessary for this app's size |

**Rule:** no new dependency gets added without checking if the existing stack already
covers the need. This project intentionally avoids "just in case" libraries.

## 2. Things to Explicitly Avoid

- **No SSRF exposure:** the backend fetches arbitrary user-submitted URLs. Never allow
requests to `localhost`, `127.0.0.1`, `169.254.169.254` (cloud metadata endpoint),
private IP ranges (`10.x`, `172.16-31.x`, `192.168.x`), or non-`http(s)` protocols.
Validate and reject these before the request is made — this is a security
requirement, not optional.
- **No unbounded requests:** every outbound latency-test request must have a timeout
(e.g. 10s). Never let a hung request block the server.
- **No client-side database calls:** the frontend must talk to the database only
through the backend API — never embed Firestore/Mongo credentials or SDK calls
in frontend code.
- **No secrets in source:** API keys, DB connection strings, etc. go in `.env` files
that are gitignored. Never commit `.env` or hardcode credentials in a route file.
- **No silent failures:** a failed test (timeout, DNS error, invalid URL) must still
produce a stored record with an `errorType`, not just vanish or throw an unhandled
error.
- **No premature scaling features:** don't add caching layers, queues, worker pools,
or microservices — the app is small and synchronous requests are fine.
- **No global mutable state hacks** in the frontend (no stashing data on `window`).

## 3. Error Handling Boundaries

### Backend

- All route handlers are wrapped (directly or via middleware) so thrown errors reach
a **single centralized error handler** — never let an unhandled promise rejection
crash the process.
- The centralized error handler returns a consistent JSON shape:
  ```json
  { "error": { "message": "...", "code": "..." } }
  ```
- **Never leak stack traces or internal error details to the client.** Log the full
error server-side; return a clean, generic message to the frontend.
- Categorize latency-test failures explicitly rather than treating them as generic
500s:
  - Invalid URL format → `400` with `errorType: "invalid_url"`
  - DNS resolution failure → stored as a result with `errorType: "dns"`, not a
  server error
  - Connection timeout → stored as a result with `errorType: "timeout"`
  - Connection refused → stored as a result with `errorType: "refused"`
- Database write failures (can't save a record) **are** real 500s — surface those,
don't swallow them.

### Frontend

- Every API call site must handle both the success and failure path — no bare
`.then()` without a `.catch()` (or missing try/catch in async functions).
- Failed tests should render clearly in the UI (e.g., "Timed out" badge) rather than
a blank result or a crashed component.
- Wrap chart-rendering sections in a basic error boundary so one bad dataset can't
blank the whole dashboard.

## 4. Decision Authority (what an agent can act on vs. must ask about)

To let an agent run through phases without stalling, some things are **pre-decided
and final** — build against them without asking:

- Database (MongoDB Atlas), build tool (Vite), hosting targets, test framework,
package manager — all locked in `memory.md`'s Decisions Log
- API request/response shapes — locked in `architecture.md` §7, use them exactly

An agent **should still pause and ask** before:

- Changing anything in the locked decisions list above
- Adding a new dependency not already named in this file
- Deviating from the folder structure or API contract in `architecture.md`
- Skipping ahead to a feature outside the current phase in `phases.md`

## 5. Rules for AI Coding Assistants Specifically

- **Stay inside the current phase.** Check `phases.md` and `memory.md` before
starting work — don't jump ahead and build Phase 5 features while "on" Phase 2.
- **Update `memory.md`** at the end of any meaningful chunk of work: what got done,
what file you were mid-edit on, and what's next. Treat it as a handoff note to the
next session, not a retrospective to skip.
- **Don't introduce a new library** without adding it to the tech stack table in this
file and `architecture.md`.
- **Don't refactor working code "for style"** unless asked — small project, small
diffs, easy review.
- **Ask before changing the database choice**, the folder structure, or anything in
`architecture.md`'s API contract — those are treated as agreed decisions, not
defaults to improve on unilaterally.
- **When uncertain about scope** (MVP vs. stretch feature), default to MVP per
`requirements.md` and flag the stretch idea rather than building it silently.
