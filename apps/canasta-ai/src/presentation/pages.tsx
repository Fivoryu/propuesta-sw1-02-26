import { Bell, Camera, Check, ChevronRight, Clock, MapPin, Minus, Plus, ReceiptText, Search, ShoppingBasket, SlidersHorizontal, Sparkles, TrendingDown, UserRound } from 'lucide-react'
import { Link, useNavigate, useParams } from 'react-router-dom'
import { useEffect, useState } from 'react'
import { demoReceipt, products, stores, userProfile, weeklyBasket } from '../fixtures/data'
import { calculatePriceVariation, sortPriceObservations } from '../domain/basket'
import { analyzeReceipt, compareBasket, getProductHistory, getProductPrices } from '../services/mock/canasta-service'
import type { BasketItem, BasketRecommendation, PriceHistoryPoint, PriceSortMode, Receipt, ReceiptItem, StrategyId } from '../domain/types'
import { bs, distanceKm, percent } from '../utils/format'

const productById = new Map(products.map((product) => [product.id, product]))
const storeById = new Map(stores.map((store) => [store.id, store]))

function StoreName({ id }: { id: string }) {
  return <>{storeById.get(id)?.name ?? id}</>
}

function ProductName({ id }: { id: string }) {
  const product = productById.get(id)
  return <>{product ? `${product.name} ${product.presentation}` : id}</>
}

function HeroMoney({ label, value }: { label: string; value: number }) {
  return <div className="hero-money"><span>{label}</span><strong>{bs(value)}</strong></div>
}

function MetricValue({ label, value, tone }: { label: string; value: string; tone?: string }) {
  return <div className="hero-money compact-metric"><span>{label}</span><strong className={tone}>{value}</strong></div>
}

export function HomePage() {
  const [query, setQuery] = useState('')
  const matches = products.filter((product) => `${product.name} ${product.presentation}`.toLowerCase().includes(query.toLowerCase()))
  return (
    <section className="home-grid">
      <div className="hero-panel">
        <p className="eyebrow">Datos demostrativos · Santa Cruz de la Sierra</p>
        <h1>Tu compra cotidiana puede enseñarte dónde ahorrar.</h1>
        <p>Convierte tus tickets en información colectiva de precios y descubre dónde conviene comprar.</p>
        <div className="hero-actions">
          <Link className="primary-action" to="/escanear"><Camera aria-hidden="true" />Escanear ticket</Link>
          <Link className="secondary-action" to="/comparar"><ShoppingBasket aria-hidden="true" />Comparar mi canasta</Link>
        </div>
        <label className="search-box">
          <Search aria-hidden="true" />
          <input aria-label="Buscar producto para comparar" placeholder="¿Qué producto quieres comparar?" value={query} onChange={(event) => setQuery(event.target.value)} />
        </label>
        {query && <div className="search-results" role="listbox" aria-label="Resultados de productos">{matches.map((product) => <Link key={product.id} to={`/precios/${product.id}`}>{product.name} {product.presentation}</Link>)}</div>}
      </div>
      <aside className="summary-panel">
        <HeroMoney label="Ahorro estimado este mes" value={61.8} />
        <div className="opportunity-list">
          <h2>Oportunidades recientes</h2>
          <p><TrendingDown aria-hidden="true" /> Arroz 5 kg está Bs 6,40 más barato en Mercado Norte.</p>
          <p><Clock aria-hidden="true" /> Leche PIL 1 L actualizada hace 3 h por la comunidad.</p>
        </div>
      </aside>
      <section className="content-band">
        <div className="section-heading"><h2>Productos más consultados</h2><Link to="/precios">Ver precios</Link></div>
        <div className="quick-products">
          {products.slice(0, 4).map((product) => <Link key={product.id} to={`/precios/${product.id}`}>{product.name}<span>{product.presentation}</span></Link>)}
        </div>
      </section>
      <section className="content-band">
        <div className="section-heading"><h2>Continúa tu canasta semanal</h2><Link to="/comparar">Abrir</Link></div>
        <div className="basket-preview">
          {weeklyBasket.slice(0, 4).map((item) => <span key={item.productId}>{item.quantity}x <ProductName id={item.productId} /></span>)}
        </div>
      </section>
    </section>
  )
}

