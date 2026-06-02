'use server'

import Stripe from 'stripe'

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: '2026-05-27.dahlia',
})

type PromoValid   = { valid: true;  promoCodeId: string; percentOff: number }
type PromoInvalid = { valid: false; error: string }
type PromoResult  = PromoValid | PromoInvalid

export async function validatePromoCode(code: string): Promise<PromoResult> {
  const trimmed = code.trim().toUpperCase()
  if (!trimmed) return { valid: false, error: 'Entrez un code.' }

  try {
    const { data } = await stripe.promotionCodes.list({
      code:   trimmed,
      active: true,
      limit:  1,
    })

    const promoCode = data[0]

    if (!promoCode) {
      return { valid: false, error: 'Code promo invalide ou expiré.' }
    }

    // Vérifie si le quota est épuisé
    if (
      promoCode.max_redemptions !== null &&
      promoCode.times_redeemed >= promoCode.max_redemptions
    ) {
      return { valid: false, error: 'Oups trop tard ! Les 5 codes ont déjà été offerts.' }
    }

    const percentOff = promoCode.coupon.percent_off ?? 0

    return { valid: true, promoCodeId: promoCode.id, percentOff }
  } catch (err) {
    const message = err instanceof Error ? err.message : 'Erreur inconnue'
    console.error(`[validatePromoCode] ${message}`)
    return { valid: false, error: 'Impossible de vérifier le code. Réessayez.' }
  }
}
