import type { Metadata } from 'next'
import { marketingViewport } from '@/lib/seo/viewport'
import { JsonLd } from '@/components/seo/JsonLd'
import { buildSocial } from '@/lib/seo/og'
import {
  SITE_URL,
  SITE_NAME,
  SITE_TITLE,
  SITE_DESCRIPTION,
  ORGANIZATION_ID,
  WEBSITE_ID,
} from '@/lib/seo/site'

export const viewport = marketingViewport

export const metadata: Metadata = {
  alternates: {
    canonical: '/',
  },
  ...buildSocial('/', SITE_TITLE, SITE_DESCRIPTION),
}

const WEBSITE_JSON_LD = {
  '@context': 'https://schema.org',
  '@type': 'WebSite',
  '@id': WEBSITE_ID,
  name: SITE_NAME,
  alternateName: ['Black Out !', 'The Black-Out Game'],
  url: `${SITE_URL}/`,
  inLanguage: 'fr-CH',
  publisher: { '@id': ORGANIZATION_ID },
}

/* ── sameAs : mêmes URL que src/components/ui/SocialLinks.tsx ── */
const ORGANIZATION_JSON_LD = {
  '@context': 'https://schema.org',
  '@type': 'Organization',
  '@id': ORGANIZATION_ID,
  name: SITE_NAME,
  url: `${SITE_URL}/`,
  logo: `${SITE_URL}/logo.png`,
  email: 'contact@theblackoutgame.ch',
  areaServed: ['Sion', 'Lausanne', 'Genève'],
  sameAs: [
    'https://www.instagram.com/blackoutgamech/',
    'https://www.tiktok.com/@blackout4179',
    'https://www.facebook.com/profile.php?id=61590411963951',
  ],
}

export default function HomeLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <JsonLd data={WEBSITE_JSON_LD} />
      <JsonLd data={ORGANIZATION_JSON_LD} />
      {children}
    </>
  )
}
