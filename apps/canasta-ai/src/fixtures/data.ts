import type { BasketItem, PriceHistoryPoint, PriceObservation, Product, Receipt, Store } from '../domain/types'

export const products: Product[] = [
  { id: 'leche-pil-1l', name: 'Leche PIL Entera', presentation: '1 L', category: 'Lácteos' },
  { id: 'aceite-fino-900', name: 'Aceite Fino', presentation: '900 ml', category: 'Despensa' },
  { id: 'arroz-5kg', name: 'Arroz', presentation: '5 kg', category: 'Despensa' },
  { id: 'huevos-30', name: 'Huevos', presentation: 'x30', category: 'Frescos' },
  { id: 'fideos-400-3', name: 'Fideos', presentation: '400 g x3', category: 'Despensa' },
]

export const stores: Store[] = [
  { id: 'super-ahorro-equipetrol', name: 'Super Ahorro Equipetrol', zone: 'Equipetrol', distanceKm: 0.8 },
  { id: 'mercado-norte', name: 'Mercado Norte', zone: 'Norte', distanceKm: 1.6 },
  { id: 'mercado-central', name: 'Mercado Central', zone: 'Centro', distanceKm: 2.4 },
  { id: 'super-familiar', name: 'Super Familiar', zone: 'Las Palmas', distanceKm: 0.6 },
]

export const priceMatrix: Record<string, Record<string, number>> = {
  'super-ahorro-equipetrol': {
    'leche-pil-1l': 8.9,
    'aceite-fino-900': 16.5,
    'arroz-5kg': 56.9,
    'huevos-30': 31.5,
    'fideos-400-3': 15,
  },
  'mercado-norte': {
    'leche-pil-1l': 8.2,
    'aceite-fino-900': 15.2,
    'arroz-5kg': 50.5,
    'huevos-30': 30.4,
    'fideos-400-3': 14.2,
  },
  'mercado-central': {
    'leche-pil-1l': 8.5,
    'aceite-fino-900': 15.9,
    'arroz-5kg': 52,
    'huevos-30': 29.8,
    'fideos-400-3': 14.7,
  },
  'super-familiar': {
    'leche-pil-1l': 8.7,
    'aceite-fino-900': 16.1,
    'arroz-5kg': 55.4,
    'huevos-30': 31.2,
    'fideos-400-3': 14.9,
  },
}

export const demoReceipt: Receipt = {
  id: 'receipt-2026-08-11',
  storeId: 'super-ahorro-equipetrol',
  dateLabel: '11 de agosto de 2026',
  total: 128.8,
  items: [
    { productId: 'leche-pil-1l', rawText: 'LECHE PIL ENT 1000ML', normalizedName: 'Leche PIL Entera 1 L', presentation: '1 L', quantity: 1, unitPrice: 8.9, totalPrice: 8.9, confidence: 96 },
    { productId: 'aceite-fino-900', rawText: 'ACEITE FINO 900ML', normalizedName: 'Aceite Fino 900 ml', presentation: '900 ml', quantity: 1, unitPrice: 16.5, totalPrice: 16.5, confidence: 94 },
    { productId: 'arroz-5kg', rawText: 'ARROZ GRANO ORO 5KG', normalizedName: 'Arroz 5 kg', presentation: '5 kg', quantity: 1, unitPrice: 56.9, totalPrice: 56.9, confidence: 91 },
    { productId: 'huevos-30', rawText: 'HUEVOS MAPLE X30', normalizedName: 'Huevos x30', presentation: 'x30', quantity: 1, unitPrice: 31.5, totalPrice: 31.5, confidence: 89 },
    { productId: 'fideos-400-3', rawText: 'FIDEO 400G PROMO 3U', normalizedName: 'Fideos 400 g x3', presentation: '400 g x3', quantity: 1, unitPrice: 15, totalPrice: 15, confidence: 93 },
  ],
}

export const weeklyBasket: BasketItem[] = [
  { productId: 'arroz-5kg', quantity: 1 },
  { productId: 'aceite-fino-900', quantity: 2 },
  { productId: 'leche-pil-1l', quantity: 6 },
  { productId: 'huevos-30', quantity: 1 },
  { productId: 'fideos-400-3', quantity: 1 },
]

const freshnessByStore: Record<string, string> = {
  'super-ahorro-equipetrol': 'Hoy',
  'mercado-norte': 'Hace 3 h',
  'mercado-central': 'Ayer',
  'super-familiar': 'Hoy',
}

export const priceObservations: PriceObservation[] = Object.entries(priceMatrix).flatMap(([storeId, prices]) =>
  Object.entries(prices).map(([productId, price]) => ({ productId, storeId, price, freshness: freshnessByStore[storeId] ?? 'Hoy' })),
)

export const priceHistoryByProduct: Record<string, PriceHistoryPoint[]> = {
  'arroz-5kg': [
    { label: '12 jul', price: 54.8 },
    { label: '19 jul', price: 53.6 },
    { label: '26 jul', price: 52.9 },
    { label: '2 ago', price: 51.7 },
    { label: '9 ago', price: 50.5 },
  ],
  'aceite-fino-900': [
    { label: '12 jul', price: 16.1 },
    { label: '19 jul', price: 16.7 },
    { label: '26 jul', price: 15.9 },
    { label: '2 ago', price: 17.4 },
    { label: '9 ago', price: 18.2 },
  ],
  'leche-pil-1l': [
    { label: '12 jul', price: 8.4 },
    { label: '19 jul', price: 8.3 },
    { label: '26 jul', price: 8.6 },
    { label: '2 ago', price: 8.5 },
    { label: '9 ago', price: 8.2 },
  ],
  'huevos-30': [
    { label: '12 jul', price: 30.2 },
    { label: '19 jul', price: 30.8 },
    { label: '26 jul', price: 31.4 },
    { label: '2 ago', price: 30.9 },
    { label: '9 ago', price: 29.8 },
  ],
  'fideos-400-3': [
    { label: '12 jul', price: 14.8 },
    { label: '19 jul', price: 14.6 },
    { label: '26 jul', price: 14.9 },
    { label: '2 ago', price: 14.4 },
    { label: '9 ago', price: 14.2 },
  ],
}

export const userProfile = {
  name: 'Renato',
  location: 'Santa Cruz de la Sierra',
  plan: 'CanastaAI Gratis',
  monthlySavings: 61.8,
}
