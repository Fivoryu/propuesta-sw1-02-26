import { lazy, Suspense, useEffect, useMemo, useRef, useState, type ChangeEvent, type CSSProperties } from 'react'
import { zodResolver } from '@hookform/resolvers/zod'
import { useForm, useWatch } from 'react-hook-form'
import { Link, Navigate, useNavigate, useParams, useSearchParams } from 'react-router-dom'
import {
  ArrowLeft,
  ArrowRight,
  Check,
  CheckCircle2,
  CircleAlert,
  FileImage,
  Filter,
  MapPinned,
  PencilLine,
  Plus,
  RefreshCw,
  ShieldAlert,
  Sparkles,
  Upload,
  X,
} from 'lucide-react'
import { Badge, Button, Card, CardBody, CardHeader, CardTitle, ConfidenceMeter, EmptyState, Field, Input, Select, StatusBanner, Textarea } from '@propuestas/ui'
import { santaCruzLocations } from '@propuestas/shared'
import { analyzeUrbanIssue } from '../services/mock/analyze-urban-issue'
import { useUrbanReportStore, isDraftNonEmpty } from '../state/urban-report-store'
import {
  urbanCategoryLabels,
  urbanCategoryOptions,
  urbanReportSchema,
  urbanScenarioOptions,
  urbanSeverityLabels,
  urbanStatusLabels,
  getConfidenceLabel,
  type DetectedRegion,
  type UrbanAnalysisResult,
  type UrbanCategory,
  type UrbanReport,
  type UrbanReportFormValues,
  type UrbanReportStatus,
} from '../domain/urban-report'
import { findUrbanReport, getFixtureEvidence, urbanImageFixtures, urbanReports } from '../domain/urban-fixtures'
import {
  actionLinkClass,
  AnalysisStateIcon,
  CancelDialog,
  CivicShell,
  EvidencePreview,
  FlowSteps,
  MotionReveal,
  MapLegend,
  PageIntro,
  RecoveryPanel,
  SimulatedNotice,
  StatusChip,
} from './ui'

const UrbanMap = lazy(() => import('./urban-map'))

export function HomePage() {
  const navigate = useNavigate()
  const confirmedReports = useUrbanReportStore((state) => state.confirmedReports)
  const [categoryFilter, setCategoryFilter] = useState<UrbanCategory | 'all'>('all')
  const [statusFilter, setStatusFilter] = useState<UrbanReportStatus | 'all'>('all')
  const reports = useMemo(() => [...urbanReports, ...confirmedReports], [confirmedReports])
  const filteredReports = useMemo(
    () => reports.filter((report) => (categoryFilter === 'all' || report.category === categoryFilter) && (statusFilter === 'all' || report.status === statusFilter)),
    [categoryFilter, reports, statusFilter],
  )

  return (
    <CivicShell>
      <section className="grid gap-10 pb-10 pt-8 md:grid-cols-[minmax(0,1.02fr)_minmax(20rem,0.98fr)] md:items-end md:gap-16 md:pb-16 md:pt-16">
        <MotionReveal>
          <div className="max-w-3xl">
            <span className="eyebrow">Santa Cruz de la Sierra / vista local</span>
            <h1 className="mt-6 max-w-3xl font-display text-[clamp(3rem,7vw,6.4rem)] font-bold leading-[0.91] tracking-[-0.075em] text-ink">Una ciudad mejora cuando sus señales se vuelven visibles.</h1>
            <p className="mt-7 max-w-xl text-base leading-7 text-muted md:text-lg">Registrá un problema urbano con una ubicación aproximada, revisá una clasificación simulada y decidí qué resumen local querés conservar.</p>
            <div className="mt-8 flex flex-wrap items-center gap-3">
              <Button size="lg" trailingIcon={<ArrowRight aria-hidden="true" className="h-4 w-4" />} onClick={() => navigate('/reportar')}>Reportar problema</Button>
              <Link className={`${actionLinkClass} bg-surface text-primary ring-1 ring-inset ring-primary/20 hover:-translate-y-0.5 hover:bg-primary/[0.06]`} to="/mis-reportes">
                <ShieldAlert aria-hidden="true" className="h-4 w-4" />
                Ver mis reportes
              </Link>
            </div>
          </div>
        </MotionReveal>
        <MotionReveal className="md:justify-self-end" delay={0.1}>
          <div className="grid grid-cols-2 gap-3 sm:grid-cols-4 md:grid-cols-2 md:gap-4">
            <Metric label="Reportes visibles" value={String(reports.length).padStart(2, '0')} tone="primary" />
            <Metric label="Zonas aproximadas" value="05" tone="accent" />
            <Metric label="Estados claros" value="04" tone="info" />
            <Metric label="Envíos reales" value="00" tone="neutral" />
          </div>
        </MotionReveal>
      </section>

      <MotionReveal delay={0.15}>
        <div className="bezel">
          <div className="bezel-core overflow-hidden p-2 sm:p-3">
            <div className="grid gap-3 lg:grid-cols-[minmax(0,1.4fr)_minmax(18rem,0.6fr)]">
              <div className="min-w-0">
                <Suspense fallback={<div className="flex h-[min(62vh,560px)] min-h-[360px] items-center justify-center rounded-[1.7rem] bg-[#dcece5] text-sm font-semibold text-primary" role="status">Cargando mapa local...</div>}><UrbanMap reports={filteredReports} /></Suspense>
              </div>
              <aside className="flex flex-col justify-between rounded-[1.35rem] bg-[#17332d] p-5 text-[#eefaf4] sm:p-7" aria-label="Resumen de la vista urbana">
                <div>
                  <div className="flex items-center justify-between gap-3">
                    <span className="rounded-full bg-white/10 px-3 py-1 text-[0.68rem] font-semibold uppercase tracking-[0.18em] text-[#bfe3d3]">Mapa abierto</span>
                    <MapPinned aria-hidden="true" className="h-5 w-5 text-[#f1a27c]" />
                  </div>
                  <h2 className="mt-8 max-w-xs font-display text-3xl font-bold leading-tight tracking-[-0.05em]">Ver el barrio como una conversación.</h2>
                  <p className="mt-4 max-w-xs text-sm leading-6 text-[#c3d9d0]">Cada punto es ficticio y aproximado. La lista debajo mantiene el contenido disponible si el mapa no carga.</p>
                </div>
                  <div className="mt-10 grid grid-cols-2 gap-3 border-t border-white/15 pt-5 text-sm">
                  <div><p className="text-[#9ccbb9]">Más reportado</p><p className="mt-1 font-semibold">Baches</p></div>
                  <div><p className="text-[#9ccbb9]">Vista activa</p><p className="mt-1 font-semibold">Santa Cruz</p></div>
                </div>
                <MapLegend />
              </aside>
            </div>
          </div>
        </div>
      </MotionReveal>

      <section className="py-16 md:py-24" aria-labelledby="reports-heading">
        <div className="flex flex-col gap-6 md:flex-row md:items-end md:justify-between">
          <div>
            <span className="eyebrow">Lista alternativa</span>
            <h2 className="mt-4 font-display text-3xl font-bold tracking-[-0.05em] text-ink md:text-4xl" id="reports-heading">Señales cerca de vos</h2>
            <p className="mt-3 max-w-xl text-sm leading-6 text-muted">Filtrá por categoría o estado. Los colores siempre están acompañados por una etiqueta y un ícono.</p>
          </div>
          <div className="flex items-center gap-2 text-sm font-semibold text-primary"><Filter aria-hidden="true" className="h-4 w-4" /> {filteredReports.length} resultados visibles</div>
        </div>
        <div className="mt-7 grid gap-4 rounded-[1.7rem] bg-surface p-4 ring-1 ring-inset ring-line/60 md:grid-cols-2 md:p-5 xl:grid-cols-[1fr_auto]">
          <div className="flex flex-wrap gap-2" aria-label="Filtrar por categoría">
            <FilterPill active={categoryFilter === 'all'} onClick={() => setCategoryFilter('all')}>Todas</FilterPill>
            {urbanCategoryOptions.map((option) => <FilterPill key={option.value} active={categoryFilter === option.value} onClick={() => setCategoryFilter(option.value)}>{option.label}</FilterPill>)}
          </div>
          <div className="flex flex-wrap gap-2" aria-label="Filtrar por estado">
            <FilterPill active={statusFilter === 'all'} onClick={() => setStatusFilter('all')}>Todos los estados</FilterPill>
            {(Object.keys(urbanStatusLabels) as UrbanReportStatus[]).map((status) => <FilterPill key={status} active={statusFilter === status} onClick={() => setStatusFilter(status)}>{urbanStatusLabels[status]}</FilterPill>)}
          </div>
        </div>
        {filteredReports.length ? (
          <div className="mt-7 grid gap-5 md:grid-cols-2 xl:grid-cols-4">
            {filteredReports.map((report, index) => <ReportCard key={report.id} report={report} delay={index * 0.04} />)}
          </div>
        ) : (
          <div className="mt-7">
            <EmptyState title="No hay reportes con estos filtros" icon={<Filter aria-hidden="true" className="h-5 w-5" />} action={<Button variant="secondary" onClick={() => { setCategoryFilter('all'); setStatusFilter('all') }}>Limpiar filtros</Button>}>Probá otra combinación para volver a ver las señales de esta demostración.</EmptyState>
          </div>
        )}
      </section>

      <SimulatedNotice>Esta demostración usa datos simulados; no es una predicción real. Las ubicaciones no son direcciones verificadas y ningún reporte se envía a la municipalidad.</SimulatedNotice>
    </CivicShell>
  )
}

