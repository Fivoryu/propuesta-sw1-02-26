import { lazy, Suspense, useEffect, useMemo, useRef, useState, type ChangeEvent } from 'react'
import { zodResolver } from '@hookform/resolvers/zod'
import { useForm, useWatch } from 'react-hook-form'
import { Link, useNavigate, useParams } from 'react-router-dom'
import {
  ArrowLeft,
  ArrowRight,
  CalendarDays,
  Camera,
  Check,
  CheckCircle2,
  CircleAlert,
  FileImage,
  Filter,
  HeartHandshake,
  ImagePlus,
  MapPinned,
  MessageCircle,
  PencilLine,
  RefreshCw,
  Search,
  ShieldAlert,
  Sparkles,
  Trash2,
  Upload,
  X,
} from 'lucide-react'
import { Badge, Button, Card, CardBody, CardHeader, CardTitle, EmptyState, Field, Input, Select, StatusBanner, Textarea, useToast } from '@propuestas/ui'
import { santaCruzLocations } from '@propuestas/shared'
import {
  MATCH_SCORE_DISCLAIMER,
  getPetCasePath,
  getPetLocation,
  getPetScoreLabel,
  isProfileComplete,
  petCaseLabels,
  petConfidenceLabels,
  petNearbyReports,
  petPhotoFixtures,
  petProfileSchema,
  petScenarioOptions,
  petSizeLabels,
  petSizeOptions,
  photoSlotDefinitions,
  type PetCandidate,
  type PetCaseType,
  type PetMatchResult,
  type PetPhoto,
  type PetPhotoSlotId,
  type PetProfileFormValues,
} from '../domain/pet'
import { findPetMatches } from '../services/mock/find-pet-matches'
import { hasCompletePetProfile, isPetDraftNonEmpty, usePetStore } from '../state/pet-store'
import {
  actionLinkClass,
  BackLink,
  CandidateMeta,
  CancelDialog,
  DemoNotice,
  FlowSteps,
  MatchScore,
  MotionReveal,
  PageIntro,
  PetShell,
  PhotoPreview,
  ProfileFacts,
  RecoveryPanel,
  SafetyBoundary,
  StatusMark,
} from './ui'

const PetMap = lazy(() => import('./pet-map'))

export function HomePage() {
  const navigate = useNavigate()
  const featured = petNearbyReports[0]

  return (
    <PetShell>
      <section className="grid gap-10 pb-10 pt-8 md:grid-cols-[minmax(0,1.04fr)_minmax(20rem,0.96fr)] md:items-end md:gap-16 md:pb-16 md:pt-16">
        <MotionReveal>
          <div className="max-w-3xl">
            <span className="eyebrow">Santa Cruz de la Sierra / red local</span>
            <h1 className="mt-6 max-w-3xl font-display text-[clamp(3rem,7vw,6.4rem)] font-bold leading-[0.91] tracking-[-0.075em] text-ink">Volver a encontrarse empieza con una ficha clara.</h1>
            <p className="mt-7 max-w-xl text-base leading-7 text-muted md:text-lg">Ordená los datos visibles de un perro perdido o encontrado, revisá avisos cercanos y decidí el siguiente paso sin apuro.</p>
            <div className="mt-8 flex flex-col gap-3 sm:flex-row sm:flex-wrap sm:items-center">
              <Button size="lg" trailingIcon={<ArrowRight aria-hidden="true" className="h-4 w-4" strokeWidth={1.6} />} onClick={() => navigate('/reportar/perdida')}>Perdí mi mascota</Button>
              <Link className={`${actionLinkClass} bg-surface text-primary ring-1 ring-inset ring-primary/20 hover:-translate-y-0.5 hover:bg-primary/[0.06]`} to="/reportar/encontrada">
                <HeartHandshake aria-hidden="true" className="h-4 w-4" strokeWidth={1.6} />
                Encontré una mascota
              </Link>
            </div>
          </div>
        </MotionReveal>
        <MotionReveal className="md:justify-self-end" delay={0.1}>
          <div className="bezel w-full max-w-md">
            <div className="bezel-core overflow-hidden p-2">
              <div className="relative min-h-[25rem] overflow-hidden rounded-[calc(2rem-0.75rem)] bg-[#d9f1e9] p-5 sm:p-7">
                <div className="absolute -right-16 -top-14 h-56 w-56 rounded-full bg-[#f18f6a]/40" aria-hidden="true" />
                <div className="absolute -bottom-28 -left-16 h-72 w-72 rounded-full bg-[#0e7c66]/20" aria-hidden="true" />
                <div className="relative flex min-h-[22rem] flex-col justify-between">
                  <div className="flex items-center justify-between gap-4">
                    <span className="inline-flex items-center gap-2 rounded-full bg-white/75 px-3 py-2 text-xs font-semibold text-[#17332d]"><Sparkles aria-hidden="true" className="h-4 w-4 text-[#0e7c66]" strokeWidth={1.6} />Cuidado, no alarma</span>
                    <span className="rounded-full bg-[#17332d] px-3 py-2 text-xs font-semibold text-white">Ficha 01</span>
                  </div>
                  <div className="mx-auto w-full max-w-[17rem] overflow-hidden rounded-[1.75rem] bg-white/65 p-2 shadow-quiet">
                    <img className="aspect-[4/3] w-full rounded-[1.35rem] object-cover" src={featured.photo.src} alt={featured.photo.alt} />
                  </div>
                  <div>
                    <p className="text-[0.68rem] font-semibold uppercase tracking-[0.18em] text-[#3c6659]">Aviso cercano ficticio</p>
                    <p className="mt-2 font-display text-2xl font-bold tracking-[-0.04em] text-[#17332d]">Una señal para revisar juntos</p>
                    <p className="mt-2 text-sm font-semibold text-[#3c6659]">{featured.approximateLocation.label} · sin dirección exacta</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </MotionReveal>
      </section>

      <MotionReveal delay={0.12}>
        <div className="grid gap-3 sm:grid-cols-3">
          <Metric label="Avisos locales" value="04" tone="primary" />
          <Metric label="Zonas aproximadas" value="05" tone="accent" />
          <Metric label="Contactos reales" value="00" tone="neutral" />
        </div>
      </MotionReveal>

      <section className="py-16 md:py-24" aria-labelledby="nearby-home-heading">
        <div className="flex flex-col gap-6 md:flex-row md:items-end md:justify-between">
          <div>
            <span className="eyebrow">Cerca de vos</span>
            <h2 className="mt-4 font-display text-3xl font-bold tracking-[-0.05em] text-ink md:text-4xl" id="nearby-home-heading">Avisos que merecen una mirada tranquila.</h2>
            <p className="mt-3 max-w-xl text-sm leading-6 text-muted">Usamos áreas ficticias de Santa Cruz para mostrar cómo podría ordenarse una búsqueda local.</p>
          </div>
          <Link className={`${actionLinkClass} bg-surface text-primary ring-1 ring-inset ring-primary/20 hover:bg-primary/[0.06]`} to="/cerca"><MapPinned aria-hidden="true" className="h-4 w-4" strokeWidth={1.6} />Ver mapa y filtros</Link>
        </div>
        <div className="mt-8 grid gap-5 md:grid-cols-3">
          {petNearbyReports.slice(0, 3).map((report, index) => <PetReportCard key={report.id} report={report} delay={index * 0.05} />)}
        </div>
      </section>

      <section className="grid gap-6 pb-16 lg:grid-cols-[minmax(0,1.08fr)_minmax(18rem,0.92fr)] lg:items-stretch md:pb-24">
        <MotionReveal>
          <div className="bezel h-full">
            <div className="bezel-core h-full overflow-hidden p-2 sm:p-3">
              <Suspense fallback={<div className="flex h-[min(62vh,560px)] min-h-[340px] items-center justify-center rounded-[1.7rem] bg-[#dcece5] text-sm font-semibold text-primary" role="status">Cargando mapa local...</div>}>
                <PetMap reports={petNearbyReports} />
              </Suspense>
            </div>
          </div>
        </MotionReveal>
        <MotionReveal delay={0.08}>
          <div className="flex h-full flex-col justify-between rounded-[1.7rem] bg-[#17332d] p-6 text-[#eefaf4] sm:p-8">
            <div>
              <span className="rounded-full bg-white/10 px-3 py-1.5 text-[0.68rem] font-semibold uppercase tracking-[0.18em] text-[#bfe3d3]">Vista local</span>
              <h2 className="mt-8 max-w-sm font-display text-3xl font-bold leading-tight tracking-[-0.05em]">Información cercana, sin inventar certezas.</h2>
              <p className="mt-4 max-w-sm text-sm leading-6 text-[#c3d9d0]">Los puntos son ilustrativos y la lista queda disponible si la conexión no alcanza para cargar el mapa.</p>
            </div>
            <div className="mt-10 border-t border-white/15 pt-5">
              <p className="text-[0.68rem] font-semibold uppercase tracking-[0.16em] text-[#9ccbb9]">Próximo paso</p>
              <p className="mt-2 text-sm leading-6 text-[#d2e6dc]">¿Ya hiciste una búsqueda? Podés volver a completar datos y actualizarla.</p>
              <Link className="mt-5 inline-flex min-h-11 items-center gap-2 rounded-full bg-[#f1a27c] px-4 py-2 text-sm font-semibold text-[#17332d] transition-[background-color,transform] duration-280 ease-spring hover:-translate-y-0.5 hover:bg-[#f6b093]" to="/reportar/perdida">Actualizar una búsqueda <ArrowRight aria-hidden="true" className="h-4 w-4" strokeWidth={1.6} /></Link>
            </div>
          </div>
        </MotionReveal>
      </section>

      <div className="grid gap-5 md:grid-cols-2">
        <DemoNotice>Esta demostración usa datos simulados. No se identifica una mascota, no se envían avisos y no se consultan servicios externos.</DemoNotice>
        <SafetyBoundary>Protegé tu ubicación y encontrate en un lugar seguro si alguna vez avanzás fuera de esta demo. Acá no se muestran teléfonos, correos ni direcciones privadas.</SafetyBoundary>
      </div>
    </PetShell>
  )
}

