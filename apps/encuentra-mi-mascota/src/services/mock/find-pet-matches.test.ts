import { describe, expect, it, vi } from 'vitest'
import { defaultPetDraft, petPhotoFixtures, type PetMatchInput, type PetScenarioId } from '../../domain/pet'
import { findPetMatches } from './find-pet-matches'

const input: PetMatchInput = {
  profile: {
    ...defaultPetDraft,
    description: 'Perro mediano con pecho blanco y collar azul.',
    colors: 'Negro y blanco',
    traits: 'Mancha blanca en el hocico y collar azul',
  },
  photos: [petPhotoFixtures[0]],
}

const scenarios: ReadonlyArray<{ scenarioId: PetScenarioId; status: 'success' | 'low_confidence' | 'duplicate' | 'no_match' | 'error' }> = [
  { scenarioId: 'pet-success-ranked', status: 'success' },
  { scenarioId: 'pet-low-confidence', status: 'low_confidence' },
  { scenarioId: 'pet-duplicate', status: 'duplicate' },
  { scenarioId: 'pet-no-match', status: 'no_match' },
  { scenarioId: 'pet-error', status: 'error' },
]

describe('findPetMatches mock service', () => {
  it.each(scenarios)('returns the deterministic $scenarioId payload with the requested status', async ({ scenarioId, status }) => {
    const first = await findPetMatches(input, { scenarioId, latencyMs: 0 })
    const second = await findPetMatches(input, { scenarioId, latencyMs: 0 })

    expect(first).toEqual(second)
    expect(first).toMatchObject({ scenarioId, status, latencyMs: 0, disclaimer: 'simulated' })
    expect(first.meta).toMatchObject({ scenarioId, status, latencyMs: 0, disclaimer: 'simulated' })
    if (status === 'error') {
      expect(first).toMatchObject({ error: { code: 'MOCK_MATCHING_UNAVAILABLE' } })
    } else if ('matches' in first) {
      expect(first.matches.every((candidate) => candidate.simulated)).toBe(true)
    }
  })

  it('clones candidate arrays, cancels requests, and rejects stale request IDs', async () => {
    const first = await findPetMatches(input, { scenarioId: 'pet-success-ranked', latencyMs: 0 })
    const second = await findPetMatches(input, { scenarioId: 'pet-success-ranked', latencyMs: 0 })

    if ('matches' in first && 'matches' in second) {
      first.matches[0].matchReasons.push('mutated-in-test')
      expect(second.matches[0].matchReasons).not.toContain('mutated-in-test')
    }

    const controller = new AbortController()
    const pending = findPetMatches(input, { scenarioId: 'pet-success-ranked', latencyMs: 10, signal: controller.signal })
    controller.abort()
    await expect(pending).rejects.toMatchObject({ name: 'AbortError' })

    const isRequestCurrent = vi.fn(() => false)
    const stale = findPetMatches(input, {
      scenarioId: 'pet-success-ranked',
      latencyMs: 0,
      requestId: 'stale-request',
      isRequestCurrent,
    })
    await expect(stale).rejects.toMatchObject({ name: 'AbortError' })
    expect(isRequestCurrent).toHaveBeenCalledWith('stale-request')
  })
})
