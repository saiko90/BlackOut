export type City = {
  name: string
  slug: string
  region: string
  country: string
  price: string
  emoji: string
  isActive: boolean
}

export const CITIES: City[] = [
  { name: 'Sion',       slug: 'sion',      region: 'Valais',     country: 'Suisse', price: '29 CHF', emoji: '🏔️', isActive: true  },
  { name: 'Lausanne',   slug: 'lausanne',  region: 'Vaud',       country: 'Suisse', price: '29 CHF', emoji: '🌊', isActive: true  },
  { name: 'Genève',     slug: 'geneve',    region: 'Genève',     country: 'Suisse', price: '29 CHF', emoji: '⌚', isActive: true  },
  { name: 'Martigny',   slug: 'martigny',  region: 'Valais',     country: 'Suisse', price: '29 CHF', emoji: '🍷', isActive: false },
  { name: 'Fribourg',   slug: 'fribourg',  region: 'Fribourg',   country: 'Suisse', price: '29 CHF', emoji: '🏰', isActive: false },
  { name: 'Neuchâtel',  slug: 'neuchatel', region: 'Neuchâtel',  country: 'Suisse', price: '29 CHF', emoji: '🍫', isActive: false },
  { name: 'Yverdon',    slug: 'yverdon',   region: 'Vaud',       country: 'Suisse', price: '29 CHF', emoji: '♨️', isActive: false },
]

/* ── Villes actives d'abord, puis "coming soon" — ordre garanti pour l'affichage ── */
export function getSortedCities(): City[] {
  return [...CITIES].sort((a, b) => Number(b.isActive) - Number(a.isActive))
}

export function getActiveCities(): City[] {
  return CITIES.filter((c) => c.isActive)
}

export function getCity(name: string): City | undefined {
  return CITIES.find((c) => c.name === name)
}

export function getCityBySlug(slug: string): City | undefined {
  return CITIES.find((c) => c.slug === slug)
}
