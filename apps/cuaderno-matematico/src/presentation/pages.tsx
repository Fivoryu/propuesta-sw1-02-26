import { useEffect, useRef, useState, type ReactNode } from 'react'
import { zodResolver } from '@hookform/resolvers/zod'
import { useForm } from 'react-hook-form'
import { Link, useNavigate, useParams } from 'react-router-dom'
import {
  ArrowLeft,
  ArrowRight,
  BookOpen,
  Check,
  ChevronRight,
  CircleHelp,
  FileDown,
  FileText,
  Info,
  LaptopMinimal,
  Pencil,
  Plus,
  RotateCcw,
  X,
} from 'lucide-react'
import {
  Button,
  EmptyState,
  Field,
  Input,
  Select,
  StatusBanner,
  Textarea,
  useToast,
} from '@propuestas/ui'
import {
  equationCorrectionSchema,
  getEquationFixture,
  getEquationScenarioLabel,
  type EquationCorrectionValues,
  type EquationRecognitionPayload,
  type EquationRecognitionResult,
  type EquationScenarioId,
} from '../domain/equation'
import {
  createInsertedEquation,
  getNotebookColorClasses,
  getPageEquationReferences,
  notebookColorOptions,
  notebookSchema,
  notebookSubjectOptions,
  type Notebook,
  type NotebookFormValues,
  type NotebookPage,
} from '../domain/notebook'
import { useNotebookStore, getNotebook, getPage } from '../state/notebook-store'
import { CanvasBoard } from './canvas-board'
export { EditorPage } from './editor-page'
import {
  actionLinkClass,
  ColorSwatch,
  ConfirmDialog,
  ConfidenceSummary,
  CopyLatexButton,
  EmptyNotebookIcon,
  EquationCode,
  LocalBoundary,
  MathFormula,
  MotionReveal,
  NotebookMetric,
  NotebookShell,
  NotFoundPanel,
  PageIntro,
  ReviewHeader,
  SmallHint,
  StatusPill,
} from './ui'

const subjectFilters = ['Todos', ...notebookSubjectOptions.map((option) => option.value)] as const

export function HomePage() {
  const notebooks = useNotebookStore((state) => state.notebooks)
  const [subjectFilter, setSubjectFilter] = useState<(typeof subjectFilters)[number]>('Todos')
  const [query, setQuery] = useState('')
  const visibleNotebooks = notebooks.filter((notebook) => {
    const matchesSubject = subjectFilter === 'Todos' || notebook.subject === subjectFilter
    const normalizedQuery = query.trim().toLocaleLowerCase()
    return matchesSubject && (!normalizedQuery || `${notebook.title} ${notebook.subject}`.toLocaleLowerCase().includes(normalizedQuery))
  })
  const pageCount = notebooks.reduce((total, notebook) => total + notebook.pages.length, 0)
  const equationCount = notebooks.reduce((total, notebook) => total + notebook.pages.reduce((pageTotal, page) => pageTotal + page.equations.length, 0), 0)

  return (
    <NotebookShell>
      <MotionReveal>
        <PageIntro
          eyebrow="Tu espacio de estudio"
          title="Pensá con claridad. Escribí como quieras."
          description="Un cuaderno local para conservar tu trazo, revisar una propuesta digital y seguir resolviendo sin perder el hilo."
        >
          <Link className={`${actionLinkClass} bg-primary text-white shadow-quiet hover:-translate-y-0.5 hover:bg-primary/90`} to="/cuadernos/nuevo">
            Crear cuaderno
            <span className="inline-flex h-7 w-7 items-center justify-center rounded-full bg-white/15" aria-hidden="true"><Plus className="h-4 w-4" /></span>
          </Link>
        </PageIntro>
      </MotionReveal>

      <MotionReveal delay={0.06}>
        <div className="grid gap-3 sm:grid-cols-3">
          <NotebookMetric label="Cuadernos" value={String(notebooks.length).padStart(2, '0')} />
          <NotebookMetric label="Páginas locales" value={String(pageCount).padStart(2, '0')} />
          <NotebookMetric label="Ecuaciones guardadas" value={String(equationCount).padStart(2, '0')} />
        </div>
      </MotionReveal>

      <MotionReveal delay={0.1}>
        <div className="mt-8">
          <LocalBoundary>
            Los datos viven sólo en esta demostración y se reinician al recargar. La propuesta matemática es una ayuda de transcripción, no un OCR general ni un solver.
          </LocalBoundary>
        </div>
      </MotionReveal>

      <MotionReveal delay={0.14}>
        <section className="mt-12" aria-labelledby="notebooks-heading">
          <div className="flex flex-col gap-5 lg:flex-row lg:items-end lg:justify-between">
            <div>
              <span className="eyebrow">Biblioteca local</span>
              <h2 id="notebooks-heading" className="mt-4 font-display text-3xl font-bold tracking-[-0.05em] text-ink md:text-4xl">Mis cuadernos</h2>
              <p className="mt-2 text-base leading-7 text-muted">Agrupá tus páginas por materia y volvé a la última idea que estabas pensando.</p>
            </div>
            <Link className={`${actionLinkClass} self-start bg-surface text-primary ring-1 ring-inset ring-primary/20 hover:bg-primary/[0.06] lg:self-auto`} to="/cuadernos/nuevo">
              Nuevo cuaderno
              <Plus aria-hidden="true" className="h-4 w-4" />
            </Link>
          </div>

          <div className="mt-8 flex flex-col gap-4 rounded-[1.5rem] bg-surface/70 p-3 ring-1 ring-inset ring-line/60 sm:flex-row sm:items-center sm:justify-between">
            <div className="flex flex-wrap gap-2" role="group" aria-label="Filtrar cuadernos por materia">
              {subjectFilters.map((subject) => (
                <button
                  className={`focus-ring min-h-11 rounded-full px-4 py-2 text-sm font-semibold transition-[background-color,color,transform] duration-280 ease-spring hover:-translate-y-0.5 ${subjectFilter === subject ? 'bg-primary text-white' : 'text-muted hover:bg-primary/[0.08] hover:text-primary'}`}
                  key={subject}
                  type="button"
                  aria-pressed={subjectFilter === subject}
                  onClick={() => setSubjectFilter(subject)}
                >
                  {subject}
                </button>
              ))}
            </div>
            <label className="flex min-h-11 w-full items-center gap-2 rounded-full bg-paper px-4 text-sm text-muted ring-1 ring-inset ring-line/70 sm:max-w-xs">
              <span className="sr-only">Buscar cuaderno</span>
              <LaptopMinimal aria-hidden="true" className="h-4 w-4 shrink-0 text-primary" />
              <input className="min-w-0 flex-1 bg-transparent py-2 text-base text-ink outline-none placeholder:text-muted/75" value={query} onChange={(event) => setQuery(event.target.value)} placeholder="Buscar por nombre" />
            </label>
          </div>

          {visibleNotebooks.length === 0 ? (
            <div className="mt-6">
              <EmptyState title="No hay cuadernos con este filtro" icon={<EmptyNotebookIcon />} action={<Button variant="secondary" onClick={() => { setSubjectFilter('Todos'); setQuery('') }}>Limpiar filtros</Button>}>
                Probá con otra materia o creá un cuaderno nuevo. Este espacio no representa contenido sincronizado fuera de la demostración.
              </EmptyState>
            </div>
          ) : (
            <div className="mt-6 grid gap-5 md:grid-cols-2">
              {notebookSubjectOptions.map((subject, index) => {
                const group = visibleNotebooks.filter((notebook) => notebook.subject === subject.value)
                if (group.length === 0) return null
                return (
                  <div className={`${index === 0 ? 'md:col-span-2' : ''} space-y-3`} key={subject.value}>
                    <div className="flex items-center gap-3 px-1"><span className="h-2 w-2 rounded-full bg-accent" aria-hidden="true" /><h3 className="text-sm font-bold uppercase tracking-[0.16em] text-muted">{subject.label}</h3><span className="h-px flex-1 bg-line/70" aria-hidden="true" /></div>
                    <div className="grid gap-5 lg:grid-cols-2">{group.map((notebook) => <NotebookCard key={notebook.id} notebook={notebook} featured={index === 0} />)}</div>
                  </div>
                )
              })}
            </div>
          )}
        </section>
      </MotionReveal>
    </NotebookShell>
  )
}

