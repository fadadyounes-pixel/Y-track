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
- An Anthropic API key

### Setup

```bash
npm install

# Create environment file
echo "ANTHROPIC_API_KEY=sk-ant-..." > .env.local

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
| `ANTHROPIC_API_KEY` | Yes | Anthropic API key for all AI calls |

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
