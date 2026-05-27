'use client'

import { useEffect, useState } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import { Skull, CheckCircle } from 'lucide-react'

const DECOY_PENALTIES = [
  'Fais 10 pompes en public',
  'Chante à voix haute dans la rue',
  'Demande un selfie à un inconnu',
  'Marche comme un robot 30 secondes',
  'Crie "Vive la raclette !" très fort',
  'Imite un animal pendant 1 minute',
  'Fais la danse du canard',
  'Récite l\'alphabet à l\'envers',
  'Parle avec un accent étranger',
  'Saute à cloche-pied sur 10m',
  'Dis "Merci beaucoup" en 5 langues',
  'Fais semblant d\'être au téléphone',
  'Chante la Marseillaise en chuchotant',
  'Mime une scène de film en silence',
  'Marche en regardant le ciel 20 secondes',
]

type RouletteModalProps = {
  isOpen: boolean
  penalty: string
  onAccept: () => void
}

export function RouletteModal({ isOpen, penalty, onAccept }: RouletteModalProps) {
  const [displayText, setDisplayText] = useState(DECOY_PENALTIES[0])
  const [spinning, setSpinning] = useState(false)
  const [landed, setLanded] = useState(false)

  // Relance le spin à chaque ouverture
  useEffect(() => {
    if (!isOpen) { setLanded(false); return }

    setSpinning(true)
    setLanded(false)
    setDisplayText(DECOY_PENALTIES[0])

    let count = 0
    // Phase 1: rapide (80ms × 18 = ~1.4s)
    // Phase 2: moyen (180ms × 5 = ~0.9s)
    // Phase 3: lent (350ms × 3 = ~1s) → atterrissage
    const schedule: number[] = [
      ...Array(18).fill(80),
      ...Array(5).fill(180),
      ...Array(3).fill(350),
      600, // dernière rotation lente avant atterrissage
    ]

    function tick() {
      if (count < schedule.length - 1) {
        setDisplayText(DECOY_PENALTIES[count % DECOY_PENALTIES.length])
        count++
        setTimeout(tick, schedule[count])
      } else {
        setDisplayText(penalty)
        setSpinning(false)
        setLanded(true)
      }
    }
    setTimeout(tick, schedule[0])
  }, [isOpen, penalty])

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          key="roulette-overlay"
          className="absolute inset-0 z-[60] flex flex-col bg-zinc-950"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
        >
          {/* Fond ambiant */}
          <div aria-hidden className="absolute inset-0 overflow-hidden">
            <motion.div
              animate={{ scale: [1, 1.2, 1], opacity: [0.15, 0.25, 0.15] }}
              transition={{ repeat: Infinity, duration: 2.5, ease: 'easeInOut' }}
              className="absolute top-1/3 left-1/2 -translate-x-1/2 -translate-y-1/2 w-80 h-80 rounded-full bg-red-600/20 blur-3xl"
            />
          </div>

          <div className="relative z-10 flex flex-col items-center justify-center flex-1 px-6 gap-8">

            {/* Icône */}
            <motion.div
              animate={spinning ? { rotate: [0, -5, 5, -5, 5, 0] } : {}}
              transition={{ repeat: Infinity, duration: 0.4 }}
            >
              <div className="w-20 h-20 rounded-2xl bg-red-600/20 border border-red-500/30 flex items-center justify-center">
                <Skull size={40} className="text-red-400" />
              </div>
            </motion.div>

            {/* Titre */}
            <div className="text-center">
              <p className="text-xs font-bold text-red-400 uppercase tracking-widest mb-2">
                Mauvaise réponse — Roulette de la Honte
              </p>
              <h2 className="text-2xl font-black text-white">Ton destin est scellé.</h2>
            </div>

            {/* Slot machine */}
            <div className="w-full max-w-xs">
              <div className="relative bg-zinc-900 border-2 border-red-600/40 rounded-2xl overflow-hidden h-28 flex items-center justify-center shadow-[0_0_40px_rgba(239,68,68,.2)]">

                {/* Scanline effect */}
                <div
                  aria-hidden
                  className="pointer-events-none absolute inset-0 bg-[repeating-linear-gradient(0deg,transparent,transparent_2px,rgba(0,0,0,.06)_2px,rgba(0,0,0,.06)_4px)]"
                />

                {/* Lignes de sélection */}
                <div aria-hidden className="absolute inset-x-0 top-0 h-8 bg-gradient-to-b from-zinc-900 to-transparent z-10" />
                <div aria-hidden className="absolute inset-x-0 bottom-0 h-8 bg-gradient-to-t from-zinc-900 to-transparent z-10" />
                <div aria-hidden className="absolute inset-x-4 top-1/2 -translate-y-1/2 h-10 border-t border-b border-red-500/40" />

                <AnimatePresence mode="wait">
                  <motion.p
                    key={displayText}
                    initial={{ y: spinning ? -24 : 0, opacity: spinning ? 0 : 1 }}
                    animate={{ y: 0, opacity: 1 }}
                    exit={{ y: 24, opacity: 0 }}
                    transition={{ duration: 0.08 }}
                    className={`relative z-20 text-center font-bold px-6 leading-snug ${
                      landed ? 'text-red-300 text-lg' : 'text-zinc-300 text-base'
                    }`}
                  >
                    {displayText}
                  </motion.p>
                </AnimatePresence>
              </div>

              {/* Indicateurs latéraux */}
              <div className="flex justify-between mt-2 px-1">
                <span className="text-xs text-zinc-700">◀</span>
                <span className="text-xs text-zinc-600 font-mono">
                  {spinning ? 'TIRAGE EN COURS...' : 'RÉSULTAT FINAL'}
                </span>
                <span className="text-xs text-zinc-700">▶</span>
              </div>
            </div>

            {/* Bouton accepter */}
            <AnimatePresence>
              {landed && (
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.4 }}
                  className="w-full max-w-xs space-y-3"
                >
                  <motion.button
                    whileTap={{ scale: 0.96 }}
                    onClick={onAccept}
                    className="w-full flex items-center justify-center gap-2 bg-red-600 hover:bg-red-500 text-white font-bold py-4 rounded-2xl text-base transition-colors shadow-[0_0_24px_rgba(239,68,68,.3)]"
                  >
                    <CheckCircle size={18} />
                    J'accepte mon sort, gage accompli
                  </motion.button>
                  <p className="text-center text-xs text-zinc-600">
                    Accomplis le gage pour retenter l'étape.
                  </p>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}
