# Prototype User Flows

These flows define what the presentation must demonstrate. All visible copy is Spanish, all records are fictional, and every service result is local and simulated. A cancellation never claims that a real report, equation, or contact request was deleted from an external system.

## State Vocabulary

| State | Meaning in the prototype |
|---|---|
| Loading | A controlled mock delay is active; submission is disabled to prevent duplicate requests. |
| Empty | No local content or candidates are available yet. |
| Low confidence | The mock result is usable only after the user reviews or corrects it. |
| Duplicate | A similar local fixture exists; the user chooses whether to review it or continue. |
| Error | The simulated service did not complete; draft input remains when it is safe to retain. |
| Correction | The user edits the suggested value before accepting it. |
| Cancel | The user leaves or discards the current draft after a clear warning when data would be lost. |
| Confirmation | The UI summarizes the local action and states its simulated nature. |

## 1. Portal de Propuestas

### Primary flow: review a proposal

1. **Landing**: The reviewer opens `/` and sees the academic portal title, three proposal cards, and the main action `Ver propuestas`.
2. **Loading**: The shell may show a short skeleton while local catalog fixtures initialize. No network request is implied.
3. **Select**: The reviewer opens one proposal card, for example `Mejora Mi Barrio`, and sees problem, beneficiaries, flow, quality target, and prototype boundary.
4. **Compare**: The reviewer adds proposals to a temporary comparison view. A confirmation toast states `Propuesta agregada a la comparacion`.
5. **Duplicate**: Adding the same proposal again shows `Ya esta en la comparacion` and does not create a second entry.
6. **Open prototype**: `Abrir prototipo` navigates to the app entry route supplied by the presentation environment.

### Recovery flow: content and navigation

1. **Empty**: A filter with no matching proposal shows `No encontramos propuestas` and `Limpiar filtros`.
2. **Correction**: The reviewer changes or clears the filter; the catalog returns without a page reload.
3. **Cancel**: Removing a comparison item is immediate and reversible through `Deshacer`; leaving the comparison does not discard product drafts because the portal owns no product draft.
4. **Error**: An invalid proposal route shows a Spanish not-found panel with `Volver al portal`.
5. **Confirmation**: Returning to the portal preserves only the temporary comparison state for the current session. The view must not imply saved evaluation data.
6. **Low confidence**: Not applicable. Portal content is deterministic and does not expose an AI confidence score.

## 2. Mejora Mi Barrio

### Primary flow: analyze and confirm a neighborhood issue

1. **Start**: The resident opens `/reportar` and selects a fictional issue location, such as `Cerca de Villa Primero de Mayo`, from an approximate-location control.
2. **Input**: The resident chooses a category, writes a short description, and optionally selects a local fixture image. Required fields are visibly labeled in Spanish.
3. **Validation**: Empty description or missing category keeps the user on the form, marks the field, and explains the correction.
4. **Loading**: `Analizando problema...` displays during the controlled `analyzeUrbanIssue` delay. The submit action is disabled.
5. **Success**: A high-confidence result shows category, severity, summary, approximate location, and `Confianza alta`. The resident can review before proceeding.
6. **Correction**: The resident changes the suggested category or description. The result is marked as user-corrected and is no longer presented as an untouched automated decision.
7. **Confirmation**: A summary screen asks `Confirmar resumen local` and clearly states `Esto es una demostracion; no se envio a la municipalidad`.
8. **Completion**: The local confirmation view shows the fictional reference and actions `Editar` and `Nuevo reporte`.

### Recovery flow: uncertain, duplicate, or failed report

1. **Low confidence**: The result says `Necesitamos tu revision`, shows the uncertain fields, and offers `Corregir datos` or `Cancelar`.
2. **Duplicate**: A similar fixture is shown with approximate location and category. The resident can `Revisar existente`, `Continuar de todos modos`, or `Cancelar`.
3. **No match**: No comparable prior issue is shown; the resident can continue with a new local summary without treating the absence as proof that no real issue exists.
4. **Error**: `No pudimos analizar el problema` preserves the draft and offers `Reintentar` or `Cancelar reporte`.
5. **Cancel**: Leaving a non-empty draft opens a confirmation sheet with `Seguir editando` and `Descartar borrador`.
6. **Empty history**: `/reportes/resumen` initially shows `Todavia no tienes reportes en esta demostracion` and links back to `Reportar problema`.

## 3. Cuaderno Matemático

### Primary flow: recognize and review an equation

1. **Start**: The learner opens `/practicar` and chooses `Escribir ecuacion` or a fictional example fixture.
2. **Input**: The learner enters an expression such as `2x + 4 = 10`; the form explains that the prototype demonstrates recognition, not general solving.
3. **Loading**: `Reconociendo ecuacion...` appears during the controlled `recognizeEquation` delay, with the action disabled.
4. **Success**: The notebook shows the recognized and normalized expression, confidence, and available local guidance.
5. **Correction**: The learner edits the recognized expression and selects `Usar correccion`. The corrected value is labeled as user input.
6. **Confirmation**: `Guardar en cuaderno` opens a summary and confirms `Ejercicio guardado en esta demostracion`.
7. **Completion**: `/cuaderno` displays the local entry with actions to edit, remove, or start another exercise.

### Recovery flow: invalid, uncertain, duplicate, or failed equation

