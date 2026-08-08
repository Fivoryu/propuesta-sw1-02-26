import katex from 'katex'
import { motion, useReducedMotion } from 'motion/react'
import { useEffect, useRef, type ReactNode } from 'react'
import { Link, NavLink, useLocation } from 'react-router-dom'
import {
  AlertCircle,
  CheckCircle2,
  CircleAlert,
  Copy,
  Download,
  ArrowUpRight,
  FileQuestion,
  Info,
  NotebookPen,
  TriangleAlert,
  X,
} from 'lucide-react'
import { AppShell, Badge, Button, Card, CardBody, CardHeader, CardTitle, ConfidenceMeter, StatusBanner, useToast } from '@propuestas/ui'
import type { EquationRecognitionResult, EquationScenarioId } from '../domain/equation'
import { getConfidenceLabel, getEquationScenarioLabel } from '../domain/equation'
import type { NotebookColor } from '../domain/notebook'

const springEase = [0.32, 0.72, 0, 1] as const

export const actionLinkClass = 'focus-ring group inline-flex min-h-12 items-center justify-center gap-2 rounded-full px-5 py-3 text-sm font-semibold transition-[background-color,color,box-shadow,transform,opacity] duration-280 ease-spring active:scale-[0.98]'

export function NotebookShell({ children }: { children: ReactNode }) {
  return (
    <AppShell
      theme="cuaderno"
      brand="Cuaderno Matemático"
      subtitle="Estudio local"
      className="cuaderno-root"
      navigation={
        <>
          <NavLink className={navLinkClass} end to="/">
            <NotebookPen aria-hidden="true" className="h-4 w-4" />
            Cuadernos
          </NavLink>
          <NavLink className={navLinkClass} to="/ecuacion">
            <CircleAlert aria-hidden="true" className="h-4 w-4" />
            Reconocer
          </NavLink>
          <NavLink className={navLinkClass} to="/exportar">
            <Download aria-hidden="true" className="h-4 w-4" />
            Exportar
          </NavLink>
        </>
      }
      actions={
        <Link className="focus-ring hidden min-h-11 items-center gap-2 rounded-full bg-primary px-4 py-2 text-sm font-semibold text-white transition-[background-color,transform] duration-280 ease-spring hover:-translate-y-0.5 hover:bg-primary/90 sm:inline-flex" to="/cuadernos/nuevo">
          Nuevo cuaderno
          <span className="inline-flex h-7 w-7 items-center justify-center rounded-full bg-white/15" aria-hidden="true">
            <NotebookPen className="h-4 w-4" />
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

export function LocalBoundary({ children, title = 'Demostración local' }: { children: ReactNode; title?: string }) {
  return <StatusBanner title={title} variant="info">{children}</StatusBanner>
}

export function StatusPill({ status }: { status: EquationRecognitionResult['status'] }) {
  const content = {
    success: { label: 'Propuesta lista para revisar', icon: <CheckCircle2 aria-hidden="true" className="h-4 w-4" />, className: 'bg-success/[0.1] text-success ring-success/20' },
    low_confidence: { label: 'Revisión necesaria', icon: <TriangleAlert aria-hidden="true" className="h-4 w-4" />, className: 'bg-warning/[0.1] text-warning ring-warning/20' },
    duplicate: { label: 'Coincidencia local', icon: <Copy aria-hidden="true" className="h-4 w-4" />, className: 'bg-violet-100 text-[#5D42B8] ring-[#7257D9]/20' },
    no_match: { label: 'Sin coincidencia', icon: <FileQuestion aria-hidden="true" className="h-4 w-4" />, className: 'bg-info/[0.1] text-info ring-info/20' },
    error: { label: 'Servicio simulado detenido', icon: <AlertCircle aria-hidden="true" className="h-4 w-4" />, className: 'bg-error/[0.1] text-error ring-error/20' },
  }[status]
  return <span className={`inline-flex min-h-8 items-center gap-2 rounded-full px-3 py-1 text-xs font-semibold ring-1 ring-inset ${content.className}`}>{content.icon}{content.label}</span>
}

export function MathFormula({ tex, label, compact = false }: { tex: string; label?: string; compact?: boolean }) {
  const containerRef = useRef<HTMLSpanElement>(null)

  useEffect(() => {
    const container = containerRef.current
    if (!container) return
    container.replaceChildren()
    if (!tex) return
    try {
      katex.render(tex, container, { displayMode: !compact, throwOnError: false, trust: false })
    } catch {
      container.textContent = tex
    }
  }, [compact, tex])

  return <span ref={containerRef} className={compact ? 'formula formula-compact' : 'formula'} aria-label={label ?? tex} />
}

export function ConfidenceSummary({ confidence }: { confidence: number }) {
  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between gap-4">
        <span className="text-sm font-semibold text-ink">{getConfidenceLabel(confidence)}</span>
        <span className="font-mono text-sm font-semibold text-primary">{Math.round(confidence * 100)}%</span>
      </div>
      <ConfidenceMeter value={confidence} label="Confianza simulada" />
    </div>
  )
}

export function ConfirmDialog({
  open,
  title,
  description,
  confirmLabel,
  onCancel,
  onConfirm,
}: {
  open: boolean
  title: string
  description: string
  confirmLabel: string
  onCancel: () => void
  onConfirm: () => void
}) {
  const cancelRef = useRef<HTMLButtonElement>(null)

  useEffect(() => {
    if (!open) return
    cancelRef.current?.focus()
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') onCancel()
    }
    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [onCancel, open])

  if (!open) return null
  return (
    <div className="fixed inset-0 z-40 flex items-end justify-center bg-[#17213B]/45 p-4 sm:items-center" role="presentation">
      <div className="bezel w-full max-w-lg" role="dialog" aria-modal="true" aria-labelledby="cancel-dialog-title">
        <div className="bezel-core p-6 sm:p-8">
          <span className="eyebrow">Borrador local</span>
          <h2 id="cancel-dialog-title" className="mt-4 font-display text-2xl font-bold tracking-[-0.04em] text-ink">{title}</h2>
          <p className="mt-3 text-sm leading-6 text-muted">{description}</p>
          <div className="mt-7 flex flex-col-reverse gap-3 sm:flex-row sm:justify-end">
            <Button ref={cancelRef} variant="secondary" onClick={onCancel}>Seguir editando</Button>
            <Button variant="danger" leadingIcon={<X aria-hidden="true" className="h-4 w-4" />} onClick={onConfirm}>{confirmLabel}</Button>
          </div>
        </div>
      </div>
    </div>
  )
}

export function ColorSwatch({ color, selected = false }: { color: NotebookColor; selected?: boolean }) {
  const classes = {
    cobalt: 'bg-[#2457D6]',
    violet: 'bg-[#7257D9]',
    sun: 'bg-[#F4C95D]',
    navy: 'bg-[#17213B]',
  }[color]
  return <span className={`inline-flex h-9 w-9 items-center justify-center rounded-full ${classes} ${selected ? 'ring-2 ring-primary ring-offset-2 ring-offset-surface' : ''}`} aria-hidden="true"><span className="h-2 w-2 rounded-full bg-white/80" /></span>
}

export function NotebookMetric({ label, value }: { label: string; value: string }) {
  return <div className="metric-chip"><span className="font-mono text-xl font-semibold tracking-[-0.04em] text-ink">{value}</span><span className="text-xs font-semibold uppercase tracking-[0.14em] text-muted">{label}</span></div>
}

export function SmallHint({ icon = <Info aria-hidden="true" className="h-4 w-4" />, children }: { icon?: ReactNode; children: ReactNode }) {
  return <p className="flex items-start gap-2 text-sm leading-6 text-muted"><span className="mt-0.5 shrink-0 text-primary">{icon}</span><span>{children}</span></p>
}

export function CopyLatexButton({ tex }: { tex: string }) {
  const { show } = useToast()
  return (
    <Button
      variant="secondary"
      size="sm"
      leadingIcon={<Copy aria-hidden="true" className="h-4 w-4" />}
      onClick={async () => {
        let copied = false
        try {
          if (navigator.clipboard?.writeText) {
            await navigator.clipboard.writeText(tex)
            copied = true
          }
        } catch {
          copied = false
        }
        if (!copied) {
          try {
            const fallback = document.createElement('textarea')
            fallback.value = tex
            fallback.style.position = 'fixed'
            fallback.style.opacity = '0'
            document.body.appendChild(fallback)
            fallback.select()
            copied = document.execCommand('copy')
            fallback.remove()
          } catch {
            copied = false
          }
        }
        show({ title: copied ? 'LaTeX copiado' : 'No pudimos copiar el código', message: copied ? 'La expresión quedó disponible en el portapapeles local.' : 'Podés seleccionar el código y copiarlo manualmente.', variant: copied ? 'success' : 'info' })
      }}
    >
      Copiar LaTeX
    </Button>
  )
}

export function EquationCode({ tex }: { tex: string }) {
  return <code className="equation-code block overflow-x-auto rounded-xl bg-[#17213B] px-4 py-3 text-sm leading-6 text-[#F5F7FF]">{tex || 'Sin expresión disponible'}</code>
}

export function EmptyNotebookIcon() {
  return <span className="inline-flex h-14 w-14 items-center justify-center rounded-2xl bg-primary/[0.09] text-primary"><NotebookPen aria-hidden="true" className="h-6 w-6" /></span>
}

export function ReviewHeader({ scenarioId }: { scenarioId: EquationScenarioId }) {
  return <div className="flex flex-wrap items-center gap-3"><Badge variant="primary">Reconocimiento simulado</Badge><span className="text-xs font-semibold uppercase tracking-[0.14em] text-muted">{getEquationScenarioLabel(scenarioId)}</span></div>
}

export function NotFoundPanel({ title = 'No encontramos esta vista', description = 'La ruta no corresponde a un espacio local disponible.' }: { title?: string; description?: string }) {
  return (
    <NotebookShell>
      <MotionReveal>
        <div className="mx-auto max-w-2xl py-16 md:py-24">
          <Card bezel>
            <CardHeader><Badge variant="accent">Ruta recuperable</Badge><CardTitle className="pt-3 text-3xl">{title}</CardTitle></CardHeader>
            <CardBody><p className="text-base leading-7 text-muted">{description}</p><Link className={`${actionLinkClass} mt-7 bg-primary text-white hover:bg-primary/90`} to="/">Volver a mis cuadernos<ArrowUpRightIcon /></Link></CardBody>
          </Card>
        </div>
      </MotionReveal>
    </NotebookShell>
  )
}

function ArrowUpRightIcon() {
  return <span className="inline-flex h-7 w-7 items-center justify-center rounded-full bg-white/15"><ArrowUpRight aria-hidden="true" className="h-4 w-4" /></span>
}
