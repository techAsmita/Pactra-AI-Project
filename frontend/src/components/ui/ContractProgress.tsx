import React from 'react'
import { Check } from 'lucide-react'
import { cn } from '@/lib/utils'
import type { AgreementStatus } from '@/types'

const STEPS = ['Uploaded', 'Analysis', 'Decision', 'Negotiation', 'Archived'] as const

function stepIndexForStatus(status: AgreementStatus): number {
  switch (status) {
    case 'new':
    case 'uploaded':
    case 'parsing':
    case 'context_confirmed':
      return 0
    case 'analyzing':
      return 1
    case 'decision_ready':
      return 2
    case 'negotiating':
    case 'completed':
      return 3
    case 'archived':
      return 4
    default:
      return 0
  }
}

interface ContractProgressProps {
  status: AgreementStatus
  className?: string
}

/** Simple horizontal progress indicator: Uploaded → Analysis → Decision →
 *  Negotiation → Archived. Purely a status readout — not clickable. */
export const ContractProgress: React.FC<ContractProgressProps> = ({ status, className }) => {
  const current = stepIndexForStatus(status)

  return (
    <div className={cn('flex items-center overflow-x-auto', className)} aria-label="Contract progress">
      {STEPS.map((label, i) => {
        const done = i < current
        const active = i === current
        return (
          <React.Fragment key={label}>
            <div className="flex items-center gap-1.5 shrink-0">
              <div
                className={cn(
                  'w-4 h-4 rounded-full flex items-center justify-center shrink-0 border transition-colors duration-fast',
                  done && 'bg-brand border-brand',
                  active && !done && 'border-brand bg-brand/15',
                  !done && !active && 'border-border-default bg-bg-surface',
                )}
              >
                {done && <Check size={10} className="text-white" aria-hidden="true" />}
                {active && !done && <div className="w-1.5 h-1.5 rounded-full bg-brand" aria-hidden="true" />}
              </div>
              <span
                className={cn(
                  'text-caption font-body whitespace-nowrap hidden tablet:inline',
                  active ? 'text-text-primary font-semibold' : done ? 'text-text-secondary' : 'text-text-disabled',
                )}
              >
                {label}
              </span>
            </div>
            {i < STEPS.length - 1 && (
              <div className={cn('h-px flex-1 mx-2 min-w-[16px] tablet:min-w-[24px]', i < current ? 'bg-brand' : 'bg-border-default')} aria-hidden="true" />
            )}
          </React.Fragment>
        )
      })}
    </div>
  )
}
