'use client'

import { useEffect, useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { X } from 'lucide-react'
import { supabase } from '@/lib/supabase/client'
import { AuthOverlay } from '@/components/auth/AuthOverlay'

export const WELCOME_PROMO_CODE = 'BIENVENUE10'

export function PromoBanner() {
  const [loggedIn, setLoggedIn] = useState<boolean | null>(null)
  const [dismissed, setDismissed] = useState(false)
  const [authOpen, setAuthOpen] = useState(false)

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setLoggedIn(!!session?.user)
    })
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setLoggedIn(!!session?.user)
    })
    return () => subscription.unsubscribe()
  }, [])

  const visible = loggedIn === false && !dismissed

  return (
    <>
      <AnimatePresence>
        {visible && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="sticky top-0 z-30 overflow-hidden"
          >
            <div className="relative flex items-center gap-2 bg-amber-400 text-zinc-900 px-4 py-2.5">
              <button
                onClick={() => setAuthOpen(true)}
                className="flex-1 text-left text-xs font-bold leading-snug"
              >
                🎁 -10% sur ta 1ère partie en créant un compte — code <span className="underline">{WELCOME_PROMO_CODE}</span>
              </button>
              <button
                onClick={() => setDismissed(true)}
                aria-label="Fermer"
                className="shrink-0 p-1 -m-1 text-zinc-900/60 hover:text-zinc-900 transition-colors"
              >
                <X size={15} />
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <AuthOverlay
        isOpen={authOpen}
        onClose={() => setAuthOpen(false)}
        onSuccess={() => setAuthOpen(false)}
        initialMode="signup"
      />
    </>
  )
}
