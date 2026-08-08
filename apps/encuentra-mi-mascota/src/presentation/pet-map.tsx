import { useState } from 'react'
import { MapContainer, Marker, Popup, TileLayer } from 'react-leaflet'
import L, { type LatLngExpression } from 'leaflet'
import { Link } from 'react-router-dom'
import { MapPinned } from 'lucide-react'
import type { PetCandidate } from '../domain/pet'

const markerIcons = {
  lost: L.divIcon({
    className: 'pet-marker-icon',
    html: '<span class="pet-marker-pin pet-marker-pin--lost"><span></span></span>',
    iconSize: [34, 42],
    iconAnchor: [17, 38],
    popupAnchor: [0, -34],
  }),
  found: L.divIcon({
    className: 'pet-marker-icon',
    html: '<span class="pet-marker-pin pet-marker-pin--found"><span></span></span>',
    iconSize: [34, 42],
    iconAnchor: [17, 38],
    popupAnchor: [0, -34],
  }),
}

export default function PetMap({ reports }: { reports: readonly PetCandidate[] }) {
  const [tileError, setTileError] = useState(false)
  const center: LatLngExpression = [-17.7827, -63.1821]

  return (
    <div className="overflow-hidden rounded-[1.7rem] bg-[#dcece5] ring-1 ring-inset ring-primary/10">
      <div className="relative">
        <MapContainer center={center} zoom={12} scrollWheelZoom={false} className="pet-map h-[min(62vh,560px)] min-h-[340px] w-full" aria-label="Mapa de avisos ficticios de mascotas">
          <TileLayer
            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> colaboradores'
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            eventHandlers={{ tileerror: () => setTileError(true) }}
          />
          {reports.map((report) => (
            <Marker key={report.id} position={[report.lat, report.lng] as LatLngExpression} icon={markerIcons[report.caseType]}>
              <Popup>
                <div className="space-y-2 text-sm">
                  <strong>{report.name}</strong>
                  <span className="block">{report.approximateLocation.label}</span>
                  <span className="block text-slate-600">{report.caseType === 'lost' ? 'Mascota perdida' : 'Mascota encontrada'}</span>
                  <Link className="font-semibold text-[#0e7c66] underline" to={`/coincidencias/${report.id}`}>Comparar detalles</Link>
                </div>
              </Popup>
            </Marker>
          ))}
        </MapContainer>
        <div className="pointer-events-none absolute inset-x-4 top-4 z-[400] flex items-start justify-between gap-3">
          <span className="rounded-full bg-[#17332d]/90 px-3 py-2 text-xs font-semibold text-white shadow-quiet">Datos locales simulados</span>
          {tileError ? <span className="rounded-full bg-white/95 px-3 py-2 text-xs font-semibold text-[#17332d] ring-1 ring-inset ring-primary/20">Mapa sin conexión</span> : null}
        </div>
        <div className="pointer-events-none absolute inset-x-4 bottom-4 z-[400] flex justify-end">
          <span className="max-w-[18rem] rounded-2xl bg-white/95 px-3 py-2 text-xs leading-5 text-[#17332d] ring-1 ring-inset ring-primary/15">Las zonas son aproximadas. La lista funciona aunque no carguen los mosaicos.</span>
        </div>
      </div>
      {tileError ? (
        <div className="border-t border-primary/10 bg-surface p-4 sm:p-5" role="status">
          <p className="flex items-center gap-2 text-sm font-semibold text-ink"><MapPinned aria-hidden="true" className="h-4 w-4 text-primary" strokeWidth={1.6} />Vista textual disponible</p>
          <ul className="mt-3 grid gap-2 text-sm text-muted sm:grid-cols-2">
            {reports.map((report) => <li className="rounded-xl bg-paper px-3 py-2" key={report.id}>{report.name} · {report.approximateLocation.label}</li>)}
          </ul>
        </div>
      ) : null}
    </div>
  )
}
