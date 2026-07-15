import React, { useState, useMemo, useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import { ArrowLeft, Copy, CheckCircle2, ArrowRight, FileText } from 'lucide-react'
import { PageContainer } from '@/components/layout/PageContainer'
import { Card } from '@/components/ui/Card'
import { Button } from '@/components/ui/Button'
import { Badge } from '@/components/ui/Badge'
import { EmptyState } from '@/components/ui/EmptyState'
import { useAgreements } from '@/hooks/useAgreements'
import { useFounderContext } from '@/hooks/useFounderContext'
import { useToast } from '@/components/ui/Toast'
import type { Agreement } from '@/types'

function timeAgo(iso: string): string {
  const diff = Date.now() - new Date(iso).getTime()
  const mins = Math.floor(diff / 60000)
  if (mins < 1) return 'just now'
  if (mins < 60) return `${mins}m ago`
  const hrs = Math.floor(mins / 60)
  if (hrs < 24) return `${hrs}h ago`
  return `${Math.floor(hrs / 24)}d ago`
}

function buildStrategy(agreement: Agreement, companyName: string) {
  const analysis = agreement.analysis!
  const highClauses = analysis.clauses.filter(c => c.severity === 'High' || c.severity === 'Critical')
  const medClauses = analysis.clauses.filter(c => c.severity === 'Medium')

  const priorities = [
    ...highClauses.map((c, i) => ({
      rank: i + 1,
      clause: `${c.reference} — ${c.title}`,
      reason: c.summary,
      leverage: 'Standard market terms support a more balanced version of this clause. Counterparty likely expects pushback here.',
    })),
    ...medClauses.slice(0, 2).map((c, i) => ({
      rank: highClauses.length + i + 1,
      clause: `${c.reference} — ${c.title}`,
      reason: c.summary,
      leverage: 'Minor wording changes can significantly reduce exposure.',
    })),
  ]

  const rewrites = highClauses.slice(0, 2).map(c => ({
    reference: c.reference,
    title: c.title,
    original: `[Current language in ${c.reference}: ${c.title}]`,
    suggested: `[Proposed revision: Standard market language limiting scope of ${c.title.toLowerCase()} to reasonable and mutual terms consistent with industry norms.]`,
  }))

  const topActions = analysis.recommendedActions.slice(0, 3)

  const email = `Subject: Re: ${agreement.name} — Proposed Revisions

Dear [Counterparty],

Thank you for sending over the ${agreement.name}. We've reviewed it carefully with our team and are looking forward to working together. Before we proceed to signature, we'd like to propose a few revisions to ensure the agreement reflects balanced terms for both parties.

Our primary points for discussion:

${topActions.map((a, i) => `${i + 1}. ${a}`).join('\n\n')}

We believe these changes are consistent with standard market terms and appropriate for a company at ${companyName ? companyName + "'s" : 'our'} current stage. We're happy to discuss any of these points on a short call this week.

Looking forward to finalizing this agreement.

Best regards,
[Your Name]
${companyName || '[Company Name]'}`

  return { priorities, rewrites, email }
}

// ─── Standalone Negotiations Hub (when no :id) ──────────────────────────────
const NegotiationsHub: React.FC = () => {
  const navigate = useNavigate()
  const { agreements } = useAgreements()

  const active = agreements.filter(a =>
    a.decision === 'NEGOTIATE' || a.decision === 'ESCALATE' || a.status === 'negotiating'
  )

  if (active.length === 0) {
    return (
      <PageContainer className="py-10">
        <h1 className="font-heading text-h1 text-text-primary mb-2">Negotiations</h1>
        <p className="text-body text-text-muted font-body mb-8">
          Active negotiation drafts across all your agreements.
        </p>
        <div className="rounded-card border border-border-default bg-bg-secondary">
          <EmptyState
            icon={<FileText size={44} strokeWidth={1.5} />}
            headline="No active negotiations"
            description="Once Pactra recommends negotiating an agreement, your strategy and draft email will appear here."
            ctaLabel="View Contracts"
            onCta={() => navigate('/contracts')}
          />
        </div>
      </PageContainer>
    )
  }

  return (
    <PageContainer className="py-10">
      <h1 className="font-heading text-h1 text-text-primary mb-2">Negotiations</h1>
      <p className="text-body text-text-muted font-body mb-8">
        {active.length} active negotiation{active.length !== 1 ? 's' : ''} requiring attention.
      </p>
      <div className="flex flex-col gap-3">
        {active.map((agreement, i) => (
          <motion.div
            key={agreement.id}
            initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3, delay: i * 0.06 }}
            className="flex items-center justify-between gap-4 p-5 rounded-card border border-border-default bg-bg-secondary hover:border-border-hover hover:bg-bg-card-hover transition-all duration-fast cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand"
            onClick={() => navigate(`/contracts/${agreement.id}/negotiate`)}
            role="button"
            tabIndex={0}
            onKeyDown={(e) => {
              if (e.key === 'Enter' || e.key === ' ') {
                e.preventDefault()
                navigate(`/contracts/${agreement.id}/negotiate`)
              }
            }}
          >
            <div className="flex items-center gap-4 min-w-0">
              <div className="w-10 h-10 rounded-btn bg-amber/10 flex items-center justify-center shrink-0">
                <FileText size={18} className="text-amber" aria-hidden="true" />
              </div>
              <div className="min-w-0">
                <p className="font-body font-semibold text-text-primary truncate">{agreement.name}</p>
                <p className="text-small font-body text-text-muted">{agreement.type} · {timeAgo(agreement.updatedAt)}</p>
              </div>
            </div>
            <div className="flex items-center gap-3 shrink-0">
              {agreement.decision && <Badge type="decision" value={agreement.decision} size="sm" />}
              {agreement.confidence !== undefined && (
                <span className="text-caption font-mono text-text-muted">{agreement.confidence}%</span>
              )}
              <ArrowRight size={14} className="text-text-muted" aria-hidden="true" />
            </div>
          </motion.div>
        ))}
      </div>
    </PageContainer>
  )
}