function Metric({ label, value, tone }: { label: string; value: string; tone: 'primary' | 'accent' | 'info' | 'neutral' }) {
  const styles = { primary: 'bg-primary text-white', accent: 'bg-accent text-ink', info: 'bg-info text-white', neutral: 'bg-surface text-ink ring-1 ring-inset ring-line/70' }
  return <div className={`min-w-0 rounded-[1.5rem] p-4 sm:p-5 ${styles[tone]}`}><p className="text-[0.68rem] font-semibold uppercase leading-4 tracking-[0.14em] opacity-75">{label}</p><p className="mt-4 font-display text-3xl font-bold tracking-[-0.06em] sm:text-4xl">{value}</p></div>
}

function FilterPill({ active, onClick, children }: { active: boolean; onClick: () => void; children: string }) {
  return <button className={`focus-ring min-h-11 rounded-full px-3.5 py-2 text-xs font-semibold transition-[background-color,color,transform] duration-280 ease-spring hover:-translate-y-0.5 ${active ? 'bg-primary text-white' : 'bg-paper text-muted ring-1 ring-inset ring-line/70 hover:text-primary'}`} type="button" aria-pressed={active} onClick={onClick}>{children}</button>
}

function ReportCard({ report, delay = 0 }: { report: UrbanReport; delay?: number }) {
  return (
    <MotionReveal delay={delay}>
      <Link className="focus-ring group block h-full rounded-[1.7rem]" to={`/reportes/${report.id}`}>
        <Card className="h-full transition-[background-color,box-shadow,transform] duration-280 ease-spring group-hover:-translate-y-1 group-hover:shadow-quiet" bezel>
          <CardHeader className="gap-4">
            <div className="flex items-start justify-between gap-3"><Badge variant={report.category === 'pothole' ? 'accent' : 'primary'}>{urbanCategoryLabels[report.category]}</Badge><StatusChip status={report.status} /></div>
            <CardTitle className="text-xl">{report.description}</CardTitle>
          </CardHeader>
          <CardBody className="flex h-[calc(100%-10rem)] flex-col justify-end gap-4">
            <p className="flex items-center gap-2 text-sm text-muted"><MapPinned aria-hidden="true" className="h-4 w-4 shrink-0 text-primary" />{report.approximateLocation.label}</p>
            <div className="flex items-center justify-between gap-3 border-t border-line/70 pt-4 text-xs font-semibold text-muted"><span>{report.reference}</span><span className="text-primary transition-transform duration-280 ease-spring group-hover:translate-x-1">Ver detalle <ArrowRight aria-hidden="true" className="inline h-3.5 w-3.5" /></span></div>
          </CardBody>
        </Card>
      </Link>
    </MotionReveal>
  )
}

