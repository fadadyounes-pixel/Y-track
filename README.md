# Y-TRACK · IdeaMap

AI-powered INDH funding application assistant for Moroccan citizens.
Route: `/ideamap` inside the Y-TRACK Next.js app.

## Context: the INDH at scale

The *Initiative Nationale pour le Développement Humain* (INDH), launched in 2005 by
HM King Mohammed VI, is Morocco's flagship social-development program. Its Phase 3
(2019–2023+) carries a **18 billion MAD** envelope and has already financed
**62,000+ projects**, reaching **12 million direct beneficiaries** — with grants of up
to **100,000 MAD** per project.

## The problem

Most project holders never get structured help preparing their file:

| Without support | |
|---|---|
| **< 30%** | of submitted dossiers are complete |
| **6–8 weeks** | average preparation time |
| **3 languages** | French / Arabic / (some) English — a real barrier for many holders |

## What IdeaMap does

IdeaMap guides a Moroccan citizen through every step needed to submit an INDH project
funding application — and turns weeks of guesswork into a structured, self-checked file:

1. The user describes their idea in plain language
2. An AI assistant asks 4 targeted questions, then structures the project into JSON
3. IdeaMap generates a full **Business Plan**, **Budget**, and **Compliance Report**
4. The user checks off required **Documents**
5. A final **Dossier** screen shows overall readiness and lets the user download every
   generated document

Coordinators and admins get dashboards to track holders and manage the platform.

## Rafiq — the AI engine

IdeaMap is a free tool for Moroccan youth and project holders, so every AI call goes
through **Rafiq** ("companion" / "guide" in Arabic), a small router in
`app/api/ai/providers.ts` that only ever talks to **free, no-card-required
providers** — there is no paid AI provider anywhere in this codebase. Rafiq tries
each task's preferred provider first and falls back automatically if one is
unconfigured, rate-limited, or fails, so a single provider's daily quota never
blocks a holder mid-dossier:

| Task | Try order | Why |
|---|---|---|
| Structured JSON (profile, plan, budget, compliance) | Gemini → OpenRouter → Groq | Gemini has a native structured-output mode |
| Short dialogue questions | Groq → Gemini → OpenRouter | Groq is fast and free |

Gemini and Groq both have genuinely free tiers generous enough to run IdeaMap
indefinitely at low-to-moderate volume; OpenRouter adds a third free model as extra
headroom. You only need **one** free key to run IdeaMap; configuring more just gives
Rafiq somewhere else to fall back to. See [Environment Variables](#environment-variables).

Every system prompt also carries the same INDH Phase 3 grounding — the real axis
names, sectors, jury weights, and document list — so whichever provider answers a
given call, the answer is anchored to the actual program, not to what a general-purpose
model happens to already know about Morocco.

## Impact

| | Without IdeaMap | With IdeaMap |
|---|---|---|
| Time to a structured dossier | 6–8 weeks | Under 1 hour |
| Language coverage | Mostly French | French, Arabic (RTL), English — natively |
| Compliance visibility | Only at submission (CPDH review) | A 0–100 score *before* the holder ever submits |

## The 4 official INDH Phase 3 axes

IdeaMap orients every project toward the axis it best serves:

1. Closing infrastructure and basic-services gaps
2. Social inclusion of vulnerable people
3. Economic inclusion of young project holders
4. Human capital development for the next generation

## Roles

| Role | Access code | What they see |
|---|---|---|
| **Holder** | CIN, e.g. `AB123456` | The 8-step workflow, resumable across visits |
| **Coordinator** | `@NAMECOD`, created by an Admin | Dashboard of all holders + progress |
| **Admin** | `@adminINDH` | Platform stats, project list, coordinator management |

## Dossier deliverables

At the Export step, a holder can download:

- Business plan
- Itemised budget
- Compliance report (score, jury grid, recommendations)
- Document checklist (required vs. optional, with checkmarks)
- Submission guide (the 6 steps to file with the DAS/CPDH, useful contacts)
- Everything combined into one dossier

These currently download as plain text — see the backlog below for real PDF/XLS/PPT
formats.

## How to run

### Prerequisites

- Node.js 18+
- At least one **free** AI provider API key — Gemini and Groq both offer genuinely
  free, no-card-required tiers (see [Environment Variables](#environment-variables))

### Setup

```bash
npm install

# Create environment file — see .env.local.example for all supported providers
cp .env.local.example .env.local

npm run dev
```

App runs at `http://localhost:3000`, IdeaMap at `http://localhost:3000/ideamap`.

### Build for production

```bash
npm run build
npm start
```

## Try it

- **Holder**: enter any CIN-shaped code, e.g. `AB123456`, and a name to sign up.
- **Coordinator**: coordinators must be created first from the Admin dashboard
  (`@adminINDH`), then log in with their `@NAMECOD` code.
- **Admin**: log in with `@adminINDH`.

## Environment variables

| Variable | Required | Description |
|---|---|---|
| `GEMINI_API_KEY` | At least one of these three | Free — Rafiq's first choice for JSON steps |
| `GROQ_API_KEY` | At least one of these three | Free — Rafiq's first choice for dialogue questions |
| `OPENROUTER_API_KEY` | At least one of these three | Free — extra fallback headroom for either step type |
| `GEMINI_MODEL` | No | Overrides the default `gemini-2.5-flash` |
| `GROQ_MODEL` | No | Overrides the default `llama-3.3-70b-versatile` |
| `OPENROUTER_MODEL` | No | Overrides the default `qwen/qwen3-235b-a22b:free` |

## Feature backlog

### High priority
- Real PDF/XLS export (currently the export screen downloads plain-text `.txt` files)
- Auto-generated jury presentation (PPT) — a ready-to-present deck for the CPDH
- Mobile budget table (card layout for small screens)
- Empty states polish for Coordinator / Admin dashboards

### Medium priority
- Toast notifications when AI calls fail
- Coordinator ↔ holder assignment (today coordinators see *all* holders)
- Email notifications when a holder completes their dossier
- Official INDH API connection

### Low priority
- Server-side progress storage (today it's `localStorage`, per-browser)
- Admin analytics export (CSV/PDF)
- Submission status tracking (submitted / under review / approved / rejected)
- Coordinator ↔ holder messaging

---

*© 2026 IdeaMap · Initiative Nationale pour le Développement Humain*
