'use client'

import { useEffect, useRef } from 'react'
import { motion, useMotionValue, useAnimationFrame } from 'framer-motion'
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
  {
    team: 'Bataillon de la Honte',
    quote: 'On a chanté à tue-tête devant la Cathédrale. Les touristes ont applaudi. Ou se sont moqués. On ne saura jamais.',
  },
  {
    team: 'Brigade du Petit-Chêne',
    quote: 'Monter la rue en moonwalk a cassé trois amitiés et créé un souvenir pour la vie. Parfait équilibre.',
  },
]

const LOOP = [...TESTIMONIALS, ...TESTIMONIALS]
const SPEED_PX_PER_SEC = 32

export function TestimonialsCarousel() {
  const x = useMotionValue(0)
  const trackRef = useRef<HTMLDivElement>(null)
  const setWidthRef = useRef(0)
  const draggingRef = useRef(false)

  useEffect(() => {
    if (trackRef.current) {
      setWidthRef.current = trackRef.current.scrollWidth / 2
    }
  }, [])

  /* ── Wrap une position dans (-setWidth, 0] pour boucler sans à-coup ── */
  const wrap = (value: number) => {
    const setWidth = setWidthRef.current
    if (!setWidth) return value
    const wrapped = ((value % setWidth) + setWidth) % setWidth
    return wrapped === 0 ? 0 : wrapped - setWidth
  }

  useAnimationFrame((_, delta) => {
    if (draggingRef.current) return
    const setWidth = setWidthRef.current
    if (!setWidth) return
    x.set(wrap(x.get() - (SPEED_PX_PER_SEC * delta) / 1000))
  })

  return (
    <div className="w-full">
      <p className="text-xs font-semibold text-zinc-500 uppercase tracking-widest text-center mb-4">
        Ils ont survécu (ou presque)
      </p>
      <div className="overflow-hidden">
        <motion.div
          ref={trackRef}
          className="flex gap-3 cursor-grab active:cursor-grabbing"
          style={{ x }}
          drag="x"
          dragConstraints={{ left: -Infinity, right: Infinity }}
          dragElastic={0}
          dragMomentum={false}
          onDragStart={() => { draggingRef.current = true }}
          onDragEnd={() => {
            draggingRef.current = false
            x.set(wrap(x.get()))
          }}
        >
          {LOOP.map((t, i) => (
            <div
              key={i}
              className="glass rounded-2xl p-4 w-64 shrink-0 flex flex-col gap-2 select-none"
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
