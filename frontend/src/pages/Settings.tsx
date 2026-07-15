import React, { useState, useMemo } from 'react'
import { motion } from 'framer-motion'
import { Building2, User, AlertCircle } from 'lucide-react'
import { PageContainer } from '@/components/layout/PageContainer'
import { Card } from '@/components/ui/Card'
import { Input } from '@/components/ui/Input'
import { Select } from '@/components/ui/Select'
import { Button } from '@/components/ui/Button'
import { useFounderContext } from '@/hooks/useFounderContext'
import { useToast } from '@/components/ui/Toast'
import { INDUSTRY_OPTIONS, FUNDING_STAGE_OPTIONS, RISK_APPETITE_OPTIONS } from '@/lib/founderOptions'

interface FormErrors {
  founderName?: string
  founderEmail?: string
  companyName?: string
  industry?: string
  fundingStage?: string
  riskAppetite?: string
}

function validate(form: {
  founderName: string; founderEmail: string; companyName: string
  industry: string; fundingStage: string; riskAppetite: string
}): FormErrors {
  const errors: FormErrors = {}
  if (!form.founderName.trim()) errors.founderName = 'Name is required.'
  if (!form.founderEmail.trim()) errors.founderEmail = 'Email is required.'
  else if (!/^\S+@\S+\.\S+$/.test(form.founderEmail)) errors.founderEmail = 'Enter a valid email address.'
  if (!form.companyName.trim()) errors.companyName = 'Company name is required.'
  if (!form.industry) errors.industry = 'Industry is required.'
  if (!form.fundingStage) errors.fundingStage = 'Funding stage is required.'
  if (!form.riskAppetite) errors.riskAppetite = 'Risk appetite is required.'
  return errors
}

export const SettingsPage: React.FC = () => {
  const { context, updateContext } = useFounderContext()
  const { toast } = useToast()

  const [form, setForm] = useState({
    founderName: context.founderName,
    founderEmail: context.founderEmail,
    companyName: context.companyName,
    industry: context.industry,
    fundingStage: context.fundingStage,
    riskAppetite: context.riskAppetite,
    currentGoal: context.currentGoal,
  })
  const [submitted, setSubmitted] = useState(false)

  const isDirty = useMemo(() => (
    form.founderName !== context.founderName ||
    form.founderEmail !== context.founderEmail ||
    form.companyName !== context.companyName ||
    form.industry !== context.industry ||
    form.fundingStage !== context.fundingStage ||
    form.riskAppetite !== context.riskAppetite ||
    form.currentGoal !== context.currentGoal
  ), [form, context])

  // Recomputed on every render from current form state, so errors clear the
  // instant a field becomes valid — no need to click Save again to see it.
  const errors = validate(form)
  const showErrors = submitted
  const hasErrors = Object.keys(errors).length > 0

  const fieldValidation = (key: keyof FormErrors) => (showErrors && errors[key] ? 'error' : 'default') as 'error' | 'default'
  const fieldHelper = (key: keyof FormErrors) => (showErrors ? errors[key] : undefined)

  const handleSave = () => {
    setSubmitted(true)
    if (hasErrors) {
      toast('Fix the highlighted fields before saving.', 'error')
      return
    }
    // Single shared founder profile source — persisted to sessionStorage by
    // useFounderContext, and read by Upload, Analysis, Decision, Negotiation.
    updateContext(form)
    toast('Profile updated — saved and applied across the app.', 'success')
  }

  return (
    <PageContainer className="py-10 max-w-3xl">
      <h1 className="font-heading text-h1 text-text-primary">Settings</h1>
      <p className="text-body text-text-muted mt-2 font-body mb-10">
        Manage your founder profile and startup context. This is the one shared profile used
        everywhere Pactra personalizes an analysis, decision, or negotiation.
      </p>

      <motion.div
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
        className="flex flex-col gap-6"
      >
        <Card variant="default">
          <div className="flex items-center gap-3 mb-6">
            <div className="w-9 h-9 rounded-btn bg-brand/10 flex items-center justify-center">
              <User size={16} className="text-brand" aria-hidden="true" />
            </div>
            <h2 className="font-heading text-h4 text-text-primary">Founder Profile</h2>
          </div>
          <div className="grid tablet:grid-cols-2 gap-4">
            <Input
              label="Name"
              placeholder="Your name"
              value={form.founderName}
              onChange={e => setForm(f => ({ ...f, founderName: e.target.value }))}
              validation={fieldValidation('founderName')}
              helperText={fieldHelper('founderName')}
            />
            <Input
              label="Email"
              type="email"
              placeholder="you@company.com"
              value={form.founderEmail}
              onChange={e => setForm(f => ({ ...f, founderEmail: e.target.value }))}
              validation={fieldValidation('founderEmail')}
              helperText={fieldHelper('founderEmail')}
            />
          </div>
        </Card>

        <Card variant="default">
          <div className="flex items-center gap-3 mb-2">
            <div className="w-9 h-9 rounded-btn bg-brand/10 flex items-center justify-center">
              <Building2 size={16} className="text-brand" aria-hidden="true" />
            </div>
            <h2 className="font-heading text-h4 text-text-primary">Startup Profile</h2>
          </div>
          <p className="text-small text-text-muted font-body mb-5">
            Changes apply to all future analyses. Past decisions are preserved as generated.
          </p>
          <div className="grid tablet:grid-cols-2 gap-4">
            <Input
              label="Company Name"
              value={form.companyName}
              onChange={e => setForm(f => ({ ...f, companyName: e.target.value }))}
              validation={fieldValidation('companyName')}
              helperText={fieldHelper('companyName')}
            />
            <Select
              label="Industry"
              options={INDUSTRY_OPTIONS}
              value={form.industry}
              onChange={e => setForm(f => ({ ...f, industry: e.target.value }))}
              validation={fieldValidation('industry')}
              helperText={fieldHelper('industry')}
            />
            <Select
              label="Funding Stage"
              options={FUNDING_STAGE_OPTIONS}
              value={form.fundingStage}
              onChange={e => setForm(f => ({ ...f, fundingStage: e.target.value as any }))}
              validation={fieldValidation('fundingStage')}
              helperText={fieldHelper('fundingStage')}
            />
            <Select
              label="Risk Appetite"
              options={RISK_APPETITE_OPTIONS}
              value={form.riskAppetite}
              onChange={e => setForm(f => ({ ...f, riskAppetite: e.target.value as any }))}
              validation={fieldValidation('riskAppetite')}
              helperText={fieldHelper('riskAppetite')}
            />
          </div>
        </Card>

        <div className="flex items-center justify-between">
          {isDirty ? (
            <div className="flex items-center gap-2 text-amber">
              <AlertCircle size={14} aria-hidden="true" />
              <p className="text-caption font-body">You have unsaved changes.</p>
            </div>
          ) : <span />}
          <Button variant="primary" size="md" onClick={handleSave} disabled={!isDirty}>
            Save Changes
          </Button>
        </div>
      </motion.div>
    </PageContainer>
  )
}
