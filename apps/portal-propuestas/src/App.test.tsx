import { render, screen } from '@testing-library/react'
import '@testing-library/jest-dom/vitest'
import userEvent from '@testing-library/user-event'
import { MemoryRouter } from 'react-router-dom'
import { describe, expect, it } from 'vitest'
import { ToastProvider } from '@propuestas/ui'
import App from './App'

function renderPortal(initialEntry = '/') {
  return render(
    <MemoryRouter initialEntries={[initialEntry]}>
      <ToastProvider>
        <App />
      </ToastProvider>
    </MemoryRouter>,
  )
}

describe('Portal de Propuestas with an empty catalog', () => {
  it('shows the empty-catalog state instead of proposal cards', () => {
    renderPortal()

    expect(screen.getByText('00')).toBeInTheDocument()
    expect(
      screen.getByRole('heading', { name: 'El catálogo se está armando.' }),
    ).toBeInTheDocument()
    expect(
      screen.getByRole('heading', { name: 'Aún no hay prototipos registrados' }),
    ).toBeInTheDocument()
    expect(screen.queryByRole('link', { name: 'Ver ficha' })).not.toBeInTheDocument()
  })

  it('opens the comparison page with its own empty state', async () => {
    const user = userEvent.setup()
    renderPortal('/comparar')

    expect(
      await screen.findByRole('heading', { name: 'Todavía no hay propuestas para comparar' }),
    ).toBeInTheDocument()

    await user.click(screen.getByRole('link', { name: 'Volver al portal' }))
    expect(
      await screen.findByRole('heading', { name: 'El catálogo se está armando.' }),
    ).toBeInTheDocument()
  })

  it('reaches the not-found page for unknown routes', async () => {
    renderPortal('/ruta-inexistente')

    expect(
      await screen.findByRole('heading', { name: 'No encontramos esa propuesta' }),
    ).toBeInTheDocument()
  })
})