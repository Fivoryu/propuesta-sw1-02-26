# CanastaAI

CanastaAI is a static academic prototype for Ingeniería de Software I. It demonstrates how grocery receipts can become collaborative price intelligence for consumers in Santa Cruz de la Sierra.

## Scope

- Mobile-first consumer app with Inicio, Comparar, Escanear, Precios and Mi CanastaAI.
- Deterministic mock receipt analysis, basket comparison, product prices and price history.
- CanastaAI Plus monetization preview with no payment integration.
- All data, analysis and savings are demonstrative; there is no backend, OCR, live GPS, scraping or real AI.

## Main Flow

Open the app, scan the demo receipt, review normalized products, confirm prices, compare the weekly basket by strategy, explore nearby prices, review a product trend and open CanastaAI Plus.

## Architecture

Fixtures live in `src/fixtures/`, domain types in `src/domain/`, deterministic mock actions in `src/services/mock/`, and UI routes in `src/presentation/`.

## Basket Comparison Logic

The prototype calculates monetary recommendations from a local price matrix. `Mayor ahorro` chooses the lowest available price per product. `Menor distancia` chooses the closest store that can cover the complete basket. `Equilibrio` uses a simple deterministic tradeoff between unit price and store distance for the demo stores. Totals, subtotals and savings are calculated from basket quantities.

Travel information is a simplified fixture-based estimate: one-store recommendations use that store distance, and multi-store recommendations sum the unique selected stores' demo distances. It is not real route optimization or live GPS.

## Commands

```powershell
corepack pnpm --filter @propuestas/canasta-ai dev
corepack pnpm --filter @propuestas/canasta-ai test:run
corepack pnpm --filter @propuestas/canasta-ai typecheck
corepack pnpm --filter @propuestas/canasta-ai build
```
