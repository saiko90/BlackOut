'use client'

import { useEffect, useState } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import { useRouter } from 'next/navigation'
import {
  ArrowLeft, X, CreditCard, Gift, Loader2, ShoppingBag, Zap,
  Tag, CheckCircle2, AlertCircle, Film, Shield,
} from 'lucide-react'
import { loadStripe } from '@stripe/stripe-js'
import { EmbeddedCheckoutProvider, EmbeddedCheckout } from '@stripe/react-stripe-js'
import { useGameStore } from '@/store/gameStore'
import { useToastStore } from '@/store/toastStore'
import { createCheckoutSession } from '@/app/actions/stripe'
import { validatePromoCode } from '@/app/actions/promo'
import { ttqInitiateCheckout } from '@/lib/analytics/tiktok'
import { citySlug, cn, daysLeftInMonth } from '@/lib/utils'
import { getActiveCities, getCity } from '@/lib/cities'

const stripePromise = loadStripe(process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY!)

const ACTIVE_CITIES = getActiveCities()

type CheckoutView = 'summary' | 'stripe'
type PromoStatus  = 'idle' | 'checking' | 'valid' | 'invalid'

export default function CheckoutPage() {
  const router = useRouter()
  const { user } = useGameStore()
  const { addToast } = useToastStore()

  const [city, setCity] = useState(ACTIVE_CITIES[0]?.name ?? 'Sion')

  /* ── Ville initiale depuis l'URL (?city=Lausanne) ── */
  useEffect(() => {
    const fromUrl = new URLSearchParams(window.location.search).get('city')
    if (fromUrl && ACTIVE_CITIES.some((c) => c.name === fromUrl)) {
      setCity(fromUrl)
    }
  }, [])

  const cityInfo = getCity(city) ?? ACTIVE_CITIES[0]
  const price = cityInfo?.price ?? '29 CHF'
  const baseChf = parseFloat(price) || 29

  const [isGift, setIsGift]           = useState(false)
  const [loading, setLoading]         = useState(false)
  const [view, setView]               = useState<CheckoutView>('summary')
  const [clientSecret, setClientSecret] = useState<string | null>(null)

  /* ── Code promo ── */
  const [promoInput, setPromoInput]   = useState('')
  const [promoStatus, setPromoStatus] = useState<PromoStatus>('idle')
  const [promoCodeId, setPromoCodeId] = useState<string | null>(null)
  const [promoPercent, setPromoPercent] = useState(0)
  const [promoError, setPromoError]   = useState<string | null>(null)

  const resetPromo = () => {
    setPromoInput('')
    setPromoStatus('idle')
    setPromoCodeId(null)
    setPromoPercent(0)
    setPromoError(null)
  }

  /* Changer de ville réinitialise le code promo (un code peut être lié à une offre précise) */
  const handleSelectCity = (next: string) => {
    if (next === city || loading) return
    setCity(next)
    resetPromo()
  }

  const finalPrice = promoStatus === 'valid' && promoPercent > 0
    ? `${(baseChf * (1 - promoPercent / 100)).toFixed(2)} CHF`
    : price

  const handleApplyPromo = async () => {
    if (!promoInput.trim() || promoStatus === 'checking') return
    setPromoStatus('checking')
    setPromoError(null)

    const result = await validatePromoCode(promoInput, user?.id ?? undefined)

    if (result.valid) {
      setPromoStatus('valid')
      setPromoCodeId(result.promoCodeId)
      setPromoPercent(result.percentOff)
    } else {
      setPromoStatus('invalid')
      setPromoError(result.error)
      setPromoCodeId(null)
      setPromoPercent(0)
    }
  }

  const handlePay = async () => {
    if (!user) {
      addToast('Connecte-toi pour continuer.', 'error')
      return
    }
    ttqInitiateCheckout()
    setLoading(true)
    const promoStr = promoStatus === 'valid' ? promoInput.trim().toUpperCase() : undefined
    const result = await createCheckoutSession(user.id, isGift, promoCodeId ?? undefined, promoStr, city)
    setLoading(false)

    if (result.error || !result.clientSecret) {
      addToast(`Erreur Stripe : ${result.error ?? 'client_secret manquant'}`, 'error')
      return
    }

    setClientSecret(result.clientSecret)
    setView('stripe')
  }

  const handleCancelPayment = () => {
    setView('summary')
    setClientSecret(null)
  }

  return (
    <div className="flex justify-center min-h-dvh bg-zinc-950">
      <div className="relative w-full max-w-md min-h-dvh bg-zinc-950 flex flex-col overflow-hidden">

        {/* Ambient glows */}
        <div aria-hidden className="pointer-events-none absolute inset-0 overflow-hidden">
          <div className="absolute -top-24 -left-16 w-72 h-72 rounded-full bg-violet-600/12 blur-3xl" />
          <div className="absolute top-1/2 -right-20 w-64 h-64 rounded-full bg-pink-500/8 blur-3xl" />
        </div>

        <AnimatePresence mode="wait">
          {view === 'summary' ? (
            <motion.div
              key="summary"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="relative z-10 flex flex-col flex-1 px-6 pt-12 pb-10 overflow-y-auto"
            >
              {/* Header */}
              <div className="flex items-center justify-between mb-6">
                <button
                  onClick={() => router.push('/cities')}
                  className="flex items-center gap-1.5 text-zinc-500 hover:text-zinc-300 transition-colors text-sm font-medium"
                >
                  <ArrowLeft size={16} />
                  Changer de ville
                </button>
              </div>

              <div className="mb-6">
                <h1 className="text-2xl font-bold text-white">Finaliser l&apos;achat</h1>
                <p className="text-sm text-zinc-400 mt-0.5">Paiement sécurisé · Stripe</p>
              </div>

              {/* ── Sélecteur de ville (bien visible, modifiable) ── */}
              <div className="mb-5">
                <p className="text-xs font-semibold text-zinc-500 uppercase tracking-widest mb-2.5">
                  Ville sélectionnée
                </p>
                <div className="flex bg-zinc-800/60 rounded-2xl p-1.5 gap-1.5">
                  {ACTIVE_CITIES.map((c) => (
                    <motion.button
                      key={c.name}
                      onClick={() => handleSelectCity(c.name)}
                      disabled={loading}
                      whileTap={{ scale: 0.97 }}
                      className={cn(
                        'flex-1 flex items-center justify-center gap-1.5 py-3 rounded-xl text-sm font-bold transition-all disabled:opacity-50',
                        city === c.name
                          ? 'bg-violet-600 text-white shadow-[0_0_16px_rgba(124,58,237,0.5)]'
                          : 'text-zinc-400 hover:text-white hover:bg-white/5'
                      )}
                    >
                      <span>{c.emoji}</span>
                      {c.name}
                    </motion.button>
                  ))}
                </div>
              </div>

              {/* Résumé commande */}
              <div className="glass rounded-2xl p-4 mb-4">
                <div className="flex items-center gap-3 mb-3">
                  <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${isGift ? 'bg-amber-500/15 text-amber-400' : 'bg-violet-500/15 text-violet-400'}`}>
                    {isGift ? <Gift size={18} /> : <Zap size={18} />}
                  </div>
                  <div className="flex-1">
                    <p className="font-semibold text-white text-sm">
                      {isGift ? '🎁 Cadeau · ' : ''}Pass Black Out ! · {city}
                    </p>
                    <p className="text-xs text-zinc-500 mt-0.5">
                      {isGift
                        ? 'Un code unique sera généré après paiement'
                        : '12 défis · ~2h de jeu · joueurs illimités'}
                    </p>
                  </div>
                  {promoStatus === 'valid' ? (
                    <div className="flex flex-col items-end shrink-0">
                      <span className="text-xs text-zinc-500 line-through">{price}</span>
                      <span className="font-black text-emerald-400">{finalPrice}</span>
                    </div>
                  ) : (
                    <span className="font-black text-white shrink-0">
                      {price}<span className="text-[10px] font-normal text-zinc-500">/équipe</span>
                    </span>
                  )}
                </div>

                <div className="border-t border-white/5 pt-3 flex justify-between items-center text-sm">
                  <span className="text-zinc-500">Total</span>
                  {promoStatus === 'valid' ? (
                    <div className="flex items-center gap-2">
                      <span className="text-xs text-zinc-600 line-through">{price}</span>
                      <span className="font-bold text-emerald-400">{finalPrice}</span>
                      <span className="text-[10px] font-bold bg-emerald-500/15 border border-emerald-500/30 text-emerald-400 px-1.5 py-0.5 rounded-full">
                        -{promoPercent}%
                      </span>
                    </div>
                  ) : (
                    <span className="font-bold text-white">
                      {price}<span className="text-[10px] font-normal text-zinc-500">/équipe</span>
                    </span>
                  )}
                </div>
              </div>

              {/* ── Valeur ajoutée + urgence concours ── */}
              <div className="flex items-center justify-between gap-2 mb-5 px-1">
                <span className="text-[11px] text-zinc-500 flex items-center gap-1">
                  <Film size={11} /> Film souvenir IA inclus
                </span>
                <span className="text-[11px] text-amber-400/90 font-semibold">
                  🏆 J-{daysLeftInMonth()} concours 50.-
                </span>
              </div>

              {/* ── Champ code promo ── */}
              <div className="mb-5">
                <div className="flex gap-2">
                  <div className="relative flex-1">
                    <Tag size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-zinc-500 pointer-events-none" />
                    <input
                      type="text"
                      value={promoInput}
                      onChange={(e) => {
                        setPromoInput(e.target.value.toUpperCase())
                        if (promoStatus !== 'idle') resetPromo()
                      }}
                      onKeyDown={(e) => { if (e.key === 'Enter') handleApplyPromo() }}
                      placeholder="Code promo"
                      disabled={promoStatus === 'valid' || loading}
                      className="w-full bg-zinc-800/60 border border-white/10 rounded-xl pl-9 pr-3 py-2.5 text-white placeholder:text-zinc-600 text-sm font-mono tracking-wider focus:outline-none focus:border-violet-500/50 focus:ring-1 focus:ring-violet-500/20 transition-all uppercase disabled:opacity-50"
                    />
                  </div>

                  {promoStatus === 'valid' ? (
                    <motion.button
                      whileTap={{ scale: 0.95 }}
                      onClick={resetPromo}
                      disabled={loading}
                      className="flex items-center gap-1.5 bg-zinc-700 hover:bg-zinc-600 text-zinc-300 font-semibold px-3 py-2.5 rounded-xl text-xs transition-colors disabled:opacity-40 shrink-0"
                    >
                      <X size={12} /> Retirer
                    </motion.button>
                  ) : (
                    <motion.button
                      whileTap={{ scale: 0.95 }}
                      onClick={handleApplyPromo}
                      disabled={!promoInput.trim() || promoStatus === 'checking' || loading}
                      className="bg-zinc-700 hover:bg-zinc-600 disabled:opacity-40 text-white font-semibold px-4 py-2.5 rounded-xl text-sm transition-colors flex items-center gap-1.5 shrink-0"
                    >
                      {promoStatus === 'checking'
                        ? <Loader2 size={14} className="animate-spin" />
                        : 'Appliquer'
                      }
                    </motion.button>
                  )}
                </div>

                <AnimatePresence>
                  {promoStatus === 'valid' && (
                    <motion.p
                      key="promo-ok"
                      initial={{ opacity: 0, y: -4 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0 }}
                      className="text-xs text-emerald-400 mt-2 flex items-center gap-1.5"
                    >
                      <CheckCircle2 size={12} />
                      Code appliqué ! -{promoPercent}% de réduction
                    </motion.p>
                  )}
                  {promoStatus === 'invalid' && promoError && (
                    <motion.p
                      key="promo-err"
                      initial={{ opacity: 0, y: -4 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0 }}
                      className="text-xs text-red-400 mt-2 flex items-center gap-1.5"
                    >
                      <AlertCircle size={12} />
                      {promoError}
                    </motion.p>
                  )}
                </AnimatePresence>
              </div>

              {/* Toggle cadeau */}
              <motion.button
                onClick={() => setIsGift(!isGift)}
                disabled={loading}
                className="w-full flex items-center justify-between p-4 glass rounded-2xl mb-5 hover:border-white/15 transition-all group disabled:opacity-50"
              >
                <div className="flex items-center gap-3">
                  <Gift size={18} className={isGift ? 'text-amber-400' : 'text-zinc-500 group-hover:text-zinc-300'} />
                  <div className="text-left">
                    <p className="text-sm font-semibold text-white">C&apos;est pour offrir en cadeau</p>
                    <p className="text-xs text-zinc-500 mt-0.5">Génère un code à partager</p>
                  </div>
                </div>
                <div className={`relative w-11 h-6 rounded-full transition-colors duration-200 ${isGift ? 'bg-amber-500' : 'bg-zinc-700'}`}>
                  <motion.div
                    animate={{ x: isGift ? 22 : 2 }}
                    transition={{ type: 'spring', damping: 20, stiffness: 400 }}
                    className="absolute top-1 w-4 h-4 rounded-full bg-white shadow-sm"
                  />
                </div>
              </motion.button>

              <AnimatePresence>
                {isGift && (
                  <motion.div
                    initial={{ opacity: 0, height: 0, marginBottom: 0 }}
                    animate={{ opacity: 1, height: 'auto', marginBottom: 20 }}
                    exit={{ opacity: 0, height: 0, marginBottom: 0 }}
                    className="overflow-hidden"
                  >
                    <div className="bg-amber-500/8 border border-amber-500/20 rounded-xl px-4 py-3 text-xs text-amber-400/80 leading-relaxed">
                      Un code type <span className="font-mono font-bold text-amber-300">{citySlug(city).toUpperCase().slice(0, 4) || 'PASS'}-XXXXXX</span> sera créé
                      après confirmation du paiement. Partagez-le à votre ami.
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>

              <div className="mt-auto">
                <motion.button
                  whileTap={{ scale: 0.97 }}
                  onClick={handlePay}
                  disabled={loading}
                  className={`w-full flex items-center justify-center gap-2.5 font-bold py-4 rounded-2xl text-base transition-all disabled:opacity-70 ${
                    isGift
                      ? 'bg-gradient-to-r from-amber-500 to-amber-400 text-zinc-900 shadow-[0_0_24px_rgba(245,158,11,.35)]'
                      : 'bg-gradient-to-r from-violet-600 to-violet-500 text-white glow-violet'
                  }`}
                >
                  {loading ? (
                    <><Loader2 size={18} className="animate-spin" /> Initialisation…</>
                  ) : isGift ? (
                    <><Gift size={18} /> Payer et générer le code → {finalPrice}</>
                  ) : (
                    <><CreditCard size={18} /> Payer maintenant → {finalPrice}</>
                  )}
                </motion.button>

                <p className="text-center text-xs text-zinc-500 mt-3 flex items-center justify-center gap-1.5">
                  <Shield size={12} className="text-emerald-500" />
                  Paiement 100% sécurisé · Un souci ? On répond sous 24h
                </p>
                <p className="text-center text-xs text-zinc-600 mt-1.5 flex items-center justify-center gap-1">
                  <ShoppingBag size={11} />
                  TWINT · Carte · Apple Pay · Google Pay · PayPal · Powered by Stripe
                </p>
              </div>
            </motion.div>
          ) : (
            <motion.div
              key="stripe"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="relative z-10 flex flex-col flex-1 min-h-0"
            >
              <div className="flex items-center justify-between px-6 pt-12 pb-4 border-b border-white/5 shrink-0">
                <p className="font-bold text-white text-sm">Paiement sécurisé · {city}</p>
                <motion.button
                  whileTap={{ scale: 0.9 }}
                  onClick={handleCancelPayment}
                  className="w-8 h-8 rounded-full bg-white/5 border border-white/10 flex items-center justify-center text-zinc-400 hover:text-white transition-colors"
                >
                  <X size={16} />
                </motion.button>
              </div>
              <div className="flex-1 overflow-y-auto">
                {clientSecret && (
                  <EmbeddedCheckoutProvider
                    stripe={stripePromise}
                    options={{ clientSecret }}
                  >
                    <EmbeddedCheckout />
                  </EmbeddedCheckoutProvider>
                )}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  )
}
