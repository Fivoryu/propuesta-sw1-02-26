import { useState, type BaseSyntheticEvent } from 'react'
import { zodResolver } from '@hookform/resolvers/zod'
import { useForm, type FieldErrors, type UseFormRegister } from 'react-hook-form'
import { useNavigate } from 'react-router-dom'
import {
  ArrowRight,
  BookOpen,
  Check,
  ChevronRight,
  CircleHelp,
  Info,
  Pencil,
  RotateCcw,
  Sigma,
  X,
} from 'lucide-react'
import { Button, Field, Input, Select, StatusBanner, Textarea, useToast } from '@propuestas/ui'
import {
  equationCorrectionSchema,
  equationFixtures,
  equationScenarioOptions,
  getEquationFixture,
  type EquationCorrectionValues,
  type EquationFixtureId,
  type EquationRecognitionPayload,
  type EquationRecognitionResult,
  type EquationScenarioId,
} from '../domain/equation'
import { createInsertedEquation, getPageEquationReferences, type InsertedEquation, type Notebook, type NotebookPage } from '../domain/notebook'
import { useNotebookStore } from '../state/notebook-store'
import {
  ConfidenceSummary,
  CopyLatexButton,
  EquationCode,
  LocalBoundary,
  MathFormula,
} from './ui'

export type EquationModeInput = 'fixture' | 'typed'

type EquationModePanelProps = {
  active: boolean
  notebook: Notebook
  page: NotebookPage
  inputMode: EquationModeInput
  fixtureId: EquationFixtureId
  scenarioId: EquationScenarioId
  typedExpression: string
  onToggle: () => void
  onInputModeChange: (mode: EquationModeInput) => void
  onFixtureChange: (fixtureId: EquationFixtureId) => void
  onScenarioChange: (scenarioId: EquationScenarioId) => void
  onTypedExpressionChange: (expression: string) => void
  onRecognizeNow: () => boolean
  onAcceptEquation: (equation: InsertedEquation) => void
  onContinueWriting: () => void
}

