# Deterministic Mock AI Contracts

This document defines local service contracts for the prototype. The functions simulate response shapes and uncertainty; they do not invoke artificial intelligence, OCR, image recognition, a backend, or an external API. The UI must show the Spanish disclaimer `Esta demostracion usa datos simulados; no es una prediccion real.` wherever a user could mistake the result for a production decision.

## Runtime Rules

- Scenario selection is explicit and deterministic. A fixture or test may pass `scenarioId`; production-like prototype screens use a known default fixture rather than random selection.
- The shared baseline is 650 ms. Product adapters keep their own presentation ranges: urban analysis takes 1200-2200 ms, equation recognition takes approximately 680-780 ms, and pet matching takes approximately 620-780 ms. Tests must pass `latencyMs: 0` and never wait for the presentation delay.
- A request has one terminal result: `success`, `low_confidence`, `duplicate`, `no_match`, or `error`.
- A second submission is disabled while a request is loading. Cancellation prevents the pending result from updating the view.
- The mock runtime returns cloned fixture data so a correction cannot mutate the source fixture.
- Error scenarios are controlled failures with a stable error code and Spanish-safe user message. No stack trace or secret is shown in the UI.
- Confidence is a fixture value between 0 and 1. It is an explanation aid, not a calibrated probability or quality guarantee.

## Shared Types

```ts
type MockStatus =
  | "success"
  | "low_confidence"
  | "duplicate"
  | "no_match"
  | "error";

type MockOptions = {
  scenarioId?: string;
  latencyMs?: number;
  signal?: AbortSignal;
};

type MockMeta = {
  scenarioId: string;
  status: MockStatus;
  latencyMs: number;
  disclaimer: "simulated";
};
```

The implementation may use a discriminated union so a successful payload cannot accidentally require error fields. It must preserve `MockMeta` in every result.

## `analyzeUrbanIssue`

### Signature

```ts
analyzeUrbanIssue(
  input: UrbanIssueInput,
  options?: MockOptions,
): Promise<UrbanIssueResult>;
```

### Example input

```json
{
  "description": "Hay un bache grande cerca de la parada del barrio",
  "categoryHint": "street_damage",
  "approximateLocation": {
    "label": "Cerca de Villa Primero de Mayo",
    "areaId": "sc-villa-primero-de-mayo"
  },
  "fixtureImageId": "urban-pothole-01"
}
```

### Example output

```json
{
  "meta": {
    "scenarioId": "urban-success-high",
    "status": "success",
    "latencyMs": 1200,
    "disclaimer": "simulated"
  },
  "analysis": {
    "category": "street_damage",
    "severity": "high",
    "summary": "Posible dano en la via que requiere revision",
    "confidence": 0.92,
    "duplicateCandidates": [],
    "suggestedCorrections": []
  }
}
```

`duplicateCandidates` contains local fixture references and approximate labels only. It must never imply that a municipality has received or verified the report.

## `recognizeEquation`

### Signature

```ts
recognizeEquation(
  input: EquationInput,
  options?: MockOptions,
): Promise<EquationRecognitionResult>;
```

### Example input

```json
{
  "source": "typed_fixture",
  "expression": "2x + 4 = 10",
  "fixtureId": "equation-linear-01"
}
```

### Example output

```json
{
  "meta": {
    "scenarioId": "equation-success-high",
    "status": "success",
    "latencyMs": 680,
    "disclaimer": "simulated"
  },
  "recognition": {
    "recognizedExpression": "2x + 4 = 10",
    "normalizedExpression": "2*x + 4 = 10",
    "confidence": 0.96,
    "ambiguousTokens": [],
    "suggestedCorrection": null
  }
}
```

The contract covers recognition and normalization only. It does not promise a general solver, proof, grade, or correct answer for arbitrary mathematics.

## `findPetMatches`

### Signature

```ts
findPetMatches(
  input: PetSearchInput,
  options?: MockOptions,
): Promise<PetMatchResult>;
```

### Example input

```json
{
  "caseType": "lost",
  "species": "dog",
  "traits": ["small", "white chest", "blue collar"],
  "approximateLocation": {
    "label": "Cerca de Parque Urbano",
    "areaId": "sc-parque-urbano"
  },
  "fixtureImageId": "pet-lost-01"
}
```

### Example output

```json
{
  "meta": {
    "scenarioId": "pet-success-ranked",
    "status": "success",
    "latencyMs": 700,
    "disclaimer": "simulated"
  },
  "matches": [
    {
      "fixtureId": "pet-found-03",
      "approximateLocation": "Cerca de Equipetrol",
      "score": 0.84,
      "confidence": "medium",
      "matchReasons": ["especie", "rasgo visible", "zona aproximada"]
    }
  ]
}
```

Scores rank fictional candidates; they do not identify an animal or provide a safe-contact guarantee.

## analyzeFoodMock

### Signature

```ts
analyzeFoodMock(
  image?: string,
  options?: FoodAnalysisOptions,
): Promise<FoodAnalysisResult>;
```

### Example input

```json
{
  "image": "fixture-plate-01",
  "scenarioId": "food-success-high"
}
```

### Example output

```json
{
  "scenarioId": "food-success-high",
  "status": "success",
  "latencyMs": 2800,
  "disclaimer": "simulated",
  "calories": 610,
  "protein": 52,
  "carbs": 66,
  "fats": 16,
  "foods": [
    { "name": "Arroz cocido", "grams": 175, "confidence": 96 },
    { "name": "Pechuga de pollo", "grams": 135, "confidence": 92 }
  ]
}
```

