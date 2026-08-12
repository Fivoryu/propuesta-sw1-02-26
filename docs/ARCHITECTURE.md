# Frontend Monorepo Architecture

The repository is a pnpm workspace containing eight independently runnable Vite + React + TypeScript strict applications: one academic portal and seven product proposal prototypes, plus three shared packages. The architecture is frontend-only by design: local fixtures and deterministic mock services provide the behavior needed for a high-fidelity proposal presentation.

## Current Workspace Tree

The following tree represents the current workspace structure and its main architectural responsibilities.

```text
.
├── apps/
│   ├── portal-propuestas/
│   │   ├── src/
│   │   │   ├── app/                 # shell, route definitions, app-level providers
│   │   │   ├── presentation/        # pages, view models, proposal-specific UI
│   │   │   ├── domain/               # proposal catalog and comparison rules
│   │   │   ├── services/mock/        # deterministic portal content adapter
│   │   │   └── main.tsx
│   │   └── package.json              # implementation phase; not created in Phase 1
│   ├── mejora-mi-barrio/
│   │   ├── src/
│   │   │   ├── app/
│   │   │   ├── presentation/
│   │   │   ├── domain/               # report draft, validation, correction rules
│   │   │   ├── services/mock/        # analyzeUrbanIssue adapter
│   │   │   └── main.tsx
│   │   └── package.json
│   ├── cuaderno-matematico/
│   │   ├── src/
│   │   │   ├── app/
│   │   │   ├── presentation/
│   │   │   ├── domain/               # equation draft, normalization, notebook rules
│   │   │   ├── services/mock/        # recognizeEquation adapter
│   │   │   └── main.tsx
│   │   └── package.json
│   ├── encuentra-mi-mascota/
│   │   ├── src/
│   │   │   ├── app/
│   │   │   ├── presentation/
│   │   │   ├── domain/               # pet profile, duplicate, and match rules
│   │   │   ├── services/mock/        # findPetMatches adapter
│   │   │   └── main.tsx
│   │   └── package.json
│   ├── nutrivision/
│       ├── src/
│       │   ├── app/
│       │   ├── presentation/
│       │   ├── domain/               # profile, nutrition goals, and meal rules
│       │   ├── services/mock/        # analyzeFoodMock adapter
│       │   ├── state/                # local session state
│       │   └── main.tsx
│       └── package.json
│   ├── signbridge-ai/
│       ├── src/
│       │   ├── hooks/                # camera and speech browser integrations
│       │   ├── presentation/         # routes, pages, and recognition UI
│       │   ├── services/mock/        # recognizeSign and local fixtures
│       │   ├── stores/               # local recognition and history state
│       │   └── types/                # app-owned recognition contracts
│       └── package.json
│   ├── canasta-ai/
│   │   ├── src/
│   │   │   ├── domain/               # basket comparison and price rules
│   │   │   ├── fixtures/             # fictional grocery and store data
│   │   │   ├── presentation/         # routes and consumer UI
│   │   │   ├── services/mock/        # deterministic receipt and price adapters
│   │   │   └── main.tsx
│   │   └── package.json
│   └── reciscan/
│       ├── src/
│       │   ├── domain/               # listing, reservation and collection rules
│       │   ├── fixtures/             # fictional recyclable marketplace data
│       │   ├── presentation/         # seller and recycler flows
│       │   ├── services/mock/        # deterministic material and marketplace adapters
│       │   ├── state/                # local ReciScan application state
│       │   └── main.tsx
│       └── package.json
├── packages/
│   ├── ui/
│   │   ├── src/components/           # shared accessible visual primitives
│   │   ├── src/patterns/              # reusable composed interaction patterns
│   │   ├── src/tokens/                # spacing, type, color, motion, elevation
│   │   └── package.json
│   ├── shared/
│   │   ├── src/contracts/             # cross-app request, result, and status types
│   │   ├── src/fixtures/              # fictional Santa Cruz scenarios and catalog data
│   │   ├── src/mock-runtime/           # deterministic latency, scenario selection, reset
│   │   ├── src/utils/                  # small framework-agnostic utilities
│   │   └── package.json
│   └── config/
│       ├── tsconfig/                  # strict TypeScript base configurations
│       ├── eslint/                    # shared lint rules
│       ├── vite/                      # shared Vite defaults where useful
│       └── package.json
├── docs/
│   ├── CONTEXT.md
│   ├── ARCHITECTURE.md
│   ├── DESIGN_SYSTEM.md
│   ├── USER_FLOWS.md
│   ├── MOCK_AI.md
│   └── ACCEPTANCE_CRITERIA.md
├── package.json                        # workspace scripts; implementation phase
├── pnpm-workspace.yaml                 # apps/* and packages/*; implementation phase
└── pnpm-lock.yaml                      # generated after dependency setup
```

