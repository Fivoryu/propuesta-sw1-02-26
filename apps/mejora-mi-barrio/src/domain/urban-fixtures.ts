import { santaCruzLocations } from '@propuestas/shared'
import type { UrbanCategory, UrbanEvidence, UrbanReport } from './urban-report'

function svgDataUrl(svg: string): string {
  return `data:image/svg+xml;charset=UTF-8,${encodeURIComponent(svg)}`
}

const potholeImage = svgDataUrl(`
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 960 640">
    <defs><linearGradient id="road" x1="0" x2="1" y1="0" y2="1"><stop stop-color="#345a67"/><stop offset="1" stop-color="#173b47"/></linearGradient></defs>
    <rect width="960" height="640" fill="#d7eadf"/><rect y="350" width="960" height="290" fill="url(#road)"/>
    <path d="M0 420h960M0 530h960" stroke="#6c9195" stroke-width="8" opacity=".55"/>
    <ellipse cx="565" cy="488" rx="180" ry="72" fill="#102b34"/><ellipse cx="565" cy="470" rx="128" ry="34" fill="#091d25" opacity=".72"/>
    <path d="M130 0v340M260 0v340M390 0v340M520 0v340M650 0v340M780 0v340" stroke="#9ccbb9" stroke-width="8" opacity=".45"/>
    <circle cx="565" cy="140" r="54" fill="#e76f51"/><path d="M565 103v74M528 140h74" stroke="#fff" stroke-width="12" stroke-linecap="round"/>
    <text x="48" y="90" fill="#17332d" font-size="34" font-family="sans-serif" font-weight="700">Bache en vía</text>
  </svg>`)

const wasteImage = svgDataUrl(`
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 960 640">
    <rect width="960" height="640" fill="#dbece3"/><rect y="425" width="960" height="215" fill="#9bb9a8"/>
    <path d="M0 460c140-50 250 30 380-12s250-24 580 0" fill="none" stroke="#638c7b" stroke-width="16" opacity=".55"/>
    <rect x="245" y="250" width="164" height="240" rx="24" fill="#2e6b65"/><rect x="212" y="225" width="230" height="40" rx="20" fill="#173f45"/>
    <rect x="520" y="280" width="154" height="210" rx="24" fill="#e76f51"/><rect x="495" y="255" width="204" height="38" rx="19" fill="#b54f3c"/>
    <path d="M293 300h68M568 330h58" stroke="#fff" stroke-width="15" stroke-linecap="round" opacity=".8"/>
    <circle cx="770" cy="120" r="58" fill="#0e7c66"/><path d="M742 120h56M770 92v56" stroke="#fff" stroke-width="12" stroke-linecap="round"/>
    <text x="48" y="92" fill="#17332d" font-size="34" font-family="sans-serif" font-weight="700">Residuos acumulados</text>
  </svg>`)

const lightingImage = svgDataUrl(`
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 960 640">
    <defs><linearGradient id="sky" y1="0" y2="1"><stop stop-color="#152f4d"/><stop offset="1" stop-color="#6d8ba0"/></linearGradient></defs>
    <rect width="960" height="640" fill="url(#sky)"/><rect y="455" width="960" height="185" fill="#1c3b4a"/>
    <path d="M0 560c160-80 260 15 420-34s290-42 540 18" fill="none" stroke="#6e99a0" stroke-width="10"/>
    <path d="M420 480V128M420 132c0-54 50-82 101-53l73 42" fill="none" stroke="#d6e8e2" stroke-width="18" stroke-linecap="round"/>
    <path d="M582 121c40 10 58 36 64 68" fill="none" stroke="#f5d898" stroke-width="32" stroke-linecap="round" opacity=".88"/>
    <circle cx="420" cy="110" r="48" fill="#e76f51"/><path d="M420 80v60M390 110h60" stroke="#fff" stroke-width="11" stroke-linecap="round"/>
    <text x="48" y="88" fill="#f4fbf8" font-size="34" font-family="sans-serif" font-weight="700">Alumbrado público</text>
  </svg>`)

