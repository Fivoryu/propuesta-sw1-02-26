# Proposal Context and Product Boundaries

This document defines the three product proposals and the academic portal for the Ingeniería de Software I presentation. The implementation target is a responsive, navigable, high-fidelity prototype in Spanish UI copy. Phase 1 documentation is completed before implementation begins.

## Shared Context

| Boundary | Prototype decision | Future product hypothesis |
|---|---|---|
| Geography | Scenarios use approximate areas of Santa Cruz de la Sierra, such as Equipetrol, Plan 3000, Villa Primero de Mayo, Las Palmas, and the area around Parque Urbano. They do not represent verified incidents or addresses. | A product could support verified maps, municipal zones, shelter networks, or school districts after the relevant partnerships and data controls exist. |
| Data | Local fixtures and deterministic mock responses only. No personal data, live reports, or real pet records are required. | A product would need consent, retention, moderation, privacy, and data-quality policies. |
| AI | The UI demonstrates simulated analysis with controlled latency and explicit confidence states. No model, OCR engine, image search, or external AI API is used. | Real AI capabilities would require a separately evaluated service, measurable quality, safety controls, and operating cost. |
| Identity and persistence | No authentication, account, backend, payment, or cross-device persistence is assumed. | These are separate product decisions, not implicit consequences of the prototype. |
| Claims | Screens demonstrate flows and quality targets, not operational availability or social impact. | Impact, response times, match rates, learning outcomes, and revenue must be validated with users and real measurements. |

## 1. Portal de Propuestas (`portal-propuestas`)

The academic portal is the presentation surface for the three product proposals. It makes the problem, value proposition, flow, and prototype evidence easy to review without requiring an evaluator to understand the monorepo first.

| Area | Definition |
|---|---|
| Problem | Proposal information is commonly fragmented across slides, links, and separate demos, making comparison and evaluation slower. |
| Beneficiaries | Ingeniería de Software I students, instructors, reviewers, and presentation audiences. |
| Primary function | Present the three proposals, navigate to each product overview, compare core criteria, and open a prototype flow. |
| Expected quality | Clear hierarchy, fast orientation, responsive layouts, keyboard navigation, stable local content, and visible distinction between demonstrated behavior and future scope. |
| Productivity | Gives the team one reusable review surface and reduces repeated explanation during the proposal presentation. |
| Innovation | Treats proposal evidence, user flows, and acceptance criteria as navigable product content rather than a static slide-only artifact. The innovation claim is about communication, not artificial intelligence. |
| Monetization | No charge in the prototype. A future institutional edition could be evaluated as a university cohort or course package, hypothetically priced in the range of Bs 1,500-3,000 per cohort after validation. This is not a quote or current business model. |
| Prototype limits | Content is local, comparison is temporary, and proposal navigation does not prove adoption, learning improvement, or institutional integration. |
| Future product claim | A maintained academic showcase or project-evaluation platform is a possible direction, but it would require content administration, permissions, analytics, and a validated buyer. |

## 2. Mejora Mi Barrio (`mejora-mi-barrio`)

Mejora Mi Barrio explores a structured way for residents to describe neighborhood problems such as potholes, accumulated waste, damaged streetlights, or drainage concerns. A scenario may be located approximately near Plan 3000, Villa Primero de Mayo, or another Santa Cruz neighborhood without asserting that the incident is real.

| Area | Definition |
|---|---|
| Problem | Residents may report the same urban problem through unstructured channels, with incomplete location or category information and no shared view of what was submitted. |
| Beneficiaries | Residents, neighborhood committees, municipal maintenance teams, and community organizations, if a future service relationship is established. |
| Primary function | Collect an approximate location and description, simulate issue analysis, surface confidence and possible duplicates, let the resident correct the result, and confirm a local report summary. |
| Expected quality | Low-friction intake, understandable feedback, explicit uncertainty, no false promise of municipal response, and usable behavior on a phone in variable connectivity conditions. |
| Productivity | Standardizes the initial description and reduces repeated manual classification in a future workflow. The prototype measures neither staff time nor response time. |
| Innovation | Combines resident correction with a transparent assisted-classification flow. It demonstrates how automation can remain reviewable instead of silently deciding for the user. |
| Monetization | Residents are not charged in the prototype. A future municipal or institutional pilot could explore a service fee in the range of Bs 8,000-20,000 per month per district, subject to procurement, scope, and validation. This is a business hypothesis, not a production offer. |
| Prototype limits | Reports remain in local mock state; locations are approximate; duplicate detection is fixture-based; no municipality receives, verifies, prioritizes, or closes a report. |
| Future product claim | A civic reporting product might connect residents and authorized responders, but only after governance, moderation, privacy, map data, service-level expectations, and municipal agreements are designed. |

