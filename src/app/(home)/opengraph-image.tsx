import { buildOgImage, OG_SIZE } from '@/lib/seo/og-image-template'

export const alt = 'Black Out ! — Rallye urbain à Sion, Lausanne et Genève'
export const size = OG_SIZE
export const contentType = 'image/png'

export default async function Image() {
  return buildOgImage({
    subtitle: 'Rallye urbain — Sion · Lausanne · Genève',
    bottomText: '29 CHF par équipe · joueurs illimités',
    badgeText: 'Disponible',
  })
}