function Metric({ label, value, tone }: { label: string; value: string; tone: 'primary' | 'accent' | 'neutral' }) {
  const styles = { primary: 'bg-primary text-white', accent: 'bg-accent text-ink', neutral: 'bg-surface text-ink ring-1 ring-inset ring-line/70' }
  return <div className={`min-w-0 rounded-[1.5rem] p-4 sm:p-5 ${styles[tone]}`}><p className="text-[0.68rem] font-semibold uppercase leading-4 tracking-[0.14em] opacity-75">{label}</p><p className="mt-4 font-display text-3xl font-bold tracking-[-0.06em] sm:text-4xl">{value}</p></div>
}

export function NearbyPage() {
  const [caseFilter, setCaseFilter] = useState<PetCaseType | 'all'>('all')
  const [distanceFilter, setDistanceFilter] = useState<'all' | 'under-1' | 'under-3' | 'under-6'>('all')
  const [dateFilter, setDateFilter] = useState<'all' | 'recent' | 'older'>('all')
  const [sizeFilter, setSizeFilter] = useState<'all' | 'small' | 'medium' | 'large'>('all')
  const [colorFilter, setColorFilter] = useState<'all' | 'black' | 'white' | 'brown' | 'golden'>('all')

  const filteredReports = useMemo(() => petNearbyReports.filter((report) => {
    const caseMatches = caseFilter === 'all' || report.caseType === caseFilter
    const distanceMatches = distanceFilter === 'all' || (distanceFilter === 'under-1' ? report.distanceKm <= 1 : distanceFilter === 'under-3' ? report.distanceKm <= 3 : report.distanceKm <= 6)
    const ageInDays = report.id === 'pet-nearby-luna' ? 2 : report.id === 'pet-nearby-bruno' ? 4 : report.id === 'pet-nearby-nube' ? 5 : 11
    const dateMatches = dateFilter === 'all' || (dateFilter === 'recent' ? ageInDays <= 7 : ageInDays > 7)
    const sizeMatches = sizeFilter === 'all' || report.size === sizeFilter
    const normalizedColors = report.colors.toLowerCase()
    const colorMatches = colorFilter === 'all' || normalizedColors.includes(colorFilter === 'black' ? 'negro' : colorFilter === 'white' ? 'blanco' : colorFilter === 'brown' ? 'marrón' : 'dorado')
    return caseMatches && distanceMatches && dateMatches && sizeMatches && colorMatches
  }), [caseFilter, colorFilter, dateFilter, distanceFilter, sizeFilter])

  function resetFilters() {
    setCaseFilter('all')
    setDistanceFilter('all')
    setDateFilter('all')
    setSizeFilter('all')
    setColorFilter('all')
  }

  return (
    <PetShell>
      <PageIntro eyebrow="Explorar avisos" title="Mirá qué sucede cerca, sin perder el contexto." description="Filtrá avisos ficticios por zona, antigüedad, tamaño y color. Las ubicaciones son referencias aproximadas, no direcciones verificadas." />
      <div className="mb-8"><FlowSteps current={4} /></div>
      <div className="bezel">
        <div className="bezel-core p-2 sm:p-3">
          <Suspense fallback={<div className="flex h-[min(62vh,560px)] min-h-[340px] items-center justify-center rounded-[1.7rem] bg-[#dcece5] text-sm font-semibold text-primary" role="status">Cargando mapa local...</div>}>
            <PetMap reports={filteredReports} />
          </Suspense>
        </div>
      </div>
      <section className="py-12 md:py-20" aria-labelledby="filters-heading">
        <div className="flex flex-col gap-3 md:flex-row md:items-end md:justify-between">
          <div><span className="eyebrow">Filtros de la lista</span><h2 className="mt-4 font-display text-3xl font-bold tracking-[-0.05em] text-ink" id="filters-heading">Encontrá una vista útil.</h2></div>
          <p className="flex items-center gap-2 text-sm font-semibold text-primary"><Filter aria-hidden="true" className="h-4 w-4" strokeWidth={1.6} />{filteredReports.length} avisos visibles</p>
        </div>
        <div className="mt-7 grid gap-4 rounded-[1.7rem] bg-surface p-4 ring-1 ring-inset ring-line/60 sm:grid-cols-2 lg:grid-cols-5 sm:p-5">
          <Field htmlFor="nearby-case" label="Tipo de aviso"><Select id="nearby-case" value={caseFilter} onChange={(event) => setCaseFilter(event.target.value as PetCaseType | 'all')}><option value="all">Todos</option><option value="lost">Perdidas</option><option value="found">Encontradas</option></Select></Field>
          <Field htmlFor="nearby-distance" label="Distancia"><Select id="nearby-distance" value={distanceFilter} onChange={(event) => setDistanceFilter(event.target.value as typeof distanceFilter)}><option value="all">Cualquier distancia</option><option value="under-1">Hasta 1 km</option><option value="under-3">Hasta 3 km</option><option value="under-6">Hasta 6 km</option></Select></Field>
          <Field htmlFor="nearby-date" label="Fecha"><Select id="nearby-date" value={dateFilter} onChange={(event) => setDateFilter(event.target.value as typeof dateFilter)}><option value="all">Cualquier fecha</option><option value="recent">Últimos 7 días</option><option value="older">Más antiguos</option></Select></Field>
          <Field htmlFor="nearby-size" label="Tamaño"><Select id="nearby-size" value={sizeFilter} onChange={(event) => setSizeFilter(event.target.value as typeof sizeFilter)}><option value="all">Todos los tamaños</option>{petSizeOptions.map((option) => <option key={option.value} value={option.value}>{option.label}</option>)}</Select></Field>
          <Field htmlFor="nearby-color" label="Color"><Select id="nearby-color" value={colorFilter} onChange={(event) => setColorFilter(event.target.value as typeof colorFilter)}><option value="all">Todos los colores</option><option value="black">Negro</option><option value="white">Blanco</option><option value="brown">Marrón</option><option value="golden">Dorado</option></Select></Field>
        </div>
        {filteredReports.length ? <div className="mt-7 grid gap-5 md:grid-cols-2 xl:grid-cols-4">{filteredReports.map((report, index) => <PetReportCard key={report.id} report={report} delay={index * 0.04} />)}</div> : <div className="mt-7"><EmptyState title="No encontramos avisos con estos filtros" icon={<Search aria-hidden="true" className="h-5 w-5" strokeWidth={1.6} />} action={<div className="flex flex-wrap justify-center gap-3"><Button variant="secondary" onClick={resetFilters}>Limpiar filtros</Button><Link className={`${actionLinkClass} bg-primary text-white hover:-translate-y-0.5 hover:bg-primary/90`} to="/reportar/perdida">Crear un aviso local</Link></div>}>Probá otra combinación o agregá un perfil ficticio a esta demostración. Que no aparezca un aviso no significa que una mascota esté lejos.</EmptyState></div>}
      </section>
      <DemoNotice>Las zonas, fechas, distancias y avisos son ficticios. La vista textual sigue disponible si OpenStreetMap no carga.</DemoNotice>
    </PetShell>
  )
}

function PetReportCard({ report, delay = 0 }: { report: PetCandidate; delay?: number }) {
  return (
    <MotionReveal delay={delay}>
      <Link className="focus-ring group block h-full rounded-[1.7rem]" to={`/coincidencias/${report.id}`}>
        <Card className="h-full transition-[background-color,box-shadow,transform] duration-280 ease-spring group-hover:-translate-y-1 group-hover:shadow-quiet" bezel>
          <CardBody className="p-2">
            <div className="relative aspect-[4/3] overflow-hidden rounded-[1.35rem] bg-[#d9f1e9]"><img className="h-full w-full object-cover transition-transform duration-700 ease-spring group-hover:scale-[1.03]" src={report.photo.src} alt={report.photo.alt} loading="lazy" /><span className="absolute left-3 top-3 rounded-full bg-white/90 px-3 py-1.5 text-xs font-semibold text-primary">{petCaseLabels[report.caseType]}</span></div>
          </CardBody>
          <CardHeader className="gap-3"><div className="flex items-start justify-between gap-3"><CardTitle className="text-xl">{report.name}</CardTitle><span className="text-xs font-semibold text-muted">{report.distanceKm.toFixed(1)} km</span></div><p className="text-sm leading-6 text-muted">{report.colors}. {report.traits}</p></CardHeader>
          <CardBody className="flex h-[calc(100%-15rem)] flex-col justify-end gap-4"><p className="flex items-center gap-2 text-sm text-muted"><MapPinned aria-hidden="true" className="h-4 w-4 shrink-0 text-primary" strokeWidth={1.6} />{report.approximateLocation.label}</p><div className="flex items-center justify-between gap-3 border-t border-line/70 pt-4 text-xs font-semibold text-muted"><span>{report.reportedAt}</span><span className="text-primary transition-transform duration-280 ease-spring group-hover:translate-x-1">Ver aviso <ArrowRight aria-hidden="true" className="inline h-3.5 w-3.5" strokeWidth={1.6} /></span></div></CardBody>
        </Card>
      </Link>
    </MotionReveal>
  )
}