## 3. Cuaderno Matemático (`cuaderno-matematico`)

Cuaderno Matemático explores guided equation entry and recognition for learners who need help transcribing or checking a mathematical expression. Scenarios can use a school or university context in Santa Cruz without claiming an affiliation with a real institution.

| Area | Definition |
|---|---|
| Problem | Students can lose time transcribing equations or may not know whether an entered expression was interpreted correctly before attempting to solve it. |
| Beneficiaries | Secondary and university students, tutors, and teachers who need a clear practice aid. |
| Primary function | Accept a typed or fixture-based equation, simulate recognition, show the normalized expression and confidence, allow correction, and present a local notebook result. |
| Expected quality | Legible mathematical notation, predictable input validation, clear distinction between recognition and solving, and helpful recovery when the expression is uncertain or invalid. |
| Productivity | Reduces repetitive transcription in the demonstrated flow and makes correction explicit. It does not claim automated grading or guaranteed time savings. |
| Innovation | Uses confidence and user correction as part of the learning interaction rather than presenting an opaque answer. The prototype does not claim a real AI tutor. |
| Monetization | No payment is implemented. A future student plan could be tested around Bs 15-30 per month, with a separate institutional license hypothesis; prices, demand, and access policy require validation. |
| Prototype limits | Recognition uses curated local scenarios, not camera OCR or a general mathematical model. Notebook content is temporary, and the prototype does not guarantee mathematical correctness outside its fixtures. |
| Future product claim | A learning product could add real recognition, curriculum alignment, teacher tools, and progress history only after educational validation, accessibility review, and responsible evaluation. |

## 4. Encuentra Mi Mascota (`encuentra-mi-mascota`)

Encuentra Mi Mascota explores a structured lost-and-found flow for owners, rescuers, shelters, and veterinary partners. Example scenarios may refer to approximate areas such as Equipetrol, Las Palmas, Villa Primero de Mayo, Plan 3000, or the vicinity of Parque Urbano; they are fictional fixtures.

| Area | Definition |
|---|---|
| Problem | Lost-pet notices are often scattered across posts and chats, making descriptions, locations, and possible matches difficult to compare. |
| Beneficiaries | Pet owners, rescuers, shelters, neighborhood groups, and veterinary organizations that may participate in a future network. |
| Primary function | Create a fictional lost/found profile, search local mock records, rank possible matches, explain confidence, and confirm a next-step preview without contacting a real person. |
| Expected quality | Sensitive handling of contact-like information, readable match reasons, clear no-match and duplicate states, and an accessible mobile-first flow. |
| Productivity | Structures the information needed for comparison and reduces manual scanning of fixture records. It does not claim a measured increase in reunions. |
| Innovation | Demonstrates attribute-assisted matching with human review and an explicit uncertainty path instead of claiming that a photo alone identifies an animal. |
| Monetization | Basic reporting is free in the prototype. A future network could explore local sponsorships, veterinary partnerships, or optional promoted notices around Bs 5-20, subject to ethics, moderation, and validation. No payment flow exists now. |
| Prototype limits | Matches are generated from fictional local fixtures; there is no live map, notification, contact exchange, shelter integration, identity verification, or guarantee of reunion. |
| Future product claim | A real service would need consent, anti-fraud controls, moderation, safe contact exchange, image/data retention rules, and partnerships before public launch. |

## Presentation Boundary

The presentation may say that the team designed and will implement three coherent, testable product prototypes presented through one academic portal. It must not say that the prototypes already operate a municipal service, recognize arbitrary handwriting, match real pets, process payments, authenticate users, or use a real AI model. Those statements belong to a future validation roadmap only.
