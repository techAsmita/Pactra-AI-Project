import type { FundingStage, RiskAppetite } from '@/types'

// ─── Shared founder/startup profile option sets ────────────────────────────
// Single source of truth for Onboarding, Settings, and any business-context
// display components. Do not redefine these lists elsewhere.

export const INDUSTRY_OPTIONS = [
  { value: 'b2b-saas', label: 'B2B SaaS' },
  { value: 'consumer', label: 'Consumer / D2C' },
  { value: 'fintech', label: 'Fintech' },
  { value: 'healthtech', label: 'Healthtech' },
  { value: 'marketplace', label: 'Marketplace' },
  { value: 'deeptech', label: 'Deep Tech / AI' },
  { value: 'ecommerce', label: 'E-commerce' },
  { value: 'other', label: 'Other' },
]

export const FUNDING_STAGE_OPTIONS: { value: FundingStage; label: string; description: string }[] = [
  { value: 'pre-seed', label: 'Pre-Seed', description: 'Pre-product or early traction' },
  { value: 'seed',     label: 'Seed',     description: 'Product-market fit signals' },
  { value: 'series-a', label: 'Series A', description: 'Scaling a proven model' },
  { value: 'series-b', label: 'Series B+', description: 'Growth stage' },
]

export const TEAM_SIZE_OPTIONS = [
  { value: '1-5',    label: '1–5 people' },
  { value: '6-15',   label: '6–15 people' },
  { value: '16-50',  label: '16–50 people' },
  { value: '51-200', label: '51–200 people' },
  { value: '200+',   label: '200+ people' },
]

export const REVENUE_OPTIONS = [
  { value: 'pre-revenue', label: 'Pre-revenue' },
  { value: 'under-100k',  label: 'Under $100K ARR' },
  { value: '100k-250k',   label: '$100K–$250K ARR' },
  { value: '250k-500k',   label: '$250K–$500K ARR' },
  { value: '500k-1m',     label: '$500K–$1M ARR' },
  { value: '1m+',         label: '$1M+ ARR' },
]

export const RISK_APPETITE_OPTIONS: { value: RiskAppetite; label: string; description: string }[] = [
  { value: 'conservative', label: 'Conservative', description: 'Minimize exposure, avoid risk where possible' },
  { value: 'moderate',     label: 'Moderate',      description: 'Balance growth with manageable risk' },
  { value: 'aggressive',   label: 'Aggressive',    description: 'Move fast, accept higher risk for upside' },
]

export function industryLabel(value: string): string {
  return INDUSTRY_OPTIONS.find(o => o.value === value)?.label ?? value
}

export function fundingStageLabel(value: string): string {
  return FUNDING_STAGE_OPTIONS.find(o => o.value === value)?.label ?? value
}

export function riskAppetiteLabel(value: string): string {
  return RISK_APPETITE_OPTIONS.find(o => o.value === value)?.label ?? value
}

export function teamSizeLabel(value: string): string {
  return TEAM_SIZE_OPTIONS.find(o => o.value === value)?.label ?? value
}

export function revenueLabel(value: string): string {
  return REVENUE_OPTIONS.find(o => o.value === value)?.label ?? value
}
