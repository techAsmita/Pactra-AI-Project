import React from 'react'
import { motion } from 'framer-motion'
import { BarChart3, TrendingUp, AlertTriangle, FileText, Activity } from 'lucide-react'
import { PageContainer } from '@/components/layout/PageContainer'
import { Card } from '@/components/ui/Card'
import { Badge } from '@/components/ui/Badge'
import { EmptyState } from '@/components/ui/EmptyState'
import { AnimatedNumber } from '@/components/ui/AnimatedNumber'
import { useAnalytics } from '@/hooks/useAnalytics'
import { useNavigate } from 'react-router-dom'
import type { RiskLevel } from '@/types'

function timeAgo(iso: string): string {
  const diff = Date.now() - new Date(iso).getTime()
  const mins = Math.floor(diff / 60000)
  if (mins < 1) return 'just now'
  if (mins < 60) return `${mins}m ago`
  const hrs = Math.floor(mins / 60)
  if (hrs < 24) return `${hrs}h ago`
  return `${Math.floor(hrs / 24)}d ago`
}

const riskBarColor = (v: number) => v >= 71 ? 'bg-crimson' : v >= 41 ? 'bg-amber' : 'bg-success'
const riskTextColor: Record<RiskLevel, string> = { Low: 'text-success', Medium: 'text-amber', High: 'text-crimson', Critical: 'text-crimson' }
const severityDot: Record<RiskLevel, string> = { Low: 'bg-success', Medium: 'bg-amber', High: 'bg-crimson', Critical: 'bg-crimson' }

