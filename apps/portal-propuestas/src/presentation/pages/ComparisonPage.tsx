import { ArrowLeft, GitCompareArrows } from 'lucide-react'
import { Link } from 'react-router-dom'
import { EmptyState, StatusBanner } from '@propuestas/ui'
import type { Proposal, ProposalId } from '@propuestas/shared'
import { ComparisonTable } from '../components/ComparisonTable'

export function ComparisonPage({
  proposals,
  onRemove,
}: {
  proposals: readonly Proposal[]
  onRemove: (proposalId: ProposalId) => void
}) {
  return (
    <div className="space-y-10">
      <header className="reveal flex flex-col justify-between gap-6 md:flex-row md:items-end">
        <div>
          <Link className="focus-ring inline-flex min-h-10 items-center gap-2 rounded-full px-3 text-sm font-semibold text-muted hover:bg-primary/[0.08] hover:text-primary" to="/"><ArrowLeft aria-hidden="true" className="h-4 w-4" /> Volver al portal</Link>
          <p className="mt-8 text-xs font-semibold uppercase tracking-[0.18em] text-accent">Vista temporal</p>
          <h1 className="mt-3 font-display text-5xl font-bold tracking-[-0.06em] text-ink md:text-6xl">Comparar sin perder el contexto.</h1>
          <p className="mt-5 max-w-2xl text-lg leading-8 text-muted">Usá esta lectura para discutir decisiones de producto. La selección vive solo en esta sesión del navegador.</p>
        </div>
        <Link className="focus-ring inline-flex min-h-12 items-center justify-center rounded-full bg-primary px-5 py-3 text-sm font-semibold text-white shadow-quiet hover:bg-primary/90" to="/#propuestas">Agregar propuestas</Link>
      </header>
      <StatusBanner title="Comparación temporal" variant="info">
        Los puntajes son una lectura académica inicial, no una métrica de producto ni una promesa comercial. La columna IA futura describe espacio de exploración, no una capacidad implementada.
      </StatusBanner>
      {proposals.length > 0 ? <ComparisonTable proposals={proposals} onRemove={onRemove} /> : <EmptyState title="Todavía no hay propuestas para comparar" icon={<GitCompareArrows aria-hidden="true" className="h-5 w-5" />} action={<Link className="focus-ring inline-flex min-h-12 items-center justify-center rounded-full bg-primary px-5 py-3 text-sm font-semibold text-white shadow-quiet hover:bg-primary/90" to="/#propuestas">Ver propuestas</Link>}>
        Agregá una o más fichas desde el catálogo para construir una lectura comparativa temporal.
      </EmptyState>}
    </div>
  )
}
