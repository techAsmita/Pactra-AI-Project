import React, { createContext, useContext, useCallback, useState } from 'react'
import { createPortal } from 'react-dom'
import { motion, AnimatePresence } from 'framer-motion'
import { CheckCircle, AlertTriangle, XCircle, Info, X } from 'lucide-react'
import { cn } from '@/lib/utils'
import type { Toast as ToastType, ToastType as ToastVariant } from '@/types'

// ─── Toast item component ──────────────────────────────────────────────────

const iconMap: Record<ToastVariant, React.ReactNode> = {
  success: <CheckCircle size={16} aria-hidden="true" />,
  warning: <AlertTriangle size={16} aria-hidden="true" />,
  error: <XCircle size={16} aria-hidden="true" />,
  info: <Info size={16} aria-hidden="true" />,
}

const styleMap: Record<ToastVariant, { border: string; icon: string }> = {
  success: { border: 'border-l-success', icon: 'text-success' },
  warning: { border: 'border-l-amber', icon: 'text-amber' },
  error: { border: 'border-l-crimson', icon: 'text-crimson' },
  info: { border: 'border-l-brand', icon: 'text-brand' },
}

interface ToastItemProps {
  toast: ToastType
  onDismiss: (id: string) => void
}

const ToastItem: React.FC<ToastItemProps> = ({ toast, onDismiss }) => {
  React.useEffect(() => {
    const timer = setTimeout(() => onDismiss(toast.id), toast.duration ?? 3000)
    return () => clearTimeout(timer)
  }, [toast, onDismiss])

  const styles = styleMap[toast.type]

  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 16, scale: 0.97 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      exit={{ opacity: 0, y: 8, scale: 0.97 }}
      transition={{ duration: 0.25, ease: [0, 0, 0.2, 1] }}
      role="status"
      aria-live="polite"
      className={cn(
        'flex items-start gap-3 p-4 pr-10 relative',
        'bg-bg-secondary border border-border-default border-l-4 rounded-card shadow-elv-3',
        'min-w-[320px] max-w-sm',
        styles.border,
      )}
      onClick={() => onDismiss(toast.id)}
    >
      <span className={cn('shrink-0 mt-0.5', styles.icon)}>{iconMap[toast.type]}</span>
      <p className="text-small text-text-primary font-body">{toast.message}</p>
      <button
        onClick={(e) => { e.stopPropagation(); onDismiss(toast.id) }}
        aria-label="Dismiss notification"
        className="absolute top-3 right-3 text-text-muted hover:text-text-primary transition-colors duration-fast"
      >
        <X size={14} />
      </button>
    </motion.div>
  )
}

// ─── Toast context ─────────────────────────────────────────────────────────

interface ToastContextValue {
  toast: (message: string, type?: ToastVariant, duration?: number) => void
}

const ToastContext = createContext<ToastContextValue | null>(null)

export const ToastProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [toasts, setToasts] = useState<ToastType[]>([])

  const dismiss = useCallback((id: string) => {
    setToasts((prev) => prev.filter((t) => t.id !== id))
  }, [])

  const addToast = useCallback((message: string, type: ToastVariant = 'info', duration = 3000) => {
    const id = `toast-${Date.now()}-${Math.random()}`
    setToasts((prev) => [...prev, { id, type, message, duration }])
  }, [])

  return (
    <ToastContext.Provider value={{ toast: addToast }}>
      {children}
      {createPortal(
        <div
          aria-label="Notifications"
          className="fixed bottom-4 right-4 z-[100] flex flex-col gap-2 items-end"
        >
          <AnimatePresence mode="popLayout">
            {toasts.map((t) => (
              <ToastItem key={t.id} toast={t} onDismiss={dismiss} />
            ))}
          </AnimatePresence>
        </div>,
        document.body,
      )}
    </ToastContext.Provider>
  )
}

export const useToast = (): ToastContextValue => {
  const ctx = useContext(ToastContext)
  if (!ctx) throw new Error('useToast must be used within ToastProvider')
  return ctx
}
