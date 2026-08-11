import { recognitionScenarioSigns, uncertainAlternatives } from './sign-fixtures'
import type { AlternativeResult, MockSign } from '../../types'

export type MockStatus =
  | 'success'
  | 'low_confidence'
  | 'duplicate'
  | 'no_match'
  | 'error'

export type RecognizeSignOptions = {
  scenarioId?: string
  latencyMs?: number
  signal?: AbortSignal
}

export type MockMeta<TStatus extends MockStatus = MockStatus> = {
  scenarioId: string
  status: TStatus
  latencyMs: number
  disclaimer: 'simulated'
}

type RecognizeSignSuccessStatus = Exclude<MockStatus, 'error'>

export type RecognizeSignSuccess = MockMeta<RecognizeSignSuccessStatus> & {
  sign: MockSign | null
  alternatives: AlternativeResult[]
}

export type RecognizeSignError = MockMeta<'error'> & {
  error: {
    code: 'MOCK_RECOGNITION_UNAVAILABLE'
    message: string
  }
}

export type RecognizeSignResult = RecognizeSignSuccess | RecognizeSignError

export type RecognizeSignInput = {
  vocabularyId?: string
}

const DEFAULT_SCENARIO = 'sign-success-high'
const DEFAULT_LATENCY_MS = 1700

const statusByScenario: Record<string, RecognizeSignSuccessStatus> = {
  'sign-success-high': 'success',
  'sign-low-confidence': 'low_confidence',
  'sign-duplicate': 'duplicate',
  'sign-no-match': 'no_match',
}

function createAbortError(): DOMException {
  return new DOMException('La solicitud fue cancelada.', 'AbortError')
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

function chooseLatency(latencyMs?: number): number {
  return typeof latencyMs === 'number' ? Math.max(0, latencyMs) : DEFAULT_LATENCY_MS
}

function cloneSign(sign: MockSign | null): MockSign | null {
  return sign ? { ...sign } : null
}

function cloneAlternatives(alternatives: AlternativeResult[]): AlternativeResult[] {
  return alternatives.map((alternative) => ({ ...alternative }))
}

function errorResult(scenarioId: string, latencyMs: number): RecognizeSignError {
  return {
    scenarioId,
    status: 'error',
    latencyMs,
    disclaimer: 'simulated',
    error: {
      code: 'MOCK_RECOGNITION_UNAVAILABLE',
      message: 'No pudimos reconocer la seña. Intenta nuevamente con las manos visibles.',
    },
  }
}

export async function recognizeSign(
  input: RecognizeSignInput = {},
  options: RecognizeSignOptions = {},
): Promise<RecognizeSignResult> {
  void input
  const scenarioId = options.scenarioId ?? DEFAULT_SCENARIO
  const latencyMs = chooseLatency(options.latencyMs)
  await waitForLatency(latencyMs, options.signal)
  if (options.signal?.aborted) throw createAbortError()

  const status = statusByScenario[scenarioId]
  if (!status || scenarioId === 'sign-error') {
    return errorResult(scenarioId, latencyMs)
  }

  const sign = recognitionScenarioSigns[scenarioId]
  const alternatives = status === 'low_confidence' ? uncertainAlternatives.default : []

  return {
    scenarioId,
    status,
    latencyMs,
    disclaimer: 'simulated',
    sign: cloneSign(sign ?? null),
    alternatives: cloneAlternatives(alternatives),
  }
}

export { waitForLatency }