export function PetProfilePage({ caseType }: { caseType: PetCaseType }) {
  const navigate = useNavigate()
  const draft = usePetStore((state) => state.draft)
  const photos = usePetStore((state) => state.photos)
  const setDraft = usePetStore((state) => state.setDraft)
  const resetFlow = usePetStore((state) => state.resetFlow)
  const [cancelOpen, setCancelOpen] = useState(false)

  const {
    control,
    register,
    handleSubmit,
    formState: { errors, isDirty },
  } = useForm<PetProfileFormValues>({
    resolver: zodResolver(petProfileSchema),
    mode: 'onBlur',
    defaultValues: {
      name: draft.name,
      description: draft.description,
      species: 'dog',
      size: draft.size,
      colors: draft.colors,
      traits: draft.traits,
      approximateLocationId: draft.approximateLocationId,
      reportedAt: draft.reportedAt,
    },
  })
  const description = useWatch({ control, name: 'description' }) ?? ''

  useEffect(() => {
    if (draft.caseType !== caseType) setDraft({ caseType })
  }, [caseType, draft.caseType, setDraft])

  function onValid(values: PetProfileFormValues) {
    setDraft({
      ...values,
      caseType,
      name: values.name ?? '',
      species: 'dog',
    })
    navigate('/fotos')
  }

  function handleCancelRequest() {
    if (isDirty || isPetDraftNonEmpty(draft, photos)) {
      setCancelOpen(true)
      return
    }
    resetFlow()
    navigate('/')
  }

  return (
    <PetShell>
      <PageIntro eyebrow={`Paso 1 / ${caseType === 'lost' ? 'aviso de pérdida' : 'aviso de encuentro'}`} title={caseType === 'lost' ? 'Contanos cómo es tu perro.' : 'Contanos qué perro encontraste.'} description="Armá una ficha breve con información visible y una zona aproximada. Podés usar un nombre ficticio; no necesitamos datos personales." />
      <div className="mb-8"><FlowSteps current={1} /></div>
      <form className="grid gap-6 pb-16 lg:grid-cols-[minmax(0,1fr)_minmax(20rem,0.72fr)] lg:items-start lg:gap-10" noValidate onSubmit={handleSubmit(onValid)}>
        <MotionReveal>
          <div className="bezel">
            <div className="bezel-core space-y-8 p-5 sm:p-8">
              <div className="flex items-start justify-between gap-4"><div><span className="eyebrow">Perfil básico</span><h2 className="mt-4 font-display text-2xl font-bold tracking-[-0.04em] text-ink">Datos que sí podés revisar</h2></div><span className="hidden rounded-full bg-primary/[0.08] p-3 text-primary sm:inline-flex"><HeartHandshake aria-hidden="true" className="h-5 w-5" strokeWidth={1.6} /></span></div>
              {Object.keys(errors).length ? <StatusBanner title="Revisá los campos marcados" variant="error">Cada mensaje aparece junto al dato que necesita una corrección antes de continuar.</StatusBanner> : null}
              <Field htmlFor="pet-name" label="Nombre o identificador" hint="Opcional. Usá un nombre ficticio o una inicial; no compartas datos de una persona.">
                <Input id="pet-name" placeholder="Ejemplo: Luna" autoComplete="off" {...register('name')} />
              </Field>
              <Field htmlFor="pet-description" label="Descripción breve" required error={errors.description?.message} hint={`${description.length}/320 caracteres. Contá qué ayuda a reconocerlo sin exponer datos privados.`}>
                <Textarea id="pet-description" placeholder="Ejemplo: perro mediano, tranquilo, con pecho blanco..." {...register('description')} />
              </Field>
              <Field htmlFor="pet-species-display" label="Especie" required hint="La primera versión de la demostración trabaja únicamente con perros.">
                <input type="hidden" value="dog" {...register('species')} />
                <Select id="pet-species-display" value="dog" disabled aria-describedby="pet-species-display-message"><option value="dog">Perro</option></Select>
              </Field>
              <Field htmlFor="pet-size" label="Tamaño aproximado" required error={errors.size?.message}>
                <Select id="pet-size" {...register('size')}><option value="">Elegí un tamaño</option>{petSizeOptions.map((option) => <option key={option.value} value={option.value}>{option.label}</option>)}</Select>
              </Field>
              <div className="grid gap-6 sm:grid-cols-2">
                <Field htmlFor="pet-colors" label="Colores visibles" required error={errors.colors?.message} hint="Separalos con comas.">
                  <Input id="pet-colors" placeholder="Negro y blanco" {...register('colors')} />
                </Field>
                <Field htmlFor="pet-traits" label="Rasgos distintivos" required error={errors.traits?.message} hint="Manchas, orejas, collar o cola.">
                  <Input id="pet-traits" placeholder="Mancha blanca en el hocico" {...register('traits')} />
                </Field>
              </div>
              <div className="grid gap-6 sm:grid-cols-2">
                <Field htmlFor="pet-location" label="Zona aproximada" required error={errors.approximateLocationId?.message} hint="No uses una dirección exacta.">
                  <Select id="pet-location" {...register('approximateLocationId')}><option value="">Elegí una zona</option>{santaCruzLocations.map((location) => <option key={location.areaId} value={location.areaId}>{location.label}</option>)}</Select>
                </Field>
                <Field htmlFor="pet-date" label="Fecha aproximada" required error={errors.reportedAt?.message} hint="Podés corregirla después.">
                  <div className="relative"><CalendarDays aria-hidden="true" className="pointer-events-none absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-primary" strokeWidth={1.6} /><Input className="pl-11" id="pet-date" type="date" {...register('reportedAt')} /></div>
                </Field>
              </div>
            </div>
          </div>
        </MotionReveal>
        <MotionReveal delay={0.08}>
          <div className="space-y-6 lg:sticky lg:top-6">
            <SafetyBoundary>La ficha queda solo en tu navegador durante esta demostración. No se publica, no se envían notificaciones y no se intercambian contactos reales.</SafetyBoundary>
            <div className="bezel">
              <div className="bezel-core p-5 sm:p-7">
                <div className="flex items-start justify-between gap-4"><div><span className="eyebrow">Antes de las fotos</span><h2 className="mt-4 font-display text-2xl font-bold tracking-[-0.04em] text-ink">Una ficha clara ayuda a comparar</h2></div><FileImage aria-hidden="true" className="h-6 w-6 text-primary" strokeWidth={1.6} /></div>
                <p className="mt-4 text-sm leading-6 text-muted">En el siguiente paso podés elegir ilustraciones locales o cargar varias fotos desde tu dispositivo.</p>
                <ul className="mt-5 space-y-3 text-sm leading-6 text-muted"><li className="flex gap-2"><Check aria-hidden="true" className="mt-1 h-4 w-4 shrink-0 text-primary" strokeWidth={1.6} />Una vista frontal del rostro</li><li className="flex gap-2"><Check aria-hidden="true" className="mt-1 h-4 w-4 shrink-0 text-primary" strokeWidth={1.6} />Un perfil para ver orejas y hocico</li><li className="flex gap-2"><Check aria-hidden="true" className="mt-1 h-4 w-4 shrink-0 text-primary" strokeWidth={1.6} />Una vista de cuerpo completo</li></ul>
              </div>
            </div>
            <div className="flex flex-col-reverse gap-3 sm:flex-row sm:justify-between"><Button type="button" variant="ghost" leadingIcon={<ArrowLeft aria-hidden="true" className="h-4 w-4" strokeWidth={1.6} />} onClick={handleCancelRequest}>Cancelar</Button><Button type="submit" size="lg" trailingIcon={<ArrowRight aria-hidden="true" className="h-4 w-4" strokeWidth={1.6} />}>Continuar con fotos</Button></div>
          </div>
        </MotionReveal>
      </form>
      <CancelDialog open={cancelOpen} onKeepEditing={() => setCancelOpen(false)} onDiscard={() => { setCancelOpen(false); resetFlow(); navigate('/') }} />
    </PetShell>
  )
}

