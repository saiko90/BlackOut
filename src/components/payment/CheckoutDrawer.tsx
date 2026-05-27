'use client'

import { useState } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import { X, CreditCard, Gift, Loader2, ShoppingBag, Zap } from 'lucide-react'
import { supabase } from '@/lib/supabase/client'
import { useGameStore } from '@/store/gameStore'
import { useToastStore } from '@/store/toastStore'

type CheckoutDrawerProps = {
  isOpen: boolean
  onClose: () => void
  onSuccess: () => void
  city?: string
  price?: string
}

function generateGiftCode(city: string): string {
  const chars = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789' // sans ambigus (0/O, 1/I)
  const random = Array.from({ length: 6 }, () =>
    chars[Math.floor(Math.random() * chars.length)]
  ).join('')
  return `${city.toUpperCase().slice(0, 4)}-${random}`
}

export function CheckoutDrawer({
  isOpen,
  onClose,
  onSuccess,
  city = 'Sion',
  price = '29 CHF',
}: CheckoutDrawerProps) {
  const { user } = useGameStore()
  const { addToast } = useToastStore()
  const [isGift, setIsGift] = useState(false)
  const [loading, setLoading] = useState(false)

  const handlePay = async () => {
    if (!user) return
    setLoading(true)

    // Mock : simule un délai de traitement paiement
    await new Promise((r) => setTimeout(r, 2000))

    try {
      const insertData: Record<string, unknown> = {
        user_id: user.id,
        city,
        is_used: false,
      }

      if (isGift) {
        insertData.gift_code = generateGiftCode(city)
      }

      const { error } = await supabase.from('tokens').insert(insertData)

      if (error) throw error

      addToast(
        isGift
          ? '🎁 Code cadeau généré ! Partagez-le avec votre ami.'
          : '✅ Pass activé ! Bon jeu à vous.',
        'success'
      )
      setIsGift(false)
      onSuccess()
      onClose()
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'Erreur lors du paiement'
      addToast(msg, 'error')
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
            onClick={!loading ? onClose : undefined}
          />

          {/* Drawer */}
          <motion.div
            key="checkout-drawer"
            className="absolute bottom-0 left-0 right-0 z-50 bg-zinc-900 rounded-t-3xl border-t border-white/10 overflow-hidden"
            initial={{ y: '100%' }}
            animate={{ y: 0 }}
            exit={{ y: '100%' }}
            transition={{ type: 'spring', damping: 28, stiffness: 320 }}
          >
            {/* Handle */}
            <div className="flex justify-center pt-3 pb-1">
              <div className="w-10 h-1 rounded-full bg-white/20" />
            </div>

            <div className="px-6 pb-10">
              {/* Header */}
              <div className="flex items-center justify-between mt-2 mb-6">
                <div>
                  <h2 className="text-xl font-bold text-white">Finaliser l'achat</h2>
                  <p className="text-sm text-zinc-400 mt-0.5">Paiement sécurisé</p>
                </div>
                <motion.button
                  whileTap={{ scale: 0.9 }}
                  onClick={!loading ? onClose : undefined}
                  className="w-8 h-8 rounded-full bg-white/5 border border-white/10 flex items-center justify-center text-zinc-400 hover:text-white transition-colors disabled:opacity-40"
                  disabled={loading}
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
                        ? 'Un code unique sera généré à offrir'
                        : 'Accès complet · 12 défis · ~2h de jeu'}
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

                {/* Toggle switch */}
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
                      Un code type <span className="font-mono font-bold text-amber-300">SION-XXXXXX</span> sera créé.
                      Partagez-le à votre ami — il l'entrera sur l'app pour récupérer son pass.
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
                  <><Loader2 size={18} className="animate-spin" /> Traitement…</>
                ) : isGift ? (
                  <><Gift size={18} /> Payer et générer le code → {price}</>
                ) : (
                  <><CreditCard size={18} /> Payer maintenant → {price}</>
                )}
              </motion.button>

              <p className="text-center text-xs text-zinc-600 mt-3 flex items-center justify-center gap-1">
                <ShoppingBag size={11} />
                Paiement simulé — aucune transaction réelle
              </p>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  )
}
