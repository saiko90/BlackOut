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
import { PromoBanner } from '@/components/ui/PromoBanner'
import { TestimonialsCarousel } from '@/components/ui/TestimonialsCarousel'

const stagger = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.1, delayChildren: 0.2 } },
}

const fadeUp = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.45, ease: [0.25, 0.1, 0.25, 1] } },
}

const WHATSAPP_MESSAGE =
  '🚨 SOS dignité ! Je monte une équipe pour BLACK OUT !, le rallye urbain qui va nous détruire 💀🍻 ' +
  'Qui est assez fou pour venir ? 👉 https://www.theblackoutgame.ch'
const WHATSAPP_HREF = `https://wa.me/?text=${encodeURIComponent(WHATSAPP_MESSAGE)}`

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
      {user && <PwaInstallPrompt />}

      <div className="relative w-full max-w-md min-h-dvh bg-zinc-950 flex flex-col">

        <PromoBanner />

        {/* Ambient glows */}
        <div aria-hidden className="pointer-events-none absolute inset-0 overflow-hidden">
          <div className="absolute -top-32 -left-16 w-72 h-72 rounded-full bg-violet-600/15 blur-3xl" />
          <div className="absolute top-1/3 -right-24 w-64 h-64 rounded-full bg-pink-500/10 blur-3xl" />
          <div className="absolute bottom-1/4 -left-20 w-56 h-56 rounded-full bg-yellow-500/8 blur-3xl" />
        </div>

        <div className="relative z-10 flex-1 w-full flex flex-col items-center justify-center gap-6 px-6 py-8">

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
            <p className="text-white text-lg font-semibold text-center leading-snug">
              Le rallye urbain qui détruit la dignité.
            </p>
            <p className="text-zinc-400 text-sm text-center">
              100% sur ton téléphone, rien à télécharger.
            </p>
            <p className="text-zinc-500 text-xs text-center">
              Idéal pour un EVG, un EVJF, un anniversaire ou une sortie entre collègues.
            </p>
          </motion.div>

          {/* Partage WhatsApp — invite ton équipe */}
          <motion.a
            initial={{ opacity: 0, y: 14, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            transition={{ duration: 0.45, delay: 0.2, ease: [0.25, 0.1, 0.25, 1] }}
            whileTap={{ scale: 0.96 }}
            href={WHATSAPP_HREF}
            target="_blank"
            rel="noopener noreferrer"
            className="w-full flex items-center justify-center gap-2.5 bg-[#25D366] text-zinc-950 font-black py-4 rounded-2xl text-base shadow-[0_0_28px_rgba(37,211,102,.45)]"
          >
            <svg viewBox="0 0 24 24" width={20} height={20} fill="currentColor" aria-hidden>
              <path d="M17.47 14.38c-.29-.15-1.71-.84-1.97-.94-.27-.1-.46-.15-.66.15-.2.29-.75.94-.92 1.13-.17.2-.34.22-.63.07-1.7-.85-2.81-1.51-3.93-3.42-.3-.51.3-.48.85-1.6.1-.2.05-.37-.05-.52-.1-.15-.66-1.6-.91-2.19-.24-.58-.49-.5-.67-.51-.17-.01-.37-.01-.57-.01-.2 0-.52.07-.8.37-.27.29-1.04 1.02-1.04 2.49 0 1.47 1.07 2.89 1.22 3.09.15.2 2.09 3.2 5.07 4.36 2.98 1.17 2.98.78 3.52.73.54-.05 1.71-.7 1.96-1.38.24-.68.24-1.26.17-1.38-.07-.12-.27-.2-.55-.34Z" />
              <path d="M12.02 2C6.5 2 2 6.48 2 12c0 1.95.56 3.78 1.62 5.39L2 22l4.74-1.55A9.96 9.96 0 0 0 12.02 22C17.53 22 22 17.52 22 12S17.53 2 12.02 2Zm0 18.13c-1.75 0-3.4-.46-4.83-1.33l-.35-.21-3.13 1.02 1.04-3.05-.23-.36A8.1 8.1 0 0 1 3.9 12c0-4.48 3.65-8.13 8.13-8.13S20.16 7.52 20.16 12s-3.65 8.13-8.14 8.13Z" />
            </svg>
            🔥 Chauffer mon équipe
          </motion.a>

          {/* 4 buttons */}
          <motion.div
            variants={stagger}
            initial="hidden"
            animate="visible"
            className="w-full space-y-3"
          >
            {/* Bandeau de réassurance */}
            <motion.div variants={fadeUp} className="flex justify-center">
              <span className="inline-flex items-center gap-2 bg-white/5 border border-white/10 rounded-full px-4 py-1.5 text-xs text-zinc-300">
                🎁 Inclus : Ton film souvenir par IA + Concours 50 CHF
              </span>
            </motion.div>

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
                  <p className="text-xs font-normal text-violet-200/80 mt-0.5">Voir le scénario</p>
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
            className="flex items-center gap-4 text-xs text-zinc-500"
          >
            <Link href="/cgv" className="underline underline-offset-2 hover:text-zinc-200 transition-colors">CGV</Link>
            <span className="text-zinc-700">·</span>
            <Link href="/mentions-legales" className="underline underline-offset-2 hover:text-zinc-200 transition-colors">Mentions légales</Link>
          </motion.div>

          <TestimonialsCarousel />
        </div>

        {/* Auth overlay */}
        <AuthOverlay
          isOpen={authOpen}
          onClose={() => setAuthOpen(false)}
          onSuccess={() => {
            setAuthOpen(false)
            router.push('/dashboard')
          }}
          oauthRedirectPath="/dashboard"
        />
      </div>
    </div>
  )
}
