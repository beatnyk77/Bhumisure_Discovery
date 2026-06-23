import { Suspense } from 'react'
import Link from 'next/link'
import { notFound, redirect } from 'next/navigation'
import { searchListings } from '@/lib/search'
import { SearchFilters } from '@/components/listing/SearchFilters'
import { SearchPagination } from '@/components/listing/SearchPagination'
import { ListingCard } from '@/components/listing/ListingCard'
import { ListingMapSection } from '@/components/map/ListingMapSection'
import { SiteHeader } from '@/components/layout/SiteHeader'
import { getCity, getLocalityInCity, isCityLive } from '@/constants/cities'
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
    page?: string
  }
}

export default async function SearchResultsPage({ params, searchParams }: SearchPageProps) {
  const citySlug = params.city.toLowerCase()
  const localitySlug = params.locality.toLowerCase()
  const city = getCity(citySlug)

  if (!city) notFound()
  if (!isCityLive(citySlug)) redirect(`/${citySlug}`)

  const locality = localitySlug === 'all' ? null : getLocalityInCity(citySlug, localitySlug)
  if (localitySlug !== 'all' && !locality) notFound()

  const page = Math.max(parseInt(searchParams.page || '1', 10) || 1, 1)

  const filters = {
    city: citySlug,
    locality: localitySlug === 'all' ? undefined : [localitySlug],
    property_type: searchParams.bhk as PropertyType,
    min_rent: searchParams.min ? parseInt(searchParams.min) : undefined,
    max_rent: searchParams.max ? parseInt(searchParams.max) : undefined,
    page,
  }

  const { listings, total, per_page: perPage } = await searchListings(filters)
  const localityChips = city.localities.slice(0, 8)

  return (
    <div className="min-h-screen bg-slate-50">
      <SiteHeader variant="light" activeCitySlug={citySlug} />

      <div className="bg-white px-4 pt-6 pb-4 border-b border-slate-100">
        <div className="max-w-7xl mx-auto">
          <nav className="text-xs text-slate-400 mb-2 flex items-center gap-2">
            <Link href="/" className="hover:text-slate-600 transition-colors">India</Link>
            <span>/</span>
            <Link href={`/${citySlug}`} className="hover:text-slate-600 transition-colors">{city.name}</Link>
            <span>/</span>
            <span className="text-slate-600 font-medium">{locality?.name || `All ${city.name}`}</span>
          </nav>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 mb-1">
            Rentals in {locality?.name || city.name}
          </h1>
          <p className="text-sm text-slate-500">
            {total === 0
              ? 'No listings match your filters'
              : `Showing ${listings.length} of ${total} verified reels`}
          </p>
        </div>
      </div>

      <Suspense fallback={<div className="h-16 bg-white border-b border-slate-200" />}>
        <SearchFilters
          currentFilters={filters}
          citySlug={citySlug}
          localityChips={localityChips}
        />
      </Suspense>

      <main className="max-w-7xl mx-auto px-4 py-8">
        <ListingMapSection listings={listings} citySlug={citySlug} />

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {listings.map((listing) => (
            <ListingCard key={listing.id} listing={listing} />
          ))}
        </div>

        {listings.length === 0 && (
          <div className="flex flex-col items-center justify-center py-20 text-center">
            <div className="w-16 h-16 bg-slate-100 rounded-2xl flex items-center justify-center mb-4">
              <svg className="w-8 h-8 text-slate-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden>
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
              </svg>
            </div>
            <h3 className="text-lg font-semibold text-slate-900">No properties found</h3>
            <p className="text-slate-500 max-w-sm mx-auto mt-2 leading-relaxed">
              Try widening your budget, switching locality, or browse all of {city.name}.
            </p>
            <Link
              href={`/${citySlug}/all`}
              className="mt-6 px-5 py-2.5 rounded-xl bg-slate-900 text-white text-sm font-semibold hover:bg-slate-800 transition-colors"
            >
              View all {city.name}
            </Link>
          </div>
        )}

        <SearchPagination
          city={citySlug}
          locality={localitySlug}
          searchParams={new URLSearchParams(
            Object.entries(searchParams).flatMap(([k, v]) => (v ? [[k, v]] : []))
          )}
          page={page}
          perPage={perPage}
          total={total}
        />
      </main>
    </div>
  )
}