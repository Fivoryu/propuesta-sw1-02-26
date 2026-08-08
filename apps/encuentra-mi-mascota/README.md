# EncuentraMiMascota

## Objective

EncuentraMiMascota is a Spanish-only, local-first Phase 6 product prototype for organizing fictional lost-and-found dog reports around approximate Santa Cruz de la Sierra areas. It demonstrates careful profile capture, photo review, deterministic candidate matching, protected next-step messaging, and a calm reunion state without a backend, authentication, real contact exchange, notifications, image search, or AI service.

## Primary flow

The main flow is:

1. Start at `/` and choose a lost or found dog report.
2. Complete the validated profile at `/reportar/perdida` or `/reportar/encontrada`.
3. Add front, profile, and full-body photos at `/fotos`, using local fixtures or browser-local file previews.
4. Review the profile and choose a named demonstration mode at `/resumen`.
5. Run the cancellable mock search at `/buscando`.
6. Review ranked or recovery results at `/coincidencias` and compare a candidate at `/coincidencias/:matchId`.
7. Preview a protected canned message at `/contacto`, then optionally mark the local case as reunited at `/reencuentro`.

## Routes and screens

- `/`: reassurance-oriented home, primary report actions, nearby map/list, trust boundary, and update-search CTA.
- `/cerca`: Leaflet map plus filters for report type, distance, date, size, and color.
- `/reportar/perdida`, `/reportar/encontrada`: Zod and React Hook Form profile intake with discard confirmation.
- `/fotos`: multi-photo workflow with real local previews, fixture illustrations, slot guidance, replacement, removal, and retry.
- `/resumen`: profile/photo/location review and named scenario selection.
- `/buscando` and `/analisis`: controlled loading, progress, cancellation, and duplicate-request protection.
- `/coincidencias`: success, low-confidence, duplicate, no-match, and processing-error layouts.
- `/coincidencias/:matchId`: side-by-side local photo comparison and safe review actions.
- `/contacto`: canned protected-message preview with no contact details or outbound action.
- `/reencuentro`: calm local confirmation with an explicit prototype boundary.

## Fixtures and scenarios

`src/domain/pet.ts` owns the profile contracts, validation schema, local inline SVG illustrations, approximate Santa Cruz locations, nearby reports, and candidate fixtures. `src/services/mock/find-pet-matches.ts` exposes the documented `findPetMatches(input, options?)` adapter with cloned results, a presentation latency of approximately 620-780 ms, `latencyMs: 0` test overrides, `AbortSignal`, request-id guards, and these deterministic scenarios:

- `pet-success-ranked`: high and medium candidates, including 0.89 and 0.64 scores with visible reasons.
- `pet-low-confidence`: candidates with insufficient traits and correction guidance.
- `pet-duplicate`: a similar local lost/found profile requiring an explicit continue decision.
- `pet-no-match`: an empty candidate list with broadening guidance.
- `pet-error`: stable `MOCK_MATCHING_UNAVAILABLE` recovery output.

## Map and image behavior

The map uses a defined-height `MapContainer`, OpenStreetMap `TileLayer`, fictional marker coordinates, and popup links. Tile errors expose a styled textual list fallback and the nearby list remains available regardless of network state. Photo fixtures are inline SVG data URLs, so the complete demo works offline. Uploaded images use `URL.createObjectURL`; the Zustand store revokes replaced, removed, discarded, and reset upload URLs.

## Commands

From the workspace root:

```bash
corepack pnpm install --offline --frozen-lockfile
corepack pnpm --filter @propuestas/encuentra-mi-mascota dev
corepack pnpm --filter @propuestas/encuentra-mi-mascota test:run
corepack pnpm --filter @propuestas/encuentra-mi-mascota typecheck
corepack pnpm --filter @propuestas/encuentra-mi-mascota build
corepack pnpm typecheck
```
