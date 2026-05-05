'use client'

import { PropertyType, FurnishingType } from '@/types/listing'
import { INDORE_LOCALITIES } from '@/constants/localities'

interface SearchFiltersProps {
  currentFilters: {
    property_type?: PropertyType
    locality?: string[]
    min_rent?: number
    max_rent?: number
  }
  onFilterChange: (filters: any) => void
}

export function SearchFilters({ currentFilters, onFilterChange }: SearchFiltersProps) {
  const propertyTypes: PropertyType[] = ['1BHK', '2BHK', '3BHK', 'RK', 'Studio']

  return (
    <div className="bg-white border-b border-slate-200 sticky top-0 z-20 overflow-x-auto">
      <div className="max-w-7xl mx-auto px-4 py-4 flex items-center gap-4 whitespace-nowrap no-scrollbar">
        {/* Property Type Filter */}
        <div className="flex gap-2">
          {propertyTypes.map((type) => (
            <button
              key={type}
              onClick={() => onFilterChange({ property_type: currentFilters.property_type === type ? undefined : type })}
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

        {/* Locality Quick Filters (Top 5) */}
        <div className="flex gap-2">
          {INDORE_LOCALITIES.slice(0, 6).map((loc) => (
            <button
              key={loc.slug}
              onClick={() => {
                const isSelected = currentFilters.locality?.includes(loc.slug)
                const newLocalities = isSelected
                  ? currentFilters.locality?.filter(s => s !== loc.slug)
                  : [...(currentFilters.locality || []), loc.slug]
                onFilterChange({ locality: newLocalities })
              }}
              className={`px-4 py-1.5 rounded-full border text-sm font-medium transition-colors ${
                currentFilters.locality?.includes(loc.slug)
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
            value={currentFilters.min_rent || ''}
            onChange={(e) => onFilterChange({ min_rent: e.target.value ? parseInt(e.target.value) : undefined })}
            className="w-24 px-3 py-1.5 rounded-lg border border-slate-200 text-sm focus:ring-2 focus:ring-blue-500 outline-none"
          />
          <span className="text-slate-400">-</span>
          <input
            type="number"
            placeholder="Max ₹"
            value={currentFilters.max_rent || ''}
            onChange={(e) => onFilterChange({ max_rent: e.target.value ? parseInt(e.target.value) : undefined })}
            className="w-24 px-3 py-1.5 rounded-lg border border-slate-200 text-sm focus:ring-2 focus:ring-blue-500 outline-none"
          />
        </div>
      </div>
    </div>
  )
}