export const AnalyticsPage: React.FC = () => {
  const navigate = useNavigate()
  const analytics = useAnalytics()

  return (
    <PageContainer className="py-10">
      <h1 className="font-heading text-h1 text-text-primary">Analytics</h1>
      <p className="text-body text-text-muted mt-2 font-body mb-8">
        {analytics.analyzed > 0
          ? `Aggregated across all ${analytics.analyzed} analyzed agreement${analytics.analyzed !== 1 ? 's' : ''} in your workspace — decision patterns, risk trends, and negotiation outcomes.`
          : 'Decision patterns and risk trends across your agreements.'}
      </p>

      {analytics.analyzed === 0 ? (
        <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4 }}
          className="rounded-card border border-border-default bg-bg-secondary">
          <EmptyState icon={<BarChart3 size={48} strokeWidth={1.5} />}
            headline="Analytics will appear after your first decision"
            description="Once you've analyzed a few agreements, Pactra will surface decision distribution, risk trends, and negotiation outcomes here."
            ctaLabel="Analyze an Agreement" onCta={() => navigate('/contracts/new')} />
        </motion.div>
      ) : (
        <div className="flex flex-col gap-6">
          {/* Summary stats */}
          <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.35 }}
            className="grid grid-cols-2 tablet:grid-cols-4 gap-4">
            {[
              { label: 'Agreements Analyzed', value: analytics.analyzed, suffix: '', icon: FileText },
              { label: 'Avg Confidence', value: analytics.avgConfidence, suffix: '%', icon: TrendingUp },
              { label: 'Negotiation Rate', value: analytics.negotiationRate, suffix: '%', icon: Activity },
              { label: 'Overall Risk', value: analytics.overallRisk, suffix: '', icon: AlertTriangle },
            ].map(({ label, value, suffix, icon: Icon }, i) => (
              <motion.div key={label} initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3, delay: i * 0.06 }}
                className="rounded-card border border-border-default bg-bg-secondary p-5">
                <div className="flex items-center gap-2 mb-2">
                  <Icon size={14} className="text-text-muted" aria-hidden="true" />
                  <p className="text-caption font-body text-text-muted uppercase tracking-widest">{label}</p>
                </div>
                <p className="font-heading font-bold text-h3 text-text-primary">
                  {typeof value === 'number' ? <AnimatedNumber value={value} suffix={suffix} /> : value}
                </p>
              </motion.div>
            ))}
          </motion.div>

          <div className="grid tablet:grid-cols-2 gap-6">
            {/* Decision Distribution */}
            <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.35, delay: 0.1 }}>
              <Card variant="default">
                <h2 className="font-heading text-h4 text-text-primary mb-4">Decision Distribution</h2>
                <div className="flex flex-col gap-3">
                  {(['SIGN', 'NEGOTIATE', 'WAIT', 'ESCALATE'] as const).map(d => {
                    const count = analytics.decisionDistribution[d]
                    const pct = analytics.analyzed ? Math.round((count / analytics.analyzed) * 100) : 0
                    return (
                      <div key={d}>
                        <div className="flex items-center justify-between mb-1">
                          <Badge type="decision" value={d} size="sm" />
                          <span className="text-small font-mono text-text-muted">{count} ({pct}%)</span>
                        </div>
                        <div className="h-1.5 rounded-badge bg-bg-primary overflow-hidden">
                          <motion.div className="h-full rounded-badge bg-brand"
                            initial={{ width: 0 }} animate={{ width: `${pct}%` }}
                            transition={{ duration: 0.6, delay: 0.3, ease: 'easeOut' }} />
                        </div>
                      </div>
                    )
                  })}
                </div>
              </Card>
            </motion.div>

            {/* Risk Breakdown */}
            <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.35, delay: 0.15 }}>
              <Card variant="default">
                <h2 className="font-heading text-h4 text-text-primary mb-4">Average Risk Breakdown</h2>
                <div className="flex flex-col gap-3">
                  {[
                    { label: 'Financial Exposure', value: analytics.avgRiskBreakdown.financialExposure },
                    { label: 'Legal Complexity',   value: analytics.avgRiskBreakdown.legalComplexity },
                    { label: 'Operational Risk',   value: analytics.avgRiskBreakdown.operationalRisk },
                    { label: 'Compliance Risk',    value: analytics.avgRiskBreakdown.complianceRisk },
                  ].map(({ label, value }) => (
                    <div key={label}>
                      <div className="flex justify-between mb-1">
                        <span className="text-small font-body text-text-secondary">{label}</span>
                        <span className="text-small font-mono text-text-muted">{value}%</span>
                      </div>
                      <div className="h-1.5 rounded-badge bg-bg-primary overflow-hidden">
                        <motion.div className={`h-full rounded-badge ${riskBarColor(value)}`}
                          initial={{ width: 0 }} animate={{ width: `${value}%` }}
                          transition={{ duration: 0.6, delay: 0.35, ease: 'easeOut' }} />
                      </div>
                    </div>
                  ))}
                </div>
              </Card>
            </motion.div>

            {/* Top Clause Types */}
            {analytics.topClauseTypes.length > 0 && (
              <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.35, delay: 0.2 }}>
                <Card variant="default">
                  <h2 className="font-heading text-h4 text-text-primary mb-4">Most Flagged Clause Types</h2>
                  <div className="flex flex-col gap-2">
                    {analytics.topClauseTypes.map(({ title, count, severity }) => (
                      <div key={title} className="flex items-center justify-between py-2 border-b border-border-default last:border-0">
                        <div className="flex items-center gap-2 min-w-0">
                          <div className={`w-2 h-2 rounded-full shrink-0 ${severityDot[severity]}`} aria-hidden="true" />
                          <span className="text-small font-body text-text-secondary truncate">{title}</span>
                        </div>
                        <div className="flex items-center gap-2 shrink-0">
                          <span className="text-small font-mono text-text-muted">{count}×</span>
                          <Badge type="risk" value={severity} size="sm" />
                        </div>
                      </div>
                    ))}
                  </div>
                </Card>
              </motion.div>
            )}

            {/* Recent Activity */}
            <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.35, delay: 0.25 }}>
              <Card variant="default">
                <h2 className="font-heading text-h4 text-text-primary mb-4">Recent Activity</h2>
                <div className="flex flex-col gap-2">
                  {analytics.recentActivity.map(item => (
                    <div key={item.id}
                      className="flex items-center justify-between py-2 border-b border-border-default last:border-0 cursor-pointer hover:bg-bg-card-hover -mx-2 px-2 rounded transition-colors duration-fast focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand"
                      onClick={() => navigate(`/contracts/${item.id}/decision`)}
                      role="button"
                      tabIndex={0}
                      onKeyDown={(e) => {
                        if (e.key === 'Enter' || e.key === ' ') {
                          e.preventDefault()
                          navigate(`/contracts/${item.id}/decision`)
                        }
                      }}
                    >
                      <div className="min-w-0">
                        <p className="text-small font-body font-medium text-text-primary truncate">{item.name}</p>
                        <p className="text-caption font-mono text-text-muted">{timeAgo(item.updatedAt)}</p>
                      </div>
                      <div className="flex items-center gap-2 shrink-0">
                        {item.confidence !== undefined && (
                          <span className="text-caption font-mono text-text-muted">{item.confidence}%</span>
                        )}
                        {item.decision && <Badge type="decision" value={item.decision} size="sm" />}
                      </div>
                    </div>
                  ))}
                </div>
              </Card>
            </motion.div>
          </div>

          {/* Risk distribution */}
          <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.35, delay: 0.3 }}>
            <Card variant="default">
              <h2 className="font-heading text-h4 text-text-primary mb-4">Risk Level Distribution</h2>
              <div className="grid grid-cols-4 gap-4">
                {(['Low', 'Medium', 'High', 'Critical'] as RiskLevel[]).map(r => {
                  const count = analytics.riskDistribution[r]
                  const maxCount = Math.max(1, ...(['Low', 'Medium', 'High', 'Critical'] as RiskLevel[]).map(k => analytics.riskDistribution[k]))
                  const pct = Math.round((count / maxCount) * 100)
                  const barColor = r === 'Low' ? 'bg-success' : r === 'Medium' ? 'bg-amber' : r === 'High' ? 'bg-crimson' : 'bg-crimson-deep'
                  return (
                    <div key={r} className="text-center">
                      <p className={`font-heading font-bold text-h2 ${riskTextColor[r]}`}>
                        {count}
                      </p>
                      <div className="h-1.5 rounded-badge bg-bg-primary overflow-hidden mt-2 mb-1.5">
                        <motion.div
                          className={`h-full rounded-badge ${barColor}`}
                          initial={{ width: 0 }} animate={{ width: `${pct}%` }}
                          transition={{ duration: 0.6, delay: 0.4, ease: 'easeOut' }}
                        />
                      </div>
                      <p className="text-small font-body text-text-muted">{r}</p>
                    </div>
                  )
                })}
              </div>
            </Card>
          </motion.div>
        </div>
      )}
    </PageContainer>
  )
}
