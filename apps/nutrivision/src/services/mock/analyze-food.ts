import { detectedFoods, type Food, type Macros } from '../../domain/nutrition'

export type FoodAnalysis = Macros & { foods: Food[]; disclaimer: 'simulated' }

const wait = (milliseconds: number, signal?: AbortSignal) => new Promise<void>((resolve, reject) => {
  const timeout = window.setTimeout(resolve, milliseconds)
  signal?.addEventListener('abort', () => { window.clearTimeout(timeout); reject(new DOMException('Aborted', 'AbortError')) }, { once: true })
})

export async function analyzeFoodMock(_image?: string, options?: { latencyMs?: number; signal?: AbortSignal }): Promise<FoodAnalysis> {
  await wait(options?.latencyMs ?? 2800, options?.signal)
  return { calories: 610, protein: 52, carbs: 66, fats: 16, foods: structuredClone(detectedFoods), disclaimer: 'simulated' }
}
