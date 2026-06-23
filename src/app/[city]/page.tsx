import Link from 'next/link'
import { notFound } from 'next/navigation'
import { SiteHeader } from '@/components/layout/SiteHeader'
import { ComingSoonPanel } from '@/components/city/ComingSoonPanel'
import { LocalityMapSection } from '@/components/map/LocalityMapSection'
import { getCity, isCityLive } from '@/constants/cities'
import { getActiveListingCountsByLocality } from '@/lib/locality-stats'
import { buildListingSearchHref } from '@/lib/search-url'

interface CityPageProps {
  params: { city: string }
}

export default async function CityHubPage({ params }: CityPageProps) {
  const citySlug = params.city.toLowerCase()
  const city = getCity(citySlug)

  if (!city) notFound()

  if (!isCityLive(citySlug)) {
    return (
      <div className="min-h-screen bg-slate-950 text-white">
        <div
          className="pointer-events-none fixed inset-0 opacity-30"
          style={{ background: `radial-gradient(ellipse at top, ${city.accent}44, transparent 60%)` }}
          aria-hidden
        />
        <SiteHeader variant="dark" activeCitySlug={citySlug} />
        <ComingSoonPanel city={city} />
      </div>
    )
  }

  const counts = await getActiveListingCountsByLocality(citySlug)
  const featured = city.localities.filter((l) => city.featuredLocalitySlugs.includes(l.slug))
  const mapPoints = city.localities.map((l) => ({
    slug: l.slug,
    name: l.name,
    zone: l.zone,
    lat: l.lat,
    lng: l.lng,
    count: counts[l.slug] ?? 0,
  }))
  const totalListings = Object.values(counts).reduce((a, b) => a + b, 0)

  return (
    <div className="min-h-screen bg-slate-950 text-white">
      <div
        className="pointer-events-none fixed inset-0 opacity-25"
        style={{ background: `radial-gradient(ellipse at top right, ${city.accent}55, transparent 55%)` }}
        aria-hidden
      />

      <SiteHeader variant="dark" activeCitySlug={citySlug} />

      <main className="relative max-w-6xl mx-auto px-4 pb-20">
        <section className="pt-12 pb-10">
          <p className="text-sm font-semibold uppercase tracking-widest mb-3" style={{ color: city.accent }}>
            {city.state} · {totalListings} active listings
          </p>
          <h1 className="text-4xl sm:text-5xl font-extrabold leading-tight max-w-3xl">
            Rental reels in {city.name}
          </h1>
          <p className="text-slate-400 text-lg mt-4 max-w-2xl">{city.tagline}</p>
        </section>

        <section className="bg-white/5 border border-white/10 rounded-3xl p-6 sm:p-8 mb-10">
          <h2 className="text-lg font-semibold mb-4">Popular localities</h2>
          <div className="flex flex-wrap gap-3">
            {featured.map((loc) => (
              <Link
                key={loc.slug}
                href={buildListingSearchHref({ city: citySlug, locality: loc.slug, searchParams: null })}
                className="px-4 py-2.5 rounded-full bg-white text-slate-900 text-sm font-semibold hover:bg-slate-100 transition-colors min-h-[44px] inline-flex items-center"
              >
                {loc.name}
                {(counts[loc.slug] ?? 0) > 0 && (
                  <span className="ml-2 text-slate-500 font-normal">{counts[loc.slug]}</span>
                )}
              </Link>
            ))}
            <Link
              href={`/${citySlug}/all`}
              className="px-4 py-2.5 rounded-full border border-white/20 text-sm font-semibold hover:bg-white/10 transition-colors min-h-[44px] inline-flex items-center"
            >
              All {city.name}
            </Link>
          </div>

          <div className="mt-6 flex flex-wrap gap-3">
            <Link
              href={buildListingSearchHref({
                city: citySlug,
                locality: 'vijay_nagar',
                searchParams: null,
                propertyType: '1BHK',
                minRent: 10000,
                maxRent: 15000,
              })}
              className="px-4 py-2 rounded-full text-sm font-semibold text-white transition-colors min-h-[44px] inline-flex items-center"
              style={{ backgroundColor: city.accent }}
            >
              1BHK · ₹10k–15k
            </Link>
            <Link
              href={buildListingSearchHref({
                city: citySlug,
                locality: 'scheme_54',
                searchParams: null,
                propertyType: '2BHK',
                minRent: 12000,
                maxRent: 20000,
              })}
              className="px-4 py-2 rounded-full text-sm font-semibold text-white/90 transition-colors min-h-[44px] inline-flex items-center"
              style={{ backgroundColor: `${city.accent}cc` }}
            >
              2BHK · ₹12k–20k
            </Link>
          </div>
        </section>

        <LocalityMapSection city={citySlug} points={mapPoints} />
      </main>
    </div>
  )
}