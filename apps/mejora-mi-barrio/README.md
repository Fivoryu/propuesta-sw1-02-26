# Mejora Mi Barrio

## Objective

Mejora Mi Barrio is a local-first Phase 4 product prototype for documenting fictional urban issues in Santa Cruz de la Sierra. It demonstrates evidence preview, approximate locations, transparent simulated analysis, user correction, duplicate review, local confirmation, and a report timeline without a backend, authentication, municipal submission, payment, external AI, or real personal data.

## Primary Flow

1. Start on the map at `/` and inspect fictional nearby reports.
2. Open `/reportar`, choose an approximate area, category, description, evidence fixture or local image, and a named demonstration scenario.
3. `/analisis` runs the cancellable 1200-2200 ms mock analysis.
4. Review `/resultado`, `/duplicado`, or the error path. Low confidence requires a correction before continuing.
5. `/confirmar` creates a local-only report record.
6. Inspect the simulated timeline at `/reportes/:reportId` or the local history at `/mis-reportes`.

## Routes and Screens

- `/` - map, OpenStreetMap layer, fallback notice, filters, legend, and accessible report list.
- `/reportar` - validated report form with local upload preview and fixture picker.
- `/analisis` - cancellable loading state with reduced-motion-safe progress.
- `/resultado` - detected region, category, severity, confidence, correction editor, and simulated disclaimer.
- `/duplicado` - possible duplicate review with existing report details.
- `/confirmar` - local confirmation summary and municipal-boundary disclaimer.
- `/reportes/:reportId` - fictional detail view and status timeline.
- `/mis-reportes` - local session history with category and status filters.

## Mock Data and Scenarios

`src/domain/urban-fixtures.ts` contains inline SVG evidence fixtures and fictional report records. `src/services/mock/analyze-urban-issue.ts` implements `analyzeUrbanIssue` with typed discriminated results for:

- `urban-success-high`
- `urban-low-confidence`
- `urban-duplicate`
- `urban-no-match`
- `urban-error`

The service accepts a latency override and `AbortSignal`, clones result data, and never mutates fixture sources. Its presentation latency is 1200-2200 ms; tests pass `latencyMs: 0`. The Zustand store holds only the current draft, analysis, correction, and confirmed records for the browser session.

## Commands

From the workspace root:

```powershell
corepack pnpm install --offline --frozen-lockfile
corepack pnpm --filter @propuestas/mejora-mi-barrio dev
corepack pnpm --filter @propuestas/mejora-mi-barrio test:run
corepack pnpm --filter @propuestas/mejora-mi-barrio typecheck
corepack pnpm --filter @propuestas/mejora-mi-barrio build
```

The app uses React, Vite, TypeScript strict mode, React Router, Tailwind, Lucide, React Hook Form, Zod, Motion, Zustand, Leaflet, and React Leaflet. OpenStreetMap tiles are optional for the local demo; the styled map fallback and report list remain usable without network access.