// ─── Agreement-scoped Negotiation Workspace ─────────────────────────────────
const NegotiationWorkspace: React.FC<{ agreementId: string }> = ({ agreementId }) => {
  const navigate = useNavigate()
  const { getAgreement, updateAgreement } = useAgreements()
  const { context } = useFounderContext()
  const { toast } = useToast()

  const agreement = getAgreement(agreementId)
  const analysis = agreement?.analysis

  // Fix impossible/dead workflow state: 'negotiating' was defined and read
  // everywhere (Workspace, Analytics, Contracts) but never actually written,
  // so Active Negotiations always showed 0. Transition it here, the one
  // place a founder actually starts working a negotiation — and only when
  // negotiation is the correct next step (never overwrite an already
  // archived/completed agreement).
  useEffect(() => {
    if (agreement && agreement.status === 'decision_ready' &&
        (agreement.decision === 'NEGOTIATE' || agreement.decision === 'ESCALATE')) {
      updateAgreement(agreement.id, { status: 'negotiating' })
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [agreement?.id])

  const strategy = useMemo(() => {
    if (!analysis || !agreement) return null
    return buildStrategy(agreement, context.companyName)
  }, [analysis, agreement, context.companyName])

  const [emailContent, setEmailContent] = useState(() => strategy?.email ?? '')
  const [copied, setCopied] = useState(false)

  // Sync email content when strategy loads
  React.useEffect(() => {
    if (strategy?.email && !emailContent) setEmailContent(strategy.email)
  }, [strategy?.email, emailContent])

  const handleCopyEmail = async () => {
    if (!emailContent || copied) return
    await navigator.clipboard.writeText(emailContent)
    setCopied(true)
    toast('Email copied to clipboard.', 'success', 3000)
    setTimeout(() => setCopied(false), 3000)
  }

  const handleArchive = () => {
    if (!agreement) return
    updateAgreement(agreement.id, { status: 'archived' })
    toast('Agreement archived successfully.', 'success', 3000, {
      label: 'View Archive',
      onClick: () => navigate('/contracts?tab=archived'),
    })
    setTimeout(() => navigate('/contracts'), 800)
  }

  if (!agreement || !analysis || !strategy) {
    return (
      <PageContainer className="py-10">
        <p className="text-body text-text-muted font-body">No analysis found. Complete analysis first.</p>
        <Button variant="secondary" size="md" className="mt-4" onClick={() => navigate('/contracts')}>
          Back to Contracts
        </Button>
      </PageContainer>
    )
  }

  return (
    <PageContainer className="py-10 max-w-3xl">
      <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.35 }}>
        <h1 className="font-heading text-h2 text-text-primary mb-1">Negotiation Strategy</h1>
        <p className="text-body text-text-muted font-body mb-8 break-words">
          {agreement.name} · {agreement.type}
        </p>

        {/* Summary bar */}
        <div className="flex items-center gap-3 flex-wrap mb-6 p-4 rounded-card border border-border-default bg-bg-surface">
          <span className="text-small font-body text-text-muted">Recommendation:</span>
          {agreement.decision && <Badge type="decision" value={agreement.decision} size="sm" />}
          <span className="text-small font-mono text-text-muted">·</span>
          <span className="text-small font-body text-text-muted">Confidence: <span className="font-semibold text-text-primary">{agreement.confidence}%</span></span>
          <span className="text-small font-mono text-text-muted">·</span>
          <span className="text-small font-body text-text-muted">Risk: <span className="font-semibold text-text-primary">{agreement.riskLevel}</span></span>
        </div>

        {/* Priorities */}
        <div className="mb-6">
          <h2 className="font-heading text-h4 text-text-primary mb-3">Priority Clauses</h2>
          <div className="flex flex-col gap-3">
            {strategy.priorities.map(p => (
              <motion.div key={p.rank}
                initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3, delay: p.rank * 0.07 }}
                className="rounded-card border border-border-default bg-bg-secondary p-5"
              >
                <div className="flex items-start gap-3">
                  <span className="font-mono text-h4 font-bold text-brand shrink-0 leading-none mt-0.5">{p.rank}.</span>
                  <div>
                    <p className="text-small font-body font-semibold text-text-primary mb-1">{p.clause}</p>
                    <p className="text-small font-body text-text-muted mb-2">{p.reason}</p>
                    <div className="flex items-start gap-2">
                      <span className="text-caption font-body text-brand font-medium shrink-0">Leverage:</span>
                      <p className="text-caption font-body text-text-muted">{p.leverage}</p>
                    </div>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>

        {/* Clause Rewrites */}
        {strategy.rewrites.length > 0 && (
          <div className="mb-6">
            <h2 className="font-heading text-h4 text-text-primary mb-3">Suggested Clause Revisions</h2>
            <div className="flex flex-col gap-4">
              {strategy.rewrites.map(r => (
                <Card key={r.reference} variant="default">
                  <div className="flex items-center gap-2 mb-3">
                    <span className="font-mono text-caption text-text-muted">{r.reference}</span>
                    <span className="text-small font-body font-medium text-text-primary">{r.title}</span>
                  </div>
                  <div className="grid tablet:grid-cols-2 gap-4">
                    <div>
                      <p className="text-caption font-body text-crimson font-medium uppercase tracking-wide mb-2">Original</p>
                      <div className="rounded-input border border-crimson/20 bg-crimson/5 p-3">
                        <p className="text-small font-body text-text-muted italic">{r.original}</p>
                      </div>
                    </div>
                    <div>
                      <p className="text-caption font-body text-success font-medium uppercase tracking-wide mb-2">Suggested</p>
                      <div className="rounded-input border border-success/20 bg-success/5 p-3">
                        <p className="text-small font-body text-text-secondary">{r.suggested}</p>
                      </div>
                    </div>
                  </div>
                </Card>
              ))}
            </div>
          </div>
        )}

        {/* Email Draft */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-3">
            <h2 className="font-heading text-h4 text-text-primary">Negotiation Email Draft</h2>
            <Button variant="secondary" size="sm"
              icon={copied ? <CheckCircle2 size={14} /> : <Copy size={14} />}
              onClick={handleCopyEmail}>
              {copied ? 'Copied' : 'Copy Email'}
            </Button>
          </div>
          <div className="rounded-card border border-border-default bg-bg-secondary overflow-hidden">
            <textarea
              value={emailContent}
              onChange={e => setEmailContent(e.target.value)}
              className="w-full bg-transparent text-small font-body text-text-secondary p-5 resize-none outline-none min-h-[300px]"
              aria-label="Negotiation email draft — editable"
            />
          </div>
          <p className="text-caption font-body text-text-muted mt-2">Click to edit before sending.</p>
        </div>

        {/* Actions */}
        <div className="flex flex-wrap gap-3">
          <Button variant="primary" size="lg"
            icon={copied ? <CheckCircle2 size={16} /> : <Copy size={16} />}
            onClick={handleCopyEmail}>
            {copied ? 'Copied' : 'Copy Email'}
          </Button>
          <Button variant="secondary" size="lg"
            icon={<ArrowLeft size={15} />}
            onClick={() => navigate(`/contracts/${agreementId}/decision`)}>
            Back to Decision
          </Button>
          <Button variant="ghost" size="lg"
            icon={<CheckCircle2 size={15} />}
            onClick={handleArchive}>
            Archive Agreement
          </Button>
        </div>
      </motion.div>
    </PageContainer>
  )
}

// ─── Router — renders hub or workspace depending on context ─────────────────
export const NegotiationPage: React.FC = () => {
  const { id } = useParams<{ id: string }>()
  if (id) return <NegotiationWorkspace agreementId={id} />
  return <NegotiationsHub />
}
