export function bs(value: number) {
  return `Bs ${value.toLocaleString('es-BO', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`
}

export function percent(value: number) {
  const sign = value > 0 ? '+' : ''
  return `${sign}${value.toLocaleString('es-BO', { minimumFractionDigits: 1, maximumFractionDigits: 1 })} %`
}

export function distanceKm(value: number) {
  return `${value.toLocaleString('es-BO', { maximumFractionDigits: 1 })} km`
}