export function ScanPage() {
  const navigate = useNavigate()
  const [selected, setSelected] = useState(false)
  const [loading, setLoading] = useState(false)
  const [step, setStep] = useState(0)
  const steps = ['Comercio detectado', 'Fecha identificada', 'Productos reconocidos', 'Precios extraídos']

  async function start() {
    setLoading(true)
    for (let index = 0; index < steps.length; index += 1) {
      setStep(index + 1)
      await new Promise((resolve) => window.setTimeout(resolve, 180))
    }
    await analyzeReceipt(undefined, 80)
    navigate('/escanear/resultado')
  }

  return (
    <section className="scan-layout">
      <div className="camera-area">
        <ReceiptText aria-hidden="true" />
        <h1>Escanear ticket</h1>
        <p>Simula la lectura de un comprobante para convertirlo en precios revisables.</p>
        <button className={selected ? 'secondary-action selected' : 'secondary-action'} onClick={() => setSelected(true)}>Usar ticket de demostración</button>
      </div>
      <div className="content-panel">
        <h2>Qué se detecta</h2>
        <ul className="check-list">
          <li><Check />Comercio y fecha del comprobante</li>
          <li><Check />Productos, cantidades y presentaciones</li>
          <li><Check />Precios listos para confirmar</li>
        </ul>
        {loading && <div className="progress-box" role="status" aria-live="polite"><strong>Analizando comprobante...</strong>{steps.map((item, index) => <span key={item} className={step > index ? 'done' : ''}>{item}</span>)}</div>}
        <button className="primary-action full" disabled={!selected || loading} onClick={start}>Analizar ticket</button>
      </div>
    </section>
  )
}

export function ScanResultPage({ context }: { context: { confirmedReceipt: Receipt | null; setConfirmedReceipt: (receipt: Receipt) => void } }) {
  const [message, setMessage] = useState('')
  const [receipt, setReceipt] = useState<Receipt>(demoReceipt)
  const [editingProductId, setEditingProductId] = useState<string | null>(null)
  const navigate = useNavigate()
  function updateItem(productId: string, patch: Partial<ReceiptItem>) {
    setReceipt((current) => {
      const items = current.items.map((item) => item.productId === productId ? { ...item, ...patch, totalPrice: patch.unitPrice !== undefined ? patch.unitPrice * item.quantity : item.totalPrice } : item)
      return { ...current, items, total: items.reduce((sum, item) => sum + item.totalPrice, 0) }
    })
  }
  function confirm() {
    context.setConfirmedReceipt(receipt)
    setMessage('Gracias. Estos precios ayudarán a mejorar las comparaciones de la comunidad.')
  }
  return (
    <section className="result-layout">
      <div className="section-heading"><div><p className="eyebrow">Resultado simulado</p><h1>Ticket convertido en precios</h1></div><button className="secondary-action" onClick={() => navigate('/escanear')}>Corregir</button></div>
      <div className="receipt-summary"><span><StoreName id={receipt.storeId} /></span><span>{receipt.dateLabel}</span><strong>{bs(receipt.total)}</strong></div>
      <div className="normalization-box"><span>Texto del ticket: “LECHE PIL ENT 1000ML”</span><ChevronRight aria-hidden="true" /><strong>Leche PIL Entera 1 L</strong></div>
      <div className="item-list">
        {receipt.items.map((item) => <article key={item.productId} className="line-item"><div><strong>{item.normalizedName}</strong><span>{item.presentation} · confianza {item.confidence}%{editingProductId === item.productId ? ' · en corrección' : ''}</span>{editingProductId === item.productId && <div className="edit-fields"><label>Nombre corregido<input value={item.normalizedName} onChange={(event) => updateItem(item.productId, { normalizedName: event.target.value })} /></label><label>Precio corregido<input aria-label={`Precio corregido ${item.normalizedName}`} type="number" step="0.1" value={item.unitPrice} onChange={(event) => updateItem(item.productId, { unitPrice: Number(event.target.value) })} /></label></div>}</div><b>{bs(item.totalPrice)}</b><button aria-label={`Corregir ${item.normalizedName}`} onClick={() => setEditingProductId(editingProductId === item.productId ? null : item.productId)}>{editingProductId === item.productId ? 'Listo' : 'Editar'}</button></article>)}
      </div>
      <button className="primary-action full" onClick={confirm}>Confirmar precios</button>
      {message && <p className="toast-message" role="status">{message}</p>}
    </section>
  )
}

