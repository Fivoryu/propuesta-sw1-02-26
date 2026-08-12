export type UserMode = 'seller' | 'recycler'
export type MaterialCategory = 'PET' | 'Cartón' | 'Papel' | 'Aluminio' | 'Vidrio'
export type ListingMode = 'Vender' | 'Gratis' | 'Negociar'

export type MaterialScanResult = {
  material: MaterialCategory
  presentation: string
  condition: string
  estimatedKg: number
  pricePerKg: number
  referenceValue: number
  confidence: number
}

export type MaterialListing = {
  id: string
  material: MaterialCategory
  title: string
  quantityKg: number
  condition: string
  zone: string
  distanceKm: number
  mode: ListingMode
  referenceValue?: number
  freshness: string
  availability: string
}

export type RecyclerProfile = {
  id: string
  name: string
  role: string
  accepts: MaterialCategory[]
  distanceKm: number
  petPrice: number
  rating: number
  completedCollections: number
}

export type CollectionStop = {
  listingId: string
  order: number
  confirmedKg: number
  finalAgreement: number
}

export type CollectionRoute = {
  id: string
  title: string
  distanceKm: number
  minutes: number
  totalKg: number
  stops: CollectionStop[]
}
