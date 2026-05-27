'use client'

import { useCallback, useEffect, useRef, useState } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import {
  Trophy, Share2, Download, Home, Loader2, AlertCircle,
  Film, Timer, Star,
} from 'lucide-react'
import type { GameSession } from '@/lib/supabase/types'
import { SION_SCENARIO } from '@/lib/game/sion-scenario'

/* ── Messages humoristiques pendant le rendu ── */
const LOADING_MESSAGES = [
  'Analyse de votre dignité...',
  'Application de filtres pour cacher la misère...',
  'Compilation des dossiers compromettants...',
  'Estimation des dégâts collatéraux...',
  'Sélection des pires moments...',
  'Conversion en preuves irréfutables...',
  'Vérification du niveau de honte sur 10...',
  'Montage des séquences traumatisantes...',
  'Ajout de la bande son dramatique...',
  'Consultation de votre psychiatre...',
  'Certification du chef-d\'œuvre...',
  'Envoi au service juridique...',
]

type RenderPhase = 'idle' | 'rendering' | 'done' | 'failed'

type VictoryScreenProps = {
  session: GameSession
  onHome: () => void
}

/* ── Utilitaire : durée formatée ── */
function formatDuration(startIso: string, endIso?: string | null): string {
  const start = new Date(startIso).getTime()
  const end   = endIso ? new Date(endIso).getTime() : Date.now()
  const secs  = Math.max(0, Math.floor((end - start) / 1000))
  const h = Math.floor(secs / 3600)
  const m = Math.floor((secs % 3600) / 60)
  const s = secs % 60
  return h > 0
    ? `${h}h ${String(m).padStart(2,'0')}min`
    : `${String(m).padStart(2,'0')}min ${String(s).padStart(2,'0')}s`
}

