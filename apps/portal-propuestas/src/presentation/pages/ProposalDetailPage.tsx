import { ArrowLeft, ArrowUpRight, Check, GitCompareArrows, Lightbulb, Route, ShieldAlert } from 'lucide-react'
import type { ReactNode } from 'react'
import { Link, useParams } from 'react-router-dom'
import { Badge, Button, Card, CardBody, CardHeader, CardTitle, StatusBanner } from '@propuestas/ui'
import type { Proposal, ProposalId } from '@propuestas/shared'
import { NotFoundPage } from './NotFoundPage'

export function ProposalDetailPage({
  proposals,
  comparedIds,
  onCompare,
  resolveAppUrl,
}: {
  proposals: readonly Proposal[]
  comparedIds: readonly ProposalId[]
  onCompare: (proposalId: ProposalId) => void
  resolveAppUrl: (proposal: Proposal) => string
}) {
  const { proposalId } = useParams()
  const proposal = proposals.find((item) => item.id === proposalId)

  if (!proposal) return <NotFoundPage />

  const isCompared = comparedIds.includes(proposal.id)

  return (
    <div className="space-y-12">
      <nav className="reveal flex flex-wrap items-center gap-2 text-sm font-semibold text-muted" aria-label="Migas de pan">
        <Link className="focus-ring inline-flex min-h-10 items-center gap-2 rounded-full px-3 hover:bg-primary/[0.08] hover:text-primary" to="/"><ArrowLeft aria-hidden="true" className="h-4 w-4" /> Portal</Link>
        <span aria-hidden="true">/</span>
        <span className="text-ink">{proposal.name}</span>
      </nav>

      <header className="reveal grid gap-8 md:grid-cols-[1fr_auto] md:items-end">
        <div>
          <Badge variant="accent">{proposal.category}</Badge>
          <p className="mt-6 text-xs font-semibold uppercase tracking-[0.18em] text-accent">{proposal.eyebrow}</p>
          <h1 className="mt-3 max-w-4xl font-display text-5xl font-bold leading-[1.04] tracking-[-0.06em] text-ink md:text-7xl">{proposal.name}</h1>
          <p className="mt-6 max-w-2xl text-lg leading-8 text-muted">{proposal.summary}</p>
        </div>
        <div className="flex flex-wrap gap-3 md:justify-end">
          <a className="focus-ring group inline-flex min-h-14 items-center gap-3 rounded-full bg-primary px-6 py-3.5 text-base font-semibold text-white shadow-quiet transition-[background-color,transform] duration-280 ease-spring hover:-translate-y-0.5 hover:bg-primary/90 active:scale-[0.98]" href={resolveAppUrl(proposal)}>
            Abrir prototipo
            <span className="inline-flex h-8 w-8 items-center justify-center rounded-full bg-white/15 transition-transform duration-280 ease-spring group-hover:translate-x-1"><ArrowUpRight aria-hidden="true" className="h-4 w-4" /></span>
          </a>
          <Link className="focus-ring inline-flex min-h-14 items-center justify-center rounded-full px-5 py-3.5 text-base font-semibold text-primary hover:bg-primary/[0.08]" to="/">Volver al portal</Link>
          <Button aria-pressed={isCompared} variant="secondary" leadingIcon={<GitCompareArrows aria-hidden="true" className="h-4 w-4" />} onClick={() => onCompare(proposal.id)}>
            Agregar a comparación
          </Button>
        </div>
      </header>

      <StatusBanner title="Límite visible de esta ficha" variant="info">
        La propuesta está documentada para una presentación local. Sus resultados, métricas, precios y capacidades futuras todavía son hipótesis que requieren validación.
      </StatusBanner>

      <section className="grid gap-6 md:grid-cols-2" aria-label="Resumen de la propuesta">
        <DetailCard title="El problema" icon={<Lightbulb aria-hidden="true" className="h-5 w-5" />}>
          <p>{proposal.problem}</p>
        </DetailCard>
        <DetailCard title="A quién beneficia" icon={<Check aria-hidden="true" className="h-5 w-5" />}>
          <ul className="space-y-3">{proposal.beneficiaries.map((item) => <li key={item} className="flex gap-3"><Check aria-hidden="true" className="mt-0.5 h-4 w-4 shrink-0 text-accent" />{item}</li>)}</ul>
        </DetailCard>
        <DetailCard title="Calidad y productividad" icon={<Route aria-hidden="true" className="h-5 w-5" />}>
          <div className="space-y-5"><p><strong>Calidad:</strong> {proposal.quality}</p><p><strong>Productividad:</strong> {proposal.productivity}</p></div>
        </DetailCard>
        <DetailCard title="Innovación" icon={<Lightbulb aria-hidden="true" className="h-5 w-5" />}>
          <p>{proposal.innovation}</p>
        </DetailCard>
      </section>

      <section className="grid gap-6 lg:grid-cols-[1.15fr_0.85fr]" aria-label="Recorrido y viabilidad">
        <Card bezel>
          <CardHeader><p className="eyebrow w-fit">Recorrido principal</p><CardTitle className="pt-2 text-2xl">Del contexto a una decisión revisable.</CardTitle></CardHeader>
          <CardBody><ol className="space-y-4">{proposal.flow.map((step, index) => <li key={step} className="flex gap-4"><span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-primary text-sm font-bold text-white">{index + 1}</span><span className="pt-1 text-sm leading-6 text-muted">{step}</span></li>)}</ol></CardBody>
        </Card>
        <Card bezel>
          <CardHeader><p className="eyebrow w-fit">Tecnología base</p><CardTitle className="pt-2 text-2xl">Pequeña por ahora, extensible después.</CardTitle></CardHeader>
          <CardBody><ul className="space-y-3">{proposal.technologies.map((technology) => <li key={technology} className="flex gap-3 text-sm leading-6 text-muted"><span className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-accent" />{technology}</li>)}</ul></CardBody>
        </Card>
      </section>

      <section className="grid gap-6 md:grid-cols-2" aria-label="Monetización y límites">
        <Card className="p-6" bezel><div className="flex gap-4"><Badge variant="accent">Monetización</Badge><p className="text-sm leading-6 text-muted">{proposal.monetization}</p></div></Card>
        <Card className="p-6" bezel><div className="flex gap-4"><ShieldAlert aria-hidden="true" className="mt-0.5 h-5 w-5 shrink-0 text-warning" /><div><h2 className="font-display text-lg font-bold text-ink">Límites y siguiente hipótesis</h2><p className="mt-2 text-sm leading-6 text-muted">{proposal.prototypeLimits}</p><p className="mt-4 border-t border-line/60 pt-4 text-sm leading-6 text-muted"><strong>Más adelante:</strong> {proposal.futureDirection}</p></div></div></Card>
      </section>
    </div>
  )
}

function DetailCard({ title, icon, children }: { title: string; icon: ReactNode; children: ReactNode }) {
  return <Card bezel><CardHeader><div className="flex items-center gap-3 text-primary"><span className="inline-flex h-10 w-10 items-center justify-center rounded-full bg-primary/[0.08]">{icon}</span><CardTitle className="text-xl">{title}</CardTitle></div></CardHeader><CardBody><div className="text-sm leading-7 text-muted">{children}</div></CardBody></Card>
}