const drainageImage = svgDataUrl(`
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 960 640">
    <rect width="960" height="640" fill="#dceaf1"/><rect y="360" width="960" height="280" fill="#658e9d"/>
    <path d="M0 436c170-74 290 42 470-30s302-13 490 22v212H0Z" fill="#7eb6c0"/>
    <path d="M100 150h760M180 230h600" stroke="#91b9c1" stroke-width="10" opacity=".62"/>
    <path d="M500 280c-22 52-64 77-64 121a64 64 0 0 0 128 0c0-44-42-69-64-121Z" fill="#0e7c66"/>
    <circle cx="500" cy="180" r="48" fill="#e76f51"/><path d="M500 154v52M474 180h52" stroke="#fff" stroke-width="11" stroke-linecap="round"/>
    <text x="48" y="88" fill="#17332d" font-size="34" font-family="sans-serif" font-weight="700">Drenaje o inundación</text>
  </svg>`)

export const urbanImageFixtures: readonly UrbanEvidence[] = [
  {
    kind: 'fixture',
    src: potholeImage,
    label: 'Bache en vía',
    alt: 'Ilustración local de un bache señalizado en una calle',
    fixtureImageId: 'urban-pothole-01',
  },
  {
    kind: 'fixture',
    src: wasteImage,
    label: 'Residuos acumulados',
    alt: 'Ilustración local de contenedores con residuos acumulados',
    fixtureImageId: 'urban-waste-01',
  },
  {
    kind: 'fixture',
    src: lightingImage,
    label: 'Alumbrado público',
    alt: 'Ilustración local de un poste de alumbrado público',
    fixtureImageId: 'urban-lighting-01',
  },
  {
    kind: 'fixture',
    src: drainageImage,
    label: 'Drenaje o inundación',
    alt: 'Ilustración local de agua acumulada y un punto de drenaje',
    fixtureImageId: 'urban-drainage-01',
  },
]

export const defaultUrbanEvidence = urbanImageFixtures[0]

export const urbanReports: readonly UrbanReport[] = [
  {
    id: 'fixture-report-plan-3000',
    reference: 'MMB-DEMO-001',
    category: 'pothole',
    severity: 'high',
    status: 'in_review',
    description: 'Bache amplio en una vía de conexión del barrio.',
    approximateLocation: santaCruzLocations[1],
    lat: -17.7974,
    lng: -63.1535,
    reportedAt: '12 de julio de 2026',
    evidence: defaultUrbanEvidence,
    simulated: true,
  },
  {
    id: 'fixture-report-villa-primero',
    reference: 'MMB-DEMO-002',
    category: 'waste',
    severity: 'medium',
    status: 'in_progress',
    description: 'Residuos acumulados alrededor de un contenedor.',
    approximateLocation: santaCruzLocations[2],
    lat: -17.7861,
    lng: -63.1205,
    reportedAt: '5 de julio de 2026',
    evidence: urbanImageFixtures[1],
    simulated: true,
  },
  {
    id: 'fixture-report-equipetrol',
    reference: 'MMB-DEMO-003',
    category: 'lighting',
    severity: 'low',
    status: 'resolved',
    description: 'Luminaria apagada en un tramo peatonal.',
    approximateLocation: santaCruzLocations[0],
    lat: -17.7618,
    lng: -63.1907,
    reportedAt: '28 de junio de 2026',
    evidence: urbanImageFixtures[2],
    simulated: true,
  },
  {
    id: 'fixture-report-parque-urbano',
    reference: 'MMB-DEMO-004',
    category: 'drainage',
    severity: 'high',
    status: 'pending',
    description: 'Agua acumulada después de una lluvia en un paso bajo.',
    approximateLocation: santaCruzLocations[4],
    lat: -17.7877,
    lng: -63.1819,
    reportedAt: '19 de julio de 2026',
    evidence: urbanImageFixtures[3],
    simulated: true,
  },
]

export function findUrbanReport(reportId: string): UrbanReport | undefined {
  return urbanReports.find((report) => report.id === reportId)
}

export function getFixtureEvidence(fixtureImageId?: string): UrbanEvidence {
  return urbanImageFixtures.find((fixture) => fixture.fixtureImageId === fixtureImageId) ?? defaultUrbanEvidence
}

export function categoryForFixture(fixtureImageId?: string): UrbanCategory {
  if (fixtureImageId === 'urban-waste-01') return 'waste'
  if (fixtureImageId === 'urban-lighting-01') return 'lighting'
  if (fixtureImageId === 'urban-drainage-01') return 'drainage'
  return 'pothole'
}
