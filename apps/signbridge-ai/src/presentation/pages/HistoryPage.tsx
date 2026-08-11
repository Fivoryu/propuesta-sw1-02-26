import { useState } from 'react'
import { History, Volume2, Trash2, Trash, Filter } from 'lucide-react'
import { useRecognitionStore } from '../../stores/recognitionStore'
import { useSpeech } from '../../hooks/useSpeech'
import { cn } from '../../utils/cn'
import type { HistoryStatus } from '../../types'
import { recentActivity } from '../../services/mock/statistics'

type FilterType = 'all' | 'recognized' | 'corrected' | 'uncertain'

const filters: { key: FilterType; label: string }[] = [
  { key: 'all', label: 'Todos' },
  { key: 'recognized', label: 'Reconocidos' },
  { key: 'corrected', label: 'Corregidos' },
  { key: 'uncertain', label: 'Inciertos' },
]

const statusBadge: Record<HistoryStatus, { label: string; className: string }> = {
  recognized: { label: 'Reconocido', className: 'text-success bg-success/10' },
  uncertain: { label: 'Incierto', className: 'text-warning bg-warning/10' },
  corrected: { label: 'Corregido', className: 'text-info bg-info/10' },
  not_recognized: { label: 'No reconocido', className: 'text-error bg-error/10' },
}

function formatTime(date: Date): string {
  return new Date(date).toLocaleTimeString('es-ES', { hour: '2-digit', minute: '2-digit' })
}

export function HistoryPage() {
  const [activeFilter, setActiveFilter] = useState<FilterType>('all')
  const history = useRecognitionStore((s) => s.history)
  const removeEntry = useRecognitionStore((s) => s.removeHistoryEntry)
  const clearHistory = useRecognitionStore((s) => s.clearHistory)
  const { speak } = useSpeech()

  const filtered = history.filter((e) => {
    if (activeFilter === 'all') return true
    if (activeFilter === 'uncertain') return e.status === 'uncertain' || e.status === 'not_recognized'
    return e.status === activeFilter
  })

  const displayEntries = filtered.length > 0
    ? filtered
    : recentActivity.map((a, i) => ({
        id: `demo-${i}`,
        text: a.text,
        confidence: a.confidence / 100,
        vocabulary: a.vocabulary,
        status: (a.status === 'Reconocido' ? 'recognized' : 'corrected') as HistoryStatus,
        timestamp: (() => {
          const d = new Date()
          const [h, m] = a.time.split(':').map(Number)
          d.setHours(h ?? 10, m ?? 0, 0, 0)
          return d
        })(),
      }))

  return (
    <div className="min-h-full bg-paper">
      <div className="mx-auto max-w-4xl px-4 py-6 lg:px-6">
        <div className="mb-5 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <div className="flex items-center gap-2">
              <History className="h-5 w-5 text-primary" aria-hidden="true" />
              <h1 className="text-xl font-bold text-ink">Historial de sesión</h1>
            </div>
            <p className="text-sm text-muted">{displayEntries.length} registros encontrados.</p>
          </div>

          {history.length > 0 && (
            <button
              onClick={clearHistory}
              className="flex items-center gap-1.5 rounded-lg border border-error/30 px-3 py-2 text-xs font-semibold text-error hover:bg-error/[0.06] transition-colors"
            >
              <Trash className="h-3.5 w-3.5" aria-hidden="true" />
              Limpiar historial
            </button>
          )}
        </div>

        <div className="mb-4 flex items-center gap-2">
          <Filter className="h-4 w-4 text-muted" aria-hidden="true" />
          <div className="flex flex-wrap gap-2" role="group" aria-label="Filtros">
            {filters.map((f) => (
              <button
                key={f.key}
                onClick={() => setActiveFilter(f.key)}
                className={cn(
                  'rounded-full px-3 py-1.5 text-xs font-semibold transition-colors',
                  activeFilter === f.key
                    ? 'bg-primary text-white'
                    : 'bg-surface text-muted ring-1 ring-inset ring-line/70 hover:bg-primary/[0.06] hover:text-ink',
                )}
              >
                {f.label}
              </button>
            ))}
          </div>
        </div>

        <div className="rounded-xl bg-surface ring-1 ring-inset ring-line/60 overflow-hidden">
          {displayEntries.length === 0 ? (
            <div className="flex flex-col items-center gap-3 py-16 text-center">
              <History className="h-10 w-10 text-muted/40" aria-hidden="true" />
              <p className="font-semibold text-ink">Sin registros</p>
              <p className="text-sm text-muted">No hay entradas que coincidan con el filtro seleccionado.</p>
            </div>
          ) : (
            <>
              <div className="hidden grid-cols-[80px_1fr_80px_140px_140px_80px] gap-4 border-b border-line/60 px-5 py-3 sm:grid">
                {['Hora', 'Texto', 'Confianza', 'Vocabulario', 'Estado', ''].map((h) => (
                  <span key={h} className="text-[10px] font-bold uppercase tracking-wider text-muted">
                    {h}
                  </span>
                ))}
              </div>

              <div className="divide-y divide-line/40">
                {displayEntries.map((entry) => {
                  const cfg = statusBadge[entry.status]
                  return (
                    <div
                      key={entry.id}
                      className="flex flex-col gap-2 px-5 py-4 sm:grid sm:grid-cols-[80px_1fr_80px_140px_140px_80px] sm:items-center sm:gap-4"
                    >
                      <span className="text-xs text-muted tabular-nums">{formatTime(entry.timestamp)}</span>
                      <span className="font-semibold text-ink">{entry.text}</span>
                      <span className="text-sm font-bold text-ink">{Math.round(entry.confidence * 100)}%</span>
                      <span className="text-sm text-muted">{entry.vocabulary}</span>
                      <span className={cn('w-fit rounded-full px-2 py-0.5 text-[10px] font-bold', cfg.className)}>
                        {cfg.label}
                      </span>
                      <div className="flex gap-1">
                        <button
                          onClick={() => speak(entry.text)}
                          className="flex h-8 w-8 items-center justify-center rounded-md text-muted hover:bg-primary/[0.08] hover:text-primary transition-colors"
                          aria-label={`Reproducir: ${entry.text}`}
                        >
                          <Volume2 className="h-4 w-4" aria-hidden="true" />
                        </button>
                        {!entry.id.startsWith('demo-') && (
                          <button
                            onClick={() => removeEntry(entry.id)}
                            className="flex h-8 w-8 items-center justify-center rounded-md text-muted hover:bg-error/[0.08] hover:text-error transition-colors"
                            aria-label={`Eliminar: ${entry.text}`}
                          >
                            <Trash2 className="h-4 w-4" aria-hidden="true" />
                          </button>
                        )}
                      </div>
                    </div>
                  )
                })}
              </div>
            </>
          )}
        </div>

        {filtered.length === 0 && history.length === 0 && (
          <p className="mt-3 text-center text-xs text-muted">
            Mostrando datos de demostración. Realiza reconocimientos para ver tu historial real.
          </p>
        )}
      </div>
    </div>
  )
}
