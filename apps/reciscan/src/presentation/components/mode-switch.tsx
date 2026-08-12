import { PackageCheck, Route as RouteIcon } from 'lucide-react'
import { useReciScan } from '../../state/reciscan-context'

export function ModeSwitch({ compact = false }: { compact?: boolean }) {
  const { mode, setMode } = useReciScan()
  return (
    <div className={compact ? 'mode-switch compact' : 'mode-switch'} role="group" aria-label="Perspectiva de uso">
      <button className={mode === 'seller' ? 'active' : ''} onClick={() => setMode('seller')}><PackageCheck aria-hidden="true" />Tengo material</button>
      <button className={mode === 'recycler' ? 'active' : ''} onClick={() => setMode('recycler')}><RouteIcon aria-hidden="true" />Recolecto / compro</button>
    </div>
  )
}
