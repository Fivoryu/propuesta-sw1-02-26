import { create } from 'zustand'
import type {
  EquationInput,
  EquationRecognitionResult,
  EquationScenarioId,
  InkStroke,
} from '../domain/equation'
import { cloneStrokes } from '../domain/equation'
import type { InsertedEquation, Notebook, NotebookFormValues, NotebookPage } from '../domain/notebook'

type RecognitionPhase = 'idle' | 'loading' | 'preview' | 'inserted'
type PendingRecognition = {
  requestId: string
  input: EquationInput
  scenarioId: EquationScenarioId
}

export type RecognitionState = {
  phase: RecognitionPhase
  requestId: string | null
  pending: PendingRecognition | null
  result: EquationRecognitionResult | null
  correctionTex: string | null
  insertedEquationId: string | null
}

export type NotebookStore = {
  notebooks: Notebook[]
  activeNotebookId: string
  activePageId: string
  selectedTool: 'pencil' | 'highlighter' | 'eraser'
  brushSize: number
  recognition: RecognitionState
  setActivePage: (notebookId: string, pageId: string) => void
  addNotebook: (values: NotebookFormValues) => string
  addPage: (notebookId: string) => string | null
  updatePageNote: (notebookId: string, pageId: string, note: string) => void
  commitStrokes: (notebookId: string, pageId: string, strokes: InkStroke[]) => void
  undoStrokes: (notebookId: string, pageId: string) => void
  redoStrokes: (notebookId: string, pageId: string) => void
  clearStrokes: (notebookId: string, pageId: string) => void
  setSelectedTool: (tool: NotebookStore['selectedTool']) => void
  setBrushSize: (size: number) => void
  insertEquation: (equation: InsertedEquation) => void
  removeEquation: (notebookId: string, pageId: string, equationId: string) => void
  beginRecognition: (input: EquationInput, scenarioId: EquationScenarioId) => void
  retryRecognition: () => void
  setRecognitionResult: (requestId: string, result: EquationRecognitionResult) => void
  applyCorrection: (latex: string) => void
  clearRecognition: () => void
}

function createId(prefix: string): string {
  return `${prefix}-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`
}

function createPage(id: string, title: string, note = ''): NotebookPage {
  return {
    id,
    title,
    note,
    lastEdited: 'Ahora',
    strokes: [],
    equations: [],
    undoStack: [],
    redoStack: [],
  }
}

function createSeedNotebooks(): Notebook[] {
  const physicsPage = createPage('pagina-cinematica', 'Movimiento rectilíneo', 'Recordar las variables antes de sustituir valores.')
  physicsPage.equations.push({
    id: 'equation-local-integral',
    label: 'Integral de práctica',
    tex: '\\int_0^1 x^2\\,dx',
    normalizedExpression: '∫[0,1] x^2 dx',
    source: 'simulated',
    addedAt: 'Ayer, 16:40',
    handwritingPreserved: true,
  })
  const physicsSecondPage = createPage('pagina-vectores', 'Apuntes de vectores', 'Una página de referencia para el próximo ejercicio.')
  const calculusPage = createPage('pagina-limites', 'Límites notables', 'Comparar la lectura manuscrita con la forma digital.')

  return [
    {
      id: 'cuaderno-fisica',
      title: 'Cinemática y movimiento',
      subject: 'Física',
      color: 'cobalt',
      createdAt: 'Creado hoy',
      lastActivity: 'Hoy, 10:42',
      progress: 42,
      pages: [physicsPage, physicsSecondPage],
    },
    {
      id: 'cuaderno-calculo',
      title: 'Cálculo sin apuro',
      subject: 'Cálculo',
      color: 'violet',
      createdAt: 'Creado ayer',
      lastActivity: 'Ayer, 18:20',
      progress: 68,
      pages: [calculusPage],
    },
  ]
}

function updatePage(
  notebooks: Notebook[],
  notebookId: string,
  pageId: string,
  updater: (page: NotebookPage, notebook: Notebook) => NotebookPage,
): Notebook[] {
  return notebooks.map((notebook) => {
    if (notebook.id !== notebookId) return notebook
    return {
      ...notebook,
      lastActivity: 'Ahora',
      pages: notebook.pages.map((page) => page.id === pageId ? updater(page, notebook) : page),
    }
  })
}

function getPageFromNotebooks(notebooks: Notebook[], notebookId: string, pageId: string): NotebookPage | null {
  return notebooks.find((notebook) => notebook.id === notebookId)?.pages.find((page) => page.id === pageId) ?? null
}

const seedNotebooks = createSeedNotebooks()
const initialNotebookId = seedNotebooks[0].id
const initialPageId = seedNotebooks[0].pages[0].id

const initialRecognition: RecognitionState = {
  phase: 'idle',
  requestId: null,
  pending: null,
  result: null,
  correctionTex: null,
  insertedEquationId: null,
}

