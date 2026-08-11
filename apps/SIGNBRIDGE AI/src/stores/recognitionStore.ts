import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import type {
  RecognitionPhase,
  SignResult,
  AlternativeResult,
  HistoryEntry,
  SimulationMode,
  ConfidenceLevel,
} from '../types'
import { vocabularies } from '../data/mockSigns'

function getConfidenceLevel(confidence: number): ConfidenceLevel {
  if (confidence >= 0.85) return 'HIGH'
  if (confidence >= 0.60) return 'MEDIUM'
  return 'LOW'
}

function getPhaseFromConfidence(confidence: number): RecognitionPhase {
  if (confidence >= 0.85) return 'RECOGNIZED'
  if (confidence >= 0.60) return 'UNCERTAIN'
  return 'NOT_RECOGNIZED'
}

const successResults = [
  { text: 'Hola', confidence: 0.96 },
  { text: 'Necesito ayuda', confidence: 0.94 },
  { text: 'Gracias', confidence: 0.91 },
  { text: '¿Dónde está recepción?', confidence: 0.88 },
  { text: 'Sí', confidence: 0.97 },
  { text: 'No', confidence: 0.95 },
  { text: 'Por favor', confidence: 0.90 },
]

const uncertainResult = { text: 'Gracias', confidence: 0.72 }

interface RecognitionState {
  phase: RecognitionPhase
  currentResult: SignResult | null
  alternatives: AlternativeResult[]
  history: HistoryEntry[]
  selectedVocabularyId: string
  showAlternatives: boolean
  handsDetected: boolean

  setPhase: (phase: RecognitionPhase) => void
  setSelectedVocabulary: (id: string) => void
  setShowAlternatives: (show: boolean) => void
  toggleHandsDetected: () => void
  simulateRecognition: (mode?: SimulationMode) => void
  confirmResult: () => void
  correctResult: (correctedText: string) => void
  removeHistoryEntry: (id: string) => void
  clearHistory: () => void
  reset: () => void
}

export const useRecognitionStore = create<RecognitionState>()(
  persist(
    (set, get) => ({
      phase: 'IDLE',
      currentResult: null,
      alternatives: [],
      history: [],
      selectedVocabularyId: 'reception',
      showAlternatives: false,
      handsDetected: false,

      setPhase: (phase) => set({ phase }),

      setSelectedVocabulary: (id) => set({ selectedVocabularyId: id }),

      setShowAlternatives: (show) => set({ showAlternatives: show }),

      toggleHandsDetected: () =>
        set((s) => ({ handsDetected: !s.handsDetected })),

      simulateRecognition: (mode = 'success') => {
        set({ phase: 'READY', currentResult: null, showAlternatives: false })

        setTimeout(() => {
          set({ phase: 'PROCESSING' })
        }, 200)

        setTimeout(() => {
          const vocab = get().selectedVocabularyId
          const vocabObj = vocabularies.find((v) => v.id === vocab)
          const vocabName = vocabObj?.name ?? 'General'

          if (mode === 'error') {
            set({
              phase: 'NOT_RECOGNIZED',
              currentResult: null,
              alternatives: [],
            })
            return
          }

          const raw =
            mode === 'uncertain'
              ? uncertainResult
              : successResults[Math.floor(Math.random() * successResults.length)]

          if (!raw) return

          const result: SignResult = {
            text: raw.text,
            confidence: raw.confidence,
            level: getConfidenceLevel(raw.confidence),
            vocabulary: vocabName,
            timestamp: new Date(),
          }

          const newPhase = getPhaseFromConfidence(raw.confidence)

          const alts: AlternativeResult[] =
            newPhase === 'UNCERTAIN'
              ? [
                  { text: raw.text, confidence: raw.confidence },
                  { text: 'Necesito información', confidence: 0.19 },
                  { text: 'Por favor', confidence: 0.09 },
                ]
              : []

          set({ phase: newPhase, currentResult: result, alternatives: alts })
        }, 1700)
      },

      confirmResult: () => {
        const { currentResult, history } = get()
        if (!currentResult) return

        const entry: HistoryEntry = {
          id: crypto.randomUUID(),
          text: currentResult.text,
          confidence: currentResult.confidence,
          vocabulary: currentResult.vocabulary,
          status: currentResult.level === 'HIGH' ? 'recognized' : 'uncertain',
          timestamp: currentResult.timestamp,
        }

        set({ history: [entry, ...history].slice(0, 50), phase: 'IDLE', currentResult: null })
      },

      correctResult: (correctedText) => {
        const { currentResult, history } = get()
        const vocab = get().selectedVocabularyId
        const vocabObj = vocabularies.find((v) => v.id === vocab)

        const entry: HistoryEntry = {
          id: crypto.randomUUID(),
          text: correctedText,
          confidence: currentResult?.confidence ?? 0,
          vocabulary: vocabObj?.name ?? 'General',
          status: 'corrected',
          timestamp: new Date(),
        }

        set({ history: [entry, ...history].slice(0, 50), phase: 'IDLE', currentResult: null })
      },

      removeHistoryEntry: (id) =>
        set((s) => ({ history: s.history.filter((e) => e.id !== id) })),

      clearHistory: () => set({ history: [] }),

      reset: () =>
        set({ phase: 'IDLE', currentResult: null, alternatives: [], showAlternatives: false }),
    }),
    {
      name: 'signbridge-history',
      partialize: (s) => ({ history: s.history }),
    },
  ),
)
