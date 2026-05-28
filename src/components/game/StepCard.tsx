'use client'

import { useRef, useState } from 'react'
import { motion } from 'framer-motion'
import {
  Camera, Video, Mic, Type,
  Send, Upload, SkipForward, Loader2, Navigation, Smartphone, MapPin,
} from 'lucide-react'
import type { Step } from '@/lib/game/sion-scenario'
import { cn } from '@/lib/utils'
import { getDistanceFromLatLonInM } from '@/lib/game/gps'
import { useToastStore } from '@/store/toastStore'

const TYPE_META = {
  photo: { icon: Camera, label: 'Photo requise',  color: 'text-cyan-400',   bg: 'bg-cyan-500/10 border-cyan-500/20' },
  video: { icon: Video,  label: 'Vidéo requise',  color: 'text-violet-400', bg: 'bg-violet-500/10 border-violet-500/20' },
  text:  { icon: Type,   label: 'Réponse texte',  color: 'text-amber-400',  bg: 'bg-amber-500/10 border-amber-500/20' },
  audio: { icon: Mic,    label: 'Audio requis',   color: 'text-emerald-400',bg: 'bg-emerald-500/10 border-emerald-500/20' },
}

const GPS_RADIUS_M = 80

type StepCardProps = {
  step: Step
  isUploading: boolean
  onTextSubmit: (answer: string) => void
  onFileSelected: (file: File) => void
  onAbandon: () => void
}

