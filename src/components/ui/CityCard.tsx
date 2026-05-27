'use client'

import { motion } from 'framer-motion'
import { MapPin, Lock, Zap } from 'lucide-react'
import { cn } from '@/lib/utils'

type CityCardProps = {
  city: string
  country: string
  price: string
  isActive: boolean
  onBuy?: () => void
}

export function CityCard({ city, country, price, isActive, onBuy }: CityCardProps) {
  return (
    <motion.div
      whileTap={isActive ? { scale: 0.98 } : undefined}
      className={cn(
        'relative rounded-2xl p-5 overflow-hidden transition-all duration-300',
        isActive
          ? 'glass glow-violet border border-violet-500/30'
          : 'bg-zinc-900/40 border border-white/5 opacity-50'
      )}
    >
      {/* Ambient glow pour la carte active */}
      {isActive && (
        <div
          aria-hidden
          className="pointer-events-none absolute -top-16 -left-16 w-48 h-48 rounded-full bg-violet-600/20 blur-3xl"
        />
      )}

      <div className="relative z-10 flex items-center justify-between gap-4">
        {/* Infos ville */}
        <div className="flex items-center gap-3">
          <div
            className={cn(
              'flex items-center justify-center w-10 h-10 rounded-xl',
              isActive
                ? 'bg-violet-600/20 text-violet-400'
                : 'bg-white/5 text-zinc-500'
            )}
          >
            <MapPin size={18} />
          </div>
          <div>
            <p className={cn('font-bold text-lg leading-none', isActive ? 'text-white' : 'text-zinc-400')}>
              {city}
            </p>
            <p className="text-xs text-zinc-500 mt-0.5">{country}</p>
          </div>
        </div>

        {/* Droite : prix/badge */}
        {isActive ? (
          <div className="flex flex-col items-end gap-2">
            <div className="flex items-center gap-1 text-cyan-400 text-xs font-semibold">
              <Zap size={12} />
              <span>DISPONIBLE</span>
            </div>
            <motion.button
              onClick={onBuy}
              whileTap={{ scale: 0.94 }}
              whileHover={{ scale: 1.04 }}
              className="flex items-center gap-2 bg-violet-600 hover:bg-violet-500 text-white font-bold text-sm px-4 py-2 rounded-xl transition-colors glow-violet"
            >
              <span>{price}</span>
              <span className="text-violet-200">Jouer →</span>
            </motion.button>
          </div>
        ) : (
          <div className="flex flex-col items-end gap-1">
            <div className="flex items-center gap-1.5 bg-zinc-800 border border-zinc-700 text-zinc-400 text-xs font-bold px-3 py-1.5 rounded-full">
              <Lock size={10} />
              <span>COMING SOON</span>
            </div>
            <p className="text-xs text-zinc-600">{price}</p>
          </div>
        )}
      </div>

      {/* Barre de progression décorative (carte active uniquement) */}
      {isActive && (
        <div className="relative z-10 mt-4 pt-4 border-t border-white/5">
          <div className="flex justify-between text-xs text-zinc-500 mb-1.5">
            <span>Parties lancées</span>
            <span className="text-violet-400 font-medium">142 joueurs</span>
          </div>
          <div className="h-1 bg-white/5 rounded-full overflow-hidden">
            <motion.div
              className="h-full bg-gradient-to-r from-violet-600 to-cyan-500 rounded-full"
              initial={{ width: 0 }}
              animate={{ width: '68%' }}
              transition={{ duration: 1.2, ease: 'easeOut', delay: 0.4 }}
            />
          </div>
        </div>
      )}
    </motion.div>
  )
}
