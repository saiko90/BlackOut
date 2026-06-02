'use client'

import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import Link from 'next/link'
import {
  ArrowLeft, Ticket, MapPin, Camera, Film,
  Clock, Smartphone, Backpack, Calendar,
  ChevronDown, Zap, ChevronRight,
} from 'lucide-react'

/* ── Variants ── */
const fadeUp = {
  hidden:  { opacity: 0, y: 24 },
  visible: (i: number) => ({
    opacity: 1, y: 0,
    transition: { delay: i * 0.1, duration: 0.45, ease: [0.25, 0.1, 0.25, 1] },
  }),
}

/* ── Données ── */
const STEPS = [
  {
    num: '01',
    icon: Ticket,
    title: 'Un pass pour l\'équipe',
    color: 'text-violet-400',
    border: 'border-violet-500/25',
    glow: 'bg-violet-500/10',
    body: 'Achetez un accès unique à 29 CHF pour toute votre équipe (2 à 6 joueurs). Rien à télécharger depuis les stores — le jeu s\'ouvre directement dans le navigateur de votre téléphone (Safari ou Chrome). Pour jouer avec plus de confort en extérieur, vous pourrez ajouter un simple raccourci sur votre écran d\'accueil.',
  },
  {
    num: '02',
    icon: MapPin,
    title: 'Rendez-vous à la Gare',
    color: 'text-pink-400',
    border: 'border-pink-500/25',
    glow: 'bg-pink-500/10',
    body: 'Le jeu commence à la gare de la ville choisie. Ouvrez le lien reçu par e-mail, autorisez le GPS et la caméra. Le traceur s\'active et votre aventure peut commencer.',
  },
  {
    num: '03',
    icon: Camera,
    title: '12 Défis dans la ville',
    color: 'text-amber-400',
    border: 'border-amber-500/25',
    glow: 'bg-amber-500/10',
    body: 'Suivez les instructions pour retrouver vos clés. Photos honteuses, gages filmés, cris dans la rue — tout y passe. Le jeu valide votre position GPS en temps réel. Pas de triche possible.',
  },
  {
    num: '04',
    icon: Film,
    title: 'Le Film Souvenir',
    color: 'text-cyan-400',
    border: 'border-cyan-500/25',
    glow: 'bg-cyan-500/10',
    body: 'Une fois la dernière étape franchie — victoire ! Notre IA compile automatiquement toutes vos photos et vidéos pour créer le film de votre aventure. Un souvenir que vous ne pourrez pas effacer.',
  },
]

const FAQ = [
  {
    q: 'Combien de temps ça dure ?',
    a: 'Comptez environ 1h30 à 2h selon votre rythme et vos pauses "hydratation". Personne n\'a jamais terminé sobrement en moins d\'une heure.',
    icon: Clock,
  },
  {
    q: 'Faut-il installer une application ?',
    a: (
      <span className="space-y-3 block">
        <span className="block">
          Non ! Le jeu s&apos;ouvre et se joue directement dans le navigateur internet de votre téléphone (Safari, Chrome). Rien à télécharger depuis les stores. Cependant, pour un confort de jeu optimal pendant votre course, nous vous proposerons d&apos;ajouter un simple raccourci sur votre écran d&apos;accueil.
        </span>
        <span className="block space-y-2">
          <span className="flex items-start gap-2">
            <span className="shrink-0 bg-zinc-800 border border-zinc-700 text-zinc-300 text-[10px] font-bold px-2 py-0.5 rounded-md mt-0.5">Android</span>
            <span className="text-zinc-400 text-xs leading-relaxed">
              Dans Chrome, appuyez sur le menu <span className="font-bold text-zinc-300">⋮</span> en haut à droite, puis <span className="font-bold text-zinc-300">&quot;Ajouter à l&apos;écran d&apos;accueil&quot;</span>.
            </span>
          </span>
          <span className="flex items-start gap-2">
            <span className="shrink-0 bg-zinc-800 border border-zinc-700 text-zinc-300 text-[10px] font-bold px-2 py-0.5 rounded-md mt-0.5">iPhone</span>
            <span className="text-zinc-400 text-xs leading-relaxed">
              Dans Safari, appuyez sur l&apos;icône <span className="font-bold text-zinc-300">Partager</span> <span className="text-zinc-500">(carré avec flèche)</span>, puis <span className="font-bold text-zinc-300">&quot;Sur l&apos;écran d&apos;accueil&quot;</span>.
            </span>
          </span>
        </span>
      </span>
    ),
    icon: Smartphone,
  },
  {
    q: 'Que faut-il prévoir ?',
    a: 'Un smartphone avec la batterie pleine (ou une powerbank), une connexion 4G/5G, et de bonnes chaussures. Le reste, le jeu s\'en occupe.',
    icon: Backpack,
  },
  {
    q: 'Peut-on jouer quand on veut ?',
    a: 'Oui ! Une fois le pass acheté, vous lancez la partie le jour et l\'heure de votre choix. Le code n\'expire pas — idéal comme cadeau.',
    icon: Calendar,
  },
]

