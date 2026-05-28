'use client'

import { useEffect, useRef, useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Mic, MicOff, Loader2 } from 'lucide-react'

type DecibelMeterProps = {
  onSuccess: () => void
  onBeforeActivate?: () => Promise<boolean>
}

type MicState = 'idle' | 'requesting' | 'active' | 'denied'

const THRESHOLD_PCT  = 85    // % de volume requis
const HOLD_MS        = 1500  // durée de maintien en millisecondes
const BAR_COUNT      = 18

function volumeColor(v: number): string {
  if (v < 40) return '#a78bfa'
  if (v < 65) return '#22d3ee'
  if (v < 85) return '#f59e0b'
  return '#ef4444'
}

function volumeGlow(v: number): string {
  const c = volumeColor(v)
  const r = Math.round(v * 0.4)
  return `0 0 ${r}px ${c}88, 0 0 ${r * 2}px ${c}33`
}

export function DecibelMeter({ onSuccess, onBeforeActivate }: DecibelMeterProps) {
  const [micState, setMicState]       = useState<MicState>('idle')
  const [volume, setVolume]           = useState(0)
  const [holdProgress, setHoldProgress] = useState(0)

  const audioCtxRef   = useRef<AudioContext | null>(null)
  const analyserRef   = useRef<AnalyserNode | null>(null)
  const streamRef     = useRef<MediaStream | null>(null)
  const rafRef        = useRef<number | null>(null)
  const holdStartRef  = useRef<number | null>(null)
  const doneRef       = useRef(false)

  const stopAll = () => {
    if (rafRef.current) cancelAnimationFrame(rafRef.current)
    streamRef.current?.getTracks().forEach((t) => t.stop())
    audioCtxRef.current?.close().catch(() => {})
    audioCtxRef.current = null
    analyserRef.current = null
    streamRef.current   = null
    rafRef.current      = null
  }

  useEffect(() => () => stopAll(), [])

  const handleActivate = async () => {
    if (onBeforeActivate) {
      setMicState('requesting')
      const ok = await onBeforeActivate()
      if (!ok) { setMicState('idle'); return }
    }

    setMicState('requesting')

    let stream: MediaStream
    try {
      stream = await navigator.mediaDevices.getUserMedia({ audio: true, video: false })
    } catch {
      setMicState('denied')
      return
    }

    streamRef.current = stream
    const ctx = new AudioContext()
    audioCtxRef.current = ctx

    const analyser = ctx.createAnalyser()
    analyser.fftSize = 256
    analyserRef.current = analyser

    ctx.createMediaStreamSource(stream).connect(analyser)

    const data = new Uint8Array(analyser.frequencyBinCount)
    setMicState('active')

    const tick = () => {
      analyser.getByteFrequencyData(data)
      const avg = data.reduce((s, v) => s + v, 0) / data.length
      const pct = Math.min(100, Math.round((avg / 128) * 100))
      setVolume(pct)

      if (pct >= THRESHOLD_PCT) {
        if (!holdStartRef.current) holdStartRef.current = performance.now()
        const elapsed  = performance.now() - holdStartRef.current
        const progress = Math.min(100, (elapsed / HOLD_MS) * 100)
        setHoldProgress(progress)

        if (elapsed >= HOLD_MS && !doneRef.current) {
          doneRef.current = true
          stopAll()
          onSuccess()
          return
        }
      } else {
        holdStartRef.current = null
        setHoldProgress(0)
      }

      rafRef.current = requestAnimationFrame(tick)
    }

    rafRef.current = requestAnimationFrame(tick)
  }

  /* ── Labels dynamiques ── */
  const label =
    volume >= THRESHOLD_PCT ? '🔥 CONTINUE !!!' :
    volume > 60             ? '📢 PLUS FORT !'  :
    volume > 20             ? '🎤 CRIE !'        :
                              '🎤 Parle…'

  return (
    <div className="flex flex-col items-center gap-4 w-full">
      <AnimatePresence mode="wait">

        {/* ── IDLE ── */}
        {micState === 'idle' && (
          <motion.button
            key="idle"
            initial={{ opacity: 0, scale: 0.92 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.92 }}
            whileTap={{ scale: 0.96 }}
            onClick={handleActivate}
            className="w-full flex flex-col items-center justify-center gap-3 py-10 rounded-2xl border-2 border-dashed border-rose-500/35 text-rose-400 hover:border-rose-400/60 hover:bg-rose-500/5 transition-all"
          >
            <motion.div
              animate={{ scale: [1, 1.08, 1] }}
              transition={{ repeat: Infinity, duration: 1.8, ease: 'easeInOut' }}
              className="w-16 h-16 rounded-2xl bg-rose-500/12 border border-rose-500/25 flex items-center justify-center"
            >
              <Mic size={28} />
            </motion.div>
            <div className="text-center">
              <p className="font-bold text-sm">🎤 Activer le micro</p>
              <p className="text-xs opacity-55 mt-1">Appuyez pour commencer</p>
            </div>
          </motion.button>
        )}

        {/* ── REQUESTING ── */}
        {micState === 'requesting' && (
          <motion.div
            key="requesting"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="flex flex-col items-center gap-3 py-10"
          >
            <Loader2 size={28} className="animate-spin text-rose-400" />
            <p className="text-sm text-zinc-400">Accès au micro…</p>
          </motion.div>
        )}

        {/* ── DENIED ── */}
        {micState === 'denied' && (
          <motion.div
            key="denied"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="flex flex-col items-center gap-3 py-8 text-center"
          >
            <MicOff size={28} className="text-red-400" />
            <p className="text-sm font-semibold text-red-400">Micro refusé</p>
            <p className="text-xs text-zinc-500">Autorise le micro dans les réglages du navigateur</p>
            <motion.button
              whileTap={{ scale: 0.96 }}
              onClick={() => setMicState('idle')}
              className="mt-2 text-xs font-bold text-rose-400 border border-rose-500/30 px-4 py-2 rounded-xl hover:bg-rose-500/8 transition-colors"
            >
              Réessayer
            </motion.button>
          </motion.div>
        )}

        {/* ── ACTIVE ── */}
        {micState === 'active' && (
          <motion.div
            key="active"
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            className="w-full space-y-4"
          >
            {/* Label animé */}
            <motion.p
              key={label}
              initial={{ opacity: 0, y: -6 }}
              animate={{ opacity: 1, y: 0 }}
              className="text-center font-black text-xl text-white tracking-tight"
            >
              {label}
            </motion.p>

            {/* Jauge principale */}
            <div
              className="relative w-full h-11 bg-zinc-800/80 rounded-2xl overflow-hidden border border-white/8"
              aria-label={`Volume : ${volume}%`}
            >
              <motion.div
                className="absolute inset-y-0 left-0 rounded-2xl"
                animate={{ width: `${volume}%` }}
                transition={{ duration: 0.06, ease: 'linear' }}
                style={{
                  background: `linear-gradient(90deg, #7c3aed 0%, ${volumeColor(volume)} 100%)`,
                  boxShadow: volumeGlow(volume),
                }}
              />
              {/* Marqueur de seuil */}
              <div
                className="absolute top-0 bottom-0 w-px bg-white/50 z-10"
                style={{ left: `${THRESHOLD_PCT}%` }}
              />
              <div className="absolute inset-0 flex items-center justify-end pr-3 z-10">
                <span className="text-xs font-black text-white tabular-nums drop-shadow">
                  {volume}%
                </span>
              </div>
            </div>

            {/* Légende seuil */}
            <p className="text-xs text-zinc-500 text-right -mt-2 pr-1">
              Seuil : {THRESHOLD_PCT}%
            </p>

            {/* Barre de maintien */}
            <div className="space-y-1.5">
              <div className="flex justify-between text-xs">
                <span className="text-zinc-500">Maintien</span>
                <span className={holdProgress > 0 ? 'text-amber-400 font-bold' : 'text-zinc-600'}>
                  {holdProgress > 0
                    ? `${((holdProgress / 100) * HOLD_MS / 1000).toFixed(1)}s / ${(HOLD_MS / 1000).toFixed(1)}s`
                    : '— dépasse le seuil rouge'}
                </span>
              </div>
              <div className="w-full h-2.5 bg-zinc-800/80 rounded-full overflow-hidden">
                <motion.div
                  className="h-full rounded-full bg-gradient-to-r from-amber-500 to-red-500"
                  animate={{ width: `${holdProgress}%` }}
                  transition={{ duration: 0.1, ease: 'linear' }}
                  style={{ boxShadow: holdProgress > 0 ? '0 0 10px #f59e0b99' : 'none' }}
                />
              </div>
            </div>

            {/* Visualiseur barres */}
            <div className="flex items-end justify-center gap-1 h-14">
              {Array.from({ length: BAR_COUNT }).map((_, i) => {
                const factor = 0.25 + 0.75 * Math.abs(Math.sin((i + 1) * 1.1))
                const h = Math.max(6, volume * factor)
                return (
                  <motion.div
                    key={i}
                    className="flex-1 rounded-sm"
                    animate={{ height: `${h}%` }}
                    transition={{ duration: 0.09, ease: 'linear' }}
                    style={{
                      backgroundColor: volumeColor(volume),
                      opacity: volume > 5 ? 0.75 + factor * 0.25 : 0.2,
                      boxShadow: volume > 50 ? `0 0 4px ${volumeColor(volume)}66` : 'none',
                    }}
                  />
                )
              })}
            </div>
          </motion.div>
        )}

      </AnimatePresence>
    </div>
  )
}
