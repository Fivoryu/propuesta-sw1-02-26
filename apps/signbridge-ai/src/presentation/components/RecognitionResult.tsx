import { CheckCircle2, TriangleAlert, XCircle, Volume2, RotateCcw, Check, ChevronDown, ChevronUp, Lightbulb } from 'lucide-react'
import { Button } from '@propuestas/ui'
import { ConfidenceBadge } from './ConfidenceBadge'
import { useRecognitionStore } from '../../stores/recognitionStore'
import { useSpeech } from '../../hooks/useSpeech'
import { cn } from '../../utils/cn'

interface RecognitionResultProps {
  onCorrect: () => void
}

export function RecognitionResult({ onCorrect }: RecognitionResultProps) {
  const phase = useRecognitionStore((s) => s.phase)
  const result = useRecognitionStore((s) => s.currentResult)
  const alternatives = useRecognitionStore((s) => s.alternatives)
  const showAlternatives = useRecognitionStore((s) => s.showAlternatives)
  const setShowAlternatives = useRecognitionStore((s) => s.setShowAlternatives)
  const confirmResult = useRecognitionStore((s) => s.confirmResult)
  const simulate = useRecognitionStore((s) => s.simulateRecognition)
  const reset = useRecognitionStore((s) => s.reset)

  const { speak, isSpeaking } = useSpeech()

  if (phase === 'IDLE') {
    return (
      <div className="flex flex-col items-center justify-center gap-3 rounded-xl bg-surface px-6 py-10 text-center ring-1 ring-inset ring-line/60">
        <span className="inline-flex h-12 w-12 items-center justify-center rounded-full bg-primary/[0.08] text-primary">
          <Volume2 className="h-6 w-6" aria-hidden="true" />
        </span>
        <div>
          <p className="font-semibold text-ink">Esperando reconocimiento</p>
          <p className="text-sm text-muted">Realiza una seña frente a la cámara o usa los controles de simulación.</p>
        </div>
      </div>
    )
  }

  if (phase === 'PROCESSING' || phase === 'READY') {
    return (
      <div className="flex flex-col items-center justify-center gap-4 rounded-xl bg-primary/[0.06] px-6 py-10 text-center ring-1 ring-inset ring-primary/20">
        <span className="inline-flex h-12 w-12 items-center justify-center rounded-full bg-primary/10">
          <span className="h-6 w-6 rounded-full border-2 border-primary/30 border-t-primary animate-spring-spin" />
        </span>
        <div>
          <p className="font-semibold text-primary">Analizando seña...</p>
          <p className="text-sm text-muted">La IA está procesando tu seña. Un momento.</p>
        </div>
      </div>
    )
  }

  if (phase === 'NOT_RECOGNIZED') {
    return (
      <div className="flex flex-col gap-4 rounded-xl bg-error/[0.05] px-5 py-5 ring-1 ring-inset ring-error/20">
        <div className="flex items-start gap-3">
          <XCircle className="mt-0.5 h-5 w-5 shrink-0 text-error" aria-hidden="true" />
          <div>
            <p className="font-bold text-error">No pudimos reconocer la seña</p>
            <p className="mt-1 text-sm text-muted">
              Intenta nuevamente manteniendo las manos visibles y dentro del área indicada.
            </p>
          </div>
        </div>

        <div className="rounded-lg bg-surface p-4 ring-1 ring-inset ring-line/60">
          <p className="mb-2 text-xs font-semibold text-muted">Consejos</p>
          <ul className="space-y-1.5">
            {[
              'Mantén las manos visibles dentro del recuadro',
              'Evita movimientos demasiado rápidos',
              'Utiliza buena iluminación',
              'Colócate frente a la cámara',
            ].map((tip) => (
              <li key={tip} className="flex items-center gap-2 text-sm text-ink">
                <Lightbulb className="h-3.5 w-3.5 shrink-0 text-warning" aria-hidden="true" />
                {tip}
              </li>
            ))}
          </ul>
        </div>

        <Button onClick={reset} variant="secondary" leadingIcon={<RotateCcw className="h-4 w-4" />}>
          Intentar nuevamente
        </Button>
      </div>
    )
  }

  if (!result) return null

  const isRecognized = phase === 'RECOGNIZED'
  const isUncertain = phase === 'UNCERTAIN'

  return (
    <div
      className={cn(
        'flex flex-col gap-4 rounded-xl px-5 py-5 ring-1 ring-inset',
        isRecognized ? 'bg-success/[0.06] ring-success/20' : 'bg-warning/[0.07] ring-warning/20',
      )}
    >
      <div className="flex items-start gap-3">
        {isRecognized ? (
          <CheckCircle2 className="mt-0.5 h-5 w-5 shrink-0 text-success" aria-hidden="true" />
        ) : (
          <TriangleAlert className="mt-0.5 h-5 w-5 shrink-0 text-warning" aria-hidden="true" />
        )}
        <div className="flex-1">
          <p className={cn('text-xs font-bold uppercase tracking-wider', isRecognized ? 'text-success' : 'text-warning')}>
            {isRecognized ? 'Seña reconocida' : 'Resultado posible'}
          </p>
          <p className="mt-1 text-2xl font-bold leading-tight text-ink">
            {isUncertain ? `¿${result.text}?` : result.text}
          </p>
          {isUncertain && (
            <p className="mt-1 text-sm text-muted">No estamos completamente seguros de la interpretación.</p>
          )}
        </div>
      </div>

      <ConfidenceBadge confidence={result.confidence} level={result.level} size="md" />

      <div className="flex flex-wrap gap-2">
        <Button
          onClick={() => speak(result.text)}
          loading={isSpeaking}
          leadingIcon={<Volume2 className="h-4 w-4" />}
          size="sm"
        >
          Reproducir voz
        </Button>

        <Button
          onClick={confirmResult}
          variant="secondary"
          leadingIcon={<Check className="h-4 w-4" />}
          size="sm"
        >
          Confirmar
        </Button>

        <Button
          onClick={() => simulate()}
          variant="secondary"
          leadingIcon={<RotateCcw className="h-4 w-4" />}
          size="sm"
        >
          Repetir
        </Button>

        <Button
          onClick={onCorrect}
          variant="ghost"
          size="sm"
        >
          Corregir
        </Button>
      </div>

      {isUncertain && alternatives.length > 0 && (
        <div>
          <button
            onClick={() => setShowAlternatives(!showAlternatives)}
            className="flex items-center gap-1 text-xs font-semibold text-warning hover:text-warning/80 transition-colors"
          >
            Ver alternativas
            {showAlternatives ? (
              <ChevronUp className="h-3.5 w-3.5" aria-hidden="true" />
            ) : (
              <ChevronDown className="h-3.5 w-3.5" aria-hidden="true" />
            )}
          </button>

          {showAlternatives && (
            <div className="mt-2 space-y-2 rounded-lg bg-surface p-3 ring-1 ring-inset ring-line/60">
              {alternatives.map((alt) => (
                <button
                  key={alt.text}
                  onClick={() => speak(alt.text)}
                  className="flex w-full items-center justify-between rounded-md px-2 py-1.5 text-sm hover:bg-primary/[0.06] transition-colors text-left"
                >
                  <span className="font-medium text-ink">{alt.text}</span>
                  <span className="text-xs text-muted">{Math.round(alt.confidence * 100)}%</span>
                </button>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  )
}
