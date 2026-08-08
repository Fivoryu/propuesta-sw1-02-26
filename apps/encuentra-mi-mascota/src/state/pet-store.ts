import { create } from 'zustand'
import { defaultPetDraft, isProfileComplete, type PetCandidate, type PetDraft, type PetMatchResult, type PetPhoto, type PetScenarioId } from '../domain/pet'

export type SearchPhase = 'idle' | 'loading' | 'complete' | 'cancelled'

export type SearchState = {
  phase: SearchPhase
  requestId: string | null
  progress: number
  result: PetMatchResult | null
}

export type ProtectedMessagePreview = {
  candidateId: string
  selectedMessage: string
  confirmed: boolean
}

export type LocalConfirmation = {
  candidateId: string
  reference: string
  markedReunited: boolean
}

type PetStore = {
  draft: PetDraft
  photos: PetPhoto[]
  search: SearchState
  candidates: PetCandidate[]
  selectedCandidateId: string | null
  protectedMessagePreview: ProtectedMessagePreview | null
  localConfirmation: LocalConfirmation | null
  duplicateDecision: 'continue' | null
  setDraft: (patch: Partial<PetDraft>) => void
  setScenario: (scenarioId: PetScenarioId) => void
  setPhoto: (photo: PetPhoto) => void
  removePhoto: (slot: PetPhoto['slot']) => void
  setPhotos: (photos: PetPhoto[]) => void
  beginSearch: (requestId: string) => void
  setSearchProgress: (progress: number) => void
  setSearchResult: (requestId: string, result: PetMatchResult) => void
  cancelSearch: () => void
  selectCandidate: (candidateId: string | null) => void
  setMessagePreview: (preview: ProtectedMessagePreview | null) => void
  setLocalConfirmation: (confirmation: LocalConfirmation | null) => void
  markReunited: () => void
  continueDuplicate: () => void
  resetFlow: () => void
}

const defaultSearch: SearchState = {
  phase: 'idle',
  requestId: null,
  progress: 0,
  result: null,
}

function freshDraft(): PetDraft {
  return { ...defaultPetDraft }
}

function revokeUpload(photo: PetPhoto): void {
  if (photo.kind === 'upload' && photo.src.startsWith('blob:')) URL.revokeObjectURL(photo.src)
}

export const usePetStore = create<PetStore>((set) => ({
  draft: freshDraft(),
  photos: [],
  search: defaultSearch,
  candidates: [],
  selectedCandidateId: null,
  protectedMessagePreview: null,
  localConfirmation: null,
  duplicateDecision: null,
  setDraft: (patch) => set((state) => ({ draft: { ...state.draft, ...patch } })),
  setScenario: (scenarioId) => set((state) => ({ draft: { ...state.draft, scenarioId } })),
  setPhoto: (photo) => set((state) => {
    const previous = state.photos.find((item) => item.slot === photo.slot)
    if (previous && previous.src !== photo.src) revokeUpload(previous)
    const photos = [...state.photos.filter((item) => item.slot !== photo.slot), photo]
    return { photos }
  }),
  removePhoto: (slot) => set((state) => {
    const photo = state.photos.find((item) => item.slot === slot)
    if (photo) revokeUpload(photo)
    return { photos: state.photos.filter((item) => item.slot !== slot) }
  }),
  setPhotos: (photos) => set((state) => {
    state.photos.forEach((photo) => {
      if (!photos.some((next) => next.src === photo.src)) revokeUpload(photo)
    })
    return { photos }
  }),
  beginSearch: (requestId) => set({
    search: { phase: 'loading', requestId, progress: 6, result: null },
    candidates: [],
    selectedCandidateId: null,
    protectedMessagePreview: null,
    localConfirmation: null,
    duplicateDecision: null,
  }),
  setSearchProgress: (progress) => set((state) => state.search.phase === 'loading' ? { search: { ...state.search, progress: Math.min(94, Math.max(0, progress)) } } : state),
  setSearchResult: (requestId, result) => set((state) => {
    if (state.search.requestId !== requestId) return state
    const candidates = result.status === 'error' ? [] : result.matches
    return {
      search: { phase: 'complete', requestId, progress: 100, result },
      candidates,
      selectedCandidateId: candidates[0]?.id ?? null,
    }
  }),
  cancelSearch: () => set((state) => ({ search: { ...state.search, phase: 'cancelled', requestId: null, progress: 0 } })),
  selectCandidate: (selectedCandidateId) => set({ selectedCandidateId }),
  setMessagePreview: (protectedMessagePreview) => set({ protectedMessagePreview }),
  setLocalConfirmation: (localConfirmation) => set({ localConfirmation }),
  markReunited: () => set((state) => state.localConfirmation ? { localConfirmation: { ...state.localConfirmation, markedReunited: true } } : state),
  continueDuplicate: () => set({ duplicateDecision: 'continue' }),
  resetFlow: () => set((state) => {
    state.photos.forEach(revokeUpload)
    return {
      draft: freshDraft(),
      photos: [],
      search: defaultSearch,
      candidates: [],
      selectedCandidateId: null,
      protectedMessagePreview: null,
      localConfirmation: null,
      duplicateDecision: null,
    }
  }),
}))

export function isPetDraftNonEmpty(draft: PetDraft, photos: readonly PetPhoto[] = []): boolean {
  return Boolean(draft.name.trim() || draft.description.trim() || draft.colors.trim() || draft.traits.trim() || photos.length)
}

export function hasCompletePetProfile(draft: PetDraft): boolean {
  return isProfileComplete(draft)
}

export function getDefaultPetDraft(): PetDraft {
  return freshDraft()
}
