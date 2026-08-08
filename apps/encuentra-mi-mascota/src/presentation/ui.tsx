import { useEffect, useRef, type ReactNode } from 'react'
import { motion, useReducedMotion } from 'motion/react'
import { ArrowLeft, ArrowRight, Check, CircleAlert, HeartHandshake, MapPinned, ShieldCheck, X } from 'lucide-react'
import { Link, NavLink, useLocation } from 'react-router-dom'
import { AppShell, Badge, Button, Card, CardBody, CardHeader, CardTitle, ConfidenceMeter, StatusBanner } from '@propuestas/ui'
import { MATCH_SCORE_DISCLAIMER, petCaseLabels, petConfidenceLabels, petSizeLabels, type PetCandidate, type PetPhoto } from '../domain/pet'

const springEase = [0.32, 0.72, 0, 1] as const

export const actionLinkClass = 'focus-ring group inline-flex min-h-12 items-center justify-center gap-2 rounded-full px-5 py-3 text-sm font-semibold transition-[background-color,color,box-shadow,transform,opacity] duration-280 ease-spring active:scale-[0.98]'

export function PetShell({ children }: { children: ReactNode }) {
  return (
    <AppShell
      theme="mascota"
      brand="EncuentraMiMascota"
      subtitle="Cuidado local para perros"
      navigation={
        <>
          <NavLink className={navLinkClass} end to="/">
            <HeartHandshake aria-hidden="true" className="h-4 w-4" strokeWidth={1.6} />
            Inicio
          </NavLink>
          <NavLink className={navLinkClass} to="/cerca">
            <MapPinned aria-hidden="true" className="h-4 w-4" strokeWidth={1.6} />
            Cerca
          </NavLink>
          <NavLink className={navLinkClass} to="/reportar/perdida">
            <ShieldCheck aria-hidden="true" className="h-4 w-4" strokeWidth={1.6} />
            Reportar
          </NavLink>
        </>
      }
      actions={
        <Link className="focus-ring hidden min-h-11 items-center gap-2 rounded-full bg-primary px-4 py-2 text-sm font-semibold text-white transition-[background-color,transform] duration-280 ease-spring hover:-translate-y-0.5 hover:bg-primary/90 sm:inline-flex" to="/cerca">
          Ver avisos cercanos
          <span className="inline-flex h-7 w-7 items-center justify-center rounded-full bg-white/15" aria-hidden="true">
            <ArrowRight className="h-4 w-4" strokeWidth={1.6} />
          </span>
        </Link>
      }
    >
      <RouteFocus />
      {children}
    </AppShell>
  )
}

