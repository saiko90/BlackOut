import type { Metadata } from 'next'
import { SITE_NAME } from '@/lib/seo/site'

/* ── OpenGraph + Twitter propres à une page.
   Next remplace `openGraph` et `twitter` en entier dans un segment enfant
   (fusion superficielle) : on repasse donc type, locale et siteName à chaque fois.
   Volontairement SANS `images` : les fichiers opengraph-image / twitter-image
   de chaque route continuent de s'appliquer. ── */
export function buildSocial(
  path: string,
  title: string,
  description: string
): Pick<Metadata, 'openGraph' | 'twitter'> {
  return {
    openGraph: {
      type: 'website',
      locale: 'fr_CH',
      siteName: SITE_NAME,
      url: path,
      title,
      description,
    },
    twitter: {
      card: 'summary_large_image',
      title,
      description,
    },
  }
}
