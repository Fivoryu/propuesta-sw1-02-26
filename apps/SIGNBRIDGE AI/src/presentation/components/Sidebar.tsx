import { NavLink } from 'react-router-dom'
import { Home, Video, Dumbbell, History, Settings, HandMetal } from 'lucide-react'
import { cn } from '../../utils/cn'

const navItems = [
  { to: '/', label: 'Inicio', icon: Home, end: true },
  { to: '/recognition', label: 'Reconocimiento', icon: Video, end: false },
  { to: '/practice', label: 'Práctica', icon: Dumbbell, end: false },
  { to: '/history', label: 'Historial', icon: History, end: false },
  { to: '/admin', label: 'Administración', icon: Settings, end: false },
]

export function Sidebar() {
  return (
    <aside className="fixed inset-y-0 left-0 z-30 hidden w-64 flex-col border-r border-line/60 bg-surface lg:flex">
      <div className="flex h-16 items-center gap-3 border-b border-line/60 px-5">
        <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-primary text-white">
          <HandMetal className="h-5 w-5" aria-hidden="true" />
        </span>
        <div>
          <p className="text-sm font-bold leading-tight text-ink">SignBridge AI</p>
          <p className="text-[10px] font-medium text-muted">Lengua de señas</p>
        </div>
      </div>

      <nav className="flex flex-1 flex-col gap-1 px-3 py-4" aria-label="Navegación principal">
        {navItems.map(({ to, label, icon: Icon, end }) => (
          <NavLink
            key={to}
            to={to}
            end={end}
            className={({ isActive }) =>
              cn(
                'flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-semibold transition-colors duration-200',
                isActive
                  ? 'bg-primary/10 text-primary'
                  : 'text-muted hover:bg-primary/[0.06] hover:text-ink',
              )
            }
          >
            {({ isActive }) => (
              <>
                <Icon
                  className={cn('h-4.5 w-4.5 h-5 w-5', isActive ? 'text-primary' : 'text-muted')}
                  aria-hidden="true"
                />
                {label}
              </>
            )}
          </NavLink>
        ))}
      </nav>

      <div className="border-t border-line/60 px-5 py-4">
        <p className="text-[10px] text-muted">Prototipo funcional</p>
        <p className="text-[10px] text-muted/60">Ing. Software I · 2026</p>
      </div>
    </aside>
  )
}
