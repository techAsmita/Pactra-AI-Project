import React from 'react'
import { cn } from '@/lib/utils'

type InputValidation = 'default' | 'success' | 'error' | 'warning'

interface InputProps extends Omit<React.InputHTMLAttributes<HTMLInputElement>, 'size'> {
  label: string
  helperText?: string
  validation?: InputValidation
  hideLabel?: boolean
}

const validationStyles: Record<InputValidation, string> = {
  default: 'border-border-default focus:border-border-focus',
  success: 'border-success focus:border-success',
  error: 'border-crimson focus:border-crimson',
  warning: 'border-amber focus:border-amber',
}

const helperTextStyles: Record<InputValidation, string> = {
  default: 'text-text-muted',
  success: 'text-success',
  error: 'text-crimson',
  warning: 'text-amber',
}

export const Input = React.forwardRef<HTMLInputElement, InputProps>(
  (
    {
      label,
      helperText,
      validation = 'default',
      hideLabel = false,
      id,
      className,
      ...props
    },
    ref,
  ) => {
    const inputId = id || `input-${label.toLowerCase().replace(/\s+/g, '-')}`
    const helperId = helperText ? `${inputId}-helper` : undefined

    return (
      <div className="flex flex-col gap-2 w-full">
        <label
          htmlFor={inputId}
          className={cn(
            'text-small font-medium text-text-secondary font-body',
            hideLabel && 'sr-only',
          )}
        >
          {label}
        </label>
        <input
          ref={ref}
          id={inputId}
          aria-describedby={helperId}
          aria-invalid={validation === 'error'}
          className={cn(
            'h-12 w-full rounded-input px-4',
            'bg-bg-surface border text-text-primary font-body text-body',
            'placeholder:text-text-muted',
            'transition-all duration-fast',
            'focus:outline-none focus:ring-2 focus:ring-border-focus/20',
            'disabled:opacity-40 disabled:cursor-not-allowed',
            validationStyles[validation],
            className,
          )}
          {...props}
        />
        {helperText && (
          <p
            id={helperId}
            className={cn('text-caption font-body', helperTextStyles[validation])}
          >
            {helperText}
          </p>
        )}
      </div>
    )
  },
)

Input.displayName = 'Input'
