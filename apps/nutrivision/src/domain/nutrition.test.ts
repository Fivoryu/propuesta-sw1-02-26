import { describe, expect, it } from 'vitest'
import { calculateNutritionTargets, initialProfile, type Goal } from './nutrition'

describe('calculateNutritionTargets', () => {
  const goals: Goal[] = ['Ganancia muscular', 'Mantener peso', 'Reducir peso', 'Mejorar alimentación']

  it.each(goals)('creates usable macros for %s', (goal) => {
    const targets = calculateNutritionTargets(initialProfile, goal)
    expect(targets.calories).toBeGreaterThan(1200)
    expect(targets.protein).toBeGreaterThan(0)
    expect(targets.carbs).toBeGreaterThanOrEqual(0)
    expect(targets.fats).toBeGreaterThan(0)
  })

  it('applies a surplus for muscle gain and a deficit for weight reduction', () => {
    const gain = calculateNutritionTargets(initialProfile, 'Ganancia muscular')
    const maintenance = calculateNutritionTargets(initialProfile, 'Mantener peso')
    const reduction = calculateNutritionTargets(initialProfile, 'Reducir peso')
    expect(gain.calories).toBe(maintenance.calories + 300)
    expect(reduction.calories).toBe(maintenance.calories - 400)
  })
})
