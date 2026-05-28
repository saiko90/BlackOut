'use client'

import { useState } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import { X, CreditCard, Gift, Loader2, ShoppingBag, Zap } from 'lucide-react'
import { loadStripe } from '@stripe/stripe-js'
import { EmbeddedCheckoutProvider, EmbeddedCheckout } from '@stripe/react-stripe-js'
import { useGameStore } from '@/store/gameStore'
import { useToastStore } from '@/store/toastStore'
import { createCheckoutSession } from '@/app/actions/stripe'

// Instancié une seule fois hors du composant
const stripePromise = loadStripe(process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY!)

type DrawerView = 'summary' | 'stripe'

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
  const { user }    = useGameStore()
  const { addToast } = useToastStore()
  const [isGift, setIsGift]         = useState(false)
  const [loading, setLoading]       = useState(false)
  const [view, setView]             = useState<DrawerView>('summary')
  const [clientSecret, setClientSecret] = useState<string | null>(null)

  const handleReset = () => {
    setView('summary')
    setClientSecret(null)
    setIsGift(false)
    onClose()
  }

  /* ── Lance la session Stripe Embedded Checkout ── */
  const handlePay = async () => {
    if (!user) {
      addToast('Connecte-toi pour continuer.', 'error')
      return
    }
    setLoading(true)
    try {
      const { clientSecret: secret } = await createCheckoutSession(user.id, isGift)
      if (!secret) throw new Error('Impossible d\'obtenir la session de paiement.')
      setClientSecret(secret)
      setView('stripe')
    } catch (err: unknown) {
      addToast(err instanceof Error ? err.message : 'Erreur Stripe', 'error')
    } finally {
      setLoading(false)
    }
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

          {/* Drawer — grandit en mode stripe pour accueillir le formulaire Stripe */}
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
                    <h2 className="text-xl font-bold text-white">Finaliser l'achat</h2>
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
                <div className="glass rounded-2xl p-4 mb-5">
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
                          : 'Accès complet · 10 défis · ~2h de jeu'}
                      </p>
                    </div>
                    <span className="font-black text-white">{price}</span>
                  </div>

                  <div className="border-t border-white/5 pt-3 flex justify-between text-sm">
                    <span className="text-zinc-500">Total</span>
                    <span className="font-bold text-white">{price}</span>
                  </div>
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
                      <p className="text-sm font-semibold text-white">C'est pour offrir en cadeau</p>
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
                    <><Gift size={18} /> Payer et générer le code → {price}</>
                  ) : (
                    <><CreditCard size={18} /> Payer maintenant → {price}</>
                  )}
                </motion.button>

                <p className="text-center text-xs text-zinc-600 mt-3 flex items-center justify-center gap-1">
                  <ShoppingBag size={11} />
                  Carte bancaire et TWINT acceptés · Powered by Stripe
                </p>
              </div>
            )}

            {/* ── VUE STRIPE EMBEDDED CHECKOUT ── */}
            {view === 'stripe' && clientSecret && (
              <div className="flex flex-col flex-1 min-h-0">
                {/* Header minimal */}
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

                {/* Formulaire Stripe — défile à l'intérieur */}
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
