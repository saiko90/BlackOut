import { NextResponse } from 'next/server'

// Route de test Sentry — à supprimer après vérification
export async function GET() {
  throw new Error('[Sentry Test] Erreur serveur volontaire — si tu vois ceci dans Sentry, tout fonctionne ✅')
  return NextResponse.json({ ok: true })
}
