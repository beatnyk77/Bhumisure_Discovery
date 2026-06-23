import { ReadonlyURLSearchParams } from 'next/navigation'
import { PropertyType } from '@/types/listing'

export function normalizeRentInput(value: string | number | undefined | null): number | undefined {
  if (value === undefined || value === null) return undefined

  const trimmed = String(value).trim()
  if (!trimmed) return undefined

  const parsed = Number.parseInt(trimmed, 10)
  return Number.isNaN(parsed) || parsed <= 0 ? undefined : parsed
}

interface BuildListingSearchHrefArgs {
  city: string
  locality: string
  searchParams?: ReadonlyURLSearchParams | URLSearchParams | null
  propertyType?: PropertyType | null
  minRent?: number | null
  maxRent?: number | null
  resetPage?: boolean
}

export function buildListingSearchHref({
  city,
  locality,
  searchParams = null,
  propertyType,
  minRent,
  maxRent,
  resetPage = true,
}: BuildListingSearchHrefArgs): string {
  const params = new URLSearchParams(searchParams?.toString() || '')

  if (propertyType) {
    params.set('bhk', propertyType)
  } else {
    params.delete('bhk')
  }

  if (minRent !== undefined && minRent !== null) {
    params.set('min', String(minRent))
  } else {
    params.delete('min')
  }

  if (maxRent !== undefined && maxRent !== null) {
    params.set('max', String(maxRent))
  } else {
    params.delete('max')
  }

  if (resetPage) {
    params.delete('page')
  }

  const query = params.toString()
  const pathname = `/${city}/${locality}`
  return query ? `${pathname}?${query}` : pathname
}