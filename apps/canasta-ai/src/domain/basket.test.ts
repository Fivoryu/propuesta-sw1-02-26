import { describe, expect, it } from 'vitest'
import { compareBasketLocally, calculateEstimatedTravelKm, calculateSavings, getPriceHistoryForProduct, sortPriceObservations } from './basket'
import type { BasketItem, PriceObservation } from './types'

const basket: BasketItem[] = [
  { productId: 'arroz-5kg', quantity: 1 },
  { productId: 'aceite-fino-900', quantity: 2 },
  { productId: 'leche-pil-1l', quantity: 6 },
  { productId: 'huevos-30', quantity: 1 },
  { productId: 'fideos-400-3', quantity: 1 },
]

describe('CanastaAI basket calculations', () => {
  it('uses quantities when calculating totals', () => {
    const base = compareBasketLocally(basket, 'savings')
    const moreMilk = compareBasketLocally(basket.map((item) => item.productId === 'leche-pil-1l' ? { ...item, quantity: item.quantity + 1 } : item), 'savings')
    expect(moreMilk.usualTotal).toBeGreaterThan(base.usualTotal)
    expect(moreMilk.recommendedTotal).toBeGreaterThan(base.recommendedTotal)
  })

  it('keeps savings and store subtotals arithmetically consistent', () => {
    const result = compareBasketLocally(basket, 'savings')
    const subtotalSum = result.stores.reduce((sum, store) => sum + store.subtotal, 0)
    expect(result.savings).toBe(calculateSavings(result.usualTotal, result.recommendedTotal))
    expect(subtotalSum).toBeCloseTo(result.recommendedTotal, 2)
  })

  it('returns deterministic strategy tradeoffs', () => {
    const savings = compareBasketLocally(basket, 'savings')
    const distance = compareBasketLocally(basket, 'distance')
    const balanced = compareBasketLocally(basket, 'balanced')
    expect(savings.recommendedTotal).toBeLessThan(distance.recommendedTotal)
    expect(distance.estimatedTravelKm).toBeLessThan(savings.estimatedTravelKm)
    expect(balanced.title).toBe('Equilibrio')
  })

  it('calculates estimated travel from selected store fixtures', () => {
    const distance = compareBasketLocally(basket, 'distance')
    const savings = compareBasketLocally(basket, 'savings')
    expect(distance.stores).toHaveLength(1)
    expect(distance.estimatedTravelKm).toBe(calculateEstimatedTravelKm(distance.stores.map((store) => store.storeId)))
    expect(savings.stores.length).toBeGreaterThan(1)
    expect(savings.estimatedTravelKm).toBe(calculateEstimatedTravelKm(savings.stores.map((store) => store.storeId)))
  })

  it('uses product-specific history', () => {
    expect(getPriceHistoryForProduct('arroz-5kg')).not.toEqual(getPriceHistoryForProduct('aceite-fino-900'))
  })

  it('sorts observations by selected filter', () => {
    const observations: PriceObservation[] = [
      { productId: 'arroz-5kg', storeId: 'mercado-central', price: 52, freshness: 'Ayer' },
      { productId: 'arroz-5kg', storeId: 'super-ahorro-equipetrol', price: 56.9, freshness: 'Hoy' },
      { productId: 'arroz-5kg', storeId: 'mercado-norte', price: 50.5, freshness: 'Hace 3 h' },
    ]
    expect(sortPriceObservations(observations, 'price')[0].storeId).toBe('mercado-norte')
    expect(sortPriceObservations(observations, 'distance')[0].storeId).toBe('super-ahorro-equipetrol')
    expect(sortPriceObservations(observations, 'freshness')[0].storeId).toBe('super-ahorro-equipetrol')
  })
})
