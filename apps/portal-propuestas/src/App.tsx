import { useState } from 'react'
import { BarChart3 } from 'lucide-react'
import { NavLink, Route, Routes, useNavigate } from 'react-router-dom'
import { AppShell, Badge, IconButton, useToast } from '@propuestas/ui'
import { proposalCatalog, type ProposalId } from '@propuestas/shared'
import { proposalsFromIds } from './domain/comparison'
import { resolveProposalAppUrl } from './services/app-urls'
import { ComparisonPage } from './presentation/pages/ComparisonPage'
import { HomePage } from './presentation/pages/HomePage'
import { NotFoundPage } from './presentation/pages/NotFoundPage'
import { ProposalDetailPage } from './presentation/pages/ProposalDetailPage'

export default function App() {
  const [comparedIds, setComparedIds] = useState<ProposalId[]>([])
  const { show } = useToast()
  const navigate = useNavigate()
  const comparedProposals = proposalsFromIds(comparedIds, proposalCatalog)

  function addToComparison(proposalId: ProposalId) {
    const proposal = proposalCatalog.find((item) => item.id === proposalId)
    if (!proposal) return
    if (comparedIds.includes(proposalId)) {
      show({ title: 'Ya está en la comparación', message: `${proposal.name} no se agregó otra vez.`, variant: 'info' })
      return
    }
    setComparedIds((current) => [...current, proposalId])
    show({ title: 'Propuesta agregada', message: `${proposal.name} ya está disponible en la vista comparativa.`, variant: 'success' })
  }

  function removeFromComparison(proposalId: ProposalId) {
    const proposal = proposalCatalog.find((item) => item.id === proposalId)
    setComparedIds((current) => current.filter((id) => id !== proposalId))
    if (proposal) {
      show({
        title: 'Propuesta quitada',
        message: 'La selección sigue siendo temporal.',
        variant: 'info',
        action: { label: 'Deshacer', onClick: () => restoreToComparison(proposalId) },
      })
    }
  }

  function restoreToComparison(proposalId: ProposalId) {
    const proposal = proposalCatalog.find((item) => item.id === proposalId)
    setComparedIds((current) => current.includes(proposalId) ? current : [...current, proposalId])
    if (proposal) show({ title: 'Propuesta restaurada', message: `${proposal.name} volvió a la comparación.`, variant: 'success' })
  }

  const navigation = (
    <>
      <NavLink className={({ isActive }) => `focus-ring inline-flex min-h-10 items-center rounded-full px-3 ${isActive ? 'bg-primary/[0.09] text-primary' : 'text-muted hover:bg-primary/[0.06] hover:text-primary'}`} to="/" end>
        Propuestas
      </NavLink>
      <NavLink className={({ isActive }) => `focus-ring inline-flex min-h-10 items-center gap-2 rounded-full px-3 ${isActive ? 'bg-primary/[0.09] text-primary' : 'text-muted hover:bg-primary/[0.06] hover:text-primary'}`} to="/comparar">
        Comparar <Badge variant="accent" className="px-2 py-0.5 text-[0.68rem]">{comparedIds.length}</Badge>
      </NavLink>
    </>
  )

  return (
    <AppShell brand="Portal de Propuestas" subtitle="Ingeniería de Software I" navigation={navigation} actions={<IconButton label="Abrir comparación" icon={<BarChart3 aria-hidden="true" className="h-5 w-5" />} onClick={() => navigate('/comparar')} />}>
      <Routes>
        <Route path="/" element={<HomePage proposals={proposalCatalog} comparedIds={comparedIds} onCompare={addToComparison} resolveAppUrl={resolveProposalAppUrl} />} />
        <Route path="/comparar" element={<ComparisonPage proposals={comparedProposals} onRemove={removeFromComparison} />} />
        <Route path="/propuestas/:proposalId" element={<ProposalDetailPage proposals={proposalCatalog} comparedIds={comparedIds} onCompare={addToComparison} resolveAppUrl={resolveProposalAppUrl} />} />
        <Route path="*" element={<NotFoundPage />} />
      </Routes>
    </AppShell>
  )
}
