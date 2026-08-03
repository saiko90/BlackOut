import type { Metadata } from 'next'
import { marketingViewport } from '@/lib/seo/viewport'
import { JsonLd } from '@/components/seo/JsonLd'
import { getActiveCities } from '@/lib/cities'

export const viewport = marketingViewport

export const metadata: Metadata = {
  title: 'Choisis ta ville',
  description:
    'Black Out !, le rallye urbain disponible à Sion, Lausanne et Genève. 29 CHF par équipe, joueurs illimités, 12 défis, film souvenir généré par IA.',
  alternates: {
    canonical: '/cities',
  },
}

const activeCities = getActiveCities()

const PRODUCT_JSON_LD = {
  '@context': 'https://schema.org',
  '@type': 'Product',
  name: 'Pass Black Out !',
  description: "Pass d'équipe pour le rallye urbain Black Out !, 12 défis, joueurs illimités.",
  brand: { '@type': 'Brand', name: 'Black Out !' },
  offers: activeCities.map((city) => ({
    '@type': 'Offer',
    name: `Pass Black Out ! — ${city.name}`,
    price: '29',
    priceCurrency: 'CHF',
    availability: 'https://schema.org/InStock',
    url: `https://www.theblackoutgame.ch/checkout?city=${encodeURIComponent(city.name)}`,
  })),
}

const SERVICE_JSON_LD = {
  '@context': 'https://schema.org',
  '@type': 'Service',
  serviceType: 'Rallye urbain en extérieur',
  provider: { '@type': 'Organization', name: 'Black Out !', url: 'https://www.theblackoutgame.ch' },
  areaServed: activeCities.map((city) => ({ '@type': 'City', name: city.name })),
}

const BREADCRUMB_JSON_LD = {
  '@context': 'https://schema.org',
  '@type': 'BreadcrumbList',
  itemListElement: [
    { '@type': 'ListItem', position: 1, name: 'Accueil', item: 'https://www.theblackoutgame.ch/' },
    { '@type': 'ListItem', position: 2, name: 'Choisis ta ville', item: 'https://www.theblackoutgame.ch/cities' },
  ],
}

export default function CitiesLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <JsonLd data={PRODUCT_JSON_LD} />
      <JsonLd data={SERVICE_JSON_LD} />
      <JsonLd data={BREADCRUMB_JSON_LD} />
      {children}
    </>
  )
}
