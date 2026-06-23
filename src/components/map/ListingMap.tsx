'use client'

import 'leaflet/dist/leaflet.css'
import { useEffect, useMemo } from 'react'
import Link from 'next/link'
import { MapContainer, TileLayer, CircleMarker, Popup, useMap } from 'react-leaflet'
import { getLocalityMapByCity } from '@/constants/cities'
import { ListingCardData } from '@/types/listing'

interface ListingMapProps {
  listings: ListingCardData[]
  citySlug?: string
  center?: [number, number]
}

function listingPosition(listing: ListingCardData, citySlug: string): [number, number] | null {
  const loc = getLocalityMapByCity(citySlug)[listing.locality_slug]
  if (!loc?.lat || !loc?.lng) return null

  const seed = listing.id.split('').reduce((acc, ch) => acc + ch.charCodeAt(0), 0)
  const jitterLat = ((seed % 11) - 5) * 0.0015
  const jitterLng = (((seed >> 3) % 11) - 5) * 0.0015
  return [loc.lat + jitterLat, loc.lng + jitterLng]
}

function listingSlug(listing: ListingCardData): string {
  return `${listing.locality_slug}-${listing.property_type.toLowerCase()}-${listing.id.slice(0, 8)}`
}

function FitToListings({ positions }: { positions: [number, number][] }) {
  const map = useMap()

  useEffect(() => {
    if (positions.length === 0) return
    if (positions.length === 1) {
      map.setView(positions[0], 14)
      return
    }
    map.fitBounds(positions, { padding: [40, 40], maxZoom: 14 })
  }, [map, positions])

  return null
}

export default function ListingMap({ listings, citySlug = 'indore', center = [22.7196, 75.8577] }: ListingMapProps) {
  const points = useMemo(
    () =>
      listings
        .map((listing) => {
          const pos = listingPosition(listing, citySlug)
          if (!pos) return null
          return { listing, pos }
        })
        .filter(Boolean) as { listing: ListingCardData; pos: [number, number] }[],
    [listings, citySlug]
  )

  if (points.length === 0) return null

  return (
    <div className="rounded-2xl overflow-hidden border border-slate-200 shadow-sm mb-8">
      <MapContainer center={center} zoom={12} scrollWheelZoom={false} className="h-[360px] w-full z-0">
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
        <FitToListings positions={points.map((p) => p.pos)} />
        {points.map(({ listing, pos }) => {
          const title = listing.title || `${listing.property_type} in ${listing.locality_name}`
          return (
            <CircleMarker
              key={listing.id}
              center={pos}
              radius={9}
              pathOptions={{ color: '#1d4ed8', fillColor: '#3b82f6', fillOpacity: 0.9, weight: 2 }}
            >
              <Popup>
                <div className="text-sm min-w-[160px]">
                  <p className="font-bold text-slate-900">{title}</p>
                  <p className="text-blue-700 font-semibold mt-1">₹{listing.rent_monthly.toLocaleString('en-IN')}/mo</p>
                  <Link href={`/listing/${listingSlug(listing)}`} className="text-blue-600 font-medium hover:underline mt-2 inline-block">
                    View listing →
                  </Link>
                </div>
              </Popup>
            </CircleMarker>
          )
        })}
      </MapContainer>
    </div>
  )
}