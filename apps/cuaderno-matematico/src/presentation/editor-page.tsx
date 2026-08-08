import { useEffect, useState, type ReactNode } from 'react'
import { Link, useNavigate, useParams } from 'react-router-dom'
import {
  ArrowLeft,
  BookOpen,
  Check,
  ChevronRight,
  Eraser,
  Highlighter,
  Info,
  Pencil,
  Save,
  Sigma,
  Trash2,
  Undo2,
  Redo2,
} from 'lucide-react'
import { Button, EmptyState, Textarea, useToast } from '@propuestas/ui'
import type { EquationFixtureId, EquationScenarioId, InkStroke } from '../domain/equation'
import { getPageEquationReferences } from '../domain/notebook'
import type { InsertedEquation } from '../domain/notebook'
import { getNotebook, getPage, useNotebookStore } from '../state/notebook-store'
import { CanvasBoard } from './canvas-board'
import { EquationModePanel } from './equation-mode-panel'
import { NotebookEquationPreview } from './notebook-equation-preview'
import { useEquationRecognitionSchedule } from './use-equation-recognition'
import {
  CopyLatexButton,
  EmptyNotebookIcon,
  LocalBoundary,
  MathFormula,
  MotionReveal,
  NotebookShell,
  NotFoundPanel,
  SmallHint,
} from './ui'

