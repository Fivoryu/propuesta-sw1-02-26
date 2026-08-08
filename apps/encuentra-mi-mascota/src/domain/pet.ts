import { z } from 'zod'
import type { ApproximateLocation, SantaCruzAreaId } from '@propuestas/shared'
import { santaCruzLocations } from '@propuestas/shared'

export type PetCaseType = 'lost' | 'found'
export type PetSize = 'small' | 'medium' | 'large'
export type PetConfidence = 'high' | 'medium' | 'low'
export type PetMatchStatus = 'success' | 'low_confidence' | 'duplicate' | 'no_match' | 'error'
export type PetScenarioId =
  | 'pet-success-ranked'
  | 'pet-low-confidence'
  | 'pet-duplicate'
  | 'pet-no-match'
  | 'pet-error'

export type PetPhotoSlotId = 'front' | 'profile' | 'full-body'
export type PetPhotoKind = 'fixture' | 'upload'

export type PetPhoto = {
  slot: PetPhotoSlotId
  src: string
  kind: PetPhotoKind
  label: string
  alt: string
  fixtureId?: string
}

export type PetProfile = {
  caseType: PetCaseType
  name: string
  description: string
  species: 'dog'
  size: PetSize
  colors: string
  traits: string
  approximateLocationId: SantaCruzAreaId
  reportedAt: string
}

export type PetDraft = PetProfile & {
  scenarioId: PetScenarioId
}

export type PetMatchInput = {
  profile: PetProfile
  photos: readonly PetPhoto[]
}

export type PetMatchOptions = {
  scenarioId?: PetScenarioId
  latencyMs?: number
  signal?: AbortSignal
  requestId?: string
  isRequestCurrent?: (requestId: string) => boolean
}

export type PetMatchMeta = {
  scenarioId: PetScenarioId
  status: PetMatchStatus
  latencyMs: number
  disclaimer: 'simulated'
  requestId?: string
}

export type PetCandidate = {
  id: string
  caseType: PetCaseType
  name: string
  photo: PetPhoto
  approximateLocation: ApproximateLocation
  lat: number
  lng: number
  distanceKm: number
  reportedAt: string
  size: PetSize
  colors: string
  traits: string
  score: number
  confidence: PetConfidence
  matchReasons: string[]
  note: string
  simulated: true
}

type PetResultBase = {
  meta: PetMatchMeta
  scenarioId: PetScenarioId
  latencyMs: number
  disclaimer: 'simulated'
}

export type PetMatchResult =
  | (PetResultBase & {
      status: 'success'
      matches: PetCandidate[]
    })
  | (PetResultBase & {
      status: 'low_confidence'
      matches: PetCandidate[]
      reviewMessage: string
    })
  | (PetResultBase & {
      status: 'duplicate'
      matches: PetCandidate[]
      duplicate: PetCandidate
    })
  | (PetResultBase & {
      status: 'no_match'
      matches: []
      broadeningGuidance: string
    })
  | (PetResultBase & {
      status: 'error'
      error: {
        code: 'MOCK_MATCHING_UNAVAILABLE'
        message: string
      }
    })

export const MATCH_SCORE_DISCLAIMER = 'El porcentaje es una estimación visual y no confirma que sea la misma mascota'

export const petSizeLabels: Record<PetSize, string> = {
  small: 'Pequeño',
  medium: 'Mediano',
  large: 'Grande',
}

export const petCaseLabels: Record<PetCaseType, string> = {
  lost: 'Mascota perdida',
  found: 'Mascota encontrada',
}

export const petConfidenceLabels: Record<PetConfidence, string> = {
  high: 'Coincidencia alta',
  medium: 'Coincidencia media',
  low: 'Confianza baja',
}

export const petScenarioOptions = [
  { value: 'pet-success-ranked', label: 'Coincidencia alta' },
  { value: 'pet-low-confidence', label: 'Coincidencia media/baja' },
  { value: 'pet-no-match', label: 'Sin coincidencias' },
  { value: 'pet-error', label: 'Error de procesamiento' },
  { value: 'pet-duplicate', label: 'Aviso duplicado' },
] as const satisfies ReadonlyArray<{ value: PetScenarioId; label: string }>

export const petSizeOptions = [
  { value: 'small', label: 'Pequeño' },
  { value: 'medium', label: 'Mediano' },
  { value: 'large', label: 'Grande' },
] as const satisfies ReadonlyArray<{ value: PetSize; label: string }>

