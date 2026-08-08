import { forwardRef, type ButtonHTMLAttributes, type ReactNode } from 'react'
import { LoaderCircle } from 'lucide-react'
import { cn } from '../utils/cn'

export type ButtonVariant = 'primary' | 'secondary' | 'ghost' | 'danger'
export type ButtonSize = 'sm' | 'md' | 'lg'

export type ButtonProps = ButtonHTMLAttributes<HTMLButtonElement> & {
  variant?: ButtonVariant
  size?: ButtonSize
  loading?: boolean
  leadingIcon?: ReactNode
  trailingIcon?: ReactNode
}

const variantClasses: Record<ButtonVariant, string> = {
  primary: 'bg-primary text-white shadow-quiet hover:-translate-y-0.5 hover:bg-primary/90',
  secondary:
    'bg-surface text-primary ring-1 ring-inset ring-primary/20 hover:-translate-y-0.5 hover:bg-primary/[0.06]',
  ghost: 'bg-transparent text-primary hover:bg-primary/[0.08]',
  danger: 'bg-error text-white hover:-translate-y-0.5 hover:bg-error/90',
}

const sizeClasses: Record<ButtonSize, string> = {
  sm: 'min-h-10 min-w-[88px] px-4 py-2 text-sm',
  md: 'min-h-12 min-w-[120px] px-5 py-3 text-sm',
  lg: 'min-h-14 min-w-[160px] px-6 py-3.5 text-base',
}

export const Button = forwardRef<HTMLButtonElement, ButtonProps>(function Button(
  {
    className,
    variant = 'primary',
    size = 'md',
    loading = false,
    disabled,
    leadingIcon,
    trailingIcon,
    children,
    ...props
  },
  ref,
) {
  return (
    <button
      ref={ref}
      className={cn(
        'focus-ring group inline-flex cursor-pointer items-center justify-center gap-2 rounded-full font-semibold transition-[background-color,color,box-shadow,transform,opacity] duration-280 ease-spring active:scale-[0.98] disabled:cursor-not-allowed disabled:opacity-50 disabled:hover:translate-y-0',
        variantClasses[variant],
        sizeClasses[size],
        className,
      )}
      disabled={disabled || loading}
      aria-busy={loading || undefined}
      {...props}
    >
      {loading ? <LoaderCircle aria-hidden="true" className="animate-spring-spin h-4 w-4" /> : leadingIcon}
      <span>{children}</span>
      {trailingIcon ? (
        <span className="inline-flex h-7 w-7 items-center justify-center rounded-full bg-white/15 transition-transform duration-280 ease-spring group-hover:translate-x-1 group-hover:-translate-y-px group-hover:scale-105">
          {trailingIcon}
        </span>
      ) : null}
    </button>
  )
})

Button.displayName = 'Button'
