import { useMemo } from 'react'
import { useAgreements } from './useAgreements'
import type { DecisionOutcome, RiskLevel } from '@/types'

export interface AnalyticsSummary {
  total: number
  analyzed: number
  negotiating: number
  archived: number
  avgConfidence: number
  decisionDistribution: Record<DecisionOutcome, number>
  riskDistribution: Record<RiskLevel, number>
  avgRiskBreakdown: { financialExposure: number; legalComplexity: number; operationalRisk: number; complianceRisk: number }
  topClauseTypes: { title: string; count: number; severity: RiskLevel }[]
  negotiationRate: number
  recentActivity: { id: string; name: string; decision?: DecisionOutcome; confidence?: number; updatedAt: string }[]
  overallRisk: RiskLevel
}

const EMPTY: AnalyticsSummary = {
  total: 0, analyzed: 0, negotiating: 0, archived: 0, avgConfidence: 0,
  decisionDistribution: { SIGN: 0, NEGOTIATE: 0, WAIT: 0, ESCALATE: 0 },
  riskDistribution: { Low: 0, Medium: 0, High: 0, Critical: 0 },
  avgRiskBreakdown: { financialExposure: 0, legalComplexity: 0, operationalRisk: 0, complianceRisk: 0 },
  topClauseTypes: [], negotiationRate: 0, recentActivity: [], overallRisk: 'Low',
}

export function useAnalytics(): AnalyticsSummary {
  const { agreements } = useAgreements()

  return useMemo(() => {
    if (!agreements.length) return EMPTY

    const analyzed = agreements.filter(a => a.analysis)
    const total = agreements.length
    const negotiating = agreements.filter(a => a.status === 'negotiating').length
    const archived = agreements.filter(a => a.status === 'archived').length

    if (!analyzed.length) return { ...EMPTY, total, negotiating, archived }

    const avgConfidence = Math.round(
      analyzed.reduce((s, a) => s + (a.confidence ?? 0), 0) / analyzed.length
    )

    const decisionDistribution: Record<DecisionOutcome, number> = { SIGN: 0, NEGOTIATE: 0, WAIT: 0, ESCALATE: 0 }
    const riskDistribution: Record<RiskLevel, number> = { Low: 0, Medium: 0, High: 0, Critical: 0 }

    analyzed.forEach(a => {
      if (a.decision) decisionDistribution[a.decision]++
      if (a.riskLevel) riskDistribution[a.riskLevel]++
    })

    const avgRiskBreakdown = {
      financialExposure: Math.round(analyzed.reduce((s, a) => s + (a.analysis?.riskBreakdown.financialExposure ?? 0), 0) / analyzed.length),
      legalComplexity: Math.round(analyzed.reduce((s, a) => s + (a.analysis?.riskBreakdown.legalComplexity ?? 0), 0) / analyzed.length),
      operationalRisk: Math.round(analyzed.reduce((s, a) => s + (a.analysis?.riskBreakdown.operationalRisk ?? 0), 0) / analyzed.length),
      complianceRisk: Math.round(analyzed.reduce((s, a) => s + (a.analysis?.riskBreakdown.complianceRisk ?? 0), 0) / analyzed.length),
    }

    // Clause frequency across all analyses
    const clauseMap: Record<string, { count: number; severity: RiskLevel }> = {}
    analyzed.forEach(a => {
      a.analysis?.clauses.forEach(c => {
        if (!clauseMap[c.title]) clauseMap[c.title] = { count: 0, severity: c.severity }
        clauseMap[c.title].count++
      })
    })
    const topClauseTypes = Object.entries(clauseMap)
      .map(([title, { count, severity }]) => ({ title, count, severity }))
      .sort((a, b) => b.count - a.count)
      .slice(0, 5)

    const negotiationRate = analyzed.length
      ? Math.round(((decisionDistribution.NEGOTIATE + decisionDistribution.ESCALATE) / analyzed.length) * 100)
      : 0

    const recentActivity = [...agreements]
      .sort((a, b) => new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime())
      .slice(0, 5)
      .map(a => ({ id: a.id, name: a.name, decision: a.decision, confidence: a.confidence, updatedAt: a.updatedAt }))

    // Overall risk — weighted toward high/critical
    const highCount = riskDistribution.High + riskDistribution.Critical
    const overallRisk: RiskLevel =
      highCount >= analyzed.length * 0.5 ? 'High'
      : highCount >= analyzed.length * 0.25 ? 'Medium'
      : riskDistribution.Medium >= analyzed.length * 0.5 ? 'Medium'
      : 'Low'

    return { total, analyzed: analyzed.length, negotiating, archived, avgConfidence, decisionDistribution, riskDistribution, avgRiskBreakdown, topClauseTypes, negotiationRate, recentActivity, overallRisk }
  }, [agreements])
}
