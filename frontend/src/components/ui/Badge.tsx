import React from 'react'
import { cn } from '@/lib/utils'
import type { DecisionOutcome, RiskLevel, AgreementStatus } from '@/types'

type BadgeSize = 'sm' | 'md'

// Decision outcome badge
interface DecisionBadgeProps {
  type: 'decision'
  value: DecisionOutcome
  size?: BadgeSize
  className?: string
}

// Risk level badge
interface RiskBadgeProps {
  type: 'risk'
  value: RiskLevel
  size?: BadgeSize
  className?: string
}

// Agreement status badge
interface StatusBadgeProps {
  type: 'status'
  value: AgreementStatus
  size?: BadgeSize
  className?: string
}

// Generic badge
interface GenericBadgeProps {
  type?: 'generic'
  children: React.ReactNode
  color?: 'indigo' | 'green' | 'amber' | 'crimson' | 'muted'
  size?: BadgeSize
  className?: string
}

type BadgeProps = DecisionBadgeProps | RiskBadgeProps | StatusBadgeProps | GenericBadgeProps

const decisionConfig: Record<DecisionOutcome, { label: string; color: string }> = {
  SIGN: { label: 'SIGN', color: 'bg-success/15 text-success border-success/30' },
  NEGOTIATE: { label: 'NEGOTIATE', color: 'bg-amber/15 text-amber border-amber/30' },
  WAIT: { label: 'WAIT', color: 'bg-brand/15 text-brand border-brand/30' },
  ESCALATE: { label: 'ESCALATE', color: 'bg-crimson/15 text-crimson border-crimson/30' },
}

const riskConfig: Record<RiskLevel, { color: string }> = {
  Low: { color: 'bg-success/15 text-success border-success/30' },
  Medium: { color: 'bg-amber/15 text-amber border-amber/30' },
  High: { color: 'bg-crimson/15 text-crimson border-crimson/30' },
  Critical: { color: 'bg-crimson-deep/15 text-crimson-deep border-crimson-deep/30' },
}

const statusConfig: Record<AgreementStatus, { label: string; color: string }> = {
  new: { label: 'New', color: 'bg-text-muted/15 text-text-muted border-text-muted/30' },
  uploaded: { label: 'Uploaded', color: 'bg-brand/15 text-brand border-brand/30' },
  parsing: { label: 'Parsing', color: 'bg-brand/15 text-brand border-brand/30' },
  context_confirmed: { label: 'Context Set', color: 'bg-brand/15 text-brand border-brand/30' },
  analyzing: { label: 'Analyzing', color: 'bg-amber/15 text-amber border-amber/30' },
  decision_ready: { label: 'Decision Ready', color: 'bg-success/15 text-success border-success/30' },
  negotiating: { label: 'Negotiating', color: 'bg-amber/15 text-amber border-amber/30' },
  completed: { label: 'Completed', color: 'bg-success/15 text-success border-success/30' },
  archived: { label: 'Archived', color: 'bg-text-muted/15 text-text-muted border-text-muted/30' },
}

const genericColorMap: Record<NonNullable<GenericBadgeProps['color']>, string> = {
  indigo: 'bg-brand/15 text-brand border-brand/30',
  green: 'bg-success/15 text-success border-success/30',
  amber: 'bg-amber/15 text-amber border-amber/30',
  crimson: 'bg-crimson/15 text-crimson border-crimson/30',
  muted: 'bg-text-muted/15 text-text-muted border-text-muted/30',
}

const sizeMap: Record<BadgeSize, string> = {
  sm: 'text-[11px] px-2 py-0.5 font-semibold tracking-wide',
  md: 'text-caption px-3 py-1 font-semibold tracking-wide',
}

export const Badge: React.FC<BadgeProps> = (props) => {
  const size: BadgeSize = props.size || 'md'
  const base = cn(
    'inline-flex items-center rounded-badge border font-body uppercase whitespace-nowrap',
    sizeMap[size],
  )

  if (props.type === 'decision') {
    const config = decisionConfig[props.value]
    return <span className={cn(base, config.color, props.className)}>{config.label}</span>
  }

  if (props.type === 'risk') {
    const config = riskConfig[props.value]
    return <span className={cn(base, config.color, props.className)}>{props.value}</span>
  }

  if (props.type === 'status') {
    const config = statusConfig[props.value]
    const isLive = props.value === 'analyzing' || props.value === 'negotiating'
    return (
      <span className={cn(base, config.color, isLive && 'gap-1.5', props.className)}>
        {isLive && (
          <span className="relative flex h-1.5 w-1.5 shrink-0" aria-hidden="true">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-current opacity-60" />
            <span className="relative inline-flex rounded-full h-1.5 w-1.5 bg-current" />
          </span>
        )}
        {config.label}
      </span>
    )
  }

  // Generic
  const genericProps = props as GenericBadgeProps
  const color = genericProps.color ? genericColorMap[genericProps.color] : genericColorMap.muted
  return <span className={cn(base, color, genericProps.className)}>{genericProps.children}</span>
}
