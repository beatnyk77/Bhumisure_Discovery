import Image from 'next/image'
import Link from 'next/link'
import { ListingCardData } from '@/types/listing'
import { APP_CONFIG } from '@/constants/config'
import { daysAgo, formatListedAgo, formatVerifiedAgo } from '@/lib/utils/date'

interface ListingCardProps {
  listing: ListingCardData
}

export function ListingCard({ listing }: ListingCardProps) {
  const slug = `${listing.locality_slug}-${listing.property_type.toLowerCase()}-${listing.id.slice(0, 8)}`
  const title = listing.title || `${listing.property_type} in ${listing.locality_name || listing.locality_slug}`
  const listedDays = daysAgo(listing.created_at)
  const verifiedLabel = formatVerifiedAgo(listing.last_verified_at)
  const isJustListed = listedDays < APP_CONFIG.JUST_LISTED_DAYS

  return (
    <div className="group bg-white rounded-2xl overflow-hidden border border-slate-200 shadow-sm hover:shadow-md transition-all duration-300">
      <div className="relative aspect-[4/5] overflow-hidden">
        {listing.thumbnail_url ? (
          <Image
            src={listing.thumbnail_url}
            alt={title}
            fill
            className="object-cover group-hover:scale-105 transition-transform duration-500"
          />
        ) : (
          <div className="w-full h-full bg-gradient-to-br from-slate-100 to-slate-200 flex items-center justify-center text-slate-400 text-sm">
            Reel preview
          </div>
        )}

        <div className="absolute top-4 left-4 bg-white/90 backdrop-blur px-3 py-1.5 rounded-full shadow-sm">
          <span className="text-sm font-bold text-slate-900">₹{listing.rent_monthly.toLocaleString()}</span>
          <span className="text-[10px] text-slate-500 ml-1">/mo</span>
        </div>

        <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity bg-black/10">
          <div className="w-12 h-12 bg-white/20 backdrop-blur rounded-full flex items-center justify-center border border-white/30">
            <svg className="w-6 h-6 text-white fill-current" viewBox="0 0 24 24">
              <path d="M8 5v14l11-7z" />
            </svg>
          </div>
        </div>
      </div>

      <div className="p-4">
        <h3 className="font-semibold text-slate-900 truncate">{title}</h3>
        <p className="text-xs text-slate-500 mb-3">
          {listing.furnishing ? `${listing.furnishing} furnished` : 'Furnishing not specified'}
        </p>

        <div className="flex items-center gap-2 mb-4 flex-wrap">
          <div className="px-2 py-1 bg-slate-100 rounded text-[10px] font-medium text-slate-600 uppercase tracking-wider">
            {listing.locality_name || listing.locality_slug}
          </div>
          {isJustListed && (
            <div className="px-2 py-1 bg-blue-50 text-blue-600 rounded text-[10px] font-medium uppercase tracking-wider">
              Just listed
            </div>
          )}
          <div className="px-2 py-1 bg-slate-50 text-slate-500 rounded text-[10px] font-medium">
            {formatListedAgo(listing.created_at)}
          </div>
          {verifiedLabel && (
            <div className="px-2 py-1 bg-green-50 text-green-700 rounded text-[10px] font-medium">
              {verifiedLabel}
            </div>
          )}
        </div>

        <div className="flex gap-2">
          <Link
            href={`/listing/${slug}`}
            className="flex-1 text-center py-2 bg-slate-900 text-white text-sm font-semibold rounded-lg hover:bg-slate-800 transition-colors"
          >
            View Details
          </Link>
          <a
            href={listing.reel_url}
            target="_blank"
            rel="noopener noreferrer"
            className="w-10 h-10 flex items-center justify-center border border-slate-200 rounded-lg hover:bg-slate-50 transition-colors"
            aria-label="Open reel"
          >
            <svg className="w-5 h-5 text-slate-600" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <rect x="2" y="2" width="20" height="20" rx="5" ry="5" />
              <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z" />
              <line x1="17.5" y1="6.5" x2="17.51" y2="6.5" />
            </svg>
          </a>
        </div>
      </div>
    </div>
  )
}