export function EditorPage() {
  const { notebookId, pageId } = useParams()
  const navigate = useNavigate()
  const { show } = useToast()
  const notebooks = useNotebookStore((state) => state.notebooks)
  const setActivePage = useNotebookStore((state) => state.setActivePage)
  const selectedTool = useNotebookStore((state) => state.selectedTool)
  const brushSize = useNotebookStore((state) => state.brushSize)
  const setSelectedTool = useNotebookStore((state) => state.setSelectedTool)
  const setBrushSize = useNotebookStore((state) => state.setBrushSize)
  const commitStrokes = useNotebookStore((state) => state.commitStrokes)
  const undoStrokes = useNotebookStore((state) => state.undoStrokes)
  const redoStrokes = useNotebookStore((state) => state.redoStrokes)
  const clearStrokes = useNotebookStore((state) => state.clearStrokes)
  const clearRecognition = useNotebookStore((state) => state.clearRecognition)
  const updatePageNote = useNotebookStore((state) => state.updatePageNote)
  const beginRecognition = useNotebookStore((state) => state.beginRecognition)
  const insertEquation = useNotebookStore((state) => state.insertEquation)
  const removeEquation = useNotebookStore((state) => state.removeEquation)
  const recognition = useNotebookStore((state) => state.recognition)
  const notebook = getNotebook(notebooks, notebookId)
  const page = getPage(notebook, pageId)
  const [equationMode, setEquationMode] = useState(false)
  const [inputMode, setInputMode] = useState<'fixture' | 'typed'>('fixture')
  const [fixtureId, setFixtureId] = useState<EquationFixtureId>('equation-kinematics')
  const [scenarioId, setScenarioId] = useState<EquationScenarioId>('equation-success-high')
  const [typedExpression, setTypedExpression] = useState('')
  const { recognizeNow, scheduleHandwritingRecognition, cancelScheduledRecognition } = useEquationRecognitionSchedule({
    enabled: equationMode && Boolean(notebook && page),
    notebook,
    page,
    fixtureId,
    scenarioId,
    inputMode,
    typedExpression,
  })

  useEffect(() => {
    if (notebook && page) setActivePage(notebook.id, page.id)
  }, [notebook, page, setActivePage])

  if (!notebook || !page) return <NotFoundPanel title="No encontramos esta página" description="Volvé al cuaderno para abrir una página disponible en esta demostración." />

  const startRecognition = () => {
    const started = recognizeNow()
    if (!started) show({ title: 'Falta una ecuación', message: 'Escribí una expresión o cambiá a un ejemplo local antes de continuar.', variant: 'info' })
    return started
  }

  const handleStrokeCommit = (nextStrokes: InkStroke[]) => {
    commitStrokes(notebook.id, page.id, nextStrokes)
    if (!equationMode) return
    if (nextStrokes.length === 0) {
      cancelScheduledRecognition()
      clearRecognition()
      return
    }
    scheduleHandwritingRecognition(nextStrokes)
  }

  const handleClearStrokes = () => {
    cancelScheduledRecognition()
    clearStrokes(notebook.id, page.id)
    if (equationMode) clearRecognition()
  }

  const handleEquationInsert = (equation: InsertedEquation) => {
    setActivePage(notebook.id, page.id)
    insertEquation(equation)
    clearRecognition()
    setEquationMode(false)
    show({ title: 'Ecuación insertada', message: 'Se agregó a la página y tus trazos manuscritos siguen intactos.', variant: 'success' })
  }

  return (
    <NotebookShell>
      <MotionReveal>
        <div className="flex flex-wrap items-center justify-between gap-3 pb-5 pt-8 md:pt-12">
          <div className="flex min-w-0 items-center gap-2 text-sm font-semibold text-muted"><Link className="focus-ring inline-flex min-h-11 items-center gap-2 rounded-full px-3 hover:bg-primary/[0.07] hover:text-primary" to={`/cuadernos/${notebook.id}`}><ArrowLeft aria-hidden="true" className="h-4 w-4" />{notebook.title}</Link><ChevronRight aria-hidden="true" className="h-4 w-4 shrink-0" /><span className="truncate text-ink">{page.title}</span></div>
          <Button variant="secondary" leadingIcon={<Save aria-hidden="true" className="h-4 w-4" />} onClick={() => show({ title: 'Página guardada localmente', message: 'La demostración conserva tus trazos en esta sesión.', variant: 'success' })}>Guardar página</Button>
        </div>
        <div className="grid gap-8 pb-8 lg:grid-cols-[minmax(0,1fr)_23rem] lg:items-start">
          <section aria-labelledby="editor-heading">
            <div className="flex flex-wrap items-end justify-between gap-4"><div><span className="eyebrow">Área de escritura</span><h1 id="editor-heading" className="mt-4 font-display text-3xl font-bold tracking-[-0.05em] text-ink md:text-4xl">Escribí sin salirte del margen.</h1><p className="mt-2 max-w-2xl text-sm leading-6 text-muted">El trazo queda intacto mientras revisás una propuesta digital.</p></div><span className="inline-flex min-h-8 items-center gap-2 rounded-full bg-success/[0.09] px-3 py-1 text-xs font-semibold text-success"><span className="h-2 w-2 rounded-full bg-success" aria-hidden="true" />Guardado local</span></div>
            <div className="bezel mt-6">
              <div className="bezel-core overflow-hidden">
                <div className="flex flex-wrap items-center justify-between gap-3 border-b border-line/70 bg-surface px-4 py-3 sm:px-5">
                  <div className="flex flex-wrap items-center gap-2" role="toolbar" aria-label="Herramientas de escritura">
                    <EditorToolButton label="Lápiz" icon={<Pencil aria-hidden="true" className="h-4 w-4" />} active={selectedTool === 'pencil'} onClick={() => setSelectedTool('pencil')} />
                    <EditorToolButton label="Resaltador" icon={<Highlighter aria-hidden="true" className="h-4 w-4" />} active={selectedTool === 'highlighter'} onClick={() => setSelectedTool('highlighter')} />
                    <EditorToolButton label="Borrador" icon={<Eraser aria-hidden="true" className="h-4 w-4" />} active={selectedTool === 'eraser'} onClick={() => setSelectedTool('eraser')} />
                    <button className={`focus-ring inline-flex min-h-11 items-center gap-2 rounded-full px-3 text-xs font-semibold transition-[background-color,color,transform] duration-280 ease-spring hover:-translate-y-0.5 ${equationMode ? 'bg-primary text-white' : 'text-muted hover:bg-primary/[0.08] hover:text-primary'}`} type="button" aria-pressed={equationMode} onClick={() => setEquationMode((current) => !current)}><Sigma aria-hidden="true" className="h-4 w-4" /><span>Ecuación</span></button>
                    <span className="mx-1 h-6 w-px bg-line" aria-hidden="true" />
                    <EditorToolButton label="Deshacer" icon={<Undo2 aria-hidden="true" className="h-4 w-4" />} disabled={page.undoStack.length === 0} onClick={() => undoStrokes(notebook.id, page.id)} />
                    <EditorToolButton label="Rehacer" icon={<Redo2 aria-hidden="true" className="h-4 w-4" />} disabled={page.redoStack.length === 0} onClick={() => redoStrokes(notebook.id, page.id)} />
                    <EditorToolButton label="Limpiar" icon={<Trash2 aria-hidden="true" className="h-4 w-4" />} disabled={page.strokes.length === 0} onClick={handleClearStrokes} />
                  </div>
                  <label className="flex min-h-10 items-center gap-2 text-xs font-semibold text-muted"><span>Tamaño</span><input className="accent-primary" type="range" min="2" max="8" value={brushSize} onChange={(event) => setBrushSize(Number(event.target.value))} aria-label="Tamaño del trazo" /></label>
                </div>
                {equationMode ? <div className="flex flex-wrap items-center gap-3 border-b border-primary/15 bg-primary/[0.055] px-4 py-3 text-sm sm:px-5" aria-live="polite"><span className="inline-flex min-h-8 items-center gap-2 rounded-full bg-primary px-3 py-1 text-xs font-semibold text-white"><Sigma aria-hidden="true" className="h-3.5 w-3.5" />Modo ecuación</span><span className="text-muted">Los trazos se conservan y se proponen en LaTeX después de una pausa.</span></div> : null}
                 <div className="grid-paper p-3 sm:p-5">
                   <div className="relative">
                     <CanvasBoard canvasId="equation-canvas" strokes={page.strokes} tool={selectedTool} brushSize={brushSize} onCommit={handleStrokeCommit} />
                     {page.strokes.length === 0 ? <div className="pointer-events-none absolute inset-0 flex items-center justify-center p-6 text-center"><div className="max-w-xs rounded-2xl bg-white/80 px-5 py-4 shadow-quiet ring-1 ring-inset ring-white"><Pencil aria-hidden="true" className="mx-auto h-5 w-5 text-primary" /><p className="mt-2 text-sm font-semibold text-ink">Tu página está lista</p><p className="mt-1 text-xs leading-5 text-muted">Dibujá con mouse, lápiz táctil o dedo sobre el área cuadriculada.</p></div></div> : null}
                   </div>
                   <NotebookEquationPreview page={page} recognition={recognition} onInsert={handleEquationInsert} />
                 </div>
                <div className="flex flex-wrap items-center justify-between gap-3 border-t border-line/70 bg-surface px-4 py-3 sm:px-5"><SmallHint icon={<Info aria-hidden="true" className="h-4 w-4" />}>{equationMode ? 'Modo ecuación: se reconoce después de una pausa, sin bloquear el dibujo.' : 'El reconocimiento es una propuesta; nunca reemplaza tus trazos.'}</SmallHint><span className="text-xs font-semibold text-muted">{page.strokes.length} trazos en esta página</span></div>
              </div>
            </div>
          </section>

          <aside className="space-y-5" aria-label="Herramientas del cuaderno">
            <div className="bezel">
              <div className="bezel-core p-5 sm:p-6">
                <div className="flex items-start justify-between gap-4"><div><span className="eyebrow">Página</span><h2 className="mt-3 font-display text-2xl font-bold tracking-[-0.05em] text-ink">Notas rápidas</h2></div><BookOpen aria-hidden="true" className="h-5 w-5 text-primary" /></div>
                <label className="sr-only" htmlFor="page-note">Nota de la página</label><Textarea id="page-note" className="mt-5 min-h-36" value={page.note} onChange={(event) => updatePageNote(notebook.id, page.id, event.target.value)} placeholder="Escribí una idea, una duda o una pista..." />
                <p className="mt-2 text-xs leading-5 text-muted">Se guarda en el estado local de esta sesión.</p>
              </div>
            </div>
             <EquationModePanel active={equationMode} notebook={notebook} page={page} inputMode={inputMode} fixtureId={fixtureId} scenarioId={scenarioId} typedExpression={typedExpression} onToggle={() => setEquationMode((current) => !current)} onInputModeChange={setInputMode} onFixtureChange={setFixtureId} onScenarioChange={setScenarioId} onTypedExpressionChange={setTypedExpression} onRecognizeNow={startRecognition} onAcceptEquation={handleEquationInsert} onContinueWriting={() => document.getElementById('equation-canvas')?.focus()} />
          </aside>
        </div>
      </MotionReveal>

      <MotionReveal delay={0.08}>
        <section className="mt-4" aria-labelledby="inserted-heading"><div className="flex flex-wrap items-end justify-between gap-4"><div><span className="eyebrow">Resultado local</span><h2 id="inserted-heading" className="mt-4 font-display text-3xl font-bold tracking-[-0.05em] text-ink">Ecuaciones insertadas</h2></div><span className="text-sm text-muted">{page.equations.length} en esta página</span></div>
          {page.equations.length === 0 ? <div className="mt-6"><EmptyState title="Todavía no hay ecuaciones insertadas" icon={<EmptyNotebookIcon />} action={<Button onClick={() => { setEquationMode(true) }}>Abrir modo ecuación</Button>}>La escritura permanece en el lienzo. Cuando aceptes una propuesta, aparecerá acá como una entrada editable.</EmptyState></div> : <div className="mt-6 grid gap-4 md:grid-cols-2">{page.equations.map((equation) => <InsertedEquationCard key={equation.id} equation={equation} onEdit={() => { beginRecognition({ source: 'typed', expression: equation.tex, fixtureId: fixtureId, strokes: page.strokes, existingEntries: getPageEquationReferences(notebook, page) }, 'equation-success-high'); navigate('/ecuacion') }} onRemove={() => { removeEquation(notebook.id, page.id, equation.id); show({ title: 'Ecuación quitada', message: 'El trazo manuscrito sigue intacto en la página.', variant: 'info' }) }} />)}</div>}
        </section>
      </MotionReveal>
      <div className="mt-10"><LocalBoundary>La ecuación digital es una capa adicional de lectura. Mantener manuscrita siempre está disponible.</LocalBoundary></div>
    </NotebookShell>
  )
}