export function PetPhotosPage() {
  const navigate = useNavigate()
  const draft = usePetStore((state) => state.draft)
  const photos = usePetStore((state) => state.photos)
  const setPhoto = usePetStore((state) => state.setPhoto)
  const removePhoto = usePetStore((state) => state.removePhoto)
  const [fileError, setFileError] = useState('')
  const [uploadMessage, setUploadMessage] = useState('')
  const [uploadSlot, setUploadSlot] = useState<PetPhotoSlotId | null>(null)
  const inputRef = useRef<HTMLInputElement>(null)

  if (!hasCompletePetProfile(draft)) {
    return <RecoveryPanel title="Primero completá el perfil" description="Las fotos necesitan una ficha básica para poder revisarse en el resumen local."><Link className={`${actionLinkClass} bg-primary text-white hover:-translate-y-0.5 hover:bg-primary/90`} to={getPetCasePath(draft.caseType)}>Ir al perfil</Link></RecoveryPanel>
  }

  function openUpload(slot: PetPhotoSlotId | null = null) {
    setUploadSlot(slot)
    setFileError('')
    setUploadMessage('')
    inputRef.current?.click()
  }

  function handleFiles(event: ChangeEvent<HTMLInputElement>) {
    const files = Array.from(event.target.files ?? [])
    event.target.value = ''
    if (!files.length) return
    const availableSlots = photoSlotDefinitions.map((slot) => slot.id).filter((slot) => slot === uploadSlot || !photos.some((photo) => photo.slot === slot))
    let added = 0
    for (const file of files) {
      if (!file.type.startsWith('image/')) {
        setFileError('Elegí archivos de imagen para generar una vista previa local.')
        continue
      }
      const slot = availableSlots[added]
      if (!slot) break
      const source = URL.createObjectURL(file)
      setPhoto({ slot, src: source, kind: 'upload', label: file.name, alt: `Vista previa local de ${file.name}` })
      added += 1
    }
    if (added) setUploadMessage(`${added} ${added === 1 ? 'foto agregada' : 'fotos agregadas'} como vista previa local.`)
    if (files.length > added && availableSlots.length <= added) setFileError('Las tres ranuras ya tienen una imagen. Quitá una para volver a cargar otra.')
  }

  function chooseFixture(fixture: PetPhoto) {
    setPhoto({ ...fixture })
    setFileError('')
    setUploadMessage(`Usaste la ilustración local para la vista ${fixture.slot === 'front' ? 'frontal' : fixture.slot === 'profile' ? 'de perfil' : 'de cuerpo completo'}.`)
  }

  return (
    <PetShell>
      <PageIntro eyebrow="Paso 2 / fotos locales" title="Mostrá tres ángulos, sin subirlos a ningún servidor." description="Elegí ilustraciones de la demo o cargá varias fotos desde tu dispositivo. Las vistas se crean y permanecen localmente en esta sesión." />
      <div className="mb-8"><FlowSteps current={2} /></div>
      <div className="grid gap-6 pb-16 lg:grid-cols-[minmax(0,1fr)_minmax(19rem,0.72fr)] lg:items-start lg:gap-10">
        <MotionReveal>
          <div className="bezel">
            <div className="bezel-core p-5 sm:p-8">
              <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between"><div><span className="eyebrow">Guía de captura</span><h2 className="mt-4 font-display text-3xl font-bold tracking-[-0.05em] text-ink">Frontal, perfil y cuerpo completo</h2></div><Badge variant={photos.length === 3 ? 'success' : 'accent'}>{photos.length}/3 listas</Badge></div>
              <p className="mt-4 max-w-2xl text-sm leading-6 text-muted">Una foto clara ayuda a describir manchas y proporciones. No hace falta que sea perfecta para recorrer el prototipo.</p>
              <div className="mt-7 grid gap-4 md:grid-cols-3">
                {photoSlotDefinitions.map((slot) => {
                  const photo = photos.find((item) => item.slot === slot.id)
                  return <PhotoSlotCard key={slot.id} slot={slot} photo={photo} onUpload={() => openUpload(slot.id)} onRemove={() => removePhoto(slot.id)} onRetry={() => openUpload(slot.id)} />
                })}
              </div>
              <input ref={inputRef} className="sr-only" type="file" accept="image/*" multiple onChange={handleFiles} aria-label="Cargar fotos locales" />
              <div className="mt-6 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between"><Button variant="secondary" leadingIcon={<Upload aria-hidden="true" className="h-4 w-4" strokeWidth={1.6} />} onClick={() => openUpload(null)}>Agregar varias fotos</Button><p className="text-xs leading-5 text-muted">{uploadSlot ? `Cargando en la ranura ${uploadSlot === 'front' ? 'frontal' : uploadSlot === 'profile' ? 'de perfil' : 'de cuerpo completo'}.` : 'Las fotos nuevas ocupan la primera ranura libre.'}</p></div>
              {fileError ? <p className="mt-4 text-sm font-medium text-error" role="alert">{fileError}</p> : null}
              {uploadMessage ? <p className="mt-4 text-sm font-medium text-success" role="status" aria-live="polite">{uploadMessage}</p> : null}
            </div>
          </div>
        </MotionReveal>
        <MotionReveal delay={0.08}>
          <div className="space-y-6 lg:sticky lg:top-6">
            <div className="bezel">
              <div className="bezel-core p-5 sm:p-7">
                <div className="flex items-start justify-between gap-4"><div><span className="eyebrow">Funciona sin conexión</span><h2 className="mt-4 font-display text-2xl font-bold tracking-[-0.04em] text-ink">Ilustraciones locales</h2></div><Camera aria-hidden="true" className="h-6 w-6 text-primary" strokeWidth={1.6} /></div>
                <p className="mt-3 text-sm leading-6 text-muted">Probá el flujo completo sin depender de imágenes externas.</p>
                <div className="mt-5 space-y-3">{petPhotoFixtures.map((fixture) => <button className="focus-ring group flex min-h-16 w-full items-center gap-3 rounded-2xl bg-paper p-2 text-left ring-1 ring-inset ring-line/70 transition-[background-color,transform,box-shadow] duration-280 ease-spring hover:-translate-y-0.5 hover:bg-primary/[0.04]" key={fixture.fixtureId} type="button" onClick={() => chooseFixture(fixture)}><img className="h-12 w-16 rounded-xl object-cover" src={fixture.src} alt={fixture.alt} /><span className="min-w-0 flex-1"><span className="block text-sm font-semibold text-ink">Usar {fixture.label.toLowerCase()}</span><span className="mt-1 block text-xs text-muted">Ilustración local sin conexión</span></span><ImagePlus aria-hidden="true" className="h-4 w-4 shrink-0 text-primary" strokeWidth={1.6} /></button>)}</div>
              </div>
            </div>
            <DemoNotice>La vista previa usa URL locales del navegador. No se guarda en una cuenta ni se envía fuera de esta demostración.</DemoNotice>
            <div className="flex flex-col-reverse gap-3 sm:flex-row sm:justify-between"><Link className={`${actionLinkClass} text-primary hover:bg-primary/[0.08]`} to={getPetCasePath(draft.caseType)}><ArrowLeft aria-hidden="true" className="h-4 w-4" strokeWidth={1.6} />Editar perfil</Link><Button size="lg" disabled={!photos.length} trailingIcon={<ArrowRight aria-hidden="true" className="h-4 w-4" strokeWidth={1.6} />} onClick={() => navigate('/resumen')}>Revisar resumen</Button></div>
            {!photos.length ? <p className="text-center text-sm font-semibold text-warning">Agregá al menos una foto o ilustración para continuar.</p> : null}
          </div>
        </MotionReveal>
      </div>
    </PetShell>
  )
}

function PhotoSlotCard({ slot, photo, onUpload, onRemove, onRetry }: { slot: typeof photoSlotDefinitions[number]; photo?: PetPhoto; onUpload: () => void; onRemove: () => void; onRetry: () => void }) {
  return (
    <div className="rounded-[1.45rem] bg-paper p-2 ring-1 ring-inset ring-line/70">
      <div className="relative aspect-[4/3] overflow-hidden rounded-[1.1rem] bg-[#d9f1e9]">
        {photo ? <PhotoPreview photo={photo} /> : <div className="flex h-full flex-col items-center justify-center gap-3 p-4 text-center text-muted"><span className="inline-flex h-12 w-12 items-center justify-center rounded-full bg-surface text-primary ring-1 ring-inset ring-primary/15"><ImagePlus aria-hidden="true" className="h-5 w-5" strokeWidth={1.6} /></span><p className="text-sm font-semibold">Sin foto todavía</p></div>}
        {photo ? <span className="absolute left-3 top-3 rounded-full bg-[#17332d]/90 px-2.5 py-1.5 text-[0.68rem] font-semibold text-white">{photo.kind === 'upload' ? 'Local' : 'Ilustración'}</span> : null}
      </div>
      <div className="p-2 pt-3"><p className="font-semibold text-ink">{slot.label}</p><p className="mt-1 min-h-10 text-xs leading-5 text-muted">{slot.guidance}</p><div className="mt-3 flex flex-wrap gap-2">{photo ? <><Button size="sm" variant="secondary" leadingIcon={<RefreshCw aria-hidden="true" className="h-3.5 w-3.5" strokeWidth={1.6} />} onClick={onRetry}>Reemplazar</Button><button className="focus-ring inline-flex min-h-10 items-center gap-2 rounded-full px-3 text-xs font-semibold text-error hover:bg-error/[0.08]" type="button" onClick={onRemove}><Trash2 aria-hidden="true" className="h-3.5 w-3.5" strokeWidth={1.6} />Quitar</button></> : <Button size="sm" variant="secondary" leadingIcon={<Upload aria-hidden="true" className="h-3.5 w-3.5" strokeWidth={1.6} />} onClick={onUpload}>Agregar</Button>}</div></div>
    </div>
  )
}