export function ReportFormPage() {
  const navigate = useNavigate()
  const draft = useUrbanReportStore((state) => state.draft)
  const setDraft = useUrbanReportStore((state) => state.setDraft)
  const resetFlow = useUrbanReportStore((state) => state.resetFlow)
  const [cancelOpen, setCancelOpen] = useState(false)
  const [fileError, setFileError] = useState('')
  const {
    control,
    register,
    handleSubmit,
    setValue,
    formState: { errors, isDirty },
  } = useForm<UrbanReportFormValues>({
    resolver: zodResolver(urbanReportSchema),
    mode: 'onBlur',
    defaultValues: {
      approximateLocationId: draft.approximateLocationId,
      category: draft.category,
      description: draft.description,
      scenarioId: draft.scenarioId,
      fixtureImageId: draft.fixtureImageId,
    },
  })
  const approximateLocationId = useWatch({ control, name: 'approximateLocationId' })
  const category = useWatch({ control, name: 'category' })
  const description = useWatch({ control, name: 'description' })
  const scenarioId = useWatch({ control, name: 'scenarioId' })
  const fixtureImageId = useWatch({ control, name: 'fixtureImageId' })

  useEffect(() => {
    if (!approximateLocationId || !category || !scenarioId) return
    setDraft({ approximateLocationId, category, description: description ?? '', scenarioId })
  }, [approximateLocationId, category, description, scenarioId, setDraft])

  function handleFixtureChoice(id: string) {
    setFileError('')
    setValue('fixtureImageId', id, { shouldDirty: true, shouldValidate: true })
    setDraft({ fixtureImageId: id, evidence: getFixtureEvidence(id) })
  }

  function handleFileChange(event: ChangeEvent<HTMLInputElement>) {
    const file = event.target.files?.[0]
    if (!file) return
    if (!file.type.startsWith('image/')) {
      setFileError('Elegí un archivo de imagen para mostrar una evidencia local.')
      return
    }
    const reader = new FileReader()
    reader.onload = () => {
      if (typeof reader.result !== 'string') return
      setFileError('')
      setValue('fixtureImageId', '', { shouldDirty: true })
      setDraft({ fixtureImageId: undefined, evidence: { kind: 'upload', src: reader.result, label: file.name, alt: `Vista previa de la imagen local ${file.name}` } })
    }
    reader.readAsDataURL(file)
  }

  function onValid(values: UrbanReportFormValues) {
    setDraft({ ...values, fixtureImageId: values.fixtureImageId || undefined })
    navigate('/analisis')
  }

  function handleCancelRequest() {
    if (isDirty || isDraftNonEmpty(draft)) setCancelOpen(true)
    else { resetFlow(); navigate('/') }
  }

  return (
    <CivicShell>
      <PageIntro eyebrow="Paso 1 / captura local" title="Contanos qué está pasando en tu zona." description="Completá una ficha breve. La ubicación se guarda como referencia aproximada y la imagen queda dentro de esta demostración." />
      <div className="mb-8"><FlowSteps current={1} /></div>
      <form className="grid gap-6 pb-16 lg:grid-cols-[minmax(0,1fr)_minmax(20rem,0.72fr)] lg:items-start lg:gap-10" noValidate onSubmit={handleSubmit(onValid)}>
        <MotionReveal>
          <div className="bezel">
            <div className="bezel-core space-y-8 p-5 sm:p-8">
              <div className="flex items-start justify-between gap-4"><div><span className="eyebrow">Ficha del problema</span><h2 className="mt-4 font-display text-2xl font-bold tracking-[-0.04em] text-ink">Datos que sí podés revisar</h2></div><span className="hidden rounded-full bg-primary/[0.08] p-3 text-primary sm:inline-flex"><MapPinned aria-hidden="true" className="h-5 w-5" /></span></div>
              {Object.keys(errors).length ? <StatusBanner title="Revisá los campos marcados" variant="error">Cada mensaje aparece junto al campo que necesita una corrección antes de analizar.</StatusBanner> : null}
              <Field htmlFor="approximateLocationId" label="Zona aproximada" required error={errors.approximateLocationId?.message} hint="No uses una dirección exacta. Elegí un área ficticia para la demostración.">
                <Select id="approximateLocationId" {...register('approximateLocationId')}>
                  <option value="">Seleccioná una zona</option>
                  {santaCruzLocations.map((location) => <option key={location.areaId} value={location.areaId}>{location.label}</option>)}
                </Select>
              </Field>
              <Field htmlFor="category" label="Categoría" required error={errors.category?.message} hint="La categoría inicial ayuda a ordenar la revisión; no es una decisión definitiva.">
                <Select id="category" {...register('category')}>
                  <option value="">Seleccioná una categoría</option>
                  {urbanCategoryOptions.map((option) => <option key={option.value} value={option.value}>{option.label}</option>)}
                </Select>
              </Field>
              <Field htmlFor="description" label="¿Qué observaste?" required error={errors.description?.message} hint={`${(description ?? '').length}/500 caracteres. Incluí una referencia visible sin compartir datos personales.`}>
                <Textarea id="description" placeholder="Ejemplo: hay un bache grande cerca de la parada del barrio..." {...register('description')} />
              </Field>
              <Field htmlFor="scenarioId" label="Modo de demostración" required error={errors.scenarioId?.message} hint="Elegí un estado para recorrer el prototipo sin depender de un servicio externo.">
                <Select id="scenarioId" {...register('scenarioId')}>
                  {urbanScenarioOptions.map((option) => <option key={option.value} value={option.value}>{option.label}</option>)}
                </Select>
              </Field>
            </div>
          </div>
        </MotionReveal>

        <MotionReveal delay={0.08}>
          <div className="space-y-6 lg:sticky lg:top-6">
            <div className="bezel">
              <div className="bezel-core p-5 sm:p-7">
                <div className="flex items-start justify-between gap-4"><div><span className="eyebrow">Evidencia opcional</span><h2 className="mt-4 font-display text-2xl font-bold tracking-[-0.04em] text-ink">Elegí una imagen local</h2></div><FileImage aria-hidden="true" className="h-6 w-6 text-primary" /></div>
                <p className="mt-3 text-sm leading-6 text-muted">Podés cargar una imagen real desde tu dispositivo o usar una de estas escenas ficticias.</p>
                <div className="mt-6 space-y-3">
                  {urbanImageFixtures.map((fixture) => <button className={`focus-ring group block w-full rounded-2xl p-2 text-left transition-[background-color,transform,box-shadow] duration-280 ease-spring hover:-translate-y-0.5 ${fixtureImageId === fixture.fixtureImageId ? 'bg-primary/[0.08] ring-2 ring-inset ring-primary' : 'bg-paper ring-1 ring-inset ring-line/70 hover:bg-primary/[0.04]'}`} key={fixture.fixtureImageId} type="button" aria-pressed={fixtureImageId === fixture.fixtureImageId} onClick={() => handleFixtureChoice(fixture.fixtureImageId ?? '')}><div className="flex items-center gap-3"><img className="h-16 w-20 rounded-xl object-cover" src={fixture.src} alt={fixture.alt} /><span className="min-w-0 flex-1"><span className="block text-sm font-semibold text-ink">{fixture.label}</span><span className="mt-1 block text-xs leading-5 text-muted">Fixture local sin conexión</span></span><span className={`inline-flex h-7 w-7 shrink-0 items-center justify-center rounded-full ${fixtureImageId === fixture.fixtureImageId ? 'bg-primary text-white' : 'bg-surface text-transparent ring-1 ring-inset ring-line'}`}><Check aria-hidden="true" className="h-4 w-4" /></span></div></button>)}
                </div>
                <Field htmlFor="evidence-upload" label="Cargar una imagen del dispositivo" hint="La vista previa se procesa solo en tu navegador; no se sube a ningún servidor.">
                  <label className="focus-ring flex min-h-12 cursor-pointer items-center justify-center gap-2 rounded-xl bg-surface px-4 py-3 text-sm font-semibold text-primary ring-1 ring-inset ring-primary/25 transition-[background-color,transform] duration-280 ease-spring hover:-translate-y-0.5 hover:bg-primary/[0.06]" htmlFor="evidence-upload"><Upload aria-hidden="true" className="h-4 w-4" />Elegir archivo local</label>
                  <Input className="sr-only" id="evidence-upload" type="file" accept="image/*" onChange={handleFileChange} />
                </Field>
                {fileError ? <p className="text-sm font-medium text-error" role="alert">{fileError}</p> : null}
                <div className="mt-5"><EvidencePreview evidence={draft.evidence} /><div className="mt-3 flex items-center justify-between gap-3 text-xs font-semibold text-muted"><span className="truncate">{draft.evidence.label}</span><span className="rounded-full bg-primary/[0.08] px-2 py-1 text-primary">Vista previa local</span></div></div>
              </div>
            </div>
            <div className="rounded-[1.7rem] bg-[#17332d] p-5 text-[#eefaf4] sm:p-7"><p className="text-[0.68rem] font-semibold uppercase tracking-[0.18em] text-[#9ccbb9]">Antes de continuar</p><p className="mt-3 text-sm leading-6 text-[#c3d9d0]">La siguiente pantalla tarda entre 1,2 y 2,2 segundos para mostrar un análisis simulado. Podés cancelarlo y volver sin perder este borrador.</p></div>
            <div className="flex flex-col-reverse gap-3 sm:flex-row sm:justify-between"><Button type="button" variant="ghost" leadingIcon={<ArrowLeft aria-hidden="true" className="h-4 w-4" />} onClick={handleCancelRequest}>Cancelar</Button><Button type="submit" size="lg" trailingIcon={<ArrowRight aria-hidden="true" className="h-4 w-4" />}>Analizar problema</Button></div>
          </div>
        </MotionReveal>
      </form>
      <CancelDialog open={cancelOpen} onKeepEditing={() => setCancelOpen(false)} onDiscard={() => { setCancelOpen(false); resetFlow(); navigate('/') }} />
    </CivicShell>
  )
}

