import { Bell, Camera, Check, PackageCheck, Play, Recycle, Search, ShieldCheck, SlidersHorizontal, Star, Truck, UserRound } from 'lucide-react'
import { Link, useNavigate, useParams } from 'react-router-dom'
import { useState } from 'react'
import { ModeSwitch } from './components/mode-switch'
import { useReciScan } from '../state/reciscan-context'
import { demoScan, listings } from '../fixtures/data'
import { calculateListingTotalKg, filterListings } from '../domain/listings'
import { analyzeMaterial, buildCollectionRoute, getListing, getMaterialPriceReference, getNearbyListings, getRecyclerMatches } from '../services/mock/reciscan-service'
import type { ListingMode, MaterialCategory, RecyclerProfile } from '../domain/types'
import { bs, kg } from '../utils/format'

const materialFilters: Array<MaterialCategory | 'Todos'> = ['Todos', 'PET', 'Cartón', 'Aluminio', 'Vidrio']

export function HomePage() {
  const { mode } = useReciScan()
  const seller = mode === 'seller'
  return (
    <section className="home-layout">
      <div className="hero-panel">
        <ModeSwitch />
        <p className="eyebrow">Santa Cruz de la Sierra · Datos demostrativos</p>
        <h1>Lo que ya no necesitas puede valer para alguien más.</h1>
        <p>Escanea materiales reciclables, publícalos y encuentra quién puede recogerlos cerca de ti.</p>
        <div className="hero-actions">
          <Link className="primary-action" to="/escanear"><Camera aria-hidden="true" />Escanear material</Link>
          <Link className="secondary-action" to="/mercado"><Search aria-hidden="true" />Ver oportunidades</Link>
        </div>
      </div>
      <aside className="summary-panel">
        {seller ? <SellerHomeSummary /> : <RecyclerHomeSummary />}
      </aside>
      <section className="wow-band">
        <div><p className="eyebrow">Momento clave</p><h2>Lo disperso ahora puede convertirse en una ruta de trabajo.</h2><p>Hay 3 oportunidades dentro de 1,5 km: PET 6,5 kg, Cartón 12 kg y Aluminio 2,4 kg.</p></div>
        <strong>{kg(20.9)}</strong>
        <span>Ruta sugerida · 3,2 km</span>
      </section>
    </section>
  )
}

function SellerHomeSummary() {
  return <div className="summary-stack"><Metric label="Material disponible" value={kg(6.5)} /><Metric label="Valor referencial" value={bs(14.3)} /><p><UserRound />1 reciclador interesado en PET transparente.</p><p><ShieldCheck />ReciScan no gestiona residuos peligrosos.</p></div>
}

function RecyclerHomeSummary() {
  return <div className="summary-stack"><Metric label="Total disponible cerca" value={`4 oportunidades · ${kg(calculateListingTotalKg(listings))}`} /><Metric label="Incluido en ruta sugerida" value={kg(20.9)} /><p><Truck />Recorrido sugerido: 3 recolecciones · 3,2 km.</p><p><Bell />Materiales preferidos: PET, Cartón y Aluminio.</p></div>
}

function Metric({ label, value }: { label: string; value: string }) {
  return <div className="metric"><span>{label}</span><strong>{value}</strong></div>
}

export function ScanPage() {
  const [selected, setSelected] = useState(false)
  const [loading, setLoading] = useState(false)
  const [step, setStep] = useState(0)
  const navigate = useNavigate()
  const steps = ['Material detectado', 'Estado estimado', 'Cantidad aproximada', 'Valor de referencia calculado']
  async function start() {
    setLoading(true)
    for (let index = 0; index < steps.length; index += 1) {
      setStep(index + 1)
      await new Promise((resolve) => window.setTimeout(resolve, 150))
    }
    await analyzeMaterial(80)
    navigate('/escanear/resultado')
  }
  return (
    <section className="scan-layout">
      <div className="camera-area"><Recycle /><h1>Escanear material</h1><p>Usa una foto demostrativa para simular la clasificación y preparar una publicación.</p><button className={selected ? 'secondary-action selected' : 'secondary-action'} onClick={() => setSelected(true)}>Usar foto de demostración</button></div>
      <div className="content-panel"><h2>Qué se estima</h2><ul className="check-list"><li><Check />Tipo de material reciclable</li><li><Check />Estado visible y preparación</li><li><Check />Cantidad aproximada y valor referencial</li></ul>{loading && <div className="progress-box" role="status" aria-live="polite"><strong>Analizando material...</strong>{steps.map((item, index) => <span key={item} className={step > index ? 'done' : ''}>{item}</span>)}</div>}<button className="primary-action full" disabled={!selected || loading} onClick={start}>Analizar material</button></div>
    </section>
  )
}

