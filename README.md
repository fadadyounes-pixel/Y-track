# Y-TRACK · IdeaMap

AI-powered INDH funding application assistant for Moroccan citizens.
Route: `/ideamap` inside the Y-TRACK Next.js app.

## What IdeaMap does

IdeaMap guides a Moroccan citizen through every step needed to submit an INDH
(Initiative Nationale pour le Développement Humain) project funding application:

1. The user describes their idea in plain language
2. An AI assistant asks 4 targeted questions, then structures the project into JSON
3. IdeaMap generates a full **Business Plan**, **Budget**, and **Compliance Report**
4. The user checks off required **Documents**
5. A final **Dossier** screen shows overall readiness and lets the user download every
   generated document

Coordinators and admins get dashboards to track holders and manage the platform.

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
- PDF export (currently the export screen downloads plain-text `.txt` files)
- Mobile budget table (card layout for small screens)
- Empty states polish for Coordinator / Admin dashboards

### Medium priority
- Toast notifications when AI calls fail
- Coordinator ↔ holder assignment (today coordinators see *all* holders)
- Email notifications when a holder completes their dossier

### Low priority
- Export to Excel
- Server-side progress storage (today it's `localStorage`, per-browser)
- Admin analytics export (CSV/PDF)
- Submission status tracking (submitted / under review / approved / rejected)

---

*© 2026 IdeaMap · Initiative Nationale pour le Développement Humain*