export function SearchSummaryPage() {
  const navigate = useNavigate()
  const draft = usePetStore((state) => state.draft)
  const photos = usePetStore((state) => state.photos)
  const setScenario = usePetStore((state) => state.setScenario)

  if (!hasCompletePetProfile(draft)) {
    return <RecoveryPanel title="Todavía falta el perfil" description="Completá los datos básicos antes de preparar una búsqueda de coincidencias."><Link className={`${actionLinkClass} bg-primary text-white hover:-translate-y-0.5 hover:bg-primary/90`} to={getPetCasePath(draft.caseType)}>Completar perfil</Link></RecoveryPanel>
  }

  const location = getPetLocation(draft.approximateLocationId)

  return (
    <PetShell>
      <PageIntro eyebrow="Paso 3 / revisar antes de buscar" title="Revisá el perfil con tus propios ojos." description="La búsqueda usa solo los datos de esta sesión y un escenario nombrado. Podés corregir antes de pedir una comparación local." />
      <div className="mb-8"><FlowSteps current={3} /></div>
      <div className="grid gap-6 pb-16 lg:grid-cols-[minmax(0,1.04fr)_minmax(19rem,0.76fr)] lg:items-start lg:gap-10">
        <MotionReveal>
          <div className="space-y-6">
            <div className="bezel"><div className="bezel-core p-5 sm:p-8"><div className="flex items-start justify-between gap-4"><div><span className="eyebrow">Perfil local</span><h2 className="mt-4 font-display text-3xl font-bold tracking-[-0.05em] text-ink">{draft.name || 'Perro sin nombre'}</h2></div><Badge variant="primary">{petCaseLabels[draft.caseType]}</Badge></div><div className="mt-7 grid gap-5 sm:grid-cols-2"><SummaryLine label="Especie" value="Perro" /><SummaryLine label="Tamaño" value={petSizeLabels[draft.size]} /><SummaryLine label="Colores" value={draft.colors} /><SummaryLine label="Rasgos" value={draft.traits} /><SummaryLine label="Zona aproximada" value={location.label} /><SummaryLine label="Fecha" value={draft.reportedAt} /></div><div className="mt-6 rounded-2xl bg-paper p-4"><p className="text-xs font-semibold uppercase tracking-[0.12em] text-muted">Descripción</p><p className="mt-2 text-sm leading-6 text-ink">{draft.description}</p></div></div></div>
            <div className="bezel"><div className="bezel-core p-3 sm:p-4"><div className="grid grid-cols-3 gap-2">{photos.map((photo) => <div className="aspect-square overflow-hidden rounded-2xl bg-paper" key={photo.slot}><PhotoPreview photo={photo} /></div>)}</div><div className="flex items-center justify-between gap-3 px-2 pb-1 pt-4 text-xs font-semibold text-muted"><span>{photos.length} {photos.length === 1 ? 'foto local' : 'fotos locales'}</span><Link className="focus-ring rounded-full px-2 py-1 text-primary hover:bg-primary/[0.08]" to="/fotos">Editar fotos</Link></div></div></div>
          </div>
        </MotionReveal>
        <MotionReveal delay={0.08}>
          <div className="space-y-6 lg:sticky lg:top-6">
            <div className="bezel"><div className="bezel-core p-5 sm:p-7"><div className="flex items-start justify-between gap-4"><div><span className="eyebrow">Modo de demostración</span><h2 className="mt-4 font-display text-2xl font-bold tracking-[-0.04em] text-ink">Elegí qué querés enseñar.</h2></div><Sparkles aria-hidden="true" className="h-6 w-6 text-accent" strokeWidth={1.6} /></div><p className="mt-3 text-sm leading-6 text-muted">El resultado es determinista: cada opción abre un estado recuperable de la interfaz.</p><div className="mt-6"><Field htmlFor="pet-scenario" label="Modo de demostración" hint="Coincidencia no significa identificación."><Select id="pet-scenario" value={draft.scenarioId} onChange={(event) => setScenario(event.target.value as typeof draft.scenarioId)}>{petScenarioOptions.map((option) => <option key={option.value} value={option.value}>{option.label}</option>)}</Select></Field></div></div></div>
            <DemoNotice>Esta demostración usa datos simulados; no es una predicción real. El porcentaje, cuando aparece, es una ayuda visual para revisar y no una garantía.</DemoNotice>
            <div className="flex flex-col gap-3"><Link className={`${actionLinkClass} justify-center bg-surface text-primary ring-1 ring-inset ring-primary/20 hover:bg-primary/[0.06]`} to={getPetCasePath(draft.caseType)}><PencilLine aria-hidden="true" className="h-4 w-4" strokeWidth={1.6} />Editar perfil</Link><Button className="w-full" size="lg" trailingIcon={<Search aria-hidden="true" className="h-4 w-4" strokeWidth={1.6} />} onClick={() => navigate('/buscando')}>Buscar coincidencias</Button></div>
            <p className="text-center text-xs leading-5 text-muted">Es la única acción que inicia la búsqueda. Mientras carga, quedará deshabilitada para evitar duplicados.</p>
          </div>
        </MotionReveal>
      </div>
    </PetShell>
  )
}

function SummaryLine({ label, value }: { label: string; value: string }) {
  return <div><p className="text-xs font-semibold uppercase tracking-[0.12em] text-muted">{label}</p><p className="mt-1 text-sm leading-6 text-ink">{value}</p></div>
}

export function AnalysisPage() {
  const navigate = useNavigate()
  const draft = usePetStore((state) => state.draft)
  const photos = usePetStore((state) => state.photos)
  const search = usePetStore((state) => state.search)
  const beginSearch = usePetStore((state) => state.beginSearch)
  const setSearchProgress = usePetStore((state) => state.setSearchProgress)
  const setSearchResult = usePetStore((state) => state.setSearchResult)
  const cancelSearch = usePetStore((state) => state.cancelSearch)
  const requestSequence = useRef(0)
  const activeRequest = useRef('')
  const [progress, setProgress] = useState(6)

  useEffect(() => {
    if (!isProfileComplete(draft)) return
    const requestId = `pet-request-${++requestSequence.current}`
    activeRequest.current = requestId
    const controller = new AbortController()
    beginSearch(requestId)
    setProgress(6)
    const progressTimer = window.setInterval(() => {
      setProgress((value) => {
        const next = Math.min(92, value + 7)
        setSearchProgress(next)
        return next
      })
    }, 180)

    void findPetMatches(
      { profile: draft, photos },
      {
        scenarioId: draft.scenarioId,
        latencyMs: import.meta.env.MODE === 'test' ? 0 : undefined,
        signal: controller.signal,
        requestId,
        isRequestCurrent: (currentId) => activeRequest.current === currentId,
      },
    ).then((result) => {
      if (controller.signal.aborted || activeRequest.current !== requestId) return
      setSearchResult(requestId, result)
      navigate('/coincidencias', { replace: true })
    }).catch((error: unknown) => {
      if (controller.signal.aborted || activeRequest.current !== requestId) return
      const fallback: PetMatchResult = {
        meta: { scenarioId: 'pet-error', status: 'error', latencyMs: 0, disclaimer: 'simulated', requestId },
        scenarioId: 'pet-error',
        status: 'error',
        latencyMs: 0,
        disclaimer: 'simulated',
        error: { code: 'MOCK_MATCHING_UNAVAILABLE', message: 'No pudimos buscar coincidencias. Tu perfil seguro sigue guardado.' },
      }
      setSearchResult(requestId, fallback)
      navigate('/coincidencias', { replace: true })
      if (error instanceof Error && error.name !== 'AbortError') console.warn('Simulated pet matching failed', error.name)
    })

    return () => {
      window.clearInterval(progressTimer)
      controller.abort()
    }
  }, [beginSearch, draft, navigate, photos, setSearchProgress, setSearchResult])

  if (!hasCompletePetProfile(draft)) {
    return <RecoveryPanel title="No hay un perfil listo para buscar" description="Volvé al formulario para completar una ficha segura antes de iniciar el análisis local."><Link className={`${actionLinkClass} bg-primary text-white hover:-translate-y-0.5 hover:bg-primary/90`} to={getPetCasePath(draft.caseType)}>Ir al perfil</Link></RecoveryPanel>
  }

  function handleCancel() {
    activeRequest.current = ''
    cancelSearch()
    navigate('/resumen')
  }

  return (
    <PetShell>
      <div className="mx-auto max-w-3xl py-12 md:py-24">
        <MotionReveal>
          <div className="mb-8"><FlowSteps current={4} /></div>
          <div className="bezel"><div className="bezel-core overflow-hidden p-2 sm:p-3"><div className="relative overflow-hidden rounded-[1.7rem] bg-[#17332d] px-5 py-14 text-center text-[#eefaf4] sm:px-12 sm:py-20"><div className="pointer-events-none absolute inset-0 pet-analysis-grid opacity-35" aria-hidden="true" /><div className="relative mx-auto flex h-20 w-20 items-center justify-center rounded-full bg-[#f1a27c] text-[#17332d] ring-8 ring-white/10"><Search aria-hidden="true" className="h-9 w-9" strokeWidth={1.4} /></div><h1 className="relative mt-8 font-display text-4xl font-bold tracking-[-0.06em] sm:text-5xl">Buscando coincidencias...</h1><p className="relative mx-auto mt-4 max-w-md text-sm leading-6 text-[#c3d9d0]" aria-live="polite">Comparamos rasgos visibles con avisos ficticios de zonas cercanas. No se consulta una IA externa.</p><div className="relative mx-auto mt-9 h-2 max-w-sm overflow-hidden rounded-full bg-white/15" role="progressbar" aria-valuemin={0} aria-valuemax={100} aria-valuenow={Math.round(progress)} aria-label={`Progreso de la búsqueda: ${Math.round(progress)}%`}><div className="h-full origin-left rounded-full bg-[#f1a27c] transition-[transform] duration-280 ease-spring motion-reduce:transition-none" style={{ transform: `scaleX(${progress / 100})` }} /></div><p className="relative mt-4 text-xs font-semibold uppercase tracking-[0.14em] text-[#9ccbb9]">Estado: solicitud en curso · {Math.round(progress)}%</p></div><div className="mt-4 flex flex-col items-center justify-between gap-4 rounded-2xl bg-primary/[0.06] p-4 text-center sm:flex-row sm:text-left"><p className="text-sm leading-6 text-muted">Tu perfil sigue guardado y el botón de búsqueda está bloqueado para evitar solicitudes duplicadas.</p><Button variant="ghost" leadingIcon={<X aria-hidden="true" className="h-4 w-4" strokeWidth={1.6} />} onClick={handleCancel}>Cancelar búsqueda</Button></div></div></div>
        </MotionReveal>
      </div>
      <div className="sr-only" aria-live="polite">{search.phase === 'loading' ? 'Buscando coincidencias...' : 'La búsqueda terminó.'}</div>
    </PetShell>
  )
}

