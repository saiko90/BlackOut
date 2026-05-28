import { NextResponse } from 'next/server'
import Stripe from 'stripe'

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: '2026-05-27.dahlia',
})

/* ────────────────────────────────────────────────────────────
   POST /api/webhooks/stripe
   Reçoit les événements Stripe et les valide par signature.
──────────────────────────────────────────────────────────── */
export async function POST(req: Request) {
  const sig    = req.headers.get('stripe-signature')
  const secret = process.env.STRIPE_WEBHOOK_SECRET

  if (!sig || !secret) {
    console.error('[webhook] stripe-signature ou STRIPE_WEBHOOK_SECRET manquant')
    return NextResponse.json({ error: 'Configuration manquante' }, { status: 400 })
  }

  let event: Stripe.Event
  try {
    const body = await req.text()
    event = stripe.webhooks.constructEvent(body, sig, secret)
  } catch (err) {
    console.error(`[webhook] Signature invalide — ${String(err)}`)
    return NextResponse.json({ error: `Webhook Error: ${String(err)}` }, { status: 400 })
  }

  // ── Traitement des événements ──
  if (event.type === 'checkout.session.completed') {
    const session = event.data.object as Stripe.Checkout.Session
    const userId  = session.metadata?.userId
    const isGift  = session.metadata?.isGift === 'true'

    console.log(
      `[webhook] checkout.session.completed — session=${session.id}` +
      ` userId=${userId} isGift=${isGift} amount=${session.amount_total}`
    )

    // Mission 16 : insérer le token en base ici
  }

  return NextResponse.json({ received: true })
}
