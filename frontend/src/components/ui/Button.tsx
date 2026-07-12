import React from 'react'
import { cn } from '@/lib/utils'
import { Loader2 } from 'lucide-react'

export type ButtonVariant = 'primary' | 'secondary' | 'ghost' | 'danger'
export type ButtonSize = 'sm' | 'md' | 'lg'

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: ButtonVariant
  size?: ButtonSize
  loading?: boolean
  icon?: React.ReactNode
  iconPosition?: 'left' | 'right'
}

const variantStyles: Record<ButtonVariant, string> = {
  primary: [
    'bg-brand text-white',
    'hover:bg-brand-hover hover:-translate-y-px',
    'active:bg-brand-pressed active:scale-[0.98]',
    'disabled:bg-brand disabled:opacity-40',
    'focus-visible:ring-2 focus-visible:ring-brand focus-visible:ring-offset-2 focus-visible:ring-offset-bg-primary',
  ].join(' '),
  secondary: [
    'bg-transparent text-text-primary border border-border-default',
    'hover:bg-bg-surface hover:border-border-hover',
    'active:scale-[0.98]',
    'disabled:opacity-40',
    'focus-visible:ring-2 focus-visible:ring-brand focus-visible:ring-offset-2 focus-visible:ring-offset-bg-primary',
  ].join(' '),
  ghost: [
    'bg-transparent text-text-secondary',
    'hover:bg-bg-surface hover:text-text-primary',
    'active:scale-[0.98]',
    'disabled:opacity-40',
    'focus-visible:ring-2 focus-visible:ring-brand focus-visible:ring-offset-2 focus-visible:ring-offset-bg-primary',
  ].join(' '),
  danger: [
    'bg-crimson text-white',
    'hover:bg-crimson-deep hover:-translate-y-px',
    'active:scale-[0.98]',
    'disabled:opacity-40',
    'focus-visible:ring-2 focus-visible:ring-crimson focus-visible:ring-offset-2 focus-visible:ring-offset-bg-primary',
  ].join(' '),
}

const sizeStyles: Record<ButtonSize, string> = {
  sm: 'h-9 px-4 text-small font-medium gap-2',
  md: 'h-11 px-5 text-small font-medium gap-2',
  lg: 'h-[52px] px-6 text-body font-medium gap-3',
}

export const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  (
    {
      variant = 'primary',
      size = 'md',
      loading = false,
      icon,
      iconPosition = 'left',
      disabled,
      children,
      className,
      ...props
    },
    ref,
  ) => {
    const isDisabled = disabled || loading

    return (
      <button
        ref={ref}
        disabled={isDisabled}
        aria-busy={loading}
        aria-disabled={isDisabled}
        className={cn(
          'inline-flex items-center justify-center rounded-btn',
          'font-body transition-all duration-fast',
          'cursor-pointer select-none whitespace-nowrap',
          'disabled:cursor-not-allowed disabled:pointer-events-none',
          variantStyles[variant],
          sizeStyles[size],
          className,
        )}
        {...props}
      >
        {loading ? (
          <>
            <Loader2 size={16} className="animate-spin shrink-0" aria-hidden="true" />
            <span>{children}</span>
          </>
        ) : (
          <>
            {icon && iconPosition === 'left' && (
              <span className="shrink-0" aria-hidden="true">{icon}</span>
            )}
            {children && <span>{children}</span>}
            {icon && iconPosition === 'right' && (
              <span className="shrink-0" aria-hidden="true">{icon}</span>
            )}
          </>
        )}
      </button>
    )
  },
)

Button.displayName = 'Button'
