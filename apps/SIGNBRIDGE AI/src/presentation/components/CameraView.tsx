import { useEffect } from 'react'
import { Camera, RefreshCw, Shield, Hand } from 'lucide-react'
import { Button } from '@propuestas/ui'
import { useCamera } from '../../hooks/useCamera'
import { ProcessingSpinner } from './StatusIndicator'
import { useRecognitionStore } from '../../stores/recognitionStore'
import type { CameraState } from '../../types'

interface CameraViewProps {
  onCameraReady?: (state: CameraState) => void
}

export function CameraView({ onCameraReady }: CameraViewProps) {
  const { videoRef, state, error, startCamera, stopCamera, pauseCamera, resumeCamera } = useCamera()
  const phase = useRecognitionStore((s) => s.phase)
  const handsDetected = useRecognitionStore((s) => s.handsDetected)

  useEffect(() => {
    onCameraReady?.(state)
  }, [state, onCameraReady])

  useEffect(() => {
    return () => {
      stopCamera()
    }
  }, [stopCamera])

  const isPaused = state === 'paused'
  const isActive = state === 'active'
  const isProcessing = phase === 'PROCESSING'

  return (
    <div className="flex flex-col gap-3">
      <div className="relative overflow-hidden rounded-2xl bg-ink aspect-video w-full shadow-lift">
        {(state === 'idle' || state === 'requesting') && (
          <div className="absolute inset-0 flex flex-col items-center justify-center gap-4 bg-ink/95 text-center">
            {state === 'requesting' ? (
              <>
                <ProcessingSpinner className="h-8 w-8" />
                <p className="text-sm font-semibold text-white/80">Solicitando acceso a la cámara...</p>
              </>
            ) : (
              <>
                <span className="flex h-16 w-16 items-center justify-center rounded-2xl bg-primary/20 text-primary">
                  <Camera className="h-8 w-8" aria-hidden="true" />
                </span>
                <div className="space-y-1">
                  <p className="text-base font-semibold text-white">Necesitamos acceso a la cámara</p>
                  <p className="text-sm text-white/60">Para reconocer tus señas necesitamos usar la cámara.</p>
                </div>
                <Button onClick={() => void startCamera()} leadingIcon={<Camera className="h-4 w-4" />}>
                  Permitir cámara
                </Button>
              </>
            )}
          </div>
        )}

        {state === 'error' && (
          <div className="absolute inset-0 flex flex-col items-center justify-center gap-4 bg-ink/95 text-center px-6">
            <span className="flex h-16 w-16 items-center justify-center rounded-2xl bg-error/20 text-error">
              <Camera className="h-8 w-8" aria-hidden="true" />
            </span>
            <div className="space-y-1">
              <p className="text-base font-semibold text-white">No fue posible acceder a la cámara</p>
              <p className="text-sm text-white/60">{error}</p>
            </div>
            <Button
              onClick={() => void startCamera()}
              leadingIcon={<RefreshCw className="h-4 w-4" />}
              variant="secondary"
            >
              Intentar nuevamente
            </Button>
          </div>
        )}

        {isPaused && (
          <div className="absolute inset-0 flex flex-col items-center justify-center gap-3 bg-ink/70">
            <p className="text-sm font-semibold text-white">Cámara pausada</p>
            <Button onClick={() => void resumeCamera()} size="sm" variant="secondary">
              Reanudar
            </Button>
          </div>
        )}

        <video
          ref={videoRef}
          className="h-full w-full object-cover"
          autoPlay
          playsInline
          muted
          aria-label="Vista de cámara para reconocimiento de señas"
        />

        {isActive && (
          <>
            <div className="pointer-events-none absolute inset-8 rounded-xl border-2 border-white/30">
              <div className="absolute -left-px -top-px h-6 w-6 rounded-tl-xl border-l-4 border-t-4 border-white" />
              <div className="absolute -right-px -top-px h-6 w-6 rounded-tr-xl border-r-4 border-t-4 border-white" />
              <div className="absolute -bottom-px -left-px h-6 w-6 rounded-bl-xl border-b-4 border-l-4 border-white" />
              <div className="absolute -bottom-px -right-px h-6 w-6 rounded-br-xl border-b-4 border-r-4 border-white" />
              <p className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 whitespace-nowrap rounded-full bg-ink/60 px-3 py-1 text-xs font-semibold text-white/90 backdrop-blur-sm">
                Coloca tus manos aquí
              </p>
            </div>

            {isProcessing && (
              <div className="absolute inset-0 rounded-2xl ring-4 ring-primary/60 animate-pulse" />
            )}

            <div className="absolute bottom-3 left-3 flex items-center gap-2 rounded-full bg-ink/70 px-3 py-1.5 text-xs font-semibold text-white backdrop-blur-sm">
              <Hand className={`h-3.5 w-3.5 ${handsDetected ? 'text-success' : 'text-muted'}`} aria-hidden="true" />
              {handsDetected ? 'Manos detectadas' : 'Sin manos detectadas'}
            </div>

            {isProcessing && (
              <div className="absolute right-3 top-3 flex items-center gap-2 rounded-full bg-primary px-3 py-1.5 text-xs font-semibold text-white">
                <ProcessingSpinner className="h-3 w-3 border-white/30 border-t-white" />
                Analizando
              </div>
            )}
          </>
        )}
      </div>

      <div className="flex items-start gap-2 rounded-lg bg-primary/[0.06] px-3 py-2">
        <Shield className="mt-0.5 h-3.5 w-3.5 shrink-0 text-primary" aria-hidden="true" />
        <p className="text-[11px] text-muted">
          Tu video no se almacena. La cámara se utiliza únicamente durante la sesión de reconocimiento.
        </p>
      </div>

      {(isActive || isPaused) && (
        <div className="flex gap-2">
          <button
            onClick={isPaused ? () => void resumeCamera() : pauseCamera}
            className="flex-1 rounded-lg border border-line/70 bg-surface px-3 py-2 text-xs font-semibold text-muted hover:bg-primary/[0.06] hover:text-ink transition-colors"
          >
            {isPaused ? 'Reanudar cámara' : 'Pausar cámara'}
          </button>
          <button
            onClick={stopCamera}
            className="flex-1 rounded-lg border border-error/30 bg-surface px-3 py-2 text-xs font-semibold text-error hover:bg-error/[0.06] transition-colors"
          >
            Detener cámara
          </button>
        </div>
      )}
    </div>
  )
}
