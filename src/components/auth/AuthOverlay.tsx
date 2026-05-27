'use client'

import { useState } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import { X, Mail, Lock, Loader2, AlertCircle, Eye, EyeOff } from 'lucide-react'
import { supabase } from '@/lib/supabase/client'
import { cn } from '@/lib/utils'

type Mode = 'login' | 'signup'

type AuthOverlayProps = {
  isOpen: boolean
  onClose: () => void
  onSuccess?: () => void
}

export function AuthOverlay({ isOpen, onClose, onSuccess }: AuthOverlayProps) {
  const [mode, setMode] = useState<Mode>('login')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState<string | null>(null)

  const resetForm = () => {
    setError(null)
    setSuccess(null)
    setEmail('')
    setPassword('')
  }

  const switchMode = (next: Mode) => {
    resetForm()
    setMode(next)
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError(null)
    setSuccess(null)
    setLoading(true)

    try {
      if (mode === 'signup') {
        const { error } = await supabase.auth.signUp({ email, password })
        if (error) throw error
        setSuccess('Vérifie ta boîte mail pour confirmer ton compte !')
      } else {
        const { error } = await supabase.auth.signInWithPassword({ email, password })
        if (error) throw error
        onSuccess?.()
        onClose()
      }
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'Une erreur est survenue'
      setError(translateError(msg))
    } finally {
      setLoading(false)
    }
  }

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            key="backdrop"
            className="absolute inset-0 z-40 bg-black/70 backdrop-blur-sm"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
          />

          {/* Bottom Sheet */}
          <motion.div
            key="sheet"
            className="absolute bottom-0 left-0 right-0 z-50 bg-zinc-900 rounded-t-3xl border-t border-white/10 overflow-hidden"
            initial={{ y: '100%' }}
            animate={{ y: 0 }}
            exit={{ y: '100%' }}
            transition={{ type: 'spring', damping: 28, stiffness: 320 }}
          >
            {/* Drag handle */}
            <div className="flex justify-center pt-3 pb-1">
              <div className="w-10 h-1 rounded-full bg-white/20" />
            </div>

            <div className="px-6 pb-10">
              {/* Header */}
              <div className="flex items-center justify-between mb-6 mt-2">
                <div>
                  <h2 className="text-xl font-bold text-white">
                    {mode === 'login' ? 'Bon retour !' : 'Rejoins le jeu'}
                  </h2>
                  <p className="text-sm text-zinc-400 mt-0.5">
                    {mode === 'login' ? 'Connecte-toi pour jouer' : 'Crée ton compte gratuitement'}
                  </p>
                </div>
                <motion.button
                  whileTap={{ scale: 0.9 }}
                  onClick={onClose}
                  className="w-8 h-8 rounded-full bg-white/5 border border-white/10 flex items-center justify-center text-zinc-400 hover:text-white transition-colors"
                >
                  <X size={16} />
                </motion.button>
              </div>

              {/* Mode switcher */}
              <div className="flex bg-zinc-800/60 rounded-xl p-1 mb-6">
                {(['login', 'signup'] as Mode[]).map((m) => (
                  <motion.button
                    key={m}
                    onClick={() => switchMode(m)}
                    className={cn(
                      'flex-1 py-2 text-sm font-semibold rounded-lg transition-colors',
                      mode === m
                        ? 'bg-violet-600 text-white shadow-[0_0_16px_rgba(124,58,237,0.5)]'
                        : 'text-zinc-400 hover:text-white'
                    )}
                    whileTap={{ scale: 0.97 }}
                  >
                    {m === 'login' ? 'Se connecter' : 'Créer un compte'}
                  </motion.button>
                ))}
              </div>

              {/* Form */}
              <form onSubmit={handleSubmit} className="space-y-4">
                {/* Email */}
                <div className="relative">
                  <Mail size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-zinc-500 pointer-events-none" />
                  <input
                    type="email"
                    placeholder="ton@email.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                    disabled={loading}
                    className="w-full bg-zinc-800/60 border border-white/10 rounded-xl pl-11 pr-4 py-3.5 text-white placeholder:text-zinc-600 text-sm focus:outline-none focus:border-violet-500/60 focus:ring-1 focus:ring-violet-500/30 transition-all disabled:opacity-50"
                  />
                </div>

                {/* Password */}
                <div className="relative">
                  <Lock size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-zinc-500 pointer-events-none" />
                  <input
                    type={showPassword ? 'text' : 'password'}
                    placeholder="••••••••"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                    minLength={6}
                    disabled={loading}
                    className="w-full bg-zinc-800/60 border border-white/10 rounded-xl pl-11 pr-12 py-3.5 text-white placeholder:text-zinc-600 text-sm focus:outline-none focus:border-violet-500/60 focus:ring-1 focus:ring-violet-500/30 transition-all disabled:opacity-50"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-4 top-1/2 -translate-y-1/2 text-zinc-500 hover:text-zinc-300 transition-colors"
                  >
                    {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                  </button>
                </div>

                {/* Feedback */}
                <AnimatePresence mode="wait">
                  {error && (
                    <motion.div
                      key="error"
                      initial={{ opacity: 0, y: -6 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0 }}
                      className="flex items-center gap-2 bg-red-500/10 border border-red-500/20 rounded-xl px-4 py-3 text-red-400 text-sm"
                    >
                      <AlertCircle size={15} className="shrink-0" />
                      <span>{error}</span>
                    </motion.div>
                  )}
                  {success && (
                    <motion.div
                      key="success"
                      initial={{ opacity: 0, y: -6 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0 }}
                      className="flex items-center gap-2 bg-cyan-500/10 border border-cyan-500/20 rounded-xl px-4 py-3 text-cyan-400 text-sm"
                    >
                      <span>✓</span>
                      <span>{success}</span>
                    </motion.div>
                  )}
                </AnimatePresence>

                {/* Submit */}
                <motion.button
                  type="submit"
                  disabled={loading}
                  whileTap={{ scale: 0.97 }}
                  className="w-full bg-violet-600 hover:bg-violet-500 disabled:opacity-60 text-white font-bold py-4 rounded-xl transition-colors glow-violet flex items-center justify-center gap-2 mt-2"
                >
                  {loading ? (
                    <Loader2 size={18} className="animate-spin" />
                  ) : mode === 'login' ? (
                    'Se connecter →'
                  ) : (
                    'Créer mon compte →'
                  )}
                </motion.button>
              </form>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  )
}

function translateError(msg: string): string {
  if (msg.includes('Invalid login')) return 'Email ou mot de passe incorrect.'
  if (msg.includes('Email not confirmed')) return 'Confirme ton email avant de te connecter.'
  if (msg.includes('already registered')) return 'Cet email est déjà utilisé.'
  if (msg.includes('Password should')) return 'Le mot de passe doit faire au moins 6 caractères.'
  if (msg.includes('rate limit')) return 'Trop de tentatives. Réessaie dans quelques minutes.'
  return msg
}