export function ScanResultPage() {
  const reference = getMaterialPriceReference(demoScan.material)
  return (
    <section className="result-layout">
      <div className="content-panel">
        <p className="eyebrow">Resultado simulado</p><h1>Material identificado</h1>
        <div className="result-grid"><Metric label="Material" value={`${demoScan.material} transparente`} /><Metric label="Estado" value={demoScan.condition} /><Metric label="Cantidad aproximada" value={kg(demoScan.estimatedKg)} /><Metric label="Precio referencial" value={`${bs(reference.price)} / kg`} /><Metric label="Valor referencial" value={bs(demoScan.referenceValue)} /><Metric label="Confianza" value={`${demoScan.confidence}%`} /></div>
        <p className="hint">El peso puede ser declarado o estimado. El peso final se confirma durante la recolección. Valor demostrativo de referencia; el precio final se acuerda entre las partes.</p>
      </div>
      <div className="content-panel"><h2>Antes de entregarlo</h2><ul className="check-list"><li><Check />Vacía los envases.</li><li><Check />Mantén el material seco.</li><li><Check />Compacta las botellas si es posible.</li><li><Check />Separa otros materiales.</li></ul><Link className="primary-action full" to="/publicar">Publicar material</Link><Link className="secondary-action full" to="/escanear">Corregir clasificación</Link></div>
    </section>
  )
}

export function PublishPage() {
  const { publicationMode, setPublicationMode, published, setPublished } = useReciScan()
  const [message, setMessage] = useState('')
  const modes: ListingMode[] = ['Vender', 'Gratis', 'Negociar']
  function publish() {
    setPublished(true)
    setMessage('Tu material ya es visible para recicladores cercanos.')
  }
  return (
    <section className="publish-layout">
      <div className="content-panel"><p className="eyebrow">Publicación</p><h1>PET transparente</h1><div className="result-grid"><Metric label="Cantidad" value={kg(6.5)} /><Metric label="Estado" value="Limpio y seco" /><Metric label="Zona" value="Equipetrol" /><Metric label="Disponibilidad" value="Hoy 17:00 a 19:00" /></div><p className="safety-note">Tu ubicación exacta solo se comparte cuando coordinas una recolección.</p></div>
      <div className="content-panel"><h2>¿Qué quieres hacer?</h2><div className="mode-cards">{modes.map((mode) => <button key={mode} className={publicationMode === mode ? 'active' : ''} onClick={() => setPublicationMode(mode)}>{mode}<span>{mode === 'Vender' ? bs(14.3) : mode === 'Gratis' ? 'Solo coordinar recolección' : 'Precio a coordinar'}</span></button>)}</div><button className="primary-action full" onClick={publish}>Publicar</button>{message && <p className="toast-message" role="status">{message}</p>}{published && <RecyclerMatches />}</div>
    </section>
  )
}