export function BasketPage() {
  const [items, setItems] = useState<BasketItem[]>(weeklyBasket)
  const [strategy, setStrategy] = useState<StrategyId>('balanced')
  const [recommendation, setRecommendation] = useState<BasketRecommendation | null>(null)
  useEffect(() => { void compareBasket(items, strategy).then((result) => setRecommendation(result.recommendation)) }, [items, strategy])
  function adjust(productId: string, delta: number) {
    setItems((current) => current.map((item) => item.productId === productId ? { ...item, quantity: Math.max(1, item.quantity + delta) } : item))
  }
  return (
    <section className="basket-layout">
      <div className="content-panel">
        <p className="eyebrow">Mi canasta</p>
        <h1>Compra semanal</h1>
        <div className="item-list">
          {items.map((item) => <article key={item.productId} className="basket-row"><div><strong><ProductName id={item.productId} /></strong><span>Producto frecuente</span></div><div className="stepper"><button aria-label="Disminuir cantidad" onClick={() => adjust(item.productId, -1)}><Minus /></button><b>{item.quantity}</b><button aria-label="Aumentar cantidad" onClick={() => adjust(item.productId, 1)}><Plus /></button></div></article>)}
        </div>
      </div>
      <div className="content-panel recommendation">
        <div className="strategy-tabs" role="tablist" aria-label="Estrategia de compra">
          {(['savings', 'distance', 'balanced'] as StrategyId[]).map((id) => <button key={id} className={strategy === id ? 'active' : ''} onClick={() => setStrategy(id)}>{id === 'savings' ? 'Mayor ahorro' : id === 'distance' ? 'Menor distancia' : 'Equilibrio'}</button>)}
        </div>
        <button className="primary-action full" onClick={() => void compareBasket(items, strategy).then((result) => setRecommendation(result.recommendation))}>Encontrar mejor compra</button>
        {recommendation && <RecommendationView recommendation={recommendation} />}
      </div>
    </section>
  )
}

function RecommendationView({ recommendation }: { recommendation: BasketRecommendation }) {
  return (
    <div className="recommendation-card">
      <span>{recommendation.title}</span>
      <div className="money-grid"><HeroMoney label="Tu compra habitual" value={recommendation.usualTotal} /><HeroMoney label="Compra recomendada" value={recommendation.recommendedTotal} /></div>
      <HeroMoney label="Podrías ahorrar" value={recommendation.savings} />
      <p>Desplazamiento estimado: {distanceKm(recommendation.estimatedTravelKm)}. Es una estimación demostrativa basada en las tiendas seleccionadas.</p>
      {recommendation.stores.map((store) => <div key={store.storeId} className="store-plan"><strong><StoreName id={store.storeId} /></strong><span>{bs(store.subtotal)}</span><ul>{store.items.map((item) => <li key={item.productId}>{item.quantity}x <ProductName id={item.productId} /> · {bs(item.subtotal)}</li>)}</ul></div>)}
    </div>
  )
}

