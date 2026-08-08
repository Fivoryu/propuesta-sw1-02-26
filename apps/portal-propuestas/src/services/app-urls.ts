import type { Proposal } from '@propuestas/shared'

export function resolveProposalAppUrl(proposal: Proposal): string {
  const configuredUrl = import.meta.env[proposal.appUrlEnvVar] as string | undefined
  return configuredUrl?.trim() || '/'
}
