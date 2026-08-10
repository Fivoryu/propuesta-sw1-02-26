import type { ButtonHTMLAttributes, CSSProperties, PropsWithChildren } from 'react'
import type { LucideIcon } from 'lucide-react'
import { Camera, History, Home, Leaf, User, ChevronRight, Flame, Beef, Wheat, Droplets } from 'lucide-react'
import { Link, NavLink, useLocation } from 'react-router-dom'
import type { Meal } from '../domain/nutrition'

export function Logo({ light = false }: { light?: boolean }) { return <div className={`logo ${light ? 'logo--light' : ''}`}><span><Leaf size={19} /><i /></span><b>NutriVision</b></div> }
export function PrimaryButton({ children, icon: Icon, className = '', ...props }: ButtonHTMLAttributes<HTMLButtonElement> & { icon?: LucideIcon }) { return <button className={`primary-button ${className}`} {...props}>{children}{Icon && <Icon size={19} />}</button> }
export function BackButton() { return <Link className="back-button" to="/home" aria-label="Volver al inicio">←</Link> }
export function PageHeader({ title, subtitle, back = false }: { title: string; subtitle?: string; back?: boolean }) { return <header className="page-header">{back && <BackButton />}<div><h1>{title}</h1>{subtitle && <p>{subtitle}</p>}</div></header> }
export function MacroBar({ label, current, goal, type }: { label: string; current: number; goal: number; type: 'protein' | 'carbs' | 'fats' }) {
  const Icon = type === 'protein' ? Beef : type === 'carbs' ? Wheat : Droplets
  return <div className={`macro-bar macro-bar--${type}`}><div className="macro-bar__top"><span><Icon size={16} />{label}</span><b>{current} <small>/ {goal} g</small></b></div><div className="track"><i style={{ width: `${Math.min(100, current / goal * 100)}%` }} /></div></div>
}
export function CalorieRing({ current, goal }: { current: number; goal: number }) { const percent = Math.min(100, current / goal * 100); return <div className="calorie-ring" style={{ '--progress': `${percent * 3.6}deg` } as CSSProperties}><div><b>{current.toLocaleString('es-ES')}</b><span>kcal</span></div></div> }
export function MealCard({ meal }: { meal: Meal }) { return <Link className="meal-card" to={`/meal/${meal.id}`}><span className="meal-card__icon">{meal.name === 'Desayuno' ? '☀️' : meal.name === 'Almuerzo' ? '🥙' : '🍽️'}</span><span className="meal-card__body"><b>{meal.name}</b><small>{meal.time} · {meal.protein} g proteína</small></span><strong>{meal.calories}<small> kcal</small></strong><ChevronRight size={17} /></Link> }
export function BottomNavigation() { const location = useLocation(); if (!['/home', '/history', '/profile'].includes(location.pathname)) return null; return <nav className="bottom-nav" aria-label="Navegación principal"><NavLink to="/home"><Home size={20} />Inicio</NavLink><NavLink to="/history"><History size={20} />Historial</NavLink><Link className="scan-nav" to="/camera" aria-label="Analizar comida"><Camera size={23} /></Link><NavLink to="/profile"><User size={20} />Perfil</NavLink></nav> }
export function MobileLayout({ children }: PropsWithChildren) { return <main className="phone-shell"><div className="phone-content">{children}</div><BottomNavigation /></main> }
export function PlateVisual({ image, overlays = false }: { image?: string; overlays?: boolean }) { return <div className="plate-visual">{image ? <img src={image} alt="Comida seleccionada para analizar" /> : <div className="mock-plate"><span>🍚</span><span>🍗</span><span>🥗</span><span>🥚</span></div>}{overlays && <><b className="food-tag tag-rice">Arroz <small>39%</small></b><b className="food-tag tag-chicken">Pollo <small>29%</small></b><b className="food-tag tag-salad">Ensalada <small>22%</small></b><b className="food-tag tag-egg">Huevo <small>10%</small></b></>}</div> }
export function StatIcon({ icon: Icon, label, value }: { icon: LucideIcon; label: string; value: string }) { return <div className="stat-icon"><span><Icon size={17} /></span><small>{label}</small><b>{value}</b></div> }
export const macroIcons = { Flame, Beef, Wheat, Droplets }
