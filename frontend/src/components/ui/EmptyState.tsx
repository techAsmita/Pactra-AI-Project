import React from 'react'
import { motion } from 'framer-motion'
import { cn } from '@/lib/utils'
import { Button } from './Button'
import { FileText } from 'lucide-react'

interface EmptyStateProps {
  headline: string
  description?: string
  ctaLabel?: string
  onCta?: () => void
  icon?: React.ReactNode
  className?: string
}

export const EmptyState: React.FC<EmptyStateProps> = ({
  headline,
  description,
  ctaLabel,
  onCta,
  icon,
  className,
}) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, ease: [0, 0, 0.2, 1] }}
      className={cn(
        'flex flex-col items-center justify-center text-center',
        'py-20 px-6 gap-6',
        className,
      )}
    >
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.4, delay: 0.05, ease: [0, 0, 0.2, 1] }}
        className="w-20 h-20 rounded-full bg-brand/8 border border-brand/15 flex items-center justify-center text-brand"
        aria-hidden="true"
      >
        {icon || <FileText size={40} strokeWidth={1.5} />}
      </motion.div>
      <div className="flex flex-col gap-2 max-w-sm">
        <h3 className="font-heading text-h4 text-text-primary">{headline}</h3>
        {description && (
          <p className="font-body text-body text-text-secondary">{description}</p>
        )}
      </div>
      {ctaLabel && onCta && (
        <Button variant="primary" size="lg" onClick={onCta}>
          {ctaLabel}
        </Button>
      )}
    </motion.div>
  )
}