function FaqItem({ q, a, icon: Icon }: { q: string; a: React.ReactNode; icon: React.ElementType }) {
  const [open, setOpen] = useState(false)
  return (
    <motion.div
      layout
      className="glass rounded-2xl overflow-hidden"
    >
      <button
        onClick={() => setOpen(!open)}
        className="w-full flex items-center justify-between gap-3 px-5 py-4 text-left"
      >
        <div className="flex items-center gap-3 min-w-0">
          <div className="w-8 h-8 rounded-lg bg-violet-500/10 border border-violet-500/20 flex items-center justify-center shrink-0">
            <Icon size={15} className="text-violet-400" />
          </div>
          <span className="text-sm font-semibold text-white leading-snug">{q}</span>
        </div>
        <motion.div
          animate={{ rotate: open ? 180 : 0 }}
          transition={{ duration: 0.2 }}
          className="shrink-0"
        >
          <ChevronDown size={16} className="text-zinc-500" />
        </motion.div>
      </button>

      <AnimatePresence initial={false}>
        {open && (
          <motion.div
            key="answer"
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.25, ease: [0.25, 0.1, 0.25, 1] }}
            className="overflow-hidden"
          >
            <div className="px-5 pb-5 pt-3 text-sm text-zinc-400 leading-relaxed border-t border-white/5">
              {a}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  )
}

