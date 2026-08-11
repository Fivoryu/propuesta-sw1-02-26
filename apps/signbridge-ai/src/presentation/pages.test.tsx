import { render, screen } from '@testing-library/react'
import '@testing-library/jest-dom/vitest'
import userEvent from '@testing-library/user-event'
import { MemoryRouter } from 'react-router-dom'
import { beforeEach, describe, expect, it, vi } from 'vitest'
import { ToastProvider } from '@propuestas/ui'
import App from '../App'
import { useRecognitionStore } from '../stores/recognitionStore'

vi.mock('../hooks/useCamera', () => ({
  useCamera: () => ({
    videoRef: { current: null },
    state: 'idle',
    error: null,
    startCamera: vi.fn(async () => undefined),
    stopCamera: vi.fn(),
    pauseCamera: vi.fn(),
    resumeCamera: vi.fn(async () => undefined),
  }),
}))

function renderRecognition() {
  return render(
    <MemoryRouter initialEntries={['/recognition']}>
      <ToastProvider>
        <App />
      </ToastProvider>
    </MemoryRouter>,
  )
}

async function finishRecognition(expectedText: string) {
  await screen.findAllByText(expectedText, undefined, { timeout: 3000 })
}

describe('SignBridge AI recognition flow', () => {
  beforeEach(() => {
    useRecognitionStore.getState().reset()
    useRecognitionStore.getState().clearHistory()
    useRecognitionStore.getState().setSelectedVocabulary('reception')
  })


  it('selects a vocabulary, simulates recognition, and shows the result', async () => {
    const user = userEvent.setup()
    renderRecognition()

    await user.selectOptions(screen.getByLabelText('Vocabulario activo'), 'greetings')
    await user.click(screen.getByRole('button', { name: 'Simular éxito' }))
    expect(screen.getByText('Analizando seña...')).toBeInTheDocument()

    await finishRecognition('Seña reconocida')

    expect(screen.getAllByText('Seña reconocida').length).toBeGreaterThan(0)
    expect(screen.getByText('Hola')).toBeInTheDocument()
    expect(screen.getByText('Saludos')).toBeInTheDocument()
  })

  it('offers correction for a low-confidence result and records the corrected sign', async () => {
    const user = userEvent.setup()
    renderRecognition()

    await user.click(screen.getByRole('button', { name: 'Simular incertidumbre' }))
    await finishRecognition('Resultado posible')

    expect(screen.getAllByText('Resultado posible').length).toBeGreaterThan(0)
    expect(screen.getByText('¿Gracias?')).toBeInTheDocument()

    await user.click(screen.getByRole('button', { name: 'Corregir' }))
    const dialog = screen.getByRole('dialog')
    await user.click(screen.getByRole('button', { name: 'Hola' }))
    await user.click(screen.getByRole('button', { name: 'Confirmar corrección' }))

    expect(dialog).toHaveTextContent('Gracias. La corrección fue registrada.')
    expect(useRecognitionStore.getState().history[0]?.text).toBe('Hola')
  })

  it('shows the waiting state first and recovers from a recognition error', async () => {
    const user = userEvent.setup()
    renderRecognition()

    expect(screen.getByText('Esperando reconocimiento')).toBeInTheDocument()
    await user.click(screen.getByRole('button', { name: 'Simular error' }))
    await finishRecognition('No pudimos reconocer la seña')

    expect(screen.getByText('No pudimos reconocer la seña')).toBeInTheDocument()
    expect(screen.getByRole('button', { name: 'Intentar nuevamente' })).toBeInTheDocument()
  })
})
