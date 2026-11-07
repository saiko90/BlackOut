import { buildOgImage, OG_SIZE } from '@/lib/seo/og-image-template'

export const alt = 'Black Out ! — EVG à Sion, Lausanne ou Genève'
export const size = OG_SIZE
export const contentType = 'image/png'

export default async function Image() {
  return buildOgImage({
    subtitle: 'EVG — un rallye urbain en équipe',
    bottomText: '29 CHF par équipe · Sion · Lausanne · Genève',
    badgeText: 'EVG',
  })
}
