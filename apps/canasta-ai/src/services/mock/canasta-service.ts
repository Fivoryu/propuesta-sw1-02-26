import { demoReceipt } from '../../fixtures/data'
import { compareBasketLocally, getPriceHistoryForProduct, getProductPrices as getPrices } from '../../domain/basket'
import type { BasketItem, StrategyId } from '../../domain/types'

const delay = (ms: number, signal?: AbortSignal) =>
  new Promise<void>((resolve, reject) => {
    const timeout = window.setTimeout(resolve, ms)
    signal?.addEventListener('abort', () => {
      window.clearTimeout(timeout)
      reject(new DOMException('Request cancelled', 'AbortError'))
    })
  })

export async function analyzeReceipt(signal?: AbortSignal, latencyMs = 700) {
  await delay(latencyMs, signal)
  return structuredClone({ scenarioId: 'demo-receipt-success', status: 'success', latencyMs, disclaimer: 'simulated', receipt: demoReceipt })
}

export async function compareBasket(_items: BasketItem[], strategyId: StrategyId, latencyMs = 0) {
  await delay(latencyMs)
  const recommendation = compareBasketLocally(_items, strategyId)
  return structuredClone({ scenarioId: `basket-${strategyId}`, status: 'success', latencyMs, disclaimer: 'simulated', recommendation })
}

export function getProductPrices(productId: string) {
  return structuredClone(getPrices(productId))
}

export function getProductHistory(productId: string) {
  return structuredClone({ productId, points: getPriceHistoryForProduct(productId) })
}
