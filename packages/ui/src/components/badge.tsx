import { type HTMLAttributes } from 'react'
import { cn } from '../utils/cn'

export type BadgeVariant = 'neutral' | 'primary' | 'accent' | 'success' | 'warning' | 'error'

const variantClasses: Record<BadgeVariant, string> = {
  neutral: 'bg-muted/30 text-muted',
  primary: 'bg-primary/[0.09] text-primary',
  accent: 'bg-accent/20 text-ink',
  success: 'bg-success/10 text-success',
  warning: 'bg-warning/10 text-warning',
  error: 'bg-error/10 text-error',
}

export function Badge({
  children,
  className,
  variant = 'neutral',
  ...props
}: HTMLAttributes<HTMLSpanElement> & { variant?: BadgeVariant }) {
  return (
    <span
      className={cn('inline-flex items-center rounded-full px-3 py-1 text-xs font-semibold', variantClasses[variant], className)}
      {...props}
    >
      {children}
    </span>
  )
}
