import { describe, expect, it } from 'vitest'
import { listings } from '../fixtures/data'
import { calculateListingTotalKg, filterListings, getRouteListings } from './listings'

describe('ReciScan listing calculations', () => {
  it('separates total nearby material from suggested route material', () => {
    expect(calculateListingTotalKg(listings)).toBe(25.1)
    expect(calculateListingTotalKg(getRouteListings())).toBe(20.9)
    expect(getRouteListings()).toHaveLength(3)
  })

  it('combines material and text search filters', () => {
    const result = filterListings(listings, 'PET', 'universidad')
    expect(result).toHaveLength(1)
    expect(result[0].id).toBe('pet-universidad')
  })
})
