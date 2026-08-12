import { createContext, useContext, useMemo, useState, type ReactNode } from 'react'
import type { ListingMode, UserMode } from '../domain/types'

type AppState = {
  mode: UserMode
  setMode: (mode: UserMode) => void
  publicationMode: ListingMode
  setPublicationMode: (mode: ListingMode) => void
  published: boolean
  setPublished: (value: boolean) => void
  reservedListingId: string | null
  setReservedListingId: (id: string | null) => void
  routeStarted: boolean
  setRouteStarted: (value: boolean) => void
  completedStopId: string | null
  setCompletedStopId: (id: string | null) => void
}

const ReciScanContext = createContext<AppState | null>(null)

export function useReciScan() {
  const value = useContext(ReciScanContext)
  if (!value) throw new Error('ReciScan context is missing')
  return value
}

export function ReciScanProvider({ children }: { children: ReactNode }) {
  const [mode, setMode] = useState<UserMode>('seller')
  const [publicationMode, setPublicationMode] = useState<ListingMode>('Vender')
  const [published, setPublished] = useState(false)
  const [reservedListingId, setReservedListingId] = useState<string | null>(null)
  const [routeStarted, setRouteStarted] = useState(false)
  const [completedStopId, setCompletedStopId] = useState<string | null>(null)
  const value = useMemo(() => ({ mode, setMode, publicationMode, setPublicationMode, published, setPublished, reservedListingId, setReservedListingId, routeStarted, setRouteStarted, completedStopId, setCompletedStopId }), [mode, publicationMode, published, reservedListingId, routeStarted, completedStopId])
  return <ReciScanContext.Provider value={value}>{children}</ReciScanContext.Provider>
}
