# Agent Instructions — Read This First

This file is the entry point for any AI agent working in this repo. Read it, then
read the files it points to, **before writing any code.**

## Read in this order

1. `docs/memory.md` — current status, locked decisions, what's in progress right now.
   **Always check this first** — it tells you where the last session left off.
2. `docs/phases.md` — find the current phase, read its task list and "Verify" commands.
3. `docs/rules.md` — binding constraints on libraries, error handling, and what you
   can decide vs. must ask about.
4. `docs/architecture.md` — folder structure, tech stack, exact API contract.
5. `docs/design.md` — visual/UI rules, if the task touches frontend styling.
6. `docs/requirements.md` — background on scope if anything is ambiguous.

## Operating rules (short version — `docs/rules.md` is authoritative)

- Work on **one phase at a time**, in order, per `docs/phases.md`. Don't jump ahead.
- The tech stack and API shapes in `docs/architecture.md` are **locked** — build
against them exactly, don't invent alternative field names or libraries.
- Decisions already made (database, build tool, hosting, test framework — see
`docs/memory.md`'s Decisions Log) are final. Don't re-ask about these.
- Do ask before: adding a new dependency, changing the folder structure, changing
the API contract, or working outside the current phase.
- Run the phase's **Verify** commands (in `docs/phases.md`) before considering a
task done — don't just eyeball the checklist.
- **Update `docs/memory.md`** at the end of your session (or when pausing mid-task):
what got done, which file you were mid-edit on, what's next. This is how the next
session — yours or another agent's — knows where to pick up.

## If something in the docs conflicts

Trust `docs/memory.md` for "what's actually true right now" over the other docs if
they've drifted — it's the living log. Flag the conflict there so a human can
reconcile it, rather than silently picking one interpretation.
