'use client'

import { useEffect, useState } from 'react'
import { useParams, useRouter, useSearchParams } from 'next/navigation'
import { PropertyType } from '@/types/listing'
import { LocalityEntry } from '@/constants/cities/types'
import { buildListingSearchHref, normalizeRentInput } from '@/lib/search-url'

interface SearchFiltersProps {
  currentFilters: {
    property_type?: PropertyType
    locality?: string[]
    min_rent?: number
    max_rent?: number
  }
  citySlug: string
  localityChips: LocalityEntry[]
}

export function SearchFilters({ currentFilters, citySlug, localityChips }: SearchFiltersProps) {
  const router = useRouter()
  const searchParams = useSearchParams()
  const params = useParams<{ city?: string; locality?: string }>()
  const propertyTypes: PropertyType[] = ['1BHK', '2BHK', '3BHK', 'PG', 'Studio', 'Room']
  const city = citySlug || (typeof params?.city === 'string' ? params.city : 'indore')
  const selectedLocality = typeof params?.locality === 'string' ? params.locality : 'all'
  const [draftMinRent, setDraftMinRent] = useState(currentFilters.min_rent?.toString() ?? '')
  const [draftMaxRent, setDraftMaxRent] = useState(currentFilters.max_rent?.toString() ?? '')

  useEffect(() => {
    setDraftMinRent(currentFilters.min_rent?.toString() ?? '')
    setDraftMaxRent(currentFilters.max_rent?.toString() ?? '')
  }, [currentFilters.min_rent, currentFilters.max_rent])

  const pushFilters = (next: {
    propertyType?: PropertyType | null
    localitySlug?: string
    minRent?: number | null
    maxRent?: number | null
  }) => {
    const nextLocality = next.localitySlug ?? selectedLocality
    const href = buildListingSearchHref({
      city,
      locality: nextLocality,
      searchParams,
      propertyType: next.propertyType === undefined ? currentFilters.property_type : next.propertyType,
      minRent: next.minRent === undefined ? currentFilters.min_rent : next.minRent,
      maxRent: next.maxRent === undefined ? currentFilters.max_rent : next.maxRent,
    })

    router.push(href)
  }

  const applyRentRange = () => {
    pushFilters({
      minRent: normalizeRentInput(draftMinRent) ?? null,
      maxRent: normalizeRentInput(draftMaxRent) ?? null,
    })
  }

  const clearFilters = () => {
    router.push(`/${city}/all`)
  }

  return (
    <div className="bg-white border-b border-slate-200 sticky top-16 z-20">
      <div className="max-w-7xl mx-auto px-4 py-3 flex flex-wrap items-center gap-2 sm:gap-3">
        <div className="flex gap-1.5 overflow-x-auto no-scrollbar pb-1 sm:pb-0 w-full sm:w-auto">
          {propertyTypes.map((type) => (
            <button
              key={type}
              type="button"
              onClick={() => pushFilters({ propertyType: currentFilters.property_type === type ? null : type })}
              className={`shrink-0 px-3.5 py-2 rounded-full border text-sm font-medium transition-colors duration-200 min-h-[40px] ${
                currentFilters.property_type === type
                  ? 'bg-slate-900 border-slate-900 text-white'
                  : 'bg-white border-slate-200 text-slate-600 hover:border-slate-400'
              }`}
            >
              {type}
            </button>
          ))}
        </div>

        <div className="hidden sm:block w-px h-8 bg-slate-200" />

        <div className="flex gap-1.5 overflow-x-auto no-scrollbar w-full sm:w-auto flex-1">
          <button
            type="button"
            onClick={() =>
              router.push(
                buildListingSearchHref({
                  city,
                  locality: 'all',
                  searchParams,
                  propertyType: currentFilters.property_type,
                  minRent: currentFilters.min_rent,
                  maxRent: currentFilters.max_rent,
                })
              )
            }
            className={`shrink-0 px-3.5 py-2 rounded-full border text-sm font-medium transition-colors duration-200 min-h-[40px] ${
              selectedLocality === 'all'
                ? 'bg-blue-600 border-blue-600 text-white'
                : 'bg-white border-slate-200 text-slate-600 hover:border-slate-400'
            }`}
          >
            All
          </button>
          {localityChips.map((loc) => (
            <button
              key={loc.slug}
              type="button"
              onClick={() => {
                const nextLocality = selectedLocality === loc.slug ? 'all' : loc.slug
                pushFilters({ localitySlug: nextLocality })
              }}
              className={`shrink-0 px-3.5 py-2 rounded-full border text-sm font-medium transition-colors duration-200 min-h-[40px] ${
                selectedLocality === loc.slug
                  ? 'bg-blue-600 border-blue-600 text-white'
                  : 'bg-white border-slate-200 text-slate-600 hover:border-slate-400'
              }`}
            >
              {loc.name}
            </button>
          ))}
        </div>

        <div className="flex items-center gap-2 w-full sm:w-auto pt-1 sm:pt-0">
          <input
            type="number"
            placeholder="Min ₹"
            aria-label="Minimum rent"
            value={draftMinRent}
            onChange={(e) => setDraftMinRent(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === 'Enter') {
                e.preventDefault()
                applyRentRange()
              }
            }}
            className="w-full sm:w-24 px-3 py-2 rounded-lg border border-slate-200 text-sm focus:ring-2 focus:ring-blue-500 outline-none min-h-[40px]"
          />
          <span className="text-slate-300 hidden sm:inline">–</span>
          <input
            type="number"
            placeholder="Max ₹"
            aria-label="Maximum rent"
            value={draftMaxRent}
            onChange={(e) => setDraftMaxRent(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === 'Enter') {
                e.preventDefault()
                applyRentRange()
              }
            }}
            className="w-full sm:w-24 px-3 py-2 rounded-lg border border-slate-200 text-sm focus:ring-2 focus:ring-blue-500 outline-none min-h-[40px]"
          />
          <button
            type="button"
            onClick={applyRentRange}
            className="px-4 py-2 rounded-lg bg-slate-900 text-white text-sm font-medium hover:bg-slate-800 transition-colors min-h-[40px] shrink-0"
          >
            Apply
          </button>
          <button
            type="button"
            onClick={clearFilters}
            className="px-3 py-2 rounded-lg text-sm font-medium text-slate-500 hover:text-slate-800 transition-colors min-h-[40px] shrink-0"
          >
            Clear
          </button>
        </div>
      </div>
    </div>
  )
}