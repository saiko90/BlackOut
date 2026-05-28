'use client'

import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Mail, Loader2, ArrowLeft, CheckCircle, AlertCircle } from 'lucide-react'
import Link from 'next/link'
import { supabase } from '@/lib/supabase/client'

const REDIRECT_URL = 'https://www.theblackoutgame.ch/reset-password'

export default function ForgotPasswordPage() {
  const [email, setEmail]     = useState('')
  const [loading, setLoading] = useState(false)
  const [sent, setSent]       = useState(false)
  const [error, setError]     = useState<string | null>(null)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError(null)
    setLoading(true)
    try {
      const { error: err } = await supabase.auth.resetPasswordForEmail(email.trim(), {
        redirectTo: REDIRECT_URL,
      })
      if (err) throw err
      setSent(true)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erreur inconnue.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="flex justify-center min-h-dvh bg-zinc-950">
      <div className="relative w-full max-w-md min-h-dvh flex flex-col px-6 py-12">

        {/* Ambient glow */}
        <div aria-hidden className="pointer-events-none fixed inset-0 overflow-hidden">
          <div className="absolute -top-20 left-1/2 -translate-x-1/2 w-80 h-80 rounded-full bg-violet-600/12 blur-3xl" />
        </div>

        {/* Back */}
        <Link
          href="/"
          className="relative z-10 inline-flex items-center gap-2 text-zinc-500 hover:text-zinc-300 text-sm transition-colors mb-10 w-fit"
        >
          <ArrowLeft size={16} />
          Retour
        </Link>

        <div className="relative z-10 flex-1 flex flex-col justify-center">
          <AnimatePresence mode="wait">
            {/* ── FORMULAIRE ── */}
            {!sent ? (
              <motion.div
                key="form"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ duration: 0.4, ease: [0.25, 0.1, 0.25, 1] }}
              >
                <h1 className="text-2xl font-black text-white mb-1">Mot de passe oublié ?</h1>
                <p className="text-sm text-zinc-500 mb-8">
                  Entre ton adresse email et on t&apos;envoie un lien de secours.
                </p>

                <form onSubmit={handleSubmit} className="space-y-4">
                  <div className="relative">
                    <Mail size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-zinc-500 pointer-events-none" />
                    <input
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="ton@email.com"
                      required
                      disabled={loading}
                      className="w-full bg-zinc-800/60 border border-white/10 rounded-xl pl-11 pr-4 py-3.5 text-white placeholder:text-zinc-600 text-sm focus:outline-none focus:border-violet-500/60 focus:ring-1 focus:ring-violet-500/30 transition-all disabled:opacity-50"
                    />
                  </div>

                  <AnimatePresence>
                    {error && (
                      <motion.div
                        initial={{ opacity: 0, y: -6 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0 }}
                        className="flex items-center gap-2 bg-red-500/10 border border-red-500/20 rounded-xl px-4 py-3 text-red-400 text-sm"
                      >
                        <AlertCircle size={15} className="shrink-0" />
                        <span>{error}</span>
                      </motion.div>
                    )}
                  </AnimatePresence>

                  <motion.button
                    type="submit"
                    disabled={loading || !email.trim()}
                    whileTap={{ scale: 0.97 }}
                    className="w-full bg-violet-600 hover:bg-violet-500 disabled:opacity-50 text-white font-bold py-4 rounded-xl transition-colors glow-violet flex items-center justify-center gap-2"
                  >
                    {loading
                      ? <Loader2 size={18} className="animate-spin" />
                      : 'Envoyer le lien de secours →'
                    }
                  </motion.button>
                </form>
              </motion.div>
            ) : (
              /* ── SUCCÈS ── */
              <motion.div
                key="success"
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.4, ease: [0.25, 0.1, 0.25, 1] }}
                className="text-center"
              >
                <div className="w-16 h-16 rounded-2xl bg-cyan-500/10 border border-cyan-500/20 flex items-center justify-center mx-auto mb-5">
                  <CheckCircle size={28} className="text-cyan-400" />
                </div>
                <h2 className="text-xl font-black text-white mb-2">Vérifie ta boîte mail !</h2>
                <p className="text-sm text-zinc-500 leading-relaxed mb-8">
                  Un lien de réinitialisation a été envoyé à{' '}
                  <span className="text-zinc-300 font-medium">{email}</span>.
                  <br />
                  Le lien expire dans 1 heure.
                </p>
                <Link
                  href="/"
                  className="text-sm text-violet-400 hover:text-violet-300 transition-colors"
                >
                  ← Retour à l&apos;accueil
                </Link>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </div>
  )
}
