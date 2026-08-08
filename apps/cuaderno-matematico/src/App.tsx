import { useEffect } from 'react'
import { Route, Routes } from 'react-router-dom'
import type { EquationRecognitionResult } from './domain/equation'
import { recognizeEquation } from './services/mock/recognize-equation'
import { useNotebookStore } from './state/notebook-store'
import {
  EditorPage,
  EquationReviewPage,
  ExportPage,
  HomePage,
  NewNotebookPage,
  NotebookPageView,
} from './presentation/pages'
import { NotFoundPanel } from './presentation/ui'

export default function App() {
  return (
    <>
      <RecognitionRunner />
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/cuadernos/nuevo" element={<NewNotebookPage />} />
        <Route path="/cuadernos/:notebookId" element={<NotebookPageView />} />
        <Route path="/cuadernos/:notebookId/paginas/:pageId" element={<EditorPage />} />
        <Route path="/ecuacion" element={<EquationReviewPage />} />
        <Route path="/exportar" element={<ExportPage />} />
        <Route path="*" element={<NotFoundPanel />} />
      </Routes>
    </>
  )
}

function RecognitionRunner() {
  const phase = useNotebookStore((state) => state.recognition.phase)
  const pending = useNotebookStore((state) => state.recognition.pending)
  const setRecognitionResult = useNotebookStore((state) => state.setRecognitionResult)

  useEffect(() => {
    if (phase !== 'loading' || !pending) return
    const controller = new AbortController()
    void recognizeEquation(pending.input, { scenarioId: pending.scenarioId, latencyMs: import.meta.env.MODE === 'test' ? 0 : undefined, signal: controller.signal }).then((result) => {
      setRecognitionResult(pending.requestId, result)
    }).catch((error: unknown) => {
      if (error instanceof DOMException && error.name === 'AbortError') return
      const fallback: EquationRecognitionResult = {
        status: 'error',
        scenarioId: 'equation-error',
        latencyMs: 0,
        disclaimer: 'simulated',
        meta: { scenarioId: 'equation-error', status: 'error', latencyMs: 0, disclaimer: 'simulated' },
        error: { code: 'MOCK_RECOGNITION_UNAVAILABLE', message: 'No pudimos reconocer la ecuación. Tu manuscrito sigue guardado.' },
      }
      setRecognitionResult(pending.requestId, fallback)
    })
    return () => controller.abort()
  }, [pending, phase, setRecognitionResult])

  return null
}
