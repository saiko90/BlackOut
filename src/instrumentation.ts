export async function register() {
  if (process.env.NEXT_RUNTIME === 'nodejs') {
    await import('../sentry.server.config')
  }
  if (process.env.NEXT_RUNTIME === 'edge') {
    await import('../sentry.edge.config')
  }
}

// Capture toutes les erreurs serveur Next.js (server actions, routes, etc.)
// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const onRequestError: (...args: any[]) => Promise<void> = async (...args) => {
  const { captureRequestError } = await import('@sentry/nextjs')
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  ;(captureRequestError as any)(...args)
}
