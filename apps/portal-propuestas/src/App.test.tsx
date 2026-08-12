import { render, screen } from '@testing-library/react'
import '@testing-library/jest-dom/vitest'
import userEvent from '@testing-library/user-event'
import { MemoryRouter } from 'react-router-dom'
import { describe, expect, it } from 'vitest'
import { ToastProvider } from '@propuestas/ui'
import App from './App'

const proposals = [
  { id: 'mejora-mi-barrio', name: 'Mejora Mi Barrio' },
  { id: 'cuaderno-matematico', name: 'Cuaderno Matemático' },
  { id: 'encuentra-mi-mascota', name: 'Encuentra Mi Mascota' },
  { id: 'nutrivision', name: 'NutriVision' },
  { id: 'signbridge-ai', name: 'SignBridge AI' },
  { id: 'canasta-ai', name: 'CanastaAI' },
  { id: 'reciscan', name: 'ReciScan' },
]

function renderPortal(initialEntry = '/') {
  return render(
    <MemoryRouter initialEntries={[initialEntry]}>
      <ToastProvider>
        <App />
      </ToastProvider>
    </MemoryRouter>,
  )
}

describe('Portal de Propuestas main flow', () => {
  it('renders all proposal cards and reaches each proposal detail and app entry action', async () => {
    const user = userEvent.setup()
    renderPortal()

    expect(screen.getAllByRole('link', { name: 'Ver ficha' })).toHaveLength(proposals.length)
    expect(screen.getByText('07')).toBeInTheDocument()
    expect(
      screen.getByRole('heading', { name: /Siete productos para mirar de cerca/i }),
    ).toBeInTheDocument()

    for (const proposal of proposals) {
      const detailLink = screen
        .getAllByRole('link', { name: 'Ver ficha' })
        .find(
          (link) =>
            link.getAttribute('href') === `/propuestas/${proposal.id}`,
        )

      expect(detailLink).toBeDefined()
      await user.click(detailLink!)

      expect(
        await screen.findByRole('heading', { name: proposal.name }),
      ).toBeInTheDocument()

      expect(
        screen.getByRole('link', { name: 'Abrir prototipo' }),
      ).toHaveAttribute('href', '/')

      await user.click(
        screen.getByRole('link', { name: 'Volver al portal' }),
      )

      expect(
        await screen.findByRole('heading', {
          name: /Propuestas que se pueden recorrer/,
        }),
      ).toBeInTheDocument()
    }
  })
})
