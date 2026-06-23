'use client'

import { motion } from 'framer-motion'
import { Quote } from 'lucide-react'

/* Citations illustratives — à remplacer par de vrais avis clients dès que possible */
const TESTIMONIALS = [
  {
    team: 'Team Gueule de Bois',
    quote: 'On est arrivés en mode zombie, on est repartis en larmes de rire. Le pire petit-déj de notre vie, mais on recommencerait direct.',
  },
  {
    team: 'Brigade Apéro',
    quote: 'Ma copine a hurlé "APÉRO" en pleine place pendant 5 minutes devant des inconnus. Je ne lui pardonnerai jamais. 10/10.',
  },
  {
    team: 'Les Amnésiques du Flon',
    quote: 'On pensait connaître notre ville. On avait tout faux. Meilleure activité d\'EVG qu\'on ait jamais faite.',
  },
  {
    team: 'Survivants de Tourbillon',
    quote: 'Le film souvenir à la fin nous a achevés. On l\'a regardé 15 fois en pleurant de rire.',
  },
]

const LOOP = [...TESTIMONIALS, ...TESTIMONIALS]

export function TestimonialsCarousel() {
  return (
    <div className="w-full overflow-hidden py-2">
      <p className="text-xs font-semibold text-zinc-500 uppercase tracking-widest text-center mb-4">
        Ils ont survécu (ou presque)
      </p>
      <div className="relative">
        <motion.div
          className="flex gap-3"
          animate={{ x: ['0%', '-50%'] }}
          transition={{ duration: 28, ease: 'linear', repeat: Infinity }}
        >
          {LOOP.map((t, i) => (
            <div
              key={i}
              className="glass rounded-2xl p-4 w-64 shrink-0 flex flex-col gap-2"
            >
              <Quote size={16} className="text-violet-400 shrink-0" />
              <p className="text-xs text-zinc-300 leading-relaxed">{t.quote}</p>
              <p className="text-xs font-bold text-zinc-500 mt-1">— {t.team}</p>
            </div>
          ))}
        </motion.div>
      </div>
    </div>
  )
}
