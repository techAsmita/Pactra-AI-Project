import React from 'react'
import { cn } from '@/lib/utils'
import { ChevronDown } from 'lucide-react'

type SelectValidation = 'default' | 'success' | 'error' | 'warning'

interface SelectOption {
  value: string
  label: string
}

interface SelectProps extends Omit<React.SelectHTMLAttributes<HTMLSelectElement>, 'size'> {
  label: string
  options: SelectOption[]
  helperText?: string
  placeholder?: string
  validation?: SelectValidation
}

const validationStyles: Record<SelectValidation, string> = {
  default: 'border-border-default focus:border-border-focus',
  success: 'border-success focus:border-success',
  error: 'border-crimson focus:border-crimson',
  warning: 'border-amber focus:border-amber',
}

const helperTextStyles: Record<SelectValidation, string> = {
  default: 'text-text-muted',
  success: 'text-success',
  error: 'text-crimson',
  warning: 'text-amber',
}

export const Select = React.forwardRef<HTMLSelectElement, SelectProps>(
  ({ label, options, helperText, placeholder, validation = 'default', id, className, ...props }, ref) => {
    const selectId = id || `select-${label.toLowerCase().replace(/\s+/g, '-')}`
    return (
      <div className="flex flex-col gap-2 w-full">
        <label htmlFor={selectId} className="text-small font-medium text-text-secondary font-body">
          {label}
        </label>
        <div className="relative">
          <select
            ref={ref}
            id={selectId}
            aria-invalid={validation === 'error'}
            className={cn(
              'h-12 w-full rounded-input px-4 pr-10 appearance-none',
              'bg-bg-surface border text-text-primary font-body text-body',
              'transition-all duration-fast cursor-pointer',
              'focus:outline-none focus:ring-2 focus:ring-border-focus/20',
              'disabled:opacity-40 disabled:cursor-not-allowed',
              validationStyles[validation],
              className,
            )}
            {...props}
          >
            {placeholder && <option value="" disabled>{placeholder}</option>}
            {options.map((opt) => (
              <option key={opt.value} value={opt.value} className="bg-bg-secondary">
                {opt.label}
              </option>
            ))}
          </select>
          <ChevronDown
            size={16}
            aria-hidden="true"
            className="absolute right-3 top-1/2 -translate-y-1/2 text-text-muted pointer-events-none"
          />
        </div>
        {helperText && <p className={cn('text-caption font-body', helperTextStyles[validation])}>{helperText}</p>}
      </div>
    )
  },
)

Select.displayName = 'Select'