export function MatchesPage() {
  const result = usePetStore((state) => state.search.result)
  const draft = usePetStore((state) => state.draft)
  const duplicateDecision = usePetStore((state) => state.duplicateDecision)
  const continueDuplicate = usePetStore((state) => state.continueDuplicate)

  if (!result) {
    return <RecoveryPanel title="Aún no has buscado" description="Completá una ficha local y elegí un modo de demostración para ver candidatos ficticios."><Link className={`${actionLinkClass} bg-primary text-white hover:-translate-y-0.5 hover:bg-primary/90`} to={getPetCasePath(draft.caseType)}>Crear búsqueda</Link><Link className={`${actionLinkClass} text-primary hover:bg-primary/[0.08]`} to="/cerca">Ver avisos cercanos</Link></RecoveryPanel>
  }
  if (result.status === 'error') return <ErrorMatchResult result={result} />
  if (result.status === 'no_match') return <NoMatchResult result={result} />
  if (result.status === 'duplicate') return <DuplicateMatchResult result={result} decision={duplicateDecision} onContinue={continueDuplicate} />

  const isLowConfidence = result.status === 'low_confidence'
  return (
    <PetShell>
      <PageIntro eyebrow={isLowConfidence ? 'Paso 4 / revisión necesaria' : 'Paso 4 / coincidencias locales'} title={isLowConfidence ? 'Hay pistas, pero todavía no alcanzan.' : 'Estas son las coincidencias posibles.'} description={isLowConfidence ? result.reviewMessage : 'Los candidatos están ordenados para ayudarte a revisar. Una coincidencia visual nunca confirma identidad.'}>
        <Badge variant={isLowConfidence ? 'warning' : 'success'}>{result.matches.length} {result.matches.length === 1 ? 'candidato' : 'candidatos'}</Badge>
      </PageIntro>
      <div className="mb-8"><FlowSteps current={4} /></div>
      <div className="grid gap-6 pb-16 lg:grid-cols-[minmax(0,1fr)_minmax(18rem,0.64fr)] lg:items-start lg:gap-10">
        <MotionReveal>
          <div className="space-y-5">
            {isLowConfidence ? <StatusBanner title="Necesitamos más detalles" variant="warning">Podés agregar fotos o corregir el perfil. No tomes esta lista como una identificación.</StatusBanner> : <StatusBanner title="Posibles coincidencias" variant="success">Revisá cada candidato antes de decidir si querés solicitar un siguiente paso.</StatusBanner>}
            <div className="grid gap-5 md:grid-cols-2">{result.matches.map((candidate, index) => <CandidateCard key={candidate.id} candidate={candidate} delay={index * 0.06} />)}</div>
          </div>
        </MotionReveal>
        <MotionReveal delay={0.08}>
          <div className="space-y-5 lg:sticky lg:top-6">
            <div className="bezel"><div className="bezel-core p-5 sm:p-7"><span className="eyebrow">Revisión humana</span><h2 className="mt-4 font-display text-2xl font-bold tracking-[-0.04em] text-ink">Elegí qué necesitás ajustar.</h2><p className="mt-3 text-sm leading-6 text-muted">Podés volver a las fotos o al perfil sin perder la búsqueda segura de esta sesión.</p><div className="mt-6 flex flex-col gap-3"><Link className={`${actionLinkClass} justify-center bg-surface text-primary ring-1 ring-inset ring-primary/20 hover:bg-primary/[0.06]`} to="/fotos"><ImagePlus aria-hidden="true" className="h-4 w-4" strokeWidth={1.6} />Agregar detalles</Link><Link className={`${actionLinkClass} justify-center text-primary hover:bg-primary/[0.08]`} to={getPetCasePath(draft.caseType)}><PencilLine aria-hidden="true" className="h-4 w-4" strokeWidth={1.6} />Corregir perfil</Link><Link className={`${actionLinkClass} justify-center bg-primary text-white hover:-translate-y-0.5 hover:bg-primary/90`} to="/buscando"><RefreshCw aria-hidden="true" className="h-4 w-4" strokeWidth={1.6} />Actualizar búsqueda</Link></div></div></div>
            <DemoNotice>{MATCH_SCORE_DISCLAIMER}. Los resultados son datos locales ficticios, no una predicción real.</DemoNotice>
          </div>
        </MotionReveal>
      </div>
    </PetShell>
  )
}

function CandidateCard({ candidate, delay = 0 }: { candidate: PetCandidate; delay?: number }) {
  return (
    <MotionReveal delay={delay}>
      <div className="bezel h-full">
        <div className="bezel-core h-full overflow-hidden">
          <Link className="focus-ring group block h-full" to={`/coincidencias/${candidate.id}`}>
            <div className="relative aspect-[5/4] overflow-hidden bg-[#d9f1e9]"><img className="h-full w-full object-cover transition-transform duration-700 ease-spring group-hover:scale-[1.04]" src={candidate.photo.src} alt={candidate.photo.alt} loading="lazy" /><span className="absolute left-4 top-4 rounded-full bg-white/90 px-3 py-1.5 text-xs font-semibold text-primary">{petConfidenceLabels[candidate.confidence]}</span><span className="absolute bottom-4 right-4 rounded-full bg-[#17332d]/90 px-3 py-1.5 text-xs font-semibold text-white">Posible coincidencia</span></div>
            <div className="p-5 sm:p-6"><div className="flex items-start justify-between gap-3"><div><p className="text-xs font-semibold uppercase tracking-[0.12em] text-muted">{petCaseLabels[candidate.caseType]}</p><h2 className="mt-2 font-display text-2xl font-bold tracking-[-0.04em] text-ink">{candidate.name}</h2></div><span className="text-lg font-bold text-primary">{getPetScoreLabel(candidate.score)}</span></div><div className="mt-4"><CandidateMeta candidate={candidate} /></div><p className="mt-4 text-sm leading-6 text-muted">{candidate.note}</p><ul className="mt-4 space-y-2 text-sm leading-6 text-ink">{candidate.matchReasons.map((reason) => <li className="flex gap-2" key={reason}><Check aria-hidden="true" className="mt-1 h-4 w-4 shrink-0 text-primary" strokeWidth={1.6} />{reason}</li>)}</ul><div className="mt-5 border-t border-line/70 pt-5"><MatchScore candidate={candidate} compact /></div><div className="mt-5 flex items-center justify-between gap-3 text-sm font-semibold text-primary">Comparar detalles <ArrowRight aria-hidden="true" className="h-4 w-4 transition-transform duration-280 ease-spring group-hover:translate-x-1" strokeWidth={1.6} /></div></div>
          </Link>
        </div>
      </div>
    </MotionReveal>
  )
}

function ErrorMatchResult({ result }: { result: Extract<PetMatchResult, { status: 'error' }> }) {
  return (
    <PetShell>
      <div className="mx-auto max-w-2xl py-16 md:py-24"><MotionReveal><div className="bezel"><div className="bezel-core p-6 sm:p-10"><StatusMark status="error" /><h1 className="mt-7 font-display text-4xl font-bold tracking-[-0.06em] text-ink">No pudimos buscar coincidencias</h1><p className="mt-4 text-base leading-7 text-muted">{result.error.message}</p><p className="mt-3 text-xs font-semibold uppercase tracking-[0.12em] text-muted">Código de demostración: {result.error.code}</p><StatusBanner className="mt-7" title="Tu perfil está a salvo" variant="error">Podés reintentar o volver a corregir datos. No se perdió tu información local.</StatusBanner><div className="mt-8 flex flex-col gap-3 sm:flex-row"><Link className={`${actionLinkClass} bg-primary text-white hover:-translate-y-0.5 hover:bg-primary/90`} to="/buscando"><RefreshCw aria-hidden="true" className="h-4 w-4" strokeWidth={1.6} />Reintentar</Link><Link className={`${actionLinkClass} text-primary hover:bg-primary/[0.08]`} to="/resumen"><ArrowLeft aria-hidden="true" className="h-4 w-4" strokeWidth={1.6} />Corregir perfil</Link></div></div></div><DemoNotice className="mt-5">El error es estable y simulado. No representa una caída de un servicio real.</DemoNotice></MotionReveal></div>
    </PetShell>
  )
}

function NoMatchResult({ result }: { result: Extract<PetMatchResult, { status: 'no_match' }> }) {
  const draft = usePetStore((state) => state.draft)
  return (
    <PetShell>
      <PageIntro eyebrow="Paso 4 / ampliar con calma" title="No encontramos coincidencias en los datos simulados." description="Que esta búsqueda no encuentre un candidato no significa que la mascota no esté cerca. Podés ampliar la búsqueda o corregir la ficha." />
      <div className="mb-8"><FlowSteps current={4} /></div>
      <div className="mx-auto max-w-3xl pb-16"><MotionReveal><div className="bezel"><div className="bezel-core p-6 sm:p-10"><div className="flex h-16 w-16 items-center justify-center rounded-full bg-primary/[0.1] text-primary"><Search aria-hidden="true" className="h-7 w-7" strokeWidth={1.5} /></div><h2 className="mt-7 font-display text-3xl font-bold tracking-[-0.05em] text-ink">Probemos con otra mirada</h2><p className="mt-4 max-w-2xl text-base leading-7 text-muted">{result.broadeningGuidance}</p><div className="mt-8 grid gap-3 sm:grid-cols-3"><Link className={`${actionLinkClass} justify-center bg-primary text-white hover:-translate-y-0.5 hover:bg-primary/90`} to="/fotos"><ImagePlus aria-hidden="true" className="h-4 w-4" strokeWidth={1.6} />Agregar detalles</Link><Link className={`${actionLinkClass} justify-center bg-surface text-primary ring-1 ring-inset ring-primary/20 hover:bg-primary/[0.06]`} to={getPetCasePath(draft.caseType)}><PencilLine aria-hidden="true" className="h-4 w-4" strokeWidth={1.6} />Corregir perfil</Link><Link className={`${actionLinkClass} justify-center text-primary hover:bg-primary/[0.08]`} to="/buscando"><RefreshCw aria-hidden="true" className="h-4 w-4" strokeWidth={1.6} />Actualizar búsqueda</Link></div></div></div><DemoNotice className="mt-5">Los resultados vacíos solo describen este conjunto de datos ficticios. No son una conclusión sobre el paradero de una mascota.</DemoNotice></MotionReveal></div>
    </PetShell>
  )
}

