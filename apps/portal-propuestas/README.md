# Portal de Propuestas

## Objective

Portal de Propuestas is the academic presentation hub for the proposal prototypes in
this workspace. It gives reviewers one local route for comparing the registered
proposals, reading their boundaries, and opening each independent product entry point.

Its catalog is intentionally empty: prototypes are created from the proposal documents
in `docs/propuestas/` and then registered here (see the root `AGENTS.md`, "How to add a
new proposal prototype"). Until then the portal shows a first-class empty state instead
of dead links.

## Primary Flow

1. Open `/` to see the catalog. An empty catalog shows the "El catálogo se está armando"
   empty state; once prototypes are registered, their cards appear here.
2. Open `Ver ficha` on any card to review the problem, beneficiaries, flow, quality
   target, innovation, monetization hypothesis, and limits.
3. Use `Agregar a comparación` and `/comparar` for a temporary comparison in the current
   browser session.
4. Use `Abrir prototipo` to open the configured product URL or the default local dev
   port.

## Routes and Screens

- `/` - proposal catalog (or empty-catalog state), filter, boundary notice, and
  comparison summary.
- `/propuestas/:proposalId` - proposal detail and prototype entry action (when a
  prototype with that id is registered).
- `/comparar` - temporary comparison table with remove and empty states.
- Any unknown route - Spanish recovery view with `Volver al portal`.

## Mock Data

The catalog comes from `@propuestas/shared` and
`packages/shared/src/fixtures/proposal-catalog.fixture.ts`. It starts empty, matching
the empty `ProposalId` union in `packages/shared/src/contracts/proposals.ts`. Comparison
state is held in memory and is not saved or sent anywhere. Product links read each
proposal's configured `VITE_*_APP_URL` variable; an unset value falls back to the app's
default local dev port (`http://localhost:<port>/`), defined in
`src/services/app-urls.ts` (`DEFAULT_DEV_PORT`).

## Commands

From the workspace root:

```powershell
corepack pnpm --filter @propuestas/portal-propuestas dev
corepack pnpm --filter @propuestas/portal-propuestas test:run
corepack pnpm --filter @propuestas/portal-propuestas typecheck
corepack pnpm --filter @propuestas/portal-propuestas build
```

The app runs on port 5173 and does not require any product app to be running. Visible UI
copy is Spanish; the portal has no backend, authentication, payment, real AI, or
persistent evaluation data.
