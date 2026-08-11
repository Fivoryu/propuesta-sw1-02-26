import { describe, expect, it } from 'vitest'
import { recognizeSign } from './recognize-sign'

const scenarios = [
  { scenarioId: 'sign-success-high', status: 'success' },
  { scenarioId: 'sign-low-confidence', status: 'low_confidence' },
  { scenarioId: 'sign-duplicate', status: 'duplicate' },
  { scenarioId: 'sign-no-match', status: 'no_match' },
  { scenarioId: 'sign-error', status: 'error' },
] as const

describe('recognizeSign', () => {
  it.each(scenarios)('returns a deterministic $scenarioId payload', async ({ scenarioId, status }) => {
    const first = await recognizeSign(
      { vocabularyId: 'reception' },
      { scenarioId, latencyMs: 0 },
    )
    const second = await recognizeSign(
      { vocabularyId: 'reception' },
      { scenarioId, latencyMs: 0 },
    )

    expect(first).toEqual(second)
    expect(first).toMatchObject({
      scenarioId,
      status,
      latencyMs: 0,
      disclaimer: 'simulated',
    })

    if (status === 'error') {
      expect(first).toMatchObject({
        error: {
          code: 'MOCK_RECOGNITION_UNAVAILABLE',
        },
      })
    } else {
      expect(first).toHaveProperty('alternatives')
    }
  })

  it('clones sign and alternative fixtures and supports cancellation', async () => {
    const first = await recognizeSign(undefined, {
      scenarioId: 'sign-low-confidence',
      latencyMs: 0,
    })
    const second = await recognizeSign(undefined, {
      scenarioId: 'sign-low-confidence',
      latencyMs: 0,
    })

    if (first.status !== 'error' && second.status !== 'error') {
      first.sign!.text = 'Texto alterado'
      first.alternatives[0]!.text = 'Alternativa alterada'
      expect(second.sign?.text).toBe('Gracias')
      expect(second.alternatives[0]?.text).toBe('Necesito ayuda')
    }

    const controller = new AbortController()
    const pending = recognizeSign(undefined, {
      scenarioId: 'sign-success-high',
      latencyMs: 10,
      signal: controller.signal,
    })
    controller.abort()

    await expect(pending).rejects.toMatchObject({
      name: 'AbortError',
      message: 'La solicitud fue cancelada.',
    })
  })

  it('returns a safe error for an unknown scenario', async () => {
    const result = await recognizeSign(undefined, {
      scenarioId: 'sign-unknown',
      latencyMs: 0,
    })

    expect(result).toMatchObject({
      scenarioId: 'sign-unknown',
      status: 'error',
      latencyMs: 0,
      disclaimer: 'simulated',
      error: {
        code: 'MOCK_RECOGNITION_UNAVAILABLE',
      },
    })
  })
})
