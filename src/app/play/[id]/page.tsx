'use client'

import { useCallback, useEffect, useState } from 'react'
import { useParams, useRouter } from 'next/navigation'
import { AnimatePresence, motion } from 'framer-motion'
import { Zap } from 'lucide-react'
import { supabase } from '@/lib/supabase/client'
import { useGameStore } from '@/store/gameStore'
import { useToastStore } from '@/store/toastStore'
import { SION_SCENARIO, TOTAL_STEPS } from '@/lib/game/sion-scenario'
import { TopBar } from '@/components/game/TopBar'
import { StepCard } from '@/components/game/StepCard'
import { StepInterlude } from '@/components/game/StepInterlude'
import { RouletteModal } from '@/components/game/RouletteModal'
import { VictoryScreen } from '@/components/game/VictoryScreen'
import { IntroStoryModal } from '@/components/game/IntroStoryModal'
import type { GameSession } from '@/lib/supabase/types'

/* ── Variants swipe ── */
const SWIPE_VARIANTS = {
  enter: (dir: number) => ({ x: dir > 0 ? '100%' : '-100%', opacity: 0 }),
  center: { x: 0, opacity: 1, transition: { type: 'spring', damping: 28, stiffness: 280 } },
  exit:  (dir: number) => ({ x: dir < 0 ? '100%' : '-100%', opacity: 0, transition: { duration: 0.2 } }),
}

type GamePhase = 'loading' | 'playing' | 'uploading' | 'roulette' | 'completed'