function RecyclerMatches() {
  const [selectedProfile, setSelectedProfile] = useState<RecyclerProfile | null>(null)
  const [conversation, setConversation] = useState<RecyclerProfile | null>(null)
  return <div className="match-list"><h2>Encontramos 3 posibles recolectores</h2>{getRecyclerMatches().map((match) => <article key={match.id} className="match-card"><div><strong>{match.name}</strong><span>{match.role}</span><span>Acepta: {match.accepts.join(' · ')}</span></div><div><b>{match.distanceKm.toLocaleString('es-BO')} km</b><span><Star /> {match.rating} · {match.completedCollections} recolecciones</span></div><button onClick={() => setSelectedProfile(match)}>Ver perfil</button><button onClick={() => setConversation(match)}>Coordinar</button></article>)}{selectedProfile && <RecyclerProfileDialog profile={selectedProfile} onClose={() => setSelectedProfile(null)} />}{conversation && <ConversationPanel name={conversation.name} onClose={() => setConversation(null)} />}</div>
}

export function MarketPage() {
  const [filter, setFilter] = useState<MaterialCategory | 'Todos'>('Todos')
  const [query, setQuery] = useState('')
  const opportunities = filterListings(getNearbyListings('Todos'), filter, query)
  return (
    <section className="market-layout">
      <div className="content-panel"><p className="eyebrow">Mercado</p><h1>Oportunidades cercanas</h1><label className="search-box"><Search /><input aria-label="Buscar material" placeholder="Buscar PET, cartón o aluminio" value={query} onChange={(event) => setQuery(event.target.value)} /></label><div className="filter-row">{materialFilters.map((item) => <button key={item} className={filter === item ? 'active' : ''} onClick={() => setFilter(item)}><SlidersHorizontal />{item}</button>)}</div><div className="cluster-box"><strong>Total disponible cerca: 4 oportunidades · {kg(calculateListingTotalKg(listings))}</strong><span>Ruta sugerida: 3 seleccionadas · {kg(20.9)} · 3,2 km</span><Link to="/recolecciones">Ver grupo sugerido</Link></div><div className="listing-list">{opportunities.map((listing) => <ListingCard key={listing.id} id={listing.id} />)}</div></div>
      <MapPanel />
    </section>
  )
}

function ListingCard({ id }: { id: string }) {
  const listing = getListing(id)
  return <Link className="listing-card" to={`/mercado/${listing.id}`}><div><strong>{listing.title}</strong><span>{listing.zone} · {listing.distanceKm.toLocaleString('es-BO')} km · {listing.freshness}</span><span>{listing.mode} {listing.referenceValue ? `· ${bs(listing.referenceValue)} referencial` : '· Precio a coordinar'}</span></div><b>{kg(listing.quantityKg)}</b></Link>
}

function MapPanel() {
  return <div className="map-panel" aria-label="Mapa demostrativo de oportunidades"><span className="pin p1">PET 6,5 kg</span><span className="pin p2">Cartón 12 kg</span><span className="pin p3">Aluminio 2,4 kg</span><strong>Santa Cruz · zona norte</strong></div>
}

export function ListingDetailPage() {
  const { listingId = 'pet-equipetrol' } = useParams()
  const listing = getListing(listingId)
  const { reservedListingId, setReservedListingId } = useReciScan()
  const [chat, setChat] = useState(false)
  const reserved = reservedListingId === listing.id
  const reference = getMaterialPriceReference(listing.material)
  return (
    <section className="detail-layout">
      <div className="content-panel"><p className="eyebrow">Oportunidad</p><h1>{listing.title}</h1><div className="result-grid"><Metric label="Cantidad declarada" value={kg(listing.quantityKg)} /><Metric label="Estado" value={listing.condition} /><Metric label="Zona aproximada" value={listing.zone} /><Metric label="Distancia" value={`${listing.distanceKm.toLocaleString('es-BO')} km`} /></div><p className="hint">{listing.availability}. Ubicación exacta protegida hasta coordinar.</p><button className={reserved ? 'secondary-action selected full' : 'primary-action full'} disabled={reserved} onClick={() => setReservedListingId(listing.id)}>{reserved ? 'Reservado durante 30 min para coordinar.' : 'Reservar oportunidad'}</button>{reserved && <p className="toast-message" role="status">Reserva simulada activa durante 30 min.</p>}<button className="secondary-action full" onClick={() => setChat(true)}>Contactar</button></div>
      <div className="content-panel"><h2>Valor y seguridad</h2><p>Precio referencial: {bs(reference.price)} / kg · rango {reference.range}. {listing.referenceValue ? `${bs(listing.referenceValue)} como valor de referencia demostrativo.` : 'Precio a coordinar entre ambas partes.'}</p><p className="safety-note">Valor demostrativo de referencia; el precio final se acuerda entre las partes. No publiques información sensible en el chat.</p>{chat && <ConversationPanel name="Vendedor" onClose={() => setChat(false)} />}</div>
    </section>
  )
}

