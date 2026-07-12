import React, { useEffect, useRef } from 'react'
import { createPortal } from 'react-dom'
import { motion, AnimatePresence } from 'framer-motion'
import { X } from 'lucide-react'
import { cn } from '@/lib/utils'
import { Button } from './Button'

interface DrawerProps {
  open: boolean
  onClose: () => void
  title: string
  children: React.ReactNode
  className?: string
}

export const Drawer: React.FC<DrawerProps> = ({ open, onClose, title, children, className }) => {
  const closeRef = useRef<HTMLButtonElement>(null)
  const titleId = `drawer-${title.replace(/\s+/g, '-').toLowerCase()}`

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
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.15 }}
            className="fixed inset-0 z-40 bg-bg-primary/60 backdrop-blur-sm"
            onClick={onClose}
            aria-hidden="true"
          />
          {/* Desktop/Tablet: right panel */}
          <motion.div
            role="dialog"
            aria-modal="true"
            aria-labelledby={titleId}
            initial={{ x: '100%', opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            exit={{ x: '100%', opacity: 0 }}
            transition={{ duration: 0.3, ease: [0, 0, 0.2, 1] }}
            className={cn(
              'fixed top-0 right-0 bottom-0 z-50',
              'w-full tablet:w-1/2 desktop:w-2/5',
              'bg-bg-secondary border-l border-border-default shadow-elv-4',
              'flex flex-col',
              // Mobile: bottom sheet
              'max-tablet:top-auto max-tablet:bottom-0 max-tablet:right-0 max-tablet:left-0 max-tablet:w-full max-tablet:h-[85vh] max-tablet:rounded-t-drawer',
              className,
            )}
          >
            <div className="flex items-center justify-between p-6 border-b border-border-default shrink-0">
              <h2 id={titleId} className="font-heading text-h4 text-text-primary">{title}</h2>
              <Button
                ref={closeRef}
                variant="ghost"
                size="sm"
                onClick={onClose}
                aria-label="Close"
                icon={<X size={16} />}
              />
            </div>
            <div className="flex-1 overflow-y-auto p-6">
              {children}
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>,
    document.body,
  )
}
