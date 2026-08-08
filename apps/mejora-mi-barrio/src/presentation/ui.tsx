import { useEffect, useRef, type ReactNode } from 'react'
import { Link, NavLink, useLocation } from 'react-router-dom'
import { motion, useReducedMotion } from 'motion/react'
import {
  Check,
  CheckCircle2,
  CircleDot,
  Eye,
  FileWarning,
  MapPinned,
  Route,
  ShieldCheck,
  TriangleAlert,
  Wrench,
  X,
} from 'lucide-react'
import { AppShell, Badge, Button, Card, CardBody, CardHeader, CardTitle, StatusBanner } from '@propuestas/ui'
import { urbanStatusLabels, type UrbanReport, type UrbanReportStatus } from '../domain/urban-report'

const springEase = [0.32, 0.72, 0, 1] as const

const statusDotColors: Record<UrbanReportStatus, string> = {
  pending: '#C9801E',
  in_review: '#0E7C66',
  in_progress: '#2767A6',
  resolved: '#4B7F52',
}

export const actionLinkClass =
  'focus-ring group inline-flex min-h-12 items-center justify-center gap-2 rounded-full px-5 py-3 text-sm font-semibold transition-[background-color,color,box-shadow,transform,opacity] duration-280 ease-spring active:scale-[0.98]'

export function CivicShell({ children }: { children: ReactNode }) {
  return (
    <AppShell
      theme="barrio"
      brand="Mejora Mi Barrio"
      subtitle="Cuidado urbano local"
      navigation={
        <>
          <NavLink className={navLinkClass} end to="/">
            <MapPinned aria-hidden="true" className="h-4 w-4" />
            Mapa
          </NavLink>
          <NavLink className={navLinkClass} to="/reportar">
            <Route aria-hidden="true" className="h-4 w-4" />
            Reportar
          </NavLink>
          <NavLink className={navLinkClass} to="/mis-reportes">
            <ShieldCheck aria-hidden="true" className="h-4 w-4" />
            Mis reportes
          </NavLink>
        </>
      }
      actions={
        <Link className="focus-ring hidden min-h-11 items-center gap-2 rounded-full bg-primary px-4 py-2 text-sm font-semibold text-white transition-[background-color,transform] duration-280 ease-spring hover:-translate-y-0.5 hover:bg-primary/90 sm:inline-flex" to="/reportar">
          Reportar problema
          <span className="inline-flex h-7 w-7 items-center justify-center rounded-full bg-white/15" aria-hidden="true">
            <Route className="h-4 w-4" />
          </span>
        </Link>
      }
    >
      <RouteFocus />
      {children}
    </AppShell>
  )
}

function RouteFocus() {
  const { pathname } = useLocation()

  useEffect(() => {
    const main = document.getElementById('main-content')
    if (!main) return
    main.setAttribute('tabindex', '-1')
    main.focus({ preventScroll: true })
  }, [pathname])

  return null
}

function navLinkClass({ isActive }: { isActive: boolean }): string {
  return `focus-ring inline-flex min-h-11 items-center gap-2 rounded-full px-3 py-2 transition-[background-color,color,transform] duration-280 ease-spring hover:-translate-y-0.5 ${isActive ? 'bg-primary/[0.1] text-primary' : 'text-muted hover:bg-primary/[0.06] hover:text-primary'}`
}

export function PageIntro({
  eyebrow,
  title,
  description,
  children,
}: {
  eyebrow: string
  title: string
  description: string
  children?: ReactNode
}) {
  return (
    <div className="grid gap-6 pb-8 pt-8 md:grid-cols-[minmax(0,1fr)_auto] md:items-end md:gap-10 md:pb-12 md:pt-12">
      <div className="max-w-3xl">
        <span className="eyebrow">{eyebrow}</span>
        <h1 className="mt-5 max-w-3xl font-display text-[clamp(2.25rem,6vw,5rem)] font-bold leading-[0.98] tracking-[-0.06em] text-ink">{title}</h1>
        <p className="mt-5 max-w-2xl text-base leading-7 text-muted md:text-lg">{description}</p>
      </div>
      {children ? <div className="flex shrink-0 items-center md:justify-end">{children}</div> : null}
    </div>
  )
}

export function MotionReveal({ children, className = '', delay = 0 }: { children: ReactNode; className?: string; delay?: number }) {
  const reduceMotion = useReducedMotion()
  return (
    <motion.div
      className={className}
      initial={reduceMotion ? { opacity: 1 } : { opacity: 0, y: 18 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.62, delay, ease: springEase }}
    >
      {children}
    </motion.div>
  )
}

export function FlowSteps({ current }: { current: number }) {
  const steps = ['Captura', 'Análisis', 'Revisión', 'Confirmación']
  return (
    <ol className="flex w-full flex-wrap items-center gap-2 text-xs font-semibold text-muted" aria-label="Progreso del reporte">
      {steps.map((step, index) => {
        const stepNumber = index + 1
        const active = stepNumber === current
        const complete = stepNumber < current
        return (
          <li className="flex min-h-9 items-center gap-2" key={step}>
            <span className={`inline-flex h-8 w-8 items-center justify-center rounded-full ring-1 ring-inset ${active ? 'bg-primary text-white ring-primary' : complete ? 'bg-primary/[0.1] text-primary ring-primary/20' : 'bg-surface text-muted ring-line/70'}`}>
              {complete ? <Check aria-hidden="true" className="h-4 w-4" /> : stepNumber}
            </span>
            <span className={active ? 'text-primary' : undefined}>{step}</span>
            {index < steps.length - 1 ? <span aria-hidden="true" className="mx-1 h-px w-5 bg-line sm:w-10" /> : null}
          </li>
        )
      })}
    </ol>
  )
}

