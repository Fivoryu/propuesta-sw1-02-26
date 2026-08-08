import { ArrowUpRight } from 'lucide-react'
import { type ReactNode } from 'react'
import { cn } from '../utils/cn'

export type TopBarProps = {
  brand: string
  subtitle?: string
  brandHref?: string
  navigation?: ReactNode
  actions?: ReactNode
}

export function TopBar({ brand, subtitle, brandHref = '/', navigation, actions }: TopBarProps) {
  return (
    <header className="relative z-10 mx-auto w-full max-w-7xl px-4 pt-4 sm:px-6 lg:px-8">
      <div className="flex min-h-16 flex-wrap items-center justify-between gap-3 rounded-full bg-surface/90 px-4 py-3 shadow-quiet ring-1 ring-inset ring-line/60 backdrop-blur-xl sm:px-5">
        <a className="focus-ring inline-flex min-h-11 items-center gap-3 rounded-full" href={brandHref}>
          <span className="inline-flex h-9 w-9 items-center justify-center rounded-full bg-primary text-sm font-bold text-white">P</span>
          <span className="flex flex-col leading-tight">
            <span className="font-display text-sm font-bold text-ink">{brand}</span>
            {subtitle ? <span className="hidden text-[0.68rem] font-medium uppercase tracking-[0.12em] text-muted sm:block">{subtitle}</span> : null}
          </span>
        </a>
        {navigation ? <nav className="order-3 flex w-full items-center gap-1 overflow-x-auto pb-1 text-sm font-semibold sm:order-none sm:w-auto sm:pb-0" aria-label="Navegación principal">{navigation}</nav> : null}
        {actions ? <div className="flex items-center gap-1">{actions}</div> : <ArrowUpRight aria-hidden="true" className="h-5 w-5 text-accent" />}
      </div>
    </header>
  )
}

export function AppShell({
  children,
  theme = 'portal',
  brand,
  subtitle,
  navigation,
  actions,
  className,
}: {
  children: ReactNode
  theme?: 'portal' | 'barrio' | 'cuaderno' | 'mascota'
  brand: string
  subtitle?: string
  navigation?: ReactNode
  actions?: ReactNode
  className?: string
}) {
  return (
    <div data-theme={theme} className={cn('app-background min-h-dvh overflow-x-hidden', className)}>
      <a className="focus-ring sr-only fixed left-4 top-4 z-40 rounded-full bg-primary px-4 py-3 font-semibold text-white focus:not-sr-only" href="#main-content">
        Ir al contenido principal
      </a>
      <TopBar brand={brand} subtitle={subtitle} navigation={navigation} actions={actions} />
      <main id="main-content" className="mx-auto w-full max-w-7xl px-4 pb-16 pt-8 sm:px-6 md:pb-24 md:pt-12 lg:px-8">
        {children}
      </main>
    </div>
  )
}
