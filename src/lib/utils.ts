import { type ClassValue, clsx } from 'clsx'
import { twMerge } from 'tailwind-merge'

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

/* ── Slug de ville pour hashtags / codes (supprime accents, espaces, tirets) ── */
export function citySlug(city: string): string {
  return city
    .normalize('NFD')
    .replace(/[̀-ͯ]/g, '')
    .replace(/[^a-zA-Z]/g, '')
}

export function cityHashtag(city: string): string {
  return `#BlackOut${citySlug(city)}`
}

/* ── Jours restants avant la fin du mois en cours (tirage du concours mensuel) ── */
export function daysLeftInMonth(): number {
  const now = new Date()
  const lastDay = new Date(now.getFullYear(), now.getMonth() + 1, 0)
  return lastDay.getDate() - now.getDate()
}
