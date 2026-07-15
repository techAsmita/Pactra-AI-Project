import React, { useState } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import { AlertTriangle, CheckCircle2, ArrowRight, ChevronRight, Sparkles } from 'lucide-react'
import { cn } from '@/lib/utils'
import { PageContainer } from '@/components/layout/PageContainer'
import { Card } from '@/components/ui/Card'
import { Badge } from '@/components/ui/Badge'
import { Button } from '@/components/ui/Button'
import { useAgreements } from '@/hooks/useAgreements'
import { useToast } from '@/components/ui/Toast'
import { AnimatedNumber } from '@/components/ui/AnimatedNumber'
import { explainRecommendation } from '@/lib/explainDecision'
import type { RiskLevel, DecisionOutcome, ClauseFlag } from '@/types'

function usePrefersReducedMotion() {
  return typeof window !== 'undefined' &&
    window.matchMedia('(prefers-reduced-motion: reduce)').matches
}

const riskBarColor = (v: number) =>
  v >= 71 ? 'bg-crimson' : v >= 41 ? 'bg-amber' : 'bg-success'

const decisionConfig: Record<DecisionOutcome, { label: string; color: string; bg: string; description: string }> = {
  SIGN:      { label: 'SIGN',      color: 'text-success', bg: 'bg-success/10 border-success/25',      description: 'This agreement is favorable. You can proceed with confidence.' },
  NEGOTIATE: { label: 'NEGOTIATE', color: 'text-amber',   bg: 'bg-amber/10 border-amber/25',          description: 'Key terms need to be renegotiated before you sign.' },
  WAIT:      { label: 'WAIT',      color: 'text-brand',   bg: 'bg-brand/10 border-brand/25',          description: 'Gather more information or legal input before proceeding.' },
  ESCALATE:  { label: 'ESCALATE', color: 'text-crimson',  bg: 'bg-crimson/10 border-crimson/25',      description: 'This agreement requires immediate legal counsel. Do not sign.' },
}

const riskLevelColor: Record<RiskLevel, string> = {
  Low: 'text-success', Medium: 'text-amber', High: 'text-crimson', Critical: 'text-crimson',
}

const ClauseCard: React.FC<{ clause: ClauseFlag; index: number }> = ({ clause, index }) => {
  const [open, setOpen] = useState(false)
  const reduced = usePrefersReducedMotion()

  const severityColor: Record<RiskLevel, string> = {
    Low: 'border-l-success', Medium: 'border-l-amber', High: 'border-l-crimson', Critical: 'border-l-crimson',
  }

  return (
    <motion.div
      initial={reduced ? { opacity: 1 } : { opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3, delay: index * 0.06 }}
      className={cn('rounded-input border-l-4 border border-border-default bg-bg-surface p-4 cursor-pointer hover:bg-bg-card-hover transition-colors duration-fast focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand', severityColor[clause.severity])}
      onClick={() => setOpen(o => !o)}
      role="button"
      tabIndex={0}
      aria-expanded={open}
      onKeyDown={(e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault()
          setOpen(o => !o)
        }
      }}
    >
      <div className="flex items-center justify-between gap-3">
        <div className="flex items-center gap-3 min-w-0">
          <span className="font-mono text-caption text-text-muted shrink-0">{clause.reference}</span>
          <span className="text-small font-body font-medium text-text-primary truncate">{clause.title}</span>
        </div>
        <div className="flex items-center gap-2 shrink-0">
          <Badge type="risk" value={clause.severity} size="sm" />
          <ChevronRight size={14} className={cn('text-text-muted transition-transform duration-fast', open && 'rotate-90')} aria-hidden="true" />
        </div>
      </div>
      {open && (
        <motion.p
          initial={{ opacity: 0, height: 0 }}
          animate={{ opacity: 1, height: 'auto' }}
          className="text-small font-body text-text-muted mt-3 leading-relaxed"
        >
          {clause.summary}
        </motion.p>
      )}
    </motion.div>
  )
}

