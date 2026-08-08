# Acceptance Criteria

These criteria are the implementation-phase exit contract for the academic portal and three product prototypes. They are verifiable requirements, not evidence that the applications already exist. Phase 1 is complete when the six documentation files are present and readable; implementation must satisfy the remaining criteria without adding a backend, authentication, payment system, or real AI unless a later decision explicitly changes scope.

## Verification Rules

- Use fictional local fixtures and named mock scenarios from `MOCK_AI.md`.
- Mark a criterion complete only when it can be demonstrated manually or proven by an automated test/build check.
- Test at minimum 360 px mobile, 768 px tablet, and 1440 px desktop widths.
- Visible UI copy, validation, status, and recovery messages are Spanish.
- A local simulated result must never be described as a real service outcome.

## Portal: `portal-propuestas`

- [ ] The landing route presents all three proposals and states the prototype boundary.
- [ ] Each proposal has a directly reachable detail route with problem, beneficiaries, primary function, quality target, innovation, monetization hypothesis, and limits.
- [ ] The reviewer can move from the portal to each product entry route and return with browser back/forward.
- [ ] Temporary comparison supports adding, removing, duplicate prevention, empty state, and confirmation feedback.
- [ ] A filter with no matches shows an empty state and a clear reset action.
- [ ] An invalid proposal route shows a not-found recovery view with `Volver al portal`.
- [ ] The catalog remains usable when local fixture initialization is in loading or error presentation mode.
- [ ] Portal navigation and comparison are keyboard accessible with visible focus and announced status changes.
- [ ] The portal is usable without horizontal scrolling at all target widths.

## Mejora Mi Barrio

- [ ] The resident can create a local draft with approximate Santa Cruz area, category, description, and optional fixture image.
- [ ] Required-field validation identifies the field, explains the correction in Spanish, and prevents submission.
- [ ] `analyzeUrbanIssue` renders loading, high-confidence success, low-confidence, duplicate, no-match, and error scenarios.
- [ ] Loading prevents duplicate submission and does not clear the draft.
- [ ] Low-confidence results expose uncertain data and a correction path before confirmation.
- [ ] Duplicate results offer `Revisar existente`, `Continuar de todos modos`, and cancellation without creating an accidental duplicate local entry.
- [ ] The user can edit the suggested category or description and the UI labels the result as corrected.
- [ ] Error state offers retry and cancel while preserving safe draft input.
- [ ] A non-empty draft has a cancel confirmation with `Seguir editando` and `Descartar borrador`.
- [ ] Confirmation states that the summary is local and was not sent to a municipality.
- [ ] Empty local report history links to the report flow and does not imply missing real-world reports.

## Cuaderno Matemático

- [ ] The learner can enter a typed or fixture-based equation and receives an explanation that the prototype demonstrates recognition only.
- [ ] Invalid or empty equation input is identified before the mock request.
- [ ] `recognizeEquation` renders loading, high-confidence success, low-confidence, duplicate, no-match, and error scenarios.
- [ ] The recognized expression and normalized expression are visibly distinct.
- [ ] Low-confidence output identifies ambiguous tokens and requires or encourages manual correction before acceptance.
- [ ] The learner can save a local corrected exercise and receives a confirmation that it exists only in the demonstration.
- [ ] Duplicate notebook entries offer `Ver existente` and `Guardar de todos modos`.
- [ ] Error recovery offers retry, cancel, and preservation of typed input.
- [ ] A changed equation has a cancel confirmation before discarding edits.
- [ ] Empty notebook state offers a clear `Crear ejercicio` action.
- [ ] The UI does not claim general OCR, automated grading, guaranteed solving, or real tutor verification.

## Encuentra Mi Mascota

- [ ] The user can choose lost or found, enter species and traits, select an approximate area, and choose a fictional image fixture.
- [ ] Required fields are validated in Spanish before matching.
- [ ] `findPetMatches` renders loading, ranked success, low-confidence, duplicate, no-match, and error scenarios.
- [ ] Match cards show reasons and approximate location while using language such as `Posible coincidencia`, not confirmed identification.
- [ ] Low-confidence results provide correction and detail-addition actions.
- [ ] No-match state offers broader search or profile correction and does not imply the pet is absent.
- [ ] Duplicate profile state offers review, edit, or continue with explicit confirmation.
- [ ] Error recovery offers retry and cancellation while retaining safe profile fields.
- [ ] A non-empty profile has a discard confirmation; no real publication or contact is implied.
- [ ] The next-step confirmation explicitly says that no real person or organization was contacted.
- [ ] Empty search state provides a clear first-search action.

## Cross-App Navigation and Runtime

- [ ] Each app has its own Vite entry, router, and independently runnable development command after implementation.
- [ ] Direct navigation to each documented route works without requiring another app to be running.
- [ ] App boundaries are respected: no app imports another app's source, and shared UI does not contain product domain rules.
- [ ] Browser back and forward preserve route semantics within each app.
- [ ] The portal links to app entry routes without relying on an undocumented hard-coded deployment host.
- [ ] If an optional external adapter is unavailable, the local mock path remains usable and the degraded/simulated state is visible.

## Forms, Accessibility, and Responsive Quality

- [ ] Every control has a visible Spanish label or an equivalent accessible name, with helper and error text programmatically associated.
- [ ] Keyboard users can reach, operate, and exit every control, dialog, confirmation sheet, and result action in a logical order.
- [ ] Focus is visible, modal focus is managed, and focus returns to the triggering control after dismissal.
- [ ] Loading, success, validation, low-confidence, duplicate, empty, and error changes are announced without relying on color alone.
- [ ] Text and controls meet the contrast targets in `DESIGN_SYSTEM.md`.
- [ ] The layout works at 360 px, 390 px, 768 px, 1024 px, and 1440 px without horizontal overflow.
- [ ] Primary actions remain reachable on mobile, and two-column layouts collapse appropriately.
- [ ] Reduced-motion preferences do not remove information or block task completion.
- [ ] Fictional fixture data contains no real personal contact details or exact private addresses.

## Tests

- [ ] Unit tests cover each app's validation, correction, duplicate decision, and result-status mapping.
- [ ] Mock-service tests cover every scenario ID in the matrix, deterministic output, latency override, and cancellation behavior.
- [ ] Shared component tests cover keyboard operation and all applicable visual states.
- [ ] Flow tests cover the primary path and at least one recovery path for each app.
- [ ] A responsive smoke check runs at mobile and desktop viewport sizes.
- [ ] Tests assert the explicit simulated disclaimer where a result could be mistaken for AI or a real external action.

## Build and Documentation

- [ ] TypeScript strict checks pass for all apps and shared packages with no implicit `any` introduced to bypass a contract.
- [ ] Each app builds independently and the workspace build completes without importing unimplemented backend or external-service code.
- [ ] Lint and formatting checks pass using the shared configuration package.
- [ ] The six files in `docs/` remain readable, cross-reference the same app names and mock statuses, and contain no claim of a production backend, authentication, payment, or real AI.
- [ ] Implementation begins only after this documentation set has been reviewed as the Phase 1 baseline.
