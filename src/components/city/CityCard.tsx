import Link from 'next/link'
import { CityDefinition } from '@/constants/cities/types'

interface CityCardProps {
  city: CityDefinition
  listingCount?: number
}

export function CityCard({ city, listingCount = 0 }: CityCardProps) {
  const isLive = city.status === 'live'

  return (
    <Link
      href={`/${city.slug}`}
      className="group relative flex flex-col overflow-hidden rounded-2xl border border-white/10 bg-white/[0.04] hover:bg-white/[0.08] transition-all duration-300 hover:-translate-y-1 hover:shadow-2xl hover:shadow-black/20 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-400 focus-visible:ring-offset-2 focus-visible:ring-offset-slate-950 min-h-[180px]"
    >
      <div
        className="absolute inset-0 opacity-20 group-hover:opacity-30 transition-opacity duration-300"
        style={{
          background: `radial-gradient(ellipse at top right, ${city.accent}, transparent 70%)`,
        }}
      />

      <div className="relative p-6 flex flex-col flex-1">
        <div className="flex items-start justify-between gap-3 mb-4">
          <div>
            <h3 className="text-xl font-bold text-white group-hover:text-white">{city.name}</h3>
            <p className="text-sm text-slate-400 mt-0.5">{city.state}</p>
          </div>
          {isLive ? (
            <span className="shrink-0 text-[10px] font-bold uppercase tracking-wider px-2.5 py-1 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
              {listingCount > 0 ? `${listingCount} listings` : 'Live'}
            </span>
          ) : (
            <span className="shrink-0 text-[10px] font-bold uppercase tracking-wider px-2.5 py-1 rounded-full bg-white/10 text-slate-400 border border-white/10">
              Coming soon
            </span>
          )}
        </div>

        <p className="text-sm text-slate-400 leading-relaxed flex-1">{city.tagline}</p>

        <div className="mt-5 flex items-center gap-2 text-sm font-semibold text-white/90 group-hover:text-white transition-colors">
          {isLive ? 'Explore rentals' : 'Get notified'}
          <svg className="w-4 h-4 group-hover:translate-x-1 transition-transform duration-200" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden>
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
          </svg>
        </div>
      </div>
    </Link>
  )
}