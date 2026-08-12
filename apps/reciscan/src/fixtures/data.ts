import type { CollectionRoute, MaterialListing, MaterialScanResult, RecyclerProfile } from '../domain/types'

export const demoScan: MaterialScanResult = {
  material: 'PET',
  presentation: 'Botellas transparentes compactadas',
  condition: 'Limpio y seco',
  estimatedKg: 6.5,
  pricePerKg: 2.2,
  referenceValue: 14.3,
  confidence: 97,
}

export const listings: MaterialListing[] = [
  { id: 'pet-equipetrol', material: 'PET', title: 'PET transparente', quantityKg: 6.5, condition: 'Limpio y seco', zone: 'Equipetrol', distanceKm: 1.1, mode: 'Vender', referenceValue: 14.3, freshness: 'Publicado hace 25 min', availability: 'Hoy 17:00 a 19:00' },
  { id: 'carton-alemana', material: 'Cartón', title: 'Cartón seco', quantityKg: 12, condition: 'Plegado y seco', zone: 'Av. Alemana', distanceKm: 1.4, mode: 'Negociar', freshness: 'Publicado hace 40 min', availability: 'Hoy por la tarde' },
  { id: 'aluminio-hamacas', material: 'Aluminio', title: 'Latas de aluminio', quantityKg: 2.4, condition: 'Separado en bolsa', zone: 'Barrio Hamacas', distanceKm: 1.8, mode: 'Vender', referenceValue: 20.4, freshness: 'Publicado hace 1 h', availability: 'Mañana por la mañana' },
  { id: 'pet-universidad', material: 'PET', title: 'PET mixto', quantityKg: 4.2, condition: 'Necesita enjuague', zone: 'Universidad', distanceKm: 2.1, mode: 'Gratis', freshness: 'Publicado hace 2 h', availability: 'Hoy hasta 18:30' },
]

export const recyclerMatches: RecyclerProfile[] = [
  { id: 'carlos-r', name: 'Carlos R.', role: 'Reciclador independiente', accepts: ['PET', 'Cartón', 'Aluminio'], distanceKm: 1.1, petPrice: 2.1, rating: 4.8, completedCollections: 84 },
  { id: 'maria-v', name: 'María V.', role: 'Compradora de materiales', accepts: ['PET', 'Papel', 'Vidrio'], distanceKm: 1.7, petPrice: 2.0, rating: 4.7, completedCollections: 52 },
  { id: 'base-norte', name: 'Base Norte', role: 'Centro de acopio barrial', accepts: ['PET', 'Cartón', 'Aluminio', 'Vidrio'], distanceKm: 2.2, petPrice: 2.05, rating: 4.6, completedCollections: 141 },
]

export const suggestedRoute: CollectionRoute = {
  id: 'route-norte-3',
  title: 'Ruta sugerida',
  distanceKm: 3.2,
  minutes: 34,
  totalKg: 20.9,
  stops: [
    { listingId: 'pet-equipetrol', order: 1, confirmedKg: 6.2, finalAgreement: 13 },
    { listingId: 'carton-alemana', order: 2, confirmedKg: 11.6, finalAgreement: 18 },
    { listingId: 'aluminio-hamacas', order: 3, confirmedKg: 2.3, finalAgreement: 19.5 },
  ],
}

export const priceReferences = [
  { material: 'PET', price: 2.2, range: 'Bs 1,80 a Bs 2,40', updated: 'Hoy' },
  { material: 'Cartón', price: 1.45, range: 'Bs 1,10 a Bs 1,70', updated: 'Hoy' },
  { material: 'Aluminio', price: 8.5, range: 'Bs 7,60 a Bs 9,20', updated: 'Ayer' },
]
