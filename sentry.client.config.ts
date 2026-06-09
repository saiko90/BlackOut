import * as Sentry from '@sentry/nextjs'

Sentry.init({
  dsn: process.env.NEXT_PUBLIC_SENTRY_DSN,

  // Capture 10% des transactions (performances) — augmente si besoin
  tracesSampleRate: 0.1,

  // Replay vidéo : 100% sur les sessions avec erreur, 5% en normal
  replaysOnErrorSampleRate: 1.0,
  replaysSessionSampleRate: 0.05,

  integrations: [
    Sentry.replayIntegration({
      maskAllText: false,
      blockAllMedia: false,
    }),
  ],

  debug: false,
})
