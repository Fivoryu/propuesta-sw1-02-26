import { useNavigate } from 'react-router-dom'
import { Camera, Cpu, Volume2, HandMetal, ChevronRight, Dumbbell, Info, ArrowRight } from 'lucide-react'
import { Button } from '@propuestas/ui'

const howItWorksSteps = [
  { icon: Camera, label: 'Cámara', description: 'La cámara captura tus movimientos en tiempo real.' },
  { icon: HandMetal, label: 'Detección', description: 'Se detectan y analizan los landmarks de tus manos.' },
  { icon: Cpu, label: 'Inteligencia Artificial', description: 'El modelo clasifica la seña con nivel de confianza.' },
  { icon: Volume2, label: 'Texto y Voz', description: 'El resultado se muestra en texto y se reproduce en voz.' },
]

const featureCards = [
  {
    step: '01',
    icon: HandMetal,
    title: 'Realiza una seña',
    description: 'Coloca tus manos frente a la cámara y realiza cualquier seña del vocabulario disponible.',
  },
  {
    step: '02',
    icon: Cpu,
    title: 'La IA la analiza',
    description: 'El modelo procesa la imagen, detecta los puntos clave de tu mano y clasifica la seña.',
  },
  {
    step: '03',
    icon: Volume2,
    title: 'Obtén texto y voz',
    description: 'Recibes el texto reconocido con nivel de confianza y puedes reproducirlo en voz alta.',
  },
]

export function HomePage() {
  const navigate = useNavigate()

  return (
    <div className="min-h-full">
      <section className="app-background relative overflow-hidden px-6 py-20 text-center lg:py-28">
        <div className="relative mx-auto max-w-2xl">
          <div className="mb-6 inline-flex items-center gap-2 rounded-full bg-primary/10 px-4 py-1.5 text-xs font-bold uppercase tracking-widest text-primary">
            <HandMetal className="h-3.5 w-3.5" aria-hidden="true" />
            Prototipo Funcional · Ing. Software I
          </div>

          <h1 className="mb-4 text-5xl font-extrabold leading-tight tracking-tight text-ink lg:text-6xl">
            Sign<span className="text-primary">Bridge</span> AI
          </h1>

          <p className="mb-3 text-xl font-semibold text-muted">
            Comunicación accesible mediante visión por computadora.
          </p>

          <p className="mb-10 mx-auto max-w-lg text-base text-muted/80">
            Realiza una seña frente a la cámara y SignBridge AI la convierte en texto y voz para facilitar la comunicación.
          </p>

          <div className="flex flex-col items-center gap-3 sm:flex-row sm:justify-center">
            <Button
              size="lg"
              onClick={() => navigate('/recognition')}
              trailingIcon={<ArrowRight className="h-4 w-4" />}
            >
              Iniciar reconocimiento
            </Button>
            <Button
              size="lg"
              variant="secondary"
              onClick={() => navigate('/practice')}
              leadingIcon={<Dumbbell className="h-4 w-4" />}
            >
              Modo práctica
            </Button>
            <Button
              size="lg"
              variant="ghost"
              leadingIcon={<Info className="h-4 w-4" />}
              onClick={() => document.getElementById('how-it-works')?.scrollIntoView({ behavior: 'smooth' })}
            >
              Ver cómo funciona
            </Button>
          </div>
        </div>
      </section>

      <section className="px-6 py-16">
        <div className="mx-auto max-w-4xl">
          <div className="mb-10 text-center">
            <p className="text-xs font-bold uppercase tracking-widest text-primary">Flujo de uso</p>
            <h2 className="mt-2 text-3xl font-bold text-ink">Tres pasos simples</h2>
          </div>

          <div className="grid gap-6 sm:grid-cols-3">
            {featureCards.map((card) => (
              <div
                key={card.step}
                className="group relative flex flex-col gap-4 rounded-2xl bg-surface p-6 ring-1 ring-inset ring-line/60 transition-all duration-280 ease-spring hover:-translate-y-1 hover:shadow-quiet"
              >
                <div className="flex items-center justify-between">
                  <span className="flex h-11 w-11 items-center justify-center rounded-xl bg-primary/10 text-primary">
                    <card.icon className="h-6 w-6" aria-hidden="true" />
                  </span>
                  <span className="text-4xl font-black text-primary/10">{card.step}</span>
                </div>
                <div>
                  <h3 className="font-bold text-ink">{card.title}</h3>
                  <p className="mt-1 text-sm text-muted">{card.description}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section id="how-it-works" className="bg-paper px-6 py-16">
        <div className="mx-auto max-w-4xl">
          <div className="mb-10 text-center">
            <p className="text-xs font-bold uppercase tracking-widest text-primary">Tecnología</p>
            <h2 className="mt-2 text-3xl font-bold text-ink">¿Cómo funciona?</h2>
            <p className="mt-2 text-muted">El flujo completo desde la cámara hasta la voz.</p>
          </div>

          <div className="flex flex-col items-center gap-4 sm:flex-row sm:justify-center">
            {howItWorksSteps.map((step, idx) => (
              <div key={step.label} className="flex items-center gap-4">
                <div className="flex flex-col items-center gap-2 text-center">
                  <span className="flex h-14 w-14 items-center justify-center rounded-2xl bg-primary/10 text-primary">
                    <step.icon className="h-7 w-7" aria-hidden="true" />
                  </span>
                  <p className="text-sm font-bold text-ink">{step.label}</p>
                  <p className="max-w-[120px] text-[11px] text-muted leading-snug">{step.description}</p>
                </div>
                {idx < howItWorksSteps.length - 1 && (
                  <ChevronRight className="hidden h-6 w-6 shrink-0 text-muted/40 sm:block" aria-hidden="true" />
                )}
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="px-6 py-16">
        <div className="mx-auto max-w-2xl rounded-2xl bg-primary px-8 py-10 text-center text-white">
          <h2 className="mb-2 text-2xl font-bold">¿Listo para comenzar?</h2>
          <p className="mb-6 text-white/70">
            Activa la cámara y realiza tu primera seña en segundos.
          </p>
          <Button
            onClick={() => navigate('/recognition')}
            className="bg-white !text-primary hover:bg-white/90"
            size="lg"
            trailingIcon={<ArrowRight className="h-4 w-4" />}
          >
            Iniciar reconocimiento
          </Button>
        </div>
      </section>

      <footer className="border-t border-line/60 px-6 py-6 text-center">
        <p className="text-xs text-muted">
          SignBridge AI es una herramienta de apoyo para vocabularios específicos y no reemplaza a intérpretes profesionales.
        </p>
      </footer>
    </div>
  )
}
