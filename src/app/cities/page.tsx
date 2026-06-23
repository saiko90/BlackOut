'use client'

import { useEffect, useState } from 'react'
import { motion } from 'framer-motion'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { ArrowLeft, MapPin, Lock } from 'lucide-react'
import { supabase } from '@/lib/supabase/client'
import { useGameStore } from '@/store/gameStore'
import { AuthOverlay } from '@/components/auth/AuthOverlay'
import { CITIES } from '@/lib/cities'
import { PromoBanner } from '@/components/ui/PromoBanner'
import { daysLeftInMonth } from '@/lib/utils'

const stagger = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.08, delayChildren: 0.15 } },
}

const fadeUp = {
  hidden: { opacity: 0, y: 16 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.4, ease: [0.25, 0.1, 0.25, 1] } },
}

export default function CitiesPage() {
  const router = useRouter()
  const { user, setUser } = useGameStore()
  const [authOpen, setAuthOpen] = useState(false)
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
    supabase.auth.getSession().then(({ data: { session } }) => {
      setUser(session?.user ?? null)
    })
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null)
    })
    return () => subscription.unsubscribe()
  }, [setUser])

  const [pendingCity, setPendingCity] = useState<string | null>(null)

  /* ── Reprend la sélection en attente après un retour de connexion OAuth (Google) ── */
  useEffect(() => {
    if (!user) return
    const pending = new URLSearchParams(window.location.search).get('pendingCity')
    if (pending) router.replace(`/checkout?city=${encodeURIComponent(pending)}`)
  }, [user, router])

  const handleSelectCity = (cityName: string) => {
    if (!user) {
      setPendingCity(cityName)
      setAuthOpen(true)
    } else {
      router.push(`/checkout?city=${encodeURIComponent(cityName)}`)
    }
  }

  if (!mounted) return null

  return (
    <div className="flex justify-center min-h-dvh bg-zinc-950">
      <div className="relative w-full max-w-md min-h-dvh bg-zinc-950 flex flex-col overflow-hidden">

        <PromoBanner />

        {/* Ambient glows */}
        <div aria-hidden className="pointer-events-none absolute inset-0 overflow-hidden">
          <div className="absolute -top-24 -left-16 w-72 h-72 rounded-full bg-violet-600/12 blur-3xl" />
          <div className="absolute top-1/2 -right-20 w-64 h-64 rounded-full bg-pink-500/8 blur-3xl" />
        </div>

        {/* Header */}
        <div className="relative z-10 flex items-center px-4 pt-12 pb-6">
          <Link
            href="/"
            className="flex items-center gap-1.5 text-zinc-500 hover:text-zinc-300 transition-colors text-sm font-medium"
          >
            <ArrowLeft size={16} />
            Retour
          </Link>
        </div>

        {/* Title */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.45 }}
          className="relative z-10 px-6 pb-8 text-center"
        >
          <h1 className="text-3xl font-black text-white tracking-tight drop-shadow-[0_0_20px_rgba(139,92,246,0.4)]">
            Choisis ta zone de jeu
          </h1>
          <p className="text-zinc-500 text-sm mt-2">
            Une ville, une nuit, des défis absurdes.
          </p>
          <p className="text-zinc-600 text-xs mt-1">
            29 CHF pour toute l&apos;équipe (jusqu&apos;à 6 pers.)
          </p>
          <p className="text-amber-400/80 text-xs mt-3 font-semibold">
            🏆 Plus que {daysLeftInMonth()} jours pour participer au tirage du mois (50.- Migros)
          </p>
        </motion.div>

        {/* City cards */}
        <motion.div
          variants={stagger}
          initial="hidden"
          animate="visible"
          className="relative z-10 flex flex-col gap-3 px-4 pb-12"
        >
          {CITIES.map((city) =>
            city.isActive ? (
              <motion.button
                key={city.name}
                variants={fadeUp}
                whileTap={{ scale: 0.98 }}
                onClick={() => handleSelectCity(city.name)}
                className="w-full text-left flex items-center gap-4 px-5 py-4 rounded-2xl border border-violet-500/40 bg-violet-500/8 hover:bg-violet-500/14 hover:border-violet-500/60 transition-all group"
              >
                <span className="text-3xl">{city.emoji}</span>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 flex-wrap">
                    <span className="text-lg font-black text-white">{city.name}</span>
                    <span className="inline-flex items-center gap-1 bg-emerald-500/15 border border-emerald-500/30 text-emerald-400 text-[10px] font-bold px-2 py-0.5 rounded-full">
                      <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                      Disponible
                    </span>
                  </div>
                  <p className="text-xs text-zinc-400 mt-0.5">{city.region} · {city.country}</p>
                </div>
                <div className="text-right shrink-0">
                  <p className="text-base font-black text-white">{city.price}<span className="text-[10px] font-semibold text-zinc-500">/équipe</span></p>
                  <p className="text-[10px] text-violet-400 font-semibold mt-0.5 group-hover:text-violet-300 transition-colors">
                    Jouer →
                  </p>
                </div>
              </motion.button>
            ) : (
              <motion.div
                key={city.name}
                variants={fadeUp}
                className="w-full flex items-center gap-4 px-5 py-4 rounded-2xl border border-white/6 bg-white/2 opacity-50 cursor-not-allowed select-none"
              >
                <span className="text-3xl grayscale">{city.emoji}</span>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 flex-wrap">
                    <span className="text-lg font-black text-zinc-400">{city.name}</span>
                    <span className="inline-flex items-center gap-1 bg-zinc-700/40 border border-zinc-600/40 text-zinc-500 text-[10px] font-bold px-2 py-0.5 rounded-full">
                      <Lock size={8} />
                      Prochainement
                    </span>
                  </div>
                  <p className="text-xs text-zinc-600 mt-0.5">{city.region} · {city.country}</p>
                </div>
                <div className="text-right shrink-0">
                  <p className="text-base font-black text-zinc-600">{city.price}<span className="text-[10px] font-semibold text-zinc-700">/équipe</span></p>
                </div>
              </motion.div>
            )
          )}
        </motion.div>

        {/* Auth overlay */}
        <AuthOverlay
          isOpen={authOpen}
          onClose={() => setAuthOpen(false)}
          onSuccess={() => {
            setAuthOpen(false)
            router.push(pendingCity ? `/checkout?city=${encodeURIComponent(pendingCity)}` : '/dashboard')
          }}
          oauthRedirectPath={pendingCity ? `/cities?pendingCity=${encodeURIComponent(pendingCity)}` : '/cities'}
        />
      </div>
    </div>
  )
}
