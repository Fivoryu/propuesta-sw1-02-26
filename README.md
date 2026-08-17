# Academic Proposal Prototypes

This repository contains a local-first pnpm workspace for an Ingeniería de Software I
presentation. The **Portal de Propuestas** is the academic presentation surface, and
each proposal documented in `docs/propuestas/` can become an independently runnable
Spanish-language Vite prototype with deterministic local fixtures and mock service
states.

## Objective

The workspace turns proposal evidence into navigable, reviewable product flows. The
portal helps reviewers compare the proposals, while each registered prototype
demonstrates the primary path, uncertainty, recovery, and local confirmation
boundaries.

## Proposals

The proposals themselves live as documents in `docs/propuestas/` (Spanish, 5-section
format created with the `propuesta-innovadora` skill, with AI or blockchain as a
central component). Prototypes are built from those documents by following
`AGENTS.md` → "How to add a new proposal prototype".

Current documents: `braillevision.md`, `estudia.md`, `fisiolens.md`, `roomforge.md`,
`vencia.md` — plus `lectovoz.md` and `voxlens.md`, which are reserved by another group
and must never be prototyped (see `AGENTS.md`, "Do not build — reserved proposals").

The **Portal de Propuestas** is the presentation surface for the registered prototypes.
Its catalog is intentionally empty until new prototypes register their entries (shared
contract + fixture + dev-port map). With an empty catalog it shows a first-class empty
state instead of dead links.

## Technology

- React 19, TypeScript, and Vite 7
- React Router, React Hook Form, Zod, and Zustand where each prototype needs them
- Tailwind CSS and a shared accessible UI package
- Leaflet / React Leaflet and KaTeX where a prototype needs them (optional, per proposal)
- Vitest, jsdom, React Testing Library, jest-dom, and user-event for tests

## Requirements

- Node.js 22.23.0 or a compatible Node 22 release
- Corepack enabled
- pnpm 11.9.0 through `corepack pnpm`

Check the active versions:

```powershell
node --version
corepack pnpm --version
```

## Installation

The normal installation uses the lockfile:

```powershell
corepack pnpm install --frozen-lockfile
```

For an offline verification when the pnpm store is populated:

```powershell
corepack pnpm install --offline --frozen-lockfile
```

## Commands

Run from the workspace root:

```powershell
corepack pnpm test:run
corepack pnpm typecheck
corepack pnpm build
```

Use `corepack pnpm test` for Vitest watch mode. The test suites use zero mock latency;
they do not wait for product presentation delays.

Each app exposes its own independent commands through its workspace filter, for example:

```powershell
corepack pnpm --filter @propuestas/portal-propuestas test:run
corepack pnpm --filter @propuestas/<app-name> typecheck
corepack pnpm --filter @propuestas/<app-name> build
```

## Development Servers

Apps are independent and can run without another app being available:

| App                  | Command                    | Port |
| -------------------- | -------------------------- | ---: |
| Portal de Propuestas | `corepack pnpm dev:portal` | 5173 |

New prototypes use the next free port (5174+) and register it in
`apps/portal-propuestas/src/services/app-urls.ts` (`DEFAULT_DEV_PORT`), documenting it
here in the table. The portal resolves each registered prototype's local dev port by
default (`http://localhost:<port>/`). To override the default links, create
`apps/portal-propuestas/.env.local` with `VITE_<PROPOSAL_ID>_APP_URL` variables.

## Repository Structure

```text
apps/
  portal-propuestas/        Academic catalog, detail routes, and comparison
  <proposal-id>/            One independent Vite prototype per registered proposal
packages/
  shared/                  Cross-app contracts and fictional fixtures
  ui/                      Accessible primitives, themes, and shared styles
  config/                  Strict TypeScript configuration
docs/
  propuestas/              Proposal documents (source of truth for prototypes)
  CONTEXT.md, ARCHITECTURE.md, ...   Baseline docs per prototype when built
```

Each app owns its routes, domain rules, state, and mock adapter. No app imports another
app's source.

## Testing and Build Boundaries

Tests cover the portal navigation and catalog states (currently the empty-catalog state
plus comparison and not-found recovery). Each registered prototype adds its own
primary-flow, recovery-state, and mock-scenario tests. The checks are unit and
jsdom-based UI tests; this repository does not claim browser automation, end-to-end
execution, or visual viewport verification.

## Simulated-AI Boundary

All AI-like behavior in the prototypes (analysis, recognition, matching,
classification, and any simulated confidence) is a deterministic local demonstration.
It uses fictional fixtures, named scenario IDs, controlled latency, and visible Spanish
disclaimers. No real AI model, OCR engine, image search, backend, authentication,
payment, notification, or external contact exchange exists in this workspace. Local
confirmation is not an external service outcome.

Visible product copy is intentionally Spanish. Technical identifiers, source comments,
and repository documentation are English unless a Spanish product name or visible UI
phrase must be referenced.