1. **Empty**: With no saved exercises, `/cuaderno` shows `Tu cuaderno esta vacio` and `Crear ejercicio`.
2. **Low confidence**: An uncertain recognition highlights the ambiguous portion and offers manual correction before `Aceptar`.
3. **No match**: An unparseable fixture shows `No pudimos reconocer una ecuacion` and offers `Editar entrada` or `Probar ejemplo`.
4. **Duplicate**: Saving an expression already present in the local notebook shows `Este ejercicio ya esta en tu cuaderno` and offers `Ver existente` or `Guardar de todos modos`.
5. **Error**: A simulated service error preserves the entered expression and offers `Reintentar` or `Cancelar`.
6. **Cancel**: Leaving a changed equation asks whether to `Seguir editando` or `Descartar cambios`.
7. **Correction confirmation**: After a manual edit, the UI confirms the corrected expression but does not claim that a real tutor or solver verified it.

## 4. Encuentra Mi Mascota

### Primary flow: find possible matches

1. **Start**: The owner opens `/buscar` and selects `Mascota perdida` or `Mascota encontrada`.
2. **Input**: The owner enters species, visible traits, approximate area such as `Cerca de Parque Urbano`, and a fictional image fixture when available.
3. **Validation**: Missing species or description prevents submission and explains what must be corrected.
4. **Loading**: `Buscando coincidencias...` displays during the controlled `findPetMatches` delay. The search action is disabled.
5. **Success**: Candidate cards show approximate area, visible traits, match reasons, and confidence. The UI says `Posible coincidencia`, never `Identificacion confirmada`.
6. **Review**: The owner opens a candidate and compares details before taking any next step.
7. **Confirmation**: `Solicitar siguiente paso` opens a local confirmation stating `Solicitud simulada; no se contacto a nadie`.
8. **Completion**: The owner can return to the search, edit the profile, or start a new local search.

### Recovery flow: no match, uncertain, duplicate, or failed profile

1. **Empty**: `/buscar` with no prior local searches shows `Aun no has buscado` and `Crear busqueda`.
2. **Low confidence**: The result explains that the traits are insufficient and offers `Agregar detalles`, `Corregir perfil`, or `Cancelar`.
3. **No match**: The result shows `No encontramos coincidencias en los datos simulados` and suggests broadening the approximate area or editing traits. It does not imply that the pet is not nearby.
4. **Duplicate**: Publishing a profile similar to a local fixture shows `Ya existe un aviso parecido`; the owner can `Revisar aviso`, `Editar datos`, or `Continuar de todos modos`.
5. **Error**: `No pudimos buscar coincidencias` preserves safe fields and offers `Reintentar` or `Cancelar busqueda`.
6. **Correction**: Editing species, color, size, or area reruns the search only after the user submits again; stale results are labeled as previous results.
7. **Cancel**: A non-empty profile uses `Seguir editando` and `Descartar borrador`. No real publication is removed because none exists.

## 5. NutriVision

### Primary flow: analizar y registrar una comida

1. **Inicio**: La persona abre `/` y conoce la propuesta de seguimiento nutricional mediante la acción `Comenzar`.
2. **Perfil**: Completa edad, peso, estatura, sexo biológico y nivel de actividad en `/profile-setup`; la pantalla explica que las metas son orientativas.
3. **Objetivo**: En `/goal`, elige `Ganancia muscular`, `Mantener peso`, `Reducir peso` o `Mejorar alimentación`, y puede ajustar las metas calculadas.
4. **Captura**: Desde `/home`, elige `Analizar comida`, fotografía el plato o selecciona una imagen con `Elegir de galería`.
5. **Carga**: `/processing` muestra `Analizando` y pasos como `Identificando alimentos...` durante la demora controlada del mock. La solicitud se cancela si la persona abandona la vista.
6. **Revisión**: `/analysis` muestra alimentos, confianza y proporciones como una detección visual simulada. La persona puede abrir `Editar` para corregir un alimento.
7. **Corrección**: La persona ajusta `Cantidad estimada` y confirma con `Guardar cambios`; la corrección se aplica solo al estado local de la sesión.
8. **Confirmación**: `/nutrition-result` muestra `Energía estimada`, macronutrientes y el aviso de que los valores son aproximaciones antes de `Registrar comida`.
9. **Completitud**: `/success` confirma `¡Comida registrada!` y permite `Volver al inicio`; la comida queda disponible en el historial local de la demostración.

### Recovery flow: cancelar, corregir o volver a analizar

1. **Cancel**: Si la persona sale de `/processing`, el `AbortController` cancela la solicitud simulada y no actualiza la vista con un resultado pendiente.
2. **Correction**: Desde el análisis, `Editar` abre el alimento seleccionado y `Guardar cambios` conserva la revisión humana antes del registro.
3. **Reanalysis**: La acción `Volver a analizar` devuelve a `/camera` para elegir otra imagen y comenzar una nueva demostración.
4. **Error**: Si el escenario del mock no está disponible, el servicio devuelve `No pudimos analizar la comida. Tu imagen sigue en la demostración.` con un resultado local de error; no se presenta como una estimación válida.
5. **Disclaimer**: Las vistas de procesamiento, análisis y resultado mantienen mensajes como `Esta demostración usa datos simulados; no es una predicción real.` y `Detección visual simulada`.
6. **History**: `/history` permite revisar comidas locales de hoy y de ayer; no implica sincronización, persistencia remota ni seguimiento clínico.

## Cross-Flow Verification

The implementation must be able to demonstrate at least one fixture for each result status in `MOCK_AI.md`, and every flow must expose a visible path to recover without refreshing the page. The portal may link to the apps, but each product flow must also be directly navigable and independently runnable.
