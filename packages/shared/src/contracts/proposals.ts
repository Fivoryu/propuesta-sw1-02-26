// Proposal ids are registered in this union as prototypes are created from the
// proposal documents in `docs/propuestas/`. The catalog starts empty; when a new
// prototype is scaffolded, add its kebab-case id here (for example `lectovoz`).
export type ProposalId = never

export type ProposalCriterionKey =
  | 'calidad'
  | 'productividad'
  | 'innovacion'
  | 'monetizacion'
  | 'dificultadTecnica'
  | 'iaFutura'

export type ProposalCriterion = {
  score: number
  note: string
}

export type Proposal = {
  id: ProposalId
  name: string
  shortName: string
  category: string
  eyebrow: string
  summary: string
  problem: string
  beneficiaries: string[]
  primaryFunction: string
  quality: string
  productivity: string
  innovation: string
  monetization: string
  prototypeLimits: string
  futureDirection: string
  technologies: string[]
  flow: string[]
  criteria: Record<ProposalCriterionKey, ProposalCriterion>
  accent: 'teal' | 'cobalt' | 'violet' | 'amber' | 'rose'
  appUrlEnvVar: string
}
