'use client'

import { useEffect, useState } from 'react'
import { motion } from 'framer-motion'
import { useRouter } from 'next/navigation'
import Image from 'next/image'
import Link from 'next/link'
import { MapPin, BookOpen, User, Mail } from 'lucide-react'
import { supabase } from '@/lib/supabase/client'
import { useGameStore } from '@/store/gameStore'
import { AuthOverlay } from '@/components/auth/AuthOverlay'
import { PwaInstallPrompt } from '@/components/ui/PwaInstallPrompt'

const stagger = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.1, delayChildren: 0.2 } },
}

const fadeUp = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.45, ease: [0.25, 0.1, 0.25, 1] } },
}

export default function HomePage() {
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

  const handleProfile = () => {
    if (!user) {
      setAuthOpen(true)
    } else {
      router.push('/dashboard')
    }
  }

  if (!mounted) return null

  return (
    <div className="flex justify-center min-h-dvh bg-zinc-950">
      <PwaInstallPrompt />

      <div className="relative w-full max-w-md h-dvh bg-zinc-950 overflow-hidden flex flex-col items-center justify-center px-6">

        {/* Ambient glows */}
        <div aria-hidden className="pointer-events-none absolute inset-0 overflow-hidden">
          <div className="absolute -top-32 -left-16 w-72 h-72 rounded-full bg-violet-600/15 blur-3xl" />
          <div className="absolute top-1/3 -right-24 w-64 h-64 rounded-full bg-pink-500/10 blur-3xl" />
          <div className="absolute bottom-1/4 -left-20 w-56 h-56 rounded-full bg-yellow-500/8 blur-3xl" />
        </div>

        <div className="relative z-10 w-full flex flex-col items-center gap-10">

          {/* Logo */}
          <motion.div
            initial={{ opacity: 0, scale: 0.92 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5, ease: [0.25, 0.1, 0.25, 1] }}
            className="flex flex-col items-center gap-3"
          >
            <Image
              src="/logo.png"
              alt="Black Out !"
              width={200}
              height={200}
              className="drop-shadow-[0_0_24px_rgba(236,72,153,0.45)]"
              priority
            />
            <p className="text-zinc-500 text-sm text-center leading-relaxed">
              Le rallye urbain qui détruit la dignité.
            </p>
          </motion.div>

          {/* 4 buttons */}
          <motion.div
            variants={stagger}
            initial="hidden"
            animate="visible"
            className="w-full space-y-3"
          >
            {/* Choisir ma ville — primary */}
            <motion.div variants={fadeUp} whileTap={{ scale: 0.97 }}>
              <Link
                href="/cities"
                className="w-full flex items-center gap-4 px-5 py-4 bg-gradient-to-r from-violet-600 to-violet-500 text-white font-bold rounded-2xl glow-violet text-left block"
              >
                <span className="w-10 h-10 rounded-xl bg-white/15 flex items-center justify-center shrink-0">
                  <MapPin size={20} />
                </span>
                <div>
                  <p className="text-base font-bold">Choisir ma ville</p>
                  <p className="text-xs font-normal text-violet-200/80 mt-0.5">Sion disponible · 29 CHF</p>
                </div>
              </Link>
            </motion.div>

            {/* Le concept */}
            <motion.div variants={fadeUp}>
              <Link
                href="/concept"
                className="w-full flex items-center gap-4 px-5 py-4 glass rounded-2xl hover:border-white/20 transition-all text-left block"
              >
                <span className="w-10 h-10 rounded-xl bg-pink-500/10 border border-pink-500/20 flex items-center justify-center shrink-0">
                  <BookOpen size={20} className="text-pink-400" />
                </span>
                <div>
                  <p className="text-base font-bold text-white">Le concept</p>
                  <p className="text-xs text-zinc-500 mt-0.5">Comment ça marche ?</p>
                </div>
              </Link>
            </motion.div>

            {/* Mon profil */}
            <motion.button
              variants={fadeUp}
              whileTap={{ scale: 0.97 }}
              onClick={handleProfile}
              className="w-full flex items-center gap-4 px-5 py-4 glass rounded-2xl hover:border-white/20 transition-all text-left"
            >
              <span className="w-10 h-10 rounded-xl bg-cyan-500/10 border border-cyan-500/20 flex items-center justify-center shrink-0">
                <User size={20} className="text-cyan-400" />
              </span>
              <div>
                <p className="text-base font-bold text-white">Mon profil</p>
                <p className="text-xs text-zinc-500 mt-0.5">
                  {user ? user.email : 'Connexion / inscription'}
                </p>
              </div>
            </motion.button>

            {/* Contact */}
            <motion.div variants={fadeUp}>
              <a
                href="mailto:contact@theblackoutgame.ch"
                className="w-full flex items-center gap-4 px-5 py-4 glass rounded-2xl hover:border-white/20 transition-all text-left block"
              >
                <span className="w-10 h-10 rounded-xl bg-amber-500/10 border border-amber-500/20 flex items-center justify-center shrink-0">
                  <Mail size={20} className="text-amber-400" />
                </span>
                <div>
                  <p className="text-base font-bold text-white">Contact</p>
                  <p className="text-xs text-zinc-500 mt-0.5">contact@theblackoutgame.ch</p>
                </div>
              </a>
            </motion.div>
          </motion.div>

          {/* Legal links */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.7 }}
            className="flex items-center gap-3 text-xs text-zinc-700"
          >
            <Link href="/cgv" className="hover:text-zinc-400 transition-colors">CGV</Link>
            <span>·</span>
            <Link href="/mentions-legales" className="hover:text-zinc-400 transition-colors">Mentions légales</Link>
          </motion.div>
        </div>

        {/* Auth overlay */}
        <AuthOverlay
          isOpen={authOpen}
          onClose={() => setAuthOpen(false)}
          onSuccess={() => {
            setAuthOpen(false)
            router.push('/dashboard')
          }}
        />
      </div>
    </div>
  )
}
