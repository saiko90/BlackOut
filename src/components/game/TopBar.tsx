'use client'

import { useEffect, useState } from 'react'
import { motion } from 'framer-motion'
import { Timer, ChevronLeft } from 'lucide-react'
import { useRouter } from 'next/navigation'
import { TOTAL_STEPS } from '@/lib/game/sion-scenario'

type TopBarProps = {
  currentStep: number     // 1-based
  startTime: string       // ISO string
  city: string
  score: number
}

function formatElapsed(seconds: number): string {
  const h = Math.floor(seconds / 3600)
  const m = Math.floor((seconds % 3600) / 60)
  const s = seconds % 60
  if (h > 0) return `${h}:${String(m).padStart(2, '0')}:${String(s).padStart(2, '0')}`
  return `${String(m).padStart(2, '0')}:${String(s).padStart(2, '0')}`
}

export function TopBar({ currentStep, startTime, city, score }: TopBarProps) {
  const router = useRouter()
  const [elapsed, setElapsed] = useState(0)

  useEffect(() => {
    const origin = new Date(startTime).getTime()
    const update = () => setElapsed(Math.floor((Date.now() - origin) / 1000))
    update()
    const id = setInterval(update, 1000)
    return () => clearInterval(id)
  }, [startTime])

  const progress = ((currentStep - 1) / TOTAL_STEPS) * 100

  return (
    <div className="relative z-20 bg-zinc-950/90 backdrop-blur-md border-b border-white/5 px-4 pt-10 pb-3">
      {/* Ligne 1 : retour + ville + score */}
      <div className="flex items-center justify-between mb-3">
        <motion.button
          whileTap={{ scale: 0.9 }}
          onClick={() => router.push('/dashboard')}
          className="flex items-center gap-1 text-zinc-500 hover:text-zinc-300 transition-colors text-xs"
        >
          <ChevronLeft size={16} />
          <span>{city}</span>
        </motion.button>

        <div className="flex items-center gap-2">
          {/* Chrono */}
          <div className="flex items-center gap-1.5 bg-zinc-900 border border-white/8 rounded-lg px-2.5 py-1">
            <Timer size={12} className="text-cyan-400" />
            <span className="font-mono text-xs font-bold text-cyan-400 tabular-nums">
              {formatElapsed(elapsed)}
            </span>
          </div>

          {/* Score */}
          <div className="bg-violet-500/15 border border-violet-500/20 rounded-lg px-2.5 py-1">
            <span className="text-xs font-bold text-violet-400">{score} pts</span>
          </div>
        </div>
      </div>

      {/* Ligne 2 : étape + label */}
      <div className="flex items-center justify-between mb-2.5">
        <p className="text-xs font-semibold text-zinc-400">
          Étape{' '}
          <span className="text-white font-black">{currentStep}</span>
          <span className="text-zinc-600"> / {TOTAL_STEPS}</span>
        </p>
        <p className="text-xs text-zinc-600">{Math.round(progress)}% accompli</p>
      </div>

      {/* Barre de progression */}
      <div className="h-1.5 bg-zinc-800 rounded-full overflow-hidden">
        <motion.div
          className="h-full rounded-full bg-gradient-to-r from-violet-600 via-violet-400 to-cyan-400"
          initial={{ width: 0 }}
          animate={{ width: `${progress}%` }}
          transition={{ duration: 0.6, ease: 'easeOut' }}
        />
      </div>
    </div>
  )
}