export default function PlayPage() {
  const { id } = useParams<{ id: string }>()
  const router = useRouter()
  const { user } = useGameStore()
  const { addToast } = useToastStore()

  const [session, setSession]       = useState<GameSession | null>(null)
  const [phase, setPhase]           = useState<GamePhase>('loading')
  const [stepIndex, setStepIndex]   = useState(0)    // 0-based
  const [swipeDir, setSwipeDir]     = useState(1)
  const [score, setScore]           = useState(0)
  const [activePenalty, setPenalty] = useState('')
  const [introShown, setIntroShown]     = useState(false)
  const [showInterlude, setShowInterlude] = useState(false)

  const step = SION_SCENARIO[stepIndex]

  /* ── Charger la session ── */
  useEffect(() => {
    if (!id) return
    supabase
      .from('game_sessions')
      .select('*')
      .eq('id', id)
      .single()
      .then(({ data, error }) => {
        if (error || !data) { router.push('/dashboard'); return }
        setSession(data)
        setScore(data.score)
        setPhase('playing')
      })
  }, [id, router])

  /* ── Avancer à l'étape suivante ── */
  const advanceStep = useCallback(async (earnedPoints = 0) => {
    const newScore = score + earnedPoints
    setScore(newScore)

    // Mise à jour score en base
    await supabase
      .from('game_sessions')
      .update({ score: newScore })
      .eq('id', id)

    if (stepIndex + 1 >= SION_SCENARIO.length) {
      // Toutes les étapes du scénario sont terminées
      finishGame(newScore)
    } else {
      setSwipeDir(1)
      setShowInterlude(true)   // affiche le bridge narratif avant la mission suivante
      setStepIndex((i) => i + 1)
      setPhase('playing')
    }
  }, [score, stepIndex, id])

  /* ── Fin de partie ── */
  const finishGame = async (finalScore: number) => {
    await supabase
      .from('game_sessions')
      .update({
        end_time: new Date().toISOString(),
        score: finalScore,
        is_completed: true,
      })
      .eq('id', id)
    setPhase('completed')
  }

  /* ── Réponse texte ── */
  const handleTextSubmit = (answer: string) => {
    if (!step) return
    if (step.expectedAnswer) {
      const correct = answer.trim().toLowerCase() === step.expectedAnswer.toLowerCase()
      if (!correct) {
        setPenalty(step.penalty)
        setPhase('roulette')
        return
      }
    }
    addToast('✓ Bonne réponse !', 'success')
    advanceStep(step.points)
  }

  /* ── Upload fichier ── */
  const handleFileSelected = async (file: File) => {
    if (!session || !user || !step) return
    setPhase('uploading')

    const ext = file.name.split('.').pop() ?? 'bin'
    const path = `${user.id}/${session.id}/step_${step.id}_${Date.now()}.${ext}`

    const { error: uploadError } = await supabase.storage
      .from('game-media')
      .upload(path, file, { upsert: false })

    if (uploadError) {
      addToast('Erreur lors de l\'envoi du fichier.', 'error')
      setPhase('playing')
      return
    }

    const { data: { publicUrl } } = supabase.storage
      .from('game-media')
      .getPublicUrl(path)

    await supabase.from('media_uploads').insert({
      session_id: session.id,
      user_id: user.id,
      step_number: step.id,
      media_url: publicUrl,
      media_type: file.type.startsWith('image/') ? 'photo' : 'video',
    })

    addToast('Média envoyé ! Étape validée.', 'success')
    advanceStep(step.points)
  }

  /* ── Abandon → Roulette ── */
  const handleAbandon = () => {
    if (!step) return
    setPenalty(step.penalty)
    setPhase('roulette')
  }

  /* ── Roulette : retenter l'étape ── */
  const handleRouletteRetry = () => {
    setPhase('playing')
  }

  /* ── Roulette : sauter l'étape (0 pts) ── */
  const handleRouletteSkip = () => {
    advanceStep(0)
  }

  /* ── États de chargement ── */
  if (phase === 'loading' || !session) {
    return (
      <div className="flex justify-center min-h-dvh bg-zinc-950">
        <div className="w-full max-w-md h-dvh flex items-center justify-center">
          <motion.div animate={{ rotate: 360 }} transition={{ repeat: Infinity, duration: 1, ease: 'linear' }}>
            <Zap size={28} className="text-violet-500" />
          </motion.div>
        </div>
      </div>
    )
  }

  /* ── Fin de partie → VictoryScreen ── */
  if (phase === 'completed') {
    return (
      <div className="flex justify-center min-h-dvh bg-zinc-950">
        <div className="w-full max-w-md">
          <VictoryScreen
            session={{ ...session, score, end_time: session.end_time ?? new Date().toISOString() }}
            onHome={() => router.push('/dashboard')}
          />
        </div>
      </div>
    )
  }

  /* ── JEU ── */
  return (
    <div className="flex justify-center min-h-dvh bg-zinc-950">
      <div className="relative w-full max-w-md h-dvh bg-zinc-950 flex flex-col overflow-hidden">

        {/* TopBar fixé */}
        <TopBar
          currentStep={stepIndex + 1}
          startTime={session.start_time}
          city={session.city}
          score={score}
        />

        {/* Zone centrale */}
        <div className="relative flex-1 overflow-hidden">
          <AnimatePresence mode="wait">

            {/* ── Interlude narratif ── */}
            {step && showInterlude && (
              <motion.div
                key={`interlude-${stepIndex}`}
                initial={{ opacity: 0, y: 40 }}
                animate={{ opacity: 1, y: 0, transition: { duration: 0.45, ease: [0.25, 0.1, 0.25, 1] } }}
                exit={{ opacity: 0, y: -20, transition: { duration: 0.25 } }}
                className="absolute inset-0"
              >
                <StepInterlude
                  step={step}
                  stepNumber={stepIndex + 1}
                  onContinue={() => setShowInterlude(false)}
                />
              </motion.div>
            )}

            {/* ── Mission (StepCard) ── */}
            {step && !showInterlude && (
              <motion.div
                key={`step-${stepIndex}`}
                custom={swipeDir}
                variants={SWIPE_VARIANTS}
                initial="enter"
                animate="center"
                exit="exit"
                className="absolute inset-0"
              >
                <StepCard
                  step={step}
                  isUploading={phase === 'uploading'}
                  onTextSubmit={handleTextSubmit}
                  onFileSelected={handleFileSelected}
                  onAbandon={handleAbandon}
                />
              </motion.div>
            )}

            {/* ── Hors scénario (ne devrait plus arriver avec 10 étapes) ── */}
            {!step && stepIndex >= SION_SCENARIO.length && (
              <motion.div
                key="beyond-scenario"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="absolute inset-0 flex flex-col items-center justify-center px-8 text-center gap-4"
              >
                <p className="text-4xl">🏁</p>
                <p className="font-bold text-white text-lg">Parcours en attente de mise à jour</p>
                <p className="text-zinc-500 text-sm">
                  Les étapes {SION_SCENARIO.length + 1}–{TOTAL_STEPS} seront disponibles bientôt.
                </p>
                <motion.button
                  whileTap={{ scale: 0.96 }}
                  onClick={() => finishGame(score)}
                  className="mt-4 bg-violet-600 text-white font-bold px-8 py-3.5 rounded-2xl glow-violet"
                >
                  Terminer la partie
                </motion.button>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Overlay upload */}
          <AnimatePresence>
            {phase === 'uploading' && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="absolute inset-0 bg-zinc-950/80 backdrop-blur-sm z-30 flex flex-col items-center justify-center gap-4"
              >
                <motion.div
                  animate={{ rotate: 360 }}
                  transition={{ repeat: Infinity, duration: 1, ease: 'linear' }}
                >
                  <Zap size={32} className="text-violet-400" />
                </motion.div>
                <p className="text-white font-bold">Analyse et envoi…</p>
                <p className="text-zinc-500 text-xs">Ne ferme pas l'application</p>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Intro narrative (step 1 uniquement, avant le premier défi) */}
        <IntroStoryModal
          isOpen={phase === 'playing' && stepIndex === 0 && !introShown}
          onStart={() => setIntroShown(true)}
        />

        {/* Roulette (plein écran dans le conteneur) */}
        <RouletteModal
          isOpen={phase === 'roulette'}
          penalty={activePenalty}
          onRetry={handleRouletteRetry}
          onSkipStep={handleRouletteSkip}
        />
      </div>
    </div>
  )
}
