import { ArrowUpRight, GitCompareArrows } from 'lucide-react'
import { Link } from 'react-router-dom'
import { Badge, Button, Card, CardBody, CardHeader, CardTitle } from '@propuestas/ui'
import type { Proposal } from '@propuestas/shared'

const accentClasses: Record<Proposal['accent'], string> = {
  teal: 'bg-[#0E7C66]/10 text-[#0E7C66]',
  cobalt: 'bg-[#2457D6]/10 text-[#2457D6]',
  violet: 'bg-[#7257D9]/10 text-[#7257D9]',
}

export function ProposalCard({
  proposal,
  onCompare,
  isCompared,
  appUrl,
}: {
  proposal: Proposal
  onCompare: (proposalId: Proposal['id']) => void
  isCompared: boolean
  appUrl: string
}) {
  return (
    <Card bezel interactive className="h-full">
      <div className="flex h-full flex-col rounded-xl bg-surface p-1 ring-1 ring-inset ring-line/50">
        <CardHeader className="flex-1 pb-4">
          <div className="flex items-start justify-between gap-4">
            <Badge className={accentClasses[proposal.accent]}>{proposal.category}</Badge>
            <span className="text-xs font-semibold uppercase tracking-[0.14em] text-muted">{proposal.shortName}</span>
          </div>
          <p className="pt-5 text-xs font-semibold uppercase tracking-[0.16em] text-accent">{proposal.eyebrow}</p>
          <CardTitle className="pt-1 text-2xl">{proposal.name}</CardTitle>
          <p className="max-w-prose pt-2 text-sm leading-6 text-muted">{proposal.summary}</p>
        </CardHeader>
        <CardBody className="flex flex-col gap-5">
          <div className="grid grid-cols-3 gap-2 border-y border-line/60 py-4 text-center">
            <Score label="Calidad" score={proposal.criteria.calidad.score} />
            <Score label="Innovación" score={proposal.criteria.innovacion.score} />
            <Score label="IA futura" score={proposal.criteria.iaFutura.score} />
          </div>
          <div className="flex flex-col gap-2 sm:flex-row sm:flex-wrap">
            <Link
              className="focus-ring inline-flex min-h-11 flex-1 items-center justify-center gap-2 rounded-full bg-primary px-4 py-3 text-sm font-semibold text-white shadow-quiet transition-[background-color,transform] duration-280 ease-spring hover:-translate-y-0.5 hover:bg-primary/90 active:scale-[0.98]"
              to={`/propuestas/${proposal.id}`}
            >
              Ver ficha
              <ArrowUpRight aria-hidden="true" className="h-4 w-4" />
            </Link>
            <a
              className="focus-ring inline-flex min-h-11 flex-1 items-center justify-center rounded-full px-4 py-3 text-sm font-semibold text-primary transition-[background-color,transform] duration-280 ease-spring hover:-translate-y-0.5 hover:bg-primary/[0.08] active:scale-[0.98]"
              href={appUrl}
            >
              Abrir prototipo
            </a>
          </div>
          <Button
            className="w-full"
            size="sm"
            variant={isCompared ? 'secondary' : 'ghost'}
            leadingIcon={<GitCompareArrows aria-hidden="true" className="h-4 w-4" />}
            onClick={() => onCompare(proposal.id)}
          >
            {isCompared ? 'Ya está en comparación' : 'Agregar a comparación'}
          </Button>
        </CardBody>
      </div>
    </Card>
  )
}

function Score({ label, score }: { label: string; score: number }) {
  return (
    <div className="space-y-1">
      <p className="text-[0.68rem] font-semibold uppercase tracking-[0.08em] text-muted">{label}</p>
      <p className="font-display text-lg font-bold text-ink">{score}<span className="text-xs font-medium text-muted">/5</span></p>
    </div>
  )
}
