declare global {
  interface Window {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    ttq: any
  }
}

function track(event: string, params?: Record<string, unknown>) {
  if (typeof window !== 'undefined' && typeof window.ttq?.track === 'function') {
    window.ttq.track(event, params)
  }
}

export function ttqInitiateCheckout() {
  track('InitiateCheckout')
}

export function ttqPurchase(value: number, currency: string) {
  track('CompletePayment', { value, currency })
}
