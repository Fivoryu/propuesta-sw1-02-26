# ReciScan

ReciScan is a static academic prototype for Ingeniería de Software I. It presents a mobile-first marketplace and recovery network where recyclable materials become visible to nearby independent recyclers and buyers.

## Perspectives

- `Tengo material`: scan demo material, review classification, choose sell/free/negotiate, publish safely and see interested recyclers.
- `Recolecto / compro`: explore nearby opportunities, reserve listings, review grouped opportunities and follow a simulated collection route.

## Prototype Scope

All classification, prices, map positions, reservations, conversations, routes and Pro features are deterministic mock data. There is no backend, real computer vision, GPS, payment, WebSocket or live marketplace.

The marketplace distinguishes total nearby material from material included in the suggested route. Four nearby listings total 25,1 kg, while the suggested 3-stop route includes 20,9 kg.

## Architecture

Domain types live in `src/domain`, coherent fixtures in `src/fixtures`, mock services in `src/services/mock`, lightweight shared state in `src/state`, and route UI in `src/presentation`.

## Commands

```powershell
corepack pnpm --filter @propuestas/reciscan dev
corepack pnpm --filter @propuestas/reciscan test:run
corepack pnpm --filter @propuestas/reciscan typecheck
corepack pnpm --filter @propuestas/reciscan build
```
