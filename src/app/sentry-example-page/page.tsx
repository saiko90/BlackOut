'use client'

import { useState } from 'react'
import * as Sentry from '@sentry/nextjs'

export default function SentryTestPage() {
  const [serverStatus, setServerStatus] = useState<string | null>(null)

  const throwClientError = () => {
    throw new Error('[Sentry Test] Erreur client volontaire — si tu vois ceci dans Sentry, tout fonctionne ✅')
  }

  const triggerServerError = async () => {
    setServerStatus('en cours...')
    try {
      await fetch('/api/sentry-test')
    } catch {
      // L'erreur est levée côté serveur, Sentry la capture automatiquement
    }
    setServerStatus('Requête envoyée — vérifie Sentry dans 30 secondes')
  }

  const sendManualEvent = () => {
    Sentry.captureMessage('[Sentry Test] Événement manuel envoyé depuis la page de test', 'info')
    alert('Événement envoyé ! Vérifie ton dashboard Sentry.')
  }

  return (
    <div className="min-h-dvh bg-zinc-950 text-white flex items-center justify-center p-6">
      <div className="w-full max-w-sm space-y-6">
        <div className="text-center space-y-2">
          <p className="text-3xl">🛡️</p>
          <h1 className="text-2xl font-black">Test Sentry</h1>
          <p className="text-zinc-500 text-sm">Vérifie que les erreurs remontent correctement</p>
        </div>

        <div className="space-y-3">
          {/* Erreur client */}
          <button
            onClick={throwClientError}
            className="w-full bg-red-600 hover:bg-red-500 text-white font-bold py-4 rounded-2xl transition-colors"
          >
            💥 Déclencher une erreur client
          </button>

          {/* Erreur serveur */}
          <button
            onClick={triggerServerError}
            className="w-full bg-orange-600 hover:bg-orange-500 text-white font-bold py-4 rounded-2xl transition-colors"
          >
            🖥️ Déclencher une erreur serveur
          </button>
          {serverStatus && (
            <p className="text-xs text-zinc-400 text-center">{serverStatus}</p>
          )}

          {/* Event manuel */}
          <button
            onClick={sendManualEvent}
            className="w-full bg-violet-600 hover:bg-violet-500 text-white font-bold py-4 rounded-2xl transition-colors"
          >
            📡 Envoyer un événement de test
          </button>
        </div>

        <p className="text-center text-xs text-zinc-700">
          Supprime cette page après vérification
        </p>
      </div>
    </div>
  )
}
