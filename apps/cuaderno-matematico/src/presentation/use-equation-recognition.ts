import { useEffect, useRef } from 'react'
import type {
  EquationFixtureId,
  EquationInput,
  EquationScenarioId,
  InkStroke,
} from '../domain/equation'
import { cloneStrokes, getEquationFixture } from '../domain/equation'
import { getPageEquationReferences, type Notebook, type NotebookPage } from '../domain/notebook'
import { useNotebookStore } from '../state/notebook-store'

export const EQUATION_RECOGNITION_DEBOUNCE_MS = import.meta.env.MODE === 'test' ? 0 : 650

type EquationInputMode = 'fixture' | 'typed'

type RecognitionContext = {
  notebook: Notebook | null
  page: NotebookPage | null
  fixtureId: EquationFixtureId
  scenarioId: EquationScenarioId
  inputMode: EquationInputMode
  typedExpression: string
}

type UseEquationRecognitionScheduleOptions = RecognitionContext & {
  enabled: boolean
}

function createInput(
  context: RecognitionContext,
  source: EquationInput['source'],
  expression?: string,
  strokesOverride?: InkStroke[],
): EquationInput | null {
  if (!context.notebook || !context.page) return null
  return {
    source,
    expression,
    fixtureId: context.fixtureId,
    strokes: cloneStrokes(strokesOverride ?? context.page.strokes),
    existingEntries: getPageEquationReferences(context.notebook, context.page),
  }
}

export function useEquationRecognitionSchedule({
  enabled,
  notebook,
  page,
  fixtureId,
  scenarioId,
  inputMode,
  typedExpression,
}: UseEquationRecognitionScheduleOptions) {
  const beginRecognition = useNotebookStore((state) => state.beginRecognition)
  const clearRecognition = useNotebookStore((state) => state.clearRecognition)
  const recognitionPhase = useNotebookStore((state) => state.recognition.phase)
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null)
  const contextRef = useRef<RecognitionContext>({ notebook, page, fixtureId, scenarioId, inputMode, typedExpression })
  contextRef.current = { notebook, page, fixtureId, scenarioId, inputMode, typedExpression }

  const cancelTimer = () => {
    if (timerRef.current === null) return
    clearTimeout(timerRef.current)
    timerRef.current = null
  }

  const schedule = (input: EquationInput, requestScenarioId = contextRef.current.scenarioId) => {
    cancelTimer()
    timerRef.current = setTimeout(() => {
      timerRef.current = null
      beginRecognition(input, requestScenarioId)
    }, EQUATION_RECOGNITION_DEBOUNCE_MS)
  }

  const scheduleHandwritingRecognition = (strokes: InkStroke[]) => {
    if (!enabled || strokes.length === 0) return
    const input = createInput(contextRef.current, 'handwriting', undefined, strokes)
    if (input) schedule(input)
  }

  const recognizeNow = (): boolean => {
    if (!enabled) return false
    const context = contextRef.current
    const expression = context.typedExpression.trim()
    if (context.inputMode === 'typed' && !expression) return false

    cancelTimer()
    const hasHandwriting = Boolean(context.page?.strokes.length)
    const source = context.inputMode === 'typed' && expression
      ? 'typed'
      : hasHandwriting
        ? 'handwriting'
        : 'fixture'
    const input = createInput(context, source, source === 'typed' ? expression : source === 'fixture' ? getEquationFixture(context.fixtureId).tex : undefined)
    if (!input) return false
    beginRecognition(input, context.scenarioId)
    return true
  }

  useEffect(() => {
    if (!enabled || inputMode !== 'typed') return
    const expression = typedExpression.trim()
    cancelTimer()
    if (!expression) {
      if (recognitionPhase !== 'idle') clearRecognition()
      return
    }

    const input = createInput(contextRef.current, 'typed', expression)
    if (!input) return
    timerRef.current = setTimeout(() => {
      timerRef.current = null
      beginRecognition(input, scenarioId)
    }, EQUATION_RECOGNITION_DEBOUNCE_MS)

    return cancelTimer
  }, [beginRecognition, clearRecognition, enabled, fixtureId, inputMode, scenarioId, typedExpression])

  useEffect(() => {
    if (enabled) return
    cancelTimer()
    if (recognitionPhase !== 'idle') clearRecognition()
  }, [clearRecognition, enabled, recognitionPhase])

  useEffect(() => cancelTimer, [])

  return { recognizeNow, scheduleHandwritingRecognition, cancelScheduledRecognition: cancelTimer }
}
