import type { Proposal, ProposalId } from '@propuestas/shared'

// Default local dev ports per registered prototype. Each new prototype fixes
// its port in its own package.json `dev` script; register it here and keep it in
// sync with the root README development-server table. New prototypes start at
// port 5174 (5173 is the portal).
const DEFAULT_DEV_PORT: Record<ProposalId, number> = {}

export function resolveProposalAppUrl(proposal: Proposal): string {
  const configuredUrl = import.meta.env[proposal.appUrlEnvVar] as string | undefined
  if (configuredUrl?.trim()) return configuredUrl.trim()
  return `http://localhost:${DEFAULT_DEV_PORT[proposal.id]}/`
}
