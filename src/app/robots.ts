import { MetadataRoute } from 'next'

export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: '*',
      allow: '/',
      disallow: [
        '/dashboard',
        '/play/',
        '/admingodmode',
        '/forgot-password',
        '/reset-password',
      ],
    },
    sitemap: 'https://www.theblackoutgame.ch/sitemap.xml',
  }
}
