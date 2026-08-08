import type { Proposal, ProposalCriterionKey, ProposalId } from '@propuestas/shared'

export const comparisonCriteria: ReadonlyArray<{ key: ProposalCriterionKey; label: string }> = [
  { key: 'calidad', label: 'Calidad' },
  { key: 'productividad', label: 'Productividad' },
  { key: 'innovacion', label: 'Innovación' },
  { key: 'monetizacion', label: 'Monetización' },
  { key: 'dificultadTecnica', label: 'Dificultad técnica' },
  { key: 'iaFutura', label: 'IA futura' },
]

export function proposalsFromIds(ids: readonly ProposalId[], catalog: readonly Proposal[]): Proposal[] {
  return ids.flatMap((id) => {
    const proposal = catalog.find((item) => item.id === id)
    return proposal ? [proposal] : []
  })
}