export const photoSlotDefinitions: ReadonlyArray<{
  id: PetPhotoSlotId
  label: string
  guidance: string
}> = [
  { id: 'front', label: 'Frontal', guidance: 'Rostro visible, mirada al frente' },
  { id: 'profile', label: 'Perfil', guidance: 'Orejas y hocico de lado' },
  { id: 'full-body', label: 'Cuerpo completo', guidance: 'Postura y pelaje completos' },
]

const locationIds = [
  'sc-equipetrol',
  'sc-plan-3000',
  'sc-villa-primero-de-mayo',
  'sc-las-palmas',
  'sc-parque-urbano',
] as const

export const petProfileSchema = z.object({
  name: z.string().trim().max(40, 'El nombre puede tener hasta 40 caracteres.').optional(),
  description: z.string().trim().min(20, 'Describí la mascota con al menos 20 caracteres.').max(320, 'La descripción puede tener hasta 320 caracteres.'),
  species: z.literal('dog'),
  size: z.enum(['small', 'medium', 'large'], { message: 'Elegí un tamaño aproximado.' }),
  colors: z.string().trim().min(2, 'Indicá al menos un color visible.').max(100, 'Los colores pueden tener hasta 100 caracteres.'),
  traits: z.string().trim().min(4, 'Contá al menos un rasgo distintivo.').max(180, 'Los rasgos pueden tener hasta 180 caracteres.'),
  approximateLocationId: z.enum(locationIds, { message: 'Elegí una zona aproximada.' }),
  reportedAt: z.string().min(1, 'Elegí una fecha aproximada.'),
})

export type PetProfileFormValues = z.infer<typeof petProfileSchema>

export const defaultPetDraft: PetDraft = {
  caseType: 'lost',
  name: '',
  description: '',
  species: 'dog',
  size: 'medium',
  colors: '',
  traits: '',
  approximateLocationId: 'sc-parque-urbano',
  reportedAt: '2026-08-06',
  scenarioId: 'pet-success-ranked',
}

function svgDataUrl(title: string, background: string, coat: string, accent: string): string {
  const svg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 720 520"><rect width="720" height="520" rx="48" fill="${background}"/><circle cx="592" cy="106" r="90" fill="${accent}" opacity=".42"/><circle cx="116" cy="432" r="132" fill="${accent}" opacity=".2"/><path d="M210 196 168 92c-8-20 16-36 32-21l83 72c26-11 58-17 87-17 30 0 61 6 87 17l83-72c16-15 40 1 32 21l-42 104c26 32 39 70 39 112 0 83-89 150-199 150s-199-67-199-150c0-42 13-80 39-112Z" fill="${coat}"/><ellipse cx="300" cy="274" rx="17" ry="23" fill="#243a38"/><ellipse cx="420" cy="274" rx="17" ry="23" fill="#243a38"/><path d="M326 344c26 19 42 19 68 0" fill="none" stroke="#243a38" stroke-width="12" stroke-linecap="round"/><path d="M332 294h56l-16 31h-24z" fill="${accent}" opacity=".95"/><text x="48" y="470" fill="#243a38" font-family="Georgia,serif" font-size="24" font-weight="700">${title}</text></svg>`
  return `data:image/svg+xml;charset=UTF-8,${encodeURIComponent(svg)}`
}

export const petPhotoFixtures: readonly PetPhoto[] = [
  {
    slot: 'front',
    fixtureId: 'pet-photo-front-01',
    kind: 'fixture',
    src: svgDataUrl('Frontal / ficha local', '#d9f1e9', '#f8f5ec', '#f18f6a'),
    label: 'Rostro frontal de ejemplo',
    alt: 'Ilustración local de un perro blanco y negro visto de frente',
  },
  {
    slot: 'profile',
    fixtureId: 'pet-photo-profile-01',
    kind: 'fixture',
    src: svgDataUrl('Perfil / ficha local', '#fbe4d8', '#222d2d', '#39a995'),
    label: 'Perfil de ejemplo',
    alt: 'Ilustración local de un perro oscuro visto de perfil',
  },
  {
    slot: 'full-body',
    fixtureId: 'pet-photo-full-01',
    kind: 'fixture',
    src: svgDataUrl('Cuerpo completo / ficha local', '#e8e5f4', '#bd8b5c', '#0e7c66'),
    label: 'Cuerpo completo de ejemplo',
    alt: 'Ilustración local de un perro marrón de cuerpo completo',
  },
]

function location(areaId: SantaCruzAreaId): ApproximateLocation {
  return santaCruzLocations.find((item) => item.areaId === areaId) ?? santaCruzLocations[0]
}

