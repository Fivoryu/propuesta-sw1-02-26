import { Camera, Home, Map, Search, ShoppingBasket, UserRound } from 'lucide-react'
import { NavLink, Route, Routes } from 'react-router-dom'
import { useState } from 'react'
import { BasketPage, HomePage, PlusPage, PricesPage, ProductPage, ScanPage, ScanResultPage, ProfilePage } from './presentation/pages'
import type { Receipt } from './domain/types'

const navItems = [
  { to: '/', label: 'Inicio', icon: Home },
  { to: '/comparar', label: 'Comparar', icon: ShoppingBasket },
  { to: '/escanear', label: 'Escanear', icon: Camera, featured: true },
  { to: '/precios', label: 'Precios', icon: Map },
  { to: '/mi-canastaai', label: 'Mi cuenta', icon: UserRound },
]

export default function App() {
  const [confirmedReceipt, setConfirmedReceipt] = useState<Receipt | null>(null)
  const context = { confirmedReceipt, setConfirmedReceipt }

  return (
    <div className="ca-app">
      <header className="ca-header">
        <NavLink to="/" className="ca-brand" aria-label="Ir al inicio de CanastaAI"><ShoppingBasket aria-hidden="true" />CanastaAI</NavLink>
        <nav className="ca-desktop-nav" aria-label="Navegación principal">
          {navItems.map(({ to, label }) => <NavLink key={to} to={to}>{label}</NavLink>)}
        </nav>
        <div className="ca-location"><Search aria-hidden="true" />Santa Cruz</div>
      </header>
      <main className="ca-main">
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/comparar" element={<BasketPage />} />
          <Route path="/escanear" element={<ScanPage />} />
          <Route path="/escanear/resultado" element={<ScanResultPage context={context} />} />
          <Route path="/precios" element={<PricesPage />} />
          <Route path="/precios/:productId" element={<ProductPage />} />
          <Route path="/mi-canastaai" element={<ProfilePage confirmedReceipt={confirmedReceipt} />} />
          <Route path="/mi-canastaai/plus" element={<PlusPage />} />
          <Route path="*" element={<HomePage />} />
        </Routes>
      </main>
      <nav className="ca-bottom-nav" aria-label="Navegación inferior">
        {navItems.map(({ to, label, icon: Icon, featured }) => (
          <NavLink key={to} to={to} className={featured ? 'featured' : ''}>
            <Icon aria-hidden="true" />
            <span>{label}</span>
          </NavLink>
        ))}
      </nav>
    </div>
  )
}
