# Project guidance for Claude

## Git identity — CRITICAL

- **All commits and pushes MUST be made as the `pmontecchiarini` GitHub account.** This repo lives at `github.com/pmontecchiarini/ai-search-engine-readiness`.
- **NEVER commit or push using the `pato1025` / `patricia2510` account** (or any account other than `pmontecchiarini`), even if that account is the active `gh` login or has valid credentials cached. If `pmontecchiarini` auth is unavailable, STOP and ask — do not fall back to another account.
- Before pushing, if unsure which identity will be used, verify with `gh auth status` / `git config user.email` and confirm it resolves to `pmontecchiarini`.

## Project layout

- `frontend/` — Next.js 16 App Router app (React 19, Tailwind v4, TypeScript). The entire results UI is in `frontend/app/page.tsx`; metric copy (EN/ES) in `frontend/app/constants/metrics.ts`; phase groupings + scoring in `frontend/app/constants/phases.ts`.
- `backend/` — FastAPI audit engine. Returns a flat `{ [checkKey]: boolean }` map of 10 checks.

## Running the backend locally

The venv's console-script shebangs are stale (venv was created at a different path). Launch uvicorn as a module instead of the `uvicorn` script:

```bash
cd backend
../venv/bin/python -m uvicorn main:app --host 127.0.0.1 --port 8000
```
