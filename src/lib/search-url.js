export function normalizeRentInput(value) {
  if (value === undefined || value === null) {
    return undefined
  }

  const trimmed = String(value).trim()
  if (!trimmed) {
    return undefined
  }

  const parsed = Number.parseInt(trimmed, 10)
  return Number.isNaN(parsed) || parsed <= 0 ? undefined : parsed
}

export function buildListingSearchHref({
  city,
  locality,
  searchParams,
  propertyType,
  minRent,
  maxRent,
  resetPage = true,
}) {
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
