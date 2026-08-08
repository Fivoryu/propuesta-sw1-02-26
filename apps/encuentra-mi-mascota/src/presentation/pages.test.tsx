import { render, screen } from '@testing-library/react'
import '@testing-library/jest-dom/vitest'
import userEvent from '@testing-library/user-event'
import { MemoryRouter } from 'react-router-dom'
import { beforeEach, describe, expect, it } from 'vitest'
import { ToastProvider } from '@propuestas/ui'
import App from '../App'
import { usePetStore } from '../state/pet-store'

function renderPet(initialEntry = '/reportar/perdida') {
  return render(
    <MemoryRouter initialEntries={[initialEntry]}>
      <ToastProvider>
        <App />
      </ToastProvider>
    </MemoryRouter>,
  )
}

async function completePetProfile(user: ReturnType<typeof userEvent.setup>) {
  await user.type(screen.getByLabelText(/Descripción breve/), 'Perro mediano con pecho blanco y collar azul.')
  await user.type(screen.getByLabelText(/Colores visibles/), 'Negro y blanco')
  await user.type(screen.getByLabelText(/Rasgos distintivos/), 'Mancha blanca en el hocico y collar azul')
  await user.click(screen.getByRole('button', { name: 'Continuar con fotos' }))
  await screen.findByRole('heading', { name: 'Mostrá tres ángulos, sin subirlos a ningún servidor.' })
}

async function addFixtureAndOpenSummary(user: ReturnType<typeof userEvent.setup>) {
  await user.click(screen.getByRole('button', { name: /Usar rostro frontal de ejemplo/ }))
  expect(screen.getAllByAltText('Ilustración local de un perro blanco y negro visto de frente')).toHaveLength(2)
  await user.click(screen.getByRole('button', { name: 'Revisar resumen' }))
}

describe('Encuentra Mi Mascota main flow', () => {
  beforeEach(() => {
    usePetStore.getState().resetFlow()
  })

  it('registers a profile, previews a fixture photo, searches, and renders ranked candidates', async () => {
    const user = userEvent.setup()
    renderPet()

    await completePetProfile(user)
    await addFixtureAndOpenSummary(user)
    expect(await screen.findByRole('heading', { name: 'Revisá el perfil con tus propios ojos.' })).toBeInTheDocument()

    await user.click(screen.getByRole('button', { name: 'Buscar coincidencias' }))
    expect(await screen.findByRole('heading', { name: 'Estas son las coincidencias posibles.' })).toBeInTheDocument()
    expect(screen.getByRole('heading', { name: 'Luna' })).toBeInTheDocument()
    expect(screen.getByRole('heading', { name: 'Bruno' })).toBeInTheDocument()
    expect(screen.getByText('Posibles coincidencias')).toBeInTheDocument()
    expect(screen.getAllByText('Posible coincidencia')).toHaveLength(2)
  })

  it('shows the no-match recovery path without treating absence as proof', async () => {
    const user = userEvent.setup()
    renderPet()

    await completePetProfile(user)
    await addFixtureAndOpenSummary(user)
    await user.selectOptions(screen.getByLabelText(/Modo de demostración/), 'pet-no-match')
    await user.click(screen.getByRole('button', { name: 'Buscar coincidencias' }))

    expect(await screen.findByRole('heading', { name: 'No encontramos coincidencias en los datos simulados.' })).toBeInTheDocument()
    expect(screen.getByRole('link', { name: 'Actualizar búsqueda' })).toBeInTheDocument()
    expect(screen.getByText(/no significa que la mascota no esté cerca/)).toBeInTheDocument()
  })
})
