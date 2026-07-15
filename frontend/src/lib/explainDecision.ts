import type { AnalysisResult, DecisionOutcome } from '@/types'

const RISK_FACTOR_LABELS: Record<keyof AnalysisResult['riskBreakdown'], string> = {
  financialExposure: 'financial exposure',
  legalComplexity: 'legal complexity',
  operationalRisk: 'operational risk',
  complianceRisk: 'compliance risk',
}

const DECISION_RATIONALE: Record<DecisionOutcome, string> = {
  SIGN: 'Terms are favorable and consistent with your risk appetite, so proceeding to signature carries minimal downside.',
  NEGOTIATE: 'Specific clauses can be improved with reasonable pushback before this becomes a fully signable agreement.',
  WAIT: 'Key terms need clarification before a confident decision can be made — acting now would be premature.',
  ESCALATE: 'The exposure identified here exceeds what should be decided without legal counsel review.',
}

/** Derives exactly 4 concise, data-driven explanation bullets for why the
 *  decision engine reached its recommendation. Every bullet is computed from
 *  the actual analysis object — nothing here is hardcoded per scenario. */
export function explainRecommendation(analysis: AnalysisResult): string[] {
  const bullets: string[] = []
  const clauseCount = analysis.clauses.length
  const critical = analysis.clauses.filter(c => c.severity === 'Critical').length
  const high = analysis.clauses.filter(c => c.severity === 'High').length
  const severeCount = critical + high

  // 1. Confidence basis
  bullets.push(
    `${analysis.confidence}% confidence, based on ${clauseCount} clause${clauseCount !== 1 ? 's' : ''} analyzed against your business context.`
  )

  // 2. Dominant risk factor from the actual breakdown
  const [topFactorKey, topFactorValue] = (Object.entries(analysis.riskBreakdown) as [keyof AnalysisResult['riskBreakdown'], number][])
    .sort((a, b) => b[1] - a[1])[0]
  bullets.push(
    `${RISK_FACTOR_LABELS[topFactorKey]} is the largest contributing factor at ${topFactorValue}%, driving the overall ${analysis.riskLevel} risk rating.`
  )

  // 3. Clause severity composition
  if (severeCount > 0) {
    bullets.push(
      `${severeCount} clause${severeCount !== 1 ? 's were' : ' was'} flagged ${critical > 0 ? 'Critical' : 'High'} severity, directly informing this recommendation.`
    )
  } else {
    bullets.push(
      'No Critical or High severity clauses were identified — terms are broadly within standard market ranges.'
    )
  }

  // 4. Decision-specific rationale
  bullets.push(DECISION_RATIONALE[analysis.decision])

  return bullets
}
