import { ChevronDown } from 'lucide-react'
import { vocabularies } from '../../data/mockSigns'
import { useRecognitionStore } from '../../stores/recognitionStore'

export function VocabularySelector() {
  const selectedId = useRecognitionStore((s) => s.selectedVocabularyId)
  const setVocabulary = useRecognitionStore((s) => s.setSelectedVocabulary)

  const current = vocabularies.find((v) => v.id === selectedId)

  return (
    <div className="flex flex-col gap-1">
      <label htmlFor="vocabulary-select" className="text-xs font-semibold text-muted">
        Vocabulario activo
      </label>
      <div className="relative">
        <select
          id="vocabulary-select"
          value={selectedId}
          onChange={(e) => setVocabulary(e.target.value)}
          className="w-full appearance-none rounded-lg border border-line/70 bg-surface py-2.5 pl-3 pr-10 text-sm font-semibold text-ink shadow-sm focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20"
        >
          {vocabularies.map((v) => (
            <option key={v.id} value={v.id}>
              {v.name}
            </option>
          ))}
        </select>
        <ChevronDown
          className="pointer-events-none absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted"
          aria-hidden="true"
        />
      </div>
      {current && (
        <p className="text-[10px] text-muted">
          {current.totalSigns} señas disponibles
        </p>
      )}
    </div>
  )
}