export function CollectionPage() {
  const route = buildCollectionRoute()
  const { routeStarted, setRouteStarted, completedStopId, setCompletedStopId } = useReciScan()
  const firstStop = route.stops[0]
  const listing = getListing(firstStop.listingId)
  return (
    <section className="route-layout">
      <div className="content-panel route-hero"><p className="eyebrow">Recolecciones</p><h1>Ruta sugerida</h1><div className="result-grid"><Metric label="Recolecciones" value="3" /><Metric label="Distancia estimada" value={`${route.distanceKm.toLocaleString('es-BO')} km`} /><Metric label="Material total" value={kg(route.totalKg)} /><Metric label="Tiempo aproximado" value={`${route.minutes} min`} /></div><p>Agrupa recolecciones cercanas y reduce recorridos innecesarios.</p><button className="primary-action full" onClick={() => setRouteStarted(true)}><Play />{routeStarted ? 'Recorrido en progreso' : 'Iniciar recorrido'}</button></div>
      <div className="content-panel"><RouteVisualization /><div className="stop-list">{route.stops.map((stop) => { const item = getListing(stop.listingId); return <article key={stop.listingId} className="stop-card"><b>{stop.order}</b><div><strong>{item.zone}</strong><span>{item.material} · {kg(item.quantityKg)}</span></div><span>{completedStopId === stop.listingId ? 'Completado' : 'Pendiente'}</span></article> })}</div></div>
      {routeStarted && <div className="content-panel confirmation"><h2>Confirmar primera recolección</h2><Metric label="Material" value={listing.material} /><Metric label="Cantidad publicada" value={kg(listing.quantityKg)} /><Metric label="Peso confirmado" value={kg(firstStop.confirmedKg)} /><Metric label="Acuerdo final" value={bs(firstStop.finalAgreement)} /><button className="primary-action full" onClick={() => setCompletedStopId(firstStop.listingId)}>Confirmar recolección</button>{completedStopId === firstStop.listingId && <p className="toast-message">Recolección completada.</p>}</div>}
    </section>
  )
}

export function ProfilePage() {
  const { mode } = useReciScan()
  return mode === 'seller' ? <SellerProfile /> : <RecyclerProfileView />
}

function SellerProfile() {
  return <section className="profile-layout"><div className="content-panel profile-card"><PackageCheck /><h1>Mi ReciScan</h1><p>Tengo material</p><div className="result-grid"><Metric label="Material recuperado" value={kg(18.7)} /><Metric label="Ingresos obtenidos" value={bs(46.5)} /><Metric label="Entregas realizadas" value="4" /></div></div><div className="content-panel"><h2>Publicaciones actuales</h2><ListingCard id="pet-equipetrol" /><h2>Recicladores favoritos</h2><p>Carlos R. · PET, Cartón y Aluminio.</p></div></section>
}

function RecyclerProfileView() {
  return <section className="profile-layout"><div className="content-panel profile-card"><UserRound /><h1>Carlos R.</h1><p>Reciclador independiente · Centro / Norte</p><div className="result-grid"><Metric label="Recolectado este mes" value={kg(126)} /><Metric label="Recolecciones" value="21" /><Metric label="Distancia en rutas" value="42 km" /><Metric label="Plan actual" value="ReciScan Gratis" /></div><Link className="primary-action full" to="/mi-reciscan/pro">Conocer ReciScan Pro</Link></div><div className="content-panel"><h2>Reservas activas</h2><ListingCard id="pet-equipetrol" /><h2>Materiales preferidos</h2><p>PET · Cartón · Aluminio · radio estándar 3 km.</p></div></section>
}