function DuplicateMatchResult({ result, decision, onContinue }: { result: Extract<PetMatchResult, { status: 'duplicate' }>; decision: 'continue' | null; onContinue: () => void }) {
  const draft = usePetStore((state) => state.draft)
  const candidate = result.duplicate
  return (
    <PetShell>
      <PageIntro eyebrow="Paso 4 / revisar similitud" title="Ya existe un aviso parecido." description="Revisá el perfil local ficticio antes de decidir si querés continuar con esta búsqueda." />
      <div className="mb-8"><FlowSteps current={4} /></div>
      <div className="grid gap-6 pb-16 lg:grid-cols-[minmax(0,0.9fr)_minmax(0,1.1fr)] lg:gap-10"><MotionReveal><div className="bezel"><div className="bezel-core p-2"><div className="relative aspect-[4/3] overflow-hidden rounded-[1.35rem] bg-[#d9f1e9]"><img className="h-full w-full object-cover" src={candidate.photo.src} alt={candidate.photo.alt} /></div><p className="px-4 pb-4 pt-4 text-xs font-semibold text-muted">Aviso similar / datos ficticios</p></div></div></MotionReveal><MotionReveal delay={0.08}><div className="space-y-5"><StatusBanner title="Posible duplicado" variant="warning">La similitud compara perfiles locales. No significa que una persona u organización haya verificado este aviso.</StatusBanner><div className="bezel"><div className="bezel-core p-5 sm:p-7"><div className="flex items-start justify-between gap-4"><div><span className="eyebrow">Perfil parecido</span><h2 className="mt-4 font-display text-3xl font-bold tracking-[-0.05em] text-ink">{candidate.name}</h2></div><CircleAlert aria-hidden="true" className="h-7 w-7 text-warning" strokeWidth={1.5} /></div><div className="mt-6"><CandidateMeta candidate={candidate} /></div><p className="mt-5 text-sm leading-6 text-muted">{candidate.note}</p><ProfileFacts candidate={candidate} /><div className="mt-6"><MatchScore candidate={candidate} /></div></div></div>{decision ? <StatusBanner title="Continuar quedó registrado en esta sesión" variant="info">No se publicó nada. Podés editar la ficha o revisar el aviso similar antes de volver a buscar.</StatusBanner> : null}<div className="flex flex-col gap-3 sm:flex-row sm:flex-wrap"><Link className={`${actionLinkClass} bg-primary text-white hover:-translate-y-0.5 hover:bg-primary/90`} to={`/coincidencias/${candidate.id}`}>Revisar aviso</Link><Link className={`${actionLinkClass} bg-surface text-primary ring-1 ring-inset ring-primary/20 hover:bg-primary/[0.06]`} to={getPetCasePath(draft.caseType)}>Editar datos</Link><Button variant="ghost" onClick={onContinue}>Continuar de todos modos</Button></div><DemoNotice>Podés continuar sin crear un duplicado real. La decisión solo cambia esta vista local.</DemoNotice></div></MotionReveal></div>
    </PetShell>
  )
}

export function MatchDetailPage() {
  const { matchId } = useParams()
  const navigate = useNavigate()
  const candidates = usePetStore((state) => state.candidates)
  const photos = usePetStore((state) => state.photos)
  const selectCandidate = usePetStore((state) => state.selectCandidate)
  const [markedPossible, setMarkedPossible] = useState(false)
  const [reported, setReported] = useState(false)
  const { show } = useToast()
  const candidate = candidates.find((item) => item.id === matchId) ?? petNearbyReports.find((item) => item.id === matchId)

  if (!candidate) {
    return <RecoveryPanel title="No encontramos esta coincidencia" description="La referencia puede haber quedado fuera de la sesión actual. Volvé a coincidencias o explorá los avisos cercanos."><Link className={`${actionLinkClass} bg-primary text-white hover:-translate-y-0.5 hover:bg-primary/90`} to="/coincidencias">Volver a coincidencias</Link><Link className={`${actionLinkClass} text-primary hover:bg-primary/[0.08]`} to="/cerca">Ver avisos cercanos</Link></RecoveryPanel>
  }
  const safeCandidate = candidate

  function markAsPossible() {
    selectCandidate(safeCandidate.id)
    setMarkedPossible(true)
  }

  function requestNextStep() {
    selectCandidate(safeCandidate.id)
    navigate('/contacto')
  }

  function reportSuspicious() {
    setReported(true)
    show({ title: 'Aviso marcado para revisión local', message: 'No se envió ningún reporte fuera de esta demostración.', variant: 'info' })
  }

  return (
    <PetShell>
      <div className="flex flex-wrap items-center justify-between gap-4 pb-8 pt-8 md:pt-12"><BackLink to="/coincidencias">Volver a coincidencias</BackLink><Badge variant="accent">Comparación protegida</Badge></div>
      <div className="grid gap-8 pb-16 lg:grid-cols-[minmax(0,1fr)_minmax(18rem,0.7fr)] lg:gap-12">
        <MotionReveal>
          <div><span className="eyebrow">Detalle de posible coincidencia</span><h1 className="mt-5 max-w-3xl font-display text-[clamp(2.6rem,6vw,5.4rem)] font-bold leading-[0.94] tracking-[-0.07em] text-ink">Compará sin apurarte.</h1><p className="mt-6 max-w-2xl text-lg leading-8 text-muted">Ponemos tu ficha y el aviso ficticio lado a lado para que revises los rasgos visibles antes de elegir un siguiente paso.</p></div>
          <div className="mt-10 grid gap-5 md:grid-cols-2">
            <ComparisonImage title="Tu ficha local" photos={photos} fallback="Todavía no agregaste fotos propias. Podés volver a la guía para completar esta vista." />
            <div className="bezel"><div className="bezel-core h-full overflow-hidden p-2"><div className="relative aspect-[4/3] overflow-hidden rounded-[1.35rem] bg-[#d9f1e9]"><img className="h-full w-full object-cover" src={candidate.photo.src} alt={candidate.photo.alt} /><span className="absolute left-4 top-4 rounded-full bg-white/90 px-3 py-1.5 text-xs font-semibold text-primary">Aviso ficticio</span></div><div className="p-4 sm:p-5"><p className="text-xs font-semibold uppercase tracking-[0.12em] text-muted">{petCaseLabels[candidate.caseType]}</p><h2 className="mt-2 font-display text-2xl font-bold tracking-[-0.04em] text-ink">{candidate.name}</h2><div className="mt-4"><CandidateMeta candidate={candidate} /></div></div></div></div>
          </div>
        </MotionReveal>
        <MotionReveal delay={0.08}>
          <div className="space-y-5 lg:sticky lg:top-6"><div className="bezel"><div className="bezel-core p-5 sm:p-7"><div className="flex items-start justify-between gap-4"><div><span className="eyebrow">Lo que coincide</span><h2 className="mt-4 font-display text-2xl font-bold tracking-[-0.04em] text-ink">Rasgos para revisar</h2></div><Sparkles aria-hidden="true" className="h-6 w-6 text-accent" strokeWidth={1.6} /></div><ul className="mt-6 space-y-3 text-sm leading-6 text-ink">{candidate.matchReasons.map((reason) => <li className="flex gap-2" key={reason}><Check aria-hidden="true" className="mt-1 h-4 w-4 shrink-0 text-primary" strokeWidth={1.6} />{reason}</li>)}</ul><div className="mt-6"><ProfileFacts candidate={candidate} /></div><div className="mt-6 border-t border-line/70 pt-6"><MatchScore candidate={candidate} /></div></div></div>{markedPossible ? <StatusBanner title="Marcaste esta ficha como posible coincidencia" variant="success">Todavía falta una conversación segura para confirmar cualquier paso. Podés solicitar una vista previa protegida.</StatusBanner> : null}{reported ? <StatusBanner title="Publicación marcada" variant="info">La marca es local y simulada; no se envió a una organización.</StatusBanner> : null}<div className="flex flex-col gap-3"><Button size="lg" trailingIcon={<HeartHandshake aria-hidden="true" className="h-4 w-4" strokeWidth={1.6} />} onClick={markAsPossible}>Posible coincidencia</Button><Button variant="secondary" leadingIcon={<MessageCircle aria-hidden="true" className="h-4 w-4" strokeWidth={1.6} />} onClick={requestNextStep}>Solicitar siguiente paso</Button><Button variant="ghost" leadingIcon={<X aria-hidden="true" className="h-4 w-4" strokeWidth={1.6} />} onClick={() => navigate('/coincidencias')}>Rechazar coincidencia</Button><Button variant="ghost" leadingIcon={<ShieldAlert aria-hidden="true" className="h-4 w-4" strokeWidth={1.6} />} onClick={reportSuspicious}>{reported ? 'Publicación marcada' : 'Reportar publicación sospechosa'}</Button></div><DemoNotice>{MATCH_SCORE_DISCLAIMER}. No compartimos datos de contacto desde esta comparación.</DemoNotice></div>
        </MotionReveal>
      </div>
    </PetShell>
  )
}

function ComparisonImage({ title, photos, fallback }: { title: string; photos: readonly PetPhoto[]; fallback: string }) {
  return <div className="bezel"><div className="bezel-core h-full p-3 sm:p-4"><div className="flex items-center justify-between gap-3 px-1 pb-3"><p className="font-semibold text-ink">{title}</p><Badge variant="neutral">Local</Badge></div>{photos.length ? <div className="grid grid-cols-2 gap-2">{photos.map((photo) => <div className="aspect-square overflow-hidden rounded-2xl bg-paper" key={photo.slot}><PhotoPreview photo={photo} /></div>)}</div> : <div className="flex min-h-52 items-center justify-center rounded-2xl bg-paper p-5 text-center text-sm leading-6 text-muted"><div><Camera aria-hidden="true" className="mx-auto h-7 w-7 text-primary" strokeWidth={1.5} /><p className="mt-3">{fallback}</p></div></div>}</div></div>
}