function NotebookCard({ notebook, featured = false }: { notebook: Notebook; featured?: boolean }) {
  const colors = getNotebookColorClasses(notebook.color)
  const equationCount = notebook.pages.reduce((total, page) => total + page.equations.length, 0)
  const firstPage = notebook.pages[0]
  return (
    <div className="bezel h-full">
      <Link className="bezel-core group block h-full p-5 transition-[transform,box-shadow,background-color] duration-280 ease-spring hover:-translate-y-1 hover:shadow-quiet sm:p-6" to={`/cuadernos/${notebook.id}`}>
        <div className="flex items-start justify-between gap-4">
          <div className="flex items-center gap-3"><ColorSwatch color={notebook.color} /><div><p className="text-xs font-semibold uppercase tracking-[0.14em] text-muted">{notebook.subject}</p><h3 className="mt-1 font-display text-xl font-bold tracking-[-0.04em] text-ink">{notebook.title}</h3></div></div>
          <ChevronRight aria-hidden="true" className="h-5 w-5 shrink-0 text-primary transition-transform duration-280 ease-spring group-hover:translate-x-1" />
        </div>
        <div className={`relative mt-6 overflow-hidden rounded-[1.25rem] p-5 ${colors.soft} ${featured ? 'min-h-36' : 'min-h-28'}`}>
          <div className={`absolute inset-x-0 top-0 h-1.5 ${colors.accent}`} aria-hidden="true" />
          <p className="font-mono text-lg font-semibold leading-8 tracking-[-0.04em] text-ink">{firstPage?.equations[0]?.tex ?? 'x = x₀ + v₀t + ½at²'}</p>
          <p className="mt-3 max-w-sm text-sm leading-6 text-muted">{firstPage?.note || 'Una página lista para recibir tu próximo trazo.'}</p>
        </div>
        <div className="mt-5 grid grid-cols-3 gap-2 text-sm"><span><strong className="block font-mono text-lg text-ink">{notebook.pages.length}</strong><span className="text-muted">páginas</span></span><span><strong className="block font-mono text-lg text-ink">{equationCount}</strong><span className="text-muted">ecuaciones</span></span><span><strong className="block font-mono text-lg text-ink">{notebook.progress}%</strong><span className="text-muted">avance</span></span></div>
        <div className="mt-5 flex items-center justify-between gap-3 border-t border-line/70 pt-4 text-xs font-semibold text-muted"><span>Última actividad</span><span className="text-ink">{notebook.lastActivity}</span></div>
      </Link>
    </div>
  )
}

