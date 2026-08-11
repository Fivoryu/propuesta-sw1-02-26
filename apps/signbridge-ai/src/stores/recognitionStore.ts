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
import { vocabularies } from '../services/mock/sign-fixtures'
import { recognizeSign } from '../services/mock/recognize-sign'

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
        set((state) => ({ handsDetected: !state.handsDetected })),

      simulateRecognition: (mode = 'success') => {
        set({ phase: 'READY', currentResult: null, showAlternatives: false })

        window.setTimeout(() => {
          set({ phase: 'PROCESSING' })

          const scenarioId =
            mode === 'uncertain'
              ? 'sign-low-confidence'
              : mode === 'error'
                ? 'sign-error'
                : 'sign-success-high'
          const vocabularyId = get().selectedVocabularyId
          const vocabObj = vocabularies.find((vocabulary) => vocabulary.id === vocabularyId)
          const vocabName = vocabObj?.name ?? 'General'

          void recognizeSign({ vocabularyId }, { scenarioId }).then((response) => {
            if (response.status === 'error' || !response.sign) {
              set({
                phase: 'NOT_RECOGNIZED',
                currentResult: null,
                alternatives: [],
              })
              return
            }

            const result: SignResult = {
              text: response.sign.text,
              confidence: response.sign.confidence,
              level: getConfidenceLevel(response.sign.confidence),
              vocabulary: vocabName,
              timestamp: new Date(),
            }

            const newPhase = getPhaseFromConfidence(response.sign.confidence)
            const alternatives: AlternativeResult[] =
              newPhase === 'UNCERTAIN' ? response.alternatives : []

            set({ phase: newPhase, currentResult: result, alternatives })
          })
        }, 200)
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
        const vocabObj = vocabularies.find(
          (vocabulary) => vocabulary.id === get().selectedVocabularyId,
        )

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
        set((state) => ({ history: state.history.filter((entry) => entry.id !== id) })),

      clearHistory: () => set({ history: [] }),

      reset: () =>
        set({ phase: 'IDLE', currentResult: null, alternatives: [], showAlternatives: false }),
    }),
    {
      name: 'signbridge-history',
      partialize: (state) => ({ history: state.history }),
    },
  ),
)
