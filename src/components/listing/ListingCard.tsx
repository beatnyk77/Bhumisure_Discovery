import Image from 'next/image'
import Link from 'next/link'
import { ListingCardData } from '@/types/listing'

interface ListingCardProps {
  listing: ListingCardData
}

export function ListingCard({ listing }: ListingCardProps) {
  const slug = `${listing.locality_slug}-${listing.property_type.toLowerCase()}-${listing.id.slice(0, 8)}`

  return (
    <div className="group bg-white rounded-2xl overflow-hidden border border-slate-200 shadow-sm hover:shadow-md transition-all duration-300">
      {/* Thumbnail Area */}
      <div className="relative aspect-[4/5] overflow-hidden">
        {listing.thumbnail_url ? (
          <Image
            src={listing.thumbnail_url}
            alt={listing.title}
            fill
            className="object-cover group-hover:scale-105 transition-transform duration-500"
          />
        ) : (
          <div className="w-full h-full bg-slate-100 flex items-center justify-center text-slate-400">
            No Image
          </div>
        )}
        
        {/* Rent Badge */}
        <div className="absolute top-4 left-4 bg-white/90 backdrop-blur px-3 py-1.5 rounded-full shadow-sm">
          <span className="text-sm font-bold text-slate-900">₹{listing.rent_monthly.toLocaleString()}</span>
          <span className="text-[10px] text-slate-500 ml-1">/mo</span>
        </div>

        {/* Play Overlay */}
        <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity bg-black/10">
          <div className="w-12 h-12 bg-white/20 backdrop-blur rounded-full flex items-center justify-center border border-white/30">
            <svg className="w-6 h-6 text-white fill-current" viewBox="0 0 24 24">
              <path d="M8 5v14l11-7z" />
            </svg>
          </div>
        </div>
      </div>

      {/* Content Area */}
      <div className="p-4">
        <div className="flex justify-between items-start mb-2">
          <div>
            <h3 className="font-semibold text-slate-900 truncate">{listing.property_type} in {listing.locality_name}</h3>
            <p className="text-xs text-slate-500">{listing.furnishing} Furnished</p>
          </div>
        </div>

        <div className="flex items-center gap-2 mb-4">
          <div className="px-2 py-1 bg-slate-100 rounded text-[10px] font-medium text-slate-600 uppercase tracking-wider">
            {listing.locality_name}
          </div>
          <div className="px-2 py-1 bg-blue-50 text-blue-600 rounded text-[10px] font-medium uppercase tracking-wider">
            Just Listed
          </div>
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
