# AGENTS.md

Guidance for developers and AI agents working in this repository. This document is the
first thing to read before modifying the workspace, and it is the reference for adding
new proposal prototypes over time.

## Do not build — reserved proposals

**LectoVoz and VoxLens are reserved by another group. NEVER scaffold, prototype, code,
or register an app for these two proposals, and never extend `docs/propuestas/lectovoz.md`
or `docs/propuestas/voxlens.md`.** If asked to build them, stop and tell the user they are
off-limits. These files exist only as reference copies of another group's ideas.

## Repository purpose

A pnpm monorepo of high-fidelity **frontend prototypes** for Ingeniería de Software I.
It contains the academic portal (`portal-propuestas`) plus one independent application
per product proposal. Everything runs locally: there is no backend, no real
authentication, no payments, and no real AI. All analysis, recognition, and matching
behavior is simulated with deterministic mock services, local fixtures, and controlled
delays.

The portal catalog starts **empty by design**: it is populated as prototypes are
created and registered. Until then the portal shows a first-class empty state instead of
dead links.

## Where the proposals live

The source of truth for every proposal is `docs/propuestas/` — not the apps. Each file
there is a Spanish 5-section proposal document (functionalities, design challenge,
innovation, monetization, tech stack) with AI or blockchain as its central component,
created with the `propuesta-innovadora` skill (see below).

Current documents:

- **braillevision.md** — braille text recognition by camera.
- **fisiolens.md** — (health proposal, see the document).
- **roomforge.md** — (design/architecture proposal, see the document).
- **estudia.md** — (education proposal, see the document).
- **vencia.md** — (see the document).
- **lectovoz.md** and **voxlens.md** — **reserved by another group, do not build**
  (see "Do not build — reserved proposals").

To create a prototype for a proposal, read `docs/propuestas/<id>.md` first, then follow
"How to add a new proposal prototype" below. The document defines the domain rules, the
mock-AI contract to simulate, and the flows the prototype must demonstrate.

## Structure

```text
apps/
  portal-propuestas/        Academic catalog, proposal details, comparison
  <proposal-id>/            One independent app per registered proposal
packages/
  ui/                       Shared accessible primitives, tokens, styles
  shared/                   Cross-app contracts and fictional fixtures
  config/                   Strict TypeScript base configs
docs/
  propuestas/               Proposal documents (source of truth for prototypes)
  ...                       Context, architecture, design, flows, mock-AI, acceptance
```

Each app owns its routes, domain rules, local state, and mock adapter. No app imports
another app's source.

## Commands (from the workspace root)

```powershell
corepack pnpm install --frozen-lockfile
corepack pnpm test:run          # Vitest + React Testing Library, zero mock latency
corepack pnpm typecheck         # TypeScript strict, project references
corepack pnpm build             # Builds every workspace package
corepack pnpm dev:portal        # http://localhost:5173
```

Run checks for one app only:

```powershell
corepack pnpm --filter @propuestas/<app-name> typecheck
corepack pnpm --filter @propuestas/<app-name> test:run
corepack pnpm --filter @propuestas/<app-name> build
```

## How to add a new proposal prototype

Adding a proposal means adding a new independent app and registering it in the portal
catalog. Follow this order; never skip the documentation step.

### 1. Start from the proposal document

Pick the proposal in `docs/propuestas/` you are prototyping and read it completely. If
no document exists for the idea, create one first with the `propuesta-innovadora` skill
(see Skills). Never invent domain rules that the document does not support, and never
build a reserved proposal (see "Do not build — reserved proposals").

Then extend `docs/` so the new prototype has the same baseline docs:

- `docs/CONTEXT.md` — problem, beneficiaries, primary function, quality, productivity,
  innovation, monetization hypothesis, prototype limits.
- `docs/ARCHITECTURE.md` — app responsibilities and mock/service separation.
- `docs/DESIGN_SYSTEM.md` — distinct visual identity (do not clone an existing theme).
- `docs/USER_FLOWS.md` — primary flow plus loading, empty, low-confidence, duplicate,
  error, correction, cancel, and confirmation states.
