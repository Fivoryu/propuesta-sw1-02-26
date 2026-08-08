import { AlertCircle, CheckCircle2, Info, TriangleAlert } from 'lucide-react'
import { type ReactNode } from 'react'
import { cn } from '../utils/cn'

export type StatusVariant = 'info' | 'success' | 'warning' | 'error'

const statusStyles: Record<StatusVariant, { icon: ReactNode; className: string }> = {
  info: { icon: <Info aria-hidden="true" className="h-5 w-5" />, className: 'bg-info/[0.08] text-info ring-info/20' },
  success: {
    icon: <CheckCircle2 aria-hidden="true" className="h-5 w-5" />,
    className: 'bg-success/[0.08] text-success ring-success/20',
  },
  warning: {
    icon: <TriangleAlert aria-hidden="true" className="h-5 w-5" />,
    className: 'bg-warning/[0.09] text-warning ring-warning/20',
  },
  error: {
    icon: <AlertCircle aria-hidden="true" className="h-5 w-5" />,
    className: 'bg-error/[0.08] text-error ring-error/20',
  },
}

export function StatusBanner({
  title,
  children,
  variant = 'info',
  className,
}: {
  title: string
  children: ReactNode
  variant?: StatusVariant
  className?: string
}) {
  const style = statusStyles[variant]
  return (
    <div className={cn('flex gap-3 rounded-lg p-4 ring-1 ring-inset', style.className, className)} role={variant === 'error' ? 'alert' : 'status'}>
      <span className="mt-0.5 shrink-0">{style.icon}</span>
      <div className="space-y-1">
        <p className="font-semibold">{title}</p>
        <div className="text-sm leading-6 opacity-90">{children}</div>
      </div>
    </div>
  )
}

export function EmptyState({
  title,
  children,
  action,
  icon,
}: {
  title: string
  children: ReactNode
  action?: ReactNode
  icon?: ReactNode
}) {
  return (
    <div className="flex flex-col items-center justify-center rounded-xl bg-surface px-6 py-12 text-center ring-1 ring-inset ring-line/70">
      <span className="mb-4 inline-flex h-12 w-12 items-center justify-center rounded-full bg-primary/[0.08] text-primary">
        {icon ?? <Info aria-hidden="true" className="h-5 w-5" />}
      </span>
      <h3 className="font-display text-xl font-bold text-ink">{title}</h3>
      <div className="mt-2 max-w-md text-sm leading-6 text-muted">{children}</div>
      {action ? <div className="mt-6">{action}</div> : null}
    </div>
  )
}

export function LoadingState({ label = 'Cargando contenido local...' }: { label?: string }) {
  return (
    <div className="flex items-center gap-3 rounded-xl bg-surface p-6 text-sm font-semibold text-muted ring-1 ring-inset ring-line/70" role="status" aria-live="polite">
      <span aria-hidden="true" className="animate-spring-spin h-5 w-5 rounded-full border-2 border-primary/20 border-t-primary" />
      {label}
    </div>
  )
}

export function ConfidenceMeter({ value, label = 'Confianza simulada' }: { value: number; label?: string }) {
  const safeValue = Math.min(1, Math.max(0, value))
  const percentage = Math.round(safeValue * 100)
  return (
    <div className="space-y-2">
      <div className="flex items-center justify-between gap-4 text-sm font-semibold text-ink">
        <span>{label}</span>
        <span>{percentage}%</span>
      </div>
      <div className="h-2 overflow-hidden rounded-full bg-muted/20" role="progressbar" aria-valuemin={0} aria-valuemax={100} aria-valuenow={percentage} aria-label={`${label}: ${percentage}%`}>
        <div className="h-full rounded-full bg-primary transition-[transform] duration-500 ease-spring" style={{ transform: `scaleX(${safeValue})`, transformOrigin: 'left' }} />
      </div>
    </div>
  )
}
