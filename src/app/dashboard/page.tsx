'use client'

import { useCallback, useEffect, useState } from 'react'
import { motion } from 'framer-motion'
import { useRouter } from 'next/navigation'
import {
  LogOut, User, Trophy, Clock, Search, ChevronRight, Zap, Play, Lock, Loader2,
} from 'lucide-react'
import { supabase } from '@/lib/supabase/client'
import { useGameStore } from '@/store/gameStore'
import { useToastStore } from '@/store/toastStore'
import { TokenCard } from '@/components/dashboard/TokenCard'
import { CheckoutDrawer } from '@/components/payment/CheckoutDrawer'
import { activateToken } from '@/app/actions/session'
import type { Token, GameSession } from '@/lib/supabase/types'

type TokenWithGift = Token & { gift_code?: string | null }

const fadeUp = {
  hidden: { opacity: 0, y: 16 },
  visible: (i: number) => ({
    opacity: 1, y: 0,
    transition: { delay: i * 0.07, duration: 0.4, ease: [0.25, 0.1, 0.25, 1] },
  }),
}

export default function DashboardPage() {
  const router = useRouter()
  const { user } = useGameStore()
  const { addToast } = useToastStore()

  const [tokens, setTokens]       = useState<TokenWithGift[]>([])
  const [sessions, setSessions]   = useState<GameSession[]>([])
  const [loading, setLoading]     = useState(true)
  const [checkoutOpen, setCheckoutOpen] = useState(false)
  const [giftCode, setGiftCode]   = useState('')
  const [redeemLoading, setRedeemLoading] = useState(false)
  const [newPassword, setNewPassword]   = useState('')
  const [pwdLoading, setPwdLoading]     = useState(false)

  /* ── Fetch inventaire + historique ── */
  const fetchData = useCallback(async () => {
    if (!user) return
    setLoading(true)

    const [tokensRes, sessionsRes] = await Promise.all([
      supabase
        .from('tokens')
        .select('*')
        .eq('user_id', user.id)
        .eq('is_used', false)
        .order('created_at', { ascending: false }),
      supabase
        .from('game_sessions')
        .select('*')
        .eq('user_id', user.id)
        .order('start_time', { ascending: false })
        .limit(10),
    ])

    if (tokensRes.data) setTokens(tokensRes.data)
    if (sessionsRes.data) setSessions(sessionsRes.data)
    setLoading(false)
  }, [user])

  useEffect(() => { fetchData() }, [fetchData])

  /* ── Déconnexion ── */
  const handleSignOut = async () => {
    await supabase.auth.signOut()
    router.push('/')
  }

  /* ── Activer un jeton ── */
  const handleActivate = async (tokenId: string) => {
    if (!user) return
    const result = await activateToken(
      tokenId,
      user.id,
      user.email?.split('@')[0] ?? 'Joueur',
    )
    if (result.error || !result.sessionId) {
      addToast(result.error ?? 'Erreur inconnue', 'error')
      return
    }
    addToast('Partie lancée ! Bonne chance.', 'success')
    router.push(`/play/${result.sessionId}`)
  }

  /* ── Racheter un code cadeau ── */
  const handleRedeem = async () => {
    if (!user || !giftCode.trim()) return
    setRedeemLoading(true)

    const code = giftCode.trim().toUpperCase()

    // Cheat code admin (dev uniquement)
    if (code === 'DEV-GODMODE') {
      const { error } = await supabase
        .from('tokens')
        .insert({ user_id: user.id, city: 'Sion', is_used: false })
      if (!error) {
        addToast('👾 God Mode : Jeton gratuit généré !', 'success')
        setGiftCode('')
        fetchData()
      } else {
        addToast(error.message, 'error')
      }
      setRedeemLoading(false)
      return
    }

    const { data: token, error: findError } = await supabase
      .from('tokens')
      .select('id, gift_code, is_used')
      .eq('gift_code', code)
      .eq('is_used', false)
      .maybeSingle()

    if (findError || !token) {
      addToast('Code invalide ou déjà utilisé.', 'error')
      setRedeemLoading(false)
      return
    }

    const { error: updateError } = await supabase
      .from('tokens')
      .update({ user_id: user.id, gift_code: null })
      .eq('id', token.id)

    if (updateError) {
      addToast('Erreur lors de l\'activation.', 'error')
    } else {
      addToast('🎁 Code cadeau activé ! Ton pass est dans l\'inventaire.', 'success')
      setGiftCode('')
      fetchData()
    }

    setRedeemLoading(false)
  }

  const displayName = user?.email?.split('@')[0] ?? 'Joueur'

  /* ── Modifier le mot de passe ── */
  const handlePasswordUpdate = async () => {
    if (!newPassword.trim() || newPassword.length < 6) {
      addToast('Minimum 6 caractères requis.', 'error')
      return
    }
    setPwdLoading(true)
    const { error } = await supabase.auth.updateUser({ password: newPassword })
    setPwdLoading(false)
    if (error) {
      addToast(error.message, 'error')
    } else {
      addToast('Mot de passe mis à jour !', 'success')
      setNewPassword('')
    }
  }

  return (
    <div className="flex justify-center min-h-dvh bg-zinc-950">
      <div className="relative w-full max-w-md bg-zinc-950 min-h-dvh overflow-x-hidden">

        {/* Ambient glow */}
        <div aria-hidden className="pointer-events-none fixed top-0 left-1/2 -translate-x-1/2 w-full max-w-md overflow-hidden h-72">
          <div className="absolute -top-20 left-1/2 -translate-x-1/2 w-64 h-64 rounded-full bg-violet-600/10 blur-3xl" />
        </div>

        <div className="relative z-10 px-4 pt-12 pb-10 space-y-6">

          {/* ── HEADER ── */}
          <motion.header
            custom={0} variants={fadeUp} initial="hidden" animate="visible"
            className="flex items-center justify-between"
          >
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-violet-600 to-violet-800 flex items-center justify-center shadow-[0_0_16px_rgba(124,58,237,.4)]">
                <User size={18} className="text-white" />
              </div>
              <div>
                <p className="text-xs text-zinc-500">Bienvenue</p>
                <p className="font-bold text-white capitalize">{displayName} 👋</p>
              </div>
            </div>
            <motion.button
              whileTap={{ scale: 0.9 }}
              onClick={handleSignOut}
              className="flex items-center gap-1.5 text-xs text-zinc-500 hover:text-red-400 transition-colors bg-white/5 border border-white/8 px-3 py-2 rounded-xl"
            >
              <LogOut size={13} />
              Déconnexion
            </motion.button>
          </motion.header>

          {/* ── CODE CADEAU ── */}
          <motion.section custom={1} variants={fadeUp} initial="hidden" animate="visible">
            <p className="text-xs font-semibold text-zinc-500 uppercase tracking-widest mb-3">
              Activer un code cadeau
            </p>
            <div className="glass rounded-2xl p-4">
              <div className="flex gap-2">
                <div className="relative flex-1">
                  <Search size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-zinc-500 pointer-events-none" />
                  <input
                    type="text"
                    value={giftCode}
                    onChange={(e) => setGiftCode(e.target.value.toUpperCase())}
                    onKeyDown={(e) => e.key === 'Enter' && handleRedeem()}
                    placeholder="SION-XXXXXX"
                    maxLength={11}
                    className="w-full bg-zinc-800/60 border border-white/10 rounded-xl pl-9 pr-3 py-2.5 text-white placeholder:text-zinc-600 text-sm font-mono tracking-wider focus:outline-none focus:border-violet-500/50 focus:ring-1 focus:ring-violet-500/20 transition-all uppercase"
                  />
                </div>
                <motion.button
                  whileTap={{ scale: 0.95 }}
                  onClick={handleRedeem}
                  disabled={redeemLoading || !giftCode.trim()}
                  className="bg-violet-600 hover:bg-violet-500 disabled:opacity-40 text-white font-bold px-4 py-2.5 rounded-xl text-sm transition-colors flex items-center gap-1.5 shrink-0"
                >
                  {redeemLoading ? (
                    <Zap size={15} className="animate-spin" />
                  ) : (
                    <>Activer <ChevronRight size={14} /></>
                  )}
                </motion.button>
              </div>
            </div>
          </motion.section>

          {/* ── INVENTAIRE ── */}
          <motion.section custom={2} variants={fadeUp} initial="hidden" animate="visible">
            <div className="flex items-center justify-between mb-3">
              <p className="text-xs font-semibold text-zinc-500 uppercase tracking-widest">
                Mon inventaire
              </p>
              {tokens.length > 0 && (
                <span className="text-xs text-violet-400 font-semibold bg-violet-500/10 px-2 py-0.5 rounded-full">
                  {tokens.length} pass
                </span>
              )}
            </div>

            {loading ? (
              <div className="space-y-3">
                {[0, 1].map((i) => (
                  <div key={i} className="h-36 rounded-2xl bg-zinc-900/60 animate-pulse" />
                ))}
              </div>
            ) : (
              <div className="space-y-3">
                {tokens.length > 0
                  ? tokens.map((token) => (
                    <TokenCard
                      key={token.id}
                      variant="token"
                      token={token}
                      onActivate={() => handleActivate(token.id)}
                    />
                  ))
                  : (
                    <TokenCard
                      variant="empty"
                      onBuy={() => setCheckoutOpen(true)}
                    />
                  )}
              </div>
            )}
          </motion.section>

          {/* Bouton acheter si déjà des tokens */}
          {!loading && tokens.length > 0 && (
            <motion.button
              custom={3} variants={fadeUp} initial="hidden" animate="visible"
              whileTap={{ scale: 0.97 }}
              onClick={() => setCheckoutOpen(true)}
              className="w-full flex items-center justify-center gap-2 border border-violet-500/20 hover:border-violet-500/40 text-violet-400 hover:text-violet-300 font-semibold py-3 rounded-2xl text-sm transition-all"
            >
              + Acheter un autre pass
            </motion.button>
          )}

          {/* ── HISTORIQUE ── */}
          <motion.section custom={4} variants={fadeUp} initial="hidden" animate="visible">
            <div className="flex items-center gap-2 mb-3">
              <Trophy size={14} className="text-zinc-500" />
              <p className="text-xs font-semibold text-zinc-500 uppercase tracking-widest">
                Mes archives
              </p>
            </div>

            {loading ? (
              <div className="h-20 rounded-2xl bg-zinc-900/60 animate-pulse" />
            ) : sessions.length === 0 ? (
              <div className="glass rounded-2xl p-6 text-center">
                <p className="text-2xl mb-2">🧠</p>
                <p className="text-sm font-semibold text-zinc-400">Ta mémoire est encore intacte.</p>
                <p className="text-xs text-zinc-600 mt-1">Tes parties terminées apparaîtront ici.</p>
              </div>
            ) : (
              <div className="space-y-2">
                {sessions.map((session) =>
                  session.is_completed ? (
                    /* ── Session terminée ── */
                    <div
                      key={session.id}
                      className="glass rounded-2xl px-4 py-3 flex items-center justify-between gap-3"
                    >
                      <div className="flex items-center gap-3 min-w-0">
                        <div className="w-8 h-8 rounded-lg bg-violet-500/10 flex items-center justify-center shrink-0">
                          <Trophy size={14} className="text-violet-400" />
                        </div>
                        <div className="min-w-0">
                          <p className="text-sm font-semibold text-white truncate">{session.team_name}</p>
                          <p className="text-xs text-zinc-500 flex items-center gap-1 mt-0.5">
                            <Clock size={10} />
                            {new Date(session.start_time).toLocaleDateString('fr-CH')}
                            {' · '}{session.city}
                          </p>
                        </div>
                      </div>
                      <div className="text-right shrink-0">
                        <p className="text-sm font-black text-pink-400">{session.score} pts</p>
                        <p className="text-xs text-emerald-400 mt-0.5">Terminée ✓</p>
                        {session.final_video_url && (
                          <motion.button
                            whileTap={{ scale: 0.95 }}
                            onClick={() => router.push(`/play/${session.id}`)}
                            className="mt-1.5 text-xs font-bold text-violet-400 hover:text-violet-300 flex items-center gap-1 transition-colors"
                          >
                            🎬 Revoir mon film
                          </motion.button>
                        )}
                      </div>
                    </div>
                  ) : (
                    /* ── Session en cours → bouton Reprendre ── */
                    <motion.button
                      key={session.id}
                      whileTap={{ scale: 0.98 }}
                      whileHover={{ scale: 1.01 }}
                      onClick={() => router.push(`/play/${session.id}`)}
                      className="w-full glass rounded-2xl px-4 py-3 flex items-center justify-between border border-yellow-500/20 hover:border-yellow-400/40 transition-all"
                    >
                      <div className="flex items-center gap-3">
                        <div className="relative w-8 h-8 rounded-lg bg-yellow-500/15 flex items-center justify-center">
                          <Play size={14} className="text-yellow-400" />
                          <span className="absolute -top-1 -right-1 w-2.5 h-2.5 rounded-full bg-yellow-400 animate-pulse" />
                        </div>
                        <div className="text-left">
                          <p className="text-sm font-semibold text-white">{session.team_name}</p>
                          <p className="text-xs text-zinc-500 flex items-center gap-1 mt-0.5">
                            <Clock size={10} />
                            {new Date(session.start_time).toLocaleDateString('fr-CH')}
                            {' · '}{session.city}
                          </p>
                        </div>
                      </div>
                      <div className="text-right shrink-0">
                        <p className="text-sm font-black text-yellow-400">{session.score} pts</p>
                        <p className="text-xs text-yellow-500 font-bold mt-0.5 flex items-center gap-1 justify-end">
                          ▶ Reprendre
                        </p>
                      </div>
                    </motion.button>
                  )
                )}
              </div>
            )}
          </motion.section>

          {/* ── SÉCURITÉ ── */}
          <motion.section custom={5} variants={fadeUp} initial="hidden" animate="visible">
            <div className="flex items-center gap-2 mb-3">
              <Lock size={14} className="text-zinc-500" />
              <p className="text-xs font-semibold text-zinc-500 uppercase tracking-widest">
                Sécurité
              </p>
            </div>
            <div className="glass rounded-2xl p-4 flex gap-2">
              <div className="relative flex-1">
                <Lock size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-zinc-500 pointer-events-none" />
                <input
                  type="password"
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  onKeyDown={(e) => e.key === 'Enter' && handlePasswordUpdate()}
                  placeholder="Nouveau mot de passe"
                  minLength={6}
                  className="w-full bg-zinc-800/60 border border-white/10 rounded-xl pl-9 pr-3 py-2.5 text-white placeholder:text-zinc-600 text-sm focus:outline-none focus:border-violet-500/50 focus:ring-1 focus:ring-violet-500/20 transition-all"
                />
              </div>
              <motion.button
                whileTap={{ scale: 0.95 }}
                onClick={handlePasswordUpdate}
                disabled={pwdLoading || newPassword.length < 6}
                className="bg-violet-600 hover:bg-violet-500 disabled:opacity-40 text-white font-bold px-4 py-2.5 rounded-xl text-sm transition-colors flex items-center gap-1.5 shrink-0"
              >
                {pwdLoading ? <Loader2 size={15} className="animate-spin" /> : 'Mettre à jour'}
              </motion.button>
            </div>
          </motion.section>

        </div>

        {/* ── CHECKOUT DRAWER ── */}
        <CheckoutDrawer
          isOpen={checkoutOpen}
          onClose={() => setCheckoutOpen(false)}
          onSuccess={fetchData}
          city="Sion"
          price="29 CHF"
        />
      </div>
    </div>
  )
}
