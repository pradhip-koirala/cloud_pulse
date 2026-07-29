# CloudPulse — Project Memory / Progress Log

Purpose: this file is the handoff note between sessions (human or AI). Update it
**every time meaningful work happens or pauses** — not just at the end of a phase.
Don't rewrite history in it; append.

---

## Current Status

- **Current phase:** Phase 0 — Setup & Decisions (not yet started)
- **Last updated:** _(update this date each time you edit this file)_
- **Currently working on file(s):** _(none yet)_

---

## Key Decisions Log

Record irreversible or hard-to-reverse choices here as they're made, so nobody
re-litigates them later.

| Date | Decision | Notes |
|---|---|---|
| 2026-07-29 | Database: **MongoDB Atlas (Free Tier)** via Mongoose | Simpler local dev, no service-account JSON to manage, one client library for the whole schema. **Locked — do not switch to Firestore without updating this file and `architecture.md`.** |
| 2026-07-29 | Frontend build tool: **Vite** | CRA is deprecated; Vite is the current standard for a plain React SPA. |
| 2026-07-29 | Frontend hosting: **Vercel** | Zero-config for a Vite build. |
| 2026-07-29 | Backend hosting: **Render** | Matches original plan, free web service tier. |
| 2026-07-29 | Test framework: **Vitest** (frontend) + **Jest + Supertest** (backend API tests) | Vitest pairs natively with Vite; Supertest is the standard for testing Express routes. |
| 2026-07-29 | Package manager: **npm** | Default, avoid mixing lockfiles. |

**These decisions are settled.** An agent picking up this project should treat them
as fixed and proceed — not re-ask which DB or hosting to use.

---

## Completed Phases

_(none yet — check items off in `phases.md` and log the phase here when fully done)_

- [ ] Phase 0 — Setup & Decisions
- [ ] Phase 1 — Backend Core: Latency Measurement
- [ ] Phase 2 — Database Integration
- [ ] Phase 3 — Frontend: Core Flow
- [ ] Phase 4 — Dashboard & Charts
- [ ] Phase 5 — Compare View & Polish
- [ ] Phase 6 — Testing & Hardening
- [ ] Phase 7 — Deployment & Documentation

---

## In-Progress Work

_(when you stop mid-task, leave enough detail here that anyone — including a fresh
AI session — can pick up exactly where you left off)_

- **File(s) mid-edit:** —
- **What's done in this file:** —
- **What's left:** —
- **Any blockers/questions:** —

---

## Known Issues / Blockers

_(running list — remove when fixed, don't just delete silently without noting it
was resolved)_

- None yet.

---

## Next Steps

_(short list of the very next 1-3 actions — this is what a new session should read
first)_

1. Scaffold `frontend/` (Vite + React) and `backend/` (Express) folders per
`architecture.md` §5
2. Set up MongoDB Atlas free cluster, add `MONGODB_URI` to `backend/.env`
3. Start Phase 1 — see `phases.md`

---

## Update Log

_(append-only — one line per session/update, newest at bottom)_

- `2026-07-16` — Initial docs created (requirements, architecture, rules, phases,
design, memory). No code written yet. Project not started.
