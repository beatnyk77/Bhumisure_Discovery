import Link from 'next/link'
import { CitySwitcher } from '@/components/city/CitySwitcher'
import { getCity } from '@/constants/cities'

interface SiteHeaderProps {
  variant?: 'dark' | 'light'
  activeCitySlug?: string
}

export function SiteHeader({ variant = 'dark', activeCitySlug }: SiteHeaderProps) {
  const city = activeCitySlug ? getCity(activeCitySlug) : undefined
  const isDark = variant === 'dark'

  return (
    <header
      className={`sticky top-0 z-50 backdrop-blur-xl border-b ${
        isDark
          ? 'bg-slate-950/80 border-white/10 text-white'
          : 'bg-white/90 border-slate-200 text-slate-900'
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 h-16 flex items-center justify-between gap-4">
        <div className="flex items-center gap-3 min-w-0">
          <Link
            href="/"
            className={`font-extrabold text-lg tracking-tight shrink-0 transition-opacity hover:opacity-80 ${
              isDark ? 'text-white' : 'text-slate-900'
            }`}
          >
            BhumiSure
          </Link>
          {city && (
            <>
              <span className={`hidden sm:inline text-sm ${isDark ? 'text-slate-600' : 'text-slate-300'}`}>/</span>
              <span className={`hidden sm:inline text-sm font-medium truncate ${isDark ? 'text-slate-300' : 'text-slate-600'}`}>
                {city.name}
              </span>
            </>
          )}
        </div>

        <div className="flex items-center gap-2 sm:gap-4">
          <CitySwitcher activeCitySlug={activeCitySlug} variant={variant} />
          <Link
            href="/admin/ingest"
            className={`text-sm font-medium px-3 py-2 rounded-lg transition-colors ${
              isDark
                ? 'text-slate-400 hover:text-white hover:bg-white/10'
                : 'text-slate-500 hover:text-slate-900 hover:bg-slate-100'
            }`}
          >
            Admin
          </Link>
        </div>
      </div>
    </header>
  )
}