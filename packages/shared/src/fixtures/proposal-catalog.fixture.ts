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
  {
    id: 'nutrivision',
    name: 'NutriVision',
    shortName: 'Nutri',
    category: 'Salud y alimentación',
    eyebrow: 'Comer mejor',
    summary:
      'Una guía móvil para fotografiar comidas, estimar macros y registrar el progreso sin presentar la simulación como consejo profesional.',
    problem:
      'Estimar porciones y macronutrientes a mano puede volver lento el seguimiento diario y dejar dudas sobre qué se registró antes de continuar.',
    beneficiaries: [
      'Personas que buscan mejorar su alimentación',
      'Personas que entrenan y siguen macronutrientes',
      'Equipos que diseñan experiencias digitales de bienestar',
    ],
    primaryFunction:
      'Recibir datos de perfil, calcular metas orientativas, analizar una comida de forma simulada, permitir correcciones y registrar el resultado en un seguimiento local.',
    quality:
      'Prioriza una experiencia móvil clara, estimaciones explícitas, corrección manual y un aviso visible de que los datos son demostrativos.',
    productivity:
      'Reduce el registro manual de alimentos dentro de la demostración, sin prometer ahorro de tiempo ni precisión nutricional medida.',
    innovation:
      'Combina análisis visual simulado, metas personalizadas y revisión humana antes de incorporar una comida al seguimiento.',
    monetization:
      'Hipótesis futura: suscripción de bienestar o alianzas con gimnasios y profesionales, sujeta a validación, seguridad y límites clínicos.',
    prototypeLimits:
      'Los alimentos y valores son fixtures locales; no hay modelo real, backend, cuenta, sincronización ni consejo médico o nutricional profesional.',
    futureDirection:
      'Una futura versión podría evaluar modelos nutricionales, historial sincronizado y recomendaciones responsables después de validar precisión, privacidad y seguridad.',
    technologies: ['React + TypeScript', 'Estado local de sesión', 'Mock determinista de análisis', 'Interfaz mobile-first'],
    flow: [
      'Completar el perfil y elegir un objetivo nutricional',
      'Fotografiar o elegir una comida desde la galería',
      'Revisar los alimentos detectados y corregir cantidades',
      'Consultar macros estimados y registrar la comida localmente',
    ],
    criteria: {
      calidad: { score: 4, note: 'Estimaciones claras y corrección manual' },
      productividad: { score: 4, note: 'Agiliza el registro de una comida' },
      innovacion: { score: 4, note: 'Análisis visual revisable' },
      monetizacion: { score: 3, note: 'Alianzas de bienestar por validar' },
      dificultadTecnica: { score: 4, note: 'Flujo móvil y datos nutricionales' },
      iaFutura: { score: 5, note: 'Visión nutricional supervisada' },
    },
        accent: 'amber',
        appUrlEnvVar: 'VITE_NUTRIVISION_APP_URL',
      },
      {
        id: 'signbridge-ai',
        name: 'SignBridge AI',
        shortName: 'SignBridge',
        category: 'Accesibilidad e inclusión',
        eyebrow: 'Lenguaje de señas',
        summary:
          'Un puente de comunicación que simula el reconocimiento de señas y las convierte en texto y voz para una revisión accesible.',
        problem:
          'Las personas sordas o con limitaciones auditivas pueden encontrar barreras al comunicarse con personas oyentes cuando no comparten una lengua de señas.',
        beneficiaries: [
          'Personas sordas o con limitaciones auditivas',
          'Personas oyentes que necesitan comunicarse de forma más accesible',
          'Instituciones educativas y espacios de atención al público',
        ],
        primaryFunction:
          'Usar la cámara, un vocabulario de señas y una clasificación simulada para mostrar una interpretación en texto, reproducirla en voz y permitir correcciones locales.',
        quality:
          'Prioriza controles claros, estados de confianza visibles, acceso a cámara explicado y una corrección manual antes de presentar una interpretación como útil.',
        productivity:
          'Agiliza intercambios breves dentro de vocabularios curados, sin prometer precisión constante ni ahorro de tiempo medido.',
        innovation:
          'Combina reconocimiento visual simulado, voz y corrección humana para que la asistencia sea revisable en lugar de presentarse como una traducción automática definitiva.',
        monetization:
          'Hipótesis futura: licencias institucionales para educación o atención al público, sujetas a validación con comunidades usuarias, intérpretes y criterios de accesibilidad.',
        prototypeLimits:
          'La clasificación, la confianza y las métricas son simuladas; el vocabulario es curado, el historial es local y no reemplaza a intérpretes profesionales ni ofrece traducción general.',
        futureDirection:
          'Una futura versión podría evaluar modelos de reconocimiento de lengua de señas, vocabularios regionales y herramientas de revisión con participación de la comunidad antes de operar en contextos reales.',
        technologies: ['React + TypeScript', 'Acceso a cámara del navegador', 'Text-to-Speech local', 'Mock determinista y estado local'],
        flow: [
          'Elegir un vocabulario y permitir el acceso a la cámara',
          'Realizar una seña o usar los controles de demostración',
          'Revisar el texto, la confianza y las alternativas simuladas',
          'Reproducir la voz, confirmar el resultado o registrar una corrección local',
        ],
        criteria: {
          calidad: { score: 4, note: 'Estados de confianza y corrección visibles' },
          productividad: { score: 3, note: 'Agiliza frases de vocabulario curado' },
          innovacion: { score: 5, note: 'Asistencia visual y voz revisable' },
          monetizacion: { score: 3, note: 'Licenciamiento institucional por validar' },
          dificultadTecnica: { score: 5, note: 'Cámara, reconocimiento y accesibilidad' },
          iaFutura: { score: 5, note: 'Reconocimiento contextual supervisado' },
        },
        accent: 'rose',
        appUrlEnvVar: 'VITE_SIGNBRIDGE_AI_APP_URL',
      },
  {
    id: 'canasta-ai',
    name: 'CanastaAI',
    shortName: 'CanastaAI',
    category: 'Ahorro colaborativo',
    eyebrow: 'Precios comunitarios',
    summary:
      'Un prototipo móvil para convertir tickets de compra en inteligencia colectiva de precios y recomendaciones de ahorro.',
    problem:
      'Las familias comparan precios con información incompleta, mensajes dispersos y visitas a tiendas que no siempre justifican el ahorro.',
    beneficiaries: [
      'Consumidores que planifican su canasta semanal',
      'Familias que buscan ahorrar en compras recurrentes',
      'Comunidades que aportan precios desde comprobantes',
    ],
    primaryFunction:
      'Simular el análisis de un ticket, confirmar precios estructurados y comparar una canasta semanal entre tiendas cercanas.',
    quality:
      'Prioriza una experiencia móvil clara, montos legibles, estados de confirmación y datos demostrativos coherentes.',
    productivity:
      'Reduce la comparación manual de precios al ordenar tienda, distancia, frescura y ahorro esperado en una recomendación.',
    innovation:
      'Usa el ticket cotidiano como mecanismo de aporte comunitario y convierte precios recientes en decisiones de compra explicables.',
    monetization:
      'Hipótesis futura: CanastaAI Plus con canastas ilimitadas, alertas avanzadas e historial completo por Bs 14,90 al mes.',
    prototypeLimits:
      'No realiza OCR real, pagos, GPS en vivo ni integraciones con supermercados; todo es mock determinista local.',
    futureDirection:
      'Una futura versión podría validar comprobantes reales, ubicación autorizada, reputación de aportes y alertas personalizadas.',
    technologies: ['React + TypeScript', 'Servicios mock deterministas', 'Diseño móvil-first', 'Datos locales de Santa Cruz'],
    flow: [
      'Escanear un ticket demostrativo',
      'Revisar productos normalizados y confirmar precios',
      'Comparar una canasta semanal por ahorro, distancia o equilibrio',
      'Explorar precios comunitarios y conocer CanastaAI Plus',
    ],
    criteria: {
      calidad: { score: 5, note: 'Flujo consumidor pulido y responsive' },
      productividad: { score: 5, note: 'Ahorro y decisión en una vista' },
      innovacion: { score: 4, note: 'Ticket como aporte colectivo' },
      monetizacion: { score: 4, note: 'Plus demostrativo claro' },
      dificultadTecnica: { score: 4, note: 'Estados, rutas y mocks coherentes' },
      iaFutura: { score: 4, note: 'Reconocimiento de tickets revisable' },
    },
    accent: 'teal',
    appUrlEnvVar: 'VITE_CANASTA_AI_APP_URL',
  },
  {
    id: 'reciscan',
    name: 'ReciScan',
    shortName: 'ReciScan',
    category: 'Economía circular',
    eyebrow: 'Red de recuperación',
    summary:
      'Un marketplace móvil que hace visibles materiales reciclables para conectarlos con recolectores cercanos.',
    problem:
      'Muchos materiales con valor económico terminan descartados mientras recicladores independientes gastan tiempo buscando oportunidades dispersas.',
    beneficiaries: [
      'Personas y negocios con material reciclable',
      'Recicladores independientes',
      'Compradores y pequeños centros de acopio',
    ],
    primaryFunction:
      'Simular clasificación de material, publicación segura, oportunidades cercanas, reservas y rutas agrupadas de recolección.',
    quality:
      'Distingue ubicación aproximada, cantidad estimada, peso confirmado y valor referencial sin exponer direcciones exactas.',
    productivity:
      'Agrupa oportunidades cercanas para reducir recorridos innecesarios y convertir publicaciones dispersas en rutas de trabajo.',
    innovation:
      'Combina escaneo simulado, marketplace local y ruta sugerida para conectar oferta invisible con recolectores activos.',
    monetization:
      'Hipótesis futura: ReciScan Pro para recolectores con alertas avanzadas, mayor radio y rutas sugeridas por Bs 19,90 al mes.',
    prototypeLimits:
      'No realiza visión por computadora real, chat en vivo, pagos, GPS, rutas reales ni backend de marketplace.',
    futureDirection:
      'Una versión real requeriría verificación de perfiles, reglas de seguridad, reputación, ubicación autorizada y datos de precios validados.',
    technologies: ['React + TypeScript', 'Servicios mock deterministas', 'Diseño móvil-first', 'Mapa estático local'],
    flow: [
      'Escanear material PET demostrativo',
      'Publicar con modalidad vender, gratis o negociar',
      'Ver recicladores interesados y oportunidades cercanas',
      'Reservar una publicación y revisar una ruta agrupada',
    ],
    criteria: {
      calidad: { score: 5, note: 'Dos perspectivas claras y seguras' },
      productividad: { score: 5, note: 'Ruta de trabajo desde oportunidades' },
      innovacion: { score: 4, note: 'Recuperación local visible' },
      monetizacion: { score: 4, note: 'Pro orientado a recolectores' },
      dificultadTecnica: { score: 4, note: 'Estados, filtros y rutas mock' },
      iaFutura: { score: 4, note: 'Clasificación visual revisable' },
    },
    accent: 'teal',
    appUrlEnvVar: 'VITE_RECISCAN_APP_URL',
  },
]