export function NewNotebookPage() {
  const navigate = useNavigate()
  const addNotebook = useNotebookStore((state) => state.addNotebook)
  const [cancelOpen, setCancelOpen] = useState(false)
  const { register, handleSubmit, formState: { errors, isSubmitting, isDirty } } = useForm<NotebookFormValues>({
    resolver: zodResolver(notebookSchema),
    defaultValues: { title: '', subject: 'Física', color: 'cobalt' },
  })

  const onSubmit = (values: NotebookFormValues) => {
    const id = addNotebook(values)
    navigate(`/cuadernos/${id}`)
  }

  return (
    <NotebookShell>
      <MotionReveal>
        <div className="mx-auto max-w-3xl py-8 md:py-14">
          <Link className="focus-ring inline-flex min-h-11 items-center gap-2 rounded-full px-3 text-sm font-semibold text-muted hover:bg-primary/[0.07] hover:text-primary" to="/"><ArrowLeft aria-hidden="true" className="h-4 w-4" />Volver a mis cuadernos</Link>
          <PageIntro eyebrow="Nuevo espacio" title="Dale una forma a lo que estás estudiando." description="Elegí una materia y un color. Después vas a poder sumar páginas, trazos y ecuaciones revisadas." />
          <div className="bezel">
            <form className="bezel-core space-y-8 p-6 sm:p-8" onSubmit={handleSubmit(onSubmit)} noValidate>
              <Field label="Nombre del cuaderno" htmlFor="notebook-title" hint="Usá un nombre que te ayude a ubicar el tema rápidamente." error={errors.title?.message} required>
                <Input id="notebook-title" autoFocus placeholder="Ej. Cinemática y movimiento" {...register('title')} />
              </Field>
              <Field label="Materia" htmlFor="notebook-subject" hint="Los cuadernos se agrupan por esta materia." error={errors.subject?.message} required>
                <Select id="notebook-subject" {...register('subject')}>
                  {notebookSubjectOptions.map((option) => <option key={option.value} value={option.value}>{option.label}</option>)}
                </Select>
              </Field>
              <fieldset>
                <legend className="text-sm font-semibold text-ink">Color de identificación <span aria-hidden="true" className="text-error">*</span></legend>
                <p className="mt-2 text-sm leading-6 text-muted">Elegí una tinta para reconocer el cuaderno de un vistazo.</p>
                <div className="mt-4 grid gap-3 sm:grid-cols-2">
                  {notebookColorOptions.map((option) => (
                    <label className="group cursor-pointer" key={option.value}>
                      <input className="peer sr-only" type="radio" value={option.value} {...register('color')} />
                      <span className="flex min-h-16 items-center gap-3 rounded-xl bg-paper px-4 ring-1 ring-inset ring-line/70 transition-[background-color,box-shadow,transform] duration-280 ease-spring group-hover:-translate-y-0.5 group-hover:ring-primary/35 peer-checked:bg-primary/[0.06] peer-checked:ring-2 peer-checked:ring-primary">
                        <ColorSwatch color={option.value} /><span className="text-sm font-semibold text-ink">{option.label}</span><Check aria-hidden="true" className="ml-auto h-5 w-5 text-primary opacity-0 transition-opacity duration-280 ease-spring peer-checked:opacity-100" />
                      </span>
                    </label>
                  ))}
                </div>
                {errors.color?.message ? <p className="mt-2 text-sm font-medium text-error" role="alert">{errors.color.message}</p> : null}
              </fieldset>
              <LocalBoundary>
                Este cuaderno queda en memoria local de la demo. No se sincroniza con una cuenta ni con otro dispositivo.
              </LocalBoundary>
              <div className="flex flex-col-reverse gap-3 border-t border-line/70 pt-6 sm:flex-row sm:justify-end">
                <Button type="button" variant="secondary" onClick={() => isDirty ? setCancelOpen(true) : navigate('/')}>Cancelar</Button>
                <Button type="submit" loading={isSubmitting} leadingIcon={<Plus aria-hidden="true" className="h-4 w-4" />} trailingIcon={<ArrowRight aria-hidden="true" className="h-4 w-4" />}>Crear cuaderno</Button>
              </div>
            </form>
          </div>
        </div>
      </MotionReveal>
      <ConfirmDialog open={cancelOpen} title="¿Salir sin crear el cuaderno?" description="Todavía hay datos en este formulario. Podés seguir editando o descartarlos; nada se guardó fuera de esta demostración." confirmLabel="Descartar borrador" onCancel={() => setCancelOpen(false)} onConfirm={() => navigate('/')} />
    </NotebookShell>
  )
}

