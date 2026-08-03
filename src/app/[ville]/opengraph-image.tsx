import { buildOgImage, OG_SIZE } from '@/lib/seo/og-image-template'
import { VILLES_CONTENT } from '@/data/villes'

export const alt = 'Black Out ! — Rallye urbain'
export const size = OG_SIZE
export const contentType = 'image/png'

export default async function Image({ params }: { params: Promise<{ ville: string }> }) {
  const { ville } = await params
  const content = VILLES_CONTENT[ville]

  return buildOgImage({
    subtitle: content?.h1 ?? 'Rallye urbain',
    bottomText: '29 CHF par équipe · joueurs illimités',
    badgeText: 'Disponible',
  })
}
