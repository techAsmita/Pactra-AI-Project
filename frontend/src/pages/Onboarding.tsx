import React, { useState, useCallback, useMemo, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { motion, AnimatePresence, useReducedMotion } from 'framer-motion'
import {
  Zap, ArrowRight, ArrowLeft, Check, Building2, Briefcase,
  Users, TrendingUp, Target, Sparkles, FileText,
} from 'lucide-react'
import { cn } from '@/lib/utils'
import { Button } from '@/components/ui/Button'
import { Input } from '@/components/ui/Input'
import { Select } from '@/components/ui/Select'
import { RadioGroup } from '@/components/ui/RadioGroup'
import { Textarea } from '@/components/ui/Textarea'
import { useFounderContext } from '@/hooks/useFounderContext'
import type { FundingStage, RiskAppetite } from '@/types'
import {
  INDUSTRY_OPTIONS, FUNDING_STAGE_OPTIONS, TEAM_SIZE_OPTIONS,
  REVENUE_OPTIONS, RISK_APPETITE_OPTIONS,
} from '@/lib/founderOptions'

function usePrefersReducedMotion() {
  return useReducedMotion() ?? false
}

// ─── Step configuration ─────────────────────────────────────────────────────

type StepId = 1 | 2 | 3

const STEP_META: Record<StepId, { title: string; subtitle: string }> = {
  1: { title: 'Company Basics', subtitle: 'Let\'s start with the essentials.' },
  2: { title: 'Business Profile', subtitle: 'Help us understand where you are today.' },
  3: { title: 'Decision Profile', subtitle: 'This shapes every recommendation Pactra makes.' },
}

// ─── Validation ──────────────────────────────────────────────────────────

interface FormState {
  companyName: string
  industry: string
  fundingStage: FundingStage | ''
  teamSize: string
  revenueRange: string
  riskAppetite: RiskAppetite | ''
  currentGoal: string
}

type FieldName = keyof FormState

const MEANINGLESS_GOALS = new Set([
  'test', 'testing', 'hello', 'hi', 'whatever', 'asdf', 'idk', 'none',
  'n/a', 'na', 'goal', 'blah', 'lorem', 'lorem ipsum', 'sample', 'example',
  'placeholder', 'foo', 'bar', 'foobar', 'xxx', 'abc', 'random',
])

function validateField(field: FieldName, value: string): string | undefined {
  switch (field) {
    case 'companyName':
      if (!value.trim()) return 'Company name is required.'
      if (value.trim().length < 2) return 'Enter a valid company name.'
      return undefined
    case 'industry':
      if (!value) return 'Select your industry.'
      return undefined
    case 'fundingStage':
      if (!value) return 'Select your funding stage.'
      return undefined
    case 'teamSize':
      if (!value) return 'Select your team size.'
      return undefined
    case 'revenueRange':
      if (!value) return 'Select your revenue range.'
      return undefined
    case 'riskAppetite':
      if (!value) return 'Select your risk appetite.'
      return undefined
    case 'currentGoal': {
      const trimmed = value.trim()
      if (!trimmed) return 'Tell us your current goal.'
      const normalized = trimmed.toLowerCase().replace(/[.!?]+$/, '')
      if (MEANINGLESS_GOALS.has(normalized)) {
        return 'Please describe a real, specific goal — this shapes every recommendation Pactra makes.'
      }
      const wordCount = trimmed.split(/\s+/).filter(Boolean).length
      if (wordCount < 3 || trimmed.length < 20) {
        return 'Add a bit more detail (at least 20 characters) so Pactra can personalize recommendations.'
      }
      return undefined
    }
    default:
      return undefined
  }
}

const STEP_FIELDS: Record<StepId, FieldName[]> = {
  1: ['companyName', 'industry'],
  2: ['fundingStage', 'teamSize', 'revenueRange'],
  3: ['riskAppetite', 'currentGoal'],
}

// ─── Progress indicator ──────────────────────────────────────────────────

const ProgressIndicator: React.FC<{ current: StepId }> = ({ current }) => {
  const steps: StepId[] = [1, 2, 3]
  return (
    <div className="flex items-center gap-2" aria-label={`Step ${current} of 3`}>
      {steps.map((s, i) => (
        <React.Fragment key={s}>
          <div className="flex items-center gap-2">
            <motion.div
              animate={{
                backgroundColor: s <= current ? '#6366F1' : '#243047',
                scale: s === current ? 1.1 : 1,
              }}
              transition={{ duration: 0.3 }}
              className="w-7 h-7 rounded-full flex items-center justify-center shrink-0"
            >
              {s < current ? (
                <Check size={13} className="text-white" aria-hidden="true" />
              ) : (
                <span className={cn(
                  'text-caption font-mono font-bold',
                  s === current ? 'text-white' : 'text-text-disabled',
                )}>
                  {s}
                </span>
              )}
            </motion.div>
          </div>
          {i < steps.length - 1 && (
            <div className="flex-1 h-px bg-border-default relative overflow-hidden max-w-[60px]">
              <motion.div
                className="absolute inset-0 bg-brand"
                initial={false}
                animate={{ scaleX: s < current ? 1 : 0 }}
                style={{ originX: 0 }}
                transition={{ duration: 0.4, ease: 'easeOut' }}
              />
            </div>
          )}
        </React.Fragment>
      ))}
      <span className="text-caption font-body text-text-muted ml-2 font-mono">{current}/3</span>
    </div>
  )
}

// ─── Live Founder Profile Preview ───────────────────────────────────────

const PREVIEW_FIELDS: { key: FieldName; label: string; icon: React.ElementType }[] = [
  { key: 'companyName',  label: 'Company',        icon: Building2 },
  { key: 'industry',     label: 'Industry',       icon: Briefcase },
  { key: 'fundingStage', label: 'Stage',          icon: TrendingUp },
  { key: 'teamSize',     label: 'Team',           icon: Users },
  { key: 'revenueRange', label: 'Revenue',        icon: TrendingUp },
  { key: 'riskAppetite', label: 'Risk Appetite',  icon: Target },
  { key: 'currentGoal',  label: 'Goal',           icon: Sparkles },
]

function formatPreviewValue(key: FieldName, value: string): string {
  if (!value) return ''
  if (key === 'industry') return INDUSTRY_OPTIONS.find(o => o.value === value)?.label ?? value
  if (key === 'fundingStage') return FUNDING_STAGE_OPTIONS.find(o => o.value === value)?.label ?? value
  if (key === 'teamSize') return TEAM_SIZE_OPTIONS.find(o => o.value === value)?.label ?? value
  if (key === 'revenueRange') return REVENUE_OPTIONS.find(o => o.value === value)?.label ?? value
  if (key === 'riskAppetite') return RISK_APPETITE_OPTIONS.find(o => o.value === value)?.label ?? value
  return value
}

const FounderProfilePreview: React.FC<{ form: FormState }> = ({ form }) => {
  const reduced = usePrefersReducedMotion()
  const filledCount = PREVIEW_FIELDS.filter(f => form[f.key]).length
  const completion = Math.round((filledCount / PREVIEW_FIELDS.length) * 100)

  return (
    <div className="relative w-full max-w-[420px]">
      <div className="absolute -inset-6 bg-brand/6 rounded-[36px] blur-3xl pointer-events-none" aria-hidden="true" />
      <div className="relative rounded-card border border-border-default bg-bg-secondary shadow-elv-4 overflow-hidden">
        {/* Header */}
        <div className="px-5 py-4 border-b border-border-default bg-bg-surface/60 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <FileText size={14} className="text-text-muted" aria-hidden="true" />
            <span className="font-body text-small font-medium text-text-primary">
              Founder Decision Profile
            </span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-16 h-1.5 rounded-badge bg-bg-primary overflow-hidden">
              <motion.div
                className="h-full bg-brand rounded-badge"
                animate={{ width: `${completion}%` }}
                transition={{ duration: reduced ? 0 : 0.4, ease: 'easeOut' }}
              />
            </div>
            <span className="text-caption font-mono text-text-muted">{completion}%</span>
          </div>
        </div>

        {/* Fields */}
        <div className="p-5 flex flex-col gap-3">
          {PREVIEW_FIELDS.map(({ key, label, icon: Icon }) => {
            const value = formatPreviewValue(key, form[key])
            const hasValue = Boolean(value)
            return (
              <div key={key} className="flex items-start gap-3">
                <div className={cn(
                  'w-7 h-7 rounded-btn flex items-center justify-center shrink-0 transition-colors duration-normal',
                  hasValue ? 'bg-brand/15' : 'bg-bg-surface',
                )}>
                  <Icon size={13} className={hasValue ? 'text-brand' : 'text-text-disabled'} aria-hidden="true" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-[10px] font-body text-text-muted uppercase tracking-wider mb-0.5">
                    {label}
                  </p>
                  <AnimatePresence mode="wait">
                    {hasValue ? (
                      <motion.p
                        key={value}
                        initial={reduced ? { opacity: 1 } : { opacity: 0, y: -4 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.25, ease: 'easeOut' }}
                        className="text-small font-body font-medium text-text-primary truncate"
                      >
                        {value}
                      </motion.p>
                    ) : (
                      <motion.p
                        key="empty"
                        initial={{ opacity: 1 }}
                        className="text-small font-body text-text-disabled italic"
                      >
                        Not yet provided
                      </motion.p>
                    )}
                  </AnimatePresence>
                </div>
                {hasValue && (
                  <motion.div
                    initial={reduced ? {} : { scale: 0 }}
                    animate={{ scale: 1 }}
                    transition={{ type: 'spring', stiffness: 320, damping: 20 }}
                  >
                    <Check size={13} className="text-success shrink-0 mt-0.5" aria-hidden="true" />
                  </motion.div>
                )}
              </div>
            )
          })}
        </div>

        {/* Footer equation */}
        <div className="px-5 py-3 border-t border-border-default bg-bg-surface/40">
          <p className="text-[10px] font-mono text-text-muted text-center tracking-wide">
            This profile personalizes every future analysis
          </p>
        </div>
      </div>
    </div>
  )
}

// ─── AI Initialization Transition (closing moment) ──────────────────────

const INIT_AGENTS = [
  { emoji: '🧠', label: 'Legal Advisor Initializing…' },
  { emoji: '💰', label: 'Financial Strategist Ready…' },
  { emoji: '📈', label: 'Growth Advisor Ready…' },
  { emoji: '⚡', label: 'Decision Engine Personalizing…' },
]

const BuildingProfileTransition: React.FC<{ onComplete: () => void; companyName: string }> = ({ onComplete, companyName }) => {
  const reduced = usePrefersReducedMotion()
  const [stage, setStage] = useState<'complete' | 'building' | number | 'done'>('complete')

  useEffect(() => {
    if (reduced) {
      const t = setTimeout(onComplete, 400)
      return () => clearTimeout(t)
    }

    const timers: ReturnType<typeof setTimeout>[] = []
    const add = (fn: () => void, delay: number) => timers.push(setTimeout(fn, delay))

    add(() => setStage('building'), 280)
    INIT_AGENTS.forEach((_, i) => {
      add(() => setStage(i), 280 + 260 + i * 280)
    })
    add(() => setStage('done'), 280 + 260 + INIT_AGENTS.length * 280 + 200)
    add(() => onComplete(), 280 + 260 + INIT_AGENTS.length * 280 + 200 + 600)

    return () => timers.forEach(clearTimeout)
  }, [reduced, onComplete])

  return (
    <div className="fixed inset-0 z-50 bg-bg-primary flex items-center justify-center px-6">
      <div className="w-full max-w-sm flex flex-col items-center text-center gap-6">
        <motion.div
          initial={reduced ? {} : { scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ duration: 0.4, type: 'spring', stiffness: 260, damping: 20 }}
          className="w-14 h-14 rounded-card bg-brand flex items-center justify-center"
        >
          <Zap size={24} className="text-white" aria-hidden="true" />
        </motion.div>

        <AnimatePresence mode="wait">
          {stage === 'complete' && (
            <motion.div key="complete" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
              <div className="flex items-center gap-2 justify-center mb-1">
                <Check size={16} className="text-success" aria-hidden="true" />
                <p className="font-heading font-semibold text-h4 text-text-primary">
                  Founder Context Complete
                </p>
              </div>
              <p className="text-small font-body text-text-muted">for {companyName || 'your startup'}</p>
            </motion.div>
          )}

          {stage === 'building' && (
            <motion.div key="building" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
              <p className="font-heading font-semibold text-h4 text-text-primary mb-1">
                Building your Decision Profile…
              </p>
              <p className="text-small font-body text-text-muted">Personalizing Pactra for {companyName || 'your startup'}</p>
            </motion.div>
          )}

          {typeof stage === 'number' && (
            <motion.div key={`agent-${stage}`} initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -6 }}
              transition={{ duration: 0.25 }} className="flex flex-col items-center gap-3 w-full">
              <p className="font-heading font-semibold text-h4 text-text-primary mb-1">
                Building your Decision Profile…
              </p>
              <div className="flex flex-col gap-1.5 w-full max-w-[260px]">
                {INIT_AGENTS.slice(0, stage + 1).map((agent, i) => (
                  <motion.div
                    key={agent.label}
                    initial={reduced ? { opacity: 1 } : { opacity: 0, x: -8 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.2 }}
                    className="flex items-center gap-2 text-left"
                  >
                    <span className="text-[14px] shrink-0">{agent.emoji}</span>
                    <span className="text-caption font-mono text-text-muted flex-1">{agent.label}</span>
                    {i < stage && <Check size={11} className="text-success shrink-0" aria-hidden="true" />}
                    {i === stage && (
                      <motion.div
                        animate={reduced ? {} : { opacity: [1, 0.3, 1] }}
                        transition={{ duration: 0.8, repeat: Infinity }}
                        className="w-1.5 h-1.5 rounded-full bg-brand shrink-0"
                        aria-hidden="true"
                      />
                    )}
                  </motion.div>
                ))}
              </div>
            </motion.div>
          )}

          {stage === 'done' && (
            <motion.div key="done" initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.35, type: 'spring', stiffness: 260, damping: 20 }}>
              <div className="flex items-center gap-2 justify-center mb-1">
                <motion.div
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ type: 'spring', stiffness: 320, damping: 18 }}
                >
                  <Check size={18} className="text-success" aria-hidden="true" />
                </motion.div>
                <p className="font-heading font-semibold text-h4 text-text-primary">
                  Decision Profile Created
                </p>
              </div>
              <p className="text-small font-body text-text-muted">Taking you to your workspace…</p>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Progress dots */}
        <div className="flex items-center gap-1.5" aria-hidden="true">
          {[0, 1, 2, 3, 4].map(i => (
            <motion.div
              key={i}
              className="w-1.5 h-1.5 rounded-full bg-border-default"
              animate={
                !reduced
                  ? { backgroundColor: ['#243047', '#6366F1', '#243047'] }
                  : {}
              }
              transition={{ duration: 1.5, repeat: Infinity, delay: i * 0.15 }}
            />
          ))}
        </div>
      </div>
    </div>
  )
}

