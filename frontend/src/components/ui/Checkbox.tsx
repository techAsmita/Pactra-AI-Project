import React from 'react'
import { cn } from '@/lib/utils'
import { Check } from 'lucide-react'

interface CheckboxProps extends Omit<React.InputHTMLAttributes<HTMLInputElement>, 'type'> {
  label: string
  helperText?: string
}

export const Checkbox = React.forwardRef<HTMLInputElement, CheckboxProps>(
  ({ label, helperText, id, className, ...props }, ref) => {
    const checkboxId = id || `checkbox-${label.toLowerCase().replace(/\s+/g, '-')}`
    return (
      <div className="flex flex-col gap-1">
        <div className="flex items-center gap-3">
          <div className="relative flex items-center">
            <input
              ref={ref}
              type="checkbox"
              id={checkboxId}
              className="sr-only peer"
              {...props}
            />
            <div
              aria-hidden="true"
              className={cn(
                'h-5 w-5 rounded border-2 border-border-default bg-bg-surface',
                'transition-all duration-fast',
                'peer-checked:bg-brand peer-checked:border-brand',
                'peer-focus-visible:ring-2 peer-focus-visible:ring-brand peer-focus-visible:ring-offset-2 peer-focus-visible:ring-offset-bg-primary',
                'peer-disabled:opacity-40 peer-disabled:cursor-not-allowed',
                'flex items-center justify-center',
                className,
              )}
            >
              <Check size={12} className="text-white opacity-0 peer-checked:opacity-100" />
            </div>
          </div>
          <label htmlFor={checkboxId} className="text-small font-body text-text-secondary cursor-pointer select-none">
            {label}
          </label>
        </div>
        {helperText && <p className="text-caption text-text-muted font-body ml-8">{helperText}</p>}
      </div>
    )
  },
)

Checkbox.displayName = 'Checkbox'
