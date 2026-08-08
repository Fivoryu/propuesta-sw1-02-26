import { fireEvent, render, screen } from '@testing-library/react'
import '@testing-library/jest-dom/vitest'
import userEvent from '@testing-library/user-event'
import { MemoryRouter } from 'react-router-dom'
import { beforeEach, describe, expect, it } from 'vitest'
import { ToastProvider } from '@propuestas/ui'
import App from '../App'
import { getPage } from '../state/notebook-store'
import { useNotebookStore } from '../state/notebook-store'
import type { InkStroke } from '../domain/equation'

const initialNotebooks = structuredClone(useNotebookStore.getState().notebooks)

function resetNotebookStore() {
  useNotebookStore.setState({
    notebooks: structuredClone(initialNotebooks),
    activeNotebookId: 'cuaderno-fisica',
    activePageId: 'pagina-cinematica',
    selectedTool: 'pencil',
    brushSize: 3,
    recognition: {
      phase: 'idle',
      requestId: null,
      pending: null,
      result: null,
      correctionTex: null,
      insertedEquationId: null,
    },
  })
}

function renderNotebook(initialEntry = '/cuadernos/cuaderno-fisica/paginas/pagina-cinematica') {
  return render(
    <MemoryRouter initialEntries={[initialEntry]}>
      <ToastProvider>
        <App />
      </ToastProvider>
    </MemoryRouter>,
  )
}