export function EquationModePanel({
  active,
  notebook,
  page,
  inputMode,
  fixtureId,
  scenarioId,
  typedExpression,
  onToggle,
  onInputModeChange,
  onFixtureChange,
  onScenarioChange,
  onTypedExpressionChange,
  onRecognizeNow,
  onAcceptEquation,
  onContinueWriting,
}: EquationModePanelProps) {
  const { show } = useToast()
  const navigate = useNavigate()
  const recognition = useNotebookStore((state) => state.recognition)
  const clearRecognition = useNotebookStore((state) => state.clearRecognition)
  const retryRecognition = useNotebookStore((state) => state.retryRecognition)
  const applyCorrection = useNotebookStore((state) => state.applyCorrection)
  const setActivePage = useNotebookStore((state) => state.setActivePage)
  const [correctionOpen, setCorrectionOpen] = useState(false)
  const [typedAttempted, setTypedAttempted] = useState(false)
  const { register, handleSubmit, reset, formState: { errors } } = useForm<EquationCorrectionValues>({
    resolver: zodResolver(equationCorrectionSchema),
    defaultValues: { latex: '' },
  })

  const result = recognition.result
  const payload: EquationRecognitionPayload | null = result && 'recognition' in result ? result.recognition : null
  const currentTex = recognition.correctionTex ?? payload?.recognizedTex ?? ''
  const hasCorrection = Boolean(recognition.correctionTex)

  const handleRecognizeNow = () => {
    if (inputMode === 'typed' && !typedExpression.trim()) {
      setTypedAttempted(true)
    } else {
      setTypedAttempted(false)
    }
    onRecognizeNow()
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

  const keepHandwritten = () => {
    clearRecognition()
    show({ title: 'Se mantiene la escritura manuscrita', message: 'La propuesta digital no se insertó en la página.', variant: 'info' })
    onToggle()
  }

  const cancelReview = () => {
    clearRecognition()
    onToggle()
  }

  const acceptEquation = () => {
    if (!payload || !currentTex || (result?.status === 'low_confidence' && !hasCorrection)) return
    onAcceptEquation(createInsertedEquation(page, payload, currentTex, hasCorrection))
  }

  const startWithExpression = (expression: string) => {
    const fixture = getEquationFixture(fixtureId)
    setActivePage(notebook.id, page.id)
    useNotebookStore.getState().beginRecognition({
      source: 'typed',
      expression,
      fixtureId: fixture.id,
      strokes: page.strokes,
      existingEntries: getPageEquationReferences(notebook, page),
    }, 'equation-success-high')
  }

  const focusInput = () => {
    const inputId = inputMode === 'typed' ? 'typed-equation' : 'equation-fixture'
    document.getElementById(inputId)?.focus()
  }

  return (
    <div className={`bezel transition-[box-shadow,transform] duration-280 ease-spring ${active ? 'ring-2 ring-primary/20' : ''}`}>
      <div className="bezel-core p-5 sm:p-6">
        <div className="flex items-start justify-between gap-4">
          <div>
            <span className="eyebrow">Modo ecuación</span>
            <h2 className="mt-3 font-display text-2xl font-bold tracking-[-0.05em] text-ink">Revisá antes de insertar</h2>
          </div>
          <Sigma aria-hidden="true" className="h-5 w-5 text-primary" />
        </div>
        <div className="mt-3 flex items-start gap-2 text-sm leading-6 text-muted">
          <Info aria-hidden="true" className="mt-1 h-4 w-4 shrink-0 text-primary" />
          <p>El lienzo sigue siendo la superficie real de escritura. La propuesta digital aparece sin reemplazar tus trazos.</p>
        </div>
        <Button className="mt-5 w-full" variant={active ? 'secondary' : 'primary'} leadingIcon={active ? <X aria-hidden="true" className="h-4 w-4" /> : <Sigma aria-hidden="true" className="h-4 w-4" />} onClick={onToggle} aria-pressed={active}>
          {active ? 'Cerrar modo ecuación' : 'Abrir modo ecuación'}
        </Button>

        {active ? (
          <div className="mt-6 space-y-5 border-t border-line/70 pt-5">
            <div className="rounded-xl bg-primary/[0.06] p-4 ring-1 ring-inset ring-primary/15" aria-live="polite">
              <p className="text-sm font-semibold text-primary">Modo ecuación activo</p>
              <p className="mt-1 text-xs leading-5 text-muted">Pausá después de dibujar para generar una propuesta automática. También podés escribirla con el teclado.</p>
            </div>

            <div className="flex flex-wrap gap-2" role="group" aria-label="Fuente de la ecuación">
              <button className={`focus-ring min-h-11 rounded-full px-3 text-xs font-semibold transition-[background-color,color,transform] duration-280 ease-spring hover:-translate-y-0.5 ${inputMode === 'fixture' ? 'bg-primary text-white' : 'text-muted hover:bg-primary/[0.08] hover:text-primary'}`} type="button" aria-pressed={inputMode === 'fixture'} onClick={() => onInputModeChange('fixture')}>Manuscrito / ejemplo</button>
              <button className={`focus-ring min-h-11 rounded-full px-3 text-xs font-semibold transition-[background-color,color,transform] duration-280 ease-spring hover:-translate-y-0.5 ${inputMode === 'typed' ? 'bg-primary text-white' : 'text-muted hover:bg-primary/[0.08] hover:text-primary'}`} type="button" aria-pressed={inputMode === 'typed'} onClick={() => onInputModeChange('typed')}>Teclado</button>
            </div>

            {inputMode === 'typed' ? (
              <Field label="Escribí la ecuación con el teclado" htmlFor="typed-equation" hint="Se convierte a una propuesta LaTeX local después de una breve pausa; no intenta resolverla ni verificarla.">
                <Input id="typed-equation" value={typedExpression} onChange={(event) => { setTypedAttempted(false); onTypedExpressionChange(event.target.value) }} placeholder="Ej. 2x + 4 = 10" aria-describedby="typed-equation-hint" />
              </Field>
            ) : (
              <Field label="Ejemplo local de apoyo" htmlFor="equation-fixture" hint="Si todavía no hay trazos, este ejemplo permite recorrer la demostración.">
                <Select id="equation-fixture" value={fixtureId} onChange={(event) => onFixtureChange(event.target.value as EquationFixtureId)}>
                  {equationFixtures.map((equation) => <option key={equation.id} value={equation.id}>{equation.label}</option>)}
                </Select>
              </Field>
            )}

            <Field label="Escenario de demostración" htmlFor="equation-scenario" hint="Podés mostrar también estados de baja confianza, sin coincidencia o error.">
              <Select id="equation-scenario" value={scenarioId} onChange={(event) => onScenarioChange(event.target.value as EquationScenarioId)}>
                {equationScenarioOptions.map((scenario) => <option key={scenario.value} value={scenario.value}>{scenario.label}</option>)}
              </Select>
            </Field>

            {typedAttempted && inputMode === 'typed' && !typedExpression.trim() ? <StatusBanner title="Falta una ecuación" variant="warning">Escribí una expresión para pedir la propuesta o elegí un ejemplo local.</StatusBanner> : null}
            <div className="flex flex-col gap-3 sm:flex-row">
              <Button className="flex-1" leadingIcon={<CircleHelp aria-hidden="true" className="h-4 w-4" />} trailingIcon={<ArrowRight aria-hidden="true" className="h-4 w-4" />} onClick={handleRecognizeNow}>Reconocer ahora</Button>
              <Button className="flex-1" variant="secondary" leadingIcon={<BookOpen aria-hidden="true" className="h-4 w-4" />} onClick={() => navigate('/ecuacion')}>Revisión completa</Button>
            </div>

            {recognition.phase === 'loading' ? <InlineRecognitionLoading onCancel={cancelReview} onContinueWriting={onContinueWriting} /> : <InlineRecognitionResult
              result={result}
              payload={payload}
              currentTex={currentTex}
              hasCorrection={hasCorrection}
              correctionOpen={correctionOpen}
              errors={errors}
              register={register}
              onOpenCorrection={openCorrection}
              onSubmitCorrection={handleSubmit(submitCorrection)}
              onCloseCorrection={() => setCorrectionOpen(false)}
              onAccept={acceptEquation}
              onRetry={retryRecognition}
              onCancel={cancelReview}
              onKeepHandwritten={keepHandwritten}
              onContinueWriting={onContinueWriting}
              onEditInput={focusInput}
              onTryExample={startWithExpression}
              onViewExisting={result?.status === 'duplicate' && result.duplicate ? () => navigate(`/cuadernos/${result.duplicate?.notebookId}/paginas/${result.duplicate?.pageId}`) : undefined}
            />} 
          </div>
        ) : null}
      </div>
    </div>
  )
}

function InlineRecognitionLoading({ onCancel, onContinueWriting }: { onCancel: () => void; onContinueWriting: () => void }) {
  return (
    <div className="space-y-4" role="status" aria-live="polite">
      <div className="rounded-2xl bg-[#17213B] p-5 text-white">
        <div className="flex items-center gap-3"><span className="relative inline-flex h-9 w-9 items-center justify-center rounded-full bg-white/10"><span className="absolute inset-1 rounded-full border-2 border-white/15 border-t-[#F4C95D] animate-spring-spin" /><CircleHelp aria-hidden="true" className="h-4 w-4 text-[#F4C95D]" /></span><div><p className="font-display text-xl font-bold tracking-[-0.04em]">Reconociendo ecuación...</p><p className="mt-1 text-sm text-white/70">La escritura sigue disponible mientras preparamos la propuesta.</p></div></div>
        <div className="mt-5 h-2 overflow-hidden rounded-full bg-white/10"><div className="h-full w-2/3 origin-left rounded-full bg-[#F4C95D] animate-recognition-progress" /></div>
      </div>
      <LocalBoundary>Esta demostración usa datos simulados; no es una predicción real.</LocalBoundary>
      <div className="flex flex-col gap-3 sm:flex-row"><Button variant="secondary" onClick={onContinueWriting}>Continuar escribiendo</Button><Button variant="ghost" onClick={onCancel}>Cancelar</Button></div>
    </div>
  )
}

type InlineRecognitionResultProps = {
  result: EquationRecognitionResult | null
  payload: EquationRecognitionPayload | null
  currentTex: string
  hasCorrection: boolean
  correctionOpen: boolean
  errors: FieldErrors<EquationCorrectionValues>
  register: UseFormRegister<EquationCorrectionValues>
  onOpenCorrection: (latex?: string) => void
  onSubmitCorrection: (event?: BaseSyntheticEvent) => Promise<void>
  onCloseCorrection: () => void
  onAccept: () => void
  onRetry: () => void
  onCancel: () => void
  onKeepHandwritten: () => void
  onContinueWriting: () => void
  onEditInput: () => void
  onTryExample: (expression: string) => void
  onViewExisting?: () => void
}

function InlineRecognitionResult({
  result,
  payload,
  currentTex,
  hasCorrection,
  correctionOpen,
  errors,
  register,
  onOpenCorrection,
  onSubmitCorrection,
  onCloseCorrection,
  onAccept,
  onRetry,
  onCancel,
  onKeepHandwritten,
  onContinueWriting,
  onEditInput,
  onTryExample,
  onViewExisting,
}: InlineRecognitionResultProps) {
  if (!result) return null

  if (result.status === 'error') {
    return (
      <div className="space-y-4" role="status" aria-live="polite">
        <StatusBanner title="No pudimos reconocer la ecuación" variant="error">{result.error.message} La entrada y los trazos se mantienen disponibles para reintentar o continuar escribiendo.</StatusBanner>
        <LocalBoundary>Esta demostración usa datos simulados; no es una predicción real.</LocalBoundary>
        <div className="flex flex-col gap-3 sm:flex-row sm:flex-wrap"><Button leadingIcon={<RotateCcw aria-hidden="true" className="h-4 w-4" />} onClick={onRetry}>Reintentar</Button><Button variant="secondary" onClick={onContinueWriting}>Continuar escribiendo</Button><Button variant="ghost" onClick={onKeepHandwritten}>Mantener manuscrita</Button><Button variant="ghost" onClick={onCancel}>Cancelar</Button></div>
      </div>
    )
  }

  if (result.status === 'no_match') {
    return (
      <div className="space-y-4" role="status" aria-live="polite">
        <StatusBanner title="No pudimos reconocer una ecuación" variant="warning">La entrada <strong>{result.inputSummary}</strong> no coincide con una fixture comprensible. Esto no evalúa si la matemática está bien o mal.</StatusBanner>
        <div className="rounded-xl bg-paper p-4 ring-1 ring-inset ring-line/70"><p className="text-sm font-semibold text-ink">Probá una expresión local para recuperar el flujo</p><div className="mt-3 grid gap-2">{result.alternatives.map((alternative) => <button className="focus-ring flex min-h-12 items-center justify-between gap-3 rounded-xl bg-surface px-3 text-left text-sm font-semibold text-ink ring-1 ring-inset ring-line/70 transition-[background-color,transform] duration-280 ease-spring hover:-translate-y-0.5 hover:bg-primary/[0.05]" type="button" key={alternative.label} onClick={() => onTryExample(alternative.tex)}><span>{alternative.label}</span><ChevronRight aria-hidden="true" className="h-4 w-4 text-primary" /></button>)}</div></div>
        <LocalBoundary>Esta demostración usa datos simulados; no es una predicción real.</LocalBoundary>
        <div className="flex flex-col gap-3 sm:flex-row sm:flex-wrap"><Button leadingIcon={<Pencil aria-hidden="true" className="h-4 w-4" />} onClick={onEditInput}>Editar entrada</Button><Button variant="secondary" onClick={() => onTryExample(result.alternatives[0]?.tex ?? getEquationFixture('equation-kinematics').tex)}>Probar ejemplo</Button><Button variant="ghost" onClick={onKeepHandwritten}>Mantener manuscrita</Button><Button variant="ghost" onClick={onCancel}>Cancelar</Button></div>
      </div>
    )
  }

  if (!payload) return null

  return (
    <div className="space-y-5" role="status" aria-live="polite">
      {result.status === 'low_confidence' ? <StatusBanner title="Necesitamos tu revisión" variant="warning">El símbolo <strong>{payload.ambiguousTokens.join(', ')}</strong> no se interpreta con suficiente seguridad. Corregilo antes de aceptar la propuesta.</StatusBanner> : null}
      {result.status === 'duplicate' ? <StatusBanner title="Esta ecuación ya aparece en el cuaderno" variant="info">Podés guardar otra copia de forma consciente. La demostración no crea duplicados automáticamente.</StatusBanner> : null}
      <div className="grid gap-3 sm:grid-cols-2">
        <div className="formula-card formula-card-large"><div className="w-full"><p className="text-xs font-semibold uppercase tracking-[0.15em] text-muted">LaTeX renderizado</p><MathFormula tex={currentTex} label="Propuesta LaTeX renderizada" /></div></div>
        <div className="rounded-2xl bg-[#17213B] p-5 text-white"><p className="text-xs font-semibold uppercase tracking-[0.15em] text-white/65">Propuesta en código</p><EquationCode tex={currentTex} /><p className="mt-3 text-xs leading-5 text-white/70">Origen: {hasCorrection ? 'corrección escrita por vos' : 'reconocimiento simulado'}.</p></div>
      </div>
      <div className="rounded-xl bg-paper p-4 ring-1 ring-inset ring-line/70"><p className="text-xs font-semibold uppercase tracking-[0.14em] text-muted">Expresión normalizada</p><p className="mt-2 text-sm font-semibold leading-6 text-ink">{hasCorrection ? currentTex : payload.normalizedExpression}</p><p className="mt-2 text-sm leading-6 text-muted">{payload.guidance}</p></div>
      <ConfidenceSummary confidence={payload.confidence} />
      <div className="flex flex-wrap items-center gap-2"><CopyLatexButton tex={currentTex} /><Button size="sm" variant="secondary" leadingIcon={<Pencil aria-hidden="true" className="h-4 w-4" />} onClick={() => onOpenCorrection()}>Corregir</Button>{result.status === 'duplicate' && onViewExisting ? <Button size="sm" variant="secondary" leadingIcon={<BookOpen aria-hidden="true" className="h-4 w-4" />} onClick={onViewExisting}>Ver existente</Button> : null}</div>
      {correctionOpen ? <form className="rounded-2xl bg-[#EAF0FF] p-4 ring-1 ring-inset ring-primary/15" onSubmit={onSubmitCorrection} noValidate><div className="flex items-start justify-between gap-4"><div><p className="text-sm font-semibold text-ink">Corregí el código LaTeX</p><p className="mt-1 text-xs leading-5 text-muted">La corrección queda marcada como entrada del usuario.</p></div><button className="focus-ring inline-flex min-h-11 min-w-11 items-center justify-center rounded-full text-muted hover:bg-white/70 hover:text-ink" type="button" aria-label="Cerrar corrección" onClick={onCloseCorrection}><X aria-hidden="true" className="h-4 w-4" /></button></div><label className="sr-only" htmlFor="inline-latex-correction">Código LaTeX corregido</label><Textarea id="inline-latex-correction" className="mt-4 min-h-28 bg-white" {...register('latex')} />{errors.latex?.message ? <p className="mt-2 text-sm font-medium text-error" role="alert">{errors.latex.message}</p> : null}<Button className="mt-4" type="submit" leadingIcon={<Check aria-hidden="true" className="h-4 w-4" />}>Usar corrección</Button></form> : null}
      <LocalBoundary>Esta demostración usa datos simulados; no es una predicción real. La propuesta no resuelve ni verifica la ecuación.</LocalBoundary>
      <div className="flex flex-col gap-3 border-t border-line/70 pt-5"><Button disabled={result.status === 'low_confidence' && !hasCorrection} leadingIcon={<Check aria-hidden="true" className="h-4 w-4" />} onClick={onAccept}>{result.status === 'duplicate' ? 'Insertar ecuación' : hasCorrection ? 'Aceptar corrección' : 'Aceptar'}</Button><div className="flex flex-col gap-2 sm:flex-row sm:flex-wrap"><Button size="sm" variant="ghost" onClick={onContinueWriting}>Continuar escribiendo</Button><Button size="sm" variant="ghost" onClick={onKeepHandwritten}>Mantener manuscrita</Button><Button size="sm" variant="ghost" onClick={onCancel}>Cancelar</Button></div></div>
    </div>
  )
}
