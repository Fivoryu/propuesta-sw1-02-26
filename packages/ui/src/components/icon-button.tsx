import { forwardRef, type ButtonHTMLAttributes, type ReactNode } from 'react'
import { cn } from '../utils/cn'

export type IconButtonProps = ButtonHTMLAttributes<HTMLButtonElement> & {
  label: string
  icon: ReactNode
  size?: 'sm' | 'md'
}

export const IconButton = forwardRef<HTMLButtonElement, IconButtonProps>(function IconButton(
  { label, icon, size = 'md', className, ...props },
  ref,
) {
  return (
    <button
      ref={ref}
      type="button"
      className={cn(
        'focus-ring inline-flex shrink-0 cursor-pointer items-center justify-center rounded-full text-primary transition-[background-color,color,transform,opacity] duration-280 ease-spring hover:-translate-y-0.5 hover:bg-primary/[0.08] active:scale-[0.96] disabled:cursor-not-allowed disabled:opacity-50',
        size === 'sm' ? 'min-h-10 min-w-10' : 'min-h-11 min-w-11',
        className,
      )}
      aria-label={label}
      title={label}
      {...props}
    >
      {icon}
    </button>
  )
})

IconButton.displayName = 'IconButton'
