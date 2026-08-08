import { urbanReports } from '../../domain/urban-fixtures'
import type {
  UrbanAnalysisOptions,
  UrbanAnalysisResult,
  UrbanIssueAnalysis,
  UrbanIssueInput,
  UrbanScenarioId,
} from '../../domain/urban-report'

const DEFAULT_SCENARIO: UrbanScenarioId = 'urban-success-high'

function createAbortError(): DOMException {
  return new DOMException('La solicitud fue cancelada.', 'AbortError')
}

function waitForLatency(latencyMs: number, signal?: AbortSignal): Promise<void> {
  if (signal?.aborted) return Promise.reject(createAbortError())

  return new Promise((resolve, reject) => {
    let timer: ReturnType<typeof setTimeout>
    const cancel = () => {
      clearTimeout(timer)
      signal?.removeEventListener('abort', cancel)
      reject(createAbortError())
    }
    const finish = () => {
      signal?.removeEventListener('abort', cancel)
      resolve()
    }
    timer = setTimeout(finish, latencyMs)
    signal?.addEventListener('abort', cancel, { once: true })
  })
}

function cloneAnalysis(analysis: UrbanIssueAnalysis): UrbanIssueAnalysis {
  return {
    ...analysis,
    possibleDuplicate: analysis.possibleDuplicate.map((candidate) => ({ ...candidate })),
    detectedRegion: { ...analysis.detectedRegion },
    suggestedCorrections: analysis.suggestedCorrections ? [...analysis.suggestedCorrections] : undefined,
  }
}

function baseAnalysis(input: UrbanIssueInput): UrbanIssueAnalysis {
  return {
    category: input.categoryHint,
    severity: 'medium',
    description: input.description.trim(),
    confidence: 0.62,
    possibleDuplicate: [],
    detectedRegion: { x: 18, y: 20, width: 64, height: 56 },
  }
}

function scenarioAnalysis(scenarioId: UrbanScenarioId, input: UrbanIssueInput): UrbanIssueAnalysis {
  const analysis = baseAnalysis(input)

  if (scenarioId === 'urban-success-high') {
    return {
      ...analysis,
      category: 'pothole',
      severity: 'high',
      description: 'Posible daño en la vía que requiere revisión.',
      confidence: 0.93,
      detectedRegion: { x: 24, y: 45, width: 52, height: 30 },
    }
  }

  if (scenarioId === 'urban-low-confidence') {
    return {
      ...analysis,
      category: 'waste',
      severity: 'medium',
      description: 'Se observan elementos que podrían corresponder a residuos acumulados.',
      confidence: 0.57,
      suggestedCorrections: ['Confirmá si se trata de residuos acumulados o de otro problema urbano.'],
      detectedRegion: { x: 32, y: 28, width: 40, height: 48 },
    }
  }

  if (scenarioId === 'urban-duplicate') {
    const existingReport = urbanReports[0]
    return {
      ...analysis,
      category: 'pothole',
      severity: 'high',
      description: 'El análisis encuentra un posible bache similar en la misma zona aproximada.',
      confidence: 0.91,
      possibleDuplicate: [
        {
          reportId: existingReport.id,
          reference: existingReport.reference,
          approximateLocation: existingReport.approximateLocation.label,
          category: existingReport.category,
          status: existingReport.status,
          reportedAt: existingReport.reportedAt,
          description: existingReport.description,
        },
      ],
      detectedRegion: { x: 24, y: 45, width: 52, height: 30 },
    }
  }

  if (scenarioId === 'urban-no-match') {
    return {
      ...analysis,
      category: 'other',
      severity: 'low',
      description: 'No encontramos una coincidencia clara en los datos simulados.',
      confidence: 0.29,
      detectedRegion: { x: 28, y: 24, width: 44, height: 44 },
    }
  }

  return analysis
}

function chooseLatency(latencyMs?: number): number {
  if (typeof latencyMs === 'number') return Math.max(0, latencyMs)
  return Math.floor(1200 + Math.random() * 1001)
}

export async function analyzeUrbanIssue(
  input: UrbanIssueInput,
  options: UrbanAnalysisOptions = {},
): Promise<UrbanAnalysisResult> {
  const scenarioId = options.scenarioId ?? DEFAULT_SCENARIO
  const latencyMs = chooseLatency(options.latencyMs)
  await waitForLatency(latencyMs, options.signal)
  if (options.signal?.aborted) throw createAbortError()

  const meta = { scenarioId, latencyMs, disclaimer: 'simulated' as const }

  if (scenarioId === 'urban-error') {
    return {
      ...meta,
      status: 'error',
      error: {
        code: 'MOCK_ANALYSIS_UNAVAILABLE',
        message: 'No pudimos analizar el problema. Tu borrador sigue guardado.',
      },
    }
  }

  const analysis = cloneAnalysis(scenarioAnalysis(scenarioId, input))
  const statusByScenario = {
    'urban-success-high': 'success',
    'urban-low-confidence': 'low_confidence',
    'urban-duplicate': 'duplicate',
    'urban-no-match': 'no_match',
  } as const
  return { ...meta, status: statusByScenario[scenarioId as keyof typeof statusByScenario], analysis } as UrbanAnalysisResult
}
