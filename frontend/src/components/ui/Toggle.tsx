import React from 'react'
import { cn } from '@/lib/utils'

interface ToggleProps {
  checked: boolean
  onChange: (checked: boolean) => void
  label: string
  description?: string
  disabled?: boolean
  id?: string
}

export const Toggle: React.FC<ToggleProps> = ({
  checked, onChange, label, description, disabled = false, id,
}) => {
  const toggleId = id || `toggle-${label.toLowerCase().replace(/\s+/g, '-')}`

  return (
    <div className="flex items-center justify-between gap-4">
      <div className="flex flex-col gap-0.5">
        <label htmlFor={toggleId} className="text-body font-medium text-text-primary font-body cursor-pointer">
          {label}
        </label>
        {description && (
          <p className="text-small text-text-muted font-body">{description}</p>
        )}
      </div>
      <button
        id={toggleId}
        role="switch"
        aria-checked={checked}
        aria-label={label}
        disabled={disabled}
        onClick={() => onChange(!checked)}
        className={cn(
          'relative inline-flex h-6 w-11 shrink-0 cursor-pointer rounded-badge',
          'transition-colors duration-normal',
          'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand focus-visible:ring-offset-2 focus-visible:ring-offset-bg-primary',
          'disabled:cursor-not-allowed disabled:opacity-40',
          checked ? 'bg-brand' : 'bg-border-default',
        )}
      >
        <span
          aria-hidden="true"
          className={cn(
            'pointer-events-none inline-block h-5 w-5 rounded-full bg-white shadow-elv-2',
            'transform transition-transform duration-fast',
            'absolute top-0.5',
            checked ? 'translate-x-5' : 'translate-x-0.5',
          )}
        />
      </button>
    </div>
  )
}
