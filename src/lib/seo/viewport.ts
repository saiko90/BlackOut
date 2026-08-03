import type { Viewport } from 'next'

/* ── Viewport des routes marketing : zoom autorisé (accessibilité/Lighthouse).
   Les routes jeu gardent le viewport par défaut du layout racine (zoom bloqué,
   nécessaire pour éviter un zoom accidentel en pleine rue). ── */
export const marketingViewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  maximumScale: 5,
  userScalable: true,
}
