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
