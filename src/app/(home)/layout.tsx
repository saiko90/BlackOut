import type { Metadata } from 'next'
import { marketingViewport } from '@/lib/seo/viewport'

export const viewport = marketingViewport

export const metadata: Metadata = {
  alternates: {
    canonical: '/',
  },
}

export default function HomeLayout({ children }: { children: React.ReactNode }) {
  return children
}
