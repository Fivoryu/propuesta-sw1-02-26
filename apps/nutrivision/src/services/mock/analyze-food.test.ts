import { describe, expect, it } from 'vitest'
import { analyzeFoodMock } from './analyze-food'

describe('analyzeFoodMock', () => {
  it('returns the deterministic demonstration analysis', async () => {
    const result = await analyzeFoodMock(undefined, { latencyMs: 0 })

    expect(result).toMatchObject({ calories: 610, protein: 52, carbs: 66, fats: 16, disclaimer: 'simulated' })
    expect(result.foods).toHaveLength(4)
    expect(result.foods.map((food) => food.name)).toContain('Pechuga de pollo')
  })

  it('returns cloned food data and supports cancellation', async () => {
    const first = await analyzeFoodMock(undefined, { latencyMs: 0 })
    const second = await analyzeFoodMock(undefined, { latencyMs: 0 })
    first.foods[0].grams = 999
    expect(second.foods[0].grams).toBe(175)

    const controller = new AbortController()
    const pending = analyzeFoodMock(undefined, { latencyMs: 10, signal: controller.signal })
    controller.abort()
    await expect(pending).rejects.toMatchObject({ name: 'AbortError' })
  })
})
