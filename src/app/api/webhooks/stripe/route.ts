import { NextResponse } from 'next/server'
import Stripe from 'stripe'
import { getSupabaseAdmin } from '@/lib/supabase/admin'

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: '2026-05-27.dahlia',
})

function generateGiftCode(): string {
  const chars = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789'
  const random = Array.from({ length: 6 }, () => chars[Math.floor(Math.random() * chars.length)]).join('')
  return `SION-${random}`
}

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
    const userId    = session.metadata?.userId
    const isGift    = session.metadata?.isGift === 'true'
    const promoCode = session.metadata?.promoCode ?? null

    console.log(
      `[webhook] checkout.session.completed — session=${session.id}` +
      ` userId=${userId} isGift=${isGift} amount=${session.amount_total}`
    )

    if (!userId) {
      console.error('[webhook] userId manquant dans session.metadata')
      return NextResponse.json({ error: 'userId manquant' }, { status: 400 })
    }

    const supabase = getSupabaseAdmin()
    const base = { user_id: userId, city: 'Sion', is_used: false, ...(promoCode && { promo_code: promoCode }) }
    const tokenRow = isGift ? { ...base, gift_code: generateGiftCode() } : base

    try {
      const { error: dbError } = await supabase.from('tokens').insert(tokenRow)
      if (dbError) throw dbError
      console.log(`[webhook] token inséré pour userId=${userId} isGift=${isGift}`)
    } catch (err) {
      console.error(`[webhook] Erreur insertion token — ${String(err)}`)
      return NextResponse.json({ error: 'DB error' }, { status: 500 })
    }
  }

  return NextResponse.json({ received: true })
}
