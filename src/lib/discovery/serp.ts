const SERP_DISCOVERY_QUERIES = [
  'site:instagram.com/reel "indore" "rent" "1bhk"',
  'site:instagram.com/reel "indore" "flat" "rent"',
  'site:instagram.com/reel "vijay nagar" "rent"',
  'site:instagram.com/reel "scheme 54" "bhk"',
  'site:instagram.com/reel "nipania" "flat"',
  'site:instagram.com/reel "palasia" "rent"',
  'site:youtube.com/shorts "indore" "flat rent"',
] as const

const REEL_URL_PATTERN =
  /https?:\/\/(?:www\.)?(?:instagram\.com\/reel\/[A-Za-z0-9_-]+|youtube\.com\/shorts\/[A-Za-z0-9_-]+)/gi

export interface DiscoveredUrl {
  source_url: string
  source_type: 'serp' | 'broker_handle'
  discovery_query: string
}

function extractReelUrls(text: string): string[] {
  const matches = text.match(REEL_URL_PATTERN) ?? []
  return Array.from(new Set(matches.map((url) => url.split('?')[0])))
}

async function serpSearch(query: string): Promise<string[]> {
  const apiKey = process.env.SERPAPI_KEY
  if (!apiKey) {
    console.warn('[Discovery] SERPAPI_KEY not set — skipping SerpAPI')
    return []
  }

  const params = new URLSearchParams({
    engine: 'google',
    q: query,
    api_key: apiKey,
    num: '10',
  })

  const res = await fetch(`https://serpapi.com/search.json?${params}`)
  if (!res.ok) {
    throw new Error(`SerpAPI failed: ${res.status}`)
  }

  const data = await res.json()
  const organic = data.organic_results ?? []
  const urls: string[] = []

  for (const result of organic) {
    const blob = `${result.link ?? ''} ${result.snippet ?? ''}`
    urls.push(...extractReelUrls(blob))
    if (result.link) urls.push(...extractReelUrls(result.link))
  }

  return Array.from(new Set(urls))
}

export async function discoverFromSerp(): Promise<DiscoveredUrl[]> {
  const query = SERP_DISCOVERY_QUERIES[new Date().getDate() % SERP_DISCOVERY_QUERIES.length]
  const urls = await serpSearch(query)

  return urls.map((source_url) => ({
    source_url,
    source_type: 'serp' as const,
    discovery_query: query,
  }))
}

/** Run all locality queries — use for initial bootstrap (7 SerpAPI calls). */
export async function discoverAllFromSerp(): Promise<DiscoveredUrl[]> {
  const discovered: DiscoveredUrl[] = []

  for (const query of SERP_DISCOVERY_QUERIES) {
    const urls = await serpSearch(query)
    for (const source_url of urls) {
      discovered.push({ source_url, source_type: 'serp', discovery_query: query })
    }
  }

  const seen = new Set<string>()
  return discovered.filter((item) => {
    if (seen.has(item.source_url)) return false
    seen.add(item.source_url)
    return true
  })
}

export async function discoverFromBrokerHandles(
  handles: string[],
  maxHandles = 5
): Promise<DiscoveredUrl[]> {
  const discovered: DiscoveredUrl[] = []

  for (const handle of handles.slice(0, maxHandles)) {
    const query = `site:instagram.com/reel "${handle}" indore rent`
    const urls = await serpSearch(query)
    for (const source_url of urls) {
      discovered.push({
        source_url,
        source_type: 'broker_handle',
        discovery_query: handle,
      })
    }
  }

  return discovered
}

export function isSupportedReelUrl(url: string): boolean {
  return (
    url.includes('instagram.com/reel/') ||
    url.includes('youtube.com/shorts/')
  )
}