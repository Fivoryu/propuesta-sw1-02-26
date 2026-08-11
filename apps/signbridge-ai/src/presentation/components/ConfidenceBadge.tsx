import { cn } from '../../utils/cn'
import type { ConfidenceLevel } from '../../types'

interface ConfidenceBadgeProps {
  confidence: number
  level: ConfidenceLevel
  showLabel?: boolean
  size?: 'sm' | 'md' | 'lg'
}

const levelConfig: Record<ConfidenceLevel, { label: string; bar: string; text: string; bg: string }> = {
  HIGH: { label: 'ALTO', bar: 'bg-success', text: 'text-success', bg: 'bg-success/10' },
  MEDIUM: { label: 'MEDIO', bar: 'bg-warning', text: 'text-warning', bg: 'bg-warning/10' },
  LOW: { label: 'BAJO', bar: 'bg-error', text: 'text-error', bg: 'bg-error/10' },
}

export function ConfidenceBadge({ confidence, level, showLabel = true, size = 'md' }: ConfidenceBadgeProps) {
  const config = levelConfig[level]
  const pct = Math.round(confidence * 100)

  return (
    <div className={cn('flex flex-col gap-1.5', size === 'lg' ? 'gap-2' : '')}>
      <div className="flex items-center justify-between gap-3">
        <div className="flex items-center gap-2">
          {showLabel && (
            <span
              className={cn(
                'rounded-full px-2 py-0.5 text-[10px] font-bold tracking-wide',
                config.bg,
                config.text,
              )}
            >
              {config.label}
            </span>
          )}
          <span className={cn('font-bold', config.text, size === 'lg' ? 'text-2xl' : 'text-lg')}>
            {pct}%
          </span>
        </div>
        <span className="text-xs text-muted">confianza</span>
      </div>

      <div
        className="h-2 overflow-hidden rounded-full bg-line/60"
        role="progressbar"
        aria-valuemin={0}
        aria-valuemax={100}
        aria-valuenow={pct}
        aria-label={`Confianza: ${pct}%`}
      >
        <div
          className={cn('h-full rounded-full transition-all duration-500 ease-spring', config.bar)}
          style={{ width: `${pct}%` }}
        />
      </div>
    </div>
  )
}