const frontFixture = petPhotoFixtures[0]
const profileFixture = petPhotoFixtures[1]
const fullBodyFixture = petPhotoFixtures[2]

export const petNearbyReports: readonly PetCandidate[] = [
  {
    id: 'pet-nearby-luna',
    caseType: 'found',
    name: 'Luna',
    photo: frontFixture,
    approximateLocation: location('sc-equipetrol'),
    lat: -17.765,
    lng: -63.193,
    distanceKm: 0.8,
    reportedAt: '4 de agosto de 2026',
    size: 'medium',
    colors: 'Pelaje negro y blanco',
    traits: 'Mancha blanca en el hocico; oreja izquierda ligeramente caída',
    score: 0.89,
    confidence: 'high',
    matchReasons: ['Mancha blanca en el hocico', 'Oreja izquierda ligeramente caída', 'Pelaje negro y blanco'],
    note: 'Aviso ficticio para revisar con calma.',
    simulated: true,
  },
  {
    id: 'pet-nearby-bruno',
    caseType: 'found',
    name: 'Bruno',
    photo: profileFixture,
    approximateLocation: location('sc-parque-urbano'),
    lat: -17.787,
    lng: -63.183,
    distanceKm: 2.4,
    reportedAt: '2 de agosto de 2026',
    size: 'medium',
    colors: 'Negro con pecho claro',
    traits: 'Collar azul; cola curva',
    score: 0.64,
    confidence: 'medium',
    matchReasons: ['Tamaño parecido', 'Zona aproximada cercana', 'Pelaje oscuro'],
    note: 'La información disponible es parcial.',
    simulated: true,
  },
  {
    id: 'pet-nearby-nube',
    caseType: 'lost',
    name: 'Nube',
    photo: fullBodyFixture,
    approximateLocation: location('sc-las-palmas'),
    lat: -17.776,
    lng: -63.203,
    distanceKm: 3.1,
    reportedAt: '1 de agosto de 2026',
    size: 'small',
    colors: 'Marrón claro y blanco',
    traits: 'Punta de la cola blanca',
    score: 0.51,
    confidence: 'low',
    matchReasons: ['Zona aproximada cercana'],
    note: 'Rasgos insuficientes para una comparación sólida.',
    simulated: true,
  },
  {
    id: 'pet-nearby-toby',
    caseType: 'found',
    name: 'Toby',
    photo: fullBodyFixture,
    approximateLocation: location('sc-plan-3000'),
    lat: -17.797,
    lng: -63.153,
    distanceKm: 5.6,
    reportedAt: '30 de julio de 2026',
    size: 'large',
    colors: 'Dorado',
    traits: 'Pecho amplio; pañuelo verde',
    score: 0.35,
    confidence: 'low',
    matchReasons: ['Especie compatible'],
    note: 'Comparación visual de baja confianza.',
    simulated: true,
  },
]

export const petSuccessMatches: readonly PetCandidate[] = [petNearbyReports[0], petNearbyReports[1]]

export const petDuplicateCandidate: PetCandidate = {
  ...petNearbyReports[0],
  id: 'pet-duplicate-local-profile',
  name: 'Aviso parecido',
  score: 0.86,
  confidence: 'high',
  matchReasons: ['Mismo tipo de aviso', 'Colores y rasgos muy cercanos', 'Zona aproximada compatible'],
  note: 'Perfil local ficticio que se muestra para revisar posibles duplicados.',
}

export const petLowConfidenceMatches: readonly PetCandidate[] = [
  { ...petNearbyReports[2], id: 'pet-low-nube', score: 0.48, matchReasons: ['Zona aproximada cercana'] },
  { ...petNearbyReports[3], id: 'pet-low-toby', score: 0.41, matchReasons: ['Especie compatible'] },
]

export function getPetLocation(areaId: SantaCruzAreaId): ApproximateLocation {
  return location(areaId)
}

export function getPetScoreLabel(score: number): string {
  return `${Math.round(Math.min(1, Math.max(0, score)) * 100)}%`
}

export function getPetCasePath(caseType: PetCaseType): string {
  return caseType === 'lost' ? '/reportar/perdida' : '/reportar/encontrada'
}

export function isProfileComplete(profile: PetProfile): boolean {
  return Boolean(profile.description.trim() && profile.colors.trim() && profile.traits.trim() && profile.reportedAt)
}

export function isPetMatchWithCandidates(result: PetMatchResult | null): result is Exclude<PetMatchResult, Extract<PetMatchResult, { status: 'error' | 'no_match' }>> {
  return Boolean(result && result.status !== 'error' && result.status !== 'no_match' && result.matches.length > 0)
}
