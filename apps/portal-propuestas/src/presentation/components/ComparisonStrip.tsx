import { ArrowRight, Sparkles } from 'lucide-react'
import { Link } from 'react-router-dom'
import { Badge, Card } from '@propuestas/ui'
import type { Proposal } from '@propuestas/shared'

export function ComparisonStrip({ proposals }: { proposals: readonly Proposal[] }) {
  return (
    <section className="reveal space-y-6 [animation-delay:420ms]" aria-labelledby="comparison-strip-title">
      <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-end">
        <div>
          <span className="eyebrow">Lectura comparativa</span>
          <h2 id="comparison-strip-title" className="mt-4 max-w-xl font-display text-3xl font-bold tracking-[-0.03em] text-ink md:text-4xl">
            Tres caminos, una misma disciplina de producto.
          </h2>
        </div>
        <Link className="focus-ring inline-flex min-h-11 items-center gap-2 rounded-full px-4 py-3 text-sm font-semibold text-primary hover:bg-primary/[0.08]" to="/comparar">
          Abrir comparación completa <ArrowRight aria-hidden="true" className="h-4 w-4" />
        </Link>
      </div>
      <div className="grid gap-3 md:grid-cols-3">
        {proposals.map((proposal) => (
          <Card key={proposal.id} className="p-5" bezel>
            <div className="flex items-start justify-between gap-3">
              <div>
                <p className="text-sm font-bold text-ink">{proposal.name}</p>
                <p className="mt-1 text-xs leading-5 text-muted">{proposal.criteria.productividad.note}</p>
              </div>
              <Sparkles aria-hidden="true" className="h-5 w-5 shrink-0 text-accent" />
            </div>
            <div className="mt-5 flex items-end justify-between gap-4">
              <div>
                <p className="text-xs font-semibold uppercase tracking-[0.14em] text-muted">Calidad</p>
                <p className="mt-1 font-display text-3xl font-bold text-primary">{proposal.criteria.calidad.score}<span className="text-sm font-medium text-muted">/5</span></p>
              </div>
              <Badge variant="accent">{proposal.criteria.iaFutura.score}/5 IA futura</Badge>
            </div>
          </Card>
        ))}
      </div>
    </section>
  )
}
