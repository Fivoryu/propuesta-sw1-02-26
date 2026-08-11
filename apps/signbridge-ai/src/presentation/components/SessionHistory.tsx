import { Volume2, Trash2, Trash } from 'lucide-react'
import { useRecognitionStore } from '../../stores/recognitionStore'
import { useSpeech } from '../../hooks/useSpeech'
import { cn } from '../../utils/cn'
import type { HistoryStatus } from '../../types'

const statusConfig: Record<HistoryStatus, { label: string; className: string }> = {
  recognized: { label: 'Reconocido', className: 'text-success bg-success/10' },
  uncertain: { label: 'Incierto', className: 'text-warning bg-warning/10' },
  corrected: { label: 'Corregido', className: 'text-info bg-info/10' },
  not_recognized: { label: 'No reconocido', className: 'text-error bg-error/10' },
}

function formatTime(date: Date): string {
  return new Date(date).toLocaleTimeString('es-ES', { hour: '2-digit', minute: '2-digit' })
}

interface SessionHistoryProps {
  compact?: boolean
}

export function SessionHistory({ compact = false }: SessionHistoryProps) {
  const history = useRecognitionStore((s) => s.history)
  const removeEntry = useRecognitionStore((s) => s.removeHistoryEntry)
  const clearHistory = useRecognitionStore((s) => s.clearHistory)
  const { speak } = useSpeech()

  if (history.length === 0) {
    return (
      <div className="flex flex-col items-center gap-2 rounded-xl bg-surface px-4 py-6 text-center ring-1 ring-inset ring-line/60">
        <p className="text-sm font-semibold text-ink">Sin registros aún</p>
        <p className="text-xs text-muted">Las señas reconocidas aparecerán aquí.</p>
      </div>
    )
  }

  const items = compact ? history.slice(0, 3) : history

  return (
    <div className="flex flex-col gap-2">
      {!compact && (
        <div className="flex items-center justify-between">
          <p className="text-sm font-bold text-ink">Historial de sesión</p>
          <button
            onClick={clearHistory}
            className="flex items-center gap-1 text-xs font-semibold text-error hover:text-error/80 transition-colors"
          >
            <Trash className="h-3.5 w-3.5" aria-hidden="true" />
            Limpiar
          </button>
        </div>
      )}

      <div className="flex flex-col gap-1.5">
        {items.map((entry) => {
          const cfg = statusConfig[entry.status]
          return (
            <div
              key={entry.id}
              className="flex items-center gap-3 rounded-lg bg-surface px-3 py-2.5 ring-1 ring-inset ring-line/60"
            >
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2">
                  <span className="text-xs text-muted tabular-nums">{formatTime(entry.timestamp)}</span>
                  <span
                    className={cn('rounded-full px-1.5 py-0.5 text-[9px] font-bold uppercase tracking-wide', cfg.className)}
                  >
                    {cfg.label}
                  </span>
                </div>
                <p className="truncate text-sm font-semibold text-ink">{entry.text}</p>
                {!compact && (
                  <p className="text-[10px] text-muted">
                    {Math.round(entry.confidence * 100)}% · {entry.vocabulary}
                  </p>
                )}
              </div>

              <div className="flex shrink-0 items-center gap-1">
                <button
                  onClick={() => speak(entry.text)}
                  className="flex h-7 w-7 items-center justify-center rounded-md text-muted hover:bg-primary/[0.08] hover:text-primary transition-colors"
                  aria-label={`Reproducir: ${entry.text}`}
                >
                  <Volume2 className="h-3.5 w-3.5" aria-hidden="true" />
                </button>
                {!compact && (
                  <button
                    onClick={() => removeEntry(entry.id)}
                    className="flex h-7 w-7 items-center justify-center rounded-md text-muted hover:bg-error/[0.08] hover:text-error transition-colors"
                    aria-label={`Eliminar: ${entry.text}`}
                  >
                    <Trash2 className="h-3.5 w-3.5" aria-hidden="true" />
                  </button>
                )}
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}
