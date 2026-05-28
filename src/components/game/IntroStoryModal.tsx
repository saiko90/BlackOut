'use client'

import { AnimatePresence, motion } from 'framer-motion'
import { Skull } from 'lucide-react'

type IntroStoryModalProps = {
  isOpen: boolean
  onStart: () => void
}

export function IntroStoryModal({ isOpen, onStart }: IntroStoryModalProps) {
  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          key="intro-modal"
          className="absolute inset-0 z-[80] flex flex-col bg-zinc-950"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0, scale: 0.97 }}
          transition={{ duration: 0.35 }}
        >
          {/* Ambiances */}
          <div aria-hidden className="pointer-events-none absolute inset-0 overflow-hidden">
            <div className="absolute -top-20 -left-10 w-72 h-72 rounded-full bg-pink-500/15 blur-3xl" />
            <div className="absolute bottom-20 -right-10 w-64 h-64 rounded-full bg-yellow-500/10 blur-3xl" />
            <motion.div
              animate={{ scale: [1, 1.15, 1], opacity: [0.1, 0.18, 0.1] }}
              transition={{ repeat: Infinity, duration: 3.5, ease: 'easeInOut' }}
              className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 rounded-full bg-pink-600/10 blur-3xl"
            />
          </div>

          <div className="relative z-10 flex flex-col flex-1 overflow-y-auto px-6 py-16 gap-8 justify-center">

            {/* Icône */}
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ type: 'spring', delay: 0.15, damping: 14, stiffness: 200 }}
              className="flex justify-center"
            >
              <div className="w-20 h-20 rounded-2xl bg-pink-600/20 border border-pink-500/30 flex items-center justify-center shadow-[0_0_40px_rgba(236,72,153,.25)]">
                <Skull size={40} className="text-pink-400" />
              </div>
            </motion.div>

            {/* Lieu + titre */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              className="text-center"
            >
              <p className="text-xs font-black text-pink-400 uppercase tracking-[0.3em] mb-4">
                Sion · 14h00
              </p>
              <h1 className="text-5xl font-black text-white leading-[0.9] tracking-tighter">
                UN MAL
                <br />
                DE CRÂNE
                <br />
                <span className="text-pink-400 text-glow-pink">ÉPOU–</span>
                <br />
                <span className="text-pink-400 text-glow-pink">VANTABLE.</span>
              </h1>
            </motion.div>

            {/* Narration */}
            <motion.div
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5 }}
              className="glass rounded-2xl p-5 space-y-3 border border-pink-500/10"
            >
              <p className="text-zinc-300 text-sm leading-relaxed">
                Votre dernier souvenir ?{' '}
                <strong className="text-white">Une tournée de trop à la Place du Midi.</strong>
              </p>
              <p className="text-zinc-300 text-sm leading-relaxed">
                Un inconnu a disparu{' '}
                <strong className="text-pink-400">avec les clés de la voiture…</strong>
              </p>
              <p className="text-zinc-300 text-sm leading-relaxed">
                Pour retrouver la mémoire et vos clés, vous allez devoir{' '}
                <strong className="text-white">retracer votre soirée.</strong>
              </p>
              <p className="text-yellow-400 text-sm font-bold leading-relaxed">
                ⚠️ Attention : l&apos;inconnu qui a vos clés exige des preuves visuelles.
              </p>
            </motion.div>

            {/* CTA */}
            <motion.div
              initial={{ opacity: 0, y: 24 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.7 }}
            >
              <motion.button
                whileTap={{ scale: 0.96 }}
                whileHover={{ scale: 1.02, rotate: -1 }}
                onClick={onStart}
                className="w-full flex items-center justify-center gap-2 bg-gradient-to-r from-pink-600 to-yellow-500 text-white font-black py-5 rounded-2xl text-xl shadow-[0_0_30px_rgba(236,72,153,.4)] tracking-tight"
              >
                💀 Commencer le carnage
              </motion.button>
            </motion.div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}