function EditorToolButton({ label, icon, active = false, disabled = false, onClick }: { label: string; icon: ReactNode; active?: boolean; disabled?: boolean; onClick: () => void }) {
  return <button className={`focus-ring inline-flex min-h-11 items-center gap-2 rounded-full px-3 text-xs font-semibold transition-[background-color,color,transform,opacity] duration-280 ease-spring hover:-translate-y-0.5 disabled:cursor-not-allowed disabled:opacity-35 ${active ? 'bg-primary text-white' : 'text-muted hover:bg-primary/[0.08] hover:text-primary'}`} type="button" aria-label={label} aria-pressed={active || undefined} disabled={disabled} onClick={onClick}>{icon}<span className="hidden sm:inline">{label}</span></button>
}

function InsertedEquationCard({ equation, onEdit, onRemove }: { equation: InsertedEquation; onEdit: () => void; onRemove: () => void }) {
  return <div className="bezel"><div className="bezel-core p-5"><div className="flex items-center justify-between gap-3"><span className="inline-flex min-h-8 items-center gap-2 rounded-full bg-success/[0.09] px-3 py-1 text-xs font-semibold text-success"><Check aria-hidden="true" className="h-3.5 w-3.5" />{equation.source === 'user-corrected' ? 'Corregida por vos' : 'Revisada'}</span><span className="text-xs text-muted">{equation.addedAt}</span></div><div className="formula-card mt-4"><MathFormula tex={equation.tex} label={`Ecuación ${equation.label}`} /></div><div className="mt-4 flex flex-wrap gap-2"><CopyLatexButton tex={equation.tex} /><Button size="sm" variant="secondary" leadingIcon={<Pencil aria-hidden="true" className="h-4 w-4" />} onClick={onEdit}>Editar</Button><Button size="sm" variant="danger" leadingIcon={<Trash2 aria-hidden="true" className="h-4 w-4" />} onClick={onRemove}>Quitar</Button></div></div></div>
}
