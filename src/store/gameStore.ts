import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import type { User } from '@supabase/supabase-js'
import type { GameSession, Profile } from '@/lib/supabase/types'

type GameStore = {
  // Auth (in-memory uniquement, pas persisté)
  user: User | null
  profile: Profile | null
  setUser: (user: User | null) => void
  setProfile: (profile: Profile | null) => void

  // Session en cours
  currentSession: GameSession | null
  setCurrentSession: (session: GameSession | null) => void
  resetGame: () => void
}

export const useGameStore = create<GameStore>()(
  persist(
    (set) => ({
      user: null,
      profile: null,
      currentSession: null,

      setUser: (user) => set({ user }),
      setProfile: (profile) => set({ profile }),
      setCurrentSession: (session) => set({ currentSession: session }),
      resetGame: () => set({ currentSession: null }),
    }),
    {
      name: 'blackout-game',
      // Ne jamais persister user/profile (données sensibles)
      partialize: (state) => ({ currentSession: state.currentSession }),
    }
  )
)
