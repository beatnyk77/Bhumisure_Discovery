import test from 'node:test'
import assert from 'node:assert/strict'

import { buildListingSearchHref, normalizeRentInput } from '../src/lib/search-url.js'

test('normalizeRentInput parses valid rent values and rejects blanks', () => {
  assert.equal(normalizeRentInput('12500'), 12500)
  assert.equal(normalizeRentInput(' 14000 '), 14000)
  assert.equal(normalizeRentInput(''), undefined)
  assert.equal(normalizeRentInput('0'), undefined)
  assert.equal(normalizeRentInput('abc'), undefined)
})

test('buildListingSearchHref preserves unrelated query params and resets pagination', () => {
  const href = buildListingSearchHref({
    city: 'indore',
    locality: 'vijay_nagar',
    searchParams: new URLSearchParams('sort=verified_recent&page=2'),
    propertyType: '2BHK',
    minRent: 12000,
    maxRent: 18000,
  })

  assert.equal(href, '/indore/vijay_nagar?sort=verified_recent&bhk=2BHK&min=12000&max=18000')
})

test('buildListingSearchHref can clear filters without leaving a query string behind', () => {
  const href = buildListingSearchHref({
    city: 'indore',
    locality: 'all',
    searchParams: new URLSearchParams('bhk=1BHK&min=10000&max=14000'),
  })

  assert.equal(href, '/indore/all')
})
