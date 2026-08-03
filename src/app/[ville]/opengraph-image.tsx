import { buildOgImage, OG_SIZE } from '@/lib/seo/og-image-template'

// TODO : rendre alt/subtitle dynamiques par ville (via params) le jour
// où Sion et Lausanne sont ajoutés à KNOWN_VILLE_SLUGS dans page.tsx.
export const alt = 'Black Out ! — Rallye urbain à Genève'
export const size = OG_SIZE
export const contentType = 'image/png'

export default async function Image() {
  return buildOgImage({
    subtitle: 'Rallye urbain à Genève',
    bottomText: '29 CHF par équipe · joueurs illimités',
    badgeText: 'Disponible',
  })
}
