import { createContext, useContext, useState, type PropsWithChildren } from 'react'
import { addMacros, calculateNutritionTargets, detectedFoods, initialConsumption, initialMeals, initialProfile, initialTargets, type Food, type Goal, type Macros, type Meal, type UserProfile } from '../domain/nutrition'
import type { FoodAnalysis } from '../services/mock/analyze-food'

type AppState = {
  userGoal: Goal; profile: UserProfile; targets: Macros; consumption: Macros; meals: Meal[]; selectedImage?: string; analysis: FoodAnalysis;
  setUserGoal: (goal: Goal) => void; setProfile: (profile: UserProfile) => void; applyPersonalization: (profile: UserProfile, goal: Goal) => void; setTargets: (targets: Macros) => void; setSelectedImage: (image?: string) => void;
  updateFood: (food: Food) => void; setAnalysis: (analysis: FoodAnalysis) => void; registerMeal: () => void;
}
const defaultAnalysis: FoodAnalysis = { calories: 610, protein: 52, carbs: 66, fats: 16, foods: structuredClone(detectedFoods), disclaimer: 'simulated' }
const Context = createContext<AppState | null>(null)

export function AppProvider({ children }: PropsWithChildren) {
  const [userGoal, setUserGoal] = useState<Goal>('Ganancia muscular')
  const [profile, setProfile] = useState(initialProfile)
  const [targets, setTargets] = useState(initialTargets)
  const [consumption, setConsumption] = useState(initialConsumption)
  const [meals, setMeals] = useState(initialMeals)
  const [selectedImage, setSelectedImage] = useState<string>()
  const [analysis, setAnalysis] = useState(defaultAnalysis)
  const updateFood = (food: Food) => setAnalysis((current) => ({ ...current, foods: current.foods.map((item) => item.id === food.id ? food : item) }))
  const applyPersonalization = (nextProfile: UserProfile, goal: Goal) => { setProfile(nextProfile); setUserGoal(goal); setTargets(calculateNutritionTargets(nextProfile, goal)) }
  const registerMeal = () => {
    const meal: Meal = { id: `analysis-${Date.now()}`, name: 'Comida analizada', time: '20:15', ...analysis, foods: analysis.foods, image: selectedImage }
    setMeals((current) => current.some((item) => item.name === meal.name) ? current : [...current, meal])
    setConsumption((current) => current.calories === 1640 ? addMacros(current, analysis) : current)
  }
  return <Context.Provider value={{ userGoal, profile, targets, consumption, meals, selectedImage, analysis, setUserGoal, setProfile, applyPersonalization, setTargets, setSelectedImage, updateFood, setAnalysis, registerMeal }}>{children}</Context.Provider>
}
export function useApp() { const value = useContext(Context); if (!value) throw new Error('useApp must be used within AppProvider'); return value }
