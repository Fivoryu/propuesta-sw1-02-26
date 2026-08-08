import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { BrowserRouter } from 'react-router-dom'
import { ToastProvider } from '@propuestas/ui'
import App from './App'
import '@propuestas/ui/styles.css'
import './app.css'
import 'leaflet/dist/leaflet.css'

const root = document.getElementById('root')
if (!root) throw new Error('App root element was not found')

createRoot(root).render(
  <StrictMode>
    <BrowserRouter>
      <ToastProvider><App /></ToastProvider>
    </BrowserRouter>
  </StrictMode>,
)
