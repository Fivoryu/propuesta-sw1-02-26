import { Route, Routes } from 'react-router-dom'
import {
  AnalysisPage,
  ContactPage,
  HomePage,
  MatchDetailPage,
  NearbyPage,
  NotFoundPage,
  PetPhotosPage,
  PetProfilePage,
  ReencounterPage,
  SearchSummaryPage,
  MatchesPage,
} from './presentation/pages'

export default function App() {
  return (
    <Routes>
      <Route path="/" element={<HomePage />} />
      <Route path="/cerca" element={<NearbyPage />} />
      <Route path="/reportar/perdida" element={<PetProfilePage caseType="lost" />} />
      <Route path="/reportar/encontrada" element={<PetProfilePage caseType="found" />} />
      <Route path="/fotos" element={<PetPhotosPage />} />
      <Route path="/resumen" element={<SearchSummaryPage />} />
      <Route path="/buscando" element={<AnalysisPage />} />
      <Route path="/analisis" element={<AnalysisPage />} />
      <Route path="/coincidencias" element={<MatchesPage />} />
      <Route path="/coincidencias/:matchId" element={<MatchDetailPage />} />
      <Route path="/contacto" element={<ContactPage />} />
      <Route path="/reencuentro" element={<ReencounterPage />} />
      <Route path="*" element={<NotFoundPage />} />
    </Routes>
  )
}
