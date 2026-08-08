import { Check, CircleHelp, Info, Sigma } from 'lucide-react'
import { Button } from '@propuestas/ui'
import type { EquationRecognitionPayload } from '../domain/equation'
import { createInsertedEquation, type InsertedEquation, type NotebookPage } from '../domain/notebook'
import type { RecognitionState } from '../state/notebook-store'
import { MathFormula } from './ui'

type NotebookEquationPreviewProps = {
  page: NotebookPage
  recognition: RecognitionState
  onInsert: (equation: InsertedEquation) => void
}

export function NotebookEquationPreview({ page, recognition, onInsert }: NotebookEquationPreviewProps) {
  const result = recognition.result
  const payload: EquationRecognitionPayload | null = result && 'recognition' in result ? result.recognition : null
  const currentTex = recognition.correctionTex ?? payload?.recognizedTex ?? ''
  const hasCorrection = Boolean(recognition.correctionTex)
  const canInsert = Boolean(payload && currentTex && !(result?.status === 'low_confidence' && !hasCorrection))

  const handleInsert = () => {
    if (!payload || !currentTex || !canInsert) return
    onInsert(createInsertedEquation(page, payload, currentTex, hasCorrection))
  }

  return (
    <section className="notebook-equation-section mt-5 px-1 pb-1 pt-5 sm:mt-6 sm:px-2 sm:pt-6" aria-labelledby="notebook-equation-preview-heading">
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div>
          <span className="eyebrow">Ecuación en esta página</span>
          <h2 id="notebook-equation-preview-heading" className="mt-3 font-display text-xl font-bold tracking-[-0.04em] text-ink sm:text-2xl">Vista previa en el cuaderno</h2>
          <p className="mt-1 max-w-xl text-sm leading-6 text-muted">La fórmula ocupa su propio renglón de la página sin borrar tu escritura manuscrita.</p>
        </div>
        <Sigma aria-hidden="true" className="h-5 w-5 text-primary" />
      </div>

      <div className="mt-5 space-y-4">
        {page.equations.map((equation) => (
          <article className="notebook-equation-entry" key={equation.id}>
            <div className="flex flex-wrap items-center justify-between gap-3">
              <div>
                <p className="text-xs font-semibold uppercase tracking-[0.14em] text-success">Ecuación en esta página</p>
                <p className="mt-1 text-sm font-semibold text-ink">{equation.label}</p>
              </div>
              <Check aria-hidden="true" className="h-5 w-5 text-success" />
            </div>
            <div className="notebook-formula-line mt-3">
              <MathFormula tex={equation.tex} label={`Ecuación insertada en el cuaderno: ${equation.label}`} />
            </div>
          </article>
        ))}

        {recognition.phase === 'loading' ? <PreviewLoading /> : result?.status === 'error' ? <PreviewRecovery message="No se pudo preparar una propuesta. Podés reintentar desde el panel lateral; tus trazos siguen guardados." /> : result?.status === 'no_match' ? <PreviewRecovery message="No encontramos una coincidencia para esta entrada. Probá otro ejemplo o corregí la entrada desde el panel lateral." /> : payload && currentTex ? (
          <article className="notebook-equation-proposal">
            <div className="flex flex-wrap items-start justify-between gap-3">
              <div>
                <p className="text-xs font-semibold uppercase tracking-[0.14em] text-primary">{hasCorrection ? 'Propuesta corregida en esta página' : 'Propuesta en esta página'}</p>
                <p className="mt-1 text-sm font-semibold text-ink">{hasCorrection ? 'Pendiente de insertar' : getProposalState(result?.status)}</p>
              </div>
              <span className={`inline-flex min-h-8 items-center rounded-full px-3 py-1 text-xs font-semibold ${result?.status === 'low_confidence' && !hasCorrection ? 'bg-warning/[0.12] text-[#855E00]' : 'bg-primary/[0.1] text-primary'}`}>
                {result?.status === 'low_confidence' && !hasCorrection ? 'Revisión necesaria' : 'Pendiente de insertar'}
              </span>
            </div>
            <div className="notebook-formula-line notebook-formula-line-large mt-4">
              <MathFormula tex={currentTex} label="Ecuación propuesta en el cuaderno" />
            </div>
            <div className="mt-4 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
              <p className="flex items-start gap-2 text-xs leading-5 text-muted"><Info aria-hidden="true" className="mt-0.5 h-4 w-4 shrink-0 text-primary" />{hasCorrection ? 'La corrección se actualizará al guardarla.' : 'La propuesta no reemplaza los trazos originales.'}</p>
              <Button className="w-full shrink-0 sm:w-auto" size="sm" disabled={!canInsert} leadingIcon={<Check aria-hidden="true" className="h-4 w-4" />} onClick={handleInsert}>Insertar en el cuaderno</Button>
            </div>
          </article>
        ) : <PreviewEmpty />}
      </div>
    </section>
  )
}

function getProposalState(status: 'success' | 'low_confidence' | 'duplicate' | undefined): string {
  if (status === 'duplicate') return 'Coincidencia local · pendiente de insertar'
  if (status === 'low_confidence') return 'Revisión necesaria · pendiente de insertar'
  return 'Pendiente de insertar'
}

function PreviewLoading() {
  return (
    <div className="notebook-equation-state notebook-equation-state-loading" role="status" aria-live="polite">
      <div className="flex items-center gap-3"><span className="inline-flex h-9 w-9 items-center justify-center rounded-full border-2 border-white/15 border-t-[#F4C95D] animate-spring-spin"><CircleHelp aria-hidden="true" className="h-4 w-4 text-[#F4C95D]" /></span><div><p className="font-display text-lg font-bold tracking-[-0.04em]">Reconociendo en la página...</p><p className="mt-1 text-sm text-white/70">La ecuación aparecerá aquí cuando la propuesta esté lista.</p></div></div>
    </div>
  )
}

function PreviewRecovery({ message }: { message: string }) {
  return <div className="notebook-equation-state notebook-equation-state-recovery" role="status" aria-live="polite"><p className="text-sm font-semibold text-ink">Todavía no hay una fórmula para mostrar</p><p className="mt-1 text-sm leading-6 text-muted">{message}</p></div>
}

function PreviewEmpty() {
  return <div className="notebook-equation-state notebook-equation-state-empty" role="status" aria-live="polite"><p className="text-sm font-semibold text-ink">La ecuación aparecerá aquí después del reconocimiento</p><p className="mt-1 flex items-start gap-2 text-sm leading-6 text-muted"><Info aria-hidden="true" className="mt-1 h-4 w-4 shrink-0 text-primary" />Activá <strong className="font-semibold text-primary">Ecuación</strong> y escribí, dibujá o elegí un ejemplo local para preparar una propuesta.</p></div>
}
