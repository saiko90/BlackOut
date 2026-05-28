'use server'

import Stripe from 'stripe'
import { headers } from 'next/headers'

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: '2026-05-27.dahlia',
})

type CheckoutResult =
  | { clientSecret: string; error?: never }
  | { clientSecret?: never; error: string }

export async function createCheckoutSession(
  userId: string,
  isGift = false
): Promise<CheckoutResult> {
  try {
    const headersList = await headers()

    const origin =
      headersList.get('origin') ??
      process.env.NEXT_PUBLIC_SITE_URL ??
      'https://black-out-brown.vercel.app'

    const session = await stripe.checkout.sessions.create({
      ui_mode: 'embedded' as Stripe.Checkout.SessionCreateParams.UiMode,
      payment_method_types: ['card', 'twint'] as Stripe.Checkout.SessionCreateParams.PaymentMethodType[],
      currency: 'chf',
      line_items: [
        {
          price_data: {
            currency: 'chf',
            unit_amount: 2900,
            product_data: {
              name: 'Pass Black Out — Sion',
              description: 'Accès complet · 10 défis · ~2h de jeu',
            },
          },
          quantity: 1,
        },
      ],
      mode: 'payment',
      return_url: `${origin}/dashboard?stripe_session_id={CHECKOUT_SESSION_ID}`,
      metadata: { userId, isGift: isGift ? 'true' : 'false' },
    })

    if (!session.client_secret) {
      throw new Error('Stripe n\'a pas renvoyé de client_secret.')
    }

    return { clientSecret: session.client_secret }
  } catch (err) {
    const message = err instanceof Error ? err.message : 'Erreur inconnue de Stripe'
    console.error(`[createCheckoutSession] ${message}`)
    return { error: message }
  }
}
