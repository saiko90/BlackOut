import type { NextConfig } from 'next'
import { withSentryConfig } from '@sentry/nextjs'

const nextConfig: NextConfig = {
  experimental: {
    serverActions: {
      bodySizeLimit: '15mb',
    },
  },
}

export default withSentryConfig(nextConfig, {
  org:     'theblackoutgame',
  project: 'blackout-game-prod',

  // Upload des source maps uniquement en CI/CD (évite les uploads locaux)
  silent: true,

  // Tunnel interne pour éviter les bloqueurs de pubs
  tunnelRoute: '/monitoring',

  // Réduit la taille du bundle client
  disableLogger: true,
  widenClientFileUpload: true,

  // Monitoring automatique des cron Vercel
  automaticVercelMonitors: true,
})
