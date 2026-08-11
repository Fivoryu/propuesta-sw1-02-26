export interface DashboardStats {
  sessionsToday: number
  signsRecognized: number
  averageAccuracy: number
  uncertainResults: number
  averageLatencyMs: number
}

export interface VocabularyStats {
  id: string
  name: string
  totalSigns: number
  accuracy: number
  usageCount: number
  status: 'active' | 'review' | 'inactive'
}

export interface SignStats {
  sign: string
  accuracy: number
  usageCount: number
  status: 'active' | 'review'
  vocabulary: string
}

export interface ModelInfo {
  name: string
  version: string
  accuracy: number
  lastUpdated: string
  status: 'active' | 'training' | 'inactive'
  totalSigns: number
  supportedVocabularies: number
}

export const dashboardStats: DashboardStats = {
  sessionsToday: 128,
  signsRecognized: 1284,
  averageAccuracy: 91.4,
  uncertainResults: 73,
  averageLatencyMs: 182,
}

export const vocabularyStats: VocabularyStats[] = [
  { id: 'reception', name: 'Recepción y orientación', totalSigns: 30, accuracy: 91.2, usageCount: 524, status: 'active' },
  { id: 'greetings', name: 'Saludos', totalSigns: 12, accuracy: 94.7, usageCount: 381, status: 'active' },
  { id: 'education', name: 'Educación', totalSigns: 25, accuracy: 88.3, usageCount: 247, status: 'active' },
  { id: 'questions', name: 'Preguntas básicas', totalSigns: 18, accuracy: 89.6, usageCount: 198, status: 'review' },
  { id: 'numbers', name: 'Números', totalSigns: 20, accuracy: 95.1, usageCount: 163, status: 'active' },
]

export const signStats: SignStats[] = [
  { sign: 'Hola', accuracy: 96, usageCount: 324, status: 'active', vocabulary: 'Saludos' },
  { sign: 'Ayuda', accuracy: 91, usageCount: 218, status: 'active', vocabulary: 'Recepción' },
  { sign: 'Gracias', accuracy: 94, usageCount: 202, status: 'active', vocabulary: 'Saludos' },
  { sign: 'Sí', accuracy: 97, usageCount: 188, status: 'active', vocabulary: 'Preguntas' },
  { sign: 'No', accuracy: 95, usageCount: 176, status: 'active', vocabulary: 'Preguntas' },
  { sign: 'Por favor', accuracy: 90, usageCount: 154, status: 'active', vocabulary: 'Recepción' },
  { sign: 'Recepción', accuracy: 82, usageCount: 95, status: 'review', vocabulary: 'Recepción' },
  { sign: '¿Dónde?', accuracy: 87, usageCount: 87, status: 'active', vocabulary: 'Preguntas' },
]

export const modelInfo: ModelInfo = {
  name: 'SignBridge Hands',
  version: 'v0.3',
  accuracy: 91.4,
  lastUpdated: 'Agosto 2026',
  status: 'active',
  totalSigns: 60,
  supportedVocabularies: 5,
}

export const recentActivity = [
  { time: '10:31', text: 'Hola', confidence: 96, vocabulary: 'Saludos', status: 'Reconocido' },
  { time: '10:32', text: 'Necesito ayuda', confidence: 94, vocabulary: 'Recepción', status: 'Reconocido' },
  { time: '10:34', text: 'Gracias', confidence: 71, vocabulary: 'Saludos', status: 'Confirmado manualmente' },
  { time: '10:41', text: '¿Dónde está recepción?', confidence: 88, vocabulary: 'Recepción', status: 'Reconocido' },
  { time: '10:47', text: 'Por favor', confidence: 90, vocabulary: 'Recepción', status: 'Reconocido' },
  { time: '11:02', text: 'Buenos días', confidence: 93, vocabulary: 'Saludos', status: 'Reconocido' },
  { time: '11:14', text: 'No comprendo', confidence: 62, vocabulary: 'Recepción', status: 'Confirmado manualmente' },
  { time: '11:28', text: 'Sí', confidence: 97, vocabulary: 'Preguntas', status: 'Reconocido' },
]