## Architectural Decisions

| Decision | Rationale | Boundary |
| --- | --- | --- |
| pnpm workspace | Provides one dependency graph and repeatable workspace commands while preserving app isolation. | No app imports another app. |
| Vite + React + TypeScript strict | Fits fast frontend prototyping and catches contract mistakes before presentation. | Strictness applies to app and shared package source. |
| Local-first behavior | The proposal must be runnable without backend credentials, network access, or paid services. | Mock data is not production data. |
| Shared UI, not shared product screens | Visual consistency should not erase the identity of each proposal. | `ui` owns primitives and tokens; apps own product composition. |
| App-owned domain logic | Each product has different validation and correction rules. | A product domain rule must not be hidden in a generic UI component. |
| Contract-first mock services | The UI can exercise success and recovery states through stable result shapes. | Adapters implement the interfaces described in `MOCK_AI.md`; no direct model calls. |
| URL-driven navigation, local app state | Navigation is inspectable and browser back/forward works without a server. | Drafts and request state reset on reload unless explicitly represented by fixtures. |

## Application Responsibilities

| App | Responsibilities | Must not own |
| --- | --- | --- |
| `portal-propuestas` | Proposal catalog, comparison view, proposal detail pages, and links into the presentation flows. | Product domain rules for the seven product apps. |
| `mejora-mi-barrio` | Report draft, approximate location, category correction, duplicate review, and urban-analysis result rendering. | Municipal submission, live maps, or a real classifier. |
| `cuaderno-matematico` | Equation input, recognition review, correction, notebook presentation, and equation-specific validation. | General-purpose OCR, grading, or a real solver service. |
| `encuentra-mi-mascota` | Lost/found profile form, candidate ranking presentation, duplicate review, and safe next-step preview. | Live contact exchange, identity verification, or a real image search service. |
| `nutrivision` | Profile setup, orientative nutrition goals, food-analysis review, manual corrections, meal registration, and local history. | Medical advice, a real vision model, backend persistence, or synchronized nutrition records. |
| `signbridge-ai` | Vocabulary selection, camera and speech controls, simulated sign recognition, correction, practice, local history, and demonstration metrics. | General translation, professional interpretation, a real recognition model, backend persistence, or stored video. |

| `canasta-ai`           | Receipt mock analysis, basket comparison, product-price history, travel estimate, and CanastaAI Plus preview.                                            | Real OCR, live supermarket integrations, payment, backend persistence, live GPS, or real route optimization.     |
| `reciscan`             | Seller/recycler modes, material mock scan, marketplace publication, reservation, collection grouping, confirmation, and ReciScan Pro preview.                  | Real computer vision, live GPS, production routing, chat, payment, or backend marketplace infrastructure.        |

## Shared Package Responsibilities

### `packages/ui`

- Owns accessible primitives such as `Button`, `TextField`, `Card`, `Dialog`, `StatusBanner`, `Skeleton`, `EmptyState`, `ErrorState`, `ConfidenceMeter`, and `Stepper`.
- Exposes design tokens and product theme hooks without owning product copy or business decisions.
- Keeps interaction states consistent: focus, loading, disabled, error, low confidence, duplicate, and confirmation.
- Does not fetch data, select mock scenarios, or import an app domain module.

### `packages/shared`

- Owns framework-agnostic contracts, status unions, fixture identifiers, approximate-location types, and deterministic mock-runtime helpers.
- Provides fictional, stable data used by more than one app, such as neighborhood labels and common UI test fixtures.
- Defines the shared shape of a request lifecycle but leaves product-specific interpretation to each app.
- Does not become a global business layer; product-specific validation remains in the owning app.

### `packages/config`

- Owns strict TypeScript base settings, lint rules, and reusable Vite configuration fragments.
- Keeps tooling behavior aligned without forcing identical application entry points or visual themes.
- Must not contain product runtime code or environment secrets.

## Layer Separation

Every app follows the same dependency direction:

```text
presentation / UI
        |
        v
simulated domain
        |
        v
mock service adapter
        |
        v
shared contracts + deterministic fixtures/runtime
```

| Layer | Contains | Does not contain |
| --- | --- | --- |
| UI and presentation | Routes, pages, form controls, loading and recovery views, view-model mapping, Spanish visible copy. | Fetch calls, fixture selection rules, or hidden product decisions. |
| Simulated domain | Draft state, validation, correction, duplicate decisions, and result interpretation. | React-specific rendering details or external service credentials. |
| Mock services | `analyzeUrbanIssue`, `recognizeEquation`, `findPetMatches`, `analyzeFoodMock`, `recognizeSign`, receipt-analysis, and recyclable-classification adapters, controlled delay, deterministic scenario outcomes. | A claim that a model or backend exists. |

