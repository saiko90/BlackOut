'use client'

import { useState } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import {
  X, CreditCard, Gift, Loader2, ShoppingBag, Zap,
  Tag, CheckCircle2, AlertCircle,
} from 'lucide-react'
import { loadStripe } from '@stripe/stripe-js'
import { EmbeddedCheckoutProvider, EmbeddedCheckout } from '@stripe/react-stripe-js'
import { useGameStore } from '@/store/gameStore'
import { useToastStore } from '@/store/toastStore'
import { createCheckoutSession } from '@/app/actions/stripe'
import { validatePromoCode } from '@/app/actions/promo'

const stripePromise = loadStripe(process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY!)

const BASE_CHF = 29

type DrawerView   = 'summary' | 'stripe'
type PromoStatus  = 'idle' | 'checking' | 'valid' | 'invalid'

type CheckoutDrawerProps = {
  isOpen: boolean
  onClose: () => void
  onSuccess: () => void
  city?: string
  price?: string
}

export function CheckoutDrawer({
  isOpen,
  onClose,
  onSuccess,
  city = 'Sion',
  price = '29 CHF',
}: CheckoutDrawerProps) {
  const { user }     = useGameStore()
  const { addToast } = useToastStore()

  const [isGift, setIsGift]           = useState(false)
  const [loading, setLoading]         = useState(false)
  const [view, setView]               = useState<DrawerView>('summary')
  const [clientSecret, setClientSecret] = useState<string | null>(null)

  /* ── Promo code ── */
  const [promoInput, setPromoInput]   = useState('')
  const [promoStatus, setPromoStatus] = useState<PromoStatus>('idle')
  const [promoCodeId, setPromoCodeId] = useState<string | null>(null)
  const [promoPercent, setPromoPercent] = useState(0)
  const [promoError, setPromoError]   = useState<string | null>(null)

  /* Prix final calculé */
  const finalPrice = promoStatus === 'valid' && promoPercent > 0
    ? `${(BASE_CHF * (1 - promoPercent / 100)).toFixed(2)} CHF`
    : price

  const handleReset = () => {
    setView('summary')
    setClientSecret(null)
    setIsGift(false)
    setPromoInput('')
    setPromoStatus('idle')
    setPromoCodeId(null)
    setPromoPercent(0)
    setPromoError(null)
    onClose()
  }

  /* ── Validation du code promo ── */
  const handleApplyPromo = async () => {
    if (!promoInput.trim() || promoStatus === 'checking') return
    setPromoStatus('checking')
    setPromoError(null)

    const result = await validatePromoCode(promoInput)

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

  const resetPromo = () => {
    setPromoInput('')
    setPromoStatus('idle')
    setPromoCodeId(null)
    setPromoPercent(0)
    setPromoError(null)
  }

  /* ── Lancer la session Stripe ── */
  const handlePay = async () => {
    if (!user) {
      addToast('Connecte-toi pour continuer.', 'error')
      return
    }
    setLoading(true)
    const result = await createCheckoutSession(user.id, isGift, promoCodeId ?? undefined)
    setLoading(false)

    if (result.error || !result.clientSecret) {
      addToast(`Erreur Stripe : ${result.error ?? 'client_secret manquant'}`, 'error')
      return
    }

    setClientSecret(result.clientSecret)
    setView('stripe')
  }

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            key="checkout-backdrop"
            className="absolute inset-0 z-40 bg-black/70 backdrop-blur-sm"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={view === 'summary' && !loading ? handleReset : undefined}
          />

          <motion.div
            key="checkout-drawer"
            className={`absolute bottom-0 left-0 right-0 z-50 bg-zinc-900 rounded-t-3xl border-t border-white/10 overflow-hidden flex flex-col ${
              view === 'stripe' ? 'h-[92dvh]' : ''
            }`}
            initial={{ y: '100%' }}
            animate={{ y: 0 }}
            exit={{ y: '100%' }}
            transition={{ type: 'spring', damping: 28, stiffness: 320 }}
          >
            {/* Handle */}
            <div className="flex justify-center pt-3 pb-1 shrink-0">
              <div className="w-10 h-1 rounded-full bg-white/20" />
            </div>

            {/* ── VUE RÉCAPITULATIF ── */}
            {view === 'summary' && (
              <div className="px-6 pb-10 overflow-y-auto">
                {/* Header */}
                <div className="flex items-center justify-between mt-2 mb-6">
                  <div>
                    <h2 className="text-xl font-bold text-white">Finaliser l&apos;achat</h2>
                    <p className="text-sm text-zinc-400 mt-0.5">Paiement sécurisé · Stripe</p>
                  </div>
                  <motion.button
                    whileTap={{ scale: 0.9 }}
                    onClick={!loading ? handleReset : undefined}
                    disabled={loading}
                    className="w-8 h-8 rounded-full bg-white/5 border border-white/10 flex items-center justify-center text-zinc-400 hover:text-white transition-colors disabled:opacity-40"
                  >
                    <X size={16} />
                  </motion.button>
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
                          : 'Accès complet · 12 défis · ~2h de jeu'}
                      </p>
                    </div>
                    {/* Prix avec ou sans réduction */}
                    {promoStatus === 'valid' ? (
                      <div className="flex flex-col items-end shrink-0">
                        <span className="text-xs text-zinc-500 line-through">{price}</span>
                        <span className="font-black text-emerald-400">{finalPrice}</span>
                      </div>
                    ) : (
                      <span className="font-black text-white shrink-0">{price}</span>
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
                      <span className="font-bold text-white">{price}</span>
                    )}
                  </div>
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
                      /* Bouton retirer le code */
                      <motion.button
                        whileTap={{ scale: 0.95 }}
                        onClick={resetPromo}
                        disabled={loading}
                        className="flex items-center gap-1.5 bg-zinc-700 hover:bg-zinc-600 text-zinc-300 font-semibold px-3 py-2.5 rounded-xl text-xs transition-colors disabled:opacity-40 shrink-0"
                      >
                        <X size={12} /> Retirer
                      </motion.button>
                    ) : (
                      /* Bouton appliquer */
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

                  {/* Feedback */}
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

                {/* Note cadeau */}
                <AnimatePresence>
                  {isGift && (
                    <motion.div
                      initial={{ opacity: 0, height: 0, marginBottom: 0 }}
                      animate={{ opacity: 1, height: 'auto', marginBottom: 20 }}
                      exit={{ opacity: 0, height: 0, marginBottom: 0 }}
                      className="overflow-hidden"
                    >
                      <div className="bg-amber-500/8 border border-amber-500/20 rounded-xl px-4 py-3 text-xs text-amber-400/80 leading-relaxed">
                        Un code type <span className="font-mono font-bold text-amber-300">SION-XXXXXX</span> sera créé
                        après confirmation du paiement. Partagez-le à votre ami.
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>

                {/* Bouton payer */}
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

                <p className="text-center text-xs text-zinc-600 mt-3 flex items-center justify-center gap-1">
                  <ShoppingBag size={11} />
                  Carte · Apple Pay · Google Pay · PayPal · Powered by Stripe
                </p>
              </div>
            )}

            {/* ── VUE STRIPE EMBEDDED CHECKOUT ── */}
            {view === 'stripe' && clientSecret && (
              <div className="flex flex-col flex-1 min-h-0">
                <div className="flex items-center justify-between px-6 py-4 border-b border-white/5 shrink-0">
                  <p className="font-bold text-white text-sm">Paiement sécurisé</p>
                  <motion.button
                    whileTap={{ scale: 0.9 }}
                    onClick={handleReset}
                    className="w-8 h-8 rounded-full bg-white/5 border border-white/10 flex items-center justify-center text-zinc-400 hover:text-white transition-colors"
                  >
                    <X size={16} />
                  </motion.button>
                </div>
                <div className="flex-1 overflow-y-auto">
                  <EmbeddedCheckoutProvider
                    stripe={stripePromise}
                    options={{ clientSecret }}
                  >
                    <EmbeddedCheckout />
                  </EmbeddedCheckoutProvider>
                </div>
              </div>
            )}
          </motion.div>
        </>
      )}
    </AnimatePresence>
  )
}
