import { type HTMLAttributes, type ReactNode } from 'react'
import { cn } from '../utils/cn'

export type CardProps = HTMLAttributes<HTMLDivElement> & {
  children: ReactNode
  interactive?: boolean
  bezel?: boolean
}

export function Card({ children, className, interactive = false, bezel = false, ...props }: CardProps) {
  const content = (
    <div
      className={cn(
        'rounded-xl bg-surface ring-1 ring-inset ring-line/60',
        interactive &&
          'transition-[background-color,box-shadow,transform] duration-280 ease-spring hover:-translate-y-1 hover:shadow-quiet',
        className,
      )}
      {...props}
    >
      {children}
    </div>
  )

  return bezel ? <div className="bezel">{content}</div> : content
}

export function CardHeader({ children, className, ...props }: HTMLAttributes<HTMLDivElement>) {
  return (
    <div className={cn('flex flex-col gap-2 p-6', className)} {...props}>
      {children}
    </div>
  )
}

export function CardTitle({ children, className, ...props }: HTMLAttributes<HTMLHeadingElement>) {
  return (
    <h3 className={cn('font-display text-xl font-bold leading-tight text-ink', className)} {...props}>
      {children}
    </h3>
  )
}

export function CardBody({ children, className, ...props }: HTMLAttributes<HTMLDivElement>) {
  return (
    <div className={cn('p-6 pt-0', className)} {...props}>
      {children}
    </div>
  )
}
