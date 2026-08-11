export type RecognitionPhase =
  | 'IDLE'
  | 'READY'
  | 'PROCESSING'
  | 'RECOGNIZED'
  | 'UNCERTAIN'
  | 'NOT_RECOGNIZED'
  | 'CAMERA_ERROR'

export type ConfidenceLevel = 'HIGH' | 'MEDIUM' | 'LOW'

export type HistoryStatus = 'recognized' | 'uncertain' | 'corrected' | 'not_recognized'

export interface SignResult {
  text: string
  confidence: number
  level: ConfidenceLevel
  vocabulary: string
  timestamp: Date
}

export interface AlternativeResult {
  text: string
  confidence: number
}

export interface HistoryEntry {
  id: string
  text: string
  confidence: number
  vocabulary: string
  status: HistoryStatus
  timestamp: Date
}

export interface MockSign {
  text: string
  confidence: number
  description?: string
}

export interface Vocabulary {
  id: string
  name: string
  signs: MockSign[]
  totalSigns: number
}

export type CameraState = 'idle' | 'requesting' | 'active' | 'paused' | 'error'

export type SimulationMode = 'success' | 'uncertain' | 'error'
