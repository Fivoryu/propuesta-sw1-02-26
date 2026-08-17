import { Search, SearchX } from 'lucide-react'
import { useDeferredValue, useState } from 'react'
import { Link } from 'react-router-dom'
import { Badge, Button, EmptyState, Field, Input, StatusBanner } from '@propuestas/ui'
import type { Proposal, ProposalId } from '@propuestas/shared'
import { ProposalCard } from '../components/ProposalCard'
import { ComparisonStrip } from '../components/ComparisonStrip'

export function HomePage({
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
  const [query, setQuery] = useState('')
  const deferredQuery = useDeferredValue(query)
  const normalizedQuery = deferredQuery.trim().toLocaleLowerCase('es')
  const visibleProposals = proposals.filter((proposal) => {
    if (!normalizedQuery) return true
    return [proposal.name, proposal.category, proposal.summary].some((value) => value.toLocaleLowerCase('es').includes(normalizedQuery))
  })

  return (
    <div className="space-y-24">
      <section className="reveal grid items-center gap-12 pb-4 pt-10 md:grid-cols-[1.05fr_0.95fr] md:gap-16 md:pt-16" aria-labelledby="portal-title">
        <div>
          <span className="eyebrow">Ingeniería de Software I · Fase 2</span>
          <h1 id="portal-title" className="mt-6 max-w-3xl font-display text-5xl font-bold leading-[1.02] tracking-[-0.06em] text-ink sm:text-6xl md:text-7xl">
            Propuestas que se pueden <span className="text-primary">recorrer, comparar y discutir.</span>
          </h1>
          <p className="mt-7 max-w-xl text-lg leading-8 text-muted">
            Una superficie académica para revisar ideas de producto con evidencia, límites claros y un prototipo local por explorar.
          </p>
          <div className="mt-8 flex flex-wrap items-center gap-3">
            <a className="focus-ring group inline-flex min-h-14 items-center gap-3 rounded-full bg-primary px-6 py-3.5 text-base font-semibold text-white shadow-quiet transition-[background-color,transform] duration-280 ease-spring hover:-translate-y-0.5 hover:bg-primary/90 active:scale-[0.98]" href="#propuestas">
              Ver propuestas
              <span className="inline-flex h-8 w-8 items-center justify-center rounded-full bg-white/15 transition-transform duration-280 ease-spring group-hover:translate-x-1"><Search aria-hidden="true" className="h-4 w-4" /></span>
            </a>
            <Link className="focus-ring inline-flex min-h-14 items-center rounded-full px-5 py-3.5 text-base font-semibold text-primary transition-[background-color,transform] duration-280 ease-spring hover:-translate-y-0.5 hover:bg-primary/[0.08]" to="/comparar">
              Comparar ahora
            </Link>
          </div>
          <div className="mt-10 flex flex-wrap gap-x-6 gap-y-3 text-sm font-semibold text-muted">
            <span><strong className="font-display text-2xl text-ink">{String(proposals.length).padStart(2, '0')}</strong> productos</span>
            <span><strong className="font-display text-2xl text-ink">06</strong> criterios</span>
            <span><strong className="font-display text-2xl text-ink">01</strong> portal</span>
          </div>
        </div>
        <div className="reveal [animation-delay:180ms]">
          <div className="bezel rotate-1">
            <div className="bezel-core relative min-h-[25rem] overflow-hidden p-6 sm:p-8">
              <div className="absolute -right-20 -top-24 h-64 w-64 rounded-full bg-accent/[0.12]" aria-hidden="true" />
              <div className="relative flex h-full min-h-[22rem] flex-col justify-between">
                <div className="flex items-center justify-between gap-4">
                  <Badge variant="accent">Mapa de revisión</Badge>
                  <span className="text-xs font-bold uppercase tracking-[0.18em] text-muted">Local / 2026</span>
                </div>
                <div className="relative py-10">
                  <div className="absolute left-3 top-1/2 h-px w-[86%] -translate-y-1/2 bg-line" aria-hidden="true" />
                  <div className="relative flex items-center justify-between">
                    {['Problema', 'Propuesta', 'Evidencia'].map((label, index) => (
                      <div key={label} className="flex flex-col items-center gap-3 text-center">
                        <span className={`flex h-14 w-14 items-center justify-center rounded-full font-display text-lg font-bold ring-8 ring-paper ${index === 1 ? 'bg-primary text-white' : 'bg-accent text-ink'}`}>{String(index + 1).padStart(2, '0')}</span>
                        <span className="text-xs font-semibold text-ink">{label}</span>
                      </div>
                    ))}
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-3">
                  <div className="rounded-lg bg-primary p-4 text-white">
                    <p className="text-xs font-semibold uppercase tracking-[0.12em] text-white/70">Pregunta</p>
                    <p className="mt-2 text-sm font-semibold leading-5">¿Qué cambia para la persona?</p>
                  </div>
                  <div className="rounded-lg bg-accent/20 p-4 text-ink">
                    <p className="text-xs font-semibold uppercase tracking-[0.12em] text-primary">Regla</p>
                    <p className="mt-2 text-sm font-semibold leading-5">La demostración no es producción.</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <StatusBanner title="Frontera de prototipo" variant="info">
        Esta demostración usa datos simulados; no es una predicción real. No hay backend, autenticación, pagos ni contacto con instituciones o personas.
      </StatusBanner>

      <section id="propuestas" className="scroll-mt-8 space-y-8" aria-labelledby="proposals-title">
        <div className="flex flex-col justify-between gap-6 lg:flex-row lg:items-end">
          <div>
            <span className="eyebrow">Catálogo local</span>
            <h2 id="proposals-title" className="mt-4 font-display text-4xl font-bold tracking-[-0.04em] text-ink md:text-5xl">{proposals.length > 0 ? 'Propuestas para mirar de cerca.' : 'El catálogo se está armando.'}</h2>
            <p className="mt-3 max-w-2xl text-base leading-7 text-muted">{proposals.length > 0 ? 'Cada ficha reúne el problema, la promesa de calidad, el recorrido principal y los límites que todavía deben validarse.' : 'Los prototipos se crean desde las propuestas documentadas en docs/propuestas/. Cuando un prototipo nuevo se registre, su ficha aparece acá.'}</p>
          </div>
              {proposals.length > 0 && (
                <div className="w-full max-w-md">
                  <Field label="Buscar una propuesta" htmlFor="proposal-search" hint="Prueba con el nombre, la categoría o una palabra del resumen.">
                    <div className="relative">
                      <Search aria-hidden="true" className="pointer-events-none absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-muted" />
                      <Input id="proposal-search" aria-describedby="proposal-search-message" value={query} onChange={(event) => setQuery(event.target.value)} placeholder="Ej.: aprendizaje" className="pl-12" type="search" />
                    </div>
                  </Field>
                </div>
              )}
            </div>
            {visibleProposals.length > 0 ? (
              <div className="grid gap-6 lg:grid-cols-3">
                {visibleProposals.map((proposal, index) => (
                  <div key={proposal.id} className="reveal" style={{ animationDelay: `${index * 90}ms` }}>
                    <ProposalCard proposal={proposal} onCompare={onCompare} isCompared={comparedIds.includes(proposal.id)} appUrl={resolveAppUrl(proposal)} />
                  </div>
                ))}
              </div>
            ) : proposals.length === 0 ? (
              <EmptyState title="Aún no hay prototipos registrados" icon={<SearchX aria-hidden="true" className="h-5 w-5" />}>
                El catálogo se llena cuando un prototipo nuevo se crea desde las propuestas documentadas en docs/propuestas/ y se registra en el portal.
              </EmptyState>
            ) : (
              <EmptyState title="No encontramos propuestas" icon={<SearchX aria-hidden="true" className="h-5 w-5" />} action={<Button variant="secondary" onClick={() => setQuery('')}>Limpiar filtros</Button>}>
                Cambiá el término de búsqueda o limpiá el filtro para volver a ver el catálogo local.
              </EmptyState>
            )}
      </section>

      {proposals.length > 0 && <ComparisonStrip proposals={proposals} />}
    </div>
  )
}
