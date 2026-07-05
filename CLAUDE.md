# Y-TRACK / IdeaMap — Design Brief

This file is auto-loaded by Claude Code. Keep it in sync with what's actually in the repo.

## What this is

Y-TRACK is a Next.js 16 (App Router, TypeScript) app. Its flagship feature is **IdeaMap**,
an AI-powered assistant that walks a Moroccan citizen through building an INDH
(Initiative Nationale pour le Développement Humain) funding application — from a raw idea
to a full business plan, budget, compliance report, document checklist, logo, and a
downloadable jury presentation.

- Landing page: `app/page.tsx`
- IdeaMap: `app/ideamap/` (route `/ideamap`)
- AI proxy: `app/api/ai/route.ts` → `app/api/ai/providers.ts` ("Rafiq" — keeps all
  provider API keys server-side only)

## Tech stack

| Layer | Choice |
|---|---|
| Framework | Next.js 16 (App Router) |
| Language | TypeScript |
| Styling | Inline React styles (no Tailwind/CSS modules) — see `app/ideamap/lib/ui.ts` for shared style snippets and `app/ideamap/lib/constants.ts` for design tokens (`COLORS`, `RADIUS`) |
| AI engine | "Rafiq" (`app/api/ai/providers.ts`) — routes each call to Gemini / Groq / OpenRouter by task, with automatic fallback. All three are free tiers; there is no paid AI provider in this codebase. See its header comment for the routing rules |
| Fonts | Poppins (Latin) · Tajawal (Arabic), loaded via Google Fonts in `app/layout.tsx` |
| Analytics | `@vercel/analytics` |
| Persistence | Browser `localStorage` (`app/ideamap/lib/storage.ts`) — no backend yet, see Feature Backlog |

## IdeaMap architecture

```
app/ideamap/
├── page.tsx                 # orchestrator: auth, AI call sequencing, step routing
├── components/
│   ├── AuthGate.tsx          # CIN / @CoordCOD / admin code login+signup
│   ├── Shell.tsx              # sidebar + topbar layout for the 9-step workflow
│   ├── Step*.tsx               # one component per workflow step (incl. StepLogo.tsx)
│   ├── CoordinatorDashboard.tsx
│   └── AdminDashboard.tsx
└── lib/
    ├── types.ts       # HolderState, ProjectProfile, BusinessPlan, Budget, ComplianceReport, LogoState…
    ├── constants.ts   # design tokens, INDH domain facts (sectors, pillars, jury grid, documents)
    ├── i18n.ts        # TX dictionary (fr/ar/en) + t(), pillarLabel(), dir(), fontFamily()
    ├── ai.ts          # client ai() fetch helper (chat|json mode) + system-prompt builders (all grounded via indhContext()) + parseJSON()
    ├── logo.ts        # renderLogoSvg() (generated logo badge), rasterizeImage(), getLogoPngDataUrl()
    ├── pptx.ts         # buildJuryPptx() — dynamically imports pptxgenjs, builds the jury deck
    ├── ui.ts          # shared inline-style objects (card, btnPrimary, input, …)
    ├── storage.ts     # localStorage-backed holder/coordinator persistence
    └── utils.ts       # readinessPercent(), stepProgressPercent(), formatMAD(), fileToDataUrl()
```

### Auth & roles

- Holder: CIN format `/^[A-Z]{2}\d{3,}$/` (e.g. `AB123456`). New CIN → signup (name only, no
  password). Known CIN → resumes saved progress.
- Coordinator: `/^@[A-Za-z]{2,}COD$/i` (e.g. `@KHALIDCOD`). Must already exist in
  `listCoordinators()` — coordinators are created by an Admin, never self-signup.
- Admin: hardcoded `@adminINDH`.

### The 9-step workflow (`app/ideamap/page.tsx`)

`idea → dialogue → profile → plan → budget → compliance → documents → logo → export`

AI calls are triggered by a `useEffect` keyed on `holder.step`, not by button clicks directly —
buttons just advance `step`, and the effect fires the right AI call if the target data
(`proj` / `plan` / `comp`) isn't there yet. This keeps step components pure/presentational.
The `logo` step is the one exception: generating one is a deliberate user action
(`onGenerate`), not automatic on step entry, since uploading one's own logo is equally valid.

Dialogue is 5 sequential AI calls: calls 1–4 ask one short question each (plain text,
`mode: "chat"`), call 5 returns the structured `ProjectProfile` JSON (`mode: "json"`).
See `dialogueSystemPrompt()` in `lib/ai.ts` — the branch is `questionNumber < 5` (ask)
vs `>= 5` (summarize).

### Documents & logo

At the `documents` step, each row can hold an uploaded file (`HolderState.uploads`,
keyed by document id) alongside its checked state — attaching a file auto-checks it.
Files are read client-side via `fileToDataUrl()` and capped at `MAX_UPLOAD_BYTES`
(1.5 MB) to protect the `localStorage` quota; nothing is sent to a server.

At the `logo` step, a holder either uploads their own image or has Rafiq generate a
`LogoConcept` (initials, two colors, one of `LOGO_ICONS`, a tagline) via a `json`-mode
call, rendered client-side as an SVG badge by `renderLogoSvg()` — no image-generation
model involved, so it's free and never blocked by an image API's rate limit.

### Internationalization

Three languages: French (default), Arabic (RTL), English. All UI strings live in the `TX`
object in `lib/i18n.ts`, keyed by language then string id. **Every new string needs all
three language keys.** Use `t(lang, key)`, `dir(lang)` for `rtl`/`ltr`, and `fontFamily(lang)`
to switch to Tajawal for Arabic.

## INDH domain facts (`lib/constants.ts`)

- Phase 3 (2019–2023+): 18B MAD envelope, 62,000+ projects financed, 12M direct beneficiaries
- Max grant per project: 100,000 MAD · INDH 85% / holder 15% (in practice 80–90% / 10–20%)
- 4 official strategic axes (`PILLARS`): infrastructure & basic services, social inclusion of
  vulnerable people, economic inclusion of youth, human capital development
- 10 eligible sectors, 12 documents (8 required + 4 optional)
- Jury grid: impact 25, viability 20, relevance 20, management 15, sustainability 10,
  innovation 10 (100 pts total)

## Environment variables

| Variable | Required | Description |
|---|---|---|
| `GEMINI_API_KEY` | At least one of these three | Free tier — Rafiq's first choice for JSON steps |
| `GROQ_API_KEY` | At least one of these three | Free tier — Rafiq's first choice for dialogue questions |
| `OPENROUTER_API_KEY` | At least one of these three | Free tier — third fallback for either step type |

## Known gaps / backlog

No real backend yet — holder/coordinator data (including uploaded document files and
logos, stored as data URLs) lives in `localStorage`, so it's per-browser, not shared
across devices, and coordinator dashboards show *all* holders (there's no
holder→coordinator assignment mechanism). Most dossier "export" items still download
as plain text, not PDF/Excel — the jury presentation is the one exception, generated
as a real `.pptx` via `lib/pptx.ts`. See the README for the fuller backlog list.
