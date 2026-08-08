import { z } from 'zod'
import type { MockOptions } from '@propuestas/shared'

export type InkPoint = { x: number; y: number }
export type InkStroke = {
  id: string
  kind: 'pencil' | 'highlighter'
  color: string
  size: number
  points: InkPoint[]
}

export type EquationInputSource = 'typed' | 'handwriting' | 'fixture'
export type EquationScenarioId =
  | 'equation-success-high'
  | 'equation-low-confidence'
  | 'equation-duplicate'
  | 'equation-no-match'
  | 'equation-error'

export type EquationLocalReference = {
  id: string
  notebookId: string
  pageId: string
  notebookTitle: string
  pageTitle: string
  tex: string
}

export type EquationInput = {
  source: EquationInputSource
  expression?: string
  fixtureId?: EquationFixtureId
  strokes: InkStroke[]
  existingEntries?: EquationLocalReference[]
}

export type EquationRecognitionOptions = Omit<MockOptions, 'scenarioId'> & {
  scenarioId?: EquationScenarioId
}

export type EquationFixtureId =
  | 'equation-kinematics'
  | 'equation-quadratic'
  | 'equation-integral'
  | 'equation-limit'
  | 'equation-system'

export type EquationFixture = {
  id: EquationFixtureId
  label: string
  subject: string
  tex: string
  normalizedExpression: string
  description: string
}

export const equationFixtures: readonly EquationFixture[] = [
  {
    id: 'equation-kinematics',
    label: 'Cinemática · posición',
    subject: 'Física',
    tex: 'x = x_0 + v_0t + \\frac{1}{2}at^2',
    normalizedExpression: 'x = x_0 + v_0 t + (1/2) a t^2',
    description: 'Una ecuación de movimiento para practicar transcripción.',
  },
  {
    id: 'equation-quadratic',
    label: 'Álgebra · cuadrática',
    subject: 'Álgebra',
    tex: 'x = \\frac{-b \\pm \\sqrt{b^2 - 4ac}}{2a}',
    normalizedExpression: 'x = (-b ± √(b^2 - 4ac)) / (2a)',
    description: 'El signo ± es el símbolo que la simulación puede marcar como dudoso.',
  },
  {
    id: 'equation-integral',
    label: 'Cálculo · integral definida',
    subject: 'Cálculo',
    tex: '\\int_0^1 x^2\\,dx',
    normalizedExpression: '∫[0,1] x^2 dx',
    description: 'Una integral local para revisar la estructura de límites.',
  },
  {
    id: 'equation-limit',
    label: 'Cálculo · límite notable',
    subject: 'Cálculo',
    tex: '\\lim_{x \\to 0} \\frac{\\sin x}{x}',
    normalizedExpression: 'lim(x → 0) sin(x) / x',
    description: 'Un límite notable presentado como fixture de demostración.',
  },
  {
    id: 'equation-system',
    label: 'Álgebra · sistema lineal',
    subject: 'Álgebra',
    tex: '\\begin{cases} 2x + y = 7 \\\\ x - y = 2 \\end{cases}',
    normalizedExpression: '{ 2x + y = 7 ; x - y = 2 }',
    description: 'Un sistema de ecuaciones para probar bloques y saltos de línea.',
  },
]

export const equationScenarioOptions = [
  { value: 'equation-success-high', label: 'Reconocimiento correcto' },
  { value: 'equation-low-confidence', label: 'Símbolo dudoso' },
  { value: 'equation-duplicate', label: 'Duplicado local' },
  { value: 'equation-no-match', label: 'Sin coincidencia' },
  { value: 'equation-error', label: 'Error simulado' },
] as const satisfies ReadonlyArray<{ value: EquationScenarioId; label: string }>

export type EquationAlternative = {
  label: string
  tex: string
}

export type EquationRecognitionPayload = {
  recognizedTex: string
  normalizedExpression: string
  confidence: number
  ambiguousTokens: string[]
  alternatives: EquationAlternative[]
  guidance: string
}

type EquationResultBase<Status extends EquationScenarioId> = {
  status: Status extends 'equation-success-high'
    ? 'success'
    : Status extends 'equation-low-confidence'
      ? 'low_confidence'
      : Status extends 'equation-duplicate'
        ? 'duplicate'
        : Status extends 'equation-no-match'
          ? 'no_match'
          : 'error'
  scenarioId: Status
  latencyMs: number
  disclaimer: 'simulated'
  meta: {
    scenarioId: Status
    status: 'success' | 'low_confidence' | 'duplicate' | 'no_match' | 'error'
    latencyMs: number
    disclaimer: 'simulated'
  }
}

export type EquationRecognitionResult =
  | (EquationResultBase<'equation-success-high'> & { status: 'success'; recognition: EquationRecognitionPayload })
  | (EquationResultBase<'equation-low-confidence'> & { status: 'low_confidence'; recognition: EquationRecognitionPayload })
  | (EquationResultBase<'equation-duplicate'> & {
      status: 'duplicate'
      recognition: EquationRecognitionPayload
      duplicate: EquationLocalReference | null
    })
  | (EquationResultBase<'equation-no-match'> & {
      status: 'no_match'
      inputSummary: string
      alternatives: EquationAlternative[]
    })
  | (EquationResultBase<'equation-error'> & {
      status: 'error'
      error: { code: 'MOCK_RECOGNITION_UNAVAILABLE'; message: string }
    })

export const equationCorrectionSchema = z.object({
  latex: z
    .string()
    .trim()
    .min(1, 'Escribí una expresión para aplicar la corrección.')
    .max(220, 'La expresión puede tener hasta 220 caracteres.')
    .refine((value) => /^[\w\s\\{}^_=+\-.,()[\]|\/]+$/.test(value), 'Usá símbolos matemáticos compatibles con esta demostración.'),
})

export type EquationCorrectionValues = z.infer<typeof equationCorrectionSchema>

export function getEquationFixture(fixtureId: string | undefined): EquationFixture {
  return equationFixtures.find((fixture) => fixture.id === fixtureId) ?? equationFixtures[0]
}

export function getEquationScenarioLabel(scenarioId: EquationScenarioId): string {
  return equationScenarioOptions.find((scenario) => scenario.value === scenarioId)?.label ?? 'Escenario local'
}

export function cloneStrokes(strokes: readonly InkStroke[]): InkStroke[] {
  return strokes.map((stroke) => ({
    ...stroke,
    points: stroke.points.map((point) => ({ ...point })),
  }))
}

export function getConfidenceLabel(confidence: number): string {
  if (confidence >= 0.8) return 'Confianza alta'
  if (confidence >= 0.6) return 'Confianza media'
  return 'Confianza baja'
}
