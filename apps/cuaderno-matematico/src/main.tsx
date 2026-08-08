import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { BrowserRouter } from 'react-router-dom'
import { ToastProvider } from '@propuestas/ui'
import App from './App'
import '@propuestas/ui/styles.css'
import 'katex/dist/katex.min.css'
import './app.css'

const root = document.getElementById('root')
if (!root) throw new Error('App root element was not found')

createRoot(root).render(
  <StrictMode>
    <BrowserRouter>
      <ToastProvider><App /></ToastProvider>
    </BrowserRouter>
  </StrictMode>,
)
