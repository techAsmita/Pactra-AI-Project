import React from 'react'
import { cn } from '@/lib/utils'

export type CardVariant = 'default' | 'elevated' | 'interactive' | 'status'
type StatusColor = 'indigo' | 'success' | 'amber' | 'crimson'

interface CardProps extends React.HTMLAttributes<HTMLDivElement> {
  variant?: CardVariant
  statusColor?: StatusColor
  noPadding?: boolean
}

const statusBorderColors: Record<StatusColor, string> = {
  indigo: 'border-l-brand',
  success: 'border-l-success',
  amber: 'border-l-amber',
  crimson: 'border-l-crimson',
}

export const Card = React.forwardRef<HTMLDivElement, CardProps>(
  ({ variant = 'default', statusColor, noPadding = false, children, className, onClick, onKeyDown, ...props }, ref) => {
    const isInteractive = variant === 'interactive' && Boolean(onClick)

    const handleKeyDown = (e: React.KeyboardEvent<HTMLDivElement>) => {
      onKeyDown?.(e)
      if (isInteractive && (e.key === 'Enter' || e.key === ' ')) {
        e.preventDefault()
        ;(onClick as React.MouseEventHandler<HTMLDivElement>)(e as unknown as React.MouseEvent<HTMLDivElement>)
      }
    }

    return (
      <div
        ref={ref}
        onClick={onClick}
        onKeyDown={isInteractive ? handleKeyDown : onKeyDown}
        role={isInteractive ? 'button' : props.role}
        tabIndex={isInteractive ? 0 : props.tabIndex}
        className={cn(
          'rounded-card bg-bg-secondary border border-border-default',
          !noPadding && 'p-6',
          variant === 'default' && 'shadow-elv-1',
          variant === 'elevated' && 'shadow-elv-2',
          variant === 'interactive' && [
            'shadow-elv-1 cursor-pointer',
            'transition-all duration-normal',
            'hover:-translate-y-0.5 hover:shadow-elv-3 hover:border-border-hover hover:bg-bg-card-hover',
            'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand',
          ],
          variant === 'status' && [
            'shadow-elv-1 border-l-4',
            statusColor ? statusBorderColors[statusColor] : 'border-l-border-default',
          ],
          className,
        )}
        {...props}
      >
        {children}
      </div>
    )
  },
)

Card.displayName = 'Card'
