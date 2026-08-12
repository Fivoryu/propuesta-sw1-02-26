import { listings, suggestedRoute } from '../fixtures/data'
import type { MaterialCategory, MaterialListing } from './types'

export function calculateListingTotalKg(items: readonly MaterialListing[]) {
  return Math.round(items.reduce((sum, item) => sum + item.quantityKg, 0) * 10) / 10
}

export function getRouteListings() {
  return suggestedRoute.stops.map((stop) => listings.find((listing) => listing.id === stop.listingId)).filter((listing): listing is MaterialListing => Boolean(listing))
}

export function filterListings(items: readonly MaterialListing[], material: MaterialCategory | 'Todos', query: string) {
  const normalized = query.trim().toLowerCase()
  return items.filter((listing) => {
    const matchesMaterial = material === 'Todos' || listing.material === material
    const matchesQuery = !normalized || `${listing.material} ${listing.title} ${listing.zone}`.toLowerCase().includes(normalized)
    return matchesMaterial && matchesQuery
  })
}
