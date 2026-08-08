import type {
  EquationFixture,
  EquationInput,
  EquationLocalReference,
  EquationRecognitionOptions,
  EquationRecognitionPayload,
  EquationRecognitionResult,
  EquationScenarioId,
} from '../../domain/equation'
import { getEquationFixture } from '../../domain/equation'

const DEFAULT_SCENARIO: EquationScenarioId = 'equation-success-high'

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

function cloneReference(reference: EquationLocalReference | null): EquationLocalReference | null {
  return reference ? { ...reference } : null
}

function clonePayload(payload: EquationRecognitionPayload): EquationRecognitionPayload {
  return {
    ...payload,
    ambiguousTokens: [...payload.ambiguousTokens],
    alternatives: payload.alternatives.map((alternative) => ({ ...alternative })),
  }
}

function normalizeTypedExpression(expression: string): string {
  return expression
    .trim()
    .replace(/(?:\\?sqrt)\s*\(([^()]+)\)/gi, '\\sqrt{$1}')
    .replace(/\s*[×*]\s*/g, ' \\cdot ')
    .replace(/\s*÷\s*/g, ' / ')
    .replace(/\s+/g, ' ')
}

function basePayload(fixture: EquationFixture, input: EquationInput): EquationRecognitionPayload {
  const typedExpression = input.source === 'typed' && input.expression ? normalizeTypedExpression(input.expression) : null
  const recognizedTex = typedExpression || input.expression?.trim() || fixture.tex
  return {
    recognizedTex,
    normalizedExpression: typedExpression ? typedExpression.replace(/\\cdot/g, '·') : input.expression?.trim() || fixture.normalizedExpression,
    confidence: 0.96,
    ambiguousTokens: [],
    alternatives: [],
    guidance: 'La expresión está lista para que la revises antes de insertarla.',
  }
}

function getScenarioPayload(scenarioId: EquationScenarioId, input: EquationInput): EquationRecognitionPayload {
  const fixture = getEquationFixture(input.fixtureId)
  const payload = basePayload(fixture, input)

  if (scenarioId === 'equation-low-confidence') {
    return {
      ...payload,
      recognizedTex: 'x = \\frac{-b \\pm \\sqrt{b^2 - 4ac}}{2a}',
      normalizedExpression: 'x = (-b ? √(b^2 - 4ac)) / (2a)',
      confidence: 0.58,
      ambiguousTokens: ['±'],
      alternatives: [
        { label: 'Usar signo más', tex: 'x = \\frac{-b + \\sqrt{b^2 - 4ac}}{2a}' },
        { label: 'Usar signo menos', tex: 'x = \\frac{-b - \\sqrt{b^2 - 4ac}}{2a}' },
      ],
      guidance: 'Revisá el signo marcado antes de aceptar la propuesta.',
    }
  }

  if (scenarioId === 'equation-duplicate') {
    return {
      ...payload,
      recognizedTex: '\\int_0^1 x^2\\,dx',
      normalizedExpression: '∫[0,1] x^2 dx',
      confidence: 0.94,
      guidance: 'Encontramos una expresión igual en el cuaderno local.',
    }
  }

  return payload
}

function createMeta(scenarioId: EquationScenarioId, latencyMs: number, status: EquationRecognitionResult['status']) {
  return {
    scenarioId,
    status,
    latencyMs,
    disclaimer: 'simulated' as const,
  }
}

function getLatency(scenarioId: EquationScenarioId, override?: number): number {
  if (typeof override === 'number') return Math.max(0, override)
  return scenarioId === 'equation-error' ? 780 : scenarioId === 'equation-low-confidence' ? 720 : 680
}

export function createRecognitionErrorResult(scenarioId: EquationScenarioId, latencyMs: number): EquationRecognitionResult {
  const meta = createMeta(scenarioId, latencyMs, 'error')
  return {
    ...meta,
    scenarioId: 'equation-error',
    status: 'error',
    meta: { ...meta, scenarioId: 'equation-error' },
    error: {
      code: 'MOCK_RECOGNITION_UNAVAILABLE',
      message: 'No pudimos reconocer la ecuación. Tu manuscrito sigue guardado.',
    },
  }
}

export async function recognizeEquation(
  input: EquationInput,
  options: EquationRecognitionOptions = {},
): Promise<EquationRecognitionResult> {
  const scenarioId = options.scenarioId ?? DEFAULT_SCENARIO
  const latencyMs = getLatency(scenarioId, options.latencyMs)
  await waitForLatency(latencyMs, options.signal)
  if (options.signal?.aborted) throw createAbortError()

  if (scenarioId === 'equation-error') return createRecognitionErrorResult(scenarioId, latencyMs)

  if (scenarioId === 'equation-no-match') {
    const meta = createMeta(scenarioId, latencyMs, 'no_match')
    return {
      ...meta,
      scenarioId,
      status: 'no_match',
      meta: { ...meta, scenarioId },
      inputSummary: input.expression?.trim() || 'Entrada manuscrita sin una fixture asociada',
      alternatives: [
        { label: 'Probar cinemática', tex: getEquationFixture('equation-kinematics').tex },
        { label: 'Probar integral', tex: getEquationFixture('equation-integral').tex },
      ],
    }
  }

  const payload = clonePayload(getScenarioPayload(scenarioId, input))
  if (scenarioId === 'equation-success-high') {
    const meta = createMeta(scenarioId, latencyMs, 'success')
    return { ...meta, scenarioId, status: 'success', meta: { ...meta, scenarioId }, recognition: payload }
  }
  if (scenarioId === 'equation-low-confidence') {
    const meta = createMeta(scenarioId, latencyMs, 'low_confidence')
    return { ...meta, scenarioId, status: 'low_confidence', meta: { ...meta, scenarioId }, recognition: payload }
  }
  const duplicate = cloneReference(input.existingEntries?.find((entry) => entry.tex === payload.recognizedTex) ?? input.existingEntries?.[0] ?? null)
  const meta = createMeta('equation-duplicate', latencyMs, 'duplicate')
  return { ...meta, scenarioId: 'equation-duplicate', status: 'duplicate', meta: { ...meta, scenarioId: 'equation-duplicate' }, recognition: payload, duplicate }
}
