'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { motion } from 'framer-motion'
import { Zap } from 'lucide-react'
import { supabase } from '@/lib/supabase/client'
import { useGameStore } from '@/store/gameStore'

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  const router = useRouter()
  const { setUser } = useGameStore()
  const [checking, setChecking] = useState(true)

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      if (!session?.user) {
        router.replace('/')
      } else {
        setUser(session.user)
        setChecking(false)
      }
    })
  }, [router, setUser])

  if (checking) {
    return (
      <div className="flex justify-center min-h-dvh bg-zinc-950">
        <div className="w-full max-w-md h-dvh flex items-center justify-center">
          <motion.div
            animate={{ rotate: 360 }}
            transition={{ repeat: Infinity, duration: 1, ease: 'linear' }}
          >
            <Zap size={28} className="text-violet-500" />
          </motion.div>
        </div>
      </div>
    )
  }

  return <>{children}</>
}