export function NotebookPageView() {
  const { notebookId } = useParams()
  const navigate = useNavigate()
  const notebooks = useNotebookStore((state) => state.notebooks)
  const addPage = useNotebookStore((state) => state.addPage)
  const notebook = getNotebook(notebooks, notebookId)

  if (!notebook) return <NotFoundPanel title="No encontramos este cuaderno" description="El cuaderno puede pertenecer a otra demostración local o la ruta ya no existe." />

  const equationCount = notebook.pages.reduce((total, page) => total + page.equations.length, 0)
  const handleNewPage = () => {
    const pageId = addPage(notebook.id)
    if (pageId) navigate(`/cuadernos/${notebook.id}/paginas/${pageId}`)
  }

  return (
    <NotebookShell>
      <MotionReveal>
        <div className="flex flex-wrap items-center justify-between gap-3 pb-4 pt-8 md:pt-12">
          <Link className="focus-ring inline-flex min-h-11 items-center gap-2 rounded-full px-3 text-sm font-semibold text-muted hover:bg-primary/[0.07] hover:text-primary" to="/"><ArrowLeft aria-hidden="true" className="h-4 w-4" />Todos los cuadernos</Link>
          <span className="inline-flex min-h-8 items-center gap-2 rounded-full bg-primary/[0.08] px-3 py-1 text-xs font-semibold text-primary"><span className="h-2 w-2 rounded-full bg-primary" aria-hidden="true" />{notebook.subject}</span>
        </div>
        <div className="grid gap-8 pb-10 md:grid-cols-[minmax(0,1fr)_auto] md:items-end">
          <div>
            <span className="eyebrow">Cuaderno local</span>
            <h1 className="mt-5 max-w-3xl font-display text-[clamp(2.3rem,6vw,4.8rem)] font-bold leading-[0.96] tracking-[-0.06em] text-ink">{notebook.title}</h1>
            <p className="mt-4 max-w-2xl text-base leading-7 text-muted">Abrí una página para escribir, revisar una ecuación o continuar desde tu última nota.</p>
          </div>
          <Button leadingIcon={<Plus aria-hidden="true" className="h-4 w-4" />} trailingIcon={<ArrowRight aria-hidden="true" className="h-4 w-4" />} onClick={handleNewPage}>Nueva página</Button>
        </div>
      </MotionReveal>

      <MotionReveal delay={0.06}>
        <div className="grid gap-3 sm:grid-cols-3">
          <NotebookMetric label="Avance" value={`${notebook.progress}%`} />
          <NotebookMetric label="Páginas" value={String(notebook.pages.length).padStart(2, '0')} />
          <NotebookMetric label="Ecuaciones" value={String(equationCount).padStart(2, '0')} />
        </div>
        <div className="mt-5 h-2 overflow-hidden rounded-full bg-primary/[0.1]" role="progressbar" aria-label={`Avance de ${notebook.title}`} aria-valuemin={0} aria-valuemax={100} aria-valuenow={notebook.progress}><div className="h-full origin-left rounded-full bg-primary transition-transform duration-700 ease-spring" style={{ transform: `scaleX(${notebook.progress / 100})` }} /></div>
      </MotionReveal>

      <MotionReveal delay={0.11}>
        <section className="mt-12" aria-labelledby="pages-heading">
          <div className="flex flex-wrap items-end justify-between gap-4"><div><span className="eyebrow">Contenido</span><h2 id="pages-heading" className="mt-4 font-display text-3xl font-bold tracking-[-0.05em] text-ink">Páginas del cuaderno</h2></div><p className="text-sm text-muted">Última actividad: <strong className="text-ink">{notebook.lastActivity}</strong></p></div>
          <div className="mt-6 grid gap-5 md:grid-cols-2">
            {notebook.pages.map((page, index) => <PageCard key={page.id} notebook={notebook} page={page} featured={index === 0} />)}
            <button className="focus-ring flex min-h-60 flex-col items-center justify-center rounded-[1.5rem] border border-dashed border-primary/30 bg-primary/[0.035] p-6 text-center transition-[background-color,transform,border-color] duration-280 ease-spring hover:-translate-y-1 hover:border-primary/60 hover:bg-primary/[0.07]" type="button" onClick={handleNewPage}>
              <span className="inline-flex h-12 w-12 items-center justify-center rounded-full bg-primary text-white"><Plus aria-hidden="true" className="h-5 w-5" /></span>
              <span className="mt-4 font-display text-xl font-bold tracking-[-0.04em] text-ink">Crear otra página</span>
              <span className="mt-2 max-w-xs text-sm leading-6 text-muted">Separá una idea nueva sin perder las páginas que ya revisaste.</span>
            </button>
          </div>
        </section>
      </MotionReveal>
      <div className="mt-10"><LocalBoundary>Las páginas y ecuaciones de este cuaderno son temporales. No representan un historial académico sincronizado.</LocalBoundary></div>
    </NotebookShell>
  )
}

function PageCard({ notebook, page, featured = false }: { notebook: Notebook; page: NotebookPage; featured?: boolean }) {
  const colors = getNotebookColorClasses(notebook.color)
  return (
    <Link className={`bezel group ${featured ? 'md:col-span-2' : ''}`} to={`/cuadernos/${notebook.id}/paginas/${page.id}`}>
      <div className="bezel-core flex h-full min-h-60 flex-col p-5 transition-[background-color,box-shadow,transform] duration-280 ease-spring group-hover:-translate-y-1 group-hover:shadow-quiet sm:p-6">
        <div className="flex items-start justify-between gap-4"><div><span className={`inline-flex h-8 items-center gap-2 rounded-full px-3 text-xs font-semibold ${colors.soft} text-ink`}><BookOpen aria-hidden="true" className="h-3.5 w-3.5" />Página {page.title.replace('Página ', '')}</span><h3 className="mt-5 font-display text-2xl font-bold tracking-[-0.05em] text-ink">{page.title}</h3></div><ChevronRight aria-hidden="true" className="h-5 w-5 text-primary transition-transform duration-280 ease-spring group-hover:translate-x-1" /></div>
        <p className="mt-4 max-w-xl flex-1 text-sm leading-6 text-muted">{page.note || 'Todavía no hay una nota escrita en esta página.'}</p>
        <div className="mt-6 flex flex-wrap gap-2 border-t border-line/70 pt-4 text-xs font-semibold text-muted"><span>{page.strokes.length} trazos</span><span aria-hidden="true">·</span><span>{page.equations.length} ecuaciones</span><span aria-hidden="true">·</span><span>Editada {page.lastEdited.toLowerCase()}</span></div>
      </div>
    </Link>
  )
}

