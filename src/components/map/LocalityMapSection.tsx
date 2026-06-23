'use client'

import dynamic from 'next/dynamic'
import Link from 'next/link'
import type { LocalityMapPoint } from './LocalityMap'

const LocalityMap = dynamic(() => import('./LocalityMap'), {
  ssr: false,
  loading: () => (
    <div className="h-[420px] rounded-2xl bg-white/5 border border-white/10 animate-pulse flex items-center justify-center text-slate-400 text-sm">
      Loading map…
    </div>
  ),
})

interface LocalityMapSectionProps {
  city: string
  points: LocalityMapPoint[]
}

export function LocalityMapSection({ city, points }: LocalityMapSectionProps) {
  return (
    <section className="mb-10">
      <div className="flex items-end justify-between gap-4 mb-4">
        <div>
          <h2 className="text-lg font-semibold">Explore on map</h2>
          <p className="text-slate-400 text-sm mt-1">
            Open-source OpenStreetMap — scales to any city in India or globally.
          </p>
        </div>
        <Link
          href={`/${city}/all`}
          className="text-sm text-blue-400 hover:text-blue-300 font-medium shrink-0"
        >
          List view →
        </Link>
      </div>
      <LocalityMap city={city} center={[22.7196, 75.8577]} points={points} />
    </section>
  )
}