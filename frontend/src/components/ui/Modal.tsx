import React, { useEffect, useRef } from 'react'
import { createPortal } from 'react-dom'
import { motion, AnimatePresence } from 'framer-motion'
import { X } from 'lucide-react'
import { cn } from '@/lib/utils'
import { Button } from './Button'

interface ModalProps {
  open: boolean
  onClose: () => void
  title: string
  description?: string
  children: React.ReactNode
  size?: 'sm' | 'md' | 'lg'
  className?: string
}

const sizeMap = { sm: 'max-w-md', md: 'max-w-lg', lg: 'max-w-2xl' }

export const Modal: React.FC<ModalProps> = ({
  open, onClose, title, description, children, size = 'md', className,
}) => {
  const closeRef = useRef<HTMLButtonElement>(null)
  const titleId = `modal-title-${title.replace(/\s+/g, '-').toLowerCase()}`

  // Focus management + Esc key
  useEffect(() => {
    if (!open) return
    closeRef.current?.focus()
    const handleKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose()
    }
    document.addEventListener('keydown', handleKey)
    document.body.style.overflow = 'hidden'
    return () => {
      document.removeEventListener('keydown', handleKey)
      document.body.style.overflow = ''
    }
  }, [open, onClose])

  return createPortal(
    <AnimatePresence>
      {open && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.15 }}
            className="fixed inset-0 z-40 bg-bg-primary/60 backdrop-blur-sm"
            onClick={onClose}
            aria-hidden="true"
          />
          {/* Modal */}
          <motion.div
            role="dialog"
            aria-modal="true"
            aria-labelledby={titleId}
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            transition={{ duration: 0.25, ease: [0, 0, 0.2, 1] }}
            className={cn(
              'fixed inset-0 z-50 flex items-center justify-center p-4',
              'pointer-events-none',
            )}
          >
            <div className={cn(
              'relative w-full pointer-events-auto',
              'bg-bg-secondary rounded-modal border border-border-default shadow-elv-4',
              'p-6',
              sizeMap[size],
              className,
            )}>
              <div className="flex items-start justify-between gap-4 mb-4">
                <div>
                  <h2 id={titleId} className="font-heading text-h4 text-text-primary">
                    {title}
                  </h2>
                  {description && (
                    <p className="text-small text-text-muted font-body mt-1">{description}</p>
                  )}
                </div>
                <Button
                  ref={closeRef}
                  variant="ghost"
                  size="sm"
                  onClick={onClose}
                  aria-label="Close dialog"
                  className="shrink-0 -mr-1 -mt-1"
                  icon={<X size={16} />}
                />
              </div>
              {children}
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>,
    document.body,
  )
}
