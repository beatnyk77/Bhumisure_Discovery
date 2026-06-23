import Link from 'next/link'
import { ReadonlyURLSearchParams } from 'next/navigation'

interface SearchPaginationProps {
  city: string
  locality: string
  searchParams: ReadonlyURLSearchParams | URLSearchParams
  page: number
  perPage: number
  total: number
}

function pageHref(
  city: string,
  locality: string,
  searchParams: ReadonlyURLSearchParams | URLSearchParams,
  page: number
) {
  const params = new URLSearchParams(searchParams.toString())
  if (page <= 1) params.delete('page')
  else params.set('page', String(page))
  const query = params.toString()
  const path = `/${city}/${locality}`
  return query ? `${path}?${query}` : path
}

export function SearchPagination({
  city,
  locality,
  searchParams,
  page,
  perPage,
  total,
}: SearchPaginationProps) {
  const totalPages = Math.max(1, Math.ceil(total / perPage))
  if (totalPages <= 1) return null

  const start = (page - 1) * perPage + 1
  const end = Math.min(page * perPage, total)

  return (
    <nav className="flex flex-col sm:flex-row items-center justify-between gap-4 mt-10 pt-8 border-t border-slate-200">
      <p className="text-sm text-slate-500">
        Showing {start}–{end} of {total} listings
      </p>
      <div className="flex items-center gap-2">
        {page > 1 ? (
          <Link
            href={pageHref(city, locality, searchParams, page - 1)}
            className="px-4 py-2 rounded-lg border border-slate-300 text-sm font-medium hover:bg-slate-50"
          >
            ← Previous
          </Link>
        ) : (
          <span className="px-4 py-2 rounded-lg border border-slate-200 text-sm text-slate-300">
            ← Previous
          </span>
        )}
        <span className="text-sm text-slate-600 px-2">
          Page {page} of {totalPages}
        </span>
        {page < totalPages ? (
          <Link
            href={pageHref(city, locality, searchParams, page + 1)}
            className="px-4 py-2 rounded-lg border border-slate-300 text-sm font-medium hover:bg-slate-50"
          >
            Next →
          </Link>
        ) : (
          <span className="px-4 py-2 rounded-lg border border-slate-200 text-sm text-slate-300">
            Next →
          </span>
        )}
      </div>
    </nav>
  )
}