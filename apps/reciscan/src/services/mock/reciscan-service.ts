import { demoScan, listings, priceReferences, recyclerMatches, suggestedRoute } from '../../fixtures/data'
import type { MaterialCategory } from '../../domain/types'

const delay = (ms: number) => new Promise((resolve) => window.setTimeout(resolve, ms))

export async function analyzeMaterial(latencyMs = 600) {
  await delay(latencyMs)
  return structuredClone({ status: 'success', scenarioId: 'pet-demo-success', latencyMs, disclaimer: 'simulated', result: demoScan })
}

export function getNearbyListings(material?: MaterialCategory | 'Todos') {
  const result = !material || material === 'Todos' ? listings : listings.filter((listing) => listing.material === material)
  return structuredClone(result)
}

export function getListing(id: string) {
  return structuredClone(listings.find((listing) => listing.id === id) ?? listings[0])
}

export function getRecyclerMatches() {
  return structuredClone(recyclerMatches)
}

export function buildCollectionRoute() {
  return structuredClone(suggestedRoute)
}

export function getMaterialPriceReference(material: MaterialCategory) {
  return structuredClone(priceReferences.find((item) => item.material === material) ?? priceReferences[0])
}
