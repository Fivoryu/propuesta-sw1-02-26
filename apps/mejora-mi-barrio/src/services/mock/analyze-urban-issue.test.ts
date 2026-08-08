import { santaCruzLocations } from '@propuestas/shared'
import { describe, expect, it } from 'vitest'
import { analyzeUrbanIssue } from './analyze-urban-issue'
import type { UrbanIssueInput, UrbanScenarioId } from '../../domain/urban-report'

const input: UrbanIssueInput = {
  description: 'Hay un bache grande cerca de la parada del barrio.',
  categoryHint: 'pothole',
  approximateLocation: santaCruzLocations[1],
  fixtureImageId: 'urban-pothole-01',
}

const scenarios: ReadonlyArray<{ scenarioId: UrbanScenarioId; status: 'success' | 'low_confidence' | 'duplicate' | 'no_match' | 'error' }> = [
  { scenarioId: 'urban-success-high', status: 'success' },
  { scenarioId: 'urban-low-confidence', status: 'low_confidence' },
  { scenarioId: 'urban-duplicate', status: 'duplicate' },
  { scenarioId: 'urban-no-match', status: 'no_match' },
  { scenarioId: 'urban-error', status: 'error' },
]

describe('analyzeUrbanIssue mock service', () => {
  it.each(scenarios)('returns the deterministic $scenarioId payload with the requested status', async ({ scenarioId, status }) => {
    const first = await analyzeUrbanIssue(input, { scenarioId, latencyMs: 0 })
    const second = await analyzeUrbanIssue(input, { scenarioId, latencyMs: 0 })

    expect(first).toEqual(second)
    expect(first).toMatchObject({ scenarioId, status, latencyMs: 0, disclaimer: 'simulated' })
    if (status === 'error') {
      expect(first).toMatchObject({ error: { code: 'MOCK_ANALYSIS_UNAVAILABLE' } })
    } else if ('analysis' in first) {
      expect(first.analysis.confidence).toBeGreaterThanOrEqual(0)
      expect(first.analysis.confidence).toBeLessThanOrEqual(1)
    }
  })

  it('clones nested result data and cancels an in-flight request', async () => {
    const result = await analyzeUrbanIssue(input, { scenarioId: 'urban-duplicate', latencyMs: 0 })
    const copy = await analyzeUrbanIssue(input, { scenarioId: 'urban-duplicate', latencyMs: 0 })

    if ('analysis' in result && 'analysis' in copy) {
      result.analysis.possibleDuplicate[0].reference = 'mutated-in-test'
      expect(copy.analysis.possibleDuplicate[0].reference).not.toBe('mutated-in-test')
    }

    const controller = new AbortController()
    const pending = analyzeUrbanIssue(input, { scenarioId: 'urban-success-high', latencyMs: 10, signal: controller.signal })
    controller.abort()

    await expect(pending).rejects.toMatchObject({ name: 'AbortError' })
  })
})
