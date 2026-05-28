'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { motion, AnimatePresence } from 'framer-motion'
import { Lock, Eye, EyeOff, Loader2, AlertCircle, Zap } from 'lucide-react'
import { supabase } from '@/lib/supabase/client'
import { useToastStore } from '@/store/toastStore'

type PageState = 'waiting' | 'ready' | 'invalid'

export default function ResetPasswordPage() {
  const router = useRouter()
  const { addToast } = useToastStore()

  const [pageState, setPageState] = useState<PageState>('waiting')
  const [password, setPassword]   = useState('')
  const [confirm, setConfirm]     = useState('')
  const [showPwd, setShowPwd]     = useState(false)
  const [showCfm, setShowCfm]     = useState(false)
  const [loading, setLoading]     = useState(false)
  const [error, setError]         = useState<string | null>(null)

  useEffect(() => {
    // Supabase fires PASSWORD_RECOVERY when it processes the token from the URL hash
    const { data: { subscription } } = supabase.auth.onAuthStateChange((event) => {
      if (event === 'PASSWORD_RECOVERY') setPageState('ready')
    })

    // If the user already has a session (e.g. page refresh after token processed)
    supabase.auth.getSession().then(({ data: { session } }) => {
      if (session) setPageState('ready')
    })

    // After 5 s with no recovery event, the link is invalid or expired
    const timeout = setTimeout(() => {
      setPageState((s) => s === 'waiting' ? 'invalid' : s)
    }, 5000)

    return () => {
      subscription.unsubscribe()
      clearTimeout(timeout)
    }
  }, [])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError(null)

    if (password.length < 6) {
      setError('Le mot de passe doit faire au moins 6 caractères.')
      return
    }
    if (password !== confirm) {
      setError('Les mots de passe ne correspondent pas.')
      return
    }

    setLoading(true)
    const { error: err } = await supabase.auth.updateUser({ password })
    setLoading(false)

    if (err) {
      setError(err.message)
      return
    }

    addToast('Mot de passe mis à jour avec succès !', 'success')
    router.push('/dashboard')
  }

  return (
    <div className="flex justify-center min-h-dvh bg-zinc-950">
      <div className="relative w-full max-w-md min-h-dvh flex flex-col px-6 py-12">

        {/* Ambient glow */}
        <div aria-hidden className="pointer-events-none fixed inset-0 overflow-hidden">
          <div className="absolute -top-20 left-1/2 -translate-x-1/2 w-80 h-80 rounded-full bg-violet-600/12 blur-3xl" />
        </div>

        <div className="relative z-10 flex-1 flex flex-col justify-center">
          <AnimatePresence mode="wait">

            {/* ── ATTENTE ── */}
            {pageState === 'waiting' && (
              <motion.div
                key="waiting"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="flex flex-col items-center gap-4"
              >
                <motion.div
                  animate={{ rotate: 360 }}
                  transition={{ repeat: Infinity, duration: 1, ease: 'linear' }}
                >
                  <Zap size={28} className="text-violet-500" />
                </motion.div>
                <p className="text-sm text-zinc-500">Vérification du lien…</p>
              </motion.div>
            )}

            {/* ── LIEN INVALIDE ── */}
            {pageState === 'invalid' && (
              <motion.div
                key="invalid"
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                className="text-center space-y-4"
              >
                <div className="w-14 h-14 rounded-2xl bg-red-500/10 border border-red-500/20 flex items-center justify-center mx-auto">
                  <AlertCircle size={24} className="text-red-400" />
                </div>
                <h1 className="text-xl font-black text-white">Lien invalide ou expiré</h1>
                <p className="text-sm text-zinc-500">
                  Ce lien de réinitialisation n&apos;est plus valide. Demandes-en un nouveau.
                </p>
                <motion.a
                  href="/forgot-password"
                  whileTap={{ scale: 0.97 }}
                  className="inline-block bg-violet-600 hover:bg-violet-500 text-white font-bold px-6 py-3 rounded-xl text-sm transition-colors glow-violet"
                >
                  Nouveau lien →
                </motion.a>
              </motion.div>
            )}

            {/* ── FORMULAIRE ── */}
            {pageState === 'ready' && (
              <motion.div
                key="form"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4, ease: [0.25, 0.1, 0.25, 1] }}
              >
                <h1 className="text-2xl font-black text-white mb-1">Nouveau mot de passe</h1>
                <p className="text-sm text-zinc-500 mb-8">Choisis quelque chose de solide — au moins 6 caractères.</p>

                <form onSubmit={handleSubmit} className="space-y-4">
                  {/* Nouveau mot de passe */}
                  <div className="relative">
                    <Lock size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-zinc-500 pointer-events-none" />
                    <input
                      type={showPwd ? 'text' : 'password'}
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      placeholder="Nouveau mot de passe"
                      required
                      minLength={6}
                      disabled={loading}
                      className="w-full bg-zinc-800/60 border border-white/10 rounded-xl pl-11 pr-12 py-3.5 text-white placeholder:text-zinc-600 text-sm focus:outline-none focus:border-violet-500/60 focus:ring-1 focus:ring-violet-500/30 transition-all disabled:opacity-50"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPwd(!showPwd)}
                      className="absolute right-4 top-1/2 -translate-y-1/2 text-zinc-500 hover:text-zinc-300 transition-colors"
                    >
                      {showPwd ? <EyeOff size={16} /> : <Eye size={16} />}
                    </button>
                  </div>

                  {/* Confirmation */}
                  <div className="relative">
                    <Lock size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-zinc-500 pointer-events-none" />
                    <input
                      type={showCfm ? 'text' : 'password'}
                      value={confirm}
                      onChange={(e) => setConfirm(e.target.value)}
                      placeholder="Confirmer le mot de passe"
                      required
                      minLength={6}
                      disabled={loading}
                      className="w-full bg-zinc-800/60 border border-white/10 rounded-xl pl-11 pr-12 py-3.5 text-white placeholder:text-zinc-600 text-sm focus:outline-none focus:border-violet-500/60 focus:ring-1 focus:ring-violet-500/30 transition-all disabled:opacity-50"
                    />
                    <button
                      type="button"
                      onClick={() => setShowCfm(!showCfm)}
                      className="absolute right-4 top-1/2 -translate-y-1/2 text-zinc-500 hover:text-zinc-300 transition-colors"
                    >
                      {showCfm ? <EyeOff size={16} /> : <Eye size={16} />}
                    </button>
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
                    disabled={loading || !password || !confirm}
                    whileTap={{ scale: 0.97 }}
                    className="w-full bg-violet-600 hover:bg-violet-500 disabled:opacity-50 text-white font-bold py-4 rounded-xl transition-colors glow-violet flex items-center justify-center gap-2"
                  >
                    {loading
                      ? <Loader2 size={18} className="animate-spin" />
                      : 'Sauvegarder →'
                    }
                  </motion.button>
                </form>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </div>
  )
}