export default function ConceptPage() {
  return (
    <div className="flex justify-center min-h-dvh bg-zinc-950">
      <div className="relative w-full max-w-md min-h-dvh">

        {/* Ambient glows */}
        <div aria-hidden className="pointer-events-none fixed inset-0 overflow-hidden">
          <div className="absolute -top-24 left-1/2 -translate-x-1/2 w-96 h-96 rounded-full bg-violet-600/10 blur-3xl" />
          <div className="absolute top-1/2 -right-32 w-64 h-64 rounded-full bg-pink-500/8 blur-3xl" />
          <div className="absolute bottom-1/4 -left-24 w-56 h-56 rounded-full bg-amber-500/6 blur-3xl" />
        </div>

        <div className="relative z-10 px-4 pt-12 pb-16 space-y-10">

          {/* ── Retour ── */}
          <Link
            href="/"
            className="inline-flex items-center gap-2 text-zinc-500 hover:text-zinc-300 text-sm transition-colors"
          >
            <ArrowLeft size={16} />
            Retour
          </Link>

          {/* ── HERO ── */}
          <motion.header
            custom={0} variants={fadeUp} initial="hidden" animate="visible"
            className="space-y-3"
          >
            <span className="inline-flex items-center gap-1.5 bg-violet-500/10 border border-violet-500/20 text-violet-400 text-xs font-semibold px-3 py-1.5 rounded-full">
              <span className="w-1.5 h-1.5 rounded-full bg-violet-400 animate-pulse" />
              Disponible à Sion
            </span>
            <h1 className="text-3xl font-black text-white leading-tight tracking-tight">
              Comment survivre au{' '}
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-violet-400 to-pink-400">
                Black Out ?
              </span>
            </h1>
            <p className="text-sm text-zinc-400 leading-relaxed">
              Pas d&apos;application à télécharger. Juste votre smartphone,
              votre équipe, et un peu de dignité à perdre.
            </p>
          </motion.header>

          {/* ── 4 ÉTAPES ── */}
          <section className="space-y-3">
            <motion.p
              custom={1} variants={fadeUp} initial="hidden" animate="visible"
              className="text-xs font-semibold text-zinc-500 uppercase tracking-widest"
            >
              Les 4 étapes
            </motion.p>

            {STEPS.map((step, i) => {
              const Icon = step.icon
              return (
                <motion.div
                  key={step.num}
                  custom={i + 2} variants={fadeUp} initial="hidden" animate="visible"
                  className={`glass rounded-2xl border ${step.border} p-5`}
                >
                  <div className="flex gap-4">
                    {/* Numéro géant */}
                    <div className="shrink-0 flex flex-col items-center gap-2">
                      <div className={`w-10 h-10 rounded-xl ${step.glow} border ${step.border} flex items-center justify-center`}>
                        <Icon size={18} className={step.color} />
                      </div>
                      <span className={`text-xs font-black ${step.color} opacity-40 tabular-nums`}>
                        {step.num}
                      </span>
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className={`font-bold text-white text-base mb-1`}>{step.title}</p>
                      <p className="text-sm text-zinc-400 leading-relaxed">{step.body}</p>
                    </div>
                  </div>
                </motion.div>
              )
            })}
          </section>

          {/* ── CHIFFRES CLÉS ── */}
          <motion.section
            custom={7} variants={fadeUp} initial="hidden" animate="visible"
            className="grid grid-cols-3 gap-3"
          >
            {[
              { value: '29 CHF', label: 'par équipe' },
              { value: '~2h',    label: 'de jeu' },
              { value: '12',     label: 'défis' },
            ].map(({ value, label }) => (
              <div key={label} className="glass rounded-2xl p-4 text-center">
                <p className="text-xl font-black text-white">{value}</p>
                <p className="text-xs text-zinc-500 mt-0.5">{label}</p>
              </div>
            ))}
          </motion.section>

          {/* ── FAQ ── */}
          <section className="space-y-3">
            <motion.p
              custom={8} variants={fadeUp} initial="hidden" animate="visible"
              className="text-xs font-semibold text-zinc-500 uppercase tracking-widest"
            >
              Questions fréquentes
            </motion.p>

            <motion.div
              custom={9} variants={fadeUp} initial="hidden" animate="visible"
              className="space-y-2"
            >
              {FAQ.map((item) => (
                <FaqItem key={item.q} {...item} />
              ))}
            </motion.div>
          </section>

          {/* ── CTA ── */}
          <motion.div
            custom={10} variants={fadeUp} initial="hidden" animate="visible"
            className="space-y-3 pt-2"
          >
            <Link href="/" className="block">
              <motion.div
                whileTap={{ scale: 0.97 }}
                whileHover={{ scale: 1.01 }}
                className="w-full flex items-center justify-center gap-2.5 bg-gradient-to-r from-violet-600 to-violet-500 text-white font-bold py-4 rounded-2xl glow-violet text-base"
              >
                <Zap size={18} />
                Acheter un Pass · 29 CHF
                <ChevronRight size={18} />
              </motion.div>
            </Link>
            <p className="text-center text-xs text-zinc-600">
              Paiement sécurisé · Carte bancaire &amp; TWINT · Powered by Stripe
            </p>
          </motion.div>

        </div>
      </div>
    </div>
  )
}
