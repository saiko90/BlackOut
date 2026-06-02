'use client'

import { useEffect, useState } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import { Smartphone, X, Share, MoreVertical } from 'lucide-react'

export function PwaInstallPrompt() {
  const [visible, setVisible]     = useState(false)
  const [showModal, setShowModal] = useState(false)

  useEffect(() => {
    // N'afficher QUE si l'app n'est pas déjà installée en mode standalone
    const isStandalone =
      window.matchMedia('(display-mode: standalone)').matches ||
      ('standalone' in window.navigator && (window.navigator as { standalone?: boolean }).standalone === true)

    if (!isStandalone) {
      // Délai pour ne pas bloquer le chargement initial
      const t = setTimeout(() => setVisible(true), 1200)
      return () => clearTimeout(t)
    }
  }, [])

  if (!visible) return null

  return (
    <>
      {/* ── Bannière sticky ── */}
      <AnimatePresence>
        {!showModal && (
          <motion.div
            key="banner"
            initial={{ y: -60, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: -60, opacity: 0 }}
            transition={{ type: 'spring', damping: 22, stiffness: 280 }}
            className="fixed top-3 inset-x-3 z-[150] max-w-md mx-auto"
          >
            <div className="flex items-center gap-3 bg-gradient-to-r from-pink-600/90 to-yellow-500/80 backdrop-blur-md border border-white/20 rounded-2xl px-4 py-3 shadow-xl">
              <span className="text-2xl shrink-0">📍</span>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-bold text-white leading-tight">
                  Jouez avec plus de confort !
                </p>
                <p className="text-xs text-white/70 leading-tight mt-0.5">
                  Aucun téléchargement requis — ajoutez simplement le jeu à votre écran d&apos;accueil.
                </p>
              </div>
              <div className="flex items-center gap-1.5 shrink-0">
                <motion.button
                  whileTap={{ scale: 0.9 }}
                  onClick={() => setShowModal(true)}
                  className="bg-white/20 hover:bg-white/30 text-white text-xs font-bold px-3 py-1.5 rounded-xl transition-colors flex items-center gap-1"
                >
                  <Smartphone size={12} />
                  Ajouter
                </motion.button>
                <motion.button
                  whileTap={{ scale: 0.9 }}
                  onClick={() => setVisible(false)}
                  className="text-white/70 hover:text-white p-1"
                >
                  <X size={16} />
                </motion.button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* ── Modal instructions ── */}
      <AnimatePresence>
        {showModal && (
          <>
            <motion.div
              key="modal-backdrop"
              className="fixed inset-0 z-[160] bg-black/70 backdrop-blur-sm"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setShowModal(false)}
            />
            <motion.div
              key="modal"
              className="fixed bottom-0 inset-x-0 z-[170] max-w-md mx-auto bg-zinc-900 rounded-t-3xl border-t border-white/10 p-6 pb-10"
              initial={{ y: '100%' }}
              animate={{ y: 0 }}
              exit={{ y: '100%' }}
              transition={{ type: 'spring', damping: 28, stiffness: 320 }}
            >
              {/* Handle */}
              <div className="flex justify-center mb-5">
                <div className="w-10 h-1 rounded-full bg-white/20" />
              </div>

              <div className="flex items-center justify-between mb-6">
                <h2 className="text-lg font-black text-white">Ajouter le raccourci 📲</h2>
                <motion.button
                  whileTap={{ scale: 0.9 }}
                  onClick={() => setShowModal(false)}
                  className="w-8 h-8 flex items-center justify-center rounded-full bg-white/5 text-zinc-400 hover:text-white transition-colors"
                >
                  <X size={15} />
                </motion.button>
              </div>

              <div className="space-y-5">

                {/* iOS */}
                <div className="glass rounded-2xl p-4 space-y-3">
                  <div className="flex items-center gap-2">
                    <span className="text-lg"></span>
                    <p className="font-bold text-white">Sur iPhone / iPad</p>
                  </div>
                  {[
                    { icon: <Share size={15} className="text-blue-400 shrink-0" />, text: 'Appuie sur l\'icône Partager (carré + flèche vers le haut)' },
                    { icon: <span className="text-sm shrink-0">⬇️</span>,           text: 'Fais défiler et appuie sur "Sur l\'écran d\'accueil"' },
                    { icon: <span className="text-sm shrink-0">✅</span>,           text: 'Confirme en appuyant sur "Ajouter"' },
                  ].map(({ icon, text }, i) => (
                    <div key={i} className="flex items-start gap-3">
                      <div className="w-6 h-6 flex items-center justify-center shrink-0 mt-0.5">{icon}</div>
                      <p className="text-sm text-zinc-300">{text}</p>
                    </div>
                  ))}
                </div>

                {/* Android */}
                <div className="glass rounded-2xl p-4 space-y-3">
                  <div className="flex items-center gap-2">
                    <span className="text-lg">🤖</span>
                    <p className="font-bold text-white">Sur Android</p>
                  </div>
                  {[
                    { icon: <MoreVertical size={15} className="text-green-400 shrink-0" />, text: 'Appuie sur le Menu (3 points en haut à droite)' },
                    { icon: <span className="text-sm shrink-0">➕</span>,                   text: 'Sélectionne "Ajouter à l\'écran d\'accueil"' },
                    { icon: <span className="text-sm shrink-0">✅</span>,                   text: 'Confirme — l\'icône apparaît sur ton bureau' },
                  ].map(({ icon, text }, i) => (
                    <div key={i} className="flex items-start gap-3">
                      <div className="w-6 h-6 flex items-center justify-center shrink-0 mt-0.5">{icon}</div>
                      <p className="text-sm text-zinc-300">{text}</p>
                    </div>
                  ))}
                </div>

                <p className="text-xs text-zinc-600 text-center">
                  Rien à télécharger — l&apos;icône s&apos;ouvre directement sur le jeu 🚀
                </p>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  )
}
