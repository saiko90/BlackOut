'use server'

import Stripe from 'stripe'
import { getSupabaseAdmin } from '@/lib/supabase/admin'

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: '2026-05-27.dahlia',
})

type PromoValid   = { valid: true;  promoCodeId: string; percentOff: number }
type PromoInvalid = { valid: false; error: string }
type PromoResult  = PromoValid | PromoInvalid

export async function validatePromoCode(code: string, userId?: string): Promise<PromoResult> {
  const trimmed = code.trim().toUpperCase()
  if (!trimmed) return { valid: false, error: 'Entrez un code.' }

  try {
    // ── 1. Vérification Stripe (code valide + quota global) ──
    const { data } = await stripe.promotionCodes.list({
      code:   trimmed,
      active: true,
      limit:  1,
    })

    const promoCode = data[0]

    if (!promoCode) {
      return { valid: false, error: 'Code promo invalide ou expiré.' }
    }

    if (
      promoCode.max_redemptions !== null &&
      promoCode.times_redeemed >= promoCode.max_redemptions
    ) {
      return { valid: false, error: 'Oups trop tard ! Les 5 codes ont déjà été offerts.' }
    }

    // ── 2. Vérification par utilisateur (une seule utilisation) ──
    if (userId) {
      const supabase = getSupabaseAdmin()
      const { data: existing } = await supabase
        .from('tokens')
        .select('id')
        .eq('user_id', userId)
        .eq('promo_code', trimmed)
        .maybeSingle()

      if (existing) {
        return { valid: false, error: 'Tu as déjà utilisé ce code promo sur ce compte.' }
      }
    }

    const percentOff = (promoCode as any).coupon?.percent_off ?? 0

    return { valid: true, promoCodeId: promoCode.id, percentOff }
  } catch (err) {
    const message = err instanceof Error ? err.message : 'Erreur inconnue'
    console.error(`[validatePromoCode] ${message}`)
    return { valid: false, error: 'Impossible de vérifier le code. Réessayez.' }
  }
}
