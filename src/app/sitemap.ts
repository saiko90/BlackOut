import { MetadataRoute } from 'next'

const BASE_URL = 'https://www.theblackoutgame.ch'

/* ── Dates fixes : à mettre à jour à la main quand le contenu d'une page change
   (new Date() donnait une date fausse à chaque build). ── */
export default function sitemap(): MetadataRoute.Sitemap {
  return [
    {
      url: BASE_URL,
      lastModified: new Date('2026-11-07'),
      changeFrequency: 'weekly',
      priority: 1.0,
    },
    {
      url: `${BASE_URL}/cities`,
      lastModified: new Date('2026-11-07'),
      changeFrequency: 'monthly',
      priority: 0.9,
    },
    {
      url: `${BASE_URL}/concept`,
      lastModified: new Date('2026-11-07'),
      changeFrequency: 'monthly',
      priority: 0.8,
    },
    {
      url: `${BASE_URL}/geneve`,
      lastModified: new Date('2026-11-07'),
      changeFrequency: 'monthly',
      priority: 0.9,
    },
    {
      url: `${BASE_URL}/lausanne`,
      lastModified: new Date('2026-11-07'),
      changeFrequency: 'monthly',
      priority: 0.9,
    },
    {
      url: `${BASE_URL}/sion`,
      lastModified: new Date('2026-11-07'),
      changeFrequency: 'monthly',
      priority: 0.9,
    },
    {
      url: `${BASE_URL}/evjf`,
      lastModified: new Date('2026-11-07'),
      changeFrequency: 'monthly',
      priority: 0.8,
    },
    {
      url: `${BASE_URL}/evg`,
      lastModified: new Date('2026-11-07'),
      changeFrequency: 'monthly',
      priority: 0.8,
    },
    {
      url: `${BASE_URL}/cgv`,
      lastModified: new Date('2026-10-14'),
      changeFrequency: 'yearly',
      priority: 0.3,
    },
    {
      url: `${BASE_URL}/mentions-legales`,
      lastModified: new Date('2026-10-14'),
      changeFrequency: 'yearly',
      priority: 0.3,
    },
  ]
}