export function AnalysisPage() {
  const navigate = useNavigate()
  const draft = useUrbanReportStore((state) => state.draft)
  const setAnalysisResult = useUrbanReportStore((state) => state.setAnalysisResult)
  const requestId = useRef(0)

  useEffect(() => {
    const currentRequest = ++requestId.current
    const controller = new AbortController()
    setAnalysisResult(null)
    const approximateLocation = santaCruzLocations.find((location) => location.areaId === draft.approximateLocationId) ?? santaCruzLocations[0]
    analyzeUrbanIssue(
      { description: draft.description, categoryHint: draft.category, approximateLocation, fixtureImageId: draft.fixtureImageId },
      { scenarioId: draft.scenarioId, latencyMs: import.meta.env.MODE === 'test' ? 0 : undefined, signal: controller.signal },
    ).then((result) => {
      if (controller.signal.aborted || currentRequest !== requestId.current) return
      setAnalysisResult(result)
      navigate(result.status === 'duplicate' ? '/duplicado' : '/resultado', { replace: true })
    }).catch((error: unknown) => {
      if (controller.signal.aborted || currentRequest !== requestId.current) return
      const fallback: UrbanAnalysisResult = { scenarioId: 'urban-error', status: 'error', latencyMs: 0, disclaimer: 'simulated', error: { code: 'MOCK_ANALYSIS_UNAVAILABLE', message: 'No pudimos analizar el problema. Tu borrador sigue guardado.' } }
      setAnalysisResult(fallback)
      navigate('/resultado', { replace: true })
      if (error instanceof Error && error.name !== 'AbortError') console.warn('Simulated analysis failed', error.name)
    })
    return () => { controller.abort(); requestId.current += 1 }
  }, [draft.approximateLocationId, draft.category, draft.description, draft.evidence.src, draft.fixtureImageId, draft.scenarioId, navigate, setAnalysisResult])

  return (
    <CivicShell>
      <div className="mx-auto max-w-3xl py-12 md:py-24">
        <MotionReveal>
          <div className="mb-8"><FlowSteps current={2} /></div>
          <div className="bezel">
            <div className="bezel-core overflow-hidden p-6 sm:p-12">
              <div className="relative overflow-hidden rounded-[1.7rem] bg-[#17332d] px-5 py-12 text-center text-[#eefaf4] sm:px-12 sm:py-16">
                <div className="pointer-events-none absolute inset-0 opacity-35" style={{ backgroundImage: 'linear-gradient(30deg, transparent 46%, #9ccbb9 47%, transparent 48%), linear-gradient(120deg, transparent 46%, #9ccbb9 47%, transparent 48%)', backgroundSize: '76px 76px' }} aria-hidden="true" />
                <div className="relative mx-auto flex h-20 w-20 items-center justify-center rounded-full bg-[#f1a27c] text-[#17332d] ring-8 ring-white/10"><Sparkles aria-hidden="true" className="h-9 w-9" /></div>
                <h1 className="relative mt-8 font-display text-4xl font-bold tracking-[-0.06em] sm:text-5xl">Analizando imagen...</h1>
                <p className="relative mx-auto mt-4 max-w-md text-sm leading-6 text-[#c3d9d0]" aria-live="polite">Estamos preparando una lectura simulada de la evidencia. No se consulta una IA externa.</p>
                <div className="relative mx-auto mt-9 h-2 max-w-sm overflow-hidden rounded-full bg-white/15" aria-hidden="true"><MotionProgress /></div>
                <p className="relative mt-4 text-xs font-semibold uppercase tracking-[0.14em] text-[#9ccbb9]">Estado: solicitud en curso</p>
              </div>
              <div className="mt-7 flex flex-col items-center justify-between gap-4 rounded-2xl bg-primary/[0.06] p-4 text-center sm:flex-row sm:text-left"><p className="text-sm leading-6 text-muted">El botón de análisis está bloqueado para evitar solicitudes duplicadas.</p><Button variant="ghost" leadingIcon={<X aria-hidden="true" className="h-4 w-4" />} onClick={() => navigate('/reportar')}>Cancelar análisis</Button></div>
            </div>
          </div>
        </MotionReveal>
      </div>
    </CivicShell>
  )
}

function MotionProgress() {
  return <div className="h-full origin-left animate-progress bg-[#f1a27c] motion-reduce:animate-none" />
}