export const DecisionCenterPage: React.FC = () => {
  const { id } = useParams<{ id: string }>()
  const navigate = useNavigate()
  const { getAgreement, archiveAgreement } = useAgreements()
  const { toast } = useToast()
  const reduced = usePrefersReducedMotion()

  const agreement = id ? getAgreement(id) : undefined
  const analysis = agreement?.analysis

  if (!analysis || !agreement) {
    return (
      <PageContainer className="py-10">
        <p className="text-body text-text-muted font-body">No analysis found for this agreement.</p>
        <Button variant="secondary" size="md" className="mt-4" onClick={() => navigate('/contracts')}>
          Back to Contracts
        </Button>
      </PageContainer>
    )
  }

  const config = decisionConfig[analysis.decision]

  // Derive urgency from decision + risk level
  const urgency = analysis.decision === 'ESCALATE' ? 'Immediate'
    : analysis.decision === 'NEGOTIATE' && analysis.riskLevel === 'High' ? 'High'
    : analysis.decision === 'NEGOTIATE' ? 'Medium'
    : analysis.decision === 'WAIT' ? 'Low'
    : 'None'

  const urgencyColor: Record<string, string> = {
    Immediate: 'text-crimson', High: 'text-crimson', Medium: 'text-amber', Low: 'text-brand', None: 'text-success',
  }

  // Top opportunities are sourced directly from recommended actions —
  // no separate opportunities field exists on the analysis object.
  const opportunities = analysis.recommendedActions
  const explanationBullets = explainRecommendation(analysis)

  const riskBreakdownEntries = [
    { label: 'Financial Exposure', value: analysis.riskBreakdown.financialExposure },
    { label: 'Legal Complexity',   value: analysis.riskBreakdown.legalComplexity },
    { label: 'Operational Risk',   value: analysis.riskBreakdown.operationalRisk },
    { label: 'Compliance Risk',    value: analysis.riskBreakdown.complianceRisk },
  ]
  const impactEntries = [
    { label: 'Revenue Risk',           value: analysis.businessImpact.revenueRisk },
    { label: 'Cash Flow',              value: analysis.businessImpact.cashFlow },
    { label: 'Growth Impact',          value: analysis.businessImpact.growthImpact },
    { label: 'Negotiation Priority',   value: analysis.businessImpact.negotiationPriority },
  ]

  return (
    <PageContainer className="py-10 max-w-3xl">
      <motion.div
        initial={reduced ? { opacity: 1 } : { opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
      >
        <h1 className="font-heading text-h2 text-text-primary mb-1 break-words">{agreement.name}</h1>
        <p className="text-body text-text-muted font-body mb-8">{agreement.type}</p>
      </motion.div>

      {/* ── Decision Card ── */}
      <motion.div
        initial={reduced ? { opacity: 1 } : { opacity: 0, scale: 0.97 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.4, delay: 0.1, ease: [0, 0, 0.2, 1] }}
        className={cn('rounded-card border p-6 mb-6', config.bg)}
      >
        <div className="flex items-start justify-between gap-4 mb-3">
          <div>
            <p className="text-caption font-body text-text-muted uppercase tracking-widest font-medium mb-2">
              Decision Engine
            </p>
            <div className="flex items-center gap-3">
              <span className={cn('font-heading font-bold text-h1 leading-none', config.color)}>
                {config.label}
              </span>
              <Badge type="risk" value={analysis.riskLevel} size="md" />
            </div>
          </div>
          <div className="text-right shrink-0">
            <p className="text-caption text-text-muted font-body mb-1">Confidence</p>
            <p className="font-heading font-bold text-h2 text-text-primary">
              <AnimatedNumber value={analysis.confidence} suffix="%" />
            </p>
          </div>
        </div>
        <p className="text-body font-body text-text-secondary">{config.description}</p>
        <p className="text-small font-body text-text-muted mt-3 leading-relaxed">{analysis.summary}</p>
      </motion.div>

      {/* Why this recommendation? */}
      <motion.div
        initial={reduced ? { opacity: 1 } : { opacity: 0, y: 8 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.35, delay: 0.12 }}
        className="mb-6"
      >
        <Card variant="default">
          <div className="flex items-center gap-2 mb-4">
            <Sparkles size={14} className="text-brand" aria-hidden="true" />
            <h2 className="font-heading text-h4 text-text-primary">Why this recommendation?</h2>
          </div>
          <div className="flex flex-col gap-3">
            {explanationBullets.map((bullet, i) => (
              <motion.div
                key={i}
                initial={reduced ? { opacity: 1 } : { opacity: 0, x: -6 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.3, delay: 0.16 + i * 0.06 }}
                className="flex items-start gap-3"
              >
                <span className="w-1.5 h-1.5 rounded-full bg-brand shrink-0 mt-2" aria-hidden="true" />
                <p className="text-small font-body text-text-secondary leading-relaxed">{bullet}</p>
              </motion.div>
            ))}
          </div>
        </Card>
      </motion.div>

      <div className="grid tablet:grid-cols-2 gap-6 mb-6">
        {/* Risk Breakdown */}
        <motion.div
          initial={reduced ? { opacity: 1 } : { opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.35, delay: 0.2 }}
        >
          <Card variant="default">
            <h2 className="font-heading text-h4 text-text-primary mb-4">Risk Breakdown</h2>
            <div className="flex flex-col gap-3">
              {riskBreakdownEntries.map(({ label, value }) => (
                <div key={label}>
                  <div className="flex justify-between mb-1">
                    <span className="text-small font-body text-text-secondary">{label}</span>
                    <span className="text-small font-mono text-text-muted">{value}%</span>
                  </div>
                  <div className="h-1.5 rounded-badge bg-bg-primary overflow-hidden">
                    <motion.div
                      initial={{ width: 0 }}
                      animate={{ width: `${value}%` }}
                      transition={{ duration: reduced ? 0 : 0.6, delay: 0.3, ease: 'easeOut' }}
                      className={cn('h-full rounded-badge', riskBarColor(value))}
                    />
                  </div>
                </div>
              ))}
            </div>
          </Card>
        </motion.div>

        {/* Business Impact */}
        <motion.div
          initial={reduced ? { opacity: 1 } : { opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.35, delay: 0.25 }}
        >
          <Card variant="default">
            <h2 className="font-heading text-h4 text-text-primary mb-4">Business Impact</h2>
            <div className="flex flex-col gap-2">
              {impactEntries.map(({ label, value }) => (
                <div key={label} className="flex items-center justify-between py-1.5 border-b border-border-default last:border-0">
                  <span className="text-small font-body text-text-secondary">{label}</span>
                  <span className={cn('text-small font-body font-semibold', riskLevelColor[value])}>{value}</span>
                </div>
              ))}
            </div>
          </Card>
        </motion.div>
      </div>

      {/* Key Risks */}
      <motion.div
        initial={reduced ? { opacity: 1 } : { opacity: 0, y: 8 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.35, delay: 0.3 }}
        className="mb-6"
      >
        <Card variant="default">
          <h2 className="font-heading text-h4 text-text-primary mb-4">Key Risks</h2>
          <div className="flex flex-col gap-2">
            {analysis.keyRisks.map((risk, i) => (
              <div key={i} className="flex items-start gap-3">
                <AlertTriangle size={14} className="text-amber shrink-0 mt-0.5" aria-hidden="true" />
                <p className="text-small font-body text-text-secondary">{risk}</p>
              </div>
            ))}
          </div>
        </Card>
      </motion.div>

      {/* Recommended Actions */}
      <motion.div
        initial={reduced ? { opacity: 1 } : { opacity: 0, y: 8 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.35, delay: 0.35 }}
        className="mb-6"
      >
        <Card variant="default">
          <h2 className="font-heading text-h4 text-text-primary mb-4">Recommended Actions</h2>
          <div className="flex flex-col gap-2">
            {analysis.recommendedActions.map((action, i) => (
              <div key={i} className="flex items-start gap-3">
                <span className="font-mono text-caption text-brand font-bold shrink-0 mt-0.5 w-4">{i + 1}.</span>
                <p className="text-small font-body text-text-secondary">{action}</p>
              </div>
            ))}
          </div>
        </Card>
      </motion.div>

      {/* Clauses */}
      <motion.div
        initial={reduced ? { opacity: 1 } : { opacity: 0, y: 8 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.35, delay: 0.4 }}
        className="mb-8"
      >
        <h2 className="font-heading text-h4 text-text-primary mb-3">Clauses Requiring Attention</h2>
        <div className="flex flex-col gap-2">
          {analysis.clauses.map((clause, i) => (
            <ClauseCard key={clause.id} clause={clause} index={i} />
          ))}
        </div>
      </motion.div>

      {/* Urgency + Opportunities */}
      <motion.div
        initial={reduced ? { opacity: 1 } : { opacity: 0, y: 8 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.35, delay: 0.42 }}
        className="grid tablet:grid-cols-2 gap-6 mb-8"
      >
        <Card variant="default">
          <h2 className="font-heading text-h4 text-text-primary mb-3">Urgency</h2>
          <div className="flex items-center gap-3">
            <span className={`font-heading font-bold text-h3 ${urgencyColor[urgency]}`}>{urgency}</span>
            <p className="text-small font-body text-text-muted">
              {urgency === 'Immediate' ? 'Seek legal counsel before any further discussion.'
                : urgency === 'High' ? 'Negotiate before signing. Do not delay.'
                : urgency === 'Medium' ? 'Negotiate at your next opportunity.'
                : urgency === 'Low' ? 'No immediate action required.'
                : 'Agreement is ready to sign.'}
            </p>
          </div>
        </Card>
        <Card variant="default">
          <h2 className="font-heading text-h4 text-text-primary mb-3">Top Opportunities</h2>
          <div className="flex flex-col gap-2">
            {opportunities.slice(0, 3).map((opp, i) => (
              <div key={i} className="flex items-start gap-2">
                <span className="font-mono text-caption text-success font-bold shrink-0 mt-0.5">{i + 1}.</span>
                <p className="text-small font-body text-text-secondary">{opp}</p>
              </div>
            ))}
          </div>
        </Card>
      </motion.div>

      {/* CTA row */}
      <motion.div
        initial={reduced ? { opacity: 1 } : { opacity: 0, y: 8 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.35, delay: 0.45 }}
        className="flex flex-wrap gap-3"
      >
        {analysis.decision !== 'SIGN' && (
          <Button
            variant="primary" size="lg"
            icon={<ArrowRight size={16} />} iconPosition="right"
            onClick={() => navigate(`/contracts/${id}/negotiate`)}
          >
            Generate Negotiation Strategy
          </Button>
        )}
        {analysis.decision === 'SIGN' && (
          <Button
            variant="primary" size="lg"
            icon={<CheckCircle2 size={16} />} iconPosition="right"
            onClick={() => {
              if (id) archiveAgreement(id)
              toast('Agreement archived successfully.', 'success', 3000, {
                label: 'View Archive',
                onClick: () => navigate('/contracts?tab=archived'),
              })
              navigate('/contracts')
            }}
          >
            Archive Agreement
          </Button>
        )}
        <Button variant="secondary" size="lg" onClick={() => navigate('/contracts')}>
          Back to Contracts
        </Button>
      </motion.div>
    </PageContainer>
  )
}
