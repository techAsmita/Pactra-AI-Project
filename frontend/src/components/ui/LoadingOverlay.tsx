import React from 'react'
import { cn } from '@/lib/utils'
import { Loader2 } from 'lucide-react'

interface LoadingOverlayProps {
  visible: boolean
  message?: string
  fullScreen?: boolean
}

export const LoadingOverlay: React.FC<LoadingOverlayProps> = ({
  visible,
  message,
  fullScreen = false,
}) => {
  if (!visible) return null

  return (
    <div
      role="status"
      aria-live="polite"
      aria-label={message || 'Loading'}
      className={cn(
        'flex flex-col items-center justify-center gap-4',
        'bg-bg-primary/80 backdrop-blur-sm z-50',
        fullScreen ? 'fixed inset-0' : 'absolute inset-0 rounded-card',
      )}
    >
      <Loader2 size={32} className="text-brand animate-spin" aria-hidden="true" />
      {message && (
        <p className="text-small text-text-secondary font-body">{message}</p>
      )}
    </div>
  )
}
