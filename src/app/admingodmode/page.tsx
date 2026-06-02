'use client'

import { useEffect, useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import {
  Users, UserPlus, Ticket, TrendingUp, Gamepad2,
  Trophy, BarChart3, RefreshCw, ArrowLeft, Lock,
  Eye, EyeOff, Loader2, Activity, CheckCircle,
} from 'lucide-react'
import { useGameStore } from '@/store/gameStore'
import { getAdminStats } from '@/app/actions/admin'
import type { AdminStats } from '@/app/actions/admin'

const ADMIN_EMAIL  = 'm.kaeser90@gmail.com'
// Mot de passe stocké côté client — sécurité par obscurité uniquement.
// Combine URL secrète + mot de passe pour un accès suffisant en production.
const GATE_PASSWORD = 'Sw1zz@ppcoding'

/* ── Carte statistique ── */
function StatCard({
  icon: Icon,
  label,
  value,
  sub,
  color = 'text-violet-400',
  bg    = 'bg-violet-500/10',
  border = 'border-violet-500/20',
}: {
  icon: React.ElementType
  label: string
  value: string | number
  sub?: string
  color?: string
  bg?: string
  border?: string
}) {
  return (
    <div className={`glass rounded-2xl p-4 border ${border} flex flex-col gap-3`}>
      <div className={`w-9 h-9 rounded-xl ${bg} border ${border} flex items-center justify-center`}>
        <Icon size={17} className={color} />
      </div>
      <div>
        <p className={`text-2xl font-black ${color}`}>{value}</p>
        <p className="text-xs font-semibold text-white mt-0.5">{label}</p>
        {sub && <p className="text-[10px] text-zinc-600 mt-0.5">{sub}</p>}
      </div>
    </div>
  )
}

/* ── Badge état session ── */
function SessionBadge({ completed, step }: { completed: boolean; step: number }) {
  if (completed) {
    return (
      <span className="inline-flex items-center gap-1 text-[10px] font-bold text-emerald-400 bg-emerald-500/10 border border-emerald-500/20 px-2 py-0.5 rounded-full">
        <CheckCircle size={9} /> Terminée
      </span>
    )
  }
  return (
    <span className="inline-flex items-center gap-1 text-[10px] font-bold text-yellow-400 bg-yellow-500/10 border border-yellow-500/20 px-2 py-0.5 rounded-full">
      <Activity size={9} className="animate-pulse" /> Étape {step}
    </span>
  )
}

/* ── Porte mot de passe ── */
function PasswordGate({ onUnlock }: { onUnlock: () => void }) {
  const [input, setInput]   = useState('')
  const [show, setShow]     = useState(false)
  const [error, setError]   = useState(false)

  const attempt = () => {
    if (input === GATE_PASSWORD) {
      onUnlock()
    } else {
      setError(true)
      setInput('')
      setTimeout(() => setError(false), 2000)
    }
  }

  return (
    <div className="flex justify-center min-h-dvh bg-zinc-950 items-center">
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="w-full max-w-sm mx-4"
      >
        <div className="text-center mb-8">
          <div className="w-16 h-16 rounded-2xl bg-amber-500/10 border border-amber-500/20 flex items-center justify-center mx-auto mb-4">
            <Lock size={28} className="text-amber-400" />
          </div>
          <h1 className="text-2xl font-black text-white">Zone restreinte</h1>
          <p className="text-zinc-500 text-sm mt-1">Accès administrateur uniquement</p>
        </div>

        <div className="glass rounded-2xl p-5 space-y-3">
          <div className="relative">
            <input
              type={show ? 'text' : 'password'}
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && attempt()}
              placeholder="Mot de passe"
              autoFocus
              className={`w-full bg-zinc-800/60 border rounded-xl px-4 py-3 pr-12 text-white placeholder:text-zinc-600 text-sm focus:outline-none transition-all ${
                error
                  ? 'border-red-500/60 focus:border-red-500'
                  : 'border-white/10 focus:border-amber-500/50 focus:ring-1 focus:ring-amber-500/20'
              }`}
            />
            <button
              type="button"
              onClick={() => setShow(!show)}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-zinc-500 hover:text-zinc-300 transition-colors"
            >
              {show ? <EyeOff size={16} /> : <Eye size={16} />}
            </button>
          </div>

          <AnimatePresence>
            {error && (
              <motion.p
                initial={{ opacity: 0, y: -4 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0 }}
                className="text-xs text-red-400 text-center"
              >
                Mot de passe incorrect.
              </motion.p>
            )}
          </AnimatePresence>

          <motion.button
            whileTap={{ scale: 0.97 }}
            onClick={attempt}
            className="w-full py-3 rounded-xl bg-amber-500 hover:bg-amber-400 text-zinc-900 font-bold text-sm transition-colors"
          >
            Déverrouiller
          </motion.button>
        </div>

        <Link
          href="/"
          className="flex items-center justify-center gap-1.5 mt-6 text-xs text-zinc-600 hover:text-zinc-400 transition-colors"
        >
          <ArrowLeft size={12} /> Retour à l&apos;accueil
        </Link>
      </motion.div>
    </div>
  )
}

