export type Product = {
  id: string
  name: string
  presentation: string
  category: string
}

export type Store = {
  id: string
  name: string
  zone: string
  distanceKm: number
}

export type ReceiptItem = {
  productId: string
  rawText: string
  normalizedName: string
  presentation: string
  quantity: number
  unitPrice: number
  totalPrice: number
  confidence: number
}

export type Receipt = {
  id: string
  storeId: string
  dateLabel: string
  items: ReceiptItem[]
  total: number
}

export type BasketItem = {
  productId: string
  quantity: number
}

export type StrategyId = 'savings' | 'distance' | 'balanced'

export type BasketRecommendation = {
  strategyId: StrategyId
  title: string
  usualTotal: number
  recommendedTotal: number
  savings: number
  estimatedTravelKm: number
  stores: Array<{ storeId: string; items: Array<{ productId: string; quantity: number; subtotal: number }>; subtotal: number }>
}

export type PriceObservation = {
  productId: string
  storeId: string
  price: number
  freshness: string
}

export type PriceHistoryPoint = {
  label: string
  price: number
}

export type PriceSortMode = 'price' | 'distance' | 'freshness'
