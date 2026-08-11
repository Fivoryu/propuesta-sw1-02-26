import { Route, Routes } from 'react-router-dom'
import { Sidebar } from './presentation/components/Sidebar'
import { Header } from './presentation/components/Header'
import { HomePage } from './presentation/pages/HomePage'
import { RecognitionPage } from './presentation/pages/RecognitionPage'
import { PracticePage } from './presentation/pages/PracticePage'
import { HistoryPage } from './presentation/pages/HistoryPage'
import { AdminPage } from './presentation/pages/AdminPage'

function NotFoundPage() {
  return (
    <div className="flex min-h-full flex-col items-center justify-center gap-4 text-center px-6 py-20">
      <p className="text-5xl font-extrabold text-primary">404</p>
      <p className="text-xl font-bold text-ink">Página no encontrada</p>
      <a href="/" className="text-sm font-semibold text-primary hover:underline">
        Volver al inicio
      </a>
    </div>
  )
}

export default function App() {
  return (
    <div data-theme="signbridge" className="flex min-h-screen bg-paper">
      <Sidebar />
      <Header />

      <div className="flex flex-1 flex-col lg:pl-64">
        <main className="flex-1 pt-14 lg:pt-0">
          <Routes>
            <Route path="/" element={<HomePage />} />
            <Route path="/recognition" element={<RecognitionPage />} />
            <Route path="/practice" element={<PracticePage />} />
            <Route path="/history" element={<HistoryPage />} />
            <Route path="/admin" element={<AdminPage />} />
            <Route path="*" element={<NotFoundPage />} />
          </Routes>
        </main>
      </div>
    </div>
  )
}