export function ResultPage() {
  const navigate = useNavigate()
  const draft = useUrbanReportStore((state) => state.draft)
  const result = useUrbanReportStore((state) => state.analysisResult)
  const correction = useUrbanReportStore((state) => state.correction)
  const setCorrection = useUrbanReportStore((state) => state.setCorrection)
  const setDraft = useUrbanReportStore((state) => state.setDraft)
  const suggestedCategory = result && result.status !== 'error' ? result.analysis.category : draft.category
  const suggestedDescription = result && result.status !== 'error' ? result.analysis.description : draft.description
  const [editing, setEditing] = useState(Boolean(correction))
  const [category, setCategory] = useState<UrbanCategory>(correction?.category ?? suggestedCategory)
  const [description, setDescription] = useState(correction?.description ?? suggestedDescription)
  const [editError, setEditError] = useState('')

  if (!result) return <RecoveryPanel title="Todavía no hay un análisis para revisar" description="Volvé al formulario para crear un borrador o iniciá el flujo de análisis desde el principio."><Link className={`${actionLinkClass} bg-primary text-white hover:-translate-y-0.5 hover:bg-primary/90`} to="/reportar">Ir a reportar</Link></RecoveryPanel>
  if (result.status === 'duplicate') return <Navigate replace to="/duplicado" />

  if (result.status === 'error') {
    return <ErrorResult result={result} />
  }

  const analysis = result.analysis
  const corrected = Boolean(correction)
  const needsReview = result.status === 'low_confidence' && !corrected
  const categoryLabel = urbanCategoryLabels[category]
  const locationLabel = santaCruzLocations.find((location) => location.areaId === draft.approximateLocationId)?.label ?? 'Zona aproximada'

  function saveCorrection() {
    const trimmed = description.trim()
    if (trimmed.length < 20) { setEditError('La descripción corregida necesita al menos 20 caracteres.'); return }
    setEditError('')
    setCorrection({ category, description: trimmed })
    setDraft({ category, description: trimmed })
    setEditing(false)
  }

  return (
    <CivicShell>
      <PageIntro eyebrow={`Paso 3 / ${result.status === 'no_match' ? 'sin coincidencias' : 'revisión'}`} title="Este es el resultado que podés decidir." description="La clasificación es una sugerencia del prototipo. Revisá la imagen, corregí lo necesario y recién después continuá con el resumen local." />
      <div className="mb-8"><FlowSteps current={3} /></div>
      <div className="grid gap-6 pb-16 lg:grid-cols-[minmax(0,0.9fr)_minmax(0,1.1fr)] lg:items-start lg:gap-10">
        <MotionReveal>
          <div className="bezel">
            <div className="bezel-core p-2">
              <div className="relative overflow-hidden rounded-[calc(2rem-0.75rem)]">
                <EvidencePreview evidence={draft.evidence} />
                <div className="detected-region" style={regionStyle(analysis.detectedRegion)} aria-label="Región detectada de forma simulada" />
                <span className="absolute bottom-4 left-4 rounded-full bg-[#17332d]/90 px-3 py-2 text-xs font-semibold text-white">Región detectada</span>
              </div>
              <div className="flex items-center justify-between gap-3 px-4 pb-4 pt-4 text-xs font-semibold text-muted"><span className="truncate">{draft.evidence.label}</span><span className="rounded-full bg-primary/[0.08] px-2 py-1 text-primary">Imagen local</span></div>
            </div>
          </div>
        </MotionReveal>
        <MotionReveal delay={0.08}>
          <div className="space-y-5">
            {result.status === 'low_confidence' ? <StatusBanner title="Necesitamos tu revisión" variant="warning">La confianza es baja. Corregí la categoría o la descripción antes de continuar.</StatusBanner> : null}
            {result.status === 'no_match' ? <StatusBanner title="Sin coincidencias en los datos simulados" variant="info">No encontrar una coincidencia no significa que el problema no exista. Podés continuar con un nuevo resumen local.</StatusBanner> : null}
            {corrected ? <StatusBanner title="Corregido por ti" variant="success">La versión que sigue incorpora tus cambios y se usará para el resumen local.</StatusBanner> : null}
            <div className="bezel">
              <div className="bezel-core p-5 sm:p-7">
                <div className="flex items-start justify-between gap-4"><div><span className="eyebrow">Lectura simulada</span><h2 className="mt-4 font-display text-3xl font-bold tracking-[-0.05em] text-ink">{categoryLabel}</h2></div><span className={`inline-flex h-12 w-12 items-center justify-center rounded-full ${needsReview ? 'bg-warning/[0.12] text-warning' : 'bg-success/[0.12] text-success'}`}><AnalysisStateIcon status={needsReview ? 'warning' : 'success'} /></span></div>
                <div className="mt-6"><ConfidenceMeter value={analysis.confidence} label={getConfidenceLabel(analysis.confidence)} /></div>
                <dl className="mt-7 grid gap-4 border-t border-line/70 pt-6 sm:grid-cols-2"><div><dt className="text-xs font-semibold uppercase tracking-[0.12em] text-muted">Severidad</dt><dd className="mt-1 font-semibold text-ink">{urbanSeverityLabels[analysis.severity]}</dd></div><div><dt className="text-xs font-semibold uppercase tracking-[0.12em] text-muted">Ubicación</dt><dd className="mt-1 font-semibold text-ink">{locationLabel}</dd></div></dl>
                <div className="mt-6 rounded-2xl bg-paper p-4"><p className="text-xs font-semibold uppercase tracking-[0.12em] text-muted">Descripción sugerida</p><p className="mt-2 text-sm leading-6 text-ink">{analysis.description}</p></div>
                {analysis.suggestedCorrections?.length ? <ul className="mt-4 space-y-2 text-sm leading-6 text-warning">{analysis.suggestedCorrections.map((suggestion) => <li className="flex gap-2" key={suggestion}><CircleAlert aria-hidden="true" className="mt-1 h-4 w-4 shrink-0" />{suggestion}</li>)}</ul> : null}
                <div className="mt-6 flex flex-wrap gap-3"><Button variant="secondary" leadingIcon={<PencilLine aria-hidden="true" className="h-4 w-4" />} onClick={() => setEditing((current) => !current)}>{editing ? 'Cerrar edición' : 'Corregir datos'}</Button>{corrected ? <Badge variant="primary">Corregido por ti</Badge> : null}</div>
                {editing ? <div className="mt-6 space-y-5 border-t border-line/70 pt-6"><Field htmlFor="corrected-category" label="Categoría corregida"><Select id="corrected-category" value={category} onChange={(event) => setCategory(event.target.value as UrbanCategory)}>{urbanCategoryOptions.map((option) => <option key={option.value} value={option.value}>{option.label}</option>)}</Select></Field><Field htmlFor="corrected-description" label="Descripción corregida" error={editError}><Textarea id="corrected-description" value={description} onChange={(event) => setDescription(event.target.value)} /></Field><Button leadingIcon={<Check aria-hidden="true" className="h-4 w-4" />} onClick={saveCorrection}>Guardar corrección</Button></div> : null}
              </div>
            </div>
            <SimulatedNotice>Esta demostración usa datos simulados; no es una predicción real. La confianza es una ayuda para revisar, no una probabilidad calibrada.</SimulatedNotice>
            <div className="flex flex-col-reverse gap-3 sm:flex-row sm:justify-between"><Link className={`${actionLinkClass} text-primary hover:bg-primary/[0.08]`} to="/reportar"><ArrowLeft aria-hidden="true" className="h-4 w-4" />Cancelar</Link><div className="flex flex-col gap-3 sm:flex-row"><Link className={`${actionLinkClass} bg-surface text-primary ring-1 ring-inset ring-primary/20 hover:bg-primary/[0.06]`} to="/analisis"><RefreshCw aria-hidden="true" className="h-4 w-4" />Reintentar</Link><Button disabled={needsReview} trailingIcon={<ArrowRight aria-hidden="true" className="h-4 w-4" />} onClick={() => navigate('/confirmar')}>{needsReview ? 'Revisión requerida' : 'Continuar'}</Button></div></div>
          </div>
        </MotionReveal>
      </div>
    </CivicShell>
  )
}

