export type City = {
  name: string
  region: string
  country: string
  price: string
  emoji: string
  isActive: boolean
}

export const CITIES: City[] = [
  { name: 'Sion',       region: 'Valais',     country: 'Suisse', price: '29 CHF', emoji: '🏔️', isActive: true  },
  { name: 'Lausanne',   region: 'Vaud',       country: 'Suisse', price: '29 CHF', emoji: '🌊', isActive: true  },
  { name: 'Genève',     region: 'Genève',     country: 'Suisse', price: '29 CHF', emoji: '⌚', isActive: true  },
  { name: 'Martigny',   region: 'Valais',     country: 'Suisse', price: '29 CHF', emoji: '🍷', isActive: false },
  { name: 'Fribourg',   region: 'Fribourg',   country: 'Suisse', price: '29 CHF', emoji: '🏰', isActive: false },
  { name: 'Neuchâtel',  region: 'Neuchâtel',  country: 'Suisse', price: '29 CHF', emoji: '🍫', isActive: false },
  { name: 'Yverdon',    region: 'Vaud',       country: 'Suisse', price: '29 CHF', emoji: '♨️', isActive: false },
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