export function StepCard({ step, isUploading, onTextSubmit, onFileSelected, onAbandon }: StepCardProps) {
  const { addToast } = useToastStore()
  const [textAnswer, setTextAnswer] = useState('')
  const [filePreview, setFilePreview] = useState<string | null>(null)
  const [selectedFile, setSelectedFile] = useState<File | null>(null)
  const [isCheckingGps, setIsCheckingGps] = useState(false)
  const fileInputRef = useRef<HTMLInputElement>(null)

  const meta = TYPE_META[step.type]
  const Icon = meta.icon

  /* ── Vérification GPS ── */
  const verifyLocation = (): Promise<boolean> => {
    if (process.env.NODE_ENV === 'development') return Promise.resolve(true)

    return new Promise((resolve) => {
      if (!navigator.geolocation) {
        addToast('La géolocalisation n\'est pas supportée par ce navigateur.', 'error')
        resolve(false)
        return
      }

      setIsCheckingGps(true)
      navigator.geolocation.getCurrentPosition(
        (position) => {
          setIsCheckingGps(false)
          const [targetLat, targetLon] = step.gpsCoordinates.split(',').map(Number)
          const distance = Math.round(
            getDistanceFromLatLonInM(
              position.coords.latitude, position.coords.longitude,
              targetLat, targetLon,
            )
          )
          if (distance <= GPS_RADIUS_M) {
            resolve(true)
          } else {
            addToast(`Tricheur ! Tu es encore à ${distance} m du lieu exact. Rapproche-toi ! 📍`, 'error')
            resolve(false)
          }
        },
        (err) => {
          setIsCheckingGps(false)
          if (err.code === err.PERMISSION_DENIED) {
            addToast('Veuillez autoriser la géolocalisation pour valider ce défi.', 'error')
          } else {
            addToast('Impossible d\'obtenir votre position GPS. Réessayez.', 'error')
          }
          resolve(false)
        },
        { enableHighAccuracy: true, timeout: 10_000, maximumAge: 0 },
      )
    })
  }

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return
    setSelectedFile(file)
    setFilePreview(URL.createObjectURL(file))
  }

  const handleFileSubmit = () => {
    if (selectedFile) onFileSelected(selectedFile)
  }

  const handleOpenCamera = async () => {
    const ok = await verifyLocation()
    if (ok) fileInputRef.current?.click()
  }

  const handleTextSubmit = async () => {
    if (!textAnswer.trim()) return
    const ok = await verifyLocation()
    if (ok) onTextSubmit(textAnswer.trim())
  }

  return (
    <div className="flex flex-col h-full px-4 py-4 gap-4 overflow-y-auto">

      {/* ── Badge type ── */}
      <motion.div
        initial={{ opacity: 0, x: -12 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ delay: 0.1 }}
      >
        <span className={cn('inline-flex items-center gap-1.5 text-xs font-bold px-3 py-1.5 rounded-full border', meta.bg, meta.color)}>
          <Icon size={12} />
          {meta.label}
        </span>
      </motion.div>

      {/* ── Titre ── */}
      <motion.div
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.15 }}
      >
        <h2 className="text-2xl font-black text-white tracking-tight">{step.title}</h2>
      </motion.div>

      {/* ── Carte instruction ── */}
      <motion.div
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.22 }}
        className="glass rounded-2xl p-5 flex-1"
      >
        <p className="text-sm font-semibold text-zinc-300 uppercase tracking-widest mb-3">
          Mission
        </p>
        <p className="text-base text-white leading-relaxed whitespace-pre-line">
          {step.instruction}
        </p>
      </motion.div>

      {/* ── Bouton GPS ── */}
      <motion.a
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.28 }}
        whileTap={{ scale: 0.97 }}
        href={`https://www.google.com/maps/dir/?api=1&destination=${step.gpsCoordinates}`}
        target="_blank"
        rel="noopener noreferrer"
        className="flex items-center justify-center gap-2.5 bg-pink-600/15 border border-pink-500/30 hover:bg-pink-600/25 text-pink-400 font-bold py-3.5 rounded-2xl text-sm transition-all"
      >
        <Navigation size={16} />
        📍 M&apos;y emmener (Google Maps)
      </motion.a>

      {/* ── Zone input ── */}
      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
        className="space-y-3"
      >
        {/* TEXT */}
        {step.type === 'text' && (
          <>
            <div className="relative">
              <input
                type="text"
                value={textAnswer}
                onChange={(e) => setTextAnswer(e.target.value)}
                onKeyDown={(e) => { if (e.key === 'Enter') handleTextSubmit() }}
                placeholder="Ta réponse…"
                className="w-full bg-zinc-800/60 border border-white/10 rounded-2xl px-5 py-4 text-white placeholder:text-zinc-600 text-base focus:outline-none focus:border-violet-500/50 focus:ring-1 focus:ring-violet-500/20 transition-all pr-14"
              />
              <motion.button
                whileTap={{ scale: 0.9 }}
                disabled={!textAnswer.trim() || isCheckingGps}
                onClick={handleTextSubmit}
                className="absolute right-3 top-1/2 -translate-y-1/2 w-9 h-9 bg-violet-600 disabled:opacity-30 rounded-xl flex items-center justify-center text-white transition-colors"
              >
                {isCheckingGps ? <Loader2 size={15} className="animate-spin" /> : <Send size={15} />}
              </motion.button>
            </div>
            {isCheckingGps && (
              <p className="text-xs text-zinc-500 flex items-center gap-1.5 px-1">
                <MapPin size={11} className="animate-pulse text-pink-500" />
                Vérification de la position…
              </p>
            )}
          </>
        )}

        {/* PHOTO / VIDEO */}
        {(step.type === 'photo' || step.type === 'video') && (
          <>
            {/* Badge orientation verticale */}
            <motion.div
              animate={{ opacity: [0.7, 1, 0.7] }}
              transition={{ repeat: Infinity, duration: 2.4, ease: 'easeInOut' }}
              className="flex items-center gap-2 bg-yellow-500/10 border border-yellow-500/50 rounded-xl px-3 py-2"
            >
              <Smartphone size={13} className="text-yellow-400 shrink-0" />
              <p className="text-xs font-semibold text-yellow-400">
                📱 Filmez à la verticale pour un meilleur rendu final !
              </p>
            </motion.div>

            {/* Input caché */}
            <input
              ref={fileInputRef}
              type="file"
              accept={step.type === 'photo' ? 'image/*' : 'video/*'}
              capture="environment"
              className="hidden"
              onChange={handleFileChange}
            />

            {/* Aperçu */}
            {filePreview && (
              <div className="relative rounded-2xl overflow-hidden aspect-video bg-zinc-900">
                {step.type === 'photo' ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img src={filePreview} alt="preview" className="w-full h-full object-cover" />
                ) : (
                  <video src={filePreview} className="w-full h-full object-cover" controls />
                )}
              </div>
            )}

            {!filePreview ? (
              <motion.button
                whileTap={{ scale: 0.97 }}
                disabled={isCheckingGps}
                onClick={handleOpenCamera}
                className={cn(
                  'w-full flex flex-col items-center justify-center gap-2 py-8 rounded-2xl border-2 border-dashed transition-all disabled:opacity-60',
                  step.type === 'photo'
                    ? 'border-cyan-500/30 hover:border-cyan-500/60 text-cyan-400 hover:bg-cyan-500/5'
                    : 'border-violet-500/30 hover:border-violet-500/60 text-violet-400 hover:bg-violet-500/5'
                )}
              >
                {isCheckingGps ? (
                  <>
                    <MapPin size={32} className="animate-pulse text-pink-500" />
                    <span className="font-bold text-sm text-pink-400">Vérification de la position…</span>
                    <span className="text-xs opacity-60">Localisation GPS en cours</span>
                  </>
                ) : (
                  <>
                    <Icon size={32} />
                    <span className="font-bold text-sm">
                      {step.type === 'photo' ? 'Ouvrir l\'appareil photo' : 'Filmer la scène'}
                    </span>
                    <span className="text-xs opacity-60">Appuyez pour ouvrir la caméra</span>
                  </>
                )}
              </motion.button>
            ) : (
              <div className="flex gap-2">
                <motion.button
                  whileTap={{ scale: 0.96 }}
                  onClick={() => { setFilePreview(null); setSelectedFile(null) }}
                  className="flex-1 py-3.5 rounded-2xl border border-white/10 text-zinc-400 font-semibold text-sm hover:bg-white/5 transition-colors"
                >
                  Reprendre
                </motion.button>
                <motion.button
                  whileTap={{ scale: 0.96 }}
                  onClick={handleFileSubmit}
                  disabled={isUploading}
                  className={cn(
                    'flex-[2] py-3.5 rounded-2xl font-bold text-sm flex items-center justify-center gap-2 transition-colors',
                    step.type === 'photo'
                      ? 'bg-cyan-600 hover:bg-cyan-500 text-white'
                      : 'bg-violet-600 hover:bg-violet-500 text-white glow-violet'
                  )}
                >
                  {isUploading
                    ? <><Loader2 size={16} className="animate-spin" /> Envoi en cours…</>
                    : <><Upload size={16} /> Valider et envoyer</>
                  }
                </motion.button>
              </div>
            )}
          </>
        )}

        {/* Bouton abandonner */}
        <motion.button
          whileTap={{ scale: 0.96 }}
          onClick={onAbandon}
          disabled={isUploading}
          className="w-full flex items-center justify-center gap-2 py-3 rounded-2xl border border-red-500/20 text-red-500/70 hover:text-red-400 hover:border-red-500/40 text-xs font-semibold transition-all disabled:opacity-30"
        >
          <SkipForward size={14} />
          Abandonner ce défi (Roulette de la Honte)
        </motion.button>
      </motion.div>
    </div>
  )
}
