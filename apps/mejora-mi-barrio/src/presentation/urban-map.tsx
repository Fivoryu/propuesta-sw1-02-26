import { useState } from 'react'
import { Link } from 'react-router-dom'
import { MapContainer, Marker, Popup, TileLayer } from 'react-leaflet'
import L, { type LatLngExpression } from 'leaflet'
import { urbanCategoryLabels, urbanStatusLabels, type UrbanReport, type UrbanReportStatus } from '../domain/urban-report'

const markerColors: Record<UrbanReportStatus, string> = {
  pending: '#C9801E',
  in_review: '#0E7C66',
  in_progress: '#2767A6',
  resolved: '#4B7F52',
}

const markerIcons = Object.fromEntries(
  Object.entries(markerColors).map(([status, color]) => [
    status,
    L.divIcon({
      className: 'urban-marker-icon',
      html: `<span class="urban-marker-pin" style="--marker-color:${color}"><span></span></span>`,
      iconSize: [34, 42],
      iconAnchor: [17, 38],
      popupAnchor: [0, -34],
    }),
  ]),
) as Record<UrbanReportStatus, L.DivIcon>

export default function UrbanMap({ reports }: { reports: readonly UrbanReport[] }) {
  const [tileError, setTileError] = useState(false)
  const center: LatLngExpression = [-17.7827, -63.1821]

  return (
    <div className="relative overflow-hidden rounded-[1.7rem] bg-[#dcece5] ring-1 ring-inset ring-primary/10">
      <MapContainer center={center} zoom={12} scrollWheelZoom={false} className="urban-map h-[min(62vh,560px)] min-h-[360px] w-full" aria-label="Mapa de reportes urbanos simulados">
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          eventHandlers={{ tileerror: () => setTileError(true) }}
        />
        {reports.map((report) => (
          <Marker key={report.id} position={[report.lat, report.lng] as LatLngExpression} icon={markerIcons[report.status]}>
            <Popup>
              <div className="space-y-1 text-sm">
                <strong>{urbanCategoryLabels[report.category]}</strong>
                <span className="block">{report.approximateLocation.label}</span>
                <span className="block text-slate-600">{urbanStatusLabels[report.status]}</span>
                <Link className="font-semibold text-[#0e7c66] underline" to={`/reportes/${report.id}`}>Ver detalle</Link>
              </div>
            </Popup>
          </Marker>
        ))}
      </MapContainer>
      <div className="pointer-events-none absolute inset-x-4 top-4 z-[500] flex items-start justify-between gap-3">
        <span className="rounded-full bg-[#17332d]/90 px-3 py-2 text-xs font-semibold text-white shadow-quiet">Datos locales simulados</span>
        {tileError ? <span className="rounded-full bg-white/95 px-3 py-2 text-xs font-semibold text-[#17332d] ring-1 ring-inset ring-primary/20">Mapa sin conexión</span> : null}
      </div>
      <div className="pointer-events-none absolute inset-x-4 bottom-4 z-[500] flex justify-end">
        <span className="max-w-[17rem] rounded-2xl bg-white/95 px-3 py-2 text-xs leading-5 text-[#17332d] ring-1 ring-inset ring-primary/15">Las ubicaciones son aproximadas. La lista de reportes funciona aunque no carguen los mosaicos.</span>
      </div>
    </div>
  )
}