export function VictoryScreen({ session, onHome }: VictoryScreenProps) {
  const [phase, setPhase]           = useState<RenderPhase>('idle')
  const [renderId, setRenderId]     = useState<string | null>(null)
  const [videoUrl, setVideoUrl]     = useState<string | null>(null)
  const [errorMsg, setErrorMsg]     = useState<string | null>(null)
  const [msgIndex, setMsgIndex]     = useState(0)
  const [shared, setShared]         = useState(false)
  const pollingRef                  = useRef<ReturnType<typeof setInterval> | null>(null)

  /* ── Lancer le rendu au montage ── */
  useEffect(() => {
    const startRender = async () => {
      setPhase('rendering')
      try {
        const res = await fetch('/api/video/render', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ session_id: session.id }),
        })
        const data = await res.json()
        if (!res.ok) throw new Error(data.error ?? `HTTP ${res.status} — réponse inattendue`)
        setRenderId(data.render_id)
      } catch (err: unknown) {
        setErrorMsg(err instanceof Error ? err.message : 'Erreur inconnue')
        setPhase('failed')
      }
    }
    startRender()
  }, [session.id])

  /* ── Polling statut ── */
  useEffect(() => {
    if (!renderId || phase !== 'rendering') return

    pollingRef.current = setInterval(async () => {
      try {
        const res  = await fetch(`/api/video/status/${renderId}`)
        const data = await res.json()

        if (data.status === 'done' && data.url) {
          clearInterval(pollingRef.current!)
          setVideoUrl(data.url)
          setPhase('done')
        } else if (data.status === 'failed') {
          clearInterval(pollingRef.current!)
          setErrorMsg(data.error ?? 'Le rendu vidéo a échoué côté Shotstack.')
          setPhase('failed')
        }
        // queued / fetching / rendering → on continue de poller
      } catch (err) {
        // Erreur réseau passagère — on réessaie au prochain tick
        console.warn('[VictoryScreen] polling error (retry next tick):', err)
      }
    }, 3000)

    return () => { if (pollingRef.current) clearInterval(pollingRef.current) }
  }, [renderId, phase])

  /* ── Rotation des messages humoristiques ── */
  useEffect(() => {
    if (phase !== 'rendering') return
    const id = setInterval(() => setMsgIndex((i) => (i + 1) % LOADING_MESSAGES.length), 3000)
    return () => clearInterval(id)
  }, [phase])

  /* ── Partage natif ── */
  const handleShare = useCallback(async () => {
    if (!videoUrl) return
    const shareData = {
      title: 'Black Out ! — Mon film compromettant',
      text:  `💀 Je viens de survivre à Black Out ! Sion — ${session.score} pts\n#BlackOutSion`,
      url:   videoUrl,
    }
    try {
      if (navigator.share) {
        await navigator.share(shareData)
      } else {
        await navigator.clipboard.writeText(`${shareData.text}\n${shareData.url}`)
      }
      setShared(true)
      setTimeout(() => setShared(false), 3000)
    } catch { /* annulé par l'utilisateur */ }
  }, [videoUrl, session.score])

  /* ── Téléchargement ── */
  const handleDownload = useCallback(() => {
    if (!videoUrl) return
    const a = document.createElement('a')
    a.href     = videoUrl
    a.download = `blackout-${session.team_name.replace(/\s+/g, '-')}-${Date.now()}.mp4`
    a.click()
  }, [videoUrl, session.team_name])

  return (
    <div className="relative w-full h-dvh bg-zinc-950 flex flex-col overflow-hidden">

      {/* Ambiance de fond */}
      <div aria-hidden className="pointer-events-none absolute inset-0 overflow-hidden">
        <motion.div
          animate={{ scale: [1, 1.25, 1], opacity: [0.12, 0.22, 0.12] }}
          transition={{ repeat: Infinity, duration: 4, ease: 'easeInOut' }}
          className="absolute top-1/3 left-1/2 -translate-x-1/2 -translate-y-1/2 w-80 h-80 rounded-full bg-violet-600/20 blur-3xl"
        />
        <div className="absolute bottom-0 inset-x-0 h-1/3 bg-gradient-to-t from-zinc-950 to-transparent" />
      </div>

      <div className="relative z-10 flex flex-col flex-1 overflow-y-auto px-5 pt-14 pb-10 gap-5">

        {/* ── HEADER ── */}
        <motion.div
          initial={{ opacity: 0, y: -12 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center"
        >
          <div className="w-20 h-20 rounded-3xl bg-gradient-to-br from-violet-600 to-cyan-500 mx-auto flex items-center justify-center shadow-[0_0_50px_rgba(124,58,237,.5)] mb-4">
            <Trophy size={40} className="text-white" />
          </div>
          <p className="text-xs font-bold text-cyan-400 uppercase tracking-widest mb-1">Mission accomplie</p>
          <h1 className="text-4xl font-black text-white tracking-tight leading-none">
            BLACK<br />OUT !
          </h1>
          <p className="text-zinc-500 text-sm mt-2">
            {session.team_name} · {session.city}
          </p>
        </motion.div>

        {/* ── STATS ── */}
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.15 }}
          className="grid grid-cols-3 gap-3"
        >
          {[
            { icon: Star,   value: `${session.score}`,                         label: 'pts',       color: 'text-violet-400' },
            { icon: Timer,  value: formatDuration(session.start_time, session.end_time), label: 'durée', color: 'text-cyan-400'   },
            { icon: Trophy, value: `${SION_SCENARIO.length}`,                  label: 'étapes',    color: 'text-amber-400' },
          ].map(({ icon: Icon, value, label, color }) => (
            <div key={label} className="glass rounded-2xl px-3 py-4 flex flex-col items-center gap-1">
              <Icon size={16} className={color} />
              <p className={`text-xl font-black ${color}`}>{value}</p>
              <p className="text-xs text-zinc-600">{label}</p>
            </div>
          ))}
        </motion.div>

        {/* ── ZONE VIDÉO / LOADER ── */}
        <AnimatePresence mode="wait">

          {/* Phase : rendu en cours */}
          {(phase === 'rendering' || phase === 'idle') && (
            <motion.div
              key="rendering"
              initial={{ opacity: 0, scale: 0.97 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="glass rounded-2xl overflow-hidden"
            >
              {/* Faux écran cinéma */}
              <div className="relative bg-zinc-900 aspect-video flex flex-col items-center justify-center gap-4 p-6">
                <div
                  aria-hidden
                  className="absolute inset-0 bg-[repeating-linear-gradient(0deg,transparent,transparent_3px,rgba(0,0,0,.08)_3px,rgba(0,0,0,.08)_4px)]"
                />
                <motion.div
                  animate={{ rotate: 360 }}
                  transition={{ repeat: Infinity, duration: 2, ease: 'linear' }}
                  className="relative z-10"
                >
                  <Film size={36} className="text-violet-400" />
                </motion.div>
                <AnimatePresence mode="wait">
                  <motion.p
                    key={msgIndex}
                    initial={{ opacity: 0, y: 8 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -8 }}
                    transition={{ duration: 0.35 }}
                    className="relative z-10 text-center text-sm text-zinc-300 font-medium"
                  >
                    {LOADING_MESSAGES[msgIndex]}
                  </motion.p>
                </AnimatePresence>
              </div>

              {/* Barre de progression indéfinie */}
              <div className="px-5 py-4 border-t border-white/5">
                <div className="flex items-center justify-between mb-2">
                  <p className="text-xs font-semibold text-zinc-400">Génération de votre film compromettant</p>
                  <Loader2 size={14} className="text-violet-400 animate-spin" />
                </div>
                <div className="h-1.5 bg-zinc-800 rounded-full overflow-hidden">
                  <motion.div
                    animate={{ x: ['-100%', '200%'] }}
                    transition={{ repeat: Infinity, duration: 1.8, ease: 'easeInOut' }}
                    className="h-full w-1/3 bg-gradient-to-r from-violet-600 to-cyan-400 rounded-full"
                  />
                </div>
                <p className="text-xs text-zinc-600 mt-2 text-center">
                  Temps estimé : 30 à 120 secondes
                </p>
              </div>
            </motion.div>
          )}

          {/* Phase : vidéo prête */}
          {phase === 'done' && videoUrl && (
            <motion.div
              key="done"
              initial={{ opacity: 0, scale: 0.96 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ type: 'spring', damping: 22 }}
              className="flex flex-col gap-4"
            >
              {/* Player vidéo */}
              <div className="rounded-2xl overflow-hidden shadow-[0_0_30px_rgba(34,211,238,.25)]">
                {/* eslint-disable-next-line jsx-a11y/media-has-caption */}
                <video
                  src={videoUrl}
                  controls
                  autoPlay
                  loop
                  playsInline
                  className="w-full rounded-2xl border-2 border-cyan-500/60 shadow-[0_0_24px_rgba(34,211,238,.3)]"
                />
              </div>

              {/* CTA viral */}
              <motion.button
                whileTap={{ scale: 0.96 }}
                onClick={handleShare}
                className="relative w-full flex flex-col items-center justify-center gap-1 bg-gradient-to-r from-cyan-600 to-violet-600 text-white font-black py-5 rounded-2xl overflow-hidden shadow-[0_0_30px_rgba(34,211,238,.3)]"
              >
                <span aria-hidden className="absolute inset-0 animate-pulse bg-white/5" />
                <span className="relative flex items-center gap-2 text-base">
                  {shared ? '✓ Lien copié !' : <><Share2 size={18} /> CAP OU PAS CAP ? Partager</>}
                </span>
                <span className="relative text-xs text-white/70 font-normal">Télécharger et partager sur vos réseaux</span>
              </motion.button>

              {/* Bouton télécharger */}
              <motion.button
                whileTap={{ scale: 0.97 }}
                onClick={handleDownload}
                className="w-full flex items-center justify-center gap-2 border border-white/10 hover:border-white/20 text-zinc-400 hover:text-white font-semibold py-3 rounded-2xl text-sm transition-all"
              >
                <Download size={15} />
                Télécharger le fichier MP4
              </motion.button>

              {/* Marketing viral */}
              <div className="glass rounded-2xl p-4 text-center">
                <p className="text-xs text-zinc-400 leading-relaxed">
                  Partage cette vidéo <span className="text-white font-semibold">en public</span> avec le hashtag{' '}
                  <span className="text-cyan-400 font-bold">#BlackOutSion</span> et tag{' '}
                  <span className="text-violet-400 font-bold">@BlackOutGame</span> pour participer au{' '}
                  <span className="text-white font-semibold">tirage au sort mensuel</span>{' '}
                  <span className="text-amber-400 font-bold">(bon de 50 CHF 🎁)</span>
                </p>
              </div>
            </motion.div>
          )}

          {/* Phase : erreur */}
          {phase === 'failed' && (
            <motion.div
              key="failed"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="glass rounded-2xl p-6 flex flex-col items-center gap-4 text-center border border-red-500/20"
            >
              <AlertCircle size={36} className="text-red-400" />
              <div>
                <p className="font-bold text-white">La génération a échoué</p>
                <p className="text-xs text-red-300 mt-2 font-mono bg-red-950/30 rounded-lg px-3 py-2 text-left break-all">
                  {errorMsg ?? 'Erreur inconnue'}
                </p>
              </div>
              <p className="text-xs text-zinc-600">
                Vérifie que <code className="text-zinc-400">SHOTSTACK_API_KEY</code> et{' '}
                <code className="text-zinc-400">SUPABASE_SERVICE_ROLE_KEY</code> sont renseignés dans{' '}
                <code className="text-zinc-400">.env.local</code>.
              </p>
            </motion.div>
          )}
        </AnimatePresence>

        {/* ── Retour dashboard (toujours visible) ── */}
        <motion.button
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.4 }}
          whileTap={{ scale: 0.97 }}
          onClick={onHome}
          className="w-full flex items-center justify-center gap-2 border border-white/8 text-zinc-500 hover:text-white font-semibold py-3.5 rounded-2xl text-sm transition-all"
        >
          <Home size={15} />
          Retour au tableau de bord
        </motion.button>

      </div>
    </div>
  )
}
