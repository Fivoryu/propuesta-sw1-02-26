import { render, screen } from '@testing-library/react'
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

describe('ReciScan prototype', () => {
  it('renders and switches between seller and recycler modes', async () => {
    const user = userEvent.setup()
    renderApp()
    expect(screen.getByRole('heading', { name: /lo que ya no necesitas/i })).toBeInTheDocument()
    await user.click(screen.getAllByRole('button', { name: /recolecto \/ compro/i })[0])
    expect(screen.getByText(/4 oportunidades/i)).toBeInTheDocument()
  })

  it('analyzes demo material and reaches publication', async () => {
    const user = userEvent.setup()
    renderApp('/escanear')
    await user.click(screen.getByRole('button', { name: /usar foto de demostración/i }))
    await user.click(screen.getByRole('button', { name: /analizar material/i }))
    expect(await screen.findByRole('heading', { name: /material identificado/i })).toBeInTheDocument()
    expect(screen.getByText('Limpio y seco')).toBeInTheDocument()
    expect(screen.getByText(/Bs 2,20 \/ kg/)).toBeInTheDocument()
    await user.click(screen.getByRole('link', { name: /publicar material/i }))
    expect(screen.queryByText(/encontramos 3 posibles recolectores/i)).not.toBeInTheDocument()
    await user.click(screen.getByRole('button', { name: /^Vender/i }))
    await user.click(screen.getByRole('button', { name: /^Publicar$/i }))
    expect(screen.getByText(/visible para recicladores cercanos/i)).toBeInTheDocument()
    expect(screen.getByText(/encontramos 3 posibles recolectores/i)).toBeInTheDocument()
    await user.click(screen.getAllByRole('button', { name: /ver perfil/i })[0])
    expect(screen.getByRole('heading', { name: /perfil de Carlos/i })).toBeInTheDocument()
    expect(screen.getByText(/Compra PET aprox/i)).toBeInTheDocument()
    await user.click(screen.getByRole('button', { name: /cerrar/i }))
    await user.click(screen.getAllByRole('button', { name: /^Coordinar$/i })[0])
    expect(screen.getByRole('heading', { name: /conversación/i })).toBeInTheDocument()
    expect(screen.getByText(/No compartas información sensible/i)).toBeInTheDocument()
  })

  it('opens and reserves a marketplace listing', async () => {
    const user = userEvent.setup()
    renderApp('/mercado')
    await user.click(screen.getByRole('button', { name: /PET/i }))
    await user.click(screen.getByRole('link', { name: /PET transparente/i }))
    expect(await screen.findByRole('heading', { name: /PET transparente/i })).toBeInTheDocument()
    await user.click(screen.getByRole('button', { name: /reservar oportunidad/i }))
    expect(screen.getByText(/reservado durante 30 min/i)).toBeInTheDocument()
    expect(screen.getByText(/reserva simulada activa/i)).toBeInTheDocument()
  })

  it('filters market by search and distinguishes nearby total from route total', async () => {
    const user = userEvent.setup()
    renderApp('/mercado')
    expect(screen.getByText(/4 oportunidades · 25,1 kg/i)).toBeInTheDocument()
    expect(screen.getByText(/3 seleccionadas · 20,9 kg/i)).toBeInTheDocument()
    await user.type(screen.getByLabelText(/buscar material/i), 'alemana')
    expect(screen.getByRole('link', { name: /cartón seco/i })).toBeInTheDocument()
    expect(screen.queryByRole('link', { name: /PET transparente/i })).not.toBeInTheDocument()
  })

  it('shows route, completes a stop and opens Pro', async () => {
    const user = userEvent.setup()
    renderApp('/recolecciones')
    expect(screen.getByRole('heading', { name: /ruta sugerida/i })).toBeInTheDocument()
    expect(screen.getByLabelText(/ruta ordenada/i)).toHaveTextContent('Equipetrol')
    await user.click(screen.getByRole('button', { name: /iniciar recorrido/i }))
    expect(screen.getByText(/Cantidad publicada/i)).toBeInTheDocument()
    expect(screen.getByText(/Peso confirmado/i)).toBeInTheDocument()
    await user.click(screen.getByRole('button', { name: /confirmar recolección/i }))
    expect(screen.getByText(/recolección completada/i)).toBeInTheDocument()
    await user.click(screen.getAllByRole('button', { name: /recolecto \/ compro/i })[0])
    await user.click(screen.getAllByRole('link', { name: /mi reciscan/i }).at(-1)!)
    await user.click(screen.getByRole('link', { name: /conocer reciscan pro/i }))
    expect(await screen.findByRole('heading', { name: /mejores oportunidades/i })).toBeInTheDocument()
  })
})