export const useNotebookStore = create<NotebookStore>((set) => ({
  notebooks: seedNotebooks,
  activeNotebookId: initialNotebookId,
  activePageId: initialPageId,
  selectedTool: 'pencil',
  brushSize: 3,
  recognition: initialRecognition,
  setActivePage: (notebookId, pageId) => set({ activeNotebookId: notebookId, activePageId: pageId }),
  addNotebook: (values) => {
    const notebookId = createId('cuaderno')
    const pageId = createId('pagina')
    const notebook: Notebook = {
      id: notebookId,
      title: values.title.trim(),
      subject: values.subject,
      color: values.color,
      createdAt: 'Creado ahora',
      lastActivity: 'Ahora',
      progress: 0,
      pages: [createPage(pageId, 'Primera página')],
    }
    set((state) => ({ notebooks: [...state.notebooks, notebook], activeNotebookId: notebookId, activePageId: pageId }))
    return notebookId
  },
  addPage: (notebookId) => {
    const pageId = createId('pagina')
    let added = false
    set((state) => ({
      notebooks: state.notebooks.map((notebook) => {
        if (notebook.id !== notebookId) return notebook
        added = true
        return { ...notebook, lastActivity: 'Ahora', pages: [...notebook.pages, createPage(pageId, `Página ${notebook.pages.length + 1}`)] }
      }),
      activeNotebookId: added ? notebookId : state.activeNotebookId,
      activePageId: added ? pageId : state.activePageId,
    }))
    return added ? pageId : null
  },
  updatePageNote: (notebookId, pageId, note) => set((state) => ({ notebooks: updatePage(state.notebooks, notebookId, pageId, (page) => ({ ...page, note, lastEdited: 'Ahora' })) })),
  commitStrokes: (notebookId, pageId, strokes) => set((state) => ({
    notebooks: updatePage(state.notebooks, notebookId, pageId, (page) => ({
      ...page,
      strokes: cloneStrokes(strokes),
      undoStack: [...page.undoStack, cloneStrokes(page.strokes)].slice(-30),
      redoStack: [],
      lastEdited: 'Ahora',
    })),
  })),
  undoStrokes: (notebookId, pageId) => set((state) => ({
    notebooks: updatePage(state.notebooks, notebookId, pageId, (page) => {
      const previous = page.undoStack.at(-1)
      if (!previous) return page
      return {
        ...page,
        strokes: cloneStrokes(previous),
        undoStack: page.undoStack.slice(0, -1),
        redoStack: [...page.redoStack, cloneStrokes(page.strokes)],
        lastEdited: 'Ahora',
      }
    }),
  })),
  redoStrokes: (notebookId, pageId) => set((state) => ({
    notebooks: updatePage(state.notebooks, notebookId, pageId, (page) => {
      const next = page.redoStack.at(-1)
      if (!next) return page
      return {
        ...page,
        strokes: cloneStrokes(next),
        redoStack: page.redoStack.slice(0, -1),
        undoStack: [...page.undoStack, cloneStrokes(page.strokes)],
        lastEdited: 'Ahora',
      }
    }),
  })),
  clearStrokes: (notebookId, pageId) => set((state) => ({ notebooks: updatePage(state.notebooks, notebookId, pageId, (page) => ({
    ...page,
    strokes: [],
    undoStack: [...page.undoStack, cloneStrokes(page.strokes)].slice(-30),
    redoStack: [],
    lastEdited: 'Ahora',
  })) })),
  setSelectedTool: (selectedTool) => set({ selectedTool }),
  setBrushSize: (brushSize) => set({ brushSize }),
  insertEquation: (equation) => set((state) => {
    const { activeNotebookId, activePageId } = state
    if (!getPageFromNotebooks(state.notebooks, activeNotebookId, activePageId)) return state
    return {
      notebooks: updatePage(state.notebooks, activeNotebookId, activePageId, (page) => ({ ...page, equations: [...page.equations, equation] })),
      recognition: { ...state.recognition, phase: 'inserted', insertedEquationId: equation.id },
    }
  }),
  removeEquation: (notebookId, pageId, equationId) => set((state) => ({ notebooks: updatePage(state.notebooks, notebookId, pageId, (page) => ({ ...page, equations: page.equations.filter((equation) => equation.id !== equationId) })) })),
  beginRecognition: (input, scenarioId) => set((state) => {
    const requestId = createId('reconocimiento')
    return {
      recognition: {
        phase: 'loading',
        requestId,
        pending: { requestId, input, scenarioId },
        result: null,
        correctionTex: null,
        insertedEquationId: null,
      },
      activeNotebookId: state.activeNotebookId,
      activePageId: state.activePageId,
    }
  }),
  retryRecognition: () => set((state) => {
    if (!state.recognition.pending) return state
    const requestId = createId('reconocimiento')
    return {
      recognition: {
        ...state.recognition,
        phase: 'loading',
        requestId,
        pending: { ...state.recognition.pending, requestId },
        result: null,
        correctionTex: null,
        insertedEquationId: null,
      },
    }
  }),
  setRecognitionResult: (requestId, result) => set((state) => {
    if (state.recognition.requestId !== requestId) return state
    return { recognition: { ...state.recognition, phase: 'preview', result, correctionTex: null } }
  }),
  applyCorrection: (latex) => set((state) => ({ recognition: { ...state.recognition, phase: 'preview', correctionTex: latex } })),
  clearRecognition: () => set({ recognition: initialRecognition }),
}))

export function getNotebook(notebooks: Notebook[], notebookId: string | undefined): Notebook | null {
  return notebooks.find((notebook) => notebook.id === notebookId) ?? null
}

export function getPage(notebook: Notebook | null, pageId: string | undefined): NotebookPage | null {
  return notebook?.pages.find((page) => page.id === pageId) ?? null
}