export function ContactPage() {
  const candidates = usePetStore((state) => state.candidates)
  const selectedCandidateId = usePetStore((state) => state.selectedCandidateId)
  const preview = usePetStore((state) => state.protectedMessagePreview)
  const setMessagePreview = usePetStore((state) => state.setMessagePreview)
  const setLocalConfirmation = usePetStore((state) => state.setLocalConfirmation)
  const candidate = candidates.find((item) => item.id === selectedCandidateId) ?? (selectedCandidateId ? petNearbyReports.find((item) => item.id === selectedCandidateId) : undefined) ?? candidates[0]
  const messages = ['Hola, creo que esta ficha podría coincidir. ¿Podemos revisar los detalles de forma segura?', 'Tengo una foto y una zona aproximada para comparar dentro de esta demostración.', 'Me gustaría confirmar los rasgos visibles antes de dar cualquier otro paso.']
  const [selectedMessage, setSelectedMessage] = useState(messages[0])

  if (!candidate) {
    return <RecoveryPanel title="No hay una coincidencia seleccionada" description="Elegí un candidato antes de abrir la vista de mensaje protegido. Esta pantalla no intercambia contactos reales."><Link className={`${actionLinkClass} bg-primary text-white hover:-translate-y-0.5 hover:bg-primary/90`} to="/coincidencias">Elegir coincidencia</Link></RecoveryPanel>
  }

  function confirmRequest() {
    setMessagePreview({ candidateId: candidate.id, selectedMessage, confirmed: true })
    setLocalConfirmation({ candidateId: candidate.id, reference: `EMM-DEMO-${candidate.id.slice(-4).toUpperCase()}`, markedReunited: false })
  }

  return (
    <PetShell>
      <PageIntro eyebrow="Paso 5 / siguiente paso protegido" title="Prepará un mensaje sin exponer a nadie." description="Esta pantalla solo muestra frases locales de ejemplo. No hay teléfono, correo, chat real ni envío de notificaciones." />
      <div className="mb-8"><FlowSteps current={5} /></div>
      <div className="grid gap-6 pb-16 lg:grid-cols-[minmax(0,0.86fr)_minmax(0,1.14fr)] lg:items-start lg:gap-10">
        <MotionReveal><div className="bezel"><div className="bezel-core p-2"><div className="relative aspect-[4/3] overflow-hidden rounded-[1.35rem] bg-[#d9f1e9]"><img className="h-full w-full object-cover" src={candidate.photo.src} alt={candidate.photo.alt} /></div><div className="p-4 sm:p-5"><p className="text-xs font-semibold uppercase tracking-[0.12em] text-muted">Posible coincidencia</p><h2 className="mt-2 font-display text-2xl font-bold tracking-[-0.04em] text-ink">{candidate.name}</h2><div className="mt-4"><CandidateMeta candidate={candidate} /></div></div></div></div><div className="mt-5"><SafetyBoundary>Si alguna vez avanzás fuera de una demostración, evitá compartir tu domicilio y preferí un lugar público con apoyo de una organización de confianza.</SafetyBoundary></div></MotionReveal>
        <MotionReveal delay={0.08}><div className="space-y-5"><div className="bezel"><div className="bezel-core p-5 sm:p-8"><div className="flex items-start justify-between gap-4"><div><span className="eyebrow">Vista previa protegida</span><h2 className="mt-4 font-display text-3xl font-bold tracking-[-0.05em] text-ink">Elegí una frase local</h2></div><MessageCircle aria-hidden="true" className="h-7 w-7 text-primary" strokeWidth={1.5} /></div><fieldset className="mt-7 space-y-3"><legend className="text-sm font-semibold text-ink">Mensaje de demostración</legend>{messages.map((message, index) => <label className={`flex min-h-16 cursor-pointer items-start gap-3 rounded-2xl p-4 text-sm leading-6 transition-[background-color,box-shadow,transform] duration-280 ease-spring ${selectedMessage === message ? 'bg-primary/[0.08] ring-2 ring-inset ring-primary' : 'bg-paper ring-1 ring-inset ring-line/70 hover:-translate-y-0.5'}`} key={message}><input className="mt-1 h-4 w-4 accent-primary" type="radio" name="protected-message" value={message} checked={selectedMessage === message} onChange={() => setSelectedMessage(message)} /><span><span className="block text-xs font-semibold uppercase tracking-[0.12em] text-muted">Opción {index + 1}</span><span className="mt-1 block text-ink">{message}</span></span></label>)}</fieldset><div className="mt-7 rounded-2xl bg-[#d9f1e9] p-4"><p className="text-xs font-semibold uppercase tracking-[0.12em] text-[#3c6659]">Sin datos de contacto</p><p className="mt-2 text-sm leading-6 text-[#17332d]">El destinatario, la identidad y cualquier canal de comunicación están protegidos y simulados.</p></div></div></div>{preview?.confirmed ? <StatusBanner title="Solicitud simulada; no se contactó a nadie" variant="success">La frase quedó guardada solo en esta sesión. Podés revisar el reencuentro local o volver a las coincidencias.</StatusBanner> : <Button className="w-full" size="lg" trailingIcon={<ArrowRight aria-hidden="true" className="h-4 w-4" strokeWidth={1.6} />} onClick={confirmRequest}>Solicitar siguiente paso</Button>}<div className="flex flex-col gap-3 sm:flex-row"><Link className={`${actionLinkClass} flex-1 text-primary hover:bg-primary/[0.08]`} to={`/coincidencias/${candidate.id}`}><ArrowLeft aria-hidden="true" className="h-4 w-4" strokeWidth={1.6} />Volver a comparar</Link>{preview?.confirmed ? <Link className={`${actionLinkClass} flex-1 bg-primary text-white hover:-translate-y-0.5 hover:bg-primary/90`} to="/reencuentro">Ver reencuentro local</Link> : null}</div><DemoNotice>El botón confirma una intención dentro del prototipo. No se envía un mensaje ni se genera una notificación real.</DemoNotice></div></MotionReveal>
      </div>
    </PetShell>
  )
}

export function ReencounterPage() {
  const navigate = useNavigate()
  const confirmation = usePetStore((state) => state.localConfirmation)
  const markReunited = usePetStore((state) => state.markReunited)
  const candidates = usePetStore((state) => state.candidates)
  const candidate = confirmation ? candidates.find((item) => item.id === confirmation.candidateId) ?? petNearbyReports.find((item) => item.id === confirmation.candidateId) : undefined

  if (!confirmation || !candidate) {
    return <RecoveryPanel title="Todavía no hay un siguiente paso" description="Esta confirmación aparece después de revisar una coincidencia y preparar una solicitud simulada. Nadie será contactado desde aquí."><Link className={`${actionLinkClass} bg-primary text-white hover:-translate-y-0.5 hover:bg-primary/90`} to="/coincidencias">Volver a coincidencias</Link><Link className={`${actionLinkClass} text-primary hover:bg-primary/[0.08]`} to="/">Ir al inicio</Link></RecoveryPanel>
  }

  return (
    <PetShell>
      <div className="mx-auto max-w-3xl py-12 md:py-24"><MotionReveal><div className="bezel"><div className="bezel-core overflow-hidden p-2 sm:p-3"><div className="relative overflow-hidden rounded-[1.7rem] bg-[#17332d] px-6 py-14 text-center text-[#eefaf4] sm:px-12 sm:py-20"><div className="pointer-events-none absolute -right-10 -top-10 h-48 w-48 rounded-full bg-[#f1a27c]/30" aria-hidden="true" /><div className="pointer-events-none absolute -bottom-24 -left-12 h-64 w-64 rounded-full bg-[#39a995]/25" aria-hidden="true" /><div className="relative mx-auto flex h-20 w-20 items-center justify-center rounded-full bg-[#f1a27c] text-[#17332d] ring-8 ring-white/10"><HeartHandshake aria-hidden="true" className="h-9 w-9" strokeWidth={1.5} /></div><p className="relative mt-8 text-[0.68rem] font-semibold uppercase tracking-[0.18em] text-[#bfe3d3]">Cierre local de la demostración</p><h1 className="relative mt-4 font-display text-4xl font-bold tracking-[-0.06em] sm:text-5xl">Un paso de alivio, sin prometer de más.</h1><p className="relative mx-auto mt-5 max-w-xl text-base leading-7 text-[#d2e6dc]">La ficha <strong>{confirmation.reference}</strong> queda lista para que marques un reencuentro dentro de esta sesión si querés mostrar ese estado.</p></div><div className="p-5 sm:p-8"><div className="grid gap-6 sm:grid-cols-[10rem_1fr] sm:items-center"><div className="aspect-square overflow-hidden rounded-[1.35rem] bg-paper"><img className="h-full w-full object-cover" src={candidate.photo.src} alt={candidate.photo.alt} /></div><div><span className="eyebrow">Referencia local</span><h2 className="mt-4 font-display text-3xl font-bold tracking-[-0.05em] text-ink">{candidate.name}</h2><p className="mt-3 flex items-center gap-2 text-sm text-muted"><MapPinned aria-hidden="true" className="h-4 w-4 text-primary" strokeWidth={1.6} />{candidate.approximateLocation.label}</p><p className="mt-3 text-sm leading-6 text-muted">Esta zona es aproximada y ficticia. No representa una dirección ni confirma un encuentro real.</p></div></div>{confirmation.markedReunited ? <StatusBanner className="mt-7" title="Caso marcado como Reencontrada" variant="success">El estado solo vive en esta demostración y puede servir para presentar el cierre del flujo.</StatusBanner> : <Button className="mt-7 w-full sm:w-auto" size="lg" leadingIcon={<CheckCircle2 aria-hidden="true" className="h-4 w-4" strokeWidth={1.6} />} onClick={markReunited}>Marcar caso como Reencontrada</Button>}<div className="mt-7 flex flex-col gap-3 border-t border-line/70 pt-6 sm:flex-row"><Button variant="secondary" onClick={() => navigate('/coincidencias')}>Volver a coincidencias</Button><Link className={`${actionLinkClass} text-primary hover:bg-primary/[0.08]`} to="/cerca">Ver avisos cercanos</Link></div></div></div></div><DemoNotice className="mt-5">Límite explícito: no se contactó a nadie, no se verificó una identidad y no se confirmó una reunión real.</DemoNotice></MotionReveal></div>
    </PetShell>
  )
}

export function NotFoundPage() {
  return <RecoveryPanel title="Esta ruta no existe" description="Podés volver al inicio o revisar los avisos locales. El flujo conserva una salida clara en cada pantalla."><Link className={`${actionLinkClass} bg-primary text-white hover:-translate-y-0.5 hover:bg-primary/90`} to="/">Volver al inicio</Link><Link className={`${actionLinkClass} text-primary hover:bg-primary/[0.08]`} to="/cerca">Ver avisos cercanos</Link></RecoveryPanel>
}
