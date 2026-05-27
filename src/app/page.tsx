'use client'

import { useEffect, useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { useRouter } from 'next/navigation'
import { Zap, ChevronRight, LogOut, User } from 'lucide-react'
import { supabase } from '@/lib/supabase/client'
import { useGameStore } from '@/store/gameStore'
import { CityCard } from '@/components/ui/CityCard'
import { AuthOverlay } from '@/components/auth/AuthOverlay'

/* ── Variants Framer Motion ── */
const fadeUp = {
  hidden: { opacity: 0, y: 24 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.5, ease: [0.25, 0.1, 0.25, 1] } },
}

const stagger = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.12, delayChildren: 0.1 } },
}

const CITIES = [
  { city: 'Sion',     country: 'Valais, Suisse',   price: '29 CHF', isActive: true },
  { city: 'Lausanne', country: 'Vaud, Suisse',      price: '29 CHF', isActive: false },
  { city: 'Genève',   country: 'Genève, Suisse',    price: '29 CHF', isActive: false },
]

export default function HomePage() {
  const router = useRouter()
  const { user, setUser } = useGameStore()
  const [authOpen, setAuthOpen] = useState(false)
  const [mounted, setMounted] = useState(false)

  /* Écoute auth Supabase en temps réel */
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

  const handleSignOut = async () => {
    await supabase.auth.signOut()
  }

  const handleBuy = () => {
    if (!user) {
      setAuthOpen(true)
    } else {
      router.push('/dashboard')
    }
  }

  if (!mounted) return null

  return (
    <div className="flex justify-center min-h-dvh bg-zinc-950">
      <div className="relative w-full max-w-md h-dvh bg-zinc-950 overflow-hidden flex flex-col shadow-2xl">

        {/* Ambiances lumineuses */}
        <div aria-hidden className="pointer-events-none absolute inset-0 overflow-hidden">
          <div className="absolute -top-32 -left-16 w-72 h-72 rounded-full bg-violet-600/15 blur-3xl" />
          <div className="absolute top-1/3 -right-24 w-64 h-64 rounded-full bg-cyan-500/10 blur-3xl" />
          <div className="absolute bottom-1/4 -left-20 w-56 h-56 rounded-full bg-violet-800/12 blur-3xl" />
        </div>

        {/* Contenu scrollable */}
        <div className="relative z-10 flex flex-col flex-1 overflow-y-auto pb-36">

          {/* ── HEADER ── */}
          <header className="px-6 pt-14 pb-6">
            <motion.div variants={stagger} initial="hidden" animate="visible" className="flex flex-col">

              {/* Badge live */}
              <motion.div variants={fadeUp} className="mb-4">
                <span className="inline-flex items-center gap-1.5 bg-cyan-500/10 border border-cyan-500/20 text-cyan-400 text-xs font-semibold px-3 py-1.5 rounded-full">
                  <span className="w-1.5 h-1.5 rounded-full bg-cyan-400 animate-pulse" />
                  GAME IS ON — SION
                </span>
              </motion.div>

              {/* Titre */}
              <motion.div variants={fadeUp}>
                <h1 className="font-black leading-none tracking-tighter text-white">
                  <span className="block text-[4.5rem] text-glow-violet">BLACK</span>
                  <span className="block text-[4.5rem] bg-gradient-to-r from-violet-400 via-cyan-300 to-violet-400 bg-clip-text text-transparent">
                    OUT !
                  </span>
                </h1>
              </motion.div>

              {/* Tagline */}
              <motion.p variants={fadeUp} className="mt-4 text-zinc-400 text-base leading-relaxed max-w-[280px]">
                Retrouvez la mémoire.{' '}
                <span className="text-zinc-300 font-medium">Détruisez votre dignité.</span>
                <br />Le premier rallye urbain 100% interactif.
              </motion.p>

              {/* Stats */}
              <motion.div variants={fadeUp} className="flex gap-6 mt-6">
                {[
                  { value: '142', label: 'Joueurs' },
                  { value: '12',  label: 'Défis' },
                  { value: '~2h', label: 'Durée' },
                ].map(({ value, label }) => (
                  <div key={label} className="flex flex-col">
                    <span className="text-xl font-black text-white">{value}</span>
                    <span className="text-xs text-zinc-500 mt-0.5">{label}</span>
                  </div>
                ))}
              </motion.div>
            </motion.div>
          </header>

          {/* Séparateur */}
          <div className="mx-6 h-px bg-gradient-to-r from-transparent via-white/10 to-transparent mb-6" />

          {/* ── SÉLECTION DE VILLE ── */}
          <section className="px-4">
            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.55 }}
              className="text-xs font-semibold text-zinc-500 uppercase tracking-widest px-2 mb-4"
            >
              Choisis ta ville
            </motion.p>

            <motion.div
              variants={stagger}
              initial="hidden"
              animate="visible"
              className="space-y-3"
            >
              {CITIES.map(({ city, country, price, isActive }) => (
                <motion.div key={city} variants={fadeUp}>
                  <CityCard
                    city={city}
                    country={country}
                    price={price}
                    isActive={isActive}
                    onBuy={isActive ? handleBuy : undefined}
                  />
                </motion.div>
              ))}
            </motion.div>
          </section>

          {/* ── PITCH ── */}
          <motion.section
            variants={stagger}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.3 }}
            className="mx-4 mt-8 glass rounded-2xl p-5 space-y-4"
          >
            <motion.p variants={fadeUp} className="text-xs font-bold text-zinc-400 uppercase tracking-widest">
              Comment ça marche ?
            </motion.p>
            {[
              { icon: '🎟️', title: 'Tu achètes un jeton',      desc: 'Accès complet à une partie dans ta ville.' },
              { icon: '🗺️', title: 'Tu explores la ville',     desc: 'Énigmes géolocalisées, défis absurdes en équipe.' },
              { icon: '🎰', title: 'La Roulette de la Honte',  desc: 'Un défi final aléatoire. Bonne chance.' },
              { icon: '🎬', title: 'Ton film souvenir',        desc: 'Vidéo générée avec tes médias du jeu.' },
            ].map(({ icon, title, desc }) => (
              <motion.div key={title} variants={fadeUp} className="flex gap-3">
                <span className="text-xl mt-0.5">{icon}</span>
                <div>
                  <p className="text-sm font-semibold text-white">{title}</p>
                  <p className="text-xs text-zinc-500 mt-0.5">{desc}</p>
                </div>
              </motion.div>
            ))}
          </motion.section>
        </div>

        {/* ── STICKY BOTTOM BAR ── */}
        <div className="absolute bottom-0 left-0 right-0 z-20 px-4 pb-8 pt-4 bg-gradient-to-t from-zinc-950 via-zinc-950/95 to-transparent">
          <AnimatePresence mode="wait">
            {user ? (
              <motion.div
                key="logged-in"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                className="space-y-2.5"
              >
                <div className="flex items-center justify-between px-1">
                  <div className="flex items-center gap-2 text-sm text-zinc-400">
                    <User size={14} />
                    <span className="truncate max-w-[200px] text-xs">{user.email}</span>
                  </div>
                  <motion.button
                    whileTap={{ scale: 0.9 }}
                    onClick={handleSignOut}
                    className="flex items-center gap-1 text-xs text-zinc-500 hover:text-red-400 transition-colors"
                  >
                    <LogOut size={12} />
                    Déconnexion
                  </motion.button>
                </div>
                <motion.button
                  whileTap={{ scale: 0.96 }}
                  whileHover={{ scale: 1.01 }}
                  onClick={() => router.push('/dashboard')}
                  className="w-full flex items-center justify-center gap-2 bg-gradient-to-r from-violet-600 to-violet-500 text-white font-bold py-4 rounded-2xl glow-violet text-base"
                >
                  <Zap size={18} />
                  Accéder à mon tableau de bord
                  <ChevronRight size={18} />
                </motion.button>
              </motion.div>
            ) : (
              <motion.div
                key="logged-out"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
              >
                <motion.button
                  whileTap={{ scale: 0.96 }}
                  whileHover={{ scale: 1.01 }}
                  onClick={() => setAuthOpen(true)}
                  className="relative w-full flex items-center justify-center gap-2 bg-gradient-to-r from-violet-600 to-violet-500 text-white font-bold py-4 rounded-2xl text-base overflow-hidden"
                >
                  <span aria-hidden className="absolute inset-0 rounded-2xl animate-pulse bg-violet-500/30" />
                  <span className="relative flex items-center gap-2">
                    <Zap size={18} />
                    Créer un compte pour jouer
                    <ChevronRight size={18} />
                  </span>
                </motion.button>
                <p className="text-center text-xs text-zinc-600 mt-2">
                  Déjà un compte ?{' '}
                  <button
                    onClick={() => setAuthOpen(true)}
                    className="text-violet-400 hover:text-violet-300 transition-colors"
                  >
                    Se connecter
                  </button>
                </p>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Auth Bottom Sheet */}
        <AuthOverlay
          isOpen={authOpen}
          onClose={() => setAuthOpen(false)}
          onSuccess={() => setAuthOpen(false)}
        />
      </div>
    </div>
  )
}