export function EquationReviewPage() {
  const { show } = useToast()
  const navigate = useNavigate()
  const notebooks = useNotebookStore((state) => state.notebooks)
  const activeNotebookId = useNotebookStore((state) => state.activeNotebookId)
  const activePageId = useNotebookStore((state) => state.activePageId)
  const recognition = useNotebookStore((state) => state.recognition)
  const beginRecognition = useNotebookStore((state) => state.beginRecognition)
  const retryRecognition = useNotebookStore((state) => state.retryRecognition)
  const clearRecognition = useNotebookStore((state) => state.clearRecognition)
  const applyCorrection = useNotebookStore((state) => state.applyCorrection)
  const insertEquation = useNotebookStore((state) => state.insertEquation)
  const notebook = getNotebook(notebooks, activeNotebookId)
  const page = getPage(notebook, activePageId)
  const startedRef = useRef(false)
  const [correctionOpen, setCorrectionOpen] = useState(false)
  const { register, handleSubmit, reset, formState: { errors } } = useForm<EquationCorrectionValues>({ resolver: zodResolver(equationCorrectionSchema), defaultValues: { latex: '' } })

  useEffect(() => {
    if (recognition.phase !== 'idle' || !notebook || !page || startedRef.current) return
    startedRef.current = true
    const fixture = getEquationFixture('equation-kinematics')
    beginRecognition({ source: 'fixture', expression: fixture.tex, fixtureId: fixture.id, strokes: page.strokes, existingEntries: getPageEquationReferences(notebook, page) }, 'equation-success-high')
  }, [beginRecognition, notebook, page, recognition.phase])

  if (!notebook || !page) return <NotFoundPanel title="No hay una página activa" description="Volvé a un cuaderno y abrí una página para revisar una ecuación." />

  const result = recognition.result
  const payload: EquationRecognitionPayload | null = result && 'recognition' in result ? result.recognition : null
  const currentTex = recognition.correctionTex ?? payload?.recognizedTex ?? ''
  const hasCorrection = Boolean(recognition.correctionTex)

  const goBackToEditor = () => navigate(`/cuadernos/${notebook.id}/paginas/${page.id}`)
  const keepHandwritten = () => {
    clearRecognition()
    show({ title: 'Se mantiene la escritura manuscrita', message: 'La propuesta digital no se insertó en la página.', variant: 'info' })
    goBackToEditor()
  }
  const cancelReview = () => {
    clearRecognition()
    goBackToEditor()
  }
  const openCorrection = (latex = currentTex) => {
    reset({ latex })
    setCorrectionOpen(true)
  }
  const submitCorrection = (values: EquationCorrectionValues) => {
    applyCorrection(values.latex)
    setCorrectionOpen(false)
    show({ title: 'Corrección lista para revisar', message: 'La expresión corregida está marcada como entrada del usuario.', variant: 'success' })
  }
  const acceptEquation = () => {
    if (!payload || !currentTex || (result?.status === 'low_confidence' && !hasCorrection)) return
    const equation = createInsertedEquation(page, payload, currentTex, hasCorrection)
    insertEquation(equation)
    show({ title: 'Ecuación insertada', message: 'Se agregó a la página y tus trazos manuscritos siguen intactos.', variant: 'success' })
    goBackToEditor()
  }
  const startWithExpression = (expression: string, scenario: EquationScenarioId = 'equation-success-high') => {
    const fixture = getEquationFixture('equation-kinematics')
    beginRecognition({ source: 'typed', expression, fixtureId: fixture.id, strokes: page.strokes, existingEntries: getPageEquationReferences(notebook, page) }, scenario)
  }

  return (
    <NotebookShell>
      <MotionReveal>
        <div className="flex flex-wrap items-center justify-between gap-3 pb-5 pt-8 md:pt-12"><div><Link className="focus-ring inline-flex min-h-11 items-center gap-2 rounded-full px-3 text-sm font-semibold text-muted hover:bg-primary/[0.07] hover:text-primary" to={`/cuadernos/${notebook.id}/paginas/${page.id}`}><ArrowLeft aria-hidden="true" className="h-4 w-4" />Volver a la página</Link></div><ReviewHeader scenarioId={recognition.pending?.scenarioId ?? result?.scenarioId ?? 'equation-success-high'} /></div>
        <div className="grid gap-8 pb-10 lg:grid-cols-[minmax(0,0.82fr)_minmax(0,1.18fr)] lg:items-start">
          <section className="space-y-5" aria-labelledby="handwriting-heading"><div><span className="eyebrow">Tu manuscrito</span><h1 id="handwriting-heading" className="mt-4 font-display text-3xl font-bold tracking-[-0.05em] text-ink md:text-4xl">La escritura no se reemplaza.</h1><p className="mt-3 text-sm leading-6 text-muted">La superficie original queda visible durante toda la revisión.</p></div><div className="bezel"><div className="bezel-core overflow-hidden"><div className="grid-paper relative p-3 sm:p-5"><CanvasBoard strokes={page.strokes} readOnly />{page.strokes.length === 0 ? <div className="pointer-events-none absolute inset-0 flex items-center justify-center p-5 text-center"><div className="rounded-2xl bg-white/85 px-5 py-4 ring-1 ring-inset ring-white"><Pencil aria-hidden="true" className="mx-auto h-5 w-5 text-primary" /><p className="mt-2 text-sm font-semibold text-ink">Fixture local en revisión</p><p className="mt-1 max-w-xs text-xs leading-5 text-muted">No hay trazos nuevos en esta página, así que la propuesta parte de una ecuación curada.</p></div></div> : null}</div><div className="border-t border-line/70 bg-surface px-5 py-4"><SmallHint icon={<Info aria-hidden="true" className="h-4 w-4" />}>Podés continuar escribiendo aunque la propuesta esté abierta.</SmallHint></div></div></div></section>

          <section aria-labelledby="proposal-heading">
            <div className="bezel"><div className="bezel-core p-5 sm:p-7">
              <div className="flex flex-wrap items-center justify-between gap-3"><div><span className="eyebrow">Revisión explícita</span><h2 id="proposal-heading" className="mt-4 font-display text-3xl font-bold tracking-[-0.05em] text-ink">Propuesta digital</h2></div>{result && result.status !== 'error' ? <StatusPill status={result.status} /> : null}</div>
              {recognition.phase === 'loading' || !result ? <ReviewLoading scenarioId={recognition.pending?.scenarioId ?? 'equation-success-high'} onCancel={cancelReview} /> : result.status === 'error' ? <ReviewError result={result} onRetry={retryRecognition} onCancel={cancelReview} /> : result.status === 'no_match' ? <ReviewNoMatch result={result} onTryExample={() => startWithExpression(getEquationFixture('equation-kinematics').tex)} onEdit={() => goBackToEditor()} onCancel={cancelReview} /> : payload ? (
                <div className="mt-7 space-y-6">
                  {result.status === 'low_confidence' ? <StatusBanner title="Necesitamos tu revisión" variant="warning">El símbolo <strong>{payload.ambiguousTokens.join(', ')}</strong> no se interpreta con suficiente seguridad. Corregilo antes de aceptar la propuesta.</StatusBanner> : null}
                  {result.status === 'duplicate' ? <StatusBanner title="Esta ecuación ya aparece en el cuaderno" variant="info">Podés abrir la entrada existente o guardar otra copia de forma consciente. La demostración no crea duplicados automáticamente.</StatusBanner> : null}
                  <div className="formula-card formula-card-large"><p className="text-xs font-semibold uppercase tracking-[0.15em] text-muted">Resultado renderizado</p><MathFormula tex={currentTex} label="Resultado matemático propuesto" /></div>
                  <div className="grid gap-4 sm:grid-cols-2"><div className="rounded-xl bg-paper p-4 ring-1 ring-inset ring-line/70"><p className="text-xs font-semibold uppercase tracking-[0.14em] text-muted">Expresión normalizada</p><p className="mt-3 text-sm font-semibold leading-6 text-ink">{hasCorrection ? currentTex : payload.normalizedExpression}</p></div><div className="rounded-xl bg-paper p-4 ring-1 ring-inset ring-line/70"><p className="text-xs font-semibold uppercase tracking-[0.14em] text-muted">Origen de la lectura</p><p className="mt-3 text-sm font-semibold leading-6 text-ink">{hasCorrection ? 'Corrección escrita por vos' : 'Reconocimiento simulado'}</p></div></div>
                  <ConfidenceSummary confidence={payload.confidence} />
                  <div><div className="flex flex-wrap items-center justify-between gap-3"><p className="text-sm font-semibold text-ink">Código LaTeX</p><CopyLatexButton tex={currentTex} /></div><div className="mt-3"><EquationCode tex={currentTex} /></div></div>
                  {payload.alternatives.length > 0 ? <div className="rounded-xl bg-[#F7F4FF] p-4 ring-1 ring-inset ring-[#7257D9]/20"><p className="text-sm font-semibold text-[#4D3B99]">Alternativas para comparar</p><div className="mt-3 grid gap-2">{payload.alternatives.map((alternative) => <button className="focus-ring flex min-h-12 items-center justify-between gap-3 rounded-xl bg-white/75 px-3 text-left text-sm font-semibold text-ink transition-[background-color,transform] duration-280 ease-spring hover:-translate-y-0.5 hover:bg-white" key={alternative.label} type="button" onClick={() => openCorrection(alternative.tex)}><span>{alternative.label}</span><ChevronRight aria-hidden="true" className="h-4 w-4 text-primary" /></button>)}</div></div> : null}
                  {correctionOpen ? <form className="rounded-2xl bg-[#EAF0FF] p-4 ring-1 ring-inset ring-primary/15" onSubmit={handleSubmit(submitCorrection)} noValidate><div className="flex items-start justify-between gap-4"><div><p className="text-sm font-semibold text-ink">Corregí un símbolo o la expresión completa</p><p className="mt-1 text-xs leading-5 text-muted">Sólo se renderizan fórmulas locales con sintaxis matemática controlada.</p></div><button className="focus-ring inline-flex min-h-11 min-w-11 items-center justify-center rounded-full text-muted hover:bg-white/70 hover:text-ink" type="button" aria-label="Cerrar corrección" onClick={() => setCorrectionOpen(false)}><X aria-hidden="true" className="h-4 w-4" /></button></div><label className="sr-only" htmlFor="latex-correction">Código LaTeX corregido</label><Textarea id="latex-correction" className="mt-4 min-h-28 bg-white" {...register('latex')} />{errors.latex?.message ? <p className="mt-2 text-sm font-medium text-error" role="alert">{errors.latex.message}</p> : null}<Button className="mt-4" type="submit" leadingIcon={<Check aria-hidden="true" className="h-4 w-4" />}>Usar corrección</Button></form> : null}
                  <div className="flex flex-col gap-3 border-t border-line/70 pt-6"><div className="flex flex-col gap-3 sm:flex-row sm:flex-wrap"><Button disabled={result.status === 'low_confidence' && !hasCorrection} leadingIcon={<Check aria-hidden="true" className="h-4 w-4" />} onClick={acceptEquation}>{result.status === 'duplicate' ? 'Guardar de todos modos' : hasCorrection ? 'Aceptar corrección' : 'Aceptar'}</Button><Button variant="secondary" leadingIcon={<Pencil aria-hidden="true" className="h-4 w-4" />} onClick={() => openCorrection()}>Corregir</Button>{result.status === 'duplicate' && result.duplicate ? <Button variant="secondary" leadingIcon={<BookOpen aria-hidden="true" className="h-4 w-4" />} onClick={() => navigate(`/cuadernos/${result.duplicate?.notebookId}/paginas/${result.duplicate?.pageId}`)}>Ver existente</Button> : null}</div><div className="flex flex-col gap-2 sm:flex-row sm:flex-wrap"><Button size="sm" variant="ghost" onClick={goBackToEditor}>Continuar escribiendo</Button><Button size="sm" variant="ghost" onClick={keepHandwritten}>Mantener manuscrita</Button><Button size="sm" variant="ghost" onClick={cancelReview}>Cancelar</Button></div></div>
                </div>
              ) : null}
            </div></div>
          </section>
        </div>
      </MotionReveal>
      <LocalBoundary>Esta demostración usa datos simulados; no es una predicción real. Reconocer, aceptar o corregir no implica resolver ni verificar la ecuación.</LocalBoundary>
    </NotebookShell>
  )
}

