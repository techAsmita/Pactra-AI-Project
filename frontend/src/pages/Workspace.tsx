import React from 'react'
import { useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import { Plus, ArrowRight, FileText, Clock, Sparkles, TrendingUp, AlertTriangle, CheckCircle2, Activity, MessageSquare, BarChart3, Bell } from 'lucide-react'
import { PageContainer } from '@/components/layout/PageContainer'
import { Button } from '@/components/ui/Button'
import { Badge } from '@/components/ui/Badge'
import { EmptyState } from '@/components/ui/EmptyState'
import { useAgreements } from '@/hooks/useAgreements'
import { useFounderContext } from '@/hooks/useFounderContext'
import { useAnalytics } from '@/hooks/useAnalytics'
import { AnimatedNumber } from '@/components/ui/AnimatedNumber'
import type { Agreement, RiskLevel } from '@/types'

function timeAgo(iso: string): string {
  const diff = Date.now() - new Date(iso).getTime()
  const mins = Math.floor(diff / 60000)
  if (mins < 1) return 'just now'
  if (mins < 60) return `${mins}m ago`
  const hrs = Math.floor(mins / 60)
  if (hrs < 24) return `${hrs}h ago`
  return `${Math.floor(hrs / 24)}d ago`
}

const riskColor: Record<RiskLevel, string> = {
  Low: 'text-success', Medium: 'text-amber', High: 'text-crimson', Critical: 'text-crimson',
}

function activityMessage(a: Agreement): string {
  switch (a.status) {
    case 'uploaded': return 'Uploaded and awaiting context review'
    case 'parsing': return 'Document parsing in progress'
    case 'context_confirmed': return 'Business context confirmed, ready for analysis'
    case 'analyzing': return 'AI agents are analyzing this agreement'
    case 'decision_ready': return `Decision engine recommended ${a.decision ?? '—'}`
    case 'negotiating': return 'Negotiation strategy in progress'
    case 'completed': return 'Marked complete'
    case 'archived': return 'Archived'
    default: return 'Updated'
  }
}

interface StatCardProps { label: string; value: string | number; suffix?: string; sub?: string; icon: React.ElementType; accent?: string }
const StatCard: React.FC<StatCardProps> = ({ label, value, suffix = '', sub, icon: Icon, accent = 'text-brand' }) => (
  <div className="rounded-card border border-border-default bg-bg-secondary p-5 flex items-start gap-4">
    <div className="w-9 h-9 rounded-btn bg-brand/10 flex items-center justify-center shrink-0">
      <Icon size={16} className={accent} aria-hidden="true" />
    </div>
    <div>
      <p className="text-caption font-body text-text-muted uppercase tracking-widest mb-1">{label}</p>
      <p className="font-heading font-bold text-h3 text-text-primary leading-none">
        {typeof value === 'number' ? <AnimatedNumber value={value} suffix={suffix} /> : value}
      </p>
      {sub && <p className="text-caption font-body text-text-muted mt-1">{sub}</p>}
    </div>
  </div>
)

const AgreementRow: React.FC<{ agreement: Agreement; delay?: number }> = ({ agreement, delay = 0 }) => {
  const navigate = useNavigate()
  const isAnalyzed = ['decision_ready', 'negotiating', 'completed'].includes(agreement.status)
  return (
    <motion.div
      initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.3, delay }}
      className="flex items-center justify-between gap-4 p-4 rounded-card border border-border-default bg-bg-secondary hover:border-border-hover hover:bg-bg-card-hover transition-all duration-fast cursor-pointer"
      onClick={() => navigate(isAnalyzed ? `/contracts/${agreement.id}/decision` : `/contracts/${agreement.id}/analysis`)}
    >
      <div className="flex items-center gap-3 min-w-0">
        <div className="w-8 h-8 rounded-btn bg-brand/10 flex items-center justify-center shrink-0">
          <FileText size={14} className="text-brand" aria-hidden="true" />
        </div>
        <div className="min-w-0">
          <p className="text-small font-body font-medium text-text-primary truncate">{agreement.name}</p>
          <p className="text-caption font-body text-text-muted">{agreement.type} · {timeAgo(agreement.updatedAt)}</p>
        </div>
      </div>
      <div className="flex items-center gap-2 shrink-0">
        {agreement.decision ? <Badge type="decision" value={agreement.decision} size="md" /> : <Badge type="status" value={agreement.status} size="md" />}
        <ArrowRight size={13} className="text-text-muted" aria-hidden="true" />
      </div>
    </motion.div>
  )
}

