import type { Metadata, Viewport } from 'next'
import { Geist, Geist_Mono } from 'next/font/google'
import { Analytics } from '@vercel/analytics/react'
import { ToastContainer } from '@/components/ui/Toast'
import { MetaPixel } from '@/components/analytics/MetaPixel'
import { TikTokPixel } from '@/components/analytics/TikTokPixel'
import './globals.css'


const geistSans = Geist({
  variable: '--font-geist-sans',
  subsets: ['latin'],
})

const geistMono = Geist_Mono({
  variable: '--font-geist-mono',
  subsets: ['latin'],
})

const SITE_URL = 'https://www.theblackoutgame.ch'
const SITE_TITLE = 'Black Out ! — Le jeu urbain qui détruit la dignité'
const SITE_DESCRIPTION =
  'Le rallye urbain en équipe à Sion et Lausanne. Idéal pour un EVG, un EVJF, un anniversaire ou une sortie entre collègues. 12 défis, ~2h de jeu, un film souvenir généré par IA.'

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: SITE_TITLE,
  description: SITE_DESCRIPTION,
  manifest: '/manifest.json',
  appleWebApp: {
    capable: true,
    statusBarStyle: 'black-translucent',
    title: 'Black Out !',
  },
  icons: {
    apple: '/icon.png',
  },
  openGraph: {
    type: 'website',
    locale: 'fr_CH',
    url: SITE_URL,
    siteName: 'Black Out !',
    title: SITE_TITLE,
    description: SITE_DESCRIPTION,
    images: [{ url: '/logo.png', width: 512, height: 512, alt: 'Black Out !' }],
  },
  twitter: {
    card: 'summary_large_image',
    title: SITE_TITLE,
    description: SITE_DESCRIPTION,
    images: ['/logo.png'],
  },
}

export const viewport: Viewport = {
  themeColor: '#09090b',
  width: 'device-width',
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
}

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html
      lang="fr"
      className={`${geistSans.variable} ${geistMono.variable} h-full`}
    >
      <body className="min-h-dvh bg-zinc-950 text-white antialiased overflow-x-hidden">
        {children}
        <ToastContainer />
        <Analytics />
        <MetaPixel />
        <TikTokPixel />
      </body>
    </html>
  )
}
