import type { MockSign, Vocabulary } from '../types'

const receptionSigns: MockSign[] = [
  { text: 'Necesito ayuda', confidence: 0.94, description: 'Mano abierta a la altura del pecho, movimiento hacia adelante.' },
  { text: '¿Dónde está recepción?', confidence: 0.88, description: 'Señalar hacia adelante con dedo índice, luego forma de "R".' },
  { text: 'Quiero hablar con alguien', confidence: 0.86, description: 'Movimiento de manos cerca de la boca, señalar a otra persona.' },
  { text: 'No comprendo', confidence: 0.84, description: 'Mano en la cabeza, gesto de negación.' },
  { text: 'Por favor', confidence: 0.90, description: 'Mano abierta, movimiento circular en el pecho.' },
  { text: 'Gracias', confidence: 0.91, description: 'Mano abierta desde la barbilla hacia adelante.' },
  { text: 'Repite', confidence: 0.87, description: 'Dedo índice girando en círculo pequeño.' },
  { text: 'Más despacio', confidence: 0.83, description: 'Dos manos palmas abajo, movimiento lento hacia abajo.' },
]

const greetingsSigns: MockSign[] = [
  { text: 'Hola', confidence: 0.96, description: 'Mano abierta a la altura de la sien, pequeño movimiento de saludo.' },
  { text: 'Buenos días', confidence: 0.93, description: 'Mano en el mentón, movimiento hacia arriba y adelante.' },
  { text: 'Buenas tardes', confidence: 0.91, description: 'Mano en el mentón, movimiento hacia adelante.' },
  { text: 'Buenas noches', confidence: 0.89, description: 'Mano en el mentón, movimiento hacia abajo.' },
  { text: 'Hasta luego', confidence: 0.92, description: 'Mano abierta, movimiento de despedida.' },
  { text: '¿Cómo estás?', confidence: 0.87, description: 'Mano en el pecho, movimiento circular hacia afuera.' },
  { text: 'Bien, gracias', confidence: 0.90, description: 'Pulgar arriba, luego mano desde la barbilla.' },
  { text: 'Mucho gusto', confidence: 0.86, description: 'Saludo con ambas manos.' },
]

const questionsSigns: MockSign[] = [
  { text: 'Sí', confidence: 0.97, description: 'Puño cerrado, movimiento de asentir hacia abajo.' },
  { text: 'No', confidence: 0.95, description: 'Dedo índice y medio juntos, movimiento de negación.' },
  { text: '¿Qué?', confidence: 0.88, description: 'Palmas abiertas hacia arriba, movimiento de interrogación.' },
  { text: '¿Cuándo?', confidence: 0.85, description: 'Dedo índice señalando la muñeca, luego palma arriba.' },
  { text: '¿Dónde?', confidence: 0.87, description: 'Dedo índice movimiento de lado a lado.' },
  { text: '¿Cómo?', confidence: 0.83, description: 'Puños cerrados tocándose, rotación hacia afuera.' },
  { text: '¿Cuánto cuesta?', confidence: 0.84, description: 'Mano en forma de "C", movimiento hacia adelante.' },
  { text: 'No sé', confidence: 0.86, description: 'Hombros levantados, palmas hacia arriba.' },
]

const numbersSigns: MockSign[] = [
  { text: 'Uno', confidence: 0.98, description: 'Dedo índice extendido.' },
  { text: 'Dos', confidence: 0.97, description: 'Índice y medio extendidos.' },
  { text: 'Tres', confidence: 0.96, description: 'Índice, medio y anular extendidos.' },
  { text: 'Cuatro', confidence: 0.95, description: 'Cuatro dedos extendidos.' },
  { text: 'Cinco', confidence: 0.97, description: 'Mano abierta completamente.' },
  { text: 'Diez', confidence: 0.94, description: 'Puño cerrado, movimiento de sacudida.' },
  { text: 'Cien', confidence: 0.91, description: 'Letra C con la mano.' },
  { text: 'Mil', confidence: 0.89, description: 'Mano abierta, dedo en palma opuesta.' },
]

const educationSigns: MockSign[] = [
  { text: 'Escuela', confidence: 0.92, description: 'Palmas abiertas aplaudiendo, movimiento lento.' },
  { text: 'Libro', confidence: 0.93, description: 'Palmas juntas abriéndose como un libro.' },
  { text: 'Aprender', confidence: 0.89, description: 'Mano en la cabeza, movimiento de sacar hacia fuera.' },
  { text: 'Entiendo', confidence: 0.91, description: 'Puño en la sien, dedo índice señalando hacia afuera.' },
  { text: 'Profesor', confidence: 0.88, description: 'Ambas manos con palmas hacia afuera, movimiento adelante.' },
  { text: 'Examen', confidence: 0.85, description: 'Manos formando "E", movimiento de escritura.' },
  { text: 'Matemáticas', confidence: 0.87, description: 'Letra M en ambas manos, cruzándose.' },
  { text: 'Pregunta', confidence: 0.86, description: 'Dedo índice haciendo signo de interrogación.' },
]

export const vocabularies: Vocabulary[] = [
  {
    id: 'reception',
    name: 'Recepción y orientación',
    signs: receptionSigns,
    totalSigns: 30,
  },
  {
    id: 'greetings',
    name: 'Saludos',
    signs: greetingsSigns,
    totalSigns: 12,
  },
  {
    id: 'questions',
    name: 'Preguntas básicas',
    signs: questionsSigns,
    totalSigns: 18,
  },
  {
    id: 'numbers',
    name: 'Números',
    signs: numbersSigns,
    totalSigns: 20,
  },
  {
    id: 'education',
    name: 'Educación',
    signs: educationSigns,
    totalSigns: 25,
  },
]

export const practiceSignList: MockSign[] = [
  { text: 'Hola', confidence: 0.96, description: 'Mano abierta a la altura de la sien, pequeño movimiento de saludo.' },
  { text: 'Gracias', confidence: 0.91, description: 'Mano abierta desde la barbilla hacia adelante.' },
  { text: 'Ayuda', confidence: 0.94, description: 'Mano cerrada sobre la palma abierta, movimiento hacia arriba.' },
  { text: 'Sí', confidence: 0.97, description: 'Puño cerrado, movimiento de asentir hacia abajo.' },
  { text: 'No', confidence: 0.95, description: 'Dedo índice y medio juntos, movimiento de negación.' },
  { text: 'Por favor', confidence: 0.90, description: 'Mano abierta, movimiento circular en el pecho.' },
  { text: 'Buenas tardes', confidence: 0.91, description: 'Mano en el mentón, movimiento hacia adelante.' },
  { text: 'Hasta luego', confidence: 0.92, description: 'Mano abierta, movimiento de despedida.' },
]

export const correctionOptions: string[] = [
  'Hola',
  'Necesito ayuda',
  'Gracias',
  'Por favor',
  'Buenas tardes',
  'Hasta luego',
  'No comprendo',
  'Sí',
  'No',
  'Otra',
]

export const uncertainAlternatives: Record<string, Array<{ text: string; confidence: number }>> = {
  default: [
    { text: 'Necesito ayuda', confidence: 0.72 },
    { text: 'Necesito información', confidence: 0.19 },
    { text: 'Por favor', confidence: 0.09 },
  ],
}