export const WorkspacePage: React.FC = () => {
  const navigate = useNavigate()
  const { agreements } = useAgreements()
  const { context } = useFounderContext()
  const analytics = useAnalytics()

  const active = agreements.filter(a => a.status !== 'archived')
  const isAnalyzed = (a: Agreement) => ['decision_ready', 'negotiating', 'completed'].includes(a.status)
  const greeting = context.companyName ? `Welcome back, ${context.companyName}` : 'Welcome back'
  const hasData = analytics.total > 0

  // Distinct, non-overlapping buckets — each section shows a different slice
  // of the same underlying data instead of repeating the same list.
  const needsAttention = active
    .filter(a => ['uploaded', 'parsing', 'context_confirmed', 'analyzing', 'decision_ready'].includes(a.status))
    .sort((a, b) => {
      const weight = (x: Agreement) => (x.riskLevel === 'Critical' ? 3 : x.riskLevel === 'High' ? 2 : x.status === 'decision_ready' ? 1 : 0)
      return weight(b) - weight(a)
    })
    .slice(0, 4)

  const activeNegotiations = active.filter(a => a.status === 'negotiating').slice(0, 4)

  const recentActivity = [...agreements]
    .sort((a, b) => new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime())
    .slice(0, 5)

  return (
    <PageContainer className="py-10">
      {/* Header */}
      <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4 }}
        className="flex items-start justify-between gap-4 flex-wrap mb-8">
        <div>
          <h1 className="font-heading text-h1 text-text-primary">{greeting}</h1>
          <p className="text-body text-text-muted mt-1 font-body">
            {context.fundingStage && context.industry
              ? `${context.fundingStage.charAt(0).toUpperCase() + context.fundingStage.slice(1)} · ${context.industry} · ${context.riskAppetite ? context.riskAppetite.charAt(0).toUpperCase() + context.riskAppetite.slice(1) + ' Risk' : ''}`
              : 'Your Founder Decision Intelligence Platform'}
          </p>
        </div>
        <Button variant="primary" size="md" icon={<Plus size={16} />} onClick={() => navigate('/contracts/new')}>
          Analyze New Agreement
        </Button>
      </motion.div>

      {!hasData ? (
        <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4, delay: 0.1 }}
          className="rounded-card border border-border-default bg-bg-secondary">
          <EmptyState icon={<Sparkles size={48} strokeWidth={1.5} />}
            headline="Ready for your first decision?"
            description="Upload your first agreement to receive AI-powered decision intelligence built around your startup's context."
            ctaLabel="Analyze New Agreement" onCta={() => navigate('/contracts/new')} />
        </motion.div>
      ) : (
        <div className="flex flex-col gap-8">
          {/* Stats grid */}
          <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.35, delay: 0.05 }}
            className="grid grid-cols-2 tablet:grid-cols-4 gap-4">
            <StatCard label="Contracts Analyzed" value={analytics.analyzed} sub={`${analytics.total} total`} icon={FileText} />
            <StatCard label="Avg Confidence" value={analytics.avgConfidence} suffix="%" sub="across all analyses" icon={TrendingUp} />
            <StatCard label="Active Negotiations" value={analytics.negotiating} sub={`${analytics.negotiationRate}% negotiation rate`} icon={Activity} />
            <StatCard label="Overall Risk" value={analytics.overallRisk}
              accent={riskColor[analytics.overallRisk]}
              icon={analytics.overallRisk === 'Low' ? CheckCircle2 : AlertTriangle}
              sub={`${analytics.riskDistribution.High + analytics.riskDistribution.Critical} high-risk contracts`} />
          </motion.div>

          {/* Decision distribution */}
          {analytics.analyzed > 0 && (
            <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.35, delay: 0.1 }}
              className="rounded-card border border-border-default bg-bg-secondary p-5">
              <p className="text-caption font-body text-text-muted font-semibold uppercase tracking-widest mb-4">Decision Distribution</p>
              <div className="grid grid-cols-4 gap-3">
                {(['SIGN', 'NEGOTIATE', 'WAIT', 'ESCALATE'] as const).map(d => (
                  <div key={d} className="text-center">
                    <Badge type="decision" value={d} size="sm" />
                    <p className="font-heading font-bold text-h3 text-text-primary mt-2">{analytics.decisionDistribution[d]}</p>
                  </div>
                ))}
              </div>
            </motion.div>
          )}

          {/* Needs Attention + Recent AI Activity (left) / Active Negotiations + Quick Actions (right) */}
          <div className="grid tablet:grid-cols-3 gap-6">
            <div className="tablet:col-span-2 flex flex-col gap-8">
              {needsAttention.length > 0 && (
                <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.35, delay: 0.15 }}>
                  <div className="flex items-center gap-2 mb-3">
                    <Bell size={13} className="text-amber" aria-hidden="true" />
                    <p className="text-caption font-body text-text-muted font-semibold uppercase tracking-widest">
                      Needs Your Attention
                    </p>
                  </div>
                  <div className="flex flex-col gap-2">
                    {needsAttention.map((a, i) => <AgreementRow key={a.id} agreement={a} delay={i * 0.05} />)}
                  </div>
                </motion.div>
              )}

              {recentActivity.length > 0 && (
                <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.35, delay: 0.2 }}>
                  <div className="flex items-center gap-2 mb-3">
                    <Clock size={13} className="text-text-muted" aria-hidden="true" />
                    <p className="text-caption font-body text-text-muted font-semibold uppercase tracking-widest">
                      Recent AI Activity
                    </p>
                  </div>
                  <div className="rounded-card border border-border-default bg-bg-secondary divide-y divide-border-default">
                    {recentActivity.map(a => (
                      <div
                        key={`${a.id}_${a.updatedAt}`}
                        className="flex items-start gap-3 px-4 py-3 cursor-pointer hover:bg-bg-card-hover transition-colors duration-fast"
                        onClick={() => navigate(isAnalyzed(a) ? `/contracts/${a.id}/decision` : `/contracts/${a.id}/analysis`)}
                      >
                        <Sparkles size={13} className="text-brand shrink-0 mt-0.5" aria-hidden="true" />
                        <div className="min-w-0">
                          <p className="text-small font-body text-text-secondary leading-snug">{activityMessage(a)}</p>
                          <p className="text-caption font-body text-text-disabled">{a.name} · {timeAgo(a.updatedAt)}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </motion.div>
              )}

              {needsAttention.length === 0 && recentActivity.length === 0 && (
                <p className="text-small font-body text-text-muted">No activity yet.</p>
              )}
            </div>

            <div className="flex flex-col gap-8">
              <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.35, delay: 0.15 }}>
                <div className="flex items-center gap-2 mb-3">
                  <MessageSquare size={13} className="text-text-muted" aria-hidden="true" />
                  <p className="text-caption font-body text-text-muted font-semibold uppercase tracking-widest">
                    Active Negotiations
                  </p>
                </div>
                {activeNegotiations.length === 0 ? (
                  <div className="rounded-card border border-border-default bg-bg-secondary p-4">
                    <p className="text-small font-body text-text-muted">No active negotiations right now.</p>
                  </div>
                ) : (
                  <div className="flex flex-col gap-2">
                    {activeNegotiations.map(a => (
                      <div
                        key={a.id}
                        className="flex items-center justify-between gap-3 p-3 rounded-card border border-border-default bg-bg-secondary hover:border-border-hover hover:bg-bg-card-hover transition-all duration-fast cursor-pointer"
                        onClick={() => navigate(`/contracts/${a.id}/negotiate`)}
                      >
                        <p className="text-small font-body font-medium text-text-primary truncate min-w-0">{a.name}</p>
                        {a.decision && <Badge type="decision" value={a.decision} size="sm" />}
                      </div>
                    ))}
                  </div>
                )}
              </motion.div>

              <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.35, delay: 0.2 }}>
                <div className="flex items-center gap-2 mb-3">
                  <BarChart3 size={13} className="text-text-muted" aria-hidden="true" />
                  <p className="text-caption font-body text-text-muted font-semibold uppercase tracking-widest">
                    Quick Actions
                  </p>
                </div>
                <div className="flex flex-col gap-2">
                  <Button variant="secondary" size="md" className="w-full justify-start" icon={<Plus size={14} />} onClick={() => navigate('/contracts/new')}>
                    Analyze New Agreement
                  </Button>
                  <Button variant="secondary" size="md" className="w-full justify-start" icon={<FileText size={14} />} onClick={() => navigate('/contracts')}>
                    View All Contracts
                  </Button>
                  <Button variant="secondary" size="md" className="w-full justify-start" icon={<MessageSquare size={14} />} onClick={() => navigate('/negotiations')}>
                    Negotiation Hub
                  </Button>
                  <Button variant="secondary" size="md" className="w-full justify-start" icon={<BarChart3 size={14} />} onClick={() => navigate('/analytics')}>
                    View Analytics
                  </Button>
                </div>
              </motion.div>
            </div>
          </div>
        </div>
      )}
    </PageContainer>
  )
}
