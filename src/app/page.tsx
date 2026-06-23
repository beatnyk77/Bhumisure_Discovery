import { SiteHeader } from '@/components/layout/SiteHeader'
import { CityCard } from '@/components/city/CityCard'
import { CITY_REGISTRY, getLiveCities } from '@/constants/cities'
import { getActiveListingCountsByCity } from '@/lib/locality-stats'

export default async function Home() {
  const cityCounts = await getActiveListingCountsByCity()
  const liveCities = getLiveCities()

  return (
    <div className="min-h-screen bg-slate-950 text-white">
      <div className="pointer-events-none fixed inset-0 overflow-hidden" aria-hidden>
        <div className="absolute -top-40 -right-40 w-[500px] h-[500px] rounded-full bg-blue-600/20 blur-[120px]" />
        <div className="absolute top-1/2 -left-32 w-[400px] h-[400px] rounded-full bg-violet-600/15 blur-[100px]" />
      </div>

      <SiteHeader variant="dark" />

      <main className="relative max-w-6xl mx-auto px-4 pb-24">
        <section className="pt-16 sm:pt-24 pb-16 text-center sm:text-left">
          <p className="text-blue-400 text-sm font-semibold uppercase tracking-[0.2em] mb-5">
            India&apos;s reel-native rental search
          </p>
          <h1 className="text-4xl sm:text-6xl lg:text-7xl font-extrabold leading-[1.08] tracking-tight max-w-4xl text-balance">
            Find verified flats from real broker reels — not endless scrolling.
          </h1>
          <p className="text-slate-400 text-lg sm:text-xl mt-6 max-w-2xl leading-relaxed">
            BhumiSure turns Instagram & YouTube walkthroughs into structured listings.
            Filter by city, locality, budget & BHK. Call or WhatsApp brokers in one tap.
          </p>

          {liveCities.length > 0 && (
            <div className="mt-10 flex flex-wrap gap-3 justify-center sm:justify-start">
              {liveCities.map((city) => (
                <a
                  key={city.slug}
                  href={`/${city.slug}`}
                  className="inline-flex items-center gap-2 px-5 py-3 rounded-full bg-white text-slate-900 font-semibold hover:bg-slate-100 transition-all duration-200 hover:scale-[1.02] min-h-[48px]"
                >
                  <span className="w-2 h-2 rounded-full bg-emerald-500" />
                  Explore {city.name}
                  {(cityCounts[city.slug] ?? 0) > 0 && (
                    <span className="text-slate-500 font-normal">· {cityCounts[city.slug]} live</span>
                  )}
                </a>
              ))}
            </div>
          )}
        </section>

        <section className="mb-16">
          <div className="flex items-end justify-between mb-8">
            <div>
              <h2 className="text-2xl font-bold">Choose your city</h2>
              <p className="text-slate-400 text-sm mt-1">Live markets first — more metros rolling out nationwide</p>
            </div>
          </div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
            {CITY_REGISTRY.map((city) => (
              <CityCard key={city.slug} city={city} listingCount={cityCounts[city.slug] ?? 0} />
            ))}
          </div>
        </section>

        <section className="grid sm:grid-cols-3 gap-4 text-sm">
          {[
            { title: 'Video as proof', desc: 'Every listing links to a real walkthrough reel — not stock photos.' },
            { title: 'Fresh inventory', desc: 'Listings expire after 45 days. Stale flats get hidden automatically.' },
            { title: 'Direct contact', desc: 'Call or WhatsApp the broker instantly. No lead forms, no waiting.' },
          ].map((item) => (
            <div key={item.title} className="bg-white/[0.04] border border-white/10 rounded-2xl p-6 hover:bg-white/[0.06] transition-colors duration-200">
              <p className="font-bold text-white mb-2">{item.title}</p>
              <p className="text-slate-400 leading-relaxed">{item.desc}</p>
            </div>
          ))}
        </section>
      </main>
    </div>
  )
}