// Indore locality dictionary — mirrors the DB seed data
// Used for fuzzy matching AI-extracted place names

export interface LocalityEntry {
  slug: string
  name: string
  zone: string
  aliases: string[]   // common variations the AI might extract
}

export const INDORE_LOCALITIES: LocalityEntry[] = [
  { slug: 'vijay_nagar',    name: 'Vijay Nagar',    zone: 'West Indore',      aliases: ['VN', 'Vijay nagar', 'vijay nagar'] },
  { slug: 'scheme_54',      name: 'Scheme 54',      zone: 'West Indore',      aliases: ['S54', 'sch 54', 'scheme54'] },
  { slug: 'scheme_78',      name: 'Scheme 78',      zone: 'West Indore',      aliases: ['S78', 'sch 78', 'scheme78'] },
  { slug: 'ab_road',        name: 'AB Road',        zone: 'West Indore',      aliases: ['ABRoad', 'a.b. road'] },
  { slug: 'bhawarkua',      name: 'Bhawarkua',      zone: 'West Indore',      aliases: ['bhawarkuan', 'bhawarkua square'] },
  { slug: 'palasia',        name: 'Palasia',        zone: 'Central Indore',   aliases: ['palasiya'] },
  { slug: 'mg_road',        name: 'MG Road',        zone: 'Central Indore',   aliases: ['M.G. Road', 'mahatma gandhi road'] },
  { slug: 'rajwada',        name: 'Rajwada',        zone: 'Central Indore',   aliases: [] },
  { slug: 'sarafa',         name: 'Sarafa',         zone: 'Central Indore',   aliases: ['sarafa bazar'] },
  { slug: 'chhawni',        name: 'Chhawni',        zone: 'Central Indore',   aliases: ['chhauni', 'cantonment'] },
  { slug: 'rau',            name: 'Rau',            zone: 'South Indore',     aliases: [] },
  { slug: 'tejaji_nagar',   name: 'Tejaji Nagar',   zone: 'South Indore',     aliases: ['tejajinagar'] },
  { slug: 'kanadiya',       name: 'Kanadiya',       zone: 'South Indore',     aliases: [] },
  { slug: 'lig_colony',     name: 'LIG Colony',     zone: 'South Indore',     aliases: ['lig', 'L.I.G.'] },
  { slug: 'lasudia',        name: 'Lasudia',        zone: 'South Indore',     aliases: ['lasudia mori'] },
  { slug: 'sindhi_colony',  name: 'Sindhi Colony',  zone: 'North Indore',     aliases: [] },
  { slug: 'bengali_square', name: 'Bengali Square', 'zone': 'North Indore',   aliases: ['bengali chowk'] },
  { slug: 'mhow_naka',      name: 'Mhow Naka',      zone: 'North Indore',     aliases: [] },
  { slug: 'dewas_naka',     name: 'Dewas Naka',     zone: 'North Indore',     aliases: [] },
  { slug: 'nipania',        name: 'Nipania',        zone: 'East Indore',      aliases: [] },
  { slug: 'aerodrome',      name: 'Aerodrome',      zone: 'East Indore',      aliases: ['airport road'] },
  { slug: 'bicholi_mardana',name: 'Bicholi Mardana',zone: 'East Indore',      aliases: ['bicholi'] },
  { slug: 'pardesipura',    name: 'Pardesipura',    zone: 'East Indore',      aliases: ['pardeshi pura'] },
  { slug: 'super_corridor', name: 'Super Corridor', zone: 'New Developments', aliases: ['super corr'] },
  { slug: 'iim_road',       name: 'IIM Road',       zone: 'New Developments', aliases: ['IIM'] },
  { slug: 'bypass_road',    name: 'Bypass Road',    zone: 'New Developments', aliases: ['bypass'] },
  { slug: 'ring_road',      name: 'Ring Road',      zone: 'New Developments', aliases: [] },
]

export const LOCALITY_SLUGS = INDORE_LOCALITIES.map(l => l.slug)
export const LOCALITY_BY_SLUG = Object.fromEntries(INDORE_LOCALITIES.map(l => [l.slug, l]))