function ReviewLoading({ scenarioId, onCancel }: { scenarioId: EquationScenarioId; onCancel: () => void }) {
  return <div className="mt-8 space-y-6"><div className="rounded-2xl bg-[#17213B] p-6 text-white sm:p-8"><div className="flex items-center gap-3"><span className="relative inline-flex h-10 w-10 items-center justify-center rounded-full bg-white/10"><span className="absolute inset-1 rounded-full border-2 border-white/15 border-t-[#F4C95D] animate-spring-spin" /><CircleHelp aria-hidden="true" className="h-4 w-4 text-[#F4C95D]" /></span><div><p className="font-display text-2xl font-bold tracking-[-0.04em]">Reconociendo ecuación...</p><p className="mt-1 text-sm text-white/70">Estamos preparando una propuesta para que la revises.</p></div></div><div className="mt-7 h-2 overflow-hidden rounded-full bg-white/10"><div className="h-full w-2/3 origin-left rounded-full bg-[#F4C95D] animate-recognition-progress" /></div><p className="mt-3 text-xs font-semibold uppercase tracking-[0.14em] text-white/60">Modo: {getEquationScenarioLabel(scenarioId)}</p></div><StatusBanner title="Solicitud en curso" variant="info">La acción está deshabilitada para evitar una solicitud duplicada. Tus trazos siguen conservados.</StatusBanner><Button variant="secondary" leadingIcon={<X aria-hidden="true" className="h-4 w-4" />} onClick={onCancel}>Cancelar</Button></div>
}

