import type { Proposal } from '../contracts/proposals'

// The catalog is intentionally empty. Prototypes are created from the proposal
// documents in `docs/propuestas/`; each new prototype registers its complete
// `Proposal` entry below, following AGENTS.md → "How to add a new proposal
// prototype" → step "Register the proposal in the portal".
export const proposalCatalog: readonly Proposal[] = []