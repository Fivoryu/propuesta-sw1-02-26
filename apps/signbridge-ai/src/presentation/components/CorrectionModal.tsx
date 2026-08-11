import { X, CheckCircle2 } from 'lucide-react'
import { useState } from 'react'
import { Button } from '@propuestas/ui'
import { correctionOptions } from '../../services/mock/sign-fixtures'
import { useRecognitionStore } from '../../stores/recognitionStore'
import { cn } from '../../utils/cn'

interface CorrectionModalProps {
  onClose: () => void
}

export function CorrectionModal({ onClose }: CorrectionModalProps) {
  const [selected, setSelected] = useState<string | null>(null)
  const [confirmed, setConfirmed] = useState(false)
  const correctResult = useRecognitionStore((s) => s.correctResult)

  function handleConfirm() {
    if (!selected) return
    correctResult(selected === 'Otra' ? 'Seña no listada' : selected)
    setConfirmed(true)
    setTimeout(onClose, 1800)
  }

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4"
      role="dialog"
      aria-modal="true"
      aria-labelledby="correction-modal-title"
    >
      <div
        className="absolute inset-0 bg-ink/40 backdrop-blur-sm"
        onClick={onClose}
        aria-hidden="true"
      />

      <div className="relative w-full max-w-sm rounded-2xl bg-surface shadow-lift ring-1 ring-inset ring-line/60">
        <div className="flex items-center justify-between border-b border-line/60 px-5 py-4">
          <h2 id="correction-modal-title" className="font-bold text-ink">
            ¿Cuál era la seña correcta?
          </h2>
          <button
            onClick={onClose}
            className="flex h-8 w-8 items-center justify-center rounded-lg text-muted hover:bg-primary/[0.06] hover:text-ink transition-colors"
            aria-label="Cerrar"
          >
            <X className="h-4 w-4" aria-hidden="true" />
          </button>
        </div>

        <div className="p-5">
          {confirmed ? (
            <div className="flex flex-col items-center gap-3 py-6 text-center">
              <CheckCircle2 className="h-10 w-10 text-success" aria-hidden="true" />
              <p className="font-semibold text-ink">Gracias. La corrección fue registrada.</p>
              <p className="text-sm text-muted">
                Esta información ayudará a mejorar el modelo en el futuro.
              </p>
            </div>
          ) : (
            <>
              <div className="grid grid-cols-2 gap-2">
                {correctionOptions.map((option) => (
                  <button
                    key={option}
                    onClick={() => setSelected(option)}
                    className={cn(
                      'rounded-xl border px-3 py-3 text-sm font-semibold text-left transition-all duration-200',
                      selected === option
                        ? 'border-primary bg-primary/10 text-primary'
                        : 'border-line/70 bg-paper text-ink hover:border-primary/40 hover:bg-primary/[0.04]',
                    )}
                  >
                    {option}
                  </button>
                ))}
              </div>

              <div className="mt-4 flex gap-2">
                <Button
                  onClick={handleConfirm}
                  disabled={!selected}
                  className="flex-1"
                >
                  Confirmar corrección
                </Button>
                <Button onClick={onClose} variant="ghost">
                  Cancelar
                </Button>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  )
}
