import React, { useEffect, useRef } from 'react'
import { cn } from '@/lib/utils'

interface TextareaProps extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {
  label: string
  helperText?: string
  maxLength?: number
  hideLabel?: boolean
}

export const Textarea = React.forwardRef<HTMLTextAreaElement, TextareaProps>(
  ({ label, helperText, maxLength, hideLabel = false, id, className, value, onChange, ...props }, ref) => {
    const internalRef = useRef<HTMLTextAreaElement>(null)
    const textareaRef = (ref as React.RefObject<HTMLTextAreaElement>) || internalRef
    const inputId = id || `textarea-${label.toLowerCase().replace(/\s+/g, '-')}`

    const adjustHeight = () => {
      const el = textareaRef.current
      if (!el) return
      el.style.height = 'auto'
      el.style.height = `${Math.min(el.scrollHeight, 240)}px`
    }

    useEffect(() => { adjustHeight() }, [value])

    return (
      <div className="flex flex-col gap-2 w-full">
        <label
          htmlFor={inputId}
          className={cn('text-small font-medium text-text-secondary font-body', hideLabel && 'sr-only')}
        >
          {label}
        </label>
        <textarea
          ref={textareaRef}
          id={inputId}
          value={value}
          onChange={(e) => { onChange?.(e); adjustHeight() }}
          maxLength={maxLength}
          className={cn(
            'w-full rounded-input px-4 py-3 min-h-[96px] max-h-[240px]',
            'bg-bg-surface border border-border-default text-text-primary font-body text-body',
            'placeholder:text-text-muted resize-none overflow-y-auto',
            'transition-all duration-fast',
            'focus:outline-none focus:border-border-focus focus:ring-2 focus:ring-border-focus/20',
            'disabled:opacity-40 disabled:cursor-not-allowed',
            className,
          )}
          {...props}
        />
        <div className="flex justify-between">
          {helperText && <p className="text-caption text-text-muted font-body">{helperText}</p>}
          {maxLength && (
            <p className="text-caption text-text-muted font-body ml-auto">
              {String(value ?? '').length}/{maxLength}
            </p>
          )}
        </div>
      </div>
    )
  },
)

Textarea.displayName = 'Textarea'
