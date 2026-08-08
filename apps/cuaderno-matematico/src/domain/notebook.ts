import { z } from 'zod'
import type { ApproximateLocation } from '@propuestas/shared'
import type { EquationLocalReference, EquationRecognitionPayload, InkStroke } from './equation'

export type NotebookSubject = 'Física' | 'Cálculo' | 'Álgebra' | 'Geometría' | 'Otro'
export type NotebookColor = 'cobalt' | 'violet' | 'sun' | 'navy'

export type InsertedEquation = {
  id: string
  label: string
  tex: string
  normalizedExpression: string
  source: 'simulated' | 'user-corrected'
  addedAt: string
  handwritingPreserved: true
}

export type NotebookPage = {
  id: string
  title: string
  note: string
  lastEdited: string
  strokes: InkStroke[]
  equations: InsertedEquation[]
  undoStack: InkStroke[][]
  redoStack: InkStroke[][]
}

export type Notebook = {
  id: string
  title: string
  subject: NotebookSubject
  color: NotebookColor
  createdAt: string
  lastActivity: string
  progress: number
  pages: NotebookPage[]
}

export const notebookSubjectOptions = [
  { value: 'Física', label: 'Física' },
  { value: 'Cálculo', label: 'Cálculo' },
  { value: 'Álgebra', label: 'Álgebra' },
  { value: 'Geometría', label: 'Geometría' },
  { value: 'Otro', label: 'Otro' },
] as const satisfies ReadonlyArray<{ value: NotebookSubject; label: string }>

export const notebookColorOptions = [
  { value: 'cobalt', label: 'Cobalto', className: 'bg-[#2457D6]' },
  { value: 'violet', label: 'Violeta', className: 'bg-[#7257D9]' },
  { value: 'sun', label: 'Tiza amarilla', className: 'bg-[#F4C95D]' },
  { value: 'navy', label: 'Tinta navy', className: 'bg-[#17213B]' },
] as const satisfies ReadonlyArray<{ value: NotebookColor; label: string; className: string }>

const subjects = notebookSubjectOptions.map((option) => option.value) as [NotebookSubject, ...NotebookSubject[]]
const colors = notebookColorOptions.map((option) => option.value) as [NotebookColor, ...NotebookColor[]]

export const notebookSchema = z.object({
  title: z.string().trim().min(3, 'Escribí un título de al menos 3 caracteres.').max(56, 'El título puede tener hasta 56 caracteres.'),
  subject: z.enum(subjects, { message: 'Elegí una materia para agrupar tu cuaderno.' }),
  color: z.enum(colors, { message: 'Elegí un color para identificar tu cuaderno.' }),
})

export type NotebookFormValues = z.infer<typeof notebookSchema>

export type PageEquationSummary = EquationLocalReference & {
  equationCount: number
}

export function getNotebookColorClasses(color: NotebookColor): { accent: string; soft: string; dot: string } {
  if (color === 'violet') return { accent: 'bg-[#7257D9]', soft: 'bg-[#F0EDFF]', dot: 'bg-[#7257D9]' }
  if (color === 'sun') return { accent: 'bg-[#DDAF35]', soft: 'bg-[#FFF8DE]', dot: 'bg-[#F4C95D]' }
  if (color === 'navy') return { accent: 'bg-[#17213B]', soft: 'bg-[#E8ECF5]', dot: 'bg-[#17213B]' }
  return { accent: 'bg-[#2457D6]', soft: 'bg-[#EAF0FF]', dot: 'bg-[#2457D6]' }
}

export function getPageEquationReferences(notebook: Notebook, page: NotebookPage): EquationLocalReference[] {
  return page.equations.map((equation) => ({
    id: equation.id,
    notebookId: notebook.id,
    pageId: page.id,
    notebookTitle: notebook.title,
    pageTitle: page.title,
    tex: equation.tex,
  }))
}

export function createInsertedEquation(page: NotebookPage, payload: EquationRecognitionPayload, tex: string, hasCorrection: boolean): InsertedEquation {
  return {
    id: `ecuacion-${Date.now()}`,
    label: `Ecuación ${page.equations.length + 1}`,
    tex,
    normalizedExpression: hasCorrection ? tex : payload.normalizedExpression,
    source: hasCorrection ? 'user-corrected' : 'simulated',
    addedAt: 'Ahora',
    handwritingPreserved: true,
  }
}

export function getLocationForNotebook(area: ApproximateLocation): string {
  return `${area.label} · demostración local`
}
