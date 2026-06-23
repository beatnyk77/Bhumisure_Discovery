'use client'

import 'leaflet/dist/leaflet.css'
import { useEffect, useMemo } from 'react'
import Link from 'next/link'
import { MapContainer, TileLayer, CircleMarker, Popup, useMap } from 'react-leaflet'
import type { LatLngExpression } from 'leaflet'
import { buildListingSearchHref } from '@/lib/search-url'

export interface LocalityMapPoint {
  slug: string
  name: string
  zone: string
  lat: number
  lng: number
  count: number
}

interface LocalityMapProps {
  city: string
  center: LatLngExpression
  points: LocalityMapPoint[]
}

function FitBounds({ points }: { points: LocalityMapPoint[] }) {
  const map = useMap()

  useEffect(() => {
    if (points.length === 0) return
    const bounds = points.map((p) => [p.lat, p.lng] as [number, number])
    map.fitBounds(bounds, { padding: [32, 32], maxZoom: 13 })
  }, [map, points])

  return null
}

function markerRadius(count: number): number {
  if (count >= 5) return 14
  if (count >= 2) return 11
  if (count >= 1) return 9
  return 7
}

export default function LocalityMap({ city, center, points }: LocalityMapProps) {
  const visible = useMemo(() => points.filter((p) => p.lat && p.lng), [points])

  return (
    <div className="relative rounded-2xl overflow-hidden border border-white/10 shadow-xl">
      <MapContainer
        center={center}
        zoom={12}
        scrollWheelZoom={false}
        className="h-[420px] w-full z-0"
        attributionControl
      >
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
        <FitBounds points={visible} />
        {visible.map((point) => (
          <CircleMarker
            key={point.slug}
            center={[point.lat, point.lng]}
            radius={markerRadius(point.count)}
            pathOptions={{
              color: point.count > 0 ? '#2563eb' : '#64748b',
              fillColor: point.count > 0 ? '#3b82f6' : '#94a3b8',
              fillOpacity: 0.85,
              weight: 2,
            }}
          >
            <Popup>
              <div className="text-sm min-w-[140px]">
                <p className="font-bold text-slate-900">{point.name}</p>
                <p className="text-slate-500 text-xs mb-2">{point.zone}</p>
                <p className="text-slate-700 mb-2">
                  {point.count > 0 ? `${point.count} active listing${point.count === 1 ? '' : 's'}` : 'No listings yet'}
                </p>
                <Link
                  href={buildListingSearchHref({ city, locality: point.slug, searchParams: null })}
                  className="text-blue-600 font-semibold hover:underline"
                >
                  Browse rentals →
                </Link>
              </div>
            </Popup>
          </CircleMarker>
        ))}
      </MapContainer>
      <div className="absolute bottom-3 left-3 z-[400] bg-slate-950/80 text-xs text-slate-300 px-3 py-1.5 rounded-full backdrop-blur">
        OpenStreetMap · tap a locality to search
      </div>
    </div>
  )
}