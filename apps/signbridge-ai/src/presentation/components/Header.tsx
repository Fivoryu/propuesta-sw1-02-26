import { useState } from 'react'
import { NavLink } from 'react-router-dom'
import { HandMetal, Menu, X, Home, Video, Dumbbell, History, Settings } from 'lucide-react'
import { cn } from '../../utils/cn'

const navItems = [
  { to: '/', label: 'Inicio', icon: Home, end: true },
  { to: '/recognition', label: 'Reconocimiento', icon: Video, end: false },
  { to: '/practice', label: 'Práctica', icon: Dumbbell, end: false },
  { to: '/history', label: 'Historial', icon: History, end: false },
  { to: '/admin', label: 'Admin', icon: Settings, end: false },
]

export function Header() {
  const [menuOpen, setMenuOpen] = useState(false)

  return (
    <>
      <header className="fixed inset-x-0 top-0 z-30 flex h-14 items-center justify-between border-b border-line/60 bg-surface/95 px-4 backdrop-blur-sm lg:hidden">
        <div className="flex items-center gap-2.5">
          <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary text-white">
            <HandMetal className="h-4 w-4" aria-hidden="true" />
          </span>
          <span className="text-sm font-bold text-ink">SignBridge AI</span>
        </div>

        <button
          onClick={() => setMenuOpen((o) => !o)}
          className="flex h-9 w-9 items-center justify-center rounded-lg text-muted hover:bg-primary/[0.06] hover:text-ink"
          aria-label={menuOpen ? 'Cerrar menú' : 'Abrir menú'}
        >
          {menuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
        </button>
      </header>

      {menuOpen && (
        <div
          className="fixed inset-0 z-20 bg-ink/30 lg:hidden"
          onClick={() => setMenuOpen(false)}
          aria-hidden="true"
        />
      )}

      <nav
        className={cn(
          'fixed inset-y-0 left-0 z-30 w-64 flex-col bg-surface shadow-lift transition-transform duration-280 ease-spring lg:hidden',
          menuOpen ? 'flex translate-x-0' : '-translate-x-full flex',
        )}
        aria-label="Menú móvil"
      >
        <div className="flex h-14 items-center gap-2.5 border-b border-line/60 px-4">
          <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary text-white">
            <HandMetal className="h-4 w-4" aria-hidden="true" />
          </span>
          <span className="text-sm font-bold text-ink">SignBridge AI</span>
        </div>

        <div className="flex flex-1 flex-col gap-1 px-3 py-4">
          {navItems.map(({ to, label, icon: Icon, end }) => (
            <NavLink
              key={to}
              to={to}
              end={end}
              onClick={() => setMenuOpen(false)}
              className={({ isActive }) =>
                cn(
                  'flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-semibold transition-colors',
                  isActive
                    ? 'bg-primary/10 text-primary'
                    : 'text-muted hover:bg-primary/[0.06] hover:text-ink',
                )
              }
            >
              {({ isActive }) => (
                <>
                  <Icon className={cn('h-5 w-5', isActive ? 'text-primary' : 'text-muted')} aria-hidden="true" />
                  {label}
                </>
              )}
            </NavLink>
          ))}
        </div>
      </nav>
    </>
  )
}
