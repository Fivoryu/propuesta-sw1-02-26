import { useState } from 'react'
import { HandMetal } from 'lucide-react'
import { CameraView } from '../components/CameraView'
import { RecognitionResult } from '../components/RecognitionResult'
import { VocabularySelector } from '../components/VocabularySelector'
import { StatusIndicator } from '../components/StatusIndicator'
import { SessionHistory } from '../components/SessionHistory'
import { CorrectionModal } from '../components/CorrectionModal'
import { SimulationControls } from '../components/SimulationControls'
import { useRecognitionStore } from '../../stores/recognitionStore'
import type { CameraState } from '../../types'

export function RecognitionPage() {
  const [cameraState, setCameraState] = useState<CameraState>('idle')
  const [showCorrection, setShowCorrection] = useState(false)
  const phase = useRecognitionStore((s) => s.phase)
  const history = useRecognitionStore((s) => s.history)

  return (
    <div className="min-h-full bg-paper">
      <div className="mx-auto max-w-6xl px-4 py-6 lg:px-6">
        <div className="mb-5 flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <div className="flex items-center gap-2">
              <HandMetal className="h-5 w-5 text-primary" aria-hidden="true" />
              <h1 className="text-xl font-bold text-ink">Reconocimiento de señas</h1>
            </div>
            <p className="text-sm text-muted">Realiza una seña frente a la cámara para reconocerla.</p>
          </div>

          <div className="flex items-center gap-4">
            <StatusIndicator cameraState={cameraState} />
            <StatusIndicator phase={phase} />
          </div>
        </div>

        <div className="grid gap-5 lg:grid-cols-[1fr_400px]">
          <div className="flex flex-col gap-4">
            <div className="rounded-xl bg-surface p-4 ring-1 ring-inset ring-line/60">
              <div className="mb-4">
                <VocabularySelector />
              </div>
              <CameraView onCameraReady={setCameraState} />
            </div>

            <SimulationControls />

            <div className="rounded-xl bg-surface p-4 ring-1 ring-inset ring-line/60">
              <p className="mb-3 text-sm font-bold text-ink">Historial reciente</p>
              <SessionHistory compact />
              {history.length > 3 && (
                <p className="mt-2 text-center text-xs text-primary font-semibold cursor-pointer hover:underline">
                  Ver historial completo →
                </p>
              )}
            </div>
          </div>

          <div className="flex flex-col gap-4">
            <div className="rounded-xl bg-surface p-4 ring-1 ring-inset ring-line/60">
              <p className="mb-3 text-sm font-bold text-ink">Resultado</p>
              <RecognitionResult onCorrect={() => setShowCorrection(true)} />
            </div>

            <div className="rounded-xl bg-surface p-4 ring-1 ring-inset ring-line/60">
              <p className="mb-2 text-xs font-bold uppercase tracking-wider text-muted">Aviso</p>
              <p className="text-xs text-muted leading-relaxed">
                SignBridge AI es una herramienta de apoyo para vocabularios específicos y no reemplaza a intérpretes profesionales.
              </p>
            </div>
          </div>
        </div>
      </div>

      {showCorrection && (
        <CorrectionModal onClose={() => setShowCorrection(false)} />
      )}
    </div>
  )
}
