import { ArrowUpRight, X } from 'lucide-react'
import { Link } from 'react-router-dom'
import { Badge, Card, IconButton } from '@propuestas/ui'
import type { Proposal } from '@propuestas/shared'
import { comparisonCriteria } from '../../domain/comparison'

export function ComparisonTable({ proposals, onRemove }: { proposals: readonly Proposal[]; onRemove: (id: Proposal['id']) => void }) {
  if (proposals.length === 0) return null

  return (
    <>
      <div className="hidden overflow-hidden rounded-xl bg-surface ring-1 ring-inset ring-line/70 md:block">
        <table className="w-full border-collapse text-left">
          <caption className="sr-only">Comparación temporal de propuestas</caption>
          <thead>
            <tr className="border-b border-line/70 bg-primary/[0.045]">
              <th className="w-44 px-5 py-5 text-xs font-bold uppercase tracking-[0.14em] text-muted" scope="col">Criterio</th>
              {proposals.map((proposal) => <ProposalHeader key={proposal.id} proposal={proposal} onRemove={onRemove} />)}
            </tr>
          </thead>
          <tbody>
            {comparisonCriteria.map(({ key, label }) => (
              <tr key={key} className="border-b border-line/60 last:border-b-0">
                <th className="px-5 py-5 text-sm font-semibold text-ink" scope="row">{label}</th>
                {proposals.map((proposal) => (
                  <td key={proposal.id} className="px-5 py-5 align-top">
                    <p className="font-display text-2xl font-bold text-primary">{proposal.criteria[key].score}<span className="text-sm font-medium text-muted">/5</span></p>
                    <p className="mt-1 max-w-xs text-xs leading-5 text-muted">{proposal.criteria[key].note}</p>
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <div className="grid gap-4 md:hidden">
        {proposals.map((proposal) => (
          <Card key={proposal.id} className="p-5" bezel>
            <div className="flex items-start justify-between gap-3">
              <div>
                <Badge variant="primary">{proposal.category}</Badge>
                <h3 className="mt-3 font-display text-xl font-bold text-ink">{proposal.name}</h3>
              </div>
              <IconButton label={`Quitar ${proposal.name} de la comparación`} icon={<X aria-hidden="true" className="h-5 w-5" />} onClick={() => onRemove(proposal.id)} />
            </div>
            <dl className="mt-5 divide-y divide-line/60">
              {comparisonCriteria.map(({ key, label }) => (
                <div key={key} className="flex items-start justify-between gap-4 py-3 first:pt-0 last:pb-0">
                  <dt className="text-sm font-semibold text-ink">{label}</dt>
                  <dd className="text-right"><span className="font-display text-xl font-bold text-primary">{proposal.criteria[key].score}/5</span><span className="block max-w-44 text-xs leading-5 text-muted">{proposal.criteria[key].note}</span></dd>
                </div>
              ))}
            </dl>
          </Card>
        ))}
      </div>
    </>
  )
}

function ProposalHeader({ proposal, onRemove }: { proposal: Proposal; onRemove: (id: Proposal['id']) => void }) {
  return (
    <th className="px-5 py-5 align-top" scope="col">
      <div className="flex items-start justify-between gap-3">
        <div>
          <p className="font-display text-lg font-bold text-ink">{proposal.name}</p>
          <Link className="focus-ring mt-2 inline-flex min-h-10 items-center gap-1 rounded-full text-xs font-semibold text-primary hover:text-accent" to={`/propuestas/${proposal.id}`}>
            Ver ficha <ArrowUpRight aria-hidden="true" className="h-3.5 w-3.5" />
          </Link>
        </div>
        <IconButton label={`Quitar ${proposal.name} de la comparación`} size="sm" icon={<X aria-hidden="true" className="h-4 w-4" />} onClick={() => onRemove(proposal.id)} />
      </div>
    </th>
  )
}
