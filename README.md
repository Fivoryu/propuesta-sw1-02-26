# Academic Proposal Prototypes

This repository contains a local-first pnpm workspace for an Ingeniería de Software I presentation. An academic portal presents seven product proposals, and each proposal has an independently runnable Spanish-language Vite application with deterministic local fixtures and mock service states.

## Objective

The workspace turns proposal evidence into navigable, reviewable product flows. The portal helps reviewers compare the proposals, while the product apps demonstrate the primary path, uncertainty, recovery, and local confirmation boundaries.

## Proposals

- **Mejora Mi Barrio**: captures a fictional urban issue with an approximate Santa Cruz area, local evidence, simulated analysis, correction, duplicate review, and local report confirmation.
- **Cuaderno Matemático**: preserves local handwriting while presenting deterministic equation recognition, KaTeX preview, correction, and notebook insertion.
- **Encuentra Mi Mascota**: captures a fictional lost/found dog profile, previews local or fixture images, runs deterministic matching, and presents ranked candidate cards with safe review actions.
- **NutriVision**: demonstrates a mobile nutrition flow with simulated meal analysis, editable food estimates, local tracking, and explicit wellness boundaries.
- **SignBridge AI**: demonstrates accessible sign recognition through a curated vocabulary, simulated confidence, text output, local speech, and manual correction.
- **CanastaAI**: turns fictional grocery receipts into collaborative price intelligence, basket comparisons, product price exploration, and a Plus monetization preview.
- **ReciScan**: connects recyclable material owners with nearby independent recyclers through mocked scan, marketplace, reservation, collection route, and Pro flows.

The **Portal de Propuestas** is the presentation surface for these seven products. It provides proposal details, temporary comparison, and links to each app entry point.

## Technology

- React 19, TypeScript, and Vite 7
- React Router, React Hook Form, Zod, and Zustand where each product needs them
- Tailwind CSS and a shared accessible UI package
- Leaflet and React Leaflet for optional map surfaces
- KaTeX for local equation preview
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

Use `corepack pnpm test` for Vitest watch mode. The test suites use zero mock latency; they do not wait for product presentation delays.

Each app also exposes an independent test command:

```powershell
corepack pnpm --filter @propuestas/portal-propuestas test:run
corepack pnpm --filter @propuestas/mejora-mi-barrio test:run
corepack pnpm --filter @propuestas/cuaderno-matematico test:run
corepack pnpm --filter @propuestas/encuentra-mi-mascota test:run
corepack pnpm --filter @propuestas/nutrivision test:run
corepack pnpm --filter @propuestas/signbridge-ai test:run
corepack pnpm --filter @propuestas/canasta-ai test:run
corepack pnpm --filter @propuestas/reciscan test:run
```

Build or type-check one app independently with its workspace filter:

```powershell
corepack pnpm --filter @propuestas/mejora-mi-barrio typecheck
corepack pnpm --filter @propuestas/mejora-mi-barrio build
```

## Development Servers

Apps are independent and can run without another app being available:

| App                  | Command                       | Port |
| -------------------- | ----------------------------- | ---: |
| Portal de Propuestas | `corepack pnpm dev:portal`    | 5173 |
| Mejora Mi Barrio     | `corepack pnpm dev:barrio`    | 5174 |
| Cuaderno Matemático  | `corepack pnpm dev:cuaderno`  | 5175 |
| Encuentra Mi Mascota | `corepack pnpm dev:mascota`   | 5176 |
| NutriVision          | `corepack pnpm dev:nutrivision` | 5177 |
| SignBridge AI        | `corepack pnpm dev:signbridge`  | 5178 |
| CanastaAI            | `corepack pnpm dev:canasta`     | 5179 |
| ReciScan             | `corepack pnpm dev:reciscan`    | 5180 |

The portal falls back to `/` for prototype links. To run the seven product apps in parallel and link to their local ports, create `apps/portal-propuestas/.env.local` with:

```text
VITE_MEJORA_MI_BARRIO_APP_URL=http://localhost:5174/
VITE_CUADERNO_MATEMATICO_APP_URL=http://localhost:5175/
VITE_ENCUENTRA_MI_MASCOTA_APP_URL=http://localhost:5176/
VITE_NUTRIVISION_APP_URL=http://localhost:5177/
VITE_SIGNBRIDGE_AI_APP_URL=http://localhost:5178/
VITE_CANASTA_AI_APP_URL=http://localhost:5179/
VITE_RECISCAN_APP_URL=http://localhost:5180/
```

## Repository Structure

```text
apps/
  portal-propuestas/       Academic catalog, detail routes, and comparison
  mejora-mi-barrio/        Civic issue capture and local confirmation flow
  cuaderno-matematico/     Handwriting editor and equation review flow
  encuentra-mi-mascota/    Lost/found profile and candidate matching flow
  nutrivision/             Nutrition and meal-analysis prototype
  signbridge-ai/           Accessible sign-recognition prototype
  canasta-ai/              Grocery receipt and collaborative price prototype
  reciscan/                Recyclable marketplace and collection-route prototype
packages/
  shared/                  Cross-app contracts and fictional Santa Cruz fixtures
  ui/                      Accessible primitives, themes, and shared styles
  config/                  Strict TypeScript configuration
docs/                      Context, architecture, flows, design, mock, and acceptance docs
```

Each app owns its routes, domain rules, state, and mock adapter. No app imports another app's source.

## Testing and Build Boundaries

Tests cover the portal cards and navigation, each product's primary user flow, recovery states, named mock scenarios, deterministic payloads, zero-latency overrides, and cancellation or stale-request protection where the adapter exposes it. The checks are unit and jsdom-based UI tests; this repository does not claim browser automation, end-to-end execution, or visual viewport verification.

## Simulated-AI Boundary

All AI-like analysis, equation recognition, pet matching, nutrition analysis, sign recognition, receipt analysis, and recyclable-material classification are deterministic local demonstrations. They use fictional fixtures, named scenario IDs, controlled latency, and visible Spanish disclaimers. No real AI model, OCR engine, image search, backend, authentication, payment, notification, municipal submission, or real contact exchange exists in this workspace. Approximate areas are not verified addresses, and local confirmation is not an external service outcome.

Visible product copy is intentionally Spanish. Technical identifiers, source comments, and repository documentation are English unless a Spanish product name or visible UI phrase must be referenced.