describe('Cuaderno Matemático main flow', () => {
  beforeEach(() => {
    resetNotebookStore()
  })

  it('shows and activates the persistent equation action in the editor', async () => {
    const user = userEvent.setup()
    renderNotebook()

    const equationButton = screen.getByRole('button', { name: 'Ecuación' })
    expect(equationButton).toBeInTheDocument()
    expect(equationButton).toHaveAttribute('aria-pressed', 'false')

    await user.click(equationButton)

    expect(screen.getByText('Modo ecuación activo')).toBeInTheDocument()
    expect(equationButton).toHaveAttribute('aria-pressed', 'true')
    expect(screen.getByRole('img', { name: 'Superficie para escribir una ecuación con el puntero' })).toBeInTheDocument()
  })

  it('debounces typed input and renders the local LaTeX proposal', async () => {
    const user = userEvent.setup()
    renderNotebook()

    await user.click(screen.getByRole('button', { name: 'Ecuación' }))
    await user.click(screen.getByRole('button', { name: 'Teclado' }))
    await user.type(screen.getByLabelText('Escribí la ecuación con el teclado'), '2x + 4 = 10')

    expect(await screen.findByText('LaTeX renderizado')).toBeInTheDocument()
    expect(screen.getByRole('heading', { name: 'Vista previa en el cuaderno' })).toBeInTheDocument()
    expect(screen.getByLabelText('Ecuación propuesta en el cuaderno')).toBeInTheDocument()
    expect(screen.getByLabelText('Propuesta LaTeX renderizada')).toBeInTheDocument()
    expect(screen.getAllByText('2x + 4 = 10').length).toBeGreaterThan(0)
    expect(screen.getByText('Esta demostración usa datos simulados; no es una predicción real.', { exact: false })).toBeInTheDocument()
  })

  it('recognizes the handwriting/fixture path, preserves strokes, and inserts the proposal', async () => {
    const user = userEvent.setup()
    const handwriting: InkStroke = {
      id: 'test-stroke',
      kind: 'pencil',
      color: '#17213B',
      size: 3,
      points: [{ x: 10, y: 10 }, { x: 30, y: 30 }],
    }
    useNotebookStore.getState().commitStrokes('cuaderno-fisica', 'pagina-cinematica', [handwriting])
    renderNotebook()

    await user.click(screen.getByRole('button', { name: 'Ecuación' }))
    await user.click(screen.getByRole('button', { name: 'Reconocer ahora' }))

    expect(await screen.findByText('LaTeX renderizado')).toBeInTheDocument()
    expect(screen.getByRole('heading', { name: 'Vista previa en el cuaderno' })).toBeInTheDocument()
    expect(screen.getByLabelText('Ecuación propuesta en el cuaderno')).toBeInTheDocument()
    expect(screen.getByLabelText('Propuesta LaTeX renderizada')).toBeInTheDocument()
    expect(screen.getByText('Expresión normalizada')).toBeInTheDocument()

    await user.click(screen.getByRole('button', { name: 'Aceptar' }))
    expect(await screen.findByText('Ecuaciones insertadas')).toBeInTheDocument()
    expect(screen.getByLabelText('Ecuación insertada en el cuaderno: Ecuación 2')).toBeInTheDocument()

    const page = getPage(useNotebookStore.getState().notebooks[0], 'pagina-cinematica')
    expect(page?.strokes).toHaveLength(1)
    expect(page?.equations).toHaveLength(2)
    expect(page?.equations.at(-1)?.handwritingPreserved).toBe(true)
  })

  it('automatically recognizes a committed Canvas stroke after a pause', async () => {
    renderNotebook()
    const user = userEvent.setup()
    await user.click(screen.getByRole('button', { name: 'Ecuación' }))

    const canvas = screen.getByRole('img', { name: 'Superficie para escribir una ecuación con el puntero' })
    fireEvent.pointerDown(canvas, { pointerId: 7, clientX: 24, clientY: 24 })
    fireEvent.pointerMove(canvas, { pointerId: 7, clientX: 72, clientY: 58 })
    fireEvent.pointerUp(canvas, { pointerId: 7, clientX: 72, clientY: 58 })

    expect(await screen.findByText('LaTeX renderizado')).toBeInTheDocument()
    expect(screen.getByLabelText('Ecuación propuesta en el cuaderno')).toBeInTheDocument()
    expect(getPage(useNotebookStore.getState().notebooks[0], 'pagina-cinematica')?.strokes).toHaveLength(1)
  })

  it('inserts from the in-page preview while keeping the original strokes', async () => {
    const user = userEvent.setup()
    const handwriting: InkStroke = {
      id: 'preview-stroke',
      kind: 'pencil',
      color: '#17213B',
      size: 3,
      points: [{ x: 18, y: 18 }, { x: 44, y: 32 }],
    }
    useNotebookStore.getState().commitStrokes('cuaderno-fisica', 'pagina-cinematica', [handwriting])
    renderNotebook()

    await user.click(screen.getByRole('button', { name: 'Ecuación' }))
    await user.click(screen.getByRole('button', { name: 'Reconocer ahora' }))
    expect(await screen.findByLabelText('Ecuación propuesta en el cuaderno')).toBeInTheDocument()

    await user.click(screen.getByRole('button', { name: 'Insertar en el cuaderno' }))

    expect(screen.getByLabelText('Ecuación insertada en el cuaderno: Ecuación 2')).toBeInTheDocument()
    expect(screen.queryByLabelText('Ecuación propuesta en el cuaderno')).not.toBeInTheDocument()
    expect(getPage(useNotebookStore.getState().notebooks[0], 'pagina-cinematica')?.strokes).toHaveLength(1)
    expect(getPage(useNotebookStore.getState().notebooks[0], 'pagina-cinematica')?.equations.at(-1)?.handwritingPreserved).toBe(true)
  })

  it('blocks acceptance for a low-confidence recognition until correction', async () => {
    const user = userEvent.setup()
    renderNotebook()

    await user.click(screen.getByRole('button', { name: 'Ecuación' }))
    await user.selectOptions(screen.getByLabelText('Escenario de demostración'), 'equation-low-confidence')
    await user.click(screen.getByRole('button', { name: 'Reconocer ahora' }))

    expect(await screen.findByText('Necesitamos tu revisión')).toBeInTheDocument()
    expect(screen.getByRole('button', { name: 'Aceptar' })).toBeDisabled()
  })

  it('preserves typed input and offers retry when recognition fails', async () => {
    const user = userEvent.setup()
    renderNotebook()

    await user.click(screen.getByRole('button', { name: 'Ecuación' }))
    await user.click(screen.getByRole('button', { name: 'Teclado' }))
    await user.type(screen.getByLabelText('Escribí la ecuación con el teclado'), '2x + 4 = 10')
    await user.selectOptions(screen.getByLabelText('Escenario de demostración'), 'equation-error')
    await user.click(screen.getByRole('button', { name: 'Reconocer ahora' }))

    expect(await screen.findByText('No pudimos reconocer la ecuación')).toBeInTheDocument()
    expect(screen.queryByLabelText('Ecuación propuesta en el cuaderno')).not.toBeInTheDocument()
    expect(screen.getByLabelText('Escribí la ecuación con el teclado')).toHaveValue('2x + 4 = 10')
    expect(screen.getByText('Reintentar')).toBeInTheDocument()
    expect(screen.getByText('Mantener manuscrita')).toBeInTheDocument()
  })

  it('shows an empty in-page preview until recognition produces a formula', () => {
    renderNotebook('/cuadernos/cuaderno-fisica/paginas/pagina-vectores')

    expect(screen.getByRole('heading', { name: 'Vista previa en el cuaderno' })).toBeInTheDocument()
    expect(screen.getByText('La ecuación aparecerá aquí después del reconocimiento')).toBeInTheDocument()
    expect(screen.queryByLabelText('Ecuación propuesta en el cuaderno')).not.toBeInTheDocument()
  })

  it('keeps the equation preview in the paper flow after the handwritten canvas', () => {
    renderNotebook('/cuadernos/cuaderno-fisica/paginas/pagina-vectores')

    const canvas = screen.getByRole('img', { name: 'Superficie para escribir una ecuación con el puntero' })
    const preview = screen.getByRole('heading', { name: 'Vista previa en el cuaderno' }).closest('section')

    expect(preview).not.toBeNull()
    if (!preview) return
    expect(preview).toHaveClass('notebook-equation-section')
    expect(preview.parentElement).toHaveClass('grid-paper')
    expect(preview).not.toHaveClass('absolute')
    expect(preview).not.toHaveClass('shadow-quiet')
    expect(preview.querySelector('.absolute')).not.toBeInTheDocument()
    expect(canvas.compareDocumentPosition(preview) & Node.DOCUMENT_POSITION_FOLLOWING).toBe(Node.DOCUMENT_POSITION_FOLLOWING)
  })

  it('keeps the in-page preview empty for a no-match result', async () => {
    const user = userEvent.setup()
    renderNotebook('/cuadernos/cuaderno-fisica/paginas/pagina-vectores')

    await user.click(screen.getByRole('button', { name: 'Ecuación' }))
    await user.selectOptions(screen.getByLabelText('Escenario de demostración'), 'equation-no-match')
    await user.click(screen.getByRole('button', { name: 'Reconocer ahora' }))

    expect(await screen.findByText('No pudimos reconocer una ecuación')).toBeInTheDocument()
    expect(screen.getByText('Todavía no hay una fórmula para mostrar')).toBeInTheDocument()
    expect(screen.queryByLabelText('Ecuación propuesta en el cuaderno')).not.toBeInTheDocument()
  })
})
