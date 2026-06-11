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

export const metadata: Metadata = {
  title: 'Black Out ! — Le jeu urbain',
  description: 'Exploration urbaine, défis absurdes et roulette de la honte. Serez-vous à la hauteur ?',
  manifest: '/manifest.json',
  appleWebApp: {
    capable: true,
    statusBarStyle: 'black-translucent',
    title: 'Black Out !',
  },
  icons: {
    apple: '/icon.png',
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
