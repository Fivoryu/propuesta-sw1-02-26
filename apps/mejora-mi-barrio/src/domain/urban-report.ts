import { z } from 'zod'
import type { ApproximateLocation, SantaCruzAreaId } from '@propuestas/shared'

export type UrbanCategory = 'pothole' | 'waste' | 'lighting' | 'drainage' | 'other'
export type UrbanSeverity = 'low' | 'medium' | 'high'
export type UrbanReportStatus = 'pending' | 'in_review' | 'in_progress' | 'resolved'
export type UrbanAnalysisStatus = 'success' | 'low_confidence' | 'duplicate' | 'no_match' | 'error'
export type UrbanScenarioId =
  | 'urban-success-high'
  | 'urban-low-confidence'
  | 'urban-duplicate'
  | 'urban-no-match'
  | 'urban-error'

export type UrbanEvidence = {
  kind: 'fixture' | 'upload'
  src: string
  label: string
  alt: string
  fixtureImageId?: string
}

export type UrbanDraft = {
  approximateLocationId: SantaCruzAreaId
  category: UrbanCategory
  description: string
  scenarioId: UrbanScenarioId
  fixtureImageId?: string
  evidence: UrbanEvidence
}

export type UrbanIssueInput = {
  description: string
  categoryHint: UrbanCategory
  approximateLocation: ApproximateLocation
  fixtureImageId?: string
}

export type UrbanAnalysisOptions = {
  scenarioId?: UrbanScenarioId
  latencyMs?: number
  signal?: AbortSignal
}

export type DetectedRegion = {
  x: number
  y: number
  width: number
  height: number
}

export type UrbanDuplicateCandidate = {
  reportId: string
  reference: string
  approximateLocation: string
  category: UrbanCategory
  status: UrbanReportStatus
  reportedAt: string
  description: string
}

export type UrbanIssueAnalysis = {
  category: UrbanCategory
  severity: UrbanSeverity
  description: string
  confidence: number
  possibleDuplicate: UrbanDuplicateCandidate[]
  detectedRegion: DetectedRegion
  suggestedCorrections?: string[]
}

type UrbanAnalysisMeta = {
  scenarioId: UrbanScenarioId
  latencyMs: number
  disclaimer: 'simulated'
}

export type UrbanAnalysisResult =
  | (UrbanAnalysisMeta & { status: 'success'; analysis: UrbanIssueAnalysis })
  | (UrbanAnalysisMeta & { status: 'low_confidence'; analysis: UrbanIssueAnalysis })
  | (UrbanAnalysisMeta & { status: 'duplicate'; analysis: UrbanIssueAnalysis })
  | (UrbanAnalysisMeta & { status: 'no_match'; analysis: UrbanIssueAnalysis })
  | (UrbanAnalysisMeta & {
      status: 'error'
      error: { code: 'MOCK_ANALYSIS_UNAVAILABLE'; message: string }
    })

export type UrbanReport = {
  id: string
  reference: string
  category: UrbanCategory
  severity: UrbanSeverity
  status: UrbanReportStatus
  description: string
  approximateLocation: ApproximateLocation
  lat: number
  lng: number
  reportedAt: string
  evidence: UrbanEvidence
  simulated: true
}

export const urbanCategoryOptions = [
  { value: 'pothole', label: 'Bache o daño en la vía' },
  { value: 'waste', label: 'Residuos acumulados' },
  { value: 'lighting', label: 'Alumbrado público' },
  { value: 'drainage', label: 'Drenaje o inundación' },
  { value: 'other', label: 'Otro problema urbano' },
] as const satisfies ReadonlyArray<{ value: UrbanCategory; label: string }>

export const urbanSeverityLabels: Record<UrbanSeverity, string> = {
  low: 'Baja',
  medium: 'Media',
  high: 'Alta',
}

export const urbanCategoryLabels: Record<UrbanCategory, string> = Object.fromEntries(
  urbanCategoryOptions.map((option) => [option.value, option.label]),
) as Record<UrbanCategory, string>

export const urbanStatusLabels: Record<UrbanReportStatus, string> = {
  pending: 'Pendiente',
  in_review: 'En revisión',
  in_progress: 'En proceso',
  resolved: 'Resuelto',
}

export const urbanScenarioOptions = [
  { value: 'urban-success-high', label: 'Éxito' },
  { value: 'urban-low-confidence', label: 'Baja confianza' },
  { value: 'urban-duplicate', label: 'Posible duplicado' },
  { value: 'urban-no-match', label: 'Sin coincidencias' },
  { value: 'urban-error', label: 'Error' },
] as const satisfies ReadonlyArray<{ value: UrbanScenarioId; label: string }>

const urbanLocationIds = [
  'sc-equipetrol',
  'sc-plan-3000',
  'sc-villa-primero-de-mayo',
  'sc-las-palmas',
  'sc-parque-urbano',
] as const

export const urbanReportSchema = z.object({
  approximateLocationId: z.enum(urbanLocationIds, {
    message: 'Elegí una zona aproximada para ubicar el reporte.',
  }),
  category: z.enum(['pothole', 'waste', 'lighting', 'drainage', 'other'], {
    message: 'Elegí una categoría para ordenar el reporte.',
  }),
  description: z
    .string()
    .trim()
    .min(20, 'Describí el problema con al menos 20 caracteres.')
    .max(500, 'La descripción puede tener hasta 500 caracteres.'),
  scenarioId: z.enum(
    [
      'urban-success-high',
      'urban-low-confidence',
      'urban-duplicate',
      'urban-no-match',
      'urban-error',
    ],
    { message: 'Elegí un modo de demostración.' },
  ),
  fixtureImageId: z.string().optional(),
})

export type UrbanReportFormValues = z.infer<typeof urbanReportSchema>

export function isAnalysisWithPayload(
  result: UrbanAnalysisResult | null,
): result is Exclude<UrbanAnalysisResult, Extract<UrbanAnalysisResult, { status: 'error' }>> {
  return Boolean(result && result.status !== 'error')
}

export function getConfidenceLabel(confidence: number): string {
  if (confidence >= 0.8) return 'Confianza alta'
  if (confidence >= 0.6) return 'Confianza media'
  return 'Confianza baja'
}

export function getLocationLabel(locations: readonly ApproximateLocation[], areaId: SantaCruzAreaId): string {
  return locations.find((location) => location.areaId === areaId)?.label ?? 'Zona aproximada no definida'
}
