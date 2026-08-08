import type { Proposal } from '../contracts/proposals'

export const proposalCatalog: readonly Proposal[] = [
  {
    id: 'mejora-mi-barrio',
    name: 'Mejora Mi Barrio',
    shortName: 'Barrio',
    category: 'Civismo digital',
    eyebrow: 'Cuidado colectivo',
    summary:
      'Una entrada guiada para ordenar problemas urbanos sin prometer una respuesta municipal.',
    problem:
      'Los avisos sobre baches, residuos o luminarias suelen dispersarse en chats y llegan sin categoría, contexto o una ubicación aproximada compartida.',
    beneficiaries: [
      'Vecinos y juntas barriales',
      'Equipos de mantenimiento',
      'Organizaciones comunitarias',
    ],
    primaryFunction:
      'Recibir una descripción, sugerir una clasificación simulada y dejar que la persona revise antes de confirmar un resumen local.',
    quality:
      'Prioriza una captura breve, lenguaje claro y revisión explícita de la incertidumbre antes de cualquier confirmación.',
    productivity:
      'Estructura la información inicial para reducir repeticiones en una futura bandeja de atención, sin medir tiempos reales.',
    innovation:
      'Combina asistencia de clasificación con corrección humana visible, en lugar de esconder una decisión automática.',
    monetization:
      'Hipótesis futura: piloto institucional por distrito, sujeto a acuerdos, gobernanza y validación de valor.',
    prototypeLimits:
      'Los reportes son locales y ficticios; no se envían a una municipalidad ni se verifican incidentes reales.',
    futureDirection:
      'Una futura versión podría conectar redes autorizadas, moderación y datos de servicio después de definir políticas.',
    technologies: ['React + TypeScript', 'Formularios accesibles', 'Mock runtime determinista', 'Diseño responsive'],
    flow: [
      'Elegir un área aproximada de Santa Cruz',
      'Describir el problema y revisar la categoría sugerida',
      'Ver confianza, posibles duplicados y correcciones',
      'Confirmar un resumen local de demostración',
    ],
    criteria: {
      calidad: { score: 4, note: 'Captura guiada y corrección visible' },
      productividad: { score: 4, note: 'Estructura la entrada inicial' },
      innovacion: { score: 4, note: 'Automatización revisable' },
      monetizacion: { score: 3, note: 'Piloto institucional por validar' },
      dificultadTecnica: { score: 3, note: 'Flujo web y datos locales' },
      iaFutura: { score: 4, note: 'Clasificación con controles humanos' },
    },
    accent: 'teal',
    appUrlEnvVar: 'VITE_MEJORA_MI_BARRIO_APP_URL',
  },
  {
    id: 'cuaderno-matematico',
    name: 'Cuaderno Matemático',
    shortName: 'Cuaderno',
    category: 'Aprendizaje guiado',
    eyebrow: 'Práctica con contexto',
    summary:
      'Un espacio para transcribir, revisar y guardar ejercicios sin confundir reconocimiento con resolución.',
    problem:
      'Una persona puede perder tiempo transcribiendo una ecuación o no saber si su expresión fue interpretada como esperaba antes de practicar.',
    beneficiaries: [
      'Estudiantes de secundaria y universidad',
      'Tutores y docentes',
      'Equipos que diseñan apoyos educativos',
    ],
    primaryFunction:
      'Aceptar una ecuación escrita o de ejemplo, simular su reconocimiento, mostrar una forma normalizada y permitir corrección.',
    quality:
      'Separa reconocimiento, normalización y práctica para que cada paso tenga una expectativa comprensible.',
    productivity:
      'Reduce la transcripción repetitiva dentro de la demostración, sin prometer calificación automática ni ahorro medido.',
    innovation:
      'Convierte la confianza y la corrección de la persona en parte del aprendizaje, no en una respuesta opaca.',
    monetization:
      'Hipótesis futura: plan estudiantil o licencia institucional, con precio y acceso por validar con usuarios.',
    prototypeLimits:
      'Usa escenarios locales curados; no realiza OCR general, no resuelve cualquier ecuación y no verifica un tutor real.',
    futureDirection:
      'Podría crecer con alineación curricular y seguimiento si antes se valida la utilidad pedagógica y la accesibilidad.',
    technologies: ['React + TypeScript', 'Entrada tipada', 'Resultados con confianza', 'Estado local temporal'],
    flow: [
      'Escribir una ecuación o elegir un ejemplo',
      'Revisar el texto reconocido y su forma normalizada',
      'Corregir tokens ambiguos cuando sea necesario',
      'Guardar el ejercicio solo en el cuaderno de demostración',
    ],
    criteria: {
      calidad: { score: 4, note: 'Distingue cada resultado' },
      productividad: { score: 3, note: 'Acelera una tarea puntual' },
      innovacion: { score: 4, note: 'Corrección como aprendizaje' },
      monetizacion: { score: 3, note: 'Modelo educativo por validar' },
      dificultadTecnica: { score: 4, note: 'Notación y validación' },
      iaFutura: { score: 5, note: 'Reconocimiento contextual' },
    },
    accent: 'cobalt',
    appUrlEnvVar: 'VITE_CUADERNO_MATEMATICO_APP_URL',
  },
  {
    id: 'encuentra-mi-mascota',
    name: 'Encuentra Mi Mascota',
    shortName: 'Mascota',
    category: 'Red de cuidado',
    eyebrow: 'Coincidencias con cuidado',
    summary:
      'Una ficha estructurada para comparar avisos ficticios y explicar por qué una coincidencia merece revisión.',
    problem:
      'Los avisos de mascotas perdidas o encontradas se reparten entre publicaciones y chats, con descripciones difíciles de comparar.',
    beneficiaries: [
      'Personas que buscan una mascota',
      'Rescatistas y refugios',
      'Veterinarias y redes barriales',
    ],
    primaryFunction:
      'Crear un perfil local, ordenar rasgos visibles y mostrar candidatos simulados con razones de coincidencia.',
    quality:
      'Evita afirmar una identificación y prioriza motivos legibles, zonas aproximadas y un siguiente paso seguro.',
    productivity:
      'Reduce la revisión manual de fichas ficticias, sin medir un aumento real de reencuentros.',
    innovation:
      'Presenta el emparejamiento asistido como una lista revisable y no como una decisión basada solo en una foto.',
    monetization:
      'Hipótesis futura: patrocinios o alianzas veterinarias, siempre sujetos a ética, moderación y validación.',
    prototypeLimits:
      'No hay mapa vivo, contacto, notificaciones, verificación de identidad ni garantía de reencuentro.',
    futureDirection:
      'Una red real necesitaría consentimiento, prevención de fraude, contacto seguro y reglas de retención de imágenes.',
    technologies: ['React + TypeScript', 'Fichas de atributos', 'Ranking explicable', 'Estados de no coincidencia'],
    flow: [
      'Elegir mascota perdida o encontrada',
      'Describir especie, rasgos y zona aproximada',
      'Revisar candidatos y las razones de cada coincidencia',
      'Solicitar un siguiente paso solo como acción simulada',
    ],
    criteria: {
      calidad: { score: 4, note: 'Razones y límites explícitos' },
      productividad: { score: 4, note: 'Ordena la comparación' },
      innovacion: { score: 4, note: 'Revisión humana del ranking' },
      monetizacion: { score: 3, note: 'Alianzas por validar' },
      dificultadTecnica: { score: 4, note: 'Atributos y estados' },
      iaFutura: { score: 5, note: 'Asistencia visual supervisada' },
    },
    accent: 'violet',
    appUrlEnvVar: 'VITE_ENCUENTRA_MI_MASCOTA_APP_URL',
  },
]
