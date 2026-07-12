import type { AnalysisResult, DecisionOutcome, RiskLevel, ClauseFlag } from '@/types'

// ─── Realistic sample analysis generator ───────────────────────────────────
// Produces varied, plausible decision data for the demo/MVP. In production
// this is replaced by the actual multi-agent backend response.

interface ScenarioTemplate {
  decision: DecisionOutcome
  confidence: number
  riskLevel: RiskLevel
  businessImpact: AnalysisResult['businessImpact']
  riskBreakdown: AnalysisResult['riskBreakdown']
  keyRisks: string[]
  recommendedActions: string[]
  clauses: Omit<ClauseFlag, 'id'>[]
  summary: string
}

const SCENARIOS: ScenarioTemplate[] = [
  {
    decision: 'NEGOTIATE',
    confidence: 92,
    riskLevel: 'High',
    businessImpact: { revenueRisk: 'Medium', cashFlow: 'High', growthImpact: 'Low', negotiationPriority: 'Critical' },
    riskBreakdown: { financialExposure: 72, legalComplexity: 41, operationalRisk: 81, complianceRisk: 33 },
    keyRisks: [
      'Unlimited liability exposes the company beyond contract value',
      'Auto-renewal clause locks in terms without a review window',
      'Payment terms create a 45-day cash flow gap',
    ],
    recommendedActions: [
      'Request a liability cap at 1× contract value',
      'Negotiate a 30-day notice period before auto-renewal',
      'Shorten payment terms from Net-60 to Net-30',
    ],
    clauses: [
      { reference: '§4.2', title: 'Unlimited Liability', severity: 'High', summary: 'This clause holds your company responsible for all damages with no upper limit, regardless of fault.' },
      { reference: '§8.1', title: 'Auto-Renewal Without Notice', severity: 'High', summary: 'The agreement renews automatically each year unless cancelled 90 days in advance — easy to miss.' },
      { reference: '§3.5', title: 'Net-60 Payment Terms', severity: 'Medium', summary: 'Payment is due 60 days after invoicing, which may strain short-term cash flow at your stage.' },
      { reference: '§7.1', title: 'Vertical Exclusivity', severity: 'Medium', summary: 'Restricts your company from working with competitors in adjacent verticals for the contract term.' },
    ],
    summary: 'This agreement carries meaningful financial and operational risk relative to your stage. The liability and renewal terms favor the counterparty significantly. We recommend negotiating before signing — your leverage here is strong given the deal size.',
  },
  {
    decision: 'WAIT',
    confidence: 78,
    riskLevel: 'Medium',
    businessImpact: { revenueRisk: 'Low', cashFlow: 'Medium', growthImpact: 'Medium', negotiationPriority: 'Medium' },
    riskBreakdown: { financialExposure: 38, legalComplexity: 54, operationalRisk: 45, complianceRisk: 29 },
    keyRisks: [
      'Termination clause requires 120-day notice, longer than industry standard',
      'IP assignment language is broader than necessary for the engagement',
      'No clear data deletion timeline upon contract end',
    ],
    recommendedActions: [
      'Clarify the IP assignment scope with legal counsel before proceeding',
      'Request a shorter, standard 60-day termination notice period',
      'Add an explicit data deletion clause with a defined timeline',
    ],
    clauses: [
      { reference: '§9.3', title: 'Extended Termination Notice', severity: 'Medium', summary: 'Requires 120 days notice to terminate, well above the 30-60 day industry standard.' },
      { reference: '§5.4', title: 'Broad IP Assignment', severity: 'Medium', summary: 'Assigns IP rights more broadly than the scope of work suggests is necessary.' },
      { reference: '§11.2', title: 'Undefined Data Deletion', severity: 'Low', summary: 'No clear timeline for data deletion after the relationship ends.' },
    ],
    summary: 'This agreement is moderate risk overall, but a few clauses need clarification before you commit. The IP and termination terms are not deal-breakers, but they deserve a second look — there\'s no urgency to sign immediately.',
  },
  {
    decision: 'SIGN',
    confidence: 88,
    riskLevel: 'Low',
    businessImpact: { revenueRisk: 'Low', cashFlow: 'Low', growthImpact: 'Low', negotiationPriority: 'Low' },
    riskBreakdown: { financialExposure: 18, legalComplexity: 22, operationalRisk: 15, complianceRisk: 12 },
    keyRisks: [
      'Standard mutual NDA terms with no unusual exposure',
      'Liability is appropriately capped at contract value',
    ],
    recommendedActions: [
      'Proceed to signature — terms are favorable and standard for your stage',
      'Calendar the renewal date for future review',
    ],
    clauses: [
      { reference: '§2.1', title: 'Mutual Confidentiality', severity: 'Low', summary: 'Standard two-way confidentiality terms with reasonable carve-outs for public information.' },
      { reference: '§6.0', title: 'Capped Liability', severity: 'Low', summary: 'Liability is capped at the total contract value, which is standard and protective.' },
    ],
    summary: 'This is a low-risk, well-structured agreement. Terms are standard for your industry and stage, with no clauses requiring negotiation. You can proceed with confidence.',
  },
  {
    decision: 'ESCALATE',
    confidence: 95,
    riskLevel: 'Critical',
    businessImpact: { revenueRisk: 'High', cashFlow: 'High', growthImpact: 'High', negotiationPriority: 'Critical' },
    riskBreakdown: { financialExposure: 89, legalComplexity: 76, operationalRisk: 71, complianceRisk: 68 },
    keyRisks: [
      'Indemnification clause exposes founders to personal liability',
      'Non-compete extends 3 years beyond contract term across all markets',
      'Change of control clause allows immediate termination on funding events',
    ],
    recommendedActions: [
      'Engage legal counsel before any further discussion',
      'Do not sign without removing or significantly narrowing the personal indemnification clause',
      'Push back on the non-compete scope — 3 years company-wide is not standard',
    ],
    clauses: [
      { reference: '§12.4', title: 'Personal Indemnification', severity: 'Critical', summary: 'Extends liability to founders personally, beyond the corporate entity — highly unusual and risky.' },
      { reference: '§14.1', title: 'Overbroad Non-Compete', severity: 'High', summary: 'Restricts your company from operating in the entire market for 3 years after the contract ends.' },
      { reference: '§16.2', title: 'Change of Control Termination', severity: 'High', summary: 'Counterparty can terminate immediately if you raise funding or change ownership — a major risk during fundraising.' },
    ],
    summary: 'This agreement contains terms that pose serious risk to your company and founders personally. We strongly recommend involving legal counsel before any further negotiation. Several clauses are non-standard and should not be accepted as written.',
  },
]

let scenarioIndex = 0

/** Deterministically cycles through scenarios so repeated demo uploads show variety. */
export function generateSampleAnalysis(): AnalysisResult {
  const template = SCENARIOS[scenarioIndex % SCENARIOS.length]
  scenarioIndex += 1

  return {
    decision: template.decision,
    confidence: template.confidence,
    riskLevel: template.riskLevel,
    businessImpact: template.businessImpact,
    riskBreakdown: template.riskBreakdown,
    keyRisks: template.keyRisks,
    recommendedActions: template.recommendedActions,
    clauses: template.clauses.map((c, i) => ({ ...c, id: `clause_${Date.now()}_${i}` })),
    summary: template.summary,
  }
}

export function inferAgreementType(fileName: string): import('@/types').AgreementType {
  const lower = fileName.toLowerCase()
  if (lower.includes('nda') || lower.includes('confidential')) return 'NDA'
  if (lower.includes('employ') || lower.includes('offer')) return 'Employment Contract'
  if (lower.includes('safe') || lower.includes('convertible')) return 'SAFE Agreement'
  if (lower.includes('partner')) return 'Partnership Agreement'
  if (lower.includes('client') || lower.includes('master service')) return 'Client Contract'
  return 'Vendor Agreement'
}
