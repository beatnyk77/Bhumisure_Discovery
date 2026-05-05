import { searchListings } from '@/lib/search'
import { SearchFilters } from '@/components/listing/SearchFilters'
import { ListingCard } from '@/components/listing/ListingCard'
import { LOCALITY_BY_SLUG } from '@/constants/localities'
import { PropertyType } from '@/types/listing'

interface SearchPageProps {
  params: {
    city: string
    locality: string
  }
  searchParams: {
    bhk?: string
    min?: string
    max?: string
  }
}

export default async function SearchResultsPage({ params, searchParams }: SearchPageProps) {
  const city = params.city.toLowerCase()
  const localitySlug = params.locality.toLowerCase()
  const locality = LOCALITY_BY_SLUG[localitySlug]

  // Convert search params to domain types
  const filters = {
    locality: localitySlug === 'all' ? undefined : [localitySlug],
    property_type: searchParams.bhk as PropertyType,
    min_rent: searchParams.min ? parseInt(searchParams.min) : undefined,
    max_rent: searchParams.max ? parseInt(searchParams.max) : undefined,
  }

  const { listings, total } = await searchListings(filters)

  return (
    <div className="min-h-screen bg-slate-50">
      {/* Header Info */}
      <div className="bg-white px-4 pt-8 pb-4">
        <div className="max-w-7xl mx-auto">
          <nav className="text-xs text-slate-400 mb-2 uppercase tracking-widest font-semibold">
            {city} / {locality?.name || 'All Indore'}
          </nav>
          <h1 className="text-3xl font-extrabold text-slate-900 mb-2">
            Properties for Rent in {locality?.name || 'Indore'}
          </h1>
          <p className="text-sm text-slate-500">
            Showing {listings.length} of {total} verified reels
          </p>
        </div>
      </div>

      {/* Filters Sticky Bar */}
      <SearchFilters 
        currentFilters={filters} 
        onFilterChange={() => {}} // In a real app, this would push to router
      />

      {/* Results Grid */}
      <main className="max-w-7xl mx-auto px-4 py-8">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {listings.map((listing) => (
            <ListingCard key={listing.id} listing={listing} />
          ))}
        </div>

        {listings.length === 0 && (
          <div className="flex flex-col items-center justify-center py-20 text-center">
            <div className="w-16 h-16 bg-slate-100 rounded-full flex items-center justify-center mb-4">
              <svg className="w-8 h-8 text-slate-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
              </svg>
            </div>
            <h3 className="text-lg font-semibold text-slate-900">No properties found</h3>
            <p className="text-slate-500 max-w-xs mx-auto mt-2">
              Try adjusting your filters or search in a different locality.
            </p>
          </div>
        )}
      </main>
    </div>
  )
}
