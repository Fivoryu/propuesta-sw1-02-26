import { create } from 'zustand'
import { santaCruzLocations } from '@propuestas/shared'
import { defaultUrbanEvidence } from '../domain/urban-fixtures'
import type { UrbanAnalysisResult, UrbanCategory, UrbanDraft, UrbanReport, UrbanScenarioId } from '../domain/urban-report'

export type UrbanCorrection = {
  category?: UrbanCategory
  description?: string
}

const defaultDraft: UrbanDraft = {
  approximateLocationId: santaCruzLocations[1].areaId,
  category: 'pothole',
  description: '',
  scenarioId: 'urban-success-high',
  fixtureImageId: defaultUrbanEvidence.fixtureImageId,
  evidence: defaultUrbanEvidence,
}

type UrbanReportStore = {
  draft: UrbanDraft
  analysisResult: UrbanAnalysisResult | null
  correction: UrbanCorrection | null
  confirmedReports: UrbanReport[]
  setDraft: (patch: Partial<UrbanDraft>) => void
  setScenario: (scenarioId: UrbanScenarioId) => void
  setAnalysisResult: (result: UrbanAnalysisResult | null) => void
  setCorrection: (correction: UrbanCorrection | null) => void
  addConfirmedReport: (report: UrbanReport) => void
  resetFlow: () => void
}

export const useUrbanReportStore = create<UrbanReportStore>((set) => ({
  draft: defaultDraft,
  analysisResult: null,
  correction: null,
  confirmedReports: [],
  setDraft: (patch) => set((state) => ({ draft: { ...state.draft, ...patch } })),
  setScenario: (scenarioId) => set((state) => ({ draft: { ...state.draft, scenarioId } })),
  setAnalysisResult: (analysisResult) => set({ analysisResult, correction: null }),
  setCorrection: (correction) => set({ correction }),
  addConfirmedReport: (report) =>
    set((state) => ({
      confirmedReports: state.confirmedReports.some((item) => item.id === report.id)
        ? state.confirmedReports
        : [...state.confirmedReports, report],
    })),
  resetFlow: () => set({ draft: defaultDraft, analysisResult: null, correction: null }),
}))

export function isDraftNonEmpty(draft: UrbanDraft): boolean {
  return Boolean(
    draft.description.trim() ||
      draft.fixtureImageId !== defaultUrbanEvidence.fixtureImageId ||
      draft.evidence.kind === 'upload',
  )
}

export function getDefaultUrbanDraft(): UrbanDraft {
  return {
    ...defaultDraft,
    evidence: { ...defaultDraft.evidence },
  }
}