function navLinkClass({ isActive }: { isActive: boolean }): string {
  return `focus-ring inline-flex min-h-11 items-center gap-2 rounded-full px-3 py-2 transition-[background-color,color,transform] duration-280 ease-spring hover:-translate-y-0.5 ${isActive ? 'bg-primary/[0.1] text-primary' : 'text-muted hover:bg-primary/[0.06] hover:text-primary'}`
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

export function FlowSteps({ current }: { current: number }) {
  const steps = ['Perfil', 'Fotos', 'Revisión', 'Coincidencias', 'Siguiente paso']
  return (
    <ol className="flex w-full flex-wrap items-center gap-2 text-xs font-semibold text-muted" aria-label="Progreso de la búsqueda">
      {steps.map((step, index) => {
        const number = index + 1
        const active = number === current
        const complete = number < current
        return (
          <li className="flex min-h-9 items-center gap-2" key={step}>
            <span className={`inline-flex h-8 w-8 items-center justify-center rounded-full ring-1 ring-inset ${active ? 'bg-primary text-white ring-primary' : complete ? 'bg-primary/[0.1] text-primary ring-primary/20' : 'bg-surface text-muted ring-line/70'}`}>
              {complete ? <Check aria-hidden="true" className="h-4 w-4" strokeWidth={1.7} /> : number}
            </span>
            <span className={active ? 'text-primary' : undefined}>{step}</span>
            {index < steps.length - 1 ? <span aria-hidden="true" className="mx-1 h-px w-4 bg-line sm:w-8" /> : null}
          </li>
        )
      })}
    </ol>
  )
}

export function DemoNotice({ children, className = '' }: { children: ReactNode; className?: string }) {
  return <StatusBanner className={className} title="Demostración local" variant="info">{children}</StatusBanner>
}

export function SafetyBoundary({ children }: { children: ReactNode }) {
  return (
    <div className="rounded-[1.7rem] bg-[#17332d] p-5 text-[#eefaf4] sm:p-7">
      <div className="flex items-start gap-3">
        <ShieldCheck aria-hidden="true" className="mt-0.5 h-5 w-5 shrink-0 text-[#f1a27c]" strokeWidth={1.5} />
        <div>
          <p className="text-[0.68rem] font-semibold uppercase tracking-[0.18em] text-[#bfe3d3]">Límite de cuidado</p>
          <div className="mt-3 text-sm leading-6 text-[#d2e6dc]">{children}</div>
        </div>
      </div>
    </div>
  )
}

export function BackLink({ to, children = 'Volver' }: { to: string; children?: ReactNode }) {
  return <Link className={`${actionLinkClass} -ml-2 text-primary hover:bg-primary/[0.08]`} to={to}><ArrowLeft aria-hidden="true" className="h-4 w-4" strokeWidth={1.6} />{children}</Link>
}

export function RecoveryPanel({ title, description, children }: { title: string; description: string; children: ReactNode }) {
  return (
    <PetShell>
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
    </PetShell>
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
          <Badge variant="accent">Borrador local</Badge>
          <h2 className="mt-4 font-display text-2xl font-bold tracking-[-0.04em] text-ink" id="cancel-dialog-title">¿Querés salir de esta búsqueda?</h2>
          <p className="mt-3 text-sm leading-6 text-muted">Todavía hay datos en el borrador. Podés seguir editando o descartarlo; nada se publicó ni se compartió.</p>
          <div className="mt-7 flex flex-col-reverse gap-3 sm:flex-row sm:justify-end">
            <Button ref={keepButtonRef} variant="secondary" onClick={onKeepEditing}>Seguir editando</Button>
            <Button variant="danger" leadingIcon={<X aria-hidden="true" className="h-4 w-4" strokeWidth={1.6} />} onClick={onDiscard}>Descartar borrador</Button>
          </div>
        </div>
      </div>
    </div>
  )
}

export function PhotoPreview({ photo, className = '' }: { photo: PetPhoto; className?: string }) {
  return <img className={`h-full w-full object-cover ${className}`} src={photo.src} alt={photo.alt} loading="lazy" />
}

export function MatchScore({ candidate, compact = false }: { candidate: PetCandidate; compact?: boolean }) {
  return (
    <div className={compact ? 'space-y-2' : 'space-y-3'}>
      <div className="flex items-center justify-between gap-3">
        <span className="text-xs font-semibold uppercase tracking-[0.12em] text-muted">Estimación visual</span>
        <span className="text-lg font-bold text-primary">{Math.round(candidate.score * 100)}%</span>
      </div>
      <ConfidenceMeter value={candidate.score} label={petConfidenceLabels[candidate.confidence]} />
      <p className="text-xs leading-5 text-muted">{MATCH_SCORE_DISCLAIMER}</p>
    </div>
  )
}

export function CandidateMeta({ candidate }: { candidate: PetCandidate }) {
  return (
    <div className="flex flex-wrap gap-2 text-xs font-semibold text-muted">
      <span className="rounded-full bg-paper px-3 py-1.5">{candidate.approximateLocation.label}</span>
      <span className="rounded-full bg-paper px-3 py-1.5">A {candidate.distanceKm.toFixed(1)} km</span>
      <span className="rounded-full bg-paper px-3 py-1.5">{candidate.reportedAt}</span>
    </div>
  )
}

export function ProfileFacts({ candidate }: { candidate: PetCandidate }) {
  return (
    <dl className="grid gap-4 border-t border-line/70 pt-5 sm:grid-cols-3">
      <div><dt className="text-xs font-semibold uppercase tracking-[0.12em] text-muted">Tamaño</dt><dd className="mt-1 font-semibold text-ink">{petSizeLabels[candidate.size]}</dd></div>
      <div><dt className="text-xs font-semibold uppercase tracking-[0.12em] text-muted">Colores</dt><dd className="mt-1 font-semibold text-ink">{candidate.colors}</dd></div>
      <div><dt className="text-xs font-semibold uppercase tracking-[0.12em] text-muted">Tipo de aviso</dt><dd className="mt-1 font-semibold text-ink">{petCaseLabels[candidate.caseType]}</dd></div>
    </dl>
  )
}

export function StatusMark({ status }: { status: 'success' | 'warning' | 'error' }) {
  if (status === 'success') return <span className="inline-flex h-12 w-12 items-center justify-center rounded-full bg-success/[0.12] text-success"><Check aria-hidden="true" className="h-6 w-6" strokeWidth={1.6} /></span>
  if (status === 'error') return <span className="inline-flex h-12 w-12 items-center justify-center rounded-full bg-error/[0.1] text-error"><CircleAlert aria-hidden="true" className="h-6 w-6" strokeWidth={1.6} /></span>
  return <span className="inline-flex h-12 w-12 items-center justify-center rounded-full bg-warning/[0.12] text-warning"><CircleAlert aria-hidden="true" className="h-6 w-6" strokeWidth={1.6} /></span>
}
