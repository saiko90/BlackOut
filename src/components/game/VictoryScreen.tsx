'use client'

import { useCallback, useEffect, useRef, useState } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import {
  Trophy, Share2, Download, Home, Loader2, AlertCircle,
  Film, Timer, Star, Gift, Medal,
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
  // Si la vidéo est déjà persistée en base, on saute le rendu
  const [phase, setPhase]           = useState<RenderPhase>(session.final_video_url ? 'done' : 'idle')
  const [renderId, setRenderId]     = useState<string | null>(null)
  const [videoUrl, setVideoUrl]     = useState<string | null>(session.final_video_url ?? null)
  const [errorMsg, setErrorMsg]     = useState<string | null>(null)
  const [msgIndex, setMsgIndex]     = useState(0)
  const [shared, setShared]         = useState(false)
  const [isDownloading, setIsDownloading] = useState(false)
  const pollingRef                  = useRef<ReturnType<typeof setInterval> | null>(null)

  /* ── Lancer le rendu au montage (sauf si vidéo déjà disponible) ── */
  useEffect(() => {
    if (session.final_video_url) return  // déjà persistée — pas besoin de re-render
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
  }, [session.id, session.final_video_url])

  /* ── Polling statut ── */
  useEffect(() => {
    if (!renderId || phase !== 'rendering') return

    pollingRef.current = setInterval(async () => {
      try {
        const res  = await fetch(`/api/video/status/${renderId}?session_id=${session.id}`)
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

  /* ── Hashtag dynamique selon la ville ── */
  const citySlug = session.city
    .normalize('NFD')
    .replace(/[̀-ͯ]/g, '')  // supprime les accents
    .replace(/[^a-zA-Z]/g, '')        // supprime espaces et tirets
  const cityHashtag = `#BlackOut${citySlug}`

  /* ── Partage natif ── */
  const handleShare = useCallback(async () => {
    if (!videoUrl) return
    const text = `Je viens de survivre au Black Out à ${session.city} ! 💀🍻 ${cityHashtag} @BlackOutGame`
    try {
      if (navigator.share) {
        await navigator.share({ title: 'Black Out ! — Mon film souvenir', text, url: videoUrl })
      } else {
        await navigator.clipboard.writeText(`${text}\n${videoUrl}`)
      }
      setShared(true)
      setTimeout(() => setShared(false), 3000)
    } catch { /* annulé par l'utilisateur */ }
  }, [videoUrl])

  /* ── Téléchargement blob (reste dans la PWA) ── */
  const handleDownload = useCallback(async () => {
    if (!videoUrl || isDownloading) return
    setIsDownloading(true)
    try {
      const response = await fetch(videoUrl)
      const blob     = await response.blob()
      const url      = window.URL.createObjectURL(blob)
      const a        = document.createElement('a')
      a.href         = url
      a.download     = 'BlackOut_Souvenir.mp4'
      a.click()
      window.URL.revokeObjectURL(url)
    } catch {
      // Fallback CORS : ouvre dans un nouvel onglet sans quitter la PWA
      window.open(videoUrl, '_blank')
    } finally {
      setIsDownloading(false)
    }
  }, [videoUrl, isDownloading])

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
          <p className="text-xs font-bold text-pink-400 uppercase tracking-widest mb-1">Mission accomplie</p>
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
            { icon: Timer,  value: formatDuration(session.start_time, session.end_time), label: 'durée', color: 'text-pink-400'   },
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
                    className="h-full w-1/3 bg-gradient-to-r from-violet-600 to-pink-400 rounded-full"
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
              {/* Player vidéo — format portrait 9:16 */}
              <div className="rounded-2xl overflow-hidden shadow-[0_0_30px_rgba(236,72,153,.2)] mx-auto max-w-[280px]">
                {/* eslint-disable-next-line jsx-a11y/media-has-caption */}
                <video
                  src={videoUrl}
                  controls
                  autoPlay
                  loop
                  playsInline
                  className="w-full rounded-2xl border-2 border-pink-500/60 shadow-[0_0_24px_rgba(236,72,153,.25)]"
                />
              </div>

              {/* Note 48h */}
              <p className="text-xs text-yellow-500/80 text-center font-medium">
                ⚠️ Ce film souvenir est disponible en ligne pendant 48 heures. Pensez à le télécharger !
              </p>

              {/* CTA viral */}
              <motion.button
                whileTap={{ scale: 0.96 }}
                onClick={handleShare}
                className="relative w-full flex flex-col items-center justify-center gap-1 bg-gradient-to-r from-pink-600 to-violet-600 text-white font-black py-5 rounded-2xl overflow-hidden shadow-[0_0_30px_rgba(236,72,153,.3)]"
              >
                <span aria-hidden className="absolute inset-0 animate-pulse bg-white/5" />
                <span className="relative flex items-center gap-2 text-base">
                  {shared ? '✓ Partagé !' : <><Share2 size={18} /> Partager ma vidéo</>}
                </span>
                <span className="relative text-xs text-white/70 font-normal">{cityHashtag} @BlackOutGame</span>
              </motion.button>

              {/* Bouton télécharger */}
              <motion.button
                whileTap={{ scale: 0.97 }}
                onClick={handleDownload}
                disabled={isDownloading}
                className="w-full flex items-center justify-center gap-2 border border-white/10 hover:border-white/20 text-zinc-400 hover:text-white disabled:opacity-50 font-semibold py-3 rounded-2xl text-sm transition-all"
              >
                {isDownloading
                  ? <><Loader2 size={15} className="animate-spin" /> Téléchargement en cours…</>
                  : <><Download size={15} /> Télécharger le fichier MP4</>
                }
              </motion.button>

              {/* Concours mensuel */}
              <div className="glass rounded-2xl overflow-hidden border border-amber-500/20">
                {/* Header */}
                <div className="flex items-center gap-3 px-4 pt-4 pb-3 border-b border-white/5">
                  <div className="w-9 h-9 rounded-xl bg-amber-500/15 border border-amber-500/25 flex items-center justify-center shrink-0">
                    <Medal size={18} className="text-amber-400" />
                  </div>
                  <div>
                    <p className="text-sm font-black text-white">Concours mensuel</p>
                    <p className="text-xs text-amber-400 font-semibold">La meilleure vidéo du mois</p>
                  </div>
                  <div className="ml-auto flex items-center gap-1.5 bg-amber-500/10 border border-amber-500/25 rounded-full px-3 py-1 shrink-0">
                    <Gift size={12} className="text-amber-400" />
                    <span className="text-xs font-black text-amber-300">50.- Migros</span>
                  </div>
                </div>
                {/* Body */}
                <div className="px-4 pb-4 pt-3 space-y-2">
                  <p className="text-xs text-zinc-400 leading-relaxed">
                    Partagez votre vidéo <span className="text-white font-semibold">en public</span> avec le hashtag{' '}
                    <span className="text-pink-400 font-bold">{cityHashtag}</span> et taguez{' '}
                    <span className="text-violet-400 font-bold">@BlackOutGame</span> pour participer au concours mensuel de la meilleure vidéo.
                  </p>
                  <p className="text-xs text-zinc-500 leading-relaxed">
                    🏆 Chaque mois, un bon Migros de <span className="text-white font-semibold">50.-</span> est remis au gagnant. Les résultats sont publiés sur notre page officielle et les gagnants avertis par e-mail.
                  </p>
                </div>
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