function ReviewError({ result, onRetry, onCancel }: { result: Extract<EquationRecognitionResult, { status: 'error' }>; onRetry: () => void; onCancel: () => void }) {
  return <div className="mt-8 space-y-6"><StatusBanner title="No pudimos reconocer la ecuación" variant="error">{result.error.message} El contenido de entrada se mantiene disponible para reintentar o continuar escribiendo.</StatusBanner><div className="flex flex-col gap-3 sm:flex-row"><Button leadingIcon={<RotateCcw aria-hidden="true" className="h-4 w-4" />} onClick={onRetry}>Reintentar</Button><Button variant="secondary" onClick={onCancel}>Cancelar</Button></div></div>
}

function ReviewNoMatch({ result, onTryExample, onEdit, onCancel }: { result: Extract<EquationRecognitionResult, { status: 'no_match' }>; onTryExample: () => void; onEdit: () => void; onCancel: () => void }) {
  return <div className="mt-8 space-y-6"><StatusBanner title="No pudimos reconocer una ecuación" variant="warning">La entrada <strong>{result.inputSummary}</strong> no coincide con una fixture comprensible. Esto no evalúa si la matemática está bien o mal.</StatusBanner><div className="rounded-2xl bg-paper p-5 ring-1 ring-inset ring-line/70"><p className="text-sm font-semibold text-ink">Podés probar una expresión local</p><div className="mt-4 grid gap-3">{result.alternatives.map((alternative) => <button className="focus-ring flex min-h-12 items-center justify-between gap-3 rounded-xl bg-surface px-4 text-left text-sm font-semibold text-ink ring-1 ring-inset ring-line/70 transition-[background-color,transform] duration-280 ease-spring hover:-translate-y-0.5 hover:bg-primary/[0.05]" type="button" key={alternative.label} onClick={onTryExample}><span>{alternative.label}</span><MathFormula tex={alternative.tex} compact label={alternative.label} /></button>)}</div></div><div className="flex flex-col gap-3 sm:flex-row sm:flex-wrap"><Button leadingIcon={<Pencil aria-hidden="true" className="h-4 w-4" />} onClick={onEdit}>Editar entrada</Button><Button variant="secondary" onClick={onTryExample}>Probar ejemplo</Button><Button variant="ghost" onClick={onCancel}>Cancelar</Button></div></div>
}

