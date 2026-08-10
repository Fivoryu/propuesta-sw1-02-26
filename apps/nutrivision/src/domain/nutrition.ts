export type Macros = { calories: number; protein: number; carbs: number; fats: number }
export type Food = Macros & { id: number; name: string; icon: string; confidence: number; percentage: number; grams: number }
export type Meal = Macros & { id: string; name: string; time: string; foods: Food[]; image?: string }
export type Goal = 'Ganancia muscular' | 'Mantener peso' | 'Reducir peso' | 'Mejorar alimentación'
export type BiologicalSex = 'female' | 'male'
export type ActivityLevel = 'sedentary' | 'light' | 'moderate' | 'high'
export type UserProfile = { age: number; weight: number; height: number; biologicalSex: BiologicalSex; activityLevel: ActivityLevel }

export const initialTargets: Macros = { calories: 2500, protein: 165, carbs: 300, fats: 75 }
export const initialConsumption: Macros = { calories: 1640, protein: 118, carbs: 205, fats: 52 }
export const initialProfile: UserProfile = { age: 22, weight: 72, height: 175, biologicalSex: 'male', activityLevel: 'moderate' }
const activityMultipliers: Record<ActivityLevel, number> = { sedentary: 1.2, light: 1.375, moderate: 1.55, high: 1.725 }
const proteinPerKg: Record<Goal, number> = { 'Ganancia muscular': 1.8, 'Mantener peso': 1.6, 'Reducir peso': 1.8, 'Mejorar alimentación': 1.4 }
const calorieAdjustments: Record<Goal, number> = { 'Ganancia muscular': 300, 'Mantener peso': 0, 'Reducir peso': -400, 'Mejorar alimentación': 0 }

export function calculateNutritionTargets(profile: UserProfile, goal: Goal): Macros {
  const baseMetabolism = 10 * profile.weight + 6.25 * profile.height - 5 * profile.age + (profile.biologicalSex === 'male' ? 5 : -161)
  const calories = Math.max(1200, Math.round((baseMetabolism * activityMultipliers[profile.activityLevel] + calorieAdjustments[goal]) / 10) * 10)
  const protein = Math.round(profile.weight * proteinPerKg[goal])
  const fats = Math.round(profile.weight * 0.8)
  const carbs = Math.max(0, Math.round((calories - protein * 4 - fats * 9) / 4))
  return { calories, protein, carbs, fats }
}
export const detectedFoods: Food[] = [
  { id: 1, name: 'Arroz cocido', icon: '🍚', confidence: 96, percentage: 39, grams: 175, calories: 227, protein: 4, carbs: 49, fats: 1 },
  { id: 2, name: 'Pechuga de pollo', icon: '🍗', confidence: 92, percentage: 29, grams: 135, calories: 223, protein: 42, carbs: 0, fats: 5 },
  { id: 3, name: 'Ensalada', icon: '🥗', confidence: 88, percentage: 22, grams: 105, calories: 55, protein: 3, carbs: 10, fats: 1 },
  { id: 4, name: 'Huevo', icon: '🥚', confidence: 95, percentage: 10, grams: 55, calories: 105, protein: 3, carbs: 7, fats: 9 },
]
export const initialMeals: Meal[] = [
  { id: 'breakfast', name: 'Desayuno', time: '08:05', calories: 430, protein: 28, carbs: 46, fats: 15, foods: [] },
  { id: 'lunch', name: 'Almuerzo', time: '13:10', calories: 760, protein: 52, carbs: 91, fats: 21, foods: [] },
]
export const yesterdayMeals: Meal[] = [
  { id: 'yesterday-1', name: 'Desayuno saludable', time: '08:20', calories: 465, protein: 29, carbs: 52, fats: 14, foods: [] },
  { id: 'yesterday-2', name: 'Almuerzo', time: '13:25', calories: 710, protein: 48, carbs: 84, fats: 19, foods: [] },
  { id: 'yesterday-3', name: 'Cena', time: '20:10', calories: 540, protein: 39, carbs: 42, fats: 18, foods: [] },
]

export const addMacros = (first: Macros, second: Macros): Macros => ({
  calories: first.calories + second.calories, protein: first.protein + second.protein,
  carbs: first.carbs + second.carbs, fats: first.fats + second.fats,
})
