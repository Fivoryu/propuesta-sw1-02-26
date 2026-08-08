import { CheckCircle2, Info, X } from 'lucide-react'
import { createContext, useCallback, useContext, useMemo, useState, type ReactNode } from 'react'
import { IconButton } from './icon-button'
import { cn } from '../utils/cn'

type ToastVariant = 'info' | 'success'
type ToastAction = { label: string; onClick: () => void }
type ToastInput = { title: string; message?: string; variant?: ToastVariant; action?: ToastAction }
type ToastRecord = ToastInput & { id: number }

type ToastContextValue = { show: (toast: ToastInput) => void }
const ToastContext = createContext<ToastContextValue | null>(null)

export function ToastProvider({ children }: { children: ReactNode }) {
  const [toasts, setToasts] = useState<ToastRecord[]>([])

  const dismiss = useCallback((id: number) => {
    setToasts((current) => current.filter((toast) => toast.id !== id))
  }, [])

  const show = useCallback((toast: ToastInput) => {
    const id = Date.now() + Math.random()
    setToasts((current) => [...current.slice(-2), { ...toast, id }])
    window.setTimeout(() => dismiss(id), 4500)
  }, [dismiss])

  const value = useMemo(() => ({ show }), [show])

  return (
    <ToastContext.Provider value={value}>
      {children}
      <div className="pointer-events-none fixed inset-x-4 bottom-4 z-30 flex justify-end" aria-live="polite" aria-atomic="true">
        <div className="flex w-full max-w-md flex-col gap-3">
          {toasts.map((toast) => (
            <ToastItem key={toast.id} toast={toast} onDismiss={dismiss} />
          ))}
        </div>
      </div>
    </ToastContext.Provider>
  )
}

function ToastItem({ toast, onDismiss }: { toast: ToastRecord; onDismiss: (id: number) => void }) {
  const Icon = toast.variant === 'success' ? CheckCircle2 : Info

  return (
    <div className="pointer-events-auto flex items-start gap-3 rounded-xl bg-surface p-4 shadow-lift ring-1 ring-inset ring-line/70" role="status">
      <Icon aria-hidden="true" className={cn('mt-0.5 h-5 w-5 shrink-0', toast.variant === 'success' ? 'text-success' : 'text-info')} />
      <div className="min-w-0 flex-1">
        <p className="font-semibold text-ink">{toast.title}</p>
        {toast.message ? <p className="mt-1 text-sm leading-5 text-muted">{toast.message}</p> : null}
        {toast.action ? (
          <button className="focus-ring mt-2 min-h-10 rounded-full px-3 text-sm font-semibold text-primary hover:bg-primary/[0.08]" type="button" onClick={() => { toast.action?.onClick(); onDismiss(toast.id) }}>
            {toast.action.label}
          </button>
        ) : null}
      </div>
      <IconButton label="Cerrar aviso" size="sm" icon={<X aria-hidden="true" className="h-4 w-4" />} onClick={() => onDismiss(toast.id)} />
    </div>
  )
}

export function useToast(): ToastContextValue {
  const context = useContext(ToastContext)
  if (!context) throw new Error('useToast must be used within ToastProvider')
  return context
}