export function ExportPage() {
  const { show } = useToast()
  const notebooks = useNotebookStore((state) => state.notebooks)
  const [selectedNotebookId, setSelectedNotebookId] = useState(notebooks[0]?.id ?? '')
  const notebook = notebooks.find((item) => item.id === selectedNotebookId) ?? notebooks[0]
  const equations = notebook?.pages.flatMap((page) => page.equations.map((equation) => ({ ...equation, pageTitle: page.title }))) ?? []

  const download = (extension: 'md' | 'tex') => {
    if (!notebook) return
    const body = extension === 'md'
      ? `# ${notebook.title}\n\nMateria: ${notebook.subject}\n\n${notebook.pages.map((page) => `## ${page.title}\n\n${page.note || 'Sin nota.'}\n\n${page.equations.map((equation) => `$$\n${equation.tex}\n$$`).join('\n\n')}`).join('\n\n')}`
      : notebook.pages.flatMap((page) => page.equations.map((equation) => `% ${page.title}\n${equation.tex}`)).join('\n\n') || `% ${notebook.title}\n% No hay ecuaciones insertadas todavía.`
    const blob = new Blob([body], { type: extension === 'md' ? 'text/markdown;charset=utf-8' : 'application/x-tex;charset=utf-8' })
    const url = URL.createObjectURL(blob)
    const anchor = document.createElement('a')
    anchor.href = url
    anchor.download = `${notebook.title.toLocaleLowerCase().replace(/[^a-z0-9]+/g, '-')}.${extension}`
    document.body.appendChild(anchor)
    anchor.click()
    anchor.remove()
    URL.revokeObjectURL(url)
    show({ title: `Archivo .${extension} descargado`, message: 'La exportación se generó en tu dispositivo a partir de datos locales.', variant: 'success' })
  }

  return (
    <NotebookShell>
      <MotionReveal>
        <PageIntro eyebrow="Salida local" title="Llevá tus fórmulas con vos." description="Exportá una copia de la demostración sin enviar el cuaderno a un servidor. PDF abre la impresión local; Markdown y LaTeX descargan archivos reales." />
        {notebook ? <>
          <div className="bezel"><div className="bezel-core p-5 sm:p-7"><div className="flex flex-col gap-5 sm:flex-row sm:items-end sm:justify-between"><Field label="Cuaderno a exportar" htmlFor="export-notebook" hint="Elegí el cuaderno local que querés preparar."><Select id="export-notebook" value={notebook.id} onChange={(event) => setSelectedNotebookId(event.target.value)}>{notebooks.map((item) => <option key={item.id} value={item.id}>{item.title} · {item.subject}</option>)}</Select></Field><div className="text-sm text-muted"><strong className="font-mono text-xl text-ink">{equations.length}</strong> ecuaciones disponibles</div></div><div className="mt-7 grid gap-4 md:grid-cols-3"><ExportOption icon={<FileDown aria-hidden="true" className="h-5 w-5" />} title="PDF local" description="Abrir impresión del navegador." action="Preparar PDF" onClick={() => { window.print(); show({ title: 'Vista de impresión abierta', message: 'Podés elegir Guardar como PDF en el diálogo local.', variant: 'info' }) }} /><ExportOption icon={<FileText aria-hidden="true" className="h-5 w-5" />} title="Markdown" description="Notas y fórmulas para editar." action="Descargar .md" onClick={() => download('md')} /><ExportOption icon={<FileText aria-hidden="true" className="h-5 w-5" />} title="LaTeX" description="Fórmulas listas para un .tex." action="Descargar .tex" onClick={() => download('tex')} /></div></div></div>
          <div className="mt-8 grid gap-5 lg:grid-cols-[minmax(0,1fr)_20rem]"><div className="bezel"><div className="bezel-core p-5 sm:p-7"><span className="eyebrow">Vista previa</span><h2 className="mt-4 font-display text-2xl font-bold tracking-[-0.05em] text-ink">Contenido que saldrá</h2><div className="mt-5 space-y-3">{notebook.pages.map((page) => <div className="rounded-xl bg-paper p-4 ring-1 ring-inset ring-line/70" key={page.id}><div className="flex items-center justify-between gap-3"><p className="font-semibold text-ink">{page.title}</p><span className="text-xs text-muted">{page.equations.length} ecuaciones</span></div>{page.equations.length > 0 ? <div className="mt-4 grid gap-3 sm:grid-cols-2">{page.equations.map((equation) => <div className="formula-card formula-card-small" key={equation.id}><MathFormula tex={equation.tex} compact label={equation.label} /></div>)}</div> : <p className="mt-3 text-sm text-muted">Sin ecuaciones insertadas.</p>}</div>)}</div></div></div><LocalBoundary title="Confirmación local">Estas descargas se generan en tu navegador. No hay cuenta, pago, servidor ni almacenamiento permanente involucrado.</LocalBoundary></div>
        </> : <EmptyState title="No hay cuadernos para exportar" icon={<EmptyNotebookIcon />} action={<Link className={`${actionLinkClass} bg-primary text-white`} to="/cuadernos/nuevo">Crear cuaderno<Plus aria-hidden="true" className="h-4 w-4" /></Link>}>Primero creá un cuaderno local para preparar una salida.</EmptyState>}
      </MotionReveal>
    </NotebookShell>
  )
}

function ExportOption({ icon, title, description, action, onClick }: { icon: ReactNode; title: string; description: string; action: string; onClick: () => void }) {
  return <div className="rounded-2xl bg-paper p-5 ring-1 ring-inset ring-line/70"><span className="inline-flex h-10 w-10 items-center justify-center rounded-xl bg-primary/[0.09] text-primary">{icon}</span><h3 className="mt-4 font-display text-xl font-bold tracking-[-0.04em] text-ink">{title}</h3><p className="mt-2 min-h-12 text-sm leading-6 text-muted">{description}</p><Button className="mt-5 w-full" variant="secondary" onClick={onClick}>{action}</Button></div>
}
