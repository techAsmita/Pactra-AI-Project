import React from 'react'
import { Check } from 'lucide-react'
import { cn } from '@/lib/utils'
import type { Agreement } from '@/types'

const STEPS = ['Uploaded', 'Analysis', 'Decision', 'Negotiation', 'Archived'] as const

/** Computes whether each lifecycle stage has actually been completed, based
 *  on real agreement data — never assumed just because a later stage was
 *  reached. A contract archived directly from Decision (without ever
 *  entering negotiation) must show Negotiation as NOT completed. */
function computeStepCompletion(agreement: Agreement): boolean[] {
  const uploaded = true // an agreement always exists from the moment it's created
  const analyzed = Boolean(agreement.analysis)
  const decided = Boolean(agreement.analysis) // decision is produced in the same step as analysis
  const negotiated = Boolean(agreement.negotiationStarted)
  const archived = agreement.status === 'archived'
  return [uploaded, analyzed, decided, negotiated, archived]
}

interface ContractProgressProps {
  agreement: Agreement
  className?: string
}

/** Fully state-driven horizontal progress indicator. Each stage reflects
 *  whether it actually happened for this specific agreement — not a linear
 *  assumption based on current status. Purely a readout, not clickable. */
export const ContractProgress: React.FC<ContractProgressProps> = ({ agreement, className }) => {
  const completed = computeStepCompletion(agreement)
  const isArchived = agreement.status === 'archived'
  // The "active/next up" step only makes sense while the journey is still in
  // progress — once archived, anything not completed is simply skipped, not
  // "in progress", so nothing should show the pulsing active state.
  const activeIndex = isArchived ? -1 : completed.findIndex((done) => !done)

  return (
    <div className={cn('flex items-center overflow-x-auto', className)} aria-label="Contract progress">
      {STEPS.map((label, i) => {
        const done = completed[i]
        const active = i === activeIndex
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
              <div className={cn('h-px flex-1 mx-2 min-w-[16px] tablet:min-w-[24px]', done && completed[i + 1] ? 'bg-brand' : 'bg-border-default')} aria-hidden="true" />
            )}
          </React.Fragment>
        )
      })}
    </div>
  )
}