function regionStyle(region: DetectedRegion): CSSProperties {
  return { left: `${region.x}%`, top: `${region.y}%`, width: `${region.width}%`, height: `${region.height}%` }
}

function ErrorResult({ result }: { result: Extract<UrbanAnalysisResult, { status: 'error' }> }) {
  return (
    <CivicShell>
      <div className="mx-auto max-w-2xl py-16 md:py-24"><MotionReveal><div className="bezel"><div className="bezel-core p-6 sm:p-10"><div className="flex h-16 w-16 items-center justify-center rounded-full bg-error/[0.1] text-error"><AnalysisStateIcon status="error" /></div><h1 className="mt-7 font-display text-4xl font-bold tracking-[-0.06em] text-ink">No pudimos analizar el problema</h1><p className="mt-4 text-base leading-7 text-muted">{result.error.message}</p><p className="mt-3 text-xs font-semibold uppercase tracking-[0.12em] text-muted">Código de demostración: {result.error.code}</p><StatusBanner className="mt-7" title="Tu borrador está a salvo" variant="error">Podés intentarlo de nuevo o volver a editar la información. No se perdió la evidencia local.</StatusBanner><div className="mt-8 flex flex-col gap-3 sm:flex-row"><Link className={`${actionLinkClass} bg-primary text-white hover:-translate-y-0.5 hover:bg-primary/90`} to="/analisis"><RefreshCw aria-hidden="true" className="h-4 w-4" />Reintentar</Link><Link className={`${actionLinkClass} text-primary hover:bg-primary/[0.08]`} to="/reportar"><ArrowLeft aria-hidden="true" className="h-4 w-4" />Cancelar reporte</Link></div></div></div></MotionReveal></div>
    </CivicShell>
  )
}

export function DuplicatePage() {
  const navigate = useNavigate()
  const draft = useUrbanReportStore((state) => state.draft)
  const result = useUrbanReportStore((state) => state.analysisResult)
  if (!result || result.status !== 'duplicate') return <Navigate replace to="/resultado" />
  const candidate = result.analysis.possibleDuplicate[0]
  const existingReport = candidate ? findUrbanReport(candidate.reportId) : undefined
  return (
    <CivicShell>
      <PageIntro eyebrow="Paso 3 / revisión de similitud" title="Encontramos una señal parecida." description="Revisá el registro aproximado antes de decidir si querés conservar un nuevo resumen local." />
      <div className="mb-8"><FlowSteps current={3} /></div>
      <div className="grid gap-6 pb-16 lg:grid-cols-[minmax(0,0.9fr)_minmax(0,1.1fr)] lg:gap-10">
        <MotionReveal><div className="bezel"><div className="bezel-core p-2"><EvidencePreview evidence={draft.evidence} /><div className="px-4 pb-4 pt-4 text-xs font-semibold text-muted">{draft.evidence.label} / evidencia local</div></div></div></MotionReveal>
        <MotionReveal delay={0.08}><div className="space-y-5"><StatusBanner title="Posible duplicado" variant="warning">La coincidencia es una comparación entre datos simulados. No implica que una entidad externa haya verificado el problema.</StatusBanner><div className="bezel"><div className="bezel-core p-5 sm:p-7"><div className="flex items-start justify-between gap-4"><div><span className="eyebrow">Registro aproximado</span><h2 className="mt-4 font-display text-3xl font-bold tracking-[-0.05em] text-ink">{candidate?.reference ?? 'MMB-DEMO-001'}</h2></div><CircleAlert aria-hidden="true" className="h-7 w-7 text-warning" /></div><dl className="mt-7 space-y-4 border-t border-line/70 pt-6"><div className="flex justify-between gap-4"><dt className="text-sm text-muted">Zona</dt><dd className="text-right text-sm font-semibold text-ink">{candidate?.approximateLocation ?? 'Zona aproximada'}</dd></div><div className="flex justify-between gap-4"><dt className="text-sm text-muted">Fecha</dt><dd className="text-right text-sm font-semibold text-ink">{candidate?.reportedAt ?? 'Fecha simulada'}</dd></div><div className="flex justify-between gap-4"><dt className="text-sm text-muted">Categoría</dt><dd className="text-right text-sm font-semibold text-ink">{candidate ? urbanCategoryLabels[candidate.category] : 'Bache o daño en la vía'}</dd></div><div className="flex justify-between gap-4"><dt className="text-sm text-muted">Estado</dt><dd className="text-right text-sm font-semibold text-ink">{candidate ? urbanStatusLabels[candidate.status] : 'En revisión'}</dd></div></dl><p className="mt-6 rounded-2xl bg-paper p-4 text-sm leading-6 text-muted">{candidate?.description ?? 'Posible problema urbano similar en la zona aproximada.'}</p>{existingReport ? <div className="mt-4"><StatusChip status={existingReport.status} /></div> : null}</div></div><SimulatedNotice>Una coincidencia local no bloquea tu decisión. Podés revisarla, continuar de todos modos o cancelar.</SimulatedNotice><div className="flex flex-col-reverse gap-3 sm:flex-row sm:justify-between"><Link className={`${actionLinkClass} text-primary hover:bg-primary/[0.08]`} to="/reportar"><ArrowLeft aria-hidden="true" className="h-4 w-4" />Cancelar</Link><div className="flex flex-col gap-3 sm:flex-row"><Link className={`${actionLinkClass} bg-surface text-primary ring-1 ring-inset ring-primary/20 hover:bg-primary/[0.06]`} to={`/reportes/${candidate?.reportId ?? 'fixture-report-plan-3000'}`}>Revisar existente</Link><Button trailingIcon={<ArrowRight aria-hidden="true" className="h-4 w-4" />} onClick={() => navigate('/confirmar')}>Continuar de todos modos</Button></div></div></div></MotionReveal>
      </div>
    </CivicShell>
  )
}

