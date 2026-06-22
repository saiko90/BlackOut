'use client'

import { motion } from 'framer-motion'
import { ChevronRight } from 'lucide-react'
import type { Step } from '@/lib/game/sion-scenario'
import { TOTAL_STEPS } from '@/lib/game/scenarios'

type StepInterludeProps = {
  step: Step
  stepNumber: number   // 1-based
  onContinue: () => void
}

export function StepInterlude({ step, stepNumber, onContinue }: StepInterludeProps) {
  return (
    <div className="flex flex-col h-full px-6 justify-center gap-10 overflow-y-auto py-10">

      {/* Compteur d'étape */}
      <motion.p
        initial={{ opacity: 0, y: -12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, delay: 0.05 }}
        className="text-xs font-black text-pink-400 uppercase tracking-[0.3em] text-center"
      >
        Étape {stepNumber} sur {TOTAL_STEPS}
      </motion.p>

      {/* Titre de l'étape */}
      <motion.h2
        initial={{ opacity: 0, y: 24 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.15, ease: [0.25, 0.1, 0.25, 1] }}
        className="text-center text-5xl font-black text-white leading-[0.92] tracking-tighter"
      >
        {step.title}
      </motion.h2>

      {/* Texte narratif */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.6, delay: 0.35 }}
        className="glass rounded-2xl p-6 border border-pink-500/10 shadow-[0_0_30px_rgba(236,72,153,.06)]"
      >
        <p className="text-xl text-zinc-200 leading-relaxed font-medium text-center italic">
          {step.context}
        </p>
      </motion.div>

      {/* Bouton "Voir la mission" */}
      <motion.div
        initial={{ opacity: 0, y: 24 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.45, delay: 0.55 }}
      >
        <motion.button
          whileTap={{ scale: 0.97 }}
          whileHover={{ scale: 1.02, rotate: -0.5 }}
          onClick={onContinue}
          className="w-full flex items-center justify-center gap-2 bg-gradient-to-r from-violet-600 to-pink-600 text-white font-black py-5 rounded-2xl text-lg shadow-[0_0_28px_rgba(124,58,237,.35)] tracking-tight"
        >
          Voir la mission
          <ChevronRight size={22} />
        </motion.button>
      </motion.div>
    </div>
  )
}
