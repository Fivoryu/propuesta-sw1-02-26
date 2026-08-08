import {
  cloneElement,
  forwardRef,
  isValidElement,
  type InputHTMLAttributes,
  type ReactNode,
  type SelectHTMLAttributes,
  type TextareaHTMLAttributes,
} from 'react'
import { ChevronDown } from 'lucide-react'
import { cn } from '../utils/cn'

type FieldProps = {
  label: string
  htmlFor: string
  hint?: string
  error?: string
  required?: boolean
  children: ReactNode
}

export function Field({ label, htmlFor, hint, error, required = false, children }: FieldProps) {
  const messageId = `${htmlFor}-message`
  const describedChildren = isValidElement<{ 'aria-describedby'?: string }>(children)
    ? cloneElement(children, {
        'aria-describedby': [children.props['aria-describedby'], messageId].filter(Boolean).join(' '),
      })
    : children
  return (
    <div className="space-y-2">
      <label className="block text-sm font-semibold text-ink" htmlFor={htmlFor}>
        {label} {required ? <span aria-hidden="true" className="text-error">*</span> : null}
      </label>
      {describedChildren}
      {error ? (
        <p id={messageId} className="text-sm font-medium text-error" role="alert">
          {error}
        </p>
      ) : hint ? (
        <p id={messageId} className="text-sm leading-6 text-muted">
          {hint}
        </p>
      ) : null}
    </div>
  )
}

const controlClasses =
  'focus-ring min-h-12 w-full rounded-md bg-surface px-4 py-3 text-base text-ink ring-1 ring-inset ring-line/80 placeholder:text-muted/75 transition-[background-color,box-shadow,transform] duration-280 ease-spring hover:ring-primary/40 focus:ring-primary'

export const Input = forwardRef<HTMLInputElement, InputHTMLAttributes<HTMLInputElement>>(function Input(
  { className, 'aria-describedby': describedBy, ...props },
  ref,
) {
  return <input ref={ref} className={cn(controlClasses, className)} aria-describedby={describedBy} {...props} />
})

Input.displayName = 'Input'

export const Textarea = forwardRef<HTMLTextAreaElement, TextareaHTMLAttributes<HTMLTextAreaElement>>(function Textarea(
  { className, ...props },
  ref,
) {
  return <textarea ref={ref} className={cn(controlClasses, 'min-h-32 resize-y', className)} {...props} />
})

Textarea.displayName = 'Textarea'

export const Select = forwardRef<HTMLSelectElement, SelectHTMLAttributes<HTMLSelectElement>>(function Select(
  { className, children, ...props },
  ref,
) {
  return (
    <span className="relative block">
      <select ref={ref} className={cn(controlClasses, 'appearance-none pr-11', className)} {...props}>
        {children}
      </select>
      <ChevronDown aria-hidden="true" className="pointer-events-none absolute right-4 top-1/2 h-4 w-4 -translate-y-1/2 text-primary" />
    </span>
  )
})

Select.displayName = 'Select'