/* ── Page principale ── */
export default function AdminPage() {
  const router = useRouter()
  const { user } = useGameStore()

  const [unlocked, setUnlocked] = useState(false)
  const [stats, setStats]       = useState<AdminStats | null>(null)
  const [loading, setLoading]   = useState(false)
  const [error, setError]       = useState<string | null>(null)
  const [lastRefresh, setLastRefresh] = useState<Date | null>(null)

  const isAdmin = user?.email === ADMIN_EMAIL

  /* Admin = accès direct sans mot de passe */
  useEffect(() => {
    if (isAdmin) setUnlocked(true)
  }, [isAdmin])

  const fetchStats = async () => {
    setLoading(true)
    setError(null)
    const result = await getAdminStats()
    if ('error' in result) {
      setError(result.error)
    } else {
      setStats(result)
      setLastRefresh(new Date())
    }
    setLoading(false)
  }

  useEffect(() => {
    if (unlocked) fetchStats()
  }, [unlocked])

  /* ── Porte mot de passe pour les non-admins ── */
  if (!unlocked) {
    return <PasswordGate onUnlock={() => setUnlocked(true)} />
  }

  return (
    <div className="flex justify-center min-h-dvh bg-zinc-950">
      <div className="relative w-full max-w-md bg-zinc-950 min-h-dvh overflow-x-hidden">

        {/* Ambient glow */}
        <div aria-hidden className="pointer-events-none fixed inset-0 overflow-hidden">
          <div className="absolute -top-20 left-1/2 -translate-x-1/2 w-80 h-80 rounded-full bg-amber-500/8 blur-3xl" />
          <div className="absolute top-1/2 -right-20 w-64 h-64 rounded-full bg-violet-600/8 blur-3xl" />
        </div>

        <div className="relative z-10 px-4 pt-12 pb-12 space-y-6">

          {/* ── RETOUR ── */}
          <button
            onClick={() => router.push('/dashboard')}
            className="inline-flex items-center gap-1.5 text-zinc-500 hover:text-zinc-300 transition-colors text-sm font-medium"
          >
            <ArrowLeft size={16} />
            Dashboard
          </button>

          {/* ── HEADER ── */}
          <div className="flex items-start justify-between">
            <div>
              <div className="flex items-center gap-2 mb-1">
                <span className="text-xl">⚡</span>
                <h1 className="text-2xl font-black text-white tracking-tight">God Mode</h1>
              </div>
              <p className="text-xs text-zinc-500">
                {lastRefresh
                  ? `Mis à jour à ${lastRefresh.toLocaleTimeString('fr-CH', { hour: '2-digit', minute: '2-digit' })}`
                  : 'Chargement des stats…'}
              </p>
            </div>
            <motion.button
              whileTap={{ scale: 0.9 }}
              onClick={fetchStats}
              disabled={loading}
              className="flex items-center gap-1.5 text-xs text-zinc-400 hover:text-amber-400 border border-white/8 hover:border-amber-500/30 bg-white/3 hover:bg-amber-500/5 px-3 py-2 rounded-xl transition-all disabled:opacity-40"
            >
              <RefreshCw size={13} className={loading ? 'animate-spin' : ''} />
              Actualiser
            </motion.button>
          </div>

          {/* ── ERREUR ── */}
          {error && (
            <div className="bg-red-950/40 border border-red-500/30 rounded-2xl px-4 py-3 text-sm text-red-400">
              {error}
            </div>
          )}

          {/* ── SKELETON / STATS ── */}
          {loading && !stats ? (
            <div className="grid grid-cols-2 gap-3">
              {Array.from({ length: 8 }).map((_, i) => (
                <div key={i} className="h-28 rounded-2xl bg-zinc-900/60 animate-pulse" />
              ))}
            </div>
          ) : stats ? (
            <>
              {/* ── Grille stats ── */}
              <motion.div
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                className="grid grid-cols-2 gap-3"
              >
                <StatCard
                  icon={Users}
                  label="Comptes créés"
                  value={stats.totalUsers}
                  sub="Total inscriptions"
                  color="text-violet-400"
                  bg="bg-violet-500/10"
                  border="border-violet-500/20"
                />
                <StatCard
                  icon={UserPlus}
                  label="Nouveaux aujourd'hui"
                  value={stats.usersToday}
                  sub={new Date().toLocaleDateString('fr-CH')}
                  color="text-cyan-400"
                  bg="bg-cyan-500/10"
                  border="border-cyan-500/20"
                />
                <StatCard
                  icon={Ticket}
                  label="Pass vendus"
                  value={stats.totalPasses}
                  sub={`dont ${stats.usedPasses} activés · ${stats.passesToday} auj.`}
                  color="text-pink-400"
                  bg="bg-pink-500/10"
                  border="border-pink-500/20"
                />
                <StatCard
                  icon={TrendingUp}
                  label="CA estimé"
                  value={`${stats.estimatedRevenueCHF} CHF`}
                  sub={`${stats.totalPasses} × 29 CHF`}
                  color="text-amber-400"
                  bg="bg-amber-500/10"
                  border="border-amber-500/20"
                />
                <StatCard
                  icon={Gamepad2}
                  label="Sessions actives"
                  value={stats.activeSessions}
                  sub="En cours maintenant"
                  color="text-yellow-400"
                  bg="bg-yellow-500/10"
                  border="border-yellow-500/20"
                />
                <StatCard
                  icon={Trophy}
                  label="Parties terminées"
                  value={stats.completedSessions}
                  sub={
                    stats.activeSessions + stats.completedSessions > 0
                      ? `${Math.round((stats.completedSessions / (stats.activeSessions + stats.completedSessions)) * 100)}% taux complétion`
                      : '—'
                  }
                  color="text-emerald-400"
                  bg="bg-emerald-500/10"
                  border="border-emerald-500/20"
                />
              </motion.div>

              {/* ── Activité récente ── */}
              {stats.recentSessions.length > 0 && (
                <motion.section
                  initial={{ opacity: 0, y: 12 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.1 }}
                >
                  <p className="text-xs font-semibold text-zinc-500 uppercase tracking-widest mb-3">
                    Activité récente
                  </p>
                  <div className="space-y-2">
                    {stats.recentSessions.map((s) => (
                      <div
                        key={s.id}
                        className="glass rounded-xl px-4 py-3 flex items-center justify-between gap-3"
                      >
                        <div className="min-w-0">
                          <p className="text-sm font-semibold text-white truncate">{s.team_name}</p>
                          <p className="text-xs text-zinc-500 mt-0.5">
                            {s.city} · {new Date(s.start_time).toLocaleDateString('fr-CH', {
                              day: '2-digit', month: '2-digit',
                            })}
                          </p>
                        </div>
                        <div className="flex flex-col items-end gap-1 shrink-0">
                          <SessionBadge completed={s.is_completed} step={s.current_step} />
                          <span className="text-xs font-black text-violet-400">{s.score} pts</span>
                        </div>
                      </div>
                    ))}
                  </div>
                </motion.section>
              )}

              {/* ── Placeholder Vercel Analytics ── */}
              <motion.section
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
              >
                <p className="text-xs font-semibold text-zinc-500 uppercase tracking-widest mb-3">
                  Trafic Visiteurs
                </p>
                <div className="glass rounded-2xl border border-dashed border-zinc-700 p-6 flex flex-col items-center justify-center gap-3 text-center min-h-[160px]">
                  <div className="w-10 h-10 rounded-xl bg-zinc-800 border border-zinc-700 flex items-center justify-center">
                    <BarChart3 size={20} className="text-zinc-500" />
                  </div>
                  <div>
                    <p className="text-sm font-semibold text-zinc-400">Vercel Analytics</p>
                    <p className="text-xs text-zinc-600 mt-1 leading-relaxed">
                      Intègre le composant{' '}
                      <code className="text-zinc-500 bg-zinc-800 px-1.5 py-0.5 rounded text-[10px]">&lt;Analytics /&gt;</code>{' '}
                      de <span className="text-zinc-500">@vercel/analytics</span> ici.
                    </p>
                  </div>
                </div>
              </motion.section>
            </>
          ) : null}

          {/* ── Loader refresh ── */}
          {loading && stats && (
            <div className="flex items-center justify-center gap-2 text-xs text-zinc-500 py-2">
              <Loader2 size={12} className="animate-spin" />
              Actualisation…
            </div>
          )}

        </div>
      </div>
    </div>
  )
}
