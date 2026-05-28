'use server'

import Stripe from 'stripe'
import { headers } from 'next/headers'

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: '2026-05-27.dahlia',
})

export async function createCheckoutSession(userId: string, isGift = false) {
  const headersList = await headers()

  // Déduire l'origine de façon fiable (dev + prod Vercel)
  const host   = headersList.get('host') ?? 'black-out-brown.vercel.app'
  const proto  = host.startsWith('localhost') ? 'http' : 'https'
  const origin = `${proto}://${host}`

  const session = await stripe.checkout.sessions.create({
    ui_mode: 'embedded' as Stripe.Checkout.SessionCreateParams.UiMode,
    payment_method_types: ['card', 'twint'] as Stripe.Checkout.SessionCreateParams.PaymentMethodType[],
    currency: 'chf',
    line_items: [
      {
        price_data: {
          currency: 'chf',
          unit_amount: 2900,   // 29.00 CHF
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
    metadata: {
      userId,
      isGift: isGift ? 'true' : 'false',
    },
  })

  return { clientSecret: session.client_secret }
}