- `docs/MOCK_AI.md` — the deterministic mock service contract and scenario matrix.
- `docs/ACCEPTANCE_CRITERIA.md` — verifiable criteria for the new flows.

### 2. Scaffold the app

Create `apps/<proposal-id>/` as an independent Vite + React + TypeScript (strict) app:

- React Router for all navigation; browser back/forward must work.
- Tailwind CSS with the shared token conventions from `packages/ui`.
- One app-owned `src/domain/`, one `src/services/mock/`, one `src/presentation/`,
  and one `src/state/` layer. Keep files preferably under 500 lines.
- All visible UI copy in Spanish. Technical identifiers and comments in English.
- No backend, no secrets, no external service dependency, no real AI.
- Optional maps: Leaflet + React Leaflet with a styled fallback for offline use.
- Add a short `apps/<proposal-id>/README.md` (objective, flow, routes, mock data,
  commands).

The workspace glob `apps/*` picks the new app up automatically. Do not rename the
package scope; use `@propuestas/<proposal-id>`.

### 3. Register the proposal in the portal

- `packages/shared/src/contracts/proposals.ts`
  — extend `ProposalId` with the new id and extend `accent` if a new theme color is
  needed (portal supports `'teal' | 'cobalt' | 'violet' | 'amber' | 'rose'`).
- `packages/shared/src/fixtures/proposal-catalog.fixture.ts`
  — add one complete `Proposal` entry: name, summary, problem, beneficiaries,
  technologies, flow, comparison criteria, `accent`, and `appUrlEnvVar`
  (e.g. `VITE_<PROPOSAL_ID>_APP_URL`).
- Portal app URL resolution reads `proposal.appUrlEnvVar` and falls back to the
  app's default local dev port
  (`apps/portal-propuestas/src/services/app-urls.ts`); register the app's fixed
  port in `DEFAULT_DEV_PORT` (next free port, starting at 5174) and document it in
  the root `README.md` dev-server table.

### 4. Mock service contract

Implement the documented service in the new app under `src/services/mock/` using the
shared status vocabulary: `success`, `low_confidence`, `duplicate`, `no_match`,
`error`, with `scenarioId`, `latencyMs` (0 in tests), and `disclaimer: 'simulated'`.
Clone fixture data on return; support `AbortSignal` or request-id cancellation.

### 5. Tests and verification

Add Vitest + React Testing Library coverage for the primary flow and at least one
recovery path, plus the mock scenario matrix. Then run and fix:

```powershell
corepack pnpm install --frozen-lockfile
corepack pnpm test:run
corepack pnpm typecheck
corepack pnpm build
```

Do not commit until all checks pass.

## Skills

- `.pi/skills/propuesta-innovadora/SKILL.md` — guides creating new academic
  proposals (in Spanish, 5-section format) with mandatory web research and a
  central AI/blockchain component. Use it before adding a new `docs/propuestas/`
  entry or when the user asks for a new proposal idea.

## Conventions

- **Spanish UI, English artifacts.** Every user-visible string is Spanish (no Lorem
  Ipsum). Code, types, comments, docs, commit messages, and this file are English.
- **Deterministic mocks only.** No real model, OCR, image search, backend, payment,
  notification, or contact exchange. Every simulated result must be visibly labeled
  as a demonstration.
- **Distinct identities.** Each prototype must keep its own theme; do not make new
  proposals look like a variation of an existing one.
- **Accessibility and responsiveness.** Visible focus, keyboard navigation, 44px touch
  targets, aria labels/live regions, reduced-motion support, and layouts that work from
  360px to desktop without horizontal overflow.
- **No primary button without action.** Loading, empty, error, low-confidence,
  duplicate, and confirmation states are first-class layouts, not afterthoughts.
- **Commits.** Conventional Commits only, no AI attribution or co-author trailers.
