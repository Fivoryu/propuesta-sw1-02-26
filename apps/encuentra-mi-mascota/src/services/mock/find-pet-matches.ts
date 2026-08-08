import {
  petDuplicateCandidate,
  petLowConfidenceMatches,
  petSuccessMatches,
  type PetCandidate,
  type PetMatchInput,
  type PetMatchOptions,
  type PetMatchResult,
  type PetScenarioId,
} from '../../domain/pet'

const DEFAULT_SCENARIO: PetScenarioId = 'pet-success-ranked'

function createAbortError(): DOMException {
  return new DOMException('La solicitud fue cancelada.', 'AbortError')
}

function assertRequestIsActive(options: PetMatchOptions): void {
  if (options.signal?.aborted) throw createAbortError()
  if (options.requestId && options.isRequestCurrent && !options.isRequestCurrent(options.requestId)) {
    throw createAbortError()
  }
}

function waitForLatency(latencyMs: number, signal?: AbortSignal): Promise<void> {
  if (signal?.aborted) return Promise.reject(createAbortError())

  return new Promise((resolve, reject) => {
    let timer: ReturnType<typeof setTimeout>
    const cancel = () => {
      clearTimeout(timer)
      signal?.removeEventListener('abort', cancel)
      reject(createAbortError())
    }
    const finish = () => {
      signal?.removeEventListener('abort', cancel)
      resolve()
    }
    timer = setTimeout(finish, latencyMs)
    signal?.addEventListener('abort', cancel, { once: true })
  })
}

function cloneCandidate(candidate: PetCandidate): PetCandidate {
  return {
    ...candidate,
    approximateLocation: { ...candidate.approximateLocation },
    photo: { ...candidate.photo },
    matchReasons: [...candidate.matchReasons],
  }
}

function latencyFor(scenarioId: PetScenarioId, override?: number): number {
  if (typeof override === 'number') return Math.max(0, override)
  if (scenarioId === 'pet-error') return 780
  if (scenarioId === 'pet-low-confidence') return 720
  if (scenarioId === 'pet-duplicate') return 760
  if (scenarioId === 'pet-no-match') return 620
  return 700
}

function createMeta(scenarioId: PetScenarioId, status: PetMatchResult['status'], latencyMs: number, requestId?: string) {
  return {
    scenarioId,
    status,
    latencyMs,
    disclaimer: 'simulated' as const,
    requestId,
  }
}

/**
 * Public local adapter for the pet matching flow.
 *
 * It only clones named fictional fixtures. The options make latency testable,
 * cancellation explicit, and request identity safe when a user leaves the route.
 */
export async function findPetMatches(input: PetMatchInput, options: PetMatchOptions = {}): Promise<PetMatchResult> {
  const scenarioId = options.scenarioId ?? DEFAULT_SCENARIO
  const latencyMs = latencyFor(scenarioId, options.latencyMs)
  const requestedArea = input.profile.approximateLocationId

  assertRequestIsActive(options)
  await waitForLatency(latencyMs, options.signal)
  assertRequestIsActive(options)

  if (scenarioId === 'pet-error') {
    const meta = createMeta(scenarioId, 'error', latencyMs, options.requestId)
    return {
      ...meta,
      meta,
      status: 'error',
      scenarioId,
      latencyMs,
      disclaimer: 'simulated',
      error: {
        code: 'MOCK_MATCHING_UNAVAILABLE',
        message: 'No pudimos buscar coincidencias. Tu perfil seguro sigue guardado.',
      },
    }
  }

  if (scenarioId === 'pet-no-match') {
    const meta = createMeta(scenarioId, 'no_match', latencyMs, options.requestId)
    return {
      ...meta,
      meta,
      status: 'no_match',
      scenarioId,
      latencyMs,
      disclaimer: 'simulated',
      matches: [],
      broadeningGuidance: `Probá ampliar la zona alrededor de ${requestedArea.replace('sc-', '').replaceAll('-', ' ')} o agregar más rasgos visibles.`,
    }
  }

  if (scenarioId === 'pet-low-confidence') {
    const matches = petLowConfidenceMatches.map(cloneCandidate)
    const meta = createMeta(scenarioId, 'low_confidence', latencyMs, options.requestId)
    return {
      ...meta,
      meta,
      status: 'low_confidence',
      scenarioId,
      latencyMs,
      disclaimer: 'simulated',
      matches,
      reviewMessage: 'Hay candidatos, pero faltan rasgos suficientes para una comparación confiable. Revisá y agregá detalles.',
    }
  }

  if (scenarioId === 'pet-duplicate') {
    const duplicate = cloneCandidate(petDuplicateCandidate)
    const meta = createMeta(scenarioId, 'duplicate', latencyMs, options.requestId)
    return {
      ...meta,
      meta,
      status: 'duplicate',
      scenarioId,
      latencyMs,
      disclaimer: 'simulated',
      matches: [duplicate],
      duplicate,
    }
  }

  const matches = petSuccessMatches.map(cloneCandidate)
  const meta = createMeta(scenarioId, 'success', latencyMs, options.requestId)
  return {
    ...meta,
    meta,
    status: 'success',
    scenarioId,
    latencyMs,
    disclaimer: 'simulated',
    matches,
  }
}
