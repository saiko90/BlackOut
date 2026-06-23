'use client'

import { useState } from 'react'
import { motion, useMotionValue, useTransform } from 'framer-motion'
import { Zap, Gift, Share2, ShoppingBag, Copy, Check } from 'lucide-react'
import { cn } from '@/lib/utils'
import { useToastStore } from '@/store/toastStore'
import type { Token } from '@/lib/supabase/types'
import { getCity } from '@/lib/cities'

type TokenCardProps =
  | { variant: 'empty'; onBuy: () => void }
  | { variant: 'token'; token: Token & { gift_code?: string | null }; onActivate: () => void }

export function TokenCard(props: TokenCardProps) {
  const { addToast } = useToastStore()
  const [copied, setCopied] = useState(false)

  // Micro tilt on hover (carte premium)
  const x = useMotionValue(0)
  const y = useMotionValue(0)
  const rotateX = useTransform(y, [-50, 50], [4, -4])
  const rotateY = useTransform(x, [-80, 80], [-4, 4])

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const rect = e.currentTarget.getBoundingClientRect()
    x.set(e.clientX - rect.left - rect.width / 2)
    y.set(e.clientY - rect.top - rect.height / 2)
  }
  const handleMouseLeave = () => { x.set(0); y.set(0) }

  const handleCopyGiftCode = async (code: string) => {
    const text = `🎁 Ton code Black Out ! : ${code}\nActive-le sur l'app pour jouer !`
    await navigator.clipboard.writeText(text)
    setCopied(true)
    addToast('Code copié dans le presse-papier !', 'success')
    setTimeout(() => setCopied(false), 2500)
  }

  /* ── État vide ── */
  if (props.variant === 'empty') {
    return (
      <motion.div
        whileTap={{ scale: 0.98 }}
        onClick={props.onBuy}
        className="relative rounded-2xl border-2 border-dashed border-white/10 hover:border-violet-500/40 transition-colors duration-300 p-6 cursor-pointer group"
      >
        <div className="flex flex-col items-center gap-3 py-4">
          <div className="w-12 h-12 rounded-xl bg-violet-600/10 border border-violet-500/20 flex items-center justify-center group-hover:bg-violet-600/20 transition-colors">
            <ShoppingBag size={22} className="text-violet-400" />
          </div>
          <div className="text-center">
            <p className="text-sm font-semibold text-zinc-300">Aucun pass en inventaire</p>
            <p className="text-xs text-zinc-600 mt-1">Lance ta prochaine aventure</p>
          </div>
          <motion.div
            whileHover={{ scale: 1.03 }}
            className="flex items-center gap-2 bg-violet-600 text-white font-bold text-sm px-5 py-2.5 rounded-xl glow-violet mt-1"
          >
            <ShoppingBag size={15} />
            Acheter un Pass · 29 CHF
          </motion.div>
        </div>
      </motion.div>
    )
  }

  /* ── Token classique ou cadeau ── */
  const { token, onActivate } = props
  const isGift = !!token.gift_code
  const cityRegion = getCity(token.city)?.region

  return (
    <motion.div
      style={{ rotateX, rotateY, transformPerspective: 800 }}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      className={cn(
        'relative rounded-2xl overflow-hidden p-5 cursor-default',
        isGift
          ? 'bg-gradient-to-br from-amber-950/60 via-zinc-900/80 to-zinc-900 border border-amber-500/30'
          : 'bg-gradient-to-br from-violet-950/60 via-zinc-900/80 to-zinc-900 border border-violet-500/30'
      )}
    >
      {/* Shimmer holographique */}
      <motion.div
        aria-hidden
        animate={{ x: ['-100%', '200%'] }}
        transition={{ repeat: Infinity, duration: 3.5, ease: 'linear', repeatDelay: 2 }}
        className="pointer-events-none absolute inset-y-0 w-1/3 bg-gradient-to-r from-transparent via-white/5 to-transparent skew-x-12"
      />

      {/* Glow ambiant */}
      <div
        aria-hidden
        className={cn(
          'pointer-events-none absolute -top-10 -right-10 w-40 h-40 rounded-full blur-3xl',
          isGift ? 'bg-amber-500/15' : 'bg-violet-600/15'
        )}
      />

      <div className="relative z-10">
        {/* Badge type */}
        <div className="flex items-center justify-between mb-4">
          <span className={cn(
            'inline-flex items-center gap-1.5 text-xs font-bold px-2.5 py-1 rounded-full',
            isGift
              ? 'bg-amber-500/15 text-amber-400 border border-amber-500/20'
              : 'bg-violet-500/15 text-violet-400 border border-violet-500/20'
          )}>
            {isGift ? <Gift size={11} /> : <Zap size={11} />}
            {isGift ? 'CADEAU' : 'PASS STANDARD'}
          </span>
          <span className="text-xs text-zinc-500">#{token.id.slice(0, 8).toUpperCase()}</span>
        </div>

        {/* Titre */}
        <div className="mb-1">
          <p className="text-xl font-black text-white tracking-tight">PASS BLACK OUT !</p>
          <p className="text-sm text-zinc-400 mt-0.5">
            {token.city} · {cityRegion ? `${cityRegion}, Suisse` : 'Suisse'}
          </p>
        </div>

        {/* Séparateur tirets */}
        <div className="border-t border-dashed border-white/10 my-4" />

        {/* Gift code display */}
        {isGift && token.gift_code && (
          <div className="mb-4 bg-amber-500/10 border border-amber-500/20 rounded-xl px-3 py-2.5">
            <p className="text-xs text-amber-500/70 mb-1 font-medium">CODE CADEAU</p>
            <p className="font-mono font-bold text-amber-300 tracking-widest text-lg">
              {token.gift_code}
            </p>
          </div>
        )}

        {/* Infos bas */}
        <div className="flex items-center justify-between text-xs text-zinc-500 mb-4">
          <span>Acheté le {new Date(token.created_at).toLocaleDateString('fr-CH')}</span>
          <span className="text-emerald-400 font-semibold flex items-center gap-1">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 inline-block" />
            VALIDE
          </span>
        </div>

        {/* CTA */}
        {isGift && token.gift_code ? (
          <motion.button
            whileTap={{ scale: 0.96 }}
            onClick={() => handleCopyGiftCode(token.gift_code!)}
            className={cn(
              'w-full flex items-center justify-center gap-2 font-bold py-3.5 rounded-xl text-sm transition-all',
              copied
                ? 'bg-emerald-600/80 text-white border border-emerald-500/30'
                : 'bg-amber-500/20 hover:bg-amber-500/30 text-amber-300 border border-amber-500/30'
            )}
          >
            {copied
              ? <><Check size={16} /> Copié !</>
              : <><Share2 size={16} /> Copier le lien à offrir</>
            }
          </motion.button>
        ) : (
          <motion.button
            whileTap={{ scale: 0.96 }}
            whileHover={{ scale: 1.01 }}
            onClick={onActivate}
            className="w-full flex items-center justify-center gap-2 bg-gradient-to-r from-violet-600 to-violet-500 hover:from-violet-500 hover:to-violet-400 text-white font-bold py-3.5 rounded-xl text-sm glow-violet transition-all"
          >
            <Zap size={16} />
            Activer et Jouer →
          </motion.button>
        )}
      </div>
    </motion.div>
  )
}