// ─── Onboarding Page ───────────────────────────────────────────────────────

export const OnboardingPage: React.FC = () => {
  const navigate = useNavigate()
  const reduced = usePrefersReducedMotion()
  const { updateContext, completeContext } = useFounderContext()

  const [step, setStep] = useState<StepId>(1)
  const [direction, setDirection] = useState<1 | -1>(1)
  const [form, setForm] = useState<FormState>({
    companyName: '',
    industry: '',
    fundingStage: '',
    teamSize: '',
    revenueRange: '',
    riskAppetite: '',
    currentGoal: '',
  })
  const [touched, setTouched] = useState<Partial<Record<FieldName, boolean>>>({})
  const [errors, setErrors] = useState<Partial<Record<FieldName, string>>>({})
  const [showTransition, setShowTransition] = useState(false)

  const setField = useCallback((field: FieldName, value: string) => {
    setForm(prev => ({ ...prev, [field]: value }))
    // Live-sync to global context as the user types
    updateContext({ [field]: value } as any)
    if (touched[field]) {
      setErrors(prev => ({ ...prev, [field]: validateField(field, value) }))
    }
  }, [touched, updateContext])

  // For radio/select-style fields where selection itself should immediately
  // clear any existing error — validates the new value directly rather than
  // relying on a stale `form` snapshot from a separate blur handler.
  const setFieldAndValidate = useCallback((field: FieldName, value: string) => {
    setForm(prev => ({ ...prev, [field]: value }))
    updateContext({ [field]: value } as any)
    setTouched(prev => ({ ...prev, [field]: true }))
    setErrors(prev => ({ ...prev, [field]: validateField(field, value) }))
  }, [updateContext])

  const handleBlur = useCallback((field: FieldName) => {
    setTouched(prev => ({ ...prev, [field]: true }))
    setErrors(prev => ({ ...prev, [field]: validateField(field, form[field]) }))
  }, [form])

  const validateStep = useCallback((s: StepId): boolean => {
    const fields = STEP_FIELDS[s]
    const newErrors: Partial<Record<FieldName, string>> = {}
    const newTouched: Partial<Record<FieldName, boolean>> = {}
    let valid = true

    fields.forEach(f => {
      const err = validateField(f, form[f])
      newTouched[f] = true
      if (err) {
        newErrors[f] = err
        valid = false
      }
    })

    setTouched(prev => ({ ...prev, ...newTouched }))
    setErrors(prev => ({ ...prev, ...newErrors }))
    return valid
  }, [form])

  const handleContinue = useCallback(() => {
    if (!validateStep(step)) return
    if (step < 3) {
      setDirection(1)
      setStep(s => (s + 1) as StepId)
    } else {
      // Final step — trigger closing transition
      completeContext()
      setShowTransition(true)
    }
  }, [step, validateStep, completeContext])

  const handleBack = useCallback(() => {
    if (step > 1) {
      setDirection(-1)
      setStep(s => (s - 1) as StepId)
    }
  }, [step])

  const handleTransitionComplete = useCallback(() => {
    navigate('/workspace')
  }, [navigate])

  const meta = STEP_META[step]

  const fieldError = (field: FieldName) => (touched[field] ? errors[field] : undefined)
  const fieldValidation = (field: FieldName): 'default' | 'error' =>
    touched[field] && errors[field] ? 'error' : 'default'

  const variants = useMemo(() => ({
    enter: (dir: 1 | -1) => ({ opacity: 0, x: reduced ? 0 : dir * 24 }),
    center: { opacity: 1, x: 0 },
    exit: (dir: 1 | -1) => ({ opacity: 0, x: reduced ? 0 : dir * -24 }),
  }), [reduced])

  return (
    <div className="min-h-screen bg-bg-primary flex flex-col">
      {/* Minimal header */}
      <header className="border-b border-border-default">
        <div className="max-w-content mx-auto px-4 tablet:px-10 desktop:px-20 h-16 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-7 h-7 rounded-btn bg-brand flex items-center justify-center">
              <Zap size={14} className="text-white" aria-hidden="true" />
            </div>
            <span className="font-heading font-bold text-h4 text-text-primary">Pactra</span>
          </div>
          <ProgressIndicator current={step} />
        </div>
      </header>

      <main className="flex-1 flex items-center">
        <div className="max-w-content mx-auto px-4 tablet:px-10 desktop:px-20 w-full py-12">
          <div className="grid desktop:grid-cols-[1fr_420px] gap-12 desktop:gap-16 items-start">

            {/* ── Left: Form ── */}
            <div className="max-w-lg">
              <AnimatePresence mode="wait" custom={direction}>
                <motion.div
                  key={step}
                  custom={direction}
                  variants={variants}
                  initial="enter"
                  animate="center"
                  exit="exit"
                  transition={{ duration: 0.3, ease: [0, 0, 0.2, 1] }}
                >
                  <p className="text-small font-body text-brand font-medium uppercase tracking-widest mb-2">
                    Step {step} of 3
                  </p>
                  <h1 className="font-heading font-bold text-h1 text-text-primary mb-2">
                    {meta.title}
                  </h1>
                  <p className="font-body text-body text-text-muted mb-8">
                    {meta.subtitle}
                  </p>

                  <div className="flex flex-col gap-5">
                    {step === 1 && (
                      <>
                        <Input
                          label="Company Name"
                          placeholder="Example: Acme Labs"
                          value={form.companyName}
                          onChange={e => setField('companyName', e.target.value)}
                          onBlur={() => handleBlur('companyName')}
                          validation={fieldValidation('companyName')}
                          helperText={fieldError('companyName')}
                          autoFocus
                        />
                        <Select
                          label="Industry"
                          placeholder="Select your industry"
                          options={INDUSTRY_OPTIONS}
                          value={form.industry}
                          onChange={e => setField('industry', e.target.value)}
                          onBlur={() => handleBlur('industry')}
                          validation={fieldValidation('industry')}
                          helperText={fieldError('industry')}
                        />
                      </>
                    )}

                    {step === 2 && (
                      <>
                        <RadioGroup
                          label="Funding Stage"
                          name="fundingStage"
                          value={form.fundingStage}
                          onChange={v => setFieldAndValidate('fundingStage', v)}
                          options={FUNDING_STAGE_OPTIONS}
                        />
                        {fieldError('fundingStage') && (
                          <p className="text-caption text-crimson font-body -mt-3">{fieldError('fundingStage')}</p>
                        )}
                        <Select
                          label="Team Size"
                          placeholder="Select team size"
                          options={TEAM_SIZE_OPTIONS}
                          value={form.teamSize}
                          onChange={e => setField('teamSize', e.target.value)}
                          onBlur={() => handleBlur('teamSize')}
                          validation={fieldValidation('teamSize')}
                          helperText={fieldError('teamSize')}
                        />
                        <Select
                          label="Revenue Range"
                          placeholder="Select revenue range"
                          options={REVENUE_OPTIONS}
                          value={form.revenueRange}
                          onChange={e => setField('revenueRange', e.target.value)}
                          onBlur={() => handleBlur('revenueRange')}
                          validation={fieldValidation('revenueRange')}
                          helperText={fieldError('revenueRange')}
                        />
                      </>
                    )}

                    {step === 3 && (
                      <>
                        <RadioGroup
                          label="Risk Appetite"
                          name="riskAppetite"
                          value={form.riskAppetite}
                          onChange={v => setFieldAndValidate('riskAppetite', v)}
                          options={RISK_APPETITE_OPTIONS}
                        />
                        {fieldError('riskAppetite') && (
                          <p className="text-caption text-crimson font-body -mt-3">{fieldError('riskAppetite')}</p>
                        )}
                        <Textarea
                          label="Current Goal"
                          placeholder="e.g. Close our first enterprise deals without overcommitting on terms"
                          value={form.currentGoal}
                          onChange={e => setField('currentGoal', e.target.value)}
                          onBlur={() => handleBlur('currentGoal')}
                          validation={fieldValidation('currentGoal')}
                          helperText={fieldError('currentGoal') ?? 'A specific sentence or two (20+ characters) — this helps Pactra weigh recommendations against what matters most to you right now.'}
                          maxLength={160}
                        />
                      </>
                    )}
                  </div>

                  {/* Navigation */}
                  <div className="flex items-center justify-between mt-10">
                    {step > 1 ? (
                      <Button variant="ghost" size="md" icon={<ArrowLeft size={15} />} onClick={handleBack}>
                        Back
                      </Button>
                    ) : (
                      <span />
                    )}
                    <Button
                      variant="primary"
                      size="lg"
                      icon={step === 3 ? <Sparkles size={16} /> : <ArrowRight size={16} />}
                      iconPosition="right"
                      onClick={handleContinue}
                    >
                      {step === 3 ? 'Build My Decision Profile' : 'Continue'}
                    </Button>
                  </div>
                </motion.div>
              </AnimatePresence>
            </div>

            {/* ── Right: Live preview (desktop only) ── */}
            <div className="hidden desktop:block sticky top-24">
              <FounderProfilePreview form={form} />
            </div>
          </div>
        </div>
      </main>

      {/* ── Closing transition ── */}
      <AnimatePresence>
        {showTransition && (
          <BuildingProfileTransition
            companyName={form.companyName}
            onComplete={handleTransitionComplete}
          />
        )}
      </AnimatePresence>
    </div>
  )
}
