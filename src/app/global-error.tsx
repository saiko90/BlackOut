'use client'

import * as Sentry from '@sentry/nextjs'
import { useEffect } from 'react'

export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string }
  reset: () => void
}) {
  useEffect(() => {
    Sentry.captureException(error)
  }, [error])

  return (
    <html lang="fr">
      <body
        style={{
          minHeight: '100dvh',
          background: '#09090b',
          color: '#fff',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          padding: '24px',
          fontFamily: 'sans-serif',
        }}
      >
        <div style={{ textAlign: 'center', maxWidth: '320px' }}>
          <p style={{ fontSize: '2rem', marginBottom: '12px' }}>💥</p>
          <h2 style={{ fontSize: '1.2rem', fontWeight: 700, marginBottom: '8px' }}>
            Une erreur inattendue est survenue
          </h2>
          <p style={{ color: '#a1a1aa', fontSize: '0.875rem', marginBottom: '24px' }}>
            Notre équipe a été alertée automatiquement. Désolé pour la gêne.
          </p>
          <button
            onClick={reset}
            style={{
              background: '#7c3aed',
              color: '#fff',
              fontWeight: 700,
              padding: '12px 24px',
              borderRadius: '12px',
              border: 'none',
              cursor: 'pointer',
              fontSize: '0.9rem',
            }}
          >
            Réessayer
          </button>
        </div>
      </body>
    </html>
  )
}
