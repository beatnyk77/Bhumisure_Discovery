'use client'

import dynamic from 'next/dynamic'
import { ListingCardData } from '@/types/listing'

const ListingMap = dynamic(() => import('./ListingMap'), {
  ssr: false,
  loading: () => (
    <div className="h-[360px] rounded-2xl bg-slate-100 border border-slate-200 animate-pulse mb-8" />
  ),
})

interface ListingMapSectionProps {
  listings: ListingCardData[]
  citySlug?: string
}

export function ListingMapSection({ listings, citySlug = 'indore' }: ListingMapSectionProps) {
  if (listings.length === 0) return null

  return (
    <section>
      <h2 className="text-lg font-semibold text-slate-900 mb-3">Map view</h2>
      <p className="text-sm text-slate-500 mb-3">OpenStreetMap · pins grouped by locality</p>
      <ListingMap listings={listings} citySlug={citySlug} />
    </section>
  )
}