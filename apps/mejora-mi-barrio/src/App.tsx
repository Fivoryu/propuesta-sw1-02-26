import { Route, Routes } from 'react-router-dom'
import {
  AnalysisPage,
  ConfirmPage,
  DuplicatePage,
  HomePage,
  MyReportsPage,
  NotFoundPage,
  ReportDetailPage,
  ReportFormPage,
  ResultPage,
} from './presentation/pages'

export default function App() {
  return (
    <Routes>
      <Route path="/" element={<HomePage />} />
      <Route path="/reportar" element={<ReportFormPage />} />
      <Route path="/analisis" element={<AnalysisPage />} />
      <Route path="/resultado" element={<ResultPage />} />
      <Route path="/duplicado" element={<DuplicatePage />} />
      <Route path="/confirmar" element={<ConfirmPage />} />
      <Route path="/reportes/resumen" element={<MyReportsPage />} />
      <Route path="/mis-reportes" element={<MyReportsPage />} />
      <Route path="/reportes/:reportId" element={<ReportDetailPage />} />
      <Route path="*" element={<NotFoundPage />} />
    </Routes>
  )
}
