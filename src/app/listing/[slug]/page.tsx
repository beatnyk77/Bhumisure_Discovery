import { adminSupabase } from '@/lib/supabase/admin'
import Image from 'next/image'
import Link from 'next/link'
import { notFound } from 'next/navigation'

interface ListingPageProps {
  params: {
    slug: string
  }
}

export default async function ListingDetailPage({ params }: ListingPageProps) {
  // Slug format: [locality]-[bhk]-[id_prefix]
  const parts = params.slug.split('-')
  const idPrefix = parts[parts.length - 1]

  // Find the listing by ID prefix (using ILIKE for robustness or just querying the full ID if we had it)
  // For the MVP, we assume the slug is generated consistently
  const { data: listing, error } = await adminSupabase
    .from('listings')
    .select('*, localities(name), brokers(name, phone, whatsapp_number)')
    .filter('id', 'ilike', `${idPrefix}%`)
    .single()

  if (error || !listing) {
    return notFound()
  }

  return (
    <div className="min-h-screen bg-white">
      <div className="max-w-7xl mx-auto px-4 py-8">
        <Link href="/indore/all" className="inline-flex items-center text-sm text-slate-500 hover:text-slate-800 mb-8 transition-colors">
          <svg className="w-4 h-4 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
          </svg>
          Back to Search
        </Link>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          {/* Left: Video Placeholder & Gallery */}
          <div className="space-y-6">
            <div className="relative aspect-[9/16] max-h-[700px] w-full bg-slate-100 rounded-3xl overflow-hidden shadow-2xl">
              {listing.thumbnail_url ? (
                <Image 
                  src={listing.thumbnail_url} 
                  alt={listing.title} 
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
                  We verify listings directly from the source. Click below to view the full walkthrough video on Instagram.
                </p>
                <a 
                  href={listing.reel_url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="bg-white text-slate-900 px-8 py-3 rounded-full font-bold hover:bg-slate-100 transition-all transform hover:scale-105"
                >
                  Watch Reel
                </a>
              </div>
            </div>
          </div>

          {/* Right: Info Area */}
          <div className="py-4">
            <div className="flex items-center gap-2 mb-4">
              <span className="px-3 py-1 bg-blue-50 text-blue-600 rounded-full text-xs font-bold uppercase tracking-wider">
                {listing.status}
              </span>
              <span className="text-sm text-slate-400">Listed on {new Date(listing.created_at).toLocaleDateString()}</span>
            </div>

            <h1 className="text-4xl font-extrabold text-slate-900 mb-4">
              {listing.property_type} in {listing.localities?.name}
            </h1>

            <div className="text-3xl font-bold text-blue-600 mb-8">
              ₹{listing.rent_monthly.toLocaleString()}<span className="text-lg text-slate-400 font-normal ml-2">/ month</span>
            </div>

            <div className="grid grid-cols-2 gap-6 mb-12">
              <div className="p-4 bg-slate-50 rounded-2xl border border-slate-100">
                <p className="text-xs text-slate-400 uppercase font-bold tracking-wider mb-1">Furnishing</p>
                <p className="text-lg font-semibold text-slate-800">{listing.furnishing}</p>
              </div>
              <div className="p-4 bg-slate-50 rounded-2xl border border-slate-100">
                <p className="text-xs text-slate-400 uppercase font-bold tracking-wider mb-1">Available From</p>
                <p className="text-lg font-semibold text-slate-800">
                  {listing.available_from ? new Date(listing.available_from).toLocaleDateString() : 'Immediate'}
                </p>
              </div>
            </div>

            <section className="mb-12">
              <h2 className="text-xl font-bold text-slate-900 mb-4">Description</h2>
              <p className="text-slate-600 leading-relaxed">
                {listing.description || `This beautiful ${listing.property_type} is located in the prime area of ${listing.localities?.name}. Featuring modern amenities and excellent connectivity.`}
              </p>
            </section>

            {/* Broker / Contact Section */}
            <div className="p-6 bg-slate-900 rounded-3xl text-white shadow-xl">
              <div className="flex items-center gap-4 mb-6">
                <div className="w-12 h-12 bg-white/10 rounded-full flex items-center justify-center border border-white/20 text-xl font-bold">
                  {listing.brokers?.name?.[0] || 'B'}
                </div>
                <div>
                  <p className="text-white/60 text-xs font-bold uppercase tracking-widest">Verified Broker</p>
                  <p className="text-lg font-bold">{listing.brokers?.name || 'BhumiSure Partner'}</p>
                </div>
              </div>

              <div className="space-y-3">
                <a 
                  href={`tel:${listing.brokers?.phone}`}
                  className="w-full flex items-center justify-center gap-3 py-4 bg-white text-slate-900 font-bold rounded-2xl hover:bg-slate-100 transition-all"
                >
                  <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                  </svg>
                  Call Now
                </a>
                <a 
                  href={`https://wa.me/${listing.brokers?.whatsapp_number?.replace(/\D/g, '')}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-full flex items-center justify-center gap-3 py-4 bg-green-500 text-white font-bold rounded-2xl hover:bg-green-600 transition-all"
                >
                  <svg className="w-5 h-5 fill-current" viewBox="0 0 24 24">
                    <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.414 0 .004 5.412 0 12.048c0 2.12.554 4.189 1.605 6.04L0 24l6.117-1.605a11.792 11.792 0 005.925 1.585h.005c6.635 0 12.046-5.412 12.05-12.049a11.83 11.83 0 00-3.41-8.461z" />
                  </svg>
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