Presentation may call a domain use case. A domain use case may call a typed mock adapter. No component calls `fetch`, reads an environment secret, or reaches into another app.

## Mock Data Strategy

1. Fixtures are fictional and stable. Each scenario has an explicit identifier, input, expected status, and output.
2. Scenario selection is deterministic. Tests and presentation demonstrations can request a named scenario rather than relying on random values.
3. Latency is intentional. The default delay is visible enough to demonstrate loading, but bounded and configurable for tests.
4. Data resets on reload. The prototype may keep a draft in component or app state, but it does not imply persistence.
5. Fixture IDs are safe to show. No real names, phone numbers, exact addresses, or private images are required.
6. The mock runtime can be replaced by an external adapter later because the UI consumes contracts, not implementation details.

## Routing and State

Each app owns its router and has a direct-entry route map:

| App | Core routes |
| --- | --- |
| Portal | `/`, `/propuestas/mejora-mi-barrio`, `/propuestas/cuaderno-matematico`, `/propuestas/encuentra-mi-mascota` |
| Barrio | `/`, `/reportar`, `/reportes/resumen` |
| Cuaderno | `/`, `/practicar`, `/cuaderno` |
| Mascota | `/`, `/publicar`, `/buscar`, `/coincidencias` |
| NutriVision | `/`, `/profile-setup`, `/goal`, `/home`, `/camera`, `/processing`, `/analysis`, `/nutrition-result`, `/success`, `/history`, `/meal/:id`, `/profile` |
| SignBridge AI | `/`, `/recognition`, `/practice`, `/history`, `/admin` |

Routes reflect the current prototype structure and may add an identifier segment when a view needs one. Navigation should use the app router, not hard-coded full URLs between apps. The portal links to an app entry URL supplied by the presentation environment.

Global state is intentionally limited to each app: a small reducer or equivalent local state holds the current draft, request lifecycle, correction, and confirmation. There is no cross-app global store. URL state is used for navigable views; transient UI state stays local. Shared components remain stateless unless they manage a short-lived interaction such as opening a dialog.

## Independent Execution and Optional Services

Every app must be startable and built independently from the workspace after implementation, using its own Vite entry and only the shared packages it needs. The portal must not be required to run a product app, and a product app must not require the portal.

External services are optional because the proposal is evaluated as a frontend prototype. If a future adapter is configured, the application still falls back to the local mock adapter when credentials, network access, or the service are unavailable. That fallback must expose a visible degraded or simulated state; it must not silently present external failure as a successful real-world operation.

## 6. SignBridge AI (signbridge-ai)

### Application Responsibilities

| App | Responsibilities | Must not own |
|---|---|---|
| `signbridge-ai` | Selección de vocabulario, acceso a cámara, reconocimiento simulado, texto y voz, corrección manual, práctica, historial local y métricas de demostración. | Traducción general, interpretación profesional, un modelo real, backend, autenticación o almacenamiento de video. |

### Routing and State

| Area | Definition |
| --- | --- |
| Routes | `/`, `/recognition`, `/practice`, `/history` y `/admin`; cada ruta es directa dentro de la aplicación Vite. |
| Recognition state | Zustand mantiene fase, resultado actual, alternativas, vocabulario seleccionado, manos detectadas e historial local. |
| Mock boundary | `src/services/mock/recognize-sign.ts` controla escenarios, latencia, cancelación y payloads clonados; la presentación no selecciona fixtures directamente. |
| Browser boundary | `useCamera` y `useSpeech` encapsulan `getUserMedia` y `speechSynthesis`; ninguna integración implica un servicio remoto. |

### Current Workspace Tree

```text
apps/signbridge-ai/
├── src/
│   ├── hooks/                  # camera and speech browser integrations
│   ├── presentation/           # routes, pages, and recognition UI
│   ├── services/mock/          # recognizeSign and local fixtures
│   ├── stores/                 # local recognition and history state
│   ├── types/                  # app-owned recognition contracts
│   └── main.tsx
├── index.html
├── package.json
└── vite.config.ts
```

## Current Prototype Boundary

This document describes the implemented frontend prototype workspace as it exists now.

The repository does not currently provide a shared production backend, authentication platform, payment infrastructure, external AI model, production routing service, or synchronized persistence layer.

Future production integrations require explicit decisions for privacy, security, persistence, API contracts, observability, moderation, operating cost, model quality, availability, and external-provider failure handling.