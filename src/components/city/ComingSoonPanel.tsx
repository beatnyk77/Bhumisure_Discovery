import Link from 'next/link'
import { getLiveCities } from '@/constants/cities'
import { CityDefinition } from '@/constants/cities/types'

interface ComingSoonPanelProps {
  city: CityDefinition
}

export function ComingSoonPanel({ city }: ComingSoonPanelProps) {
  const liveCities = getLiveCities()

  return (
    <div className="max-w-2xl mx-auto text-center py-16 px-4">
      <div
        className="w-20 h-20 mx-auto rounded-3xl flex items-center justify-center mb-8"
        style={{ background: `linear-gradient(135deg, ${city.accent}33, ${city.accentMuted}22)` }}
      >
        <svg className="w-10 h-10" style={{ color: city.accent }} fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden>
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
      </div>

      <p className="text-sm font-semibold uppercase tracking-widest mb-3" style={{ color: city.accent }}>
        Launching in {city.name}
      </p>
      <h1 className="text-3xl sm:text-4xl font-extrabold text-white mb-4">
        Rental reels for {city.name} — coming soon
      </h1>
      <p className="text-slate-400 text-lg leading-relaxed mb-10">
        We&apos;re indexing broker walkthrough reels and structuring them into searchable listings.
        {city.name} is next on our India rollout.
      </p>

      <div className="flex flex-col sm:flex-row gap-3 justify-center">
        {liveCities.length > 0 && (
          <Link
            href={`/${liveCities[0].slug}`}
            className="inline-flex items-center justify-center px-6 py-3.5 rounded-xl bg-white text-slate-900 font-semibold hover:bg-slate-100 transition-colors min-h-[48px]"
          >
            Browse {liveCities[0].name} now
          </Link>
        )}
        <Link
          href="/"
          className="inline-flex items-center justify-center px-6 py-3.5 rounded-xl border border-white/20 text-white font-semibold hover:bg-white/10 transition-colors min-h-[48px]"
        >
          All cities
        </Link>
      </div>
    </div>
  )
}