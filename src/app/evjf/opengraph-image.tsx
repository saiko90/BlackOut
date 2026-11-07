import { buildOgImage, OG_SIZE } from '@/lib/seo/og-image-template'

export const alt = 'Black Out ! — EVJF à Sion, Lausanne ou Genève'
export const size = OG_SIZE
export const contentType = 'image/png'

export default async function Image() {
  return buildOgImage({
    subtitle: 'EVJF — un jeu de piste en ville',
    bottomText: '29 CHF par équipe · Sion · Lausanne · Genève',
    badgeText: 'EVJF',
  })
}
