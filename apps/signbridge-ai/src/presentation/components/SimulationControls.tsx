import { Zap, AlertTriangle, XCircle, ToggleLeft } from 'lucide-react'
import { useRecognitionStore } from '../../stores/recognitionStore'

export function SimulationControls() {
  const simulate = useRecognitionStore((s) => s.simulateRecognition)
  const toggleHands = useRecognitionStore((s) => s.toggleHandsDetected)
  const handsDetected = useRecognitionStore((s) => s.handsDetected)
  const phase = useRecognitionStore((s) => s.phase)

  const isProcessing = phase === 'PROCESSING' || phase === 'READY'

  return (
    <div className="rounded-xl border border-dashed border-primary/30 bg-primary/[0.03] p-4">
      <p className="mb-3 text-[10px] font-bold uppercase tracking-wider text-primary/60">
        Controles de demostración
      </p>
      <div className="flex flex-wrap gap-2">
        <button
          onClick={() => simulate('success')}
          disabled={isProcessing}
          className="flex items-center gap-1.5 rounded-lg bg-success/10 px-3 py-2 text-xs font-semibold text-success hover:bg-success/20 transition-colors disabled:opacity-40"
        >
          <Zap className="h-3.5 w-3.5" aria-hidden="true" />
          Simular éxito
        </button>
        <button
          onClick={() => simulate('uncertain')}
          disabled={isProcessing}
          className="flex items-center gap-1.5 rounded-lg bg-warning/10 px-3 py-2 text-xs font-semibold text-warning hover:bg-warning/20 transition-colors disabled:opacity-40"
        >
          <AlertTriangle className="h-3.5 w-3.5" aria-hidden="true" />
          Simular incertidumbre
        </button>
        <button
          onClick={() => simulate('error')}
          disabled={isProcessing}
          className="flex items-center gap-1.5 rounded-lg bg-error/10 px-3 py-2 text-xs font-semibold text-error hover:bg-error/20 transition-colors disabled:opacity-40"
        >
          <XCircle className="h-3.5 w-3.5" aria-hidden="true" />
          Simular error
        </button>
        <button
          onClick={toggleHands}
          className={`flex items-center gap-1.5 rounded-lg px-3 py-2 text-xs font-semibold transition-colors ${
            handsDetected
              ? 'bg-success/10 text-success hover:bg-success/20'
              : 'bg-muted/10 text-muted hover:bg-muted/20'
          }`}
        >
          <ToggleLeft className="h-3.5 w-3.5" aria-hidden="true" />
          {handsDetected ? 'Ocultar manos' : 'Detectar manos'}
        </button>
      </div>
    </div>
  )
}