export function ConfirmPage() {
  const navigate = useNavigate()
  const draft = useUrbanReportStore((state) => state.draft)
  const result = useUrbanReportStore((state) => state.analysisResult)
  const correction = useUrbanReportStore((state) => state.correction)
  const addConfirmedReport = useUrbanReportStore((state) => state.addConfirmedReport)
  const [confirming, setConfirming] = useState(false)
  const location = santaCruzLocations.find((item) => item.areaId === draft.approximateLocationId) ?? santaCruzLocations[0]
  const analysis = result && result.status !== 'error' ? result.analysis : null
  const category = correction?.category ?? analysis?.category ?? draft.category
  const description = correction?.description ?? analysis?.description ?? draft.description
  const severity = analysis?.severity ?? 'medium'

  if (!analysis) return <RecoveryPanel title="Primero necesitás revisar un análisis" description="El resumen local se habilita después de completar el formulario y revisar un resultado simulado."><Link className={`${actionLinkClass} bg-primary text-white hover:-translate-y-0.5 hover:bg-primary/90`} to="/reportar">Ir a reportar</Link></RecoveryPanel>

  function confirmLocalReport() {
    if (confirming) return
    setConfirming(true)
    const stamp = Date.now()
    const report: UrbanReport = {
      id: `local-report-${stamp}`,
      reference: `MMB-LOCAL-${String(stamp).slice(-6)}`,
      category,
      severity,
      status: 'pending',
      description,
      approximateLocation: location,
      lat: location.areaId === 'sc-plan-3000' ? -17.7974 : location.areaId === 'sc-villa-primero-de-mayo' ? -17.7861 : location.areaId === 'sc-equipetrol' ? -17.7618 : location.areaId === 'sc-las-palmas' ? -17.7738 : -17.7877,
      lng: location.areaId === 'sc-plan-3000' ? -63.1535 : location.areaId === 'sc-villa-primero-de-mayo' ? -63.1205 : location.areaId === 'sc-equipetrol' ? -63.1907 : location.areaId === 'sc-las-palmas' ? -63.2051 : -63.1819,
      reportedAt: '6 de agosto de 2026',
      evidence: draft.evidence,
      simulated: true,
    }
    addConfirmedReport(report)
    navigate(`/reportes/${report.id}?confirmado=1`, { replace: true })
  }

  return (
    <CivicShell>
      <PageIntro eyebrow="Paso 4 / resumen local" title="Confirmá lo que querés conservar." description="Este último paso crea un registro dentro de la demostración para que puedas consultarlo en Mis reportes." />
      <div className="mb-8"><FlowSteps current={4} /></div>
      <div className="grid gap-6 pb-16 lg:grid-cols-[minmax(0,1fr)_minmax(18rem,0.75fr)] lg:gap-10">
        <MotionReveal><div className="bezel"><div className="bezel-core p-5 sm:p-8"><div className="flex items-start justify-between gap-4"><div><span className="eyebrow">Resumen para revisar</span><h2 className="mt-4 font-display text-3xl font-bold tracking-[-0.05em] text-ink">Nuevo reporte local</h2></div><CheckCircle2 aria-hidden="true" className="h-7 w-7 text-primary" /></div><div className="mt-7 grid gap-5 sm:grid-cols-[10rem_1fr] sm:items-start"><EvidencePreview evidence={draft.evidence} compact /><div><SummaryRow label="Zona aproximada" value={location.label} /><SummaryRow label="Categoría" value={urbanCategoryLabels[category]} /><SummaryRow label="Severidad" value={urbanSeverityLabels[severity]} /><SummaryRow label="Descripción" value={description} last /></div></div></div></div></MotionReveal>
        <MotionReveal delay={0.08}><div className="space-y-5 lg:sticky lg:top-6"><SimulatedNotice>Esto es una demostración; no se envió a la municipalidad. El registro queda solo en esta sesión local.</SimulatedNotice><div className="rounded-[1.7rem] bg-[#17332d] p-5 text-[#eefaf4] sm:p-7"><p className="text-[0.68rem] font-semibold uppercase tracking-[0.18em] text-[#9ccbb9]">Acción final</p><h2 className="mt-4 font-display text-2xl font-bold tracking-[-0.04em]">¿Guardar este resumen?</h2><p className="mt-3 text-sm leading-6 text-[#c3d9d0]">Después podés verlo en tu historial local y revisar una línea de tiempo ficticia.</p><Button className="mt-7 w-full" size="lg" loading={confirming} trailingIcon={<ArrowRight aria-hidden="true" className="h-4 w-4" />} onClick={confirmLocalReport}>Confirmar resumen local</Button></div><Link className={`${actionLinkClass} w-full text-primary hover:bg-primary/[0.08]`} to="/resultado"><ArrowLeft aria-hidden="true" className="h-4 w-4" />Volver a revisar</Link></div></MotionReveal>
      </div>
    </CivicShell>
  )
}

function SummaryRow({ label, value, last = false }: { label: string; value: string; last?: boolean }) {
  return <div className={`${last ? '' : 'border-b border-line/70 pb-4'} mb-4`}><p className="text-xs font-semibold uppercase tracking-[0.12em] text-muted">{label}</p><p className="mt-1 text-sm leading-6 text-ink">{value}</p></div>
}