export function PricesPage() {
  const [selectedProduct, setSelectedProduct] = useState('arroz-5kg')
  const [sortMode, setSortMode] = useState<PriceSortMode>('price')
  const observations = sortPriceObservations(getProductPrices(selectedProduct), sortMode)
  return (
    <section className="prices-layout">
      <div className="content-panel">
        <p className="eyebrow">Explorar precios</p>
        <h1>Precios aportados por la comunidad</h1>
        <label className="search-box"><Search /><select aria-label="Seleccionar producto" value={selectedProduct} onChange={(event) => setSelectedProduct(event.target.value)}>{products.map((product) => <option key={product.id} value={product.id}>{product.name} {product.presentation}</option>)}</select></label>
        <div className="filter-row"><button className={sortMode === 'distance' ? 'active' : ''} onClick={() => setSortMode('distance')}><MapPin />Cerca de mí</button><button className={sortMode === 'freshness' ? 'active' : ''} onClick={() => setSortMode('freshness')}><Clock />Más reciente</button><button className={sortMode === 'price' ? 'active' : ''} onClick={() => setSortMode('price')}><SlidersHorizontal />Menor precio</button></div>
        <p className="hint">Los precios son aportados por la comunidad mediante comprobantes de compra.</p>
        <div className="item-list">{observations.map((item) => <Link key={`${item.storeId}-${item.price}`} className="price-row" to={`/precios/${item.productId}`}><div><strong><StoreName id={item.storeId} /></strong><span>{storeById.get(item.storeId)?.distanceKm.toLocaleString('es-BO')} km · {item.freshness}</span></div><b>{bs(item.price)}</b></Link>)}</div>
      </div>
      <div className="map-panel" aria-label="Mapa demostrativo de Santa Cruz"><span className="pin p1">{bs(observations[0]?.price ?? 0)}</span><span className="pin p2">{bs(observations[1]?.price ?? 0)}</span><span className="pin p3">{bs(observations[2]?.price ?? 0)}</span><strong>Santa Cruz de la Sierra</strong></div>
    </section>
  )
}

export function ProductPage() {
  const { productId = 'aceite-fino-900' } = useParams()
  const product = productById.get(productId) ?? products[1]
  const observations = getProductPrices(product.id)
  const history = getProductHistory(product.id).points
  const prices = observations.map((item) => item.price)
  const [alert, setAlert] = useState(false)
  if (prices.length === 0) return <section className="product-layout"><div className="content-panel"><h1>{product.name} {product.presentation}</h1><p className="hint">No hay suficientes precios demostrativos para este producto.</p></div></section>
  const min = Math.min(...prices)
  const max = Math.max(...prices)
  const avg = prices.reduce((sum, price) => sum + price, 0) / prices.length
  const variation = calculatePriceVariation(history)
  return (
    <section className="product-layout">
      <div className="content-panel">
        <p className="eyebrow">Detalle de producto</p>
        <h1>{product.name} {product.presentation}</h1>
        <div className="metric-grid"><HeroMoney label="Precio mínimo" value={min} /><HeroMoney label="Precio promedio" value={avg} /><HeroMoney label="Precio máximo" value={max} /><MetricValue label="Variación últimos 30 días" value={`${variation >= 0 ? 'Subió ' : 'Bajó '}${percent(variation)}`} tone={variation >= 0 ? 'warning' : 'positive'} /></div>
        <PriceChart points={history} />
        <button className={alert ? 'secondary-action selected full' : 'secondary-action full'} onClick={() => setAlert(true)}><Bell />{alert ? 'Alerta activada' : 'Avisarme cuando baje de Bs 15,00'}</button>
      </div>
      <div className="content-panel"><h2>Mejor precio cercano</h2>{observations.sort((a, b) => a.price - b.price).map((item) => <div key={item.storeId} className="price-row"><div><strong><StoreName id={item.storeId} /></strong><span>{storeById.get(item.storeId)?.distanceKm.toLocaleString('es-BO')} km · {item.freshness}</span></div><b>{bs(item.price)}</b></div>)}</div>
    </section>
  )
}

