import { useState, useCallback } from 'react'
import { Dumbbell, CheckCircle2, XCircle, ChevronRight, BookOpen } from 'lucide-react'
import { Button } from '@propuestas/ui'
import { CameraView } from '../components/CameraView'
import { ConfidenceBadge } from '../components/ConfidenceBadge'
import { ProcessingSpinner } from '../components/StatusIndicator'
import { practiceSignList } from '../../data/mockSigns'
import type { MockSign, ConfidenceLevel } from '../../types'

type PracticePhase = 'idle' | 'ready' | 'analyzing' | 'success' | 'retry'

interface PracticeResult {
  confidence: number
  level: ConfidenceLevel
  success: boolean
}

function getLevel(c: number): ConfidenceLevel {
  if (c >= 0.85) return 'HIGH'
  if (c >= 0.60) return 'MEDIUM'
  return 'LOW'
}

export function PracticePage() {
  const [selectedSign, setSelectedSign] = useState<MockSign | null>(null)
  const [phase, setPhase] = useState<PracticePhase>('idle')
  const [result, setResult] = useState<PracticeResult | null>(null)
  const [currentIndex, setCurrentIndex] = useState(0)

  const startPractice = useCallback(() => {
    if (!selectedSign) return
    setPhase('ready')
    setResult(null)

    setTimeout(() => setPhase('analyzing'), 400)

    setTimeout(() => {
      const rawConfidence = selectedSign.confidence * (0.88 + Math.random() * 0.14)
      const confidence = Math.min(1, rawConfidence)
      const level = getLevel(confidence)
      const success = confidence >= 0.80

      setResult({ confidence, level, success })
      setPhase(success ? 'success' : 'retry')
    }, 2200)
  }, [selectedSign])

  const nextSign = useCallback(() => {
    const next = (currentIndex + 1) % practiceSignList.length
    setCurrentIndex(next)
    setSelectedSign(practiceSignList[next] ?? null)
    setPhase('idle')
    setResult(null)
  }, [currentIndex])

  const handleSelectSign = (sign: MockSign, idx: number) => {
    setSelectedSign(sign)
    setCurrentIndex(idx)
    setPhase('idle')
    setResult(null)
  }

  return (
    <div className="min-h-full bg-paper">
      <div className="mx-auto max-w-6xl px-4 py-6 lg:px-6">
        <div className="mb-5">
          <div className="flex items-center gap-2">
            <Dumbbell className="h-5 w-5 text-primary" aria-hidden="true" />
            <h1 className="text-xl font-bold text-ink">Modo práctica</h1>
          </div>
          <p className="text-sm text-muted">Selecciona una seña y practica frente a la cámara.</p>
        </div>

        <div className="grid gap-5 lg:grid-cols-[280px_1fr]">
          <div className="flex flex-col gap-3">
            <div className="rounded-xl bg-surface p-4 ring-1 ring-inset ring-line/60">
              <p className="mb-3 text-sm font-bold text-ink">Señas disponibles</p>
              <div className="flex flex-col gap-1">
                {practiceSignList.map((sign, idx) => (
                  <button
                    key={sign.text}
                    onClick={() => handleSelectSign(sign, idx)}
                    className={`flex items-center justify-between rounded-lg px-3 py-2.5 text-sm font-semibold text-left transition-colors ${
                      selectedSign?.text === sign.text
                        ? 'bg-primary/10 text-primary'
                        : 'text-ink hover:bg-primary/[0.05]'
                    }`}
                  >
                    <span>{sign.text}</span>
                    {selectedSign?.text === sign.text && (
                      <ChevronRight className="h-4 w-4 text-primary" aria-hidden="true" />
                    )}
                  </button>
                ))}
              </div>
            </div>
          </div>

          <div className="flex flex-col gap-4">
            {selectedSign ? (
              <>
                <div className="rounded-xl bg-surface p-5 ring-1 ring-inset ring-line/60">
                  <div className="mb-4 flex items-start justify-between gap-4">
                    <div>
                      <p className="text-xs font-bold uppercase tracking-wider text-primary">Practicando</p>
                      <h2 className="mt-1 text-3xl font-extrabold text-ink">{selectedSign.text}</h2>
                      {selectedSign.description && (
                        <p className="mt-1 text-sm text-muted">{selectedSign.description}</p>
                      )}
                    </div>
                    <Button onClick={nextSign} variant="ghost" size="sm">
                      Siguiente
                    </Button>
                  </div>

                  <div className="mb-4 flex items-center justify-center rounded-xl bg-primary/[0.05] p-6 text-center ring-1 ring-inset ring-primary/10">
                    <div className="space-y-2">
                      <BookOpen className="mx-auto h-10 w-10 text-primary/40" aria-hidden="true" />
                      <p className="text-sm font-semibold text-primary/60">REFERENCIA VISUAL DE LA SEÑA</p>
                      <p className="text-xs text-muted">
                        Imágenes de referencia serán agregadas en la versión final
                      </p>
                    </div>
                  </div>

                  {phase === 'idle' && (
                    <Button onClick={startPractice} className="w-full" size="lg">
                      Comenzar práctica
                    </Button>
                  )}

                  {(phase === 'ready' || phase === 'analyzing') && (
                    <div className="flex items-center justify-center gap-3 rounded-xl bg-primary/[0.07] py-4">
                      <ProcessingSpinner />
                      <p className="text-sm font-semibold text-primary">Analizando tu seña...</p>
                    </div>
                  )}

                  {phase === 'success' && result && (
                    <div className="rounded-xl bg-success/[0.07] p-4 ring-1 ring-inset ring-success/20">
                      <div className="mb-3 flex items-center gap-2">
                        <CheckCircle2 className="h-5 w-5 text-success" aria-hidden="true" />
                        <p className="font-bold text-success">¡Muy bien! Seña correcta</p>
                      </div>
                      <ConfidenceBadge confidence={result.confidence} level={result.level} />
                      <div className="mt-4 flex gap-2">
                        <Button onClick={startPractice} variant="secondary" size="sm" className="flex-1">
                          Repetir
                        </Button>
                        <Button onClick={nextSign} size="sm" className="flex-1">
                          Siguiente seña
                        </Button>
                      </div>
                    </div>
                  )}

                  {phase === 'retry' && result && (
                    <div className="rounded-xl bg-warning/[0.07] p-4 ring-1 ring-inset ring-warning/20">
                      <div className="mb-3 flex items-center gap-2">
                        <XCircle className="h-5 w-5 text-warning" aria-hidden="true" />
                        <p className="font-bold text-warning">Intenta nuevamente</p>
                      </div>
                      <ConfidenceBadge confidence={result.confidence} level={result.level} />
                      <p className="mt-2 text-sm text-muted">
                        Asegúrate de mantener las manos visibles y bien iluminadas.
                      </p>
                      <Button onClick={startPractice} size="sm" className="mt-3 w-full">
                        Intentar de nuevo
                      </Button>
                    </div>
                  )}
                </div>

                <div className="rounded-xl bg-surface p-4 ring-1 ring-inset ring-line/60">
                  <p className="mb-3 text-sm font-bold text-ink">Tu cámara</p>
                  <CameraView />
                </div>
              </>
            ) : (
              <div className="flex flex-1 flex-col items-center justify-center gap-4 rounded-xl bg-surface px-6 py-16 text-center ring-1 ring-inset ring-line/60">
                <span className="flex h-14 w-14 items-center justify-center rounded-2xl bg-primary/10 text-primary">
                  <Dumbbell className="h-7 w-7" aria-hidden="true" />
                </span>
                <div>
                  <p className="font-bold text-ink">Selecciona una seña</p>
                  <p className="text-sm text-muted">Elige una seña de la lista izquierda para comenzar a practicar.</p>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
