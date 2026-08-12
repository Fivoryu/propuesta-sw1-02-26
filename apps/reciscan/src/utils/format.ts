export function bs(value: number) {
  return `Bs ${value.toLocaleString('es-BO', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`
}

export function kg(value: number) {
  return `${value.toLocaleString('es-BO', { maximumFractionDigits: 1 })} kg`
}
