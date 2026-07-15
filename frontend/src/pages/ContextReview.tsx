import React, { useState } from 'react'
import { useNavigate, useSearchParams } from 'react-router-dom'
import { motion } from 'framer-motion'
import { Building2, Users, DollarSign, Target, Activity, ArrowRight, Pencil } from 'lucide-react'
import { PageContainer } from '@/components/layout/PageContainer'
import { Button } from '@/components/ui/Button'
import { Card } from '@/components/ui/Card'
import { Input } from '@/components/ui/Input'
import { Select } from '@/components/ui/Select'
import { Textarea } from '@/components/ui/Textarea'
import { Drawer } from '@/components/ui/Drawer'
import { useFounderContext } from '@/hooks/useFounderContext'
import { useAgreements } from '@/hooks/useAgreements'
import { useToast } from '@/components/ui/Toast'
import {
  INDUSTRY_OPTIONS, FUNDING_STAGE_OPTIONS, TEAM_SIZE_OPTIONS,
  REVENUE_OPTIONS, RISK_APPETITE_OPTIONS,
  industryLabel, fundingStageLabel, riskAppetiteLabel, teamSizeLabel, revenueLabel,
} from '@/lib/founderOptions'

const FIELD_LABELS: Record<string, { label: string; icon: React.ElementType }> = {
  companyName:  { label: 'Company',       icon: Building2 },
  industry:     { label: 'Industry',      icon: Building2 },
  fundingStage: { label: 'Stage',         icon: Activity },
  teamSize:     { label: 'Team Size',     icon: Users },
  revenueRange: { label: 'Revenue',       icon: DollarSign },
  riskAppetite: { label: 'Risk Appetite', icon: Target },
  currentGoal:  { label: 'Current Goal',  icon: Activity },
}

const LABEL_FORMATTERS: Record<string, (v: string) => string> = {
  industry: industryLabel,
  fundingStage: fundingStageLabel,
  riskAppetite: riskAppetiteLabel,
  teamSize: teamSizeLabel,
  revenueRange: revenueLabel,
}

function formatValue(key: string, value: string): string {
  if (!value) return '—'
  return LABEL_FORMATTERS[key]?.(value) ?? value
}

// ─── Inline "Edit Profile" drawer content ───────────────────────────────────
// Edits the same shared founder context used everywhere (Settings included) —
// there is exactly one profile source, so changes here show up in Settings too.
const EditProfileForm: React.FC<{ onSaved: () => void }> = ({ onSaved }) => {
  const { context, updateContext } = useFounderContext()
  const { toast } = useToast()
  const [form, setForm] = useState({
    companyName: context.companyName,
    industry: context.industry,
    fundingStage: context.fundingStage,
    teamSize: context.teamSize,
    revenueRange: context.revenueRange,
    riskAppetite: context.riskAppetite,
    currentGoal: context.currentGoal,
  })

  const handleSave = () => {
    updateContext(form)
    toast('Business profile updated', 'success')
    onSaved()
  }

  return (
    <div className="flex flex-col gap-4">
      <Input
        label="Company Name"
        value={form.companyName}
        onChange={e => setForm(f => ({ ...f, companyName: e.target.value }))}
      />
      <Select
        label="Industry"
        options={INDUSTRY_OPTIONS}
        value={form.industry}
        onChange={e => setForm(f => ({ ...f, industry: e.target.value }))}
      />
      <Select
        label="Funding Stage"
        options={FUNDING_STAGE_OPTIONS}
        value={form.fundingStage}
        onChange={e => setForm(f => ({ ...f, fundingStage: e.target.value as any }))}
      />
      <Select
        label="Team Size"
        options={TEAM_SIZE_OPTIONS}
        value={form.teamSize}
        onChange={e => setForm(f => ({ ...f, teamSize: e.target.value }))}
      />
      <Select
        label="Revenue Range"
        options={REVENUE_OPTIONS}
        value={form.revenueRange}
        onChange={e => setForm(f => ({ ...f, revenueRange: e.target.value }))}
      />
      <Select
        label="Risk Appetite"
        options={RISK_APPETITE_OPTIONS}
        value={form.riskAppetite}
        onChange={e => setForm(f => ({ ...f, riskAppetite: e.target.value as any }))}
      />
      <Textarea
        label="Current Goal"
        value={form.currentGoal}
        onChange={e => setForm(f => ({ ...f, currentGoal: e.target.value }))}
        rows={3}
      />
      <Button variant="primary" size="lg" className="w-full mt-2" onClick={handleSave}>
        Save & Use This Profile
      </Button>
    </div>
  )
}

