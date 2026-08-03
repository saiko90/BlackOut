'use client'

import { motion } from 'framer-motion'
import Link from 'next/link'
import { Zap, ChevronRight } from 'lucide-react'

type PlayCtaProps = {
  href: string
  label: string
}

/* ── Même style que le CTA final de /concept — isolé en client component
   uniquement parce que framer-motion l'exige, le reste de la page ville
   reste un Server Component pur. ── */
export function PlayCta({ href, label }: PlayCtaProps) {
  return (
    <Link
      href={href}
      className="block rounded-2xl focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-violet-400 focus-visible:ring-offset-2 focus-visible:ring-offset-zinc-950"
    >
      <motion.div
        whileTap={{ scale: 0.97 }}
        whileHover={{ scale: 1.01 }}
        className="w-full flex items-center justify-center gap-2.5 bg-gradient-to-r from-violet-600 to-violet-500 text-white font-bold py-4 rounded-2xl glow-violet text-base"
      >
        <Zap size={18} />
        {label}
        <ChevronRight size={18} />
      </motion.div>
    </Link>
  )
}
