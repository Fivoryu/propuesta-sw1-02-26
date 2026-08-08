import { render, screen } from '@testing-library/react'
import '@testing-library/jest-dom/vitest'
import userEvent from '@testing-library/user-event'
import { MemoryRouter } from 'react-router-dom'
import { beforeEach, describe, expect, it } from 'vitest'
import { ToastProvider } from '@propuestas/ui'
import App from '../App'
import { useUrbanReportStore } from '../state/urban-report-store'

function renderBarrio(initialEntry = '/reportar') {
  return render(
    <MemoryRouter initialEntries={[initialEntry]}>
      <ToastProvider>
        <App />
      </ToastProvider>
    </MemoryRouter>,
  )
}

async function completeUrbanForm(user: ReturnType<typeof userEvent.setup>, scenarioId = 'urban-success-high') {
  await user.click(screen.getByRole('button', { name: /Bache en vía/ }))
  await user.selectOptions(screen.getByLabelText(/Modo de demostración/), scenarioId)
  await user.type(screen.getByLabelText(/¿Qué observaste\?/), 'Hay un bache grande cerca de la parada del barrio.')
}

describe('Mejora Mi Barrio main flow', () => {
  beforeEach(() => {
    useUrbanReportStore.getState().resetFlow()
  })

  it('validates the draft, accepts a fixture, analyzes it, and confirms a local report', async () => {
    const user = userEvent.setup()
    renderBarrio()

    await user.click(screen.getByRole('button', { name: 'Analizar problema' }))
    expect(await screen.findByText('Describí el problema con al menos 20 caracteres.')).toBeInTheDocument()

    await completeUrbanForm(user)
    expect(screen.getAllByAltText('Ilustración local de un bache señalizado en una calle')).toHaveLength(2)
    await user.click(screen.getByRole('button', { name: 'Analizar problema' }))

    expect(await screen.findByRole('heading', { name: 'Este es el resultado que podés decidir.' })).toBeInTheDocument()
    expect(screen.getByText('Confianza alta')).toBeInTheDocument()

    await user.click(screen.getByRole('button', { name: 'Continuar' }))
    expect(await screen.findByRole('heading', { name: 'Confirmá lo que querés conservar.' })).toBeInTheDocument()
    await user.click(screen.getByRole('button', { name: 'Confirmar resumen local' }))

    expect(await screen.findByText('Guardado en esta demostración')).toBeInTheDocument()
    expect(screen.getByText(/Esta línea de tiempo es simulada/)).toBeInTheDocument()
  })

  it('represents a low-confidence result as requiring review before confirmation', async () => {
    const user = userEvent.setup()
    renderBarrio()
    await completeUrbanForm(user, 'urban-low-confidence')
    await user.click(screen.getByRole('button', { name: 'Analizar problema' }))

    expect(await screen.findByText('Necesitamos tu revisión')).toBeInTheDocument()
    expect(screen.getByRole('button', { name: 'Revisión requerida' })).toBeDisabled()
  })
})
