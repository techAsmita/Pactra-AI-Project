# Pactra
### Know every decision before you sign.

**Founder Decision Intelligence Platform**

> Business Context + Contract Intelligence = Decision Intelligence

---

## What This Is

Pactra helps startup founders decide what to do with a contract — sign it, negotiate it, wait, or escalate — instead of just reading it. Every recommendation is personalized to the founder's actual business context (industry, funding stage, risk appetite) and stays consistent everywhere it's shown: Analysis, Decision, Negotiation, Contracts, and the Workspace dashboard all read from a single source of truth per contract.

**Current state:** the frontend is a feature-complete, fully interactive product experience with a simulated AI analysis pipeline (mocked decision scenarios, not a live model call yet). The backend, database, and real AI integration described in the docs are planned but not yet implemented — see [Roadmap](#roadmap) below.

---

## Feature Overview

- **Founder Onboarding** — company profile, funding stage, risk appetite, validated goal statement
- **Upload → Context Review → Analysis** — every contract confirms business context before analysis runs, with an inline edit drawer (no forced redirects)
- **Multi-Agent Analysis Experience** — five simulated AI agents (Legal, Financial, Growth, Negotiation, Decision) work through a contract with live status, streaming commentary, and a persisted result — revisiting a completed analysis shows the full timeline and summary, never a stale "waiting" state
- **Decision Center** — decision, confidence, risk breakdown, business impact, top risks, and top opportunities, all sourced from one analysis object per contract
- **Negotiation Hub** — auto-populated for every NEGOTIATE/ESCALATE decision: priority clauses, suggested clause revisions, talking points, and an editable email draft
- **Workspace Command Center** — needs-attention list, active negotiations, recent AI activity, and quick actions instead of a generic dashboard
- **Analytics** — decision distribution, risk breakdown, clause frequency, and negotiation rate aggregated across every analyzed agreement
- **Global Search** — contracts, clauses, decisions, risks, and company profile, all from one command palette (⌘K)
- **Settings** — one shared founder profile (name, email, company, industry, funding stage, risk appetite) persisted across the whole app
- **Contract progress indicator** — Uploaded → Analysis → Decision → Negotiation → Archived

---

## Stack

**Frontend (built):** React · Vite · TypeScript · Tailwind CSS · Framer Motion · Lucide

**Backend / AI (planned, not yet implemented):** FastAPI · Groq · MySQL · AsyncIO

**Deploy (planned):** Vercel · Render

---

## Docs

| Document | Status |
|---|---|
| 01_PRODUCT_VISION.md | ✅ Frozen |
| 02_INFORMATION_ARCHITECTURE.md | ✅ Frozen |
| 03_DESIGN_SYSTEM.md | ✅ Frozen |
| 04_COMPONENT_LIBRARY.md | ✅ Frozen |
| 06_DECISION_FLOWS.md | ✅ Frozen |

## Build Status

| Milestone | Status |
|---|---|
| Product Blueprint & Design System | ✅ Complete |
| Core Pages (Landing → Onboarding → Workspace → Upload → Analysis → Decision) | ✅ Complete |
| Full Founder Journey (end-to-end navigation, state persistence) | ✅ Complete |
| Founder Command Center, Negotiation Hub, Analytics, Global Search | ✅ Complete |
| Product Consistency Pass (shared profile, single analysis object, dashboard rework) | ✅ Complete |
| Visual & Interaction Polish (empty states, micro-interactions, data viz, responsiveness) | ✅ Complete |
| Backend API + Real AI Integration | 🔜 Not started |
| Auth / Persistent Accounts | 🔜 Not started (demo mode only — no real backend auth) |

---

## Getting Started

```bash
cd frontend
npm install
npm run dev
```

Then open the printed local URL (typically `http://localhost:5173`).

```bash
npm run build
```

builds the production bundle and type-checks the whole project.

---

## Project Structure

```
pactra/
├── docs/                  # Frozen product/design/architecture docs
├── frontend/
│   └── src/
│       ├── pages/         # Landing, Login, Onboarding, Workspace, Upload,
│       │                  # ContextReview, Analysis, DecisionCenter,
│       │                  # Negotiation, Contracts, Analytics, Settings
│       ├── components/    # Shared UI primitives + layout components
│       ├── hooks/         # useAgreements, useFounderContext, useAnalytics
│       ├── lib/           # Shared logic: sampleAnalysis, founderOptions, utils
│       ├── layouts/        # AppShell
│       └── router/        # Route definitions
├── backend/                # Planned — not yet implemented
├── database/                # Planned — not yet implemented
└── architecture/
```

---

## Roadmap

- Replace `sampleAnalysis.ts` mock scenarios with a real AI analysis pipeline
- Build the FastAPI backend and persist agreements/founder profiles server-side instead of `sessionStorage`
- Real authentication (Sign In / Sign Out currently just navigate — no session backing them)
- Document upload → real text extraction instead of simulated parsing