function PriceChart({ points }: { points: PriceHistoryPoint[] }) {
  const min = Math.min(...points.map((point) => point.price))
  const max = Math.max(...points.map((point) => point.price))
  const spread = Math.max(max - min, 1)
  const svgPoints = points.map((point, index) => `${(index / (points.length - 1)) * 100},${90 - ((point.price - min) / spread) * 70}`).join(' ')
  return <div className="chart"><svg viewBox="0 0 100 100" role="img" aria-label="Historial de precios de las últimas semanas"><polyline fill="none" stroke="currentColor" strokeWidth="4" points={svgPoints} /></svg><div>{points.map((point) => <span key={point.label}>{point.label}</span>)}</div></div>
}

export function ProfilePage({ confirmedReceipt }: { confirmedReceipt: Receipt | null }) {
  return (
    <section className="profile-layout">
      <div className="content-panel profile-card"><UserRound /><h1>{userProfile.name}</h1><p>{userProfile.location}</p><HeroMoney label="Ahorro estimado este mes" value={userProfile.monthlySavings} /><span>Plan actual: {userProfile.plan}</span><Link className="primary-action full" to="/mi-canastaai/plus">Conocer CanastaAI Plus</Link></div>
      <div className="content-panel"><h2>Compras recientes</h2><div className="item-list"><article className="line-item"><div><strong>Super Ahorro Equipetrol</strong><span>11 de agosto de 2026 · ticket demo</span></div><b>{bs(confirmedReceipt?.total ?? 128.8)}</b></article><article className="line-item"><div><strong>Mercado Norte</strong><span>8 de agosto de 2026 · 4 productos</span></div><b>{bs(73.4)}</b></article></div><h2>Alertas activas</h2><p className="hint">Aceite Fino 900 ml por debajo de Bs 15,00.</p></div>
    </section>
  )
}

export function PlusPage() {
  const [message, setMessage] = useState('')
  return (
    <section className="plus-layout">
      <div className="plus-hero"><p className="eyebrow">CanastaAI Plus</p><h1>Ahorro personal con más contexto.</h1><p>Canastas ilimitadas, alertas avanzadas y seguimiento completo de precios. Precio demostrativo: <strong>Bs 14,90 / mes</strong>.</p></div>
      <div className="plan-grid">
        <Plan title="CanastaAI Gratis" items={['Escanear tickets', 'Consultar precios', 'Comparación básica', 'Una canasta', 'Mapa de precios']} />
        <Plan title="CanastaAI Plus" featured items={['Todo lo incluido en Gratis', 'Canastas ilimitadas', 'Alertas avanzadas', 'Historial completo', 'Optimización de compras', 'Estadísticas personales']} />
      </div>
      <div className="premium-preview"><Sparkles /><div><h2>¿Es buen momento para comprar?</h2><p><strong>Aceite Fino 900 ml:</strong> precio actual Bs 18,20. Promedio 30 días Bs 16,70. El precio actual está por encima de su promedio reciente.</p><p><strong>Arroz 5 kg:</strong> buen momento de compra en Mercado Norte.</p></div></div>
      <button className="primary-action full" onClick={() => setMessage('Función demostrativa del prototipo.')}>Probar Plus</button>
      {message && <p className="toast-message" role="status">{message}</p>}
    </section>
  )
}

function Plan({ title, items, featured = false }: { title: string; items: string[]; featured?: boolean }) {
  return <article className={featured ? 'plan featured-plan' : 'plan'}><h2>{title}</h2><ul>{items.map((item) => <li key={item}><Check />{item}</li>)}</ul>{featured && <strong>Bs 14,90 / mes</strong>}</article>
}
