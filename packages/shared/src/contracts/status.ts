export type MockStatus =
  | 'success'
  | 'low_confidence'
  | 'duplicate'
  | 'no_match'
  | 'error'

export type MockOptions = {
  scenarioId?: string
  latencyMs?: number
  signal?: AbortSignal
}

export type MockMeta = {
  scenarioId: string
  status: MockStatus
  latencyMs: number
  disclaimer: 'simulated'
}

export type ConfidenceBand = 'high' | 'medium' | 'low'

export type RequestState = 'idle' | 'loading' | 'success' | 'error'

export type SimulatedDisclaimer =
  'Esta demostración usa datos simulados; no es una predicción real.'