export function StatusChip({ status }: { status: UrbanReportStatus }) {
  const icon = {
    pending: <CircleDot aria-hidden="true" className="h-3.5 w-3.5" />,
    in_review: <Eye aria-hidden="true" className="h-3.5 w-3.5" />,
    in_progress: <Wrench aria-hidden="true" className="h-3.5 w-3.5" />,
    resolved: <CheckCircle2 aria-hidden="true" className="h-3.5 w-3.5" />,
  }[status]
  const style = {
    pending: 'bg-warning/[0.1] text-warning ring-warning/20',
    in_review: 'bg-primary/[0.1] text-primary ring-primary/20',
    in_progress: 'bg-info/[0.1] text-info ring-info/20',
    resolved: 'bg-success/[0.1] text-success ring-success/20',
  }[status]
  return (
    <span className={`inline-flex min-h-8 items-center gap-1.5 rounded-full px-3 py-1 text-xs font-semibold ring-1 ring-inset ${style}`}>
      {icon}
      {urbanStatusLabels[status]}
    </span>
  )
}

export function MapLegend() {
  const entries: Array<{ status: UrbanReportStatus; label: string }> = [
    { status: 'pending', label: 'Pendiente' },
    { status: 'in_review', label: 'En revisión' },
    { status: 'in_progress', label: 'En proceso' },
    { status: 'resolved', label: 'Resuelto' },
  ]
  return (
    <div className="mt-8 border-t border-white/15 pt-5">
      <p className="text-[0.68rem] font-semibold uppercase tracking-[0.14em] text-[#9ccbb9]">Clave de estados</p>
      <div className="mt-3 grid grid-cols-2 gap-2 text-xs font-semibold text-[#eefaf4]">
        {entries.map((entry) => <span className="flex items-center gap-2" key={entry.status}><span className="h-2.5 w-2.5 rounded-full" style={{ backgroundColor: statusDotColors[entry.status] }} aria-hidden="true" />{entry.label}</span>)}
      </div>
    </div>
  )
}

export function EvidencePreview({ evidence, compact = false }: { evidence: UrbanReport['evidence']; compact?: boolean }) {
  return (
    <div className={`overflow-hidden rounded-[1.35rem] bg-[#dcece5] ring-1 ring-inset ring-primary/10 ${compact ? 'aspect-[4/3]' : 'aspect-[16/10]'}`}>
      <img className="h-full w-full object-cover" src={evidence.src} alt={evidence.alt} />
    </div>
  )
}

export function CancelDialog({
  open,
  onKeepEditing,
  onDiscard,
}: {
  open: boolean
  onKeepEditing: () => void
  onDiscard: () => void
}) {
  const keepButtonRef = useRef<HTMLButtonElement>(null)

  useEffect(() => {
    if (!open) return
    keepButtonRef.current?.focus()
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') onKeepEditing()
    }
    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [onKeepEditing, open])

  if (!open) return null

  return (
    <div className="fixed inset-0 z-40 flex items-end justify-center bg-[#17332d]/45 p-4 sm:items-center" role="presentation">
      <div className="w-full max-w-lg rounded-[2rem] bg-surface p-1.5 ring-1 ring-inset ring-white/80" role="dialog" aria-modal="true" aria-labelledby="cancel-dialog-title">
        <div className="rounded-[calc(2rem-0.375rem)] bg-surface p-6 ring-1 ring-inset ring-line/60 sm:p-8">
          <span className="eyebrow">Borrador local</span>
          <h2 className="mt-4 font-display text-2xl font-bold tracking-[-0.04em] text-ink" id="cancel-dialog-title">¿Querés salir del reporte?</h2>
          <p className="mt-3 text-sm leading-6 text-muted">Todavía hay datos en este borrador. Podés seguir editando o descartarlo; nada se envió fuera de esta demostración.</p>
          <div className="mt-7 flex flex-col-reverse gap-3 sm:flex-row sm:justify-end">
            <Button ref={keepButtonRef} variant="secondary" onClick={onKeepEditing}>Seguir editando</Button>
            <Button variant="danger" leadingIcon={<X aria-hidden="true" className="h-4 w-4" />} onClick={onDiscard}>Descartar borrador</Button>
          </div>
        </div>
      </div>
    </div>
  )
}

export function RecoveryPanel({ title, description, children }: { title: string; description: string; children: ReactNode }) {
  return (
    <CivicShell>
      <MotionReveal>
        <div className="mx-auto max-w-2xl py-16 md:py-24">
          <Card bezel>
            <CardHeader>
              <Badge variant="accent">Ruta recuperable</Badge>
              <CardTitle className="pt-3 text-3xl">{title}</CardTitle>
            </CardHeader>
            <CardBody>
              <p className="text-base leading-7 text-muted">{description}</p>
              <div className="mt-7 flex flex-wrap gap-3">{children}</div>
            </CardBody>
          </Card>
        </div>
      </MotionReveal>
    </CivicShell>
  )
}

export function SimulatedNotice({ children }: { children: ReactNode }) {
  return (
    <StatusBanner title="Demostración local" variant="info">
      {children}
    </StatusBanner>
  )
}

export function AnalysisStateIcon({ status }: { status: 'success' | 'warning' | 'error' }) {
  if (status === 'success') return <CheckCircle2 aria-hidden="true" className="h-6 w-6" />
  if (status === 'error') return <FileWarning aria-hidden="true" className="h-6 w-6" />
  return <TriangleAlert aria-hidden="true" className="h-6 w-6" />
}
