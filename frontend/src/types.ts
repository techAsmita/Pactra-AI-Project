// ─── Decision Types ────────────────────────────────────────────────────────

export type DecisionOutcome = 'SIGN' | 'NEGOTIATE' | 'WAIT' | 'ESCALATE'
export type RiskLevel = 'Low' | 'Medium' | 'High' | 'Critical'
export type AgentStatus = 'waiting' | 'initializing' | 'running' | 'completed' | 'failed'
export type AgreementStatus =
  | 'new'
  | 'uploaded'
  | 'parsing'
  | 'context_confirmed'
  | 'analyzing'
  | 'decision_ready'
  | 'negotiating'
  | 'completed'
  | 'archived'

// ─── Agent Types ───────────────────────────────────────────────────────────

export type AgentId =
  | 'legal_advisor'
  | 'financial_strategist'
  | 'growth_advisor'
  | 'negotiation_coach'
  | 'decision_engine'

export interface Agent {
  id: AgentId
  name: string
  personality: string
  emoji: string
  status: AgentStatus
  progress: number // 0–100
  latestActivity?: string
  completedAt?: string
}

// ─── Agreement Types ───────────────────────────────────────────────────────

export type AgreementType = 'Vendor Agreement' | 'Employment Contract' | 'NDA' | 'SAFE Agreement' | 'Partnership Agreement' | 'Client Contract'

export interface ClauseFlag {
  id: string
  reference: string // e.g. "§4.2"
  title: string
  severity: RiskLevel
  summary: string
}

export interface BusinessImpact {
  revenueRisk: RiskLevel
  cashFlow: RiskLevel
  growthImpact: RiskLevel
  negotiationPriority: RiskLevel
}

export interface RiskBreakdown {
  financialExposure: number // 0-100
  legalComplexity: number
  operationalRisk: number
  complianceRisk: number
}

export interface AnalysisResult {
  decision: DecisionOutcome
  confidence: number
  riskLevel: RiskLevel
  businessImpact: BusinessImpact
  riskBreakdown: RiskBreakdown
  keyRisks: string[]
  recommendedActions: string[]
  clauses: ClauseFlag[]
  summary: string
}

export interface Agreement {
  id: string
  name: string
  type: AgreementType
  status: AgreementStatus
  fileName: string
  fileSize: number // bytes
  decision?: DecisionOutcome
  riskLevel?: RiskLevel
  confidence?: number
  analysis?: AnalysisResult
  updatedAt: string
  createdAt: string
}

// ─── Founder Types ─────────────────────────────────────────────────────────

export type FundingStage = 'pre-seed' | 'seed' | 'series-a' | 'series-b' | 'other'
export type RiskAppetite = 'conservative' | 'moderate' | 'aggressive'

export interface FounderProfile {
  id: string
  name: string
  email: string
  company: string
  industry: string
  fundingStage: FundingStage
  employees: number
  revenueRange: string
  riskAppetite: RiskAppetite
  currentGoal: string
}

// ─── Navigation Types ──────────────────────────────────────────────────────

export interface NavItem {
  label: string
  href: string
  icon: React.ComponentType<{ size?: number; className?: string }>
  badge?: number
}

// ─── Toast Types ───────────────────────────────────────────────────────────

export type ToastType = 'success' | 'warning' | 'error' | 'info'

export interface Toast {
  id: string
  type: ToastType
  message: string
  duration?: number
  action?: { label: string; onClick: () => void }
}
