export type SantaCruzAreaId =
  | 'sc-equipetrol'
  | 'sc-plan-3000'
  | 'sc-villa-primero-de-mayo'
  | 'sc-las-palmas'
  | 'sc-parque-urbano'

export type ApproximateLocation = {
  areaId: SantaCruzAreaId
  label: string
  note: string
}
