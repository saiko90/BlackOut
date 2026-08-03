import type { Metadata } from 'next'
import { notFound } from 'next/navigation'
import Image from 'next/image'
import Link from 'next/link'
import { ArrowLeft } from 'lucide-react'
import { PromoBanner } from '@/components/ui/PromoBanner'
import { JsonLd } from '@/components/seo/JsonLd'
import { marketingViewport } from '@/lib/seo/viewport'
import { getCityBySlug } from '@/lib/cities'
import { VILLES_CONTENT } from '@/data/villes'
import { PlayCta } from './PlayCta'

export const viewport = marketingViewport

/* ── Liste blanche stricte : seuls ces slugs génèrent une page.
   Ajouter 'sion' / 'lausanne' ici une fois leur contenu rédigé dans
   src/data/villes.ts — sans ça, generateStaticParams ne les construit
   pas et /sion, /lausanne renvoient 404 (notFound() ci-dessous). ── */
const KNOWN_VILLE_SLUGS = ['geneve', 'lausanne', 'sion']

export function generateStaticParams() {
  return KNOWN_VILLE_SLUGS.map((ville) => ({ ville }))
}

type VillePageProps = {
  params: Promise<{ ville: string }>
}

export async function generateMetadata({ params }: VillePageProps): Promise<Metadata> {
  const { ville } = await params
  const content = VILLES_CONTENT[ville]
  if (!content) return {}

  return {
    title: { absolute: content.title },
    description: content.description,
    alternates: {
      canonical: `/${ville}`,
    },
  }
}

export default async function VillePage({ params }: VillePageProps) {
  const { ville } = await params

  if (!KNOWN_VILLE_SLUGS.includes(ville)) {
    notFound()
  }

  const content = VILLES_CONTENT[ville]
  const city = getCityBySlug(ville)

  if (!content || !city) {
    notFound()
  }

  const checkoutHref = `/checkout?city=${encodeURIComponent(city.name)}`
  const pageUrl = `https://www.theblackoutgame.ch/${ville}`

  const PRODUCT_JSON_LD = {
    '@context': 'https://schema.org',
    '@type': 'Product',
    name: `Pass Black Out ! — ${city.name}`,
    description: "Pass d'équipe pour le rallye urbain Black Out !, 12 défis, joueurs illimités.",
    brand: { '@type': 'Brand', name: 'Black Out !' },
    offers: {
      '@type': 'Offer',
      price: '29',
      priceCurrency: 'CHF',
      availability: 'https://schema.org/InStock',
      url: `https://www.theblackoutgame.ch/checkout?city=${encodeURIComponent(city.name)}`,
    },
  }

  const SERVICE_JSON_LD = {
    '@context': 'https://schema.org',
    '@type': 'Service',
    serviceType: 'Rallye urbain en extérieur',
    provider: { '@type': 'Organization', name: 'Black Out !', url: 'https://www.theblackoutgame.ch' },
    areaServed: { '@type': 'City', name: city.name },
  }

  const BREADCRUMB_JSON_LD = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: [
      { '@type': 'ListItem', position: 1, name: 'Accueil', item: 'https://www.theblackoutgame.ch/' },
      { '@type': 'ListItem', position: 2, name: content.h1, item: pageUrl },
    ],
  }

  return (
    <div className="flex justify-center min-h-dvh bg-zinc-950">
      <div className="relative w-full max-w-md min-h-dvh">

        <PromoBanner />

        {/* Ambient glows */}
        <div aria-hidden className="pointer-events-none fixed inset-0 overflow-hidden">
          <div className="absolute -top-24 left-1/2 -translate-x-1/2 w-96 h-96 rounded-full bg-violet-600/10 blur-3xl" />
          <div className="absolute top-1/2 -right-32 w-64 h-64 rounded-full bg-pink-500/8 blur-3xl" />
          <div className="absolute bottom-1/4 -left-24 w-56 h-56 rounded-full bg-amber-500/6 blur-3xl" />
        </div>

        <main className="relative z-10 pb-16 space-y-10">

          {/* ── Retour ── */}
          <nav aria-label="Retour" className="px-4 pt-12">
            <Link
              href="/"
              className="inline-flex items-center gap-2 text-zinc-500 hover:text-zinc-300 text-sm transition-colors rounded-md focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-violet-400 focus-visible:ring-offset-2 focus-visible:ring-offset-zinc-950"
            >
              <ArrowLeft size={16} />
              Retour
            </Link>
          </nav>

          {/* ── HERO : bannière photo + h1 en overlay ── */}
          <header className="relative w-full aspect-[1600/700] overflow-hidden">
            <Image
              src={content.heroImage.src}
              alt={content.heroImage.alt}
              fill
              priority
              sizes="448px"
              className="object-cover"
            />
            <div
              aria-hidden
              className="absolute inset-0 bg-gradient-to-b from-transparent via-[#09090B]/70 to-[#09090B]"
            />
            <div className="absolute inset-x-0 bottom-0 px-4 pb-6">
              <h1 className="text-3xl font-black text-white leading-tight tracking-tight drop-shadow-[0_2px_16px_rgba(0,0,0,0.85)]">
                {content.h1}
              </h1>
            </div>
          </header>

          <div className="px-4 space-y-10">

            {/* ── Intro ── */}
            <section className="space-y-3">
              <h2 className="text-xl font-black text-white leading-snug tracking-tight">
                {content.subhead}
              </h2>
              {content.intro.map((paragraph) => (
                <p key={paragraph} className="text-sm text-zinc-400 leading-relaxed">
                  {paragraph}
                </p>
              ))}
            </section>

            {/* ── Sections éditoriales ── */}
            {content.sections.map((section) => (
              <section key={section.heading} className="space-y-3">
                <h2 className="text-xl font-black text-white leading-snug tracking-tight">
                  {section.heading}
                </h2>
                {section.paragraphs.map((paragraph) => (
                  <p key={paragraph} className="text-sm text-zinc-400 leading-relaxed">
                    {paragraph}
                  </p>
                ))}
              </section>
            ))}

            {/* ── Infos pratiques ── */}
            <section className="space-y-3">
              <h2 className="text-xl font-black text-white leading-snug tracking-tight">
                Infos pratiques
              </h2>
              <ul className="glass rounded-2xl p-5 space-y-3 text-sm text-zinc-400 leading-relaxed">
                {content.infosPratiques.map((info) => (
                  <li key={info.label}>
                    <strong className="text-white font-bold">{info.label} : </strong>
                    {info.value}
                  </li>
                ))}
              </ul>
            </section>

            {/* ── CTA ── */}
            <PlayCta href={checkoutHref} label={content.ctaLabel} />

          </div>
        </main>

        <JsonLd data={PRODUCT_JSON_LD} />
        <JsonLd data={SERVICE_JSON_LD} />
        <JsonLd data={BREADCRUMB_JSON_LD} />
      </div>
    </div>
  )
}
