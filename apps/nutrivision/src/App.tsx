import { Route, Routes } from 'react-router-dom'
import { AppProvider } from './state/app-context'
import { MobileLayout } from './presentation/components'
import { AnalysisPage, CameraPage, HistoryPage, HomePage, MealDetailPage, NutritionPage, ProcessingPage, ProfilePage, SuccessPage } from './presentation/product-pages'
import { GoalPage, ProfileSetupPage, WelcomePage } from './presentation/start-pages'

export default function App() { return <AppProvider><MobileLayout><Routes><Route path="/" element={<WelcomePage />} /><Route path="/profile-setup" element={<ProfileSetupPage />} /><Route path="/goal" element={<GoalPage />} /><Route path="/home" element={<HomePage />} /><Route path="/camera" element={<CameraPage />} /><Route path="/processing" element={<ProcessingPage />} /><Route path="/analysis" element={<AnalysisPage />} /><Route path="/nutrition-result" element={<NutritionPage />} /><Route path="/history" element={<HistoryPage />} /><Route path="/meal/:id" element={<MealDetailPage />} /><Route path="/profile" element={<ProfilePage />} /><Route path="/success" element={<SuccessPage />} /><Route path="*" element={<WelcomePage />} /></Routes></MobileLayout></AppProvider> }
