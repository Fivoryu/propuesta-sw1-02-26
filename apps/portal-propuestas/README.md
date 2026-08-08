# Portal de Propuestas

## Objective

Portal de Propuestas is the academic presentation app for the three product prototypes in this workspace. It gives reviewers one local route for comparing the proposals, reading their boundaries, and opening each independent product entry point.

## Primary Flow

1. Open `/` to see the three proposal cards and the simulated-prototype boundary.
2. Open `Ver ficha` on any card to review the problem, beneficiaries, flow, quality target, innovation, monetization hypothesis, and limits.
3. Use `Agregar a comparación` and `/comparar` for a temporary comparison in the current browser session.
4. Use `Abrir prototipo` to open the configured product URL or the safe local `/` fallback.

## Routes and Screens

- `/` - proposal catalog, filter, boundary notice, and comparison summary.
- `/propuestas/:proposalId` - proposal detail and prototype entry action.
- `/comparar` - temporary comparison table with remove and empty states.
- Any unknown route - Spanish recovery view with `Volver al portal`.

## Mock Data

The catalog comes from `@propuestas/shared` and `packages/shared/src/fixtures/proposal-catalog.fixture.ts`. It contains fictional proposal content only. Comparison state is held in memory and is not saved or sent anywhere. Product links read `VITE_MEJORA_MI_BARRIO_APP_URL`, `VITE_CUADERNO_MATEMATICO_APP_URL`, and `VITE_ENCUENTRA_MI_MASCOTA_APP_URL`; an unset value falls back to `/`.

## Commands

From the workspace root:

```powershell
corepack pnpm --filter @propuestas/portal-propuestas dev
corepack pnpm --filter @propuestas/portal-propuestas test:run
corepack pnpm --filter @propuestas/portal-propuestas typecheck
corepack pnpm --filter @propuestas/portal-propuestas build
```

The app runs on port 5173 and does not require any product app to be running. Visible UI copy is Spanish; the portal has no backend, authentication, payment, real AI, or persistent evaluation data.
