import { render, screen, waitFor } from '@testing-library/react'
import '@testing-library/jest-dom/vitest'
import userEvent from '@testing-library/user-event'
import { MemoryRouter } from 'react-router-dom'
import { describe, expect, it } from 'vitest'
import App from '../App'

function renderApp(initialEntry = '/') {
  return render(
    <MemoryRouter initialEntries={[initialEntry]}>
      <App />
    </MemoryRouter>,
  )
}

describe('CanastaAI prototype', () => {
  it('renders the value proposition', () => {
    renderApp()
    expect(screen.getByRole('heading', { name: /tu compra cotidiana/i })).toBeInTheDocument()
    expect(screen.getByRole('link', { name: /escanear ticket/i })).toBeInTheDocument()
  })

  it('progresses from demo receipt to structured result', async () => {
    const user = userEvent.setup()
    renderApp('/escanear')
    await user.click(screen.getByRole('button', { name: /usar ticket de demostración/i }))
    await user.click(screen.getByRole('button', { name: /analizar ticket/i }))
    expect(await screen.findByRole('heading', { name: /ticket convertido/i })).toBeInTheDocument()
    expect(screen.getByText(/LECHE PIL ENT 1000ML/i)).toBeInTheDocument()
    await user.click(screen.getByRole('button', { name: /confirmar precios/i }))
    expect(screen.getByText(/ayudarán a mejorar/i)).toBeInTheDocument()
  })

  it('changes the basket recommendation when strategy changes', async () => {
    const user = userEvent.setup()
    renderApp('/comparar')
    expect(await screen.findByText('Equilibrio')).toBeInTheDocument()
    await user.click(screen.getByRole('button', { name: /mayor ahorro/i }))
    await waitFor(() => expect(screen.getAllByText('Mayor ahorro').length).toBeGreaterThan(0))
    expect(screen.getAllByText(/Bs 15,70/).length).toBeGreaterThan(0)
    await user.click(screen.getByRole('button', { name: /menor distancia/i }))
    await waitFor(() => expect(screen.getAllByText('Menor distancia').length).toBeGreaterThan(0))
    expect(screen.getAllByText(/Bs 3,90/).length).toBeGreaterThan(0)
    expect(screen.getByText(/Desplazamiento estimado/i)).toBeInTheDocument()
    expect(screen.queryByText(/adicionales/i)).not.toBeInTheDocument()
  })

  it('edits receipt output and does not render percentage as money', async () => {
    const user = userEvent.setup()
    renderApp('/escanear/resultado')
    await user.click(screen.getByRole('button', { name: /corregir leche pil/i }))
    const nameInput = screen.getByLabelText('Nombre corregido')
    await user.clear(nameInput)
    await user.type(nameInput, 'Leche corregida 1 L')
    expect(screen.getByText('Leche corregida 1 L')).toBeInTheDocument()

    renderApp('/precios/aceite-fino-900')
    expect(screen.getByText(/Subió \+/)).toHaveTextContent('%')
    expect(screen.queryByText(/Variación últimos 30 días.*Bs/)).not.toBeInTheDocument()
  })

  it('price filters change displayed order', async () => {
    const user = userEvent.setup()
    renderApp('/precios')
    const firstByPrice = screen.getAllByRole('link', { name: /Mercado|Super/i })[1].textContent
    await user.click(screen.getByRole('button', { name: /cerca de mí/i }))
    const firstByDistance = screen.getAllByRole('link', { name: /Mercado|Super/i })[1].textContent
    expect(firstByDistance).not.toBe(firstByPrice)
  })

  it('exposes mobile navigation destinations and Plus page', async () => {
    const user = userEvent.setup()
    renderApp()
    expect(screen.getByRole('navigation', { name: /navegación inferior/i })).toBeInTheDocument()
    await user.click(screen.getAllByRole('link', { name: /mi cuenta/i }).at(-1)!)
    expect(await screen.findByRole('heading', { name: /Renato/i })).toBeInTheDocument()
    await user.click(screen.getByRole('link', { name: /conocer canastaai plus/i }))
    expect(await screen.findByRole('heading', { name: /ahorro personal/i })).toBeInTheDocument()
  })
})
