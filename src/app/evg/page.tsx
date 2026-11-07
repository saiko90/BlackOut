import type { Metadata } from 'next'
import { marketingViewport } from '@/lib/seo/viewport'
import { INTENTIONS_CONTENT } from '@/data/intentions'
import { IntentionPage, buildIntentionMetadata } from '@/components/marketing/IntentionPage'

export const viewport = marketingViewport

const content = INTENTIONS_CONTENT.evg

export const metadata: Metadata = buildIntentionMetadata(content)

export default function EVGPage() {
  return <IntentionPage content={content} />
}
