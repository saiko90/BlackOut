import type { Metadata } from 'next'
import Link from 'next/link'
import { ArrowLeft } from 'lucide-react'
import { PromoBanner } from '@/components/ui/PromoBanner'
import { JsonLd } from '@/components/seo/JsonLd'
import { buildSocial } from '@/lib/seo/og'
import { SITE_URL } from '@/lib/seo/site'
import type { IntentionContent } from '@/data/intentions'
import { PlayCta } from '@/app/[ville]/PlayCta'

/* ── Pages d'intention (/evjf, /evg) : Server Component, même structure
   visuelle que les pages villes. ── */

export function buildIntentionMetadata(content: IntentionContent): Metadata {
  return {
    title: { absolute: content.title },
    description: content.description,
    alternates: {
      canonical: `/${content.slug}`,
    },
    ...buildSocial(`/${content.slug}`, content.title, content.description),
  }
}

const H2 = 'text-xl font-black text-white leading-snug tracking-tight'
const P = 'text-sm text-zinc-400 leading-relaxed'

export function IntentionPage({ content }: { content: IntentionContent }) {
  const BREADCRUMB_JSON_LD = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: [
      { '@type': 'ListItem', position: 1, name: 'Accueil', item: `${SITE_URL}/` },
      {
        '@type': 'ListItem',
        position: 2,
        name: content.breadcrumbName,
        item: `${SITE_URL}/${content.slug}`,
      },
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

        <main className="relative z-10 px-4 pt-12 pb-16 space-y-10">

          {/* ── Retour ── */}
          <nav aria-label="Retour">
            <Link
              href="/"
              className="inline-flex items-center gap-2 text-zinc-500 hover:text-zinc-300 text-sm transition-colors rounded-md focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-violet-400 focus-visible:ring-offset-2 focus-visible:ring-offset-zinc-950"
            >
              <ArrowLeft size={16} />
              Retour
            </Link>
          </nav>

          {/* ── Intro ── */}
          <header className="space-y-3">
            <h1 className="text-3xl font-black text-white leading-tight tracking-tight">
              {content.h1}
            </h1>
            {content.intro.map((paragraph) => (
              <p key={paragraph} className={P}>
                {paragraph}
              </p>
            ))}
          </header>

          {/* ── Sections éditoriales ── */}
          {content.sections.map((section) => (
            <section key={section.heading} className="space-y-3">
              <h2 className={H2}>{section.heading}</h2>
              {section.paragraphs.map((paragraph) => (
                <p key={paragraph} className={P}>
                  {paragraph}
                </p>
              ))}
            </section>
          ))}

          {/* ── Villes : un bloc court + lien vers la page ville ── */}
          <section className="space-y-3">
            <h2 className={H2}>{content.citiesHeading}</h2>
            <ul className="space-y-2">
              {content.cities.map((city) => (
                <li key={city.slug} className="glass rounded-2xl p-5 space-y-2">
                  <h3 className="text-base font-bold text-white">{city.name}</h3>
                  <p className={P}>{city.text}</p>
                  <Link
                    href={`/${city.slug}`}
                    className="inline-block text-sm text-violet-300 hover:text-violet-200 underline underline-offset-2 transition-colors"
                  >
                    {city.linkLabel}
                  </Link>
                </li>
              ))}
            </ul>
          </section>

          {/* ── Budget ── */}
          <section className="space-y-3">
            <h2 className={H2}>{content.budget.heading}</h2>
            {content.budget.paragraphs.map((paragraph) => (
              <p key={paragraph} className={P}>
                {paragraph}
              </p>
            ))}
          </section>

          {/* ── FAQ (visible, sans JSON-LD FAQPage) ── */}
          <section className="space-y-3">
            <h2 className={H2}>{content.faqHeading}</h2>
            <div className="space-y-2">
              {content.faq.map((item) => (
                <details key={item.q} className="glass rounded-2xl group">
                  <summary className="cursor-pointer list-none px-5 py-4 text-sm font-semibold text-white leading-snug flex items-center justify-between gap-3 rounded-2xl focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-violet-400 focus-visible:ring-inset">
                    {item.q}
                    <span aria-hidden className="text-zinc-500 transition-transform group-open:rotate-180">
                      ▾
                    </span>
                  </summary>
                  <p className={`px-5 pb-5 ${P}`}>{item.a}</p>
                </details>
              ))}
            </div>
            <p className={P}>
              Le déroulé complet d&apos;une partie est expliqué sur la page{' '}
              <Link
                href="/concept"
                className="text-violet-300 hover:text-violet-200 underline underline-offset-2 transition-colors"
              >
                le concept
              </Link>
              .
            </p>
          </section>

          {/* ── CTA ── */}
          <PlayCta href="/cities" label={content.ctaLabel} />

        </main>

        <JsonLd data={BREADCRUMB_JSON_LD} />
      </div>
    </div>
  )
}
