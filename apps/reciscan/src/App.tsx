import { Camera, Home, Map, Recycle, Route as RouteIcon, UserRound } from 'lucide-react'
import { NavLink, Route, Routes } from 'react-router-dom'
import { CollectionPage, HomePage, ListingDetailPage, MarketPage, ProfilePage, ProPage, PublishPage, ScanPage, ScanResultPage } from './presentation/pages'
import { ReciScanProvider } from './state/reciscan-context'
import { ModeSwitch } from './presentation/components/mode-switch'

const navItems = [
  { to: '/', label: 'Inicio', icon: Home },
  { to: '/mercado', label: 'Mercado', icon: Map },
  { to: '/escanear', label: 'Escanear', icon: Camera, featured: true },
  { to: '/recolecciones', label: 'Recolecciones', icon: RouteIcon },
  { to: '/mi-reciscan', label: 'Mi ReciScan', icon: UserRound },
]

export default function App() {
  return (
    <ReciScanProvider>
      <div className="rs-app">
        <header className="rs-header">
          <NavLink to="/" className="rs-brand" aria-label="Ir al inicio de ReciScan"><Recycle aria-hidden="true" />ReciScan</NavLink>
          <nav className="rs-desktop-nav" aria-label="Navegación principal">{navItems.map(({ to, label }) => <NavLink key={to} to={to}>{label}</NavLink>)}</nav>
          <ModeSwitch compact />
        </header>
        <main className="rs-main">
          <Routes>
            <Route path="/" element={<HomePage />} />
            <Route path="/escanear" element={<ScanPage />} />
            <Route path="/escanear/resultado" element={<ScanResultPage />} />
            <Route path="/publicar" element={<PublishPage />} />
            <Route path="/mercado" element={<MarketPage />} />
            <Route path="/mercado/:listingId" element={<ListingDetailPage />} />
            <Route path="/recolecciones" element={<CollectionPage />} />
            <Route path="/mi-reciscan" element={<ProfilePage />} />
            <Route path="/mi-reciscan/pro" element={<ProPage />} />
            <Route path="*" element={<HomePage />} />
          </Routes>
        </main>
        <nav className="rs-bottom-nav" aria-label="Navegación inferior">
          {navItems.map(({ to, label, icon: Icon, featured }) => <NavLink key={to} to={to} className={featured ? 'featured' : ''}><Icon aria-hidden="true" /><span>{label}</span></NavLink>)}
        </nav>
      </div>
    </ReciScanProvider>
  )
}
