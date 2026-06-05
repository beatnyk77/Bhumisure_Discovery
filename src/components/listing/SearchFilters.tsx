'use client'

import { useEffect, useMemo, useState } from 'react'
import { useParams, useRouter, useSearchParams } from 'next/navigation'
import { PropertyType } from '@/types/listing'
import { INDORE_LOCALITIES } from '@/constants/localities'
import { buildListingSearchHref, normalizeRentInput } from '@/lib/search-url'

interface SearchFiltersProps {
  currentFilters: {
    property_type?: PropertyType
    locality?: string[]
    min_rent?: number
    max_rent?: number
  }
}

export function SearchFilters({ currentFilters }: SearchFiltersProps) {
  const router = useRouter()
  const searchParams = useSearchParams()
  const params = useParams<{ city?: string; locality?: string }>()
  const propertyTypes: PropertyType[] = ['1BHK', '2BHK', '3BHK', 'PG', 'Studio', 'Room']
  const city = typeof params?.city === 'string' ? params.city : 'indore'
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

  const localityChips = useMemo(() => INDORE_LOCALITIES.slice(0, 6), [])

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
    <div className="bg-white border-b border-slate-200 sticky top-0 z-20 overflow-x-auto">
      <div className="max-w-7xl mx-auto px-4 py-4 flex items-center gap-4 whitespace-nowrap no-scrollbar">
        {/* Property Type Filter */}
        <div className="flex gap-2">
          {propertyTypes.map((type) => (
            <button
              key={type}
              onClick={() => pushFilters({ propertyType: currentFilters.property_type === type ? null : type })}
              className={`px-4 py-1.5 rounded-full border text-sm font-medium transition-colors ${
                currentFilters.property_type === type
                  ? 'bg-slate-900 border-slate-900 text-white'
                  : 'bg-white border-slate-200 text-slate-600 hover:border-slate-400'
              }`}
            >
              {type}
            </button>
          ))}
        </div>

        <div className="w-px h-6 bg-slate-200 mx-2" />

        {/* Locality Quick Filters */}
        <div className="flex gap-2">
          <button
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
            className={`px-4 py-1.5 rounded-full border text-sm font-medium transition-colors ${
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
              onClick={() => {
                const nextLocality = selectedLocality === loc.slug ? 'all' : loc.slug
                pushFilters({ localitySlug: nextLocality })
              }}
              className={`px-4 py-1.5 rounded-full border text-sm font-medium transition-colors ${
                selectedLocality === loc.slug
                  ? 'bg-blue-600 border-blue-600 text-white'
                  : 'bg-white border-slate-200 text-slate-600 hover:border-slate-400'
              }`}
            >
              {loc.name}
            </button>
          ))}
        </div>

        <div className="w-px h-6 bg-slate-200 mx-2" />

        {/* Rent Range (Simple) */}
        <div className="flex items-center gap-2">
          <input
            type="number"
            placeholder="Min ₹"
            value={draftMinRent}
            onChange={(e) => setDraftMinRent(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === 'Enter') {
                e.preventDefault()
                applyRentRange()
              }
            }}
            className="w-24 px-3 py-1.5 rounded-lg border border-slate-200 text-sm focus:ring-2 focus:ring-blue-500 outline-none"
          />
          <span className="text-slate-400">-</span>
          <input
            type="number"
            placeholder="Max ₹"
            value={draftMaxRent}
            onChange={(e) => setDraftMaxRent(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === 'Enter') {
                e.preventDefault()
                applyRentRange()
              }
            }}
            className="w-24 px-3 py-1.5 rounded-lg border border-slate-200 text-sm focus:ring-2 focus:ring-blue-500 outline-none"
          />
          <button
            onClick={applyRentRange}
            className="px-3 py-1.5 rounded-lg bg-slate-900 text-white text-sm font-medium hover:bg-slate-800 transition-colors"
          >
            Apply
          </button>
          <button
            onClick={clearFilters}
            className="px-3 py-1.5 rounded-lg border border-slate-200 text-sm font-medium text-slate-600 hover:border-slate-400 transition-colors"
          >
            Clear
          </button>
        </div>
      </div>
    </div>
  )
}
