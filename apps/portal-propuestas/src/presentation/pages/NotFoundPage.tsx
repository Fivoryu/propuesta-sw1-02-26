import { Compass } from 'lucide-react'
import { Link } from 'react-router-dom'
import { EmptyState } from '@propuestas/ui'

export function NotFoundPage() {
  return (
    <div className="reveal py-16 md:py-24">
      <EmptyState title="No encontramos esa propuesta" icon={<Compass aria-hidden="true" className="h-5 w-5" />} action={<Link className="focus-ring inline-flex min-h-12 items-center justify-center rounded-full bg-primary px-5 py-3 text-sm font-semibold text-white shadow-quiet hover:bg-primary/90" to="/">Volver al portal</Link>}>
        La ruta no coincide con una ficha disponible. Regresá al catálogo para continuar la revisión sin perder el contexto.
      </EmptyState>
    </div>
  )
}
