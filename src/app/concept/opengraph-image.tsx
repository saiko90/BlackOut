import { buildOgImage, OG_SIZE } from '@/lib/seo/og-image-template'

export const alt = 'Black Out ! — Le concept : comment survivre au jeu'
export const size = OG_SIZE
export const contentType = 'image/png'

export default async function Image() {
  return buildOgImage({
    subtitle: 'Le concept — comment ça marche ?',
    bottomText: '12 défis · ~2h de jeu · film souvenir généré par IA',
    badgeText: '4 étapes',
  })
}