export const ContextReviewPage: React.FC = () => {
  const navigate = useNavigate()
  const [searchParams] = useSearchParams()
  const { context } = useFounderContext()
  const { setStatus, getAgreement } = useAgreements()
  const [loading, setLoading] = useState(false)
  const [editOpen, setEditOpen] = useState(false)

  // The agreement ID comes from the URL so we can route to its analysis
  const agreementId = searchParams.get('id')

  const contextFields = Object.entries(FIELD_LABELS).map(([key, meta]) => ({
    key,
    label: meta.label,
    Icon: meta.icon,
    value: formatValue(key, context[key as keyof typeof context] as string),
    filled: Boolean(context[key as keyof typeof context]),
  }))

  const handleContinue = () => {
    if (!agreementId) { navigate('/contracts/new'); return }
    const agreement = getAgreement(agreementId)
    // Only a real, still-pending agreement can transition to context_confirmed —
    // never touch one that's already moved past this stage (e.g. reopened
    // via back button after analysis already started).
    if (agreement && agreement.status === 'uploaded') {
      setStatus(agreementId, 'context_confirmed')
    }
    setLoading(true)
    // Brief pause so the button feedback registers
    setTimeout(() => navigate(`/contracts/${agreementId}/analysis`), 300)
  }

  const hasContext = Boolean(context.companyName && context.fundingStage && context.riskAppetite)

  return (
    <PageContainer className="py-10 max-w-2xl">
      <motion.div
        initial={{ opacity: 0, y: 8 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.35 }}
      >
        <div className="flex items-center gap-2 mb-1">
          <div className="w-2 h-2 rounded-full bg-brand animate-pulse" aria-hidden="true" />
          <p className="text-small font-body text-brand font-medium uppercase tracking-widest">
            Before we analyze
          </p>
        </div>
        <h1 className="font-heading text-h1 text-text-primary mb-2">
          {hasContext ? 'Use your saved business profile?' : 'Tell us about your business'}
        </h1>
        <p className="text-body text-text-muted font-body mb-8">
          Pactra uses your business context to personalize every recommendation. Confirm before analysis begins.
        </p>

        <Card variant="default" className="mb-6">
          <p className="text-caption font-body text-text-muted font-semibold uppercase tracking-widest mb-4">
            Founder Decision Profile
          </p>
          <div className="grid grid-cols-2 gap-3">
            {contextFields.map(({ key, label, Icon, value, filled }) => (
              <div key={key} className={`flex items-start gap-3 rounded-input p-3 border ${filled ? 'border-border-default bg-bg-surface' : 'border-dashed border-border-default'}`}>
                <div className={`w-7 h-7 rounded-btn flex items-center justify-center shrink-0 ${filled ? 'bg-brand/10' : 'bg-bg-card-hover'}`}>
                  <Icon size={13} className={filled ? 'text-brand' : 'text-text-disabled'} aria-hidden="true" />
                </div>
                <div className="min-w-0">
                  <p className="text-[10px] font-body text-text-muted uppercase tracking-wide mb-0.5">{label}</p>
                  <p className={`text-small font-body font-medium truncate ${filled ? 'text-text-primary' : 'text-text-disabled italic'}`}>
                    {value}
                  </p>
                </div>
              </div>
            ))}
          </div>

          {!hasContext && (
            <div className="mt-4 rounded-input border border-amber/30 bg-amber/5 px-4 py-3">
              <p className="text-small font-body text-amber">
                Your profile is incomplete. Edit it below to get fully personalized recommendations.
              </p>
            </div>
          )}
        </Card>

        <div className="rounded-input border border-border-default bg-bg-surface px-4 py-3 mb-8">
          <p className="text-caption font-mono text-text-muted text-center tracking-wide">
            Business Context + Contract Intelligence = Decision Intelligence
          </p>
        </div>

        <div className="flex items-center gap-3 flex-wrap">
          <Button
            variant="primary"
            size="lg"
            loading={loading}
            icon={<ArrowRight size={16} />}
            iconPosition="right"
            onClick={handleContinue}
          >
            {hasContext ? 'Use Saved Business Profile' : 'Continue With This Profile'}
          </Button>
          <Button variant="secondary" size="lg" icon={<Pencil size={15} />} onClick={() => setEditOpen(true)}>
            Edit Profile
          </Button>
        </div>
      </motion.div>

      <Drawer open={editOpen} onClose={() => setEditOpen(false)} title="Edit Business Profile">
        <EditProfileForm onSaved={() => setEditOpen(false)} />
      </Drawer>
    </PageContainer>
  )
}
