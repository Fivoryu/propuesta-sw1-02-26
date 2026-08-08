import { describe, expect, it } from 'vitest'
import { recognizeEquation } from './recognize-equation'
import type { EquationInput, EquationScenarioId } from '../../domain/equation'

const input: EquationInput = {
  source: 'fixture',
  expression: 'x = x_0 + v_0t + \\frac{1}{2}at^2',
  fixtureId: 'equation-kinematics',
  strokes: [],
  existingEntries: [],
}

const scenarios: ReadonlyArray<{ scenarioId: EquationScenarioId; status: 'success' | 'low_confidence' | 'duplicate' | 'no_match' | 'error' }> = [
  { scenarioId: 'equation-success-high', status: 'success' },
  { scenarioId: 'equation-low-confidence', status: 'low_confidence' },
  { scenarioId: 'equation-duplicate', status: 'duplicate' },
  { scenarioId: 'equation-no-match', status: 'no_match' },
  { scenarioId: 'equation-error', status: 'error' },
]

describe('recognizeEquation mock service', () => {
  it.each(scenarios)('returns the deterministic $scenarioId payload with the requested status', async ({ scenarioId, status }) => {
    const result = await recognizeEquation(input, { scenarioId, latencyMs: 0 })

    expect(result).toMatchObject({ scenarioId, status, latencyMs: 0, disclaimer: 'simulated' })
    expect(result.meta).toMatchObject({ scenarioId, status, latencyMs: 0, disclaimer: 'simulated' })
    if (status === 'error') {
      expect(result).toMatchObject({ error: { code: 'MOCK_RECOGNITION_UNAVAILABLE' } })
    } else if ('recognition' in result) {
      expect(result.recognition.confidence).toBeGreaterThanOrEqual(0)
      expect(result.recognition.confidence).toBeLessThanOrEqual(1)
    }
  })

  it('clones recognition arrays and cancels an in-flight request', async () => {
    const first = await recognizeEquation(input, { scenarioId: 'equation-low-confidence', latencyMs: 0 })
    const second = await recognizeEquation(input, { scenarioId: 'equation-low-confidence', latencyMs: 0 })

    if ('recognition' in first && 'recognition' in second) {
      first.recognition.ambiguousTokens.push('mutated-in-test')
      expect(second.recognition.ambiguousTokens).not.toContain('mutated-in-test')
    }

    const controller = new AbortController()
    const pending = recognizeEquation(input, { scenarioId: 'equation-success-high', latencyMs: 10, signal: controller.signal })
    controller.abort()

    await expect(pending).rejects.toMatchObject({ name: 'AbortError' })
  })
})