export function ReportDetailPage() {
  const { reportId } = useParams()
  const [searchParams] = useSearchParams()
  const confirmedReports = useUrbanReportStore((state) => state.confirmedReports)
  const report = [...urbanReports, ...confirmedReports].find((item) => item.id === reportId)
  if (!report) return <RecoveryPanel title="No encontramos este reporte local" description="La referencia puede haber quedado fuera de la sesión actual. Volvé al mapa para consultar las fichas disponibles."><Link className={`${actionLinkClass} bg-primary text-white hover:-translate-y-0.5 hover:bg-primary/90`} to="/">Volver al mapa</Link></RecoveryPanel>
  const timeline: UrbanReportStatus[] = ['pending', 'in_review', 'in_progress', 'resolved']
  const currentIndex = timeline.indexOf(report.status)
  return (
    <CivicShell>
      <div className="flex flex-wrap items-center justify-between gap-4 pb-8 pt-8 md:pt-12"><Link className={`${actionLinkClass} -ml-2 text-primary hover:bg-primary/[0.08]`} to={searchParams.get('confirmado') ? '/mis-reportes' : '/'}><ArrowLeft aria-hidden="true" className="h-4 w-4" />{searchParams.get('confirmado') ? 'Volver a mis reportes' : 'Volver al mapa'}</Link>{searchParams.get('confirmado') ? <Badge variant="primary">Guardado en esta demostración</Badge> : null}</div>
      <div className="grid gap-8 pb-16 lg:grid-cols-[minmax(0,1fr)_minmax(18rem,0.7fr)] lg:gap-12">
        <MotionReveal><div><span className="eyebrow">Detalle del reporte / {report.reference}</span><h1 className="mt-5 max-w-3xl font-display text-[clamp(2.6rem,6vw,5.4rem)] font-bold leading-[0.94] tracking-[-0.07em] text-ink">{urbanCategoryLabels[report.category]} en {report.approximateLocation.label.replace('Cerca de ', '')}</h1><p className="mt-6 max-w-2xl text-lg leading-8 text-muted">{report.description}</p><div className="mt-8 flex flex-wrap items-center gap-3"><StatusChip status={report.status} /><span className="rounded-full bg-surface px-3 py-2 text-xs font-semibold text-muted ring-1 ring-inset ring-line/70">{report.reportedAt}</span></div></div><div className="mt-10 grid gap-5 md:grid-cols-[minmax(0,1fr)_minmax(12rem,0.55fr)]"><div className="bezel"><div className="bezel-core p-2"><EvidencePreview evidence={report.evidence} /><p className="px-4 pb-4 pt-4 text-xs font-semibold text-muted">Evidencia local / {report.evidence.label}</p></div></div><div className="relative min-h-56 overflow-hidden rounded-[1.7rem] bg-[#dcece5] p-5 ring-1 ring-inset ring-primary/10"><div className="urban-grid-pattern absolute inset-0 opacity-50" aria-hidden="true" /><div className="relative flex h-full min-h-44 items-center justify-center"><span className="flex h-14 w-14 items-center justify-center rounded-full bg-primary text-white ring-8 ring-primary/15"><MapPinned aria-hidden="true" className="h-6 w-6" /></span></div><p className="relative text-sm font-semibold text-[#17332d]">{report.approximateLocation.label}</p><p className="relative mt-1 text-xs leading-5 text-[#3c6659]">Ubicación aproximada, sin dirección exacta.</p></div></div></MotionReveal>
        <MotionReveal delay={0.1}><div className="bezel"><div className="bezel-core p-5 sm:p-7"><div className="flex items-start justify-between gap-3"><div><span className="eyebrow">Seguimiento ficticio</span><h2 className="mt-4 font-display text-2xl font-bold tracking-[-0.04em] text-ink">Línea de tiempo</h2></div><Sparkles aria-hidden="true" className="h-5 w-5 text-accent" /></div><ol className="mt-8 space-y-0" aria-label="Estado simulado del reporte">{timeline.map((status, index) => { const complete = index <= currentIndex; return <li className="relative flex gap-4 pb-8 last:pb-0" key={status}>{index < timeline.length - 1 ? <span className={`absolute left-[0.9rem] top-8 h-[calc(100%-1.5rem)] w-px ${index < currentIndex ? 'bg-primary' : 'bg-line'}`} aria-hidden="true" /> : null}<span className={`relative z-10 inline-flex h-8 w-8 shrink-0 items-center justify-center rounded-full text-xs font-bold ${complete ? 'bg-primary text-white' : 'bg-surface text-muted ring-1 ring-inset ring-line'}`}>{complete ? <Check aria-hidden="true" className="h-4 w-4" /> : index + 1}</span><div><p className={`font-semibold ${complete ? 'text-primary' : 'text-muted'}`}>{urbanStatusLabels[status]}</p><p className="mt-1 text-xs leading-5 text-muted">{timelineCopy(status, complete, index === currentIndex)}</p></div></li>})}</ol><div className="mt-8 border-t border-line/70 pt-5"><p className="text-xs font-semibold uppercase tracking-[0.12em] text-muted">Límite del prototipo</p><p className="mt-2 text-sm leading-6 text-muted">Esta línea de tiempo es simulada y no representa seguimiento municipal real.</p></div></div></div></MotionReveal>
      </div>
    </CivicShell>
  )
}

function timelineCopy(status: UrbanReportStatus, complete: boolean, active: boolean): string {
  if (active) return 'Estado actual dentro de esta demostración.'
  if (complete) return 'Paso anterior representado localmente.'
  if (status === 'resolved') return 'Aún no alcanzado en este escenario.'
  return 'Estado futuro simulado.'
}

export function MyReportsPage() {
  const reports = useUrbanReportStore((state) => state.confirmedReports)
  const [categoryFilter, setCategoryFilter] = useState<UrbanCategory | 'all'>('all')
  const [statusFilter, setStatusFilter] = useState<UrbanReportStatus | 'all'>('all')
  const filtered = reports.filter((report) => (categoryFilter === 'all' || report.category === categoryFilter) && (statusFilter === 'all' || report.status === statusFilter))
  const hasFilters = categoryFilter !== 'all' || statusFilter !== 'all'
  return (
    <CivicShell>
      <PageIntro eyebrow="Historial local" title="Tus reportes, sin perder el contexto." description="Este historial existe solo durante la sesión de demostración. No requiere cuenta y no representa registros municipales reales." children={<Link className={`${actionLinkClass} bg-primary text-white hover:-translate-y-0.5 hover:bg-primary/90`} to="/reportar"><Plus aria-hidden="true" className="h-4 w-4" />Nuevo reporte</Link>} />
      {reports.length ? <><div className="mb-7 flex flex-col gap-3 rounded-[1.7rem] bg-surface p-4 ring-1 ring-inset ring-line/60 md:flex-row md:items-center md:justify-between"><div className="flex flex-wrap gap-2"><FilterPill active={categoryFilter === 'all'} onClick={() => setCategoryFilter('all')}>Todas las categorías</FilterPill>{urbanCategoryOptions.map((option) => <FilterPill key={option.value} active={categoryFilter === option.value} onClick={() => setCategoryFilter(option.value)}>{option.label}</FilterPill>)}</div><div className="flex flex-wrap gap-2"><FilterPill active={statusFilter === 'all'} onClick={() => setStatusFilter('all')}>Todos los estados</FilterPill>{(Object.keys(urbanStatusLabels) as UrbanReportStatus[]).map((status) => <FilterPill key={status} active={statusFilter === status} onClick={() => setStatusFilter(status)}>{urbanStatusLabels[status]}</FilterPill>)}</div></div>{filtered.length ? <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-3">{filtered.map((report, index) => <ReportCard key={report.id} report={report} delay={index * 0.05} />)}</div> : <EmptyState title="No hay coincidencias en tu historial" icon={<Filter aria-hidden="true" className="h-5 w-5" />} action={<Button variant="secondary" onClick={() => { setCategoryFilter('all'); setStatusFilter('all') }}>Limpiar filtros</Button>}>El reporte sigue guardado; probá otra combinación para volver a encontrarlo.</EmptyState>}</> : <MotionReveal><EmptyState title="Todavía no tenés reportes en esta demostración" icon={<MapPinned aria-hidden="true" className="h-5 w-5" />} action={<Link className={`${actionLinkClass} bg-primary text-white hover:-translate-y-0.5 hover:bg-primary/90`} to="/reportar"><Plus aria-hidden="true" className="h-4 w-4" />Reportar problema</Link>}>Confirmá un resumen local para verlo acá. Que la lista esté vacía no dice nada sobre reportes reales.</EmptyState></MotionReveal>}
      {reports.length && !hasFilters ? <div className="mt-10"><SimulatedNotice>Tu historial se borra al recargar la página. Es una fixture de interacción para esta presentación.</SimulatedNotice></div> : null}
    </CivicShell>
  )
}

export function NotFoundPage() {
  return <RecoveryPanel title="Esta ruta no existe" description="Podés volver al mapa o empezar un nuevo reporte desde la navegación principal."><Link className={`${actionLinkClass} bg-primary text-white hover:-translate-y-0.5 hover:bg-primary/90`} to="/"><ArrowLeft aria-hidden="true" className="h-4 w-4" />Volver al mapa</Link><Link className={`${actionLinkClass} bg-surface text-primary ring-1 ring-inset ring-primary/20 hover:bg-primary/[0.06]`} to="/reportar">Reportar problema</Link></RecoveryPanel>
}
