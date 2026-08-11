import { cn } from '../../utils/cn'
import type { RecognitionPhase, CameraState } from '../../types'

const phaseConfig: Record<RecognitionPhase, { label: string; color: string; dot: string; pulse?: boolean }> = {
  IDLE: { label: 'En espera', color: 'text-muted', dot: 'bg-muted/50' },
  READY: { label: 'Listo', color: 'text-info', dot: 'bg-info', pulse: true },
  PROCESSING: { label: 'Procesando...', color: 'text-info', dot: 'bg-info', pulse: true },
  RECOGNIZED: { label: 'Seña reconocida', color: 'text-success', dot: 'bg-success' },
  UNCERTAIN: { label: 'Resultado posible', color: 'text-warning', dot: 'bg-warning' },
  NOT_RECOGNIZED: { label: 'No reconocido', color: 'text-error', dot: 'bg-error' },
  CAMERA_ERROR: { label: 'Error de cámara', color: 'text-error', dot: 'bg-error' },
}

const cameraConfig: Record<CameraState, { label: string; color: string; dot: string; pulse?: boolean }> = {
  idle: { label: 'Cámara inactiva', color: 'text-muted', dot: 'bg-muted/50' },
  requesting: { label: 'Solicitando permiso...', color: 'text-info', dot: 'bg-info', pulse: true },
  active: { label: 'Cámara activa', color: 'text-success', dot: 'bg-success' },
  paused: { label: 'Cámara pausada', color: 'text-muted', dot: 'bg-muted' },
  error: { label: 'Error de cámara', color: 'text-error', dot: 'bg-error' },
}

interface StatusIndicatorProps {
  phase?: RecognitionPhase
  cameraState?: CameraState
  className?: string
}

export function StatusIndicator({ phase, cameraState, className }: StatusIndicatorProps) {
  const config = phase
    ? phaseConfig[phase]
    : cameraState
      ? cameraConfig[cameraState]
      : phaseConfig.IDLE

  return (
    <span className={cn('inline-flex items-center gap-2 text-xs font-semibold', config.color, className)}>
      <span
        className={cn('h-2 w-2 rounded-full', config.dot, config.pulse && 'animate-pulse')}
        aria-hidden="true"
      />
      {config.label}
    </span>
  )
}

export function ProcessingSpinner({ className }: { className?: string }) {
  return (
    <span
      className={cn(
        'inline-block h-4 w-4 rounded-full border-2 border-primary/20 border-t-primary',
        'animate-spring-spin',
        className,
      )}
      role="status"
      aria-label="Procesando"
    />
  )
}
