# Cuaderno Matemático

Cuaderno Matemático is a Spanish-only Phase 5 product prototype for reviewing handwritten equations without pretending to provide OCR, a solver, or a real AI service. It is a local-first Vite + React + TypeScript application inside the shared pnpm workspace.

## Primary flow

1. Open `Mis cuadernos` and select a local notebook.
2. Open or create a page and draw with the pointer, touch, or mouse on the Canvas API surface.
3. Open `Modo ecuación`, choose a curated equation/scenario, and start simulated recognition.
4. Review the preserved handwriting beside the KaTeX proposal, confidence, normalized expression, alternatives, and LaTeX code.
5. Accept, correct, keep handwritten, or cancel. Accepted equations are inserted into the local page without replacing strokes.
6. Export the local notebook to Markdown, LaTeX, or the browser print dialog for a PDF-like local result.

## Routes and screens

- `/` — notebook library grouped and filtered by subject.
- `/cuadernos/nuevo` — validated notebook creation form.
- `/cuadernos/:notebookId` — notebook page list and local summaries.
- `/cuadernos/:notebookId/paginas/:pageId` — pointer-drawing editor, notes, tools, equation mode, and inserted equations.
- `/ecuacion` — loading, review/correction, duplicate, no-match, and error states.
- `/exportar` — local-only Markdown, `.tex`, and print/PDF simulation.

## Mock data and scenarios

`src/domain/equation.ts` owns five curated TeX fixtures: kinematics, quadratic formula, definite integral, notable limit, and a linear system. `src/services/mock/recognize-equation.ts` exposes `recognizeEquation(input, options)` with deterministic success, low-confidence, duplicate, no-match, and stable-error scenarios. Its presentation latency is approximately 680-780 ms; tests pass `latencyMs: 0`, and requests abort through `AbortSignal`.

## Canvas behavior

The editor uses a real `<canvas>` surface with pointer capture, mouse/touch pointer events, device-pixel-ratio scaling, pencil/highlighter rendering, and stroke-level erasing. Undo, redo, and clear operate on local stroke history. Recognition never mutates or removes the stored strokes.

## Commands

From the workspace root:

```bash
corepack pnpm --filter @propuestas/cuaderno-matematico dev
corepack pnpm --filter @propuestas/cuaderno-matematico test:run
corepack pnpm --filter @propuestas/cuaderno-matematico typecheck
corepack pnpm --filter @propuestas/cuaderno-matematico build
```

The app intentionally has no backend, authentication, payment, external image, network AI, or persistent account storage.
