// Déclaration globale unique de window.fbq pour tout le projet
declare global {
  interface Window {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    fbq: (...args: any[]) => void
  }
}

function track(event: string, params?: Record<string, unknown>) {
  if (typeof window !== 'undefined' && typeof window.fbq === 'function') {
    window.fbq('track', event, params)
  }
}

export function trackPurchase(valueCHF: number) {
  track('Purchase', { value: valueCHF, currency: 'CHF' })
}
