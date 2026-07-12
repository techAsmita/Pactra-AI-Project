import React from 'react'
import { cn } from '@/lib/utils'

interface RadioOption { value: string; label: string; description?: string }

interface RadioGroupProps {
  label: string
  name: string
  options: RadioOption[]
  value: string
  onChange: (value: string) => void
  layout?: 'vertical' | 'horizontal'
}

export const RadioGroup: React.FC<RadioGroupProps> = ({
  label, name, options, value, onChange, layout = 'vertical',
}) => {
  return (
    <fieldset className="flex flex-col gap-2">
      <legend className="text-small font-medium text-text-secondary font-body mb-2">{label}</legend>
      <div className={cn('flex gap-3', layout === 'vertical' ? 'flex-col' : 'flex-row flex-wrap')}>
        {options.map((opt) => {
          const id = `${name}-${opt.value}`
          const isSelected = value === opt.value
          return (
            <div
              key={opt.value}
              role="radio"
              aria-checked={isSelected}
              tabIndex={0}
              onClick={() => onChange(opt.value)}
              onKeyDown={(e) => {
                if (e.key === 'Enter' || e.key === ' ') {
                  e.preventDefault()
                  onChange(opt.value)
                }
              }}
              className={cn(
                'flex items-start gap-3 rounded-input p-3 border cursor-pointer select-none',
                'transition-all duration-fast',
                'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand focus-visible:ring-offset-2 focus-visible:ring-offset-bg-primary',
                isSelected
                  ? 'border-brand bg-brand/10'
                  : 'border-border-default bg-bg-surface hover:border-border-hover hover:bg-bg-card-hover',
              )}
            >
              {/* Native input kept for form semantics / screen readers, but visually and interactively inert — the wrapping div owns the click */}
              <input
                type="radio"
                id={id}
                name={name}
                value={opt.value}
                checked={isSelected}
                readOnly
                tabIndex={-1}
                className="sr-only pointer-events-none"
                aria-hidden="true"
              />
              <div
                aria-hidden="true"
                className={cn(
                  'flex items-center justify-center h-4 w-4 rounded-full border-2 shrink-0 mt-0.5',
                  'transition-all duration-fast',
                  isSelected ? 'border-brand' : 'border-border-default',
                )}
              >
                {isSelected && <div className="h-2 w-2 rounded-full bg-brand" />}
              </div>
              <div>
                <div className="text-small font-medium text-text-primary font-body">{opt.label}</div>
                {opt.description && (
                  <div className="text-caption text-text-muted font-body mt-0.5">{opt.description}</div>
                )}
              </div>
            </div>
          )
        })}
      </div>
    </fieldset>
  )
}
