import { buildOgImage, OG_SIZE } from '@/lib/seo/og-image-template'

export const alt = 'Black Out ! — Choisis ta ville : Sion, Lausanne ou Genève'
export const size = OG_SIZE
export const contentType = 'image/png'

export default async function Image() {
  return buildOgImage({
    subtitle: 'Choisis ta ville — Sion · Lausanne · Genève',
    bottomText: '29 CHF par équipe · joueurs illimités',
    badgeText: 'Disponible',
  })
}
