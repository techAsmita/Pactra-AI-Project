import React from 'react'
import { cn } from '@/lib/utils'
import { ChevronDown } from 'lucide-react'

interface SelectOption {
  value: string
  label: string
}

interface SelectProps extends Omit<React.SelectHTMLAttributes<HTMLSelectElement>, 'size'> {
  label: string
  options: SelectOption[]
  helperText?: string
  placeholder?: string
}

export const Select = React.forwardRef<HTMLSelectElement, SelectProps>(
  ({ label, options, helperText, placeholder, id, className, ...props }, ref) => {
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
            className={cn(
              'h-12 w-full rounded-input px-4 pr-10 appearance-none',
              'bg-bg-surface border border-border-default text-text-primary font-body text-body',
              'transition-all duration-fast cursor-pointer',
              'focus:outline-none focus:border-border-focus focus:ring-2 focus:ring-border-focus/20',
              'disabled:opacity-40 disabled:cursor-not-allowed',
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
        {helperText && <p className="text-caption text-text-muted font-body">{helperText}</p>}
      </div>
    )
  },
)

Select.displayName = 'Select'