export function ProPage() {
  const [message, setMessage] = useState('')
  return (
    <section className="pro-layout">
      <div className="pro-hero"><p className="eyebrow">ReciScan Pro</p><h1>Mejores oportunidades para quienes recolectan.</h1><p>Alertas avanzadas, mayor radio, agrupación inteligente de recolecciones y rutas sugeridas. Precio demostrativo: <strong>Bs 19,90 / mes</strong>.</p></div>
      <div className="plan-grid"><Plan title="ReciScan Gratis" items={['Explorar oportunidades', 'Publicar materiales', 'Reservas básicas', 'Historial reciente', 'Radio estándar']} /><Plan featured title="ReciScan Pro" items={['Todo lo incluido en Gratis', 'Alertas avanzadas por material', 'Mayor radio de búsqueda', 'Filtros avanzados', 'Rutas sugeridas', 'Estadísticas de trabajo', 'Perfil profesional verificado']} /></div>
      <div className="premium-preview"><Bell /><div><h2>Alertas de oportunidad</h2><p>Se publicaron 14,2 kg de cartón dentro de tu zona habitual.</p><p>3 nuevas publicaciones de PET aparecieron a menos de 2 km.</p></div></div>
      <button className="primary-action full" onClick={() => setMessage('Función demostrativa del prototipo.')}>Probar ReciScan Pro</button>{message && <p className="toast-message">{message}</p>}
    </section>
  )
}

function Plan({ title, items, featured = false }: { title: string; items: string[]; featured?: boolean }) {
  return <article className={featured ? 'plan featured-plan' : 'plan'}><h2>{title}</h2><ul>{items.map((item) => <li key={item}><Check />{item}</li>)}</ul>{featured && <strong>Bs 19,90 / mes</strong>}</article>
}

function RecyclerProfileDialog({ profile, onClose }: { profile: RecyclerProfile; onClose: () => void }) {
  return <section className="conversation" aria-labelledby={`profile-${profile.id}`}><button className="dialog-close" onClick={onClose}>Cerrar</button><h2 id={`profile-${profile.id}`}>Perfil de {profile.name}</h2><p>{profile.role}</p><p>Acepta: {profile.accepts.join(' · ')}</p><p>Distancia: {profile.distanceKm.toLocaleString('es-BO')} km · calificación {profile.rating} · {profile.completedCollections} recolecciones completadas.</p><p>Compra PET aprox: {bs(profile.petPrice)} / kg.</p></section>
}

function ConversationPanel({ name, onClose }: { name: string; onClose: () => void }) {
  return <section className="conversation" aria-labelledby={`conversation-${name.toLowerCase().replace(/\s+/g, '-')}`}><button className="dialog-close" onClick={onClose}>Cerrar</button><h2 id={`conversation-${name.toLowerCase().replace(/\s+/g, '-')}`}>Conversación con {name}</h2><p><strong>Recolector:</strong> Hola, puedo pasar entre 17:30 y 18:00.</p><p><strong>Vendedor:</strong> Perfecto. Te comparto el punto cuando estés cerca.</p><p className="safety-note">No compartas información sensible antes de coordinar la entrega.</p></section>
}

function RouteVisualization() {
  return <div className="route-map" aria-label="Ruta ordenada de recolección"><svg viewBox="0 0 320 180" role="img" aria-label="Ruta 1 a 2 a 3"><path d="M54 126 C108 34 160 40 202 88 S252 144 286 52" fill="none" stroke="currentColor" strokeWidth="6" strokeLinecap="round" /></svg><div className="route-stop s1"><b>1</b><span>Equipetrol<br />PET · 6,5 kg</span></div><div className="route-stop s2"><b>2</b><span>Av. Alemana<br />Cartón · 12 kg</span></div><div className="route-stop s3"><b>3</b><span>Hamacas<br />Aluminio · 2,4 kg</span></div></div>
}
