import { adminSupabase } from '@/lib/supabase/admin'
import Image from 'next/image'
import Link from 'next/link'
import { notFound } from 'next/navigation'
import { SiteHeader } from '@/components/layout/SiteHeader'
import { getCity } from '@/constants/cities'
import { formatListedAgo, formatVerifiedAgo } from '@/lib/utils/date'
import { whatsappLink } from '@/lib/utils/phone'

interface ListingPageProps {
  params: {
    slug: string
  }
}

export default async function ListingDetailPage({ params }: ListingPageProps) {
  const parts = params.slug.split('-')
  const idPrefix = parts[parts.length - 1]

  const { data: listing, error } = await adminSupabase
    .from('listings')
    .select('*, localities(name, city)')
    .filter('id', 'ilike', `${idPrefix}%`)
    .single()

  if (error || !listing) {
    return notFound()
  }

  const citySlug = (listing.localities as { city?: string } | null)?.city || 'indore'
  const city = getCity(citySlug)
  const title = listing.title || `${listing.property_type} in ${listing.localities?.name}`
  const phone = listing.broker_phone
  const waHref = whatsappLink(
    phone,
    `Hi, I found your ${listing.property_type} listing in ${listing.localities?.name} on BhumiSure (₹${listing.rent_monthly}/mo). Is it still available?`
  )

  return (
    <div className="min-h-screen bg-white">
      <SiteHeader variant="light" activeCitySlug={citySlug} />
      <div className="max-w-7xl mx-auto px-4 py-8">
        <nav className="text-xs text-slate-400 mb-4 flex items-center gap-2">
          <Link href="/" className="hover:text-slate-600">India</Link>
          <span>/</span>
          <Link href={`/${citySlug}`} className="hover:text-slate-600">{city?.name || citySlug}</Link>
          <span>/</span>
          <Link href={`/${citySlug}/${listing.locality_slug}`} className="hover:text-slate-600">
            {(listing.localities as { name?: string })?.name}
          </Link>
        </nav>
        <Link
          href={`/${citySlug}/${listing.locality_slug}`}
          className="inline-flex items-center text-sm text-slate-500 hover:text-slate-800 mb-8 transition-colors"
        >
          <svg className="w-4 h-4 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
          </svg>
          Back to search
        </Link>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          <div className="space-y-6">
            <div className="relative aspect-[9/16] max-h-[700px] w-full bg-slate-100 rounded-3xl overflow-hidden shadow-2xl">
              {listing.thumbnail_url ? (
                <Image
                  src={listing.thumbnail_url}
                  alt={title}
                  fill
                  className="object-cover blur-sm opacity-50"
                />
              ) : null}
              <div className="absolute inset-0 flex flex-col items-center justify-center text-center p-8 bg-black/40 backdrop-blur-md">
                <div className="w-20 h-20 bg-white/10 rounded-full flex items-center justify-center border border-white/20 mb-6">
                  <svg className="w-10 h-10 text-white fill-current" viewBox="0 0 24 24">
                    <path d="M8 5v14l11-7z" />
                  </svg>
                </div>
                <h3 className="text-xl font-bold text-white mb-4">View Original Reel</h3>
                <p className="text-white/80 text-sm mb-8 max-w-xs">
                  We verify listings from the source reel. Watch the full walkthrough before you visit.
                </p>
                {listing.reel_url && (
                  <a
                    href={listing.reel_url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="bg-white text-slate-900 px-8 py-3 rounded-full font-bold hover:bg-slate-100 transition-all transform hover:scale-105"
                  >
                    Watch Reel
                  </a>
                )}
              </div>
            </div>
          </div>

          <div className="py-4">
            <div className="flex items-center gap-2 mb-4 flex-wrap">
              <span className="px-3 py-1 bg-blue-50 text-blue-600 rounded-full text-xs font-bold uppercase tracking-wider">
                {listing.status}
              </span>
              <span className="text-sm text-slate-400">{formatListedAgo(listing.created_at)}</span>
              {formatVerifiedAgo(listing.last_verified_at) && (
                <span className="text-sm text-green-600">{formatVerifiedAgo(listing.last_verified_at)}</span>
              )}
            </div>

            <h1 className="text-4xl font-extrabold text-slate-900 mb-4">{title}</h1>

            <div className="text-3xl font-bold text-blue-600 mb-8">
              ₹{listing.rent_monthly.toLocaleString()}
              <span className="text-lg text-slate-400 font-normal ml-2">/ month</span>
            </div>

            <div className="grid grid-cols-2 gap-6 mb-12">
              <div className="p-4 bg-slate-50 rounded-2xl border border-slate-100">
                <p className="text-xs text-slate-400 uppercase font-bold tracking-wider mb-1">Furnishing</p>
                <p className="text-lg font-semibold text-slate-800">{listing.furnishing || 'Not specified'}</p>
              </div>
              <div className="p-4 bg-slate-50 rounded-2xl border border-slate-100">
                <p className="text-xs text-slate-400 uppercase font-bold tracking-wider mb-1">Available From</p>
                <p className="text-lg font-semibold text-slate-800">
                  {listing.available_from ? new Date(listing.available_from).toLocaleDateString() : 'Immediate'}
                </p>
              </div>
            </div>

            <section className="mb-12">
              <h2 className="text-xl font-bold text-slate-900 mb-4">About this listing</h2>
              <p className="text-slate-600 leading-relaxed">
                {`This ${listing.property_type} is in ${listing.localities?.name}. Preferred tenant: ${listing.preferred_tenant}. Contact the broker below to schedule a visit.`}
              </p>
            </section>

            <div className="p-6 bg-slate-900 rounded-3xl text-white shadow-xl">
              <div className="flex items-center gap-4 mb-6">
                <div className="w-12 h-12 bg-white/10 rounded-full flex items-center justify-center border border-white/20 text-xl font-bold">
                  {listing.broker_name?.[0] || 'B'}
                </div>
                <div>
                  <p className="text-white/60 text-xs font-bold uppercase tracking-widest">Broker</p>
                  <p className="text-lg font-bold">{listing.broker_name}</p>
                </div>
              </div>

              <div className="space-y-3">
                <a
                  href={`tel:${phone}`}
                  className="w-full flex items-center justify-center gap-3 py-4 bg-white text-slate-900 font-bold rounded-2xl hover:bg-slate-100 transition-all"
                >
                  Call Now
                </a>
                <a
                  href={waHref}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-full flex items-center justify-center gap-3 py-4 bg-green-500 text-white font-bold rounded-2xl hover:bg-green-600 transition-all"
                >
                  WhatsApp Message
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}