El servicio devuelve alimentos clonados para que la corrección de una porción no modifique el fixture. Los escenarios `food-low-confidence`, `food-duplicate` y `food-no-match` conservan el payload demostrativo y cambian el estado para que el contrato pueda ejercitar cada camino. Un escenario desconocido, incluido `food-error`, devuelve `MOCK_ANALYSIS_UNAVAILABLE` sin presentar datos nutricionales como válidos.

## 6. SignBridge AI (signbridge-ai)

## recognizeSign

### Signature

```ts
recognizeSign(
  input?: RecognizeSignInput,
  options?: MockOptions,
): Promise<RecognizeSignResult>;
```

### Example input

```json
{
  "vocabularyId": "greetings",
  "scenarioId": "sign-success-high"
}
```

### Example output

```json
{
  "scenarioId": "sign-success-high",
  "status": "success",
  "latencyMs": 1700,
  "disclaimer": "simulated",
  "sign": {
    "text": "Hola",
    "confidence": 0.96,
    "description": "Mano abierta a la altura de la sien, pequeño movimiento de saludo."
  },
  "alternatives": []
}
```

The service clones sign and alternative fixtures on every response. `sign-low-confidence` returns alternatives for manual review, `sign-duplicate` returns a recognized fixture with the duplicate status, and `sign-no-match` returns no usable sign so the presentation can show its existing retry state. `sign-error` and unknown scenarios return `MOCK_RECOGNITION_UNAVAILABLE` without a recognition payload.

## Scenario Matrix

Each service exposes the same status vocabulary with product-specific meaning. The matrix must be reachable through named fixtures so the presentation and automated tests can exercise every path.

| Service | Success | Low confidence | Duplicate | No match | Error |
| --- | --- | --- | --- | --- | --- |
| `analyzeUrbanIssue` | `urban-success-high`: classifies a fixture issue with confidence `0.92`. | `urban-low-confidence`: returns an ambiguous category and `suggestedCorrections`. | `urban-duplicate`: returns one or more similar local report fixtures. | `urban-no-match`: returns no comparable local fixture and an unresolved classification; absence is not proof of no real issue. | `urban-error`: returns `MOCK_ANALYSIS_UNAVAILABLE`; draft remains editable. |
| `recognizeEquation` | `equation-success-high`: returns a normalized expression with confidence `0.96`. | `equation-low-confidence`: marks ambiguous tokens and requires correction. | `equation-duplicate`: indicates that the normalized expression already exists in the local notebook. | `equation-no-match`: returns no parseable equation for the selected fixture. | `equation-error`: returns `MOCK_RECOGNITION_UNAVAILABLE`; typed input remains. |
| `findPetMatches` | `pet-success-ranked`: returns ranked fictional candidates with reasons. | `pet-low-confidence`: returns candidates whose traits are insufficient for a confident review. | `pet-duplicate`: indicates a similar local lost/found profile. | `pet-no-match`: returns an empty candidate list and broadening guidance. | `pet-error`: returns `MOCK_MATCHING_UNAVAILABLE`; safe profile fields remain. |
| `analyzeFoodMock` | `food-success-high`: returns cloned foods and estimated macronutrients. | `food-low-confidence`: marks the simulated result for human review. | `food-duplicate`: signals a repeated local analysis scenario. | `food-no-match`: signals that no comparable food result was found in the fixture. | `food-error`: returns `MOCK_ANALYSIS_UNAVAILABLE`; no nutritional payload is presented. |
| `recognizeSign` | `sign-success-high`: returns a cloned sign with high confidence. | `sign-low-confidence`: returns a possible sign and alternatives for review. | `sign-duplicate`: returns a fixture sign with duplicate status. | `sign-no-match`: returns no usable sign and preserves the retry path. | `sign-error`: returns `MOCK_RECOGNITION_UNAVAILABLE`; no recognition payload is presented. |

## Result Shapes

Error results use the same metadata and a stable shape:

```json
{
  "meta": {
    "scenarioId": "pet-error",
    "status": "error",
    "latencyMs": 780,
    "disclaimer": "simulated"
  },
  "error": {
    "code": "MOCK_MATCHING_UNAVAILABLE",
    "message": "No pudimos buscar coincidencias"
  }
}
```

Low-confidence, duplicate, and no-match results are not transport errors. They are successful mock interactions with a status that tells the presentation layer which recovery layout to render. The user must be able to retry, correct, cancel, or continue where the flow allows it.

## Replacement Boundary

If a future real service is evaluated, it must implement an adapter that maps external responses into these domain contracts, records its own failure and privacy behavior, and keeps the UI disclaimer accurate. Replacing the mock must not silently turn a prototype claim into a production guarantee.
## CanastaAI Mock Services

CanastaAI uses deterministic local services only. `analyzeReceipt()` returns the Super Ahorro Equipetrol demo receipt with status `success`, scenario id `demo-receipt-success`, latency metadata and `disclaimer: 'simulated'`. `compareBasket()` calculates one of three recommendation strategies from local price fixtures: mayor ahorro, menor distancia or equilibrio. `getProductPrices()` and `getProductHistory()` read centralized fixtures for Santa Cruz store prices and product-specific trend points. No OCR, live AI, backend, scraping, GPS or payment service is called.

## ReciScan Mock Services

ReciScan uses deterministic local services only. `analyzeMaterial()` returns the PET demo scan with status `success`, scenario id `pet-demo-success`, latency metadata and `disclaimer: 'simulated'`. `getNearbyListings()`, `getListing()`, `getRecyclerMatches()`, `buildCollectionRoute()` and `getMaterialPriceReference()` read centralized fixtures. No real computer vision, GPS, chat, routing, payment, backend or marketplace network is called.
