'use client'

import { useState, useRef, useEffect } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { CITY_REGISTRY, getCity } from '@/constants/cities'

interface CitySwitcherProps {
  activeCitySlug?: string
  variant?: 'dark' | 'light'
}

export function CitySwitcher({ activeCitySlug, variant = 'dark' }: CitySwitcherProps) {
  const [open, setOpen] = useState(false)
  const ref = useRef<HTMLDivElement>(null)
  const router = useRouter()
  const active = activeCitySlug ? getCity(activeCitySlug) : undefined
  const isDark = variant === 'dark'

  useEffect(() => {
    function onClickOutside(e: MouseEvent) {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false)
    }
    document.addEventListener('mousedown', onClickOutside)
    return () => document.removeEventListener('mousedown', onClickOutside)
  }, [])

  return (
    <div className="relative" ref={ref}>
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        aria-expanded={open}
        aria-haspopup="listbox"
        aria-label="Switch city"
        className={`flex items-center gap-2 px-3 py-2 rounded-xl text-sm font-semibold transition-all duration-200 min-h-[44px] ${
          isDark
            ? 'bg-white/10 border border-white/15 hover:bg-white/15 text-white'
            : 'bg-slate-100 border border-slate-200 hover:bg-slate-200/80 text-slate-800'
        }`}
      >
        <svg className="w-4 h-4 opacity-70" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden>
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
        </svg>
        <span className="max-w-[120px] truncate">{active?.name ?? 'All India'}</span>
        <svg className={`w-4 h-4 transition-transform ${open ? 'rotate-180' : ''}`} fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden>
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
        </svg>
      </button>

      {open && (
        <div
          role="listbox"
          className="absolute right-0 mt-2 w-72 max-h-[min(70vh,400px)] overflow-y-auto rounded-2xl shadow-2xl border bg-white border-slate-200 py-2 z-[100]"
        >
          <div className="px-4 py-2 border-b border-slate-100">
            <p className="text-xs font-semibold uppercase tracking-wider text-slate-400">Choose city</p>
          </div>
          <Link
            href="/"
            onClick={() => setOpen(false)}
            className="flex items-center gap-3 px-4 py-3 hover:bg-slate-50 transition-colors"
          >
            <span className="w-2 h-2 rounded-full bg-slate-300" />
            <span className="text-sm font-medium text-slate-800">All India</span>
          </Link>
          {CITY_REGISTRY.map((city) => (
            <button
              key={city.slug}
              type="button"
              role="option"
              aria-selected={city.slug === activeCitySlug}
              onClick={() => {
                setOpen(false)
                router.push(`/${city.slug}`)
              }}
              className={`w-full flex items-center gap-3 px-4 py-3 text-left hover:bg-slate-50 transition-colors ${
                city.slug === activeCitySlug ? 'bg-blue-50' : ''
              }`}
            >
              <span
                className="w-2 h-2 rounded-full shrink-0"
                style={{ backgroundColor: city.accent }}
              />
              <div className="min-w-0 flex-1">
                <p className="text-sm font-semibold text-slate-900">{city.name}</p>
                <p className="text-xs text-slate-500 truncate">{city.state}</p>
              </div>
              {city.status === 'live' ? (
                <span className="text-[10px] font-bold uppercase tracking-wide px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-700">
                  Live
                </span>
              ) : (
                <span className="text-[10px] font-bold uppercase tracking-wide px-2 py-0.5 rounded-full bg-slate-100 text-slate-500">
                  Soon
                </span>
              )}
            </button>
          ))}
        </div>
      )}
    </div>
  )
}