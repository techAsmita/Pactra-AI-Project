import React from 'react'
import { cn } from '@/lib/utils'

type SkeletonVariant = 'text' | 'card' | 'table' | 'chart' | 'circle' | 'custom'

interface SkeletonProps {
  variant?: SkeletonVariant
  className?: string
  lines?: number // for 'text' variant
  height?: string // for 'custom'
  width?: string  // for 'custom'
}

const Line: React.FC<{ className?: string }> = ({ className }) => (
  <div className={cn('h-4 rounded shimmer', className)} aria-hidden="true" />
)

export const Skeleton: React.FC<SkeletonProps> = ({
  variant = 'text',
  className,
  lines = 3,
  height,
  width,
}) => {
  if (variant === 'text') {
    return (
      <div className={cn('flex flex-col gap-3', className)} aria-busy="true" aria-label="Loading">
        {Array.from({ length: lines }).map((_, i) => (
          <Line key={i} className={i === lines - 1 ? 'w-3/4' : 'w-full'} />
        ))}
      </div>
    )
  }

  if (variant === 'card') {
    return (
      <div className={cn('rounded-card bg-bg-secondary border border-border-default p-6', className)}
        aria-busy="true" aria-label="Loading">
        <div className="flex items-start gap-4 mb-4">
          <div className="w-10 h-10 rounded-full shimmer shrink-0" aria-hidden="true" />
          <div className="flex-1 flex flex-col gap-2">
            <Line className="w-1/2" />
            <Line className="w-3/4" />
          </div>
        </div>
        <div className="flex flex-col gap-2">
          <Line />
          <Line />
          <Line className="w-4/5" />
        </div>
      </div>
    )
  }

  if (variant === 'table') {
    return (
      <div className={cn('flex flex-col gap-3', className)} aria-busy="true" aria-label="Loading">
        {Array.from({ length: 5 }).map((_, i) => (
          <div key={i} className="h-12 rounded shimmer" aria-hidden="true" />
        ))}
      </div>
    )
  }

  if (variant === 'chart') {
    return (
      <div className={cn('rounded-card bg-bg-secondary border border-border-default p-6 h-64', className)}
        aria-busy="true" aria-label="Loading">
        <div className="h-5 w-1/3 rounded shimmer mb-6" aria-hidden="true" />
        <div className="flex items-end gap-3 h-36">
          {[60, 80, 45, 90, 65, 75, 50].map((h, i) => (
            <div key={i} className="flex-1 rounded shimmer" style={{ height: `${h}%` }} aria-hidden="true" />
          ))}
        </div>
      </div>
    )
  }

  if (variant === 'circle') {
    return (
      <div
        className={cn('rounded-full shimmer', className)}
        style={{ width: width || '48px', height: height || '48px' }}
        aria-hidden="true"
      />
    )
  }

  // custom
  return (
    <div
      className={cn('rounded shimmer', className)}
      style={{ height: height || '16px', width: width || '100%' }}
      aria-hidden="true"
    />
  )
}
