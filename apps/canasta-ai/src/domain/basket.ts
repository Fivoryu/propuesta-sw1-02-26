import { priceMatrix, priceObservations, priceHistoryByProduct, stores } from '../fixtures/data'
import type { BasketItem, BasketRecommendation, PriceObservation, PriceSortMode, StrategyId } from './types'

const roundMoney = (value: number) => Math.round(value * 100) / 100

const freshnessRank: Record<string, number> = {
  Hoy: 0,
  'Hace 3 h': 1,
  Ayer: 2,
}

export function getUnitPrice(storeId: string, productId: string) {
  return priceMatrix[storeId]?.[productId]
}

export function calculateStoreSubtotal(storeId: string, items: readonly BasketItem[]) {
  return roundMoney(items.reduce((sum, item) => {
    const price = getUnitPrice(storeId, item.productId)
    return price === undefined ? sum : sum + price * item.quantity
  }, 0))
}

export function storeCoversBasket(storeId: string, items: readonly BasketItem[]) {
  return items.every((item) => getUnitPrice(storeId, item.productId) !== undefined)
}

export function calculateBasketTotal(items: readonly BasketItem[], storeId = 'super-ahorro-equipetrol') {
  if (!storeCoversBasket(storeId, items)) return null
  return calculateStoreSubtotal(storeId, items)
}

export function calculateSavings(usualTotal: number, recommendedTotal: number) {
  return roundMoney(usualTotal - recommendedTotal)
}

export function calculateEstimatedTravelKm(storeIds: readonly string[]) {
  const uniqueStoreIds = [...new Set(storeIds)]
  return roundMoney(uniqueStoreIds.reduce((sum, storeId) => sum + (stores.find((store) => store.id === storeId)?.distanceKm ?? 0), 0))
}

function recommendationFromAssignments(strategyId: StrategyId, title: string, usualTotal: number, assignments: Array<{ storeId: string; item: BasketItem }>): BasketRecommendation {
  const grouped = new Map<string, BasketItem[]>()
  for (const assignment of assignments) {
    grouped.set(assignment.storeId, [...(grouped.get(assignment.storeId) ?? []), assignment.item])
  }
  const storesResult = [...grouped.entries()].map(([storeId, items]) => {
    const detailItems = items.map((item) => {
      const unitPrice = getUnitPrice(storeId, item.productId) ?? 0
      return { productId: item.productId, quantity: item.quantity, subtotal: roundMoney(unitPrice * item.quantity) }
    })
    return { storeId, items: detailItems, subtotal: roundMoney(detailItems.reduce((sum, item) => sum + item.subtotal, 0)) }
  })
  const recommendedTotal = roundMoney(storesResult.reduce((sum, store) => sum + store.subtotal, 0))
  return { strategyId, title, usualTotal, recommendedTotal, savings: calculateSavings(usualTotal, recommendedTotal), estimatedTravelKm: calculateEstimatedTravelKm(storesResult.map((store) => store.storeId)), stores: storesResult }
}

export function compareBasketLocally(items: readonly BasketItem[], strategyId: StrategyId): BasketRecommendation {
  const usualTotal = calculateBasketTotal(items) ?? 0
  if (strategyId === 'distance') {
    const closest = stores.filter((store) => storeCoversBasket(store.id, items)).sort((a, b) => a.distanceKm - b.distanceKm)[0]
    if (closest) return recommendationFromAssignments(strategyId, 'Menor distancia', usualTotal, items.map((item) => ({ storeId: closest.id, item })))
  }

  if (strategyId === 'balanced') {
    const preferred = ['mercado-norte', 'super-ahorro-equipetrol']
    const assignments = items.map((item) => {
      const candidates = stores
        .filter((store) => preferred.includes(store.id) && getUnitPrice(store.id, item.productId) !== undefined)
        .map((store) => ({ store, price: getUnitPrice(store.id, item.productId) ?? 0 }))
        .sort((a, b) => (a.price + a.store.distanceKm * 0.55) - (b.price + b.store.distanceKm * 0.55))
      return { storeId: candidates[0]?.store.id ?? preferred[0], item }
    })
    return recommendationFromAssignments(strategyId, 'Equilibrio', usualTotal, assignments)
  }

  const assignments = items.map((item) => {
    const candidates = stores
      .filter((store) => getUnitPrice(store.id, item.productId) !== undefined)
      .map((store) => ({ store, price: getUnitPrice(store.id, item.productId) ?? 0 }))
      .sort((a, b) => a.price === b.price ? a.store.distanceKm - b.store.distanceKm : a.price - b.price)
    return { storeId: candidates[0]?.store.id ?? stores[0].id, item }
  })
  return recommendationFromAssignments(strategyId, 'Mayor ahorro', usualTotal, assignments)
}

export function getPriceHistoryForProduct(productId: string) {
  return priceHistoryByProduct[productId] ?? []
}

export function calculatePriceVariation(points: readonly { price: number }[]) {
  if (points.length < 2 || points[0].price === 0) return 0
  return Math.round(((points[points.length - 1].price - points[0].price) / points[0].price) * 1000) / 10
}

export function sortPriceObservations(observations: readonly PriceObservation[], mode: PriceSortMode) {
  return [...observations].sort((a, b) => {
    if (mode === 'distance') return (stores.find((store) => store.id === a.storeId)?.distanceKm ?? 99) - (stores.find((store) => store.id === b.storeId)?.distanceKm ?? 99)
    if (mode === 'freshness') return (freshnessRank[a.freshness] ?? 9) - (freshnessRank[b.freshness] ?? 9)
    return a.price - b.price
  })
}

export function getProductPrices(productId: string) {
  return priceObservations.filter((item) => item.productId === productId)
}
