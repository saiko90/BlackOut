'use client'

import { AnimatePresence, motion } from 'framer-motion'
import { CheckCircle, XCircle, Info, X } from 'lucide-react'
import { useToastStore } from '@/store/toastStore'
import { cn } from '@/lib/utils'

const icons = {
  success: <CheckCircle size={16} className="text-emerald-400 shrink-0" />,
  error:   <XCircle    size={16} className="text-red-400    shrink-0" />,
  info:    <Info       size={16} className="text-cyan-400   shrink-0" />,
}

const styles = {
  success: 'bg-zinc-900 border-emerald-500/30',
  error:   'bg-zinc-900 border-red-500/30',
  info:    'bg-zinc-900 border-cyan-500/30',
}

export function ToastContainer() {
  const { toasts, removeToast } = useToastStore()

  return (
    <div className="fixed top-4 inset-x-0 z-[200] flex flex-col items-center gap-2 pointer-events-none px-4">
      <AnimatePresence>
        {toasts.map((toast) => (
          <motion.div
            key={toast.id}
            layout
            initial={{ opacity: 0, y: -20, scale: 0.95 }}
            animate={{ opacity: 1, y: 0,   scale: 1 }}
            exit={{    opacity: 0, y: -16,  scale: 0.9 }}
            transition={{ type: 'spring', damping: 24, stiffness: 300 }}
            className={cn(
              'pointer-events-auto flex items-center gap-3 w-full max-w-sm',
              'px-4 py-3 rounded-2xl border shadow-xl',
              styles[toast.type]
            )}
          >
            {icons[toast.type]}
            <p className="flex-1 text-sm text-zinc-200 font-medium">{toast.message}</p>
            <button
              onClick={() => removeToast(toast.id)}
              className="text-zinc-500 hover:text-zinc-300 transition-colors"
            >
              <X size={14} />
            </button>
          </motion.div>
        ))}
      </AnimatePresence>
    </div>
  )
}
