import React, { useEffect, useRef, useState, useCallback } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { motion, useInView, useReducedMotion, AnimatePresence } from 'framer-motion'
import {
  Zap, Menu, X, ArrowRight, CheckCircle, ChevronRight,
  Shield, Brain, Handshake, TrendingUp, Sparkles,
  FileText, Check, Building2, Users, DollarSign,
  Target, Activity, AlertCircle,
} from 'lucide-react'
import { cn } from '@/lib/utils'
import { Button } from '@/components/ui/Button'
import { Badge } from '@/components/ui/Badge'

// ─── Utilities ─────────────────────────────────────────────────────────────

function usePrefersReducedMotion() {
  return useReducedMotion() ?? false
}

const FadeUp: React.FC<{
  children: React.ReactNode
  delay?: number
  className?: string
}> = ({ children, delay = 0, className }) => {
  const ref = useRef(null)
  const inView = useInView(ref, { once: true, margin: '-60px' })
  const reduced = usePrefersReducedMotion()
  return (
    <motion.div
      ref={ref}
      initial={reduced ? { opacity: 1 } : { opacity: 0, y: 20 }}
      animate={inView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.55, delay, ease: [0, 0, 0.2, 1] }}
      className={className}
    >
      {children}
    </motion.div>
  )
}

// ─── Navigation ────────────────────────────────────────────────────────────

const LandingNav: React.FC = () => {
  const [scrolled, setScrolled] = useState(false)
  const [mobileOpen, setMobileOpen] = useState(false)
  const reduced = usePrefersReducedMotion()

  useEffect(() => {
    const h = () => setScrolled(window.scrollY > 24)
    window.addEventListener('scroll', h, { passive: true })
    return () => window.removeEventListener('scroll', h)
  }, [])

  useEffect(() => {
    const h = (e: KeyboardEvent) => { if (e.key === 'Escape') setMobileOpen(false) }
    document.addEventListener('keydown', h)
    return () => document.removeEventListener('keydown', h)
  }, [])

  const links = [
    { label: 'Features', href: '#features' },
    { label: 'How it Works', href: '#how-it-works' },
    { label: 'About', href: '#about' },
    { label: 'GitHub', href: '#' },
  ]

  return (
    <header className={cn(
      'fixed top-0 left-0 right-0 z-50 transition-all duration-normal',
      scrolled
        ? 'bg-bg-primary/92 backdrop-blur-md border-b border-border-default shadow-elv-2'
        : 'bg-transparent',
    )}>
      <div className="max-w-content mx-auto px-4 tablet:px-10 desktop:px-20">
        <div className="flex items-center justify-between h-16 desktop:h-20">
          <Link to="/" className="flex items-center gap-3 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand rounded-btn">
            <div className="flex items-center justify-center w-8 h-8 rounded-btn bg-brand shrink-0">
              <Zap size={16} className="text-white" aria-hidden="true" />
            </div>
            <span className="font-heading font-bold text-h4 text-text-primary">Pactra</span>
          </Link>

          <nav className="hidden desktop:flex items-center gap-8" aria-label="Main navigation">
            {links.map(l => (
              <a key={l.label} href={l.href}
                className="text-small font-medium font-body text-text-muted hover:text-text-primary transition-colors duration-fast focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand rounded">
                {l.label}
              </a>
            ))}
          </nav>

          <div className="hidden desktop:flex items-center gap-3">
            <Link to="/login"><Button variant="ghost" size="sm">Sign In</Button></Link>
            <Link to="/onboarding">
              <Button variant="primary" size="sm" icon={<ArrowRight size={14} />} iconPosition="right">
                Start Analysis
              </Button>
            </Link>
          </div>

          <button
            className="desktop:hidden flex items-center justify-center w-10 h-10 rounded-btn text-text-muted hover:text-text-primary hover:bg-bg-surface transition-all duration-fast focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand"
            onClick={() => setMobileOpen(o => !o)}
            aria-label={mobileOpen ? 'Close menu' : 'Open menu'}
            aria-expanded={mobileOpen}
          >
            {mobileOpen ? <X size={20} /> : <Menu size={20} />}
          </button>
        </div>
      </div>

      <AnimatePresence>
        {mobileOpen && (
          <motion.div
            initial={reduced ? { opacity: 1 } : { opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.22, ease: [0.4, 0, 0.2, 1] }}
            className="desktop:hidden bg-bg-secondary border-b border-border-default overflow-hidden"
          >
            <nav className="flex flex-col px-4 py-4 gap-1" aria-label="Mobile navigation">
              {links.map(l => (
                <a key={l.label} href={l.href} onClick={() => setMobileOpen(false)}
                  className="text-body font-body text-text-secondary hover:text-text-primary px-3 py-2.5 rounded-btn hover:bg-bg-surface transition-all duration-fast">
                  {l.label}
                </a>
              ))}
              <div className="flex flex-col gap-2 mt-4 pt-4 border-t border-border-default">
                <Link to="/login" onClick={() => setMobileOpen(false)}>
                  <Button variant="secondary" size="md" className="w-full">Sign In</Button>
                </Link>
                <Link to="/onboarding" onClick={() => setMobileOpen(false)}>
                  <Button variant="primary" size="md" className="w-full">Start Analysis</Button>
                </Link>
              </div>
            </nav>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  )
}

// ─── Hero Live Preview ──────────────────────────────────────────────────────

type AgentPhase = 'waiting' | 'initializing' | 'reading' | 'analyzing' | 'completed'

const AGENTS: { id: string; emoji: string; name: string; personality: string }[] = [
  { id: 'legal',       emoji: '🧠', name: 'Legal Advisor',       personality: 'Precise'        },
  { id: 'financial',   emoji: '💰', name: 'Financial Strategist', personality: 'Analytical'     },
  { id: 'growth',      emoji: '📈', name: 'Growth Advisor',       personality: 'Forward-looking' },
  { id: 'negotiation', emoji: '🤝', name: 'Negotiation Coach',    personality: 'Practical'      },
  { id: 'decision',    emoji: '⚡', name: 'Decision Engine',      personality: 'Neutral'        },
]

const STREAM_MESSAGES = [
  { text: 'Unlimited liability exceeds acceptable founder risk',  severity: 'high'   as const },
  { text: 'Auto-renewal increases long-term commitment by 2×',   severity: 'high'   as const },
  { text: 'Cash flow impact estimated at +45 days',              severity: 'medium' as const },
  { text: 'Vertical restriction limits expansion strategy',      severity: 'medium' as const },
  { text: 'Negotiation leverage identified in §4.2 and §8.1',    severity: 'low'    as const },
  { text: 'Replacement clauses ready for negotiation',           severity: 'low'    as const },
]



const POST_DECISION_UPDATES = [
  'Confidence verified across all agents',
  'Negotiation package generated',
]

const FOUNDER_CONTEXT = [
  { icon: Activity,    label: 'Stage',  value: 'Seed'     },
  { icon: Building2,   label: 'Sector', value: 'B2B SaaS' },
  { icon: DollarSign,  label: 'ARR',    value: '$250K'    },
  { icon: Users,       label: 'Team',   value: '8'        },
  { icon: Target,      label: 'Risk',   value: 'Moderate' },
]

const BUSINESS_IMPACT = [
  { label: 'Revenue Risk',          value: 'Medium',   color: 'text-amber'   },
  { label: 'Cash Flow',             value: 'High',     color: 'text-crimson' },
  { label: 'Growth Impact',         value: 'Low',      color: 'text-success' },
  { label: 'Negotiation Priority',  value: 'Critical', color: 'text-crimson' },
]

const severityBorder: Record<'high' | 'medium' | 'low', string> = {
  high:   'border-l-crimson',
  medium: 'border-l-amber',
  low:    'border-l-success',
}

const agentStatusLabel: Record<AgentPhase, string> = {
  waiting:     '',
  initializing:'Initializing…',
  reading:     'Reading clauses…',
  analyzing:   'Analyzing…',
  completed:   'Completed',
}

// Timing constants (ms) — tuned for a ~15s total loop, holds completed state longer
const T = {
  contextShow:    2100,
  contractShow:    800,
  agentSlot:      1150,
  agentRead:       380,
  agentAnalyze:    700,
  agentDone:      1050,
  streamInterval:  650,
  decisionDelay:   600,
  impactDelay:     500,
  postUpdateGap:   950,
  cycleBuffer:    4000,  // hold completed state for 4s — never disappears abruptly
}

// ─── Real-data bridge ────────────────────────────────────────────────────────
// Reads the latest analyzed contract from the agreements store.
// Falls back to demo data when no real analysis exists yet.
function useHeroData() {
  // We import useAgreements lazily so Landing page doesn't depend on the
  // authenticated data layer when rendered unauthenticated.
  let latestAnalysis: { decision: string; confidence: number; name: string } | null = null
  try {
    const raw = sessionStorage.getItem('pactra_agreements')
    if (raw) {
      const agreements = JSON.parse(raw)
      const analyzed = agreements.filter((a: { analysis?: unknown }) => a.analysis)
      if (analyzed.length > 0) {
        const latest = analyzed[analyzed.length - 1]
        latestAnalysis = {
          decision: latest.decision ?? 'NEGOTIATE',
          confidence: latest.confidence ?? 94,
          name: latest.name ?? 'Vendor Agreement',
        }
      }
    }
  } catch {
    // sessionStorage unavailable or corrupt — use demo data
  }
  return latestAnalysis
}

const HeroPreview: React.FC = () => {
  const reduced = usePrefersReducedMotion()
  const realData = useHeroData()

  // Use real data if available, else demo values
  const finalDecision = (realData?.decision ?? 'NEGOTIATE') as 'SIGN' | 'NEGOTIATE' | 'WAIT' | 'ESCALATE'
  const finalConfidence = realData?.confidence ?? 94
  const contractName = realData?.name ?? 'Acme Vendor Agreement'

  type Step = 'context' | 'contract' | 'analyzing' | 'decision' | 'impact'
  const [step, setStep]           = useState<Step>('context')
  const [agentPhases, setAgents]  = useState<Record<string, AgentPhase>>(
    Object.fromEntries(AGENTS.map(a => [a.id, 'waiting']))
  )
  const [stream, setStream]       = useState<typeof STREAM_MESSAGES>([])
  const [confidence, setConf]     = useState(0)
  const [showDecision, setShowDec]= useState(false)
  const [showImpact, setShowImp]  = useState(false)
  // No fadingOut state — completed state never fades out abruptly.
  // Loop resets with a clean state swap instead.

  const resetAll = useCallback(() => {
    setStep('context')
    setAgents(Object.fromEntries(AGENTS.map(a => [a.id, 'waiting'])))
    setStream([])
    setConf(0)
    setShowDec(false)
    setShowImp(false)
  }, [])

  const runSequence = useCallback(() => {
    resetAll()

    if (reduced) {
      setStep('impact')
      setAgents(Object.fromEntries(AGENTS.map(a => [a.id, 'completed'])))
      setStream(STREAM_MESSAGES)
      setConf(finalConfidence)
      setShowDec(true)
      setShowImp(true)
      return
    }

    const timers: ReturnType<typeof setTimeout>[] = []
    const add = (fn: () => void, delay: number) => timers.push(setTimeout(fn, delay))

    // Phase 1 — show context
    add(() => setStep('contract'), T.contextShow)

    // Phase 2 — show contract loaded, then begin agents
    const agentStart = T.contextShow + T.contractShow
    add(() => setStep('analyzing'), agentStart)

    // Confidence animates smoothly: interpolate 0 → finalConfidence across agent steps
    const confStep = (i: number) => Math.round((i / AGENTS.length) * finalConfidence)

    AGENTS.forEach((agent, i) => {
      const base = agentStart + i * T.agentSlot
      add(() => {
        setAgents(prev => ({ ...prev, [agent.id]: 'initializing' }))
        setConf(confStep(i))
      }, base)
      add(() => setAgents(prev => ({ ...prev, [agent.id]: 'reading' })),    base + T.agentRead)
      add(() => setAgents(prev => ({ ...prev, [agent.id]: 'analyzing' })),  base + T.agentAnalyze)
      add(() => {
        setAgents(prev => ({ ...prev, [agent.id]: 'completed' }))
        setConf(confStep(i + 1))
      }, base + T.agentDone)
    })

    // Phase 3 — stream messages interleaved with agents
    STREAM_MESSAGES.forEach((msg, i) => {
      add(() => setStream(prev => [...prev, msg]),
        agentStart + T.agentSlot * 0.6 + i * T.streamInterval)
    })

    // Phase 4 — decision reveal
    const decisionAt = agentStart + AGENTS.length * T.agentSlot + T.decisionDelay
    add(() => { setConf(finalConfidence); setShowDec(true); setStep('decision') }, decisionAt)

    // Phase 5 — business impact
    const impactAt = decisionAt + T.impactDelay
    add(() => { setShowImp(true); setStep('impact') }, impactAt)

    // Phase 6 — ambient post-decision updates
    POST_DECISION_UPDATES.forEach((text, i) => {
      add(() => setStream(prev => [...prev, { text, severity: 'low' as const }]),
        impactAt + 500 + i * T.postUpdateGap)
    })

    // No fade-out timer — completed state holds for cycleBuffer ms,
    // then loop fires and resetAll() clears state cleanly before re-animating.
    return () => timers.forEach(clearTimeout)
  }, [reduced, resetAll, finalConfidence])

  useEffect(() => {
    const TOTAL =
      T.contextShow + T.contractShow +
      AGENTS.length * T.agentSlot +
      T.decisionDelay + T.impactDelay + 500 +
      POST_DECISION_UPDATES.length * T.postUpdateGap +
      T.cycleBuffer

    const cleanup = runSequence()
    const loop = setInterval(runSequence, TOTAL)
    return () => {
      cleanup?.()
      clearInterval(loop)
    }
  }, [runSequence])

  const RING_R = 34
  const circ = 2 * Math.PI * RING_R
  const ringColor = showDecision ? (finalDecision === 'SIGN' ? '#22C55E' : finalDecision === 'WAIT' ? '#6366F1' : finalDecision === 'ESCALATE' ? '#EF4444' : '#F59E0B') : '#6366F1'
  const dashOffset = circ - (confidence / 100) * circ

  return (
    <div
      className="relative w-full max-w-[520px] mx-auto desktop:mx-0"
      role="img"
      aria-label="Live Pactra analysis demo"
    >
      {/* Ambient glow */}
      <div className="absolute -inset-6 bg-brand/6 rounded-[36px] blur-3xl pointer-events-none" aria-hidden="true" />

      {/* Very slow ambient particle drift */}
      {!reduced && (
        <div className="absolute inset-0 pointer-events-none overflow-hidden rounded-card" aria-hidden="true">
          {[
            { size: 3, top: '15%', left: '10%', dur: 14 },
            { size: 2, top: '70%', left: '85%', dur: 18 },
            { size: 2.5, top: '40%', left: '92%', dur: 16 },
          ].map((p, i) => (
            <motion.div
              key={i}
              className="absolute rounded-full bg-brand/20"
              style={{ width: p.size, height: p.size, top: p.top, left: p.left }}
              animate={{ y: [0, -14, 0], opacity: [0.2, 0.5, 0.2] }}
              transition={{ duration: p.dur, repeat: Infinity, ease: 'easeInOut' }}
            />
          ))}
        </div>
      )}

      <div className="relative rounded-card border border-border-default bg-bg-secondary shadow-elv-4 overflow-hidden">

        {/* ── Top bar ── */}
        <div className="px-5 py-3 border-b border-border-default bg-bg-surface/70 flex items-center justify-between gap-3">
          <div className="flex items-center gap-2 min-w-0">
            <FileText size={13} className="text-text-muted shrink-0" aria-hidden="true" />
            <span className="font-body text-small font-medium text-text-primary truncate">
              {contractName}
            </span>
            <span className="hidden tablet:flex items-center">
              <span className="text-text-disabled mx-1.5 text-caption">·</span>
              <span className="text-caption font-mono text-text-muted">Series A · SaaS</span>
            </span>
          </div>
          <div className="flex items-center gap-2.5 shrink-0">
            {/* Confidence ring — gentle breathing while active */}
            <motion.div
              className="relative w-10 h-10"
              aria-label={`Confidence ${confidence}%`}
              animate={!reduced && step === 'analyzing' ? { scale: [1, 1.04, 1] } : { scale: 1 }}
              transition={{ duration: 2.2, repeat: step === 'analyzing' ? Infinity : 0, ease: 'easeInOut' }}
            >
              <svg className="w-10 h-10 -rotate-90" viewBox="0 0 76 76" aria-hidden="true">
                <circle cx="38" cy="38" r={RING_R} fill="none" stroke="#243047" strokeWidth="7" />
                <motion.circle
                  cx="38" cy="38" r={RING_R} fill="none"
                  stroke={ringColor} strokeWidth="7" strokeLinecap="round"
                  strokeDasharray={circ}
                  animate={{ strokeDashoffset: dashOffset, stroke: ringColor }}
                  transition={{ duration: reduced ? 0 : 0.8, ease: 'easeOut' }}
                />
              </svg>
              <div className="absolute inset-0 flex items-center justify-center">
                <motion.span
                  key={confidence}
                  initial={reduced ? {} : { opacity: 0, scale: 0.75 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ duration: 0.25 }}
                  className="font-mono text-[10px] font-bold text-text-primary leading-none"
                >
                  {confidence}%
                </motion.span>
              </div>
            </motion.div>

            <AnimatePresence mode="wait">
              {showDecision ? (
                <motion.div key="dec"
                  initial={reduced ? {} : { opacity: 0, scale: 0.85, y: 4 }}
                  animate={{ opacity: 1, scale: 1, y: 0 }}
                  transition={{ duration: 0.35, type: 'spring', stiffness: 260, damping: 22 }}>
                  <Badge type="decision" value="NEGOTIATE" size="sm" />
                </motion.div>
              ) : (
                <motion.div key="s" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
                  <Badge type="generic"
                    color={step === 'analyzing' ? 'amber' : step === 'context' ? 'indigo' : 'muted'}
                    size="sm">
                    {step === 'context'   ? 'Context Set'
                      : step === 'contract' ? 'Contract Loaded'
                      : step === 'analyzing'? 'Analyzing…'
                      : 'Decision Ready'}
                  </Badge>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>

        {/* ── Founder Context Panel ── */}
        <AnimatePresence>
          {(step === 'context' || step === 'contract') && (
            <motion.div
              key="ctx"
              initial={reduced ? { opacity: 1 } : { opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={reduced ? { opacity: 0 } : { opacity: 0, height: 0 }}
              transition={{ duration: 0.38, ease: [0.4, 0, 0.2, 1] }}
              className="overflow-hidden border-b border-border-default"
            >
              <div className="px-5 py-4 bg-brand/5">
                <div className="flex items-center gap-2 mb-3">
                  <motion.div
                    animate={reduced ? {} : { opacity: [1, 0.3, 1] }}
                    transition={{ duration: 1.4, repeat: Infinity }}
                    className="w-1.5 h-1.5 rounded-full bg-brand"
                    aria-hidden="true"
                  />
                  <p className="text-[10px] font-body text-brand font-semibold uppercase tracking-widest">
                    Founder Context Confirmed
                  </p>
                </div>
                <div className="grid grid-cols-5 gap-1.5">
                  {FOUNDER_CONTEXT.map(({ icon: Icon, label, value }, i) => (
                    <motion.div
                      key={label}
                      initial={reduced ? {} : { opacity: 0, y: 6 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: i * 0.07, duration: 0.3 }}
                      className="flex flex-col items-center gap-1 rounded-input bg-bg-surface border border-border-default p-2 text-center"
                    >
                      <Icon size={11} className="text-brand" aria-hidden="true" />
                      <p className="text-[9px] font-body text-text-muted uppercase tracking-wide leading-none">{label}</p>
                      <p className="text-[10px] font-body font-semibold text-text-primary leading-tight">{value}</p>
                    </motion.div>
                  ))}
                </div>
                <motion.p
                  initial={reduced ? {} : { opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.4 }}
                  className="text-[10px] font-mono text-text-muted mt-2.5 text-center tracking-wide"
                >
                  Business Context + Contract Intelligence = Decision Intelligence
                </motion.p>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* ── Contract loaded indicator ── */}
        <AnimatePresence>
          {step === 'contract' && (
            <motion.div
              key="contract-loaded"
              initial={reduced ? {} : { opacity: 0, y: -4 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.25 }}
              className="px-5 py-2.5 border-b border-border-default bg-bg-surface/40 flex items-center gap-2"
            >
              <Check size={11} className="text-success shrink-0" aria-hidden="true" />
              <p className="text-[11px] font-body text-text-secondary">
                Contract parsed · <span className="font-mono text-text-muted">2,847 words · 14 clauses identified</span>
              </p>
            </motion.div>
          )}
        </AnimatePresence>

        {/* ── Agents + Stream ── */}
        <AnimatePresence>
          {(step === 'analyzing' || step === 'decision' || step === 'impact') && (
            <motion.div
              key="main"
              initial={reduced ? { opacity: 1 } : { opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.3 }}
              className="grid grid-cols-2 divide-x divide-border-default"
            >
              {/* Left: Agents */}
              <div className="p-4 flex flex-col gap-1.5">
                <p className="text-[10px] font-body text-text-muted font-semibold mb-1.5 uppercase tracking-widest">
                  AI Agents
                </p>
                {AGENTS.map(agent => {
                  const ph = agentPhases[agent.id]
                  const isActive = ph === 'initializing' || ph === 'reading' || ph === 'analyzing'
                  return (
                    <motion.div
                      key={agent.id}
                      animate={{ opacity: ph === 'waiting' ? 0.3 : 1 }}
                      transition={{ duration: 0.3 }}
                      className={cn(
                        'flex items-center gap-2 rounded-input px-2.5 py-1.5 border transition-colors duration-normal',
                        isActive       && 'border-brand/50 bg-brand/8',
                        ph === 'completed' && 'border-border-default bg-bg-surface',
                        ph === 'waiting'   && 'border-border-default',
                      )}
                    >
                      <span className="text-[13px] shrink-0">{agent.emoji}</span>
                      <div className="flex-1 min-w-0">
                        <p className="text-[10px] font-body text-text-secondary truncate">{agent.name}</p>
                        {ph !== 'waiting' && ph !== 'completed' && (
                          <motion.p
                            key={ph}
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            className="text-[9px] font-mono text-brand leading-tight"
                          >
                            {agentStatusLabel[ph]}
                          </motion.p>
                        )}
                      </div>
                      {ph === 'completed' && (
                        <motion.div
                          initial={reduced ? {} : { scale: 0 }}
                          animate={{ scale: 1 }}
                          transition={{ type: 'spring', stiffness: 300, damping: 18 }}
                        >
                          <Check size={11} className="text-success shrink-0" aria-hidden="true" />
                        </motion.div>
                      )}
                      {isActive && (
                        <motion.div
                          animate={reduced ? {} : { opacity: [1, 0.2, 1] }}
                          transition={{ duration: 1.1, repeat: Infinity }}
                          className="w-1.5 h-1.5 rounded-full bg-brand shrink-0"
                          aria-hidden="true"
                        />
                      )}
                    </motion.div>
                  )
                })}
              </div>

              {/* Right: Decision Stream */}
              <div className="p-4 flex flex-col">
                <p className="text-[10px] font-body text-text-muted font-semibold mb-1.5 uppercase tracking-widest">
                  Decision Stream
                </p>
                <div className="flex flex-col gap-1.5 flex-1 min-h-0 overflow-hidden">
                  {stream.length === 0 && (
                    <motion.p
                      animate={reduced ? {} : { opacity: [0.4, 1, 0.4] }}
                      transition={{ duration: 1.6, repeat: Infinity }}
                      className="text-[10px] font-mono text-brand"
                    >
                      Processing contract…
                    </motion.p>
                  )}
                  <AnimatePresence>
                    {stream.map((entry, i) => (
                      <motion.div
                        key={i}
                        initial={reduced ? { opacity: 1 } : { opacity: 0, x: -8, y: 2 }}
                        animate={{ opacity: 1, x: 0, y: 0 }}
                        transition={{ duration: 0.22, ease: 'easeOut' }}
                        className={cn('border-l-2 pl-2 py-0.5', severityBorder[entry.severity])}
                      >
                        <div className="flex items-start gap-1">
                          <Check size={9} className="text-success mt-0.5 shrink-0" aria-hidden="true" />
                          <p className="text-[10px] font-body text-text-secondary leading-tight">
                            {entry.text}
                          </p>
                        </div>
                      </motion.div>
                    ))}
                  </AnimatePresence>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* ── Decision Reveal ── */}
        <AnimatePresence>
          {showDecision && (
            <motion.div
              key="decision-card"
              initial={reduced ? { opacity: 1 } : { opacity: 0, scale: 0.97, y: 4 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              transition={{ duration: 0.45, ease: [0, 0, 0.2, 1] }}
              className={`border-t px-5 py-4 ${
                finalDecision === 'SIGN' ? 'border-success/20 bg-success/5'
                : finalDecision === 'ESCALATE' ? 'border-crimson/20 bg-crimson/5'
                : finalDecision === 'WAIT' ? 'border-brand/20 bg-brand/5'
                : 'border-amber/20 bg-amber/5'
              }`}
            >
              <div className="flex items-start justify-between mb-3">
                <div>
                  <p className="text-[10px] text-text-muted font-body font-semibold uppercase tracking-widest mb-1">
                    Decision Engine
                  </p>
                  <div className="flex items-center gap-2">
                    <motion.span
                      initial={reduced ? {} : { opacity: 0, y: 4 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.12, duration: 0.35 }}
                      className={`font-heading font-bold text-h3 ${
                        finalDecision === 'SIGN' ? 'text-success'
                        : finalDecision === 'ESCALATE' ? 'text-crimson'
                        : finalDecision === 'WAIT' ? 'text-brand'
                        : 'text-amber'
                      }`}
                    >
                      {finalDecision}
                    </motion.span>
                    <motion.div
                      initial={reduced ? {} : { opacity: 0 }}
                      animate={{ opacity: 1 }}
                      transition={{ delay: 0.22 }}
                    >
                      <Badge type="decision" value={finalDecision} size="sm" />
                    </motion.div>
                  </div>
                </div>
                <motion.div
                  initial={reduced ? {} : { opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.18 }}
                  className="text-right"
                >
                  <p className="text-[10px] text-text-muted font-body">Confidence</p>
                  <p className="font-heading font-bold text-h4 text-text-primary">{finalConfidence}%</p>
                </motion.div>
              </div>

              <div className="flex flex-col gap-1.5">
                {[
                  'Request liability cap at 1× contract value',
                  'Negotiate 30-day auto-renewal notice period',
                  'Remove vertical expansion restriction in §7',
                ].map((action, i) => (
                  <motion.div
                    key={i}
                    initial={reduced ? {} : { opacity: 0, x: -4 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.28 + i * 0.1, duration: 0.25 }}
                    className="flex items-start gap-2"
                  >
                    <span className="text-[10px] font-mono text-brand shrink-0 mt-0.5 font-bold">{i + 1}.</span>
                    <p className="text-[11px] font-body text-text-secondary leading-snug">{action}</p>
                  </motion.div>
                ))}
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* ── Business Impact Panel ── */}
        <AnimatePresence>
          {showImpact && (
            <motion.div
              key="impact"
              initial={reduced ? { opacity: 1 } : { opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              transition={{ duration: 0.38, ease: [0, 0, 0.2, 1] }}
              className="overflow-hidden border-t border-border-default"
            >
              <div className="px-5 py-3 bg-bg-surface/50">
                <p className="text-[10px] font-body text-text-muted font-semibold uppercase tracking-widest mb-2">
                  Business Impact
                </p>
                <div className="grid grid-cols-4 gap-1.5">
                  {BUSINESS_IMPACT.map(({ label, value, color }, i) => (
                    <motion.div
                      key={label}
                      initial={reduced ? {} : { opacity: 0, y: 4 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: i * 0.07, duration: 0.25 }}
                      className="rounded-input border border-border-default bg-bg-surface p-2 text-center"
                    >
                      <p className="text-[9px] font-body text-text-muted leading-none mb-1">{label}</p>
                      <p className={cn('text-[10px] font-body font-bold leading-none', color)}>{value}</p>
                    </motion.div>
                  ))}
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  )
}

// ─── Hero Section ──────────────────────────────────────────────────────────

const HeroSection: React.FC = () => {
  const reduced = usePrefersReducedMotion()
  const navigate = useNavigate()

  return (
    <section className="relative min-h-screen flex items-center pt-20 pb-16 overflow-hidden" aria-label="Hero">
      {/* Subtle dot grid */}
      <div className="absolute inset-0 pointer-events-none"
        style={{
          backgroundImage: 'radial-gradient(circle at 1px 1px, rgba(36,48,71,0.9) 1px, transparent 0)',
          backgroundSize: '44px 44px',
          opacity: 0.55,
        }}
        aria-hidden="true"
      />
      {/* Top radial glow */}
      <div className="absolute inset-0 pointer-events-none"
        style={{ background: 'radial-gradient(ellipse 65% 50% at 50% -5%, rgba(99,102,241,0.11) 0%, transparent 65%)' }}
        aria-hidden="true"
      />
      {/* Right side glow behind preview */}
      <div className="absolute top-0 right-0 bottom-0 w-1/2 pointer-events-none"
        style={{ background: 'radial-gradient(ellipse at 70% 50%, rgba(99,102,241,0.05) 0%, transparent 60%)' }}
        aria-hidden="true"
      />

      <div className="relative max-w-content mx-auto px-4 tablet:px-10 desktop:px-20 w-full">
        <div className="grid desktop:grid-cols-2 gap-12 desktop:gap-20 items-center">

          {/* Left copy */}
          <div className="flex flex-col gap-7">
            <motion.div
              initial={reduced ? {} : { opacity: 0, y: 18 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.55, delay: 0.05 }}
            >
              <motion.div
                initial={reduced ? {} : { opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.4, delay: 0.02 }}
                className="inline-flex items-center gap-2 mb-5 px-3 py-1.5 rounded-badge border border-brand/25 bg-brand/8"
              >
                <motion.div
                  animate={reduced ? {} : { opacity: [1, 0.3, 1] }}
                  transition={{ duration: 1.8, repeat: Infinity }}
                  className="w-1.5 h-1.5 rounded-full bg-brand"
                  aria-hidden="true"
                />
                <span className="text-caption font-body text-brand font-medium">
                  Founder Decision Intelligence Platform
                </span>
              </motion.div>

              <h1 className="font-heading font-bold text-display text-text-primary leading-[1.02] tracking-tight">
                PACTRA
              </h1>
              <p className="font-heading font-semibold text-h2 text-text-secondary mt-3 leading-tight">
                Know every decision<br className="hidden tablet:block" /> before you sign.
              </p>
            </motion.div>

            <motion.p
              initial={reduced ? {} : { opacity: 0, y: 14 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.55, delay: 0.18 }}
              className="font-body text-body-lg text-text-muted max-w-md leading-relaxed"
            >
              Every agreement you sign carries business consequences.
              Pactra combines your startup context with AI contract analysis
              to tell you exactly what to do next — before you put pen to paper.
            </motion.p>

            <motion.div
              initial={reduced ? {} : { opacity: 0, y: 14 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.55, delay: 0.28 }}
              className="flex flex-wrap gap-3"
            >
              <Link to="/onboarding">
                <Button variant="primary" size="lg" icon={<ArrowRight size={16} />} iconPosition="right">
                  Start Analysis
                </Button>
              </Link>
              <Button variant="secondary" size="lg" onClick={() => navigate('/workspace')}>Watch Demo</Button>
            </motion.div>

            <motion.div
              initial={reduced ? {} : { opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.5, delay: 0.42 }}
              className="flex flex-wrap gap-5 pt-1"
            >
              {[
                'Founder Decision Intelligence',
                'Multi-Agent AI Analysis',
                'Explainable Recommendations',
              ].map((label, i) => (
                <motion.div
                  key={label}
                  initial={reduced ? {} : { opacity: 0, x: -4 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.44 + i * 0.07, duration: 0.3 }}
                  className="flex items-center gap-2"
                >
                  <CheckCircle size={13} className="text-success shrink-0" aria-hidden="true" />
                  <span className="text-small font-body text-text-muted">{label}</span>
                </motion.div>
              ))}
            </motion.div>
          </div>

          {/* Right: live preview */}
          <motion.div
            initial={reduced ? {} : { opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, delay: 0.2, ease: [0, 0, 0.2, 1] }}
          >
            <HeroPreview />
          </motion.div>
        </div>
      </div>
    </section>
  )
}

// ─── Problem Section ───────────────────────────────────────────────────────

const ProblemSection: React.FC = () => (
  <section id="features" className="py-24 border-t border-border-default" aria-labelledby="problem-heading">
    <div className="max-w-content mx-auto px-4 tablet:px-10 desktop:px-20">
      <FadeUp className="text-center max-w-2xl mx-auto mb-16">
        <p className="text-small font-body text-brand font-medium uppercase tracking-widest mb-3">The Problem</p>
        <h2 id="problem-heading" className="font-heading font-bold text-h1 text-text-primary mb-4">
          Founders don't need more legal summaries.
        </h2>
        <p className="font-body text-body-lg text-text-muted">
          A single poorly negotiated clause can expose a startup to financial liabilities that far outweigh the cost of the agreement itself.
        </p>
      </FadeUp>

      <div className="grid tablet:grid-cols-2 gap-5 max-w-3xl mx-auto">
        {/* Traditional */}
        <FadeUp delay={0.08}>
          <div className="rounded-card border border-border-default bg-bg-secondary p-7 h-full">
            <div className="flex items-center gap-2.5 mb-6">
              <div className="w-6 h-6 rounded border border-crimson/20 bg-crimson/5 flex items-center justify-center">
                <AlertCircle size={12} className="text-crimson" aria-hidden="true" />
              </div>
              <span className="text-small font-body font-semibold text-text-muted uppercase tracking-wider">
                Traditional AI
              </span>
            </div>
            <div className="flex flex-col gap-2.5">
              {['Upload contract', 'Receive clause summary', 'Read legal jargon'].map((step, i, arr) => (
                <div key={step}>
                  <div className="flex items-center gap-3 rounded-input px-4 py-3 border border-border-default bg-bg-surface">
                    <span className="text-small font-body text-text-secondary">{step}</span>
                  </div>
                  {i < arr.length - 1 && (
                    <div className="flex justify-center my-2">
                      <ChevronRight size={12} className="text-text-disabled rotate-90" aria-hidden="true" />
                    </div>
                  )}
                </div>
              ))}
              <div className="mt-2 rounded-input px-4 py-3.5 border border-crimson/25 bg-crimson/5">
                <p className="text-small font-body text-crimson font-semibold">Founder still unsure.</p>
                <p className="text-caption font-body text-text-muted mt-1">"Should I actually sign this?"</p>
              </div>
            </div>
          </div>
        </FadeUp>

        {/* Pactra */}
        <FadeUp delay={0.16}>
          <div className="rounded-card border border-brand/25 bg-brand/5 p-7 h-full">
            <div className="flex items-center gap-2.5 mb-6">
              <div className="w-6 h-6 rounded bg-brand/20 border border-brand/30 flex items-center justify-center">
                <Zap size={12} className="text-brand" aria-hidden="true" />
              </div>
              <span className="text-small font-body font-semibold text-brand uppercase tracking-wider">
                Pactra
              </span>
            </div>
            <div className="flex flex-col gap-2.5">
              {[
                { label: 'Founder Business Context', sub: '' },
                { label: 'Contract Intelligence',    sub: '' },
              ].map((step, i) => (
                <div key={step.label}>
                  <div className="flex items-center gap-3 rounded-input px-4 py-3 border border-brand/20 bg-bg-surface">
                    <span className="text-small font-body text-text-secondary">{step.label}</span>
                  </div>
                  {i === 0 && (
                    <div className="flex justify-center my-2 items-center gap-2">
                      <div className="h-px flex-1 bg-border-default" />
                      <span className="text-caption font-mono text-text-muted px-1">+</span>
                      <div className="h-px flex-1 bg-border-default" />
                    </div>
                  )}
                  {i === 1 && (
                    <div className="flex justify-center my-2">
                      <ChevronRight size={12} className="text-brand rotate-90" aria-hidden="true" />
                    </div>
                  )}
                </div>
              ))}
              <div className="rounded-input px-4 py-3.5 border border-success/25 bg-success/5">
                <div className="flex items-center gap-2">
                  <Check size={12} className="text-success shrink-0" aria-hidden="true" />
                  <p className="text-small font-body text-success font-semibold">Decision Intelligence</p>
                </div>
                <p className="text-caption font-body text-text-muted mt-1">Know exactly what to do next.</p>
              </div>
            </div>
          </div>
        </FadeUp>
      </div>
    </div>
  </section>
)

// ─── How It Works ──────────────────────────────────────────────────────────

const HowItWorksSection: React.FC = () => {
  const agents = [
    { emoji: '🧠', name: 'Legal Advisor',       personality: 'Precise',         desc: 'Clause-level identification of risk, obligation, and liability.' },
    { emoji: '💰', name: 'Financial Strategist', personality: 'Analytical',      desc: 'Quantifies financial exposure, payment risk, and penalty structures.' },
    { emoji: '📈', name: 'Growth Advisor',       personality: 'Forward-looking',  desc: 'Evaluates strategic alignment, scaling restrictions, and opportunity cost.' },
    { emoji: '🤝', name: 'Negotiation Coach',    personality: 'Practical',        desc: 'Generates ranked negotiation priorities and replacement clause language.' },
    { emoji: '⚡', name: 'Decision Engine',      personality: 'Neutral',          desc: 'Synthesizes all inputs into one explainable business recommendation.' },
  ]

  return (
    <section id="how-it-works" className="py-24 border-t border-border-default" aria-labelledby="how-heading">
      <div className="max-w-content mx-auto px-4 tablet:px-10 desktop:px-20">
        <FadeUp className="text-center max-w-2xl mx-auto mb-16">
          <p className="text-small font-body text-brand font-medium uppercase tracking-widest mb-3">How It Works</p>
          <h2 id="how-heading" className="font-heading font-bold text-h1 text-text-primary mb-4">
            Five specialists. One clear decision.
          </h2>
          <p className="font-body text-body text-text-muted">
            Each agent brings a distinct perspective. Together they produce a recommendation built around your startup — not a generic summary.
          </p>
        </FadeUp>

        <div className="grid tablet:grid-cols-5 gap-3 mb-10">
          {agents.map((agent, i) => (
            <FadeUp key={agent.name} delay={i * 0.07}>
              <div className={cn(
                'group rounded-card border bg-bg-secondary p-5 h-full cursor-default',
                'transition-all duration-normal',
                'hover:-translate-y-1.5 hover:shadow-elv-3',
                agent.name === 'Decision Engine'
                  ? 'border-brand/30 bg-brand/5 hover:border-brand/50'
                  : 'border-border-default hover:border-border-hover hover:bg-bg-card-hover',
              )}>
                <motion.div
                  whileHover={{ scale: 1.12, rotate: 6 }}
                  transition={{ type: 'spring', stiffness: 280, damping: 16 }}
                  className="text-2xl mb-3.5 inline-block"
                >
                  {agent.emoji}
                </motion.div>
                <p className="font-heading font-semibold text-small text-text-primary mb-1 group-hover:text-white transition-colors duration-fast leading-tight">
                  {agent.name}
                </p>
                <p className="text-caption font-body text-brand mb-3">{agent.personality}</p>
                <p className="text-caption font-body text-text-muted leading-relaxed">{agent.desc}</p>
              </div>
            </FadeUp>
          ))}
        </div>

        <FadeUp delay={0.38}>
          <div className="max-w-md mx-auto">
            <div className="rounded-card border border-amber/20 bg-amber/5 p-5 text-center">
              <p className="text-caption font-body text-text-muted mb-3 uppercase tracking-wider font-semibold">
                Every analysis ends with
              </p>
              <div className="flex items-center justify-center gap-3 flex-wrap">
                {(['SIGN', 'NEGOTIATE', 'WAIT', 'ESCALATE'] as const).map(d => (
                  <Badge key={d} type="decision" value={d} size="md" />
                ))}
              </div>
              <p className="text-small font-body text-text-muted mt-3">
                Clear. Explainable. Actionable.
              </p>
            </div>
          </div>
        </FadeUp>
      </div>
    </section>
  )
}

// ─── Why Pactra ────────────────────────────────────────────────────────────

const WhyPactraSection: React.FC = () => {
  const features = [
    {
      icon: Brain,
      title: 'Business Context',
      description: 'Every recommendation adapts to the startup behind the agreement. Your stage, risk appetite, and growth goals shape every insight.',
      color: 'text-brand', bg: 'bg-brand/10', hoverBorder: 'hover:border-brand/30',
    },
    {
      icon: Sparkles,
      title: 'Decision Intelligence',
      description: 'Every analysis ends with an action, not a summary. Pactra ends with "here\'s what you should do next" — always.',
      color: 'text-success', bg: 'bg-success/10', hoverBorder: 'hover:border-success/30',
    },
    {
      icon: Handshake,
      title: 'Negotiation Ready',
      description: 'Generate negotiation priorities, clause rewrites, and a complete negotiation email immediately after every analysis.',
      color: 'text-amber', bg: 'bg-amber/10', hoverBorder: 'hover:border-amber/30',
    },
  ]

  return (
    <section className="py-24 border-t border-border-default" aria-labelledby="why-heading">
      <div className="max-w-content mx-auto px-4 tablet:px-10 desktop:px-20">
        <FadeUp className="text-center max-w-2xl mx-auto mb-16">
          <p className="text-small font-body text-brand font-medium uppercase tracking-widest mb-3">Why Pactra</p>
          <h2 id="why-heading" className="font-heading font-bold text-h1 text-text-primary mb-4">
            Built for the decisions that define companies.
          </h2>
          <p className="font-body text-body text-text-muted">
            Pactra transforms contracts from static documents into interactive business decisions.
          </p>
        </FadeUp>

        <div className="grid tablet:grid-cols-3 gap-5">
          {features.map((f, i) => {
            const Icon = f.icon
            return (
              <FadeUp key={f.title} delay={i * 0.1}>
                <div className={cn(
                  'group rounded-card border border-border-default bg-bg-secondary p-7 h-full',
                  'transition-all duration-normal hover:-translate-y-1 hover:shadow-elv-3',
                  f.hoverBorder,
                )}>
                  <div className={cn(
                    'w-10 h-10 rounded-btn flex items-center justify-center mb-6',
                    'transition-transform duration-normal group-hover:scale-110',
                    f.bg,
                  )}>
                    <Icon size={20} className={f.color} aria-hidden="true" />
                  </div>
                  <h3 className="font-heading font-semibold text-h4 text-text-primary mb-3">{f.title}</h3>
                  <p className="font-body text-body text-text-muted leading-relaxed">{f.description}</p>
                </div>
              </FadeUp>
            )
          })}
        </div>
      </div>
    </section>
  )
}

// ─── Principles ────────────────────────────────────────────────────────────

const PrinciplesSection: React.FC = () => {
  const principles = [
    { icon: Shield,      title: 'Business Decisions Over Legal Jargon',  desc: 'We explain business impact and consequence — not law.' },
    { icon: Brain,       title: 'Explain Before Recommending',            desc: 'Founders always understand why before being told what to do.' },
    { icon: TrendingUp,  title: 'Every Analysis Ends With an Action',     desc: 'Analysis concludes with a next step — never just a report.' },
    { icon: Sparkles,    title: 'Context Changes Everything',             desc: 'The same clause means different things for different startups.' },
    { icon: CheckCircle, title: 'AI Assists. Founders Decide.',           desc: 'Pactra provides decision support. Founders remain in control.' },
  ]

  return (
    <section id="about" className="py-24 border-t border-border-default" aria-labelledby="principles-heading">
      <div className="max-w-content mx-auto px-4 tablet:px-10 desktop:px-20">
        <FadeUp className="text-center max-w-2xl mx-auto mb-16">
          <p className="text-small font-body text-brand font-medium uppercase tracking-widest mb-3">Product Principles</p>
          <h2 id="principles-heading" className="font-heading font-bold text-h1 text-text-primary">
            Five principles behind every decision.
          </h2>
        </FadeUp>

        <div className="grid tablet:grid-cols-2 desktop:grid-cols-3 gap-4 max-w-4xl mx-auto">
          {principles.map((p, i) => {
            const Icon = p.icon
            return (
              <FadeUp key={p.title} delay={i * 0.07}>
                <div className="flex items-start gap-4 rounded-card border border-border-default bg-bg-secondary p-5 h-full hover:border-border-hover hover:bg-bg-card-hover transition-all duration-normal">
                  <div className="w-8 h-8 rounded-btn bg-brand/10 flex items-center justify-center shrink-0 mt-0.5">
                    <Icon size={15} className="text-brand" aria-hidden="true" />
                  </div>
                  <div>
                    <h3 className="font-heading font-semibold text-small text-text-primary mb-1.5 leading-snug">{p.title}</h3>
                    <p className="text-caption font-body text-text-muted leading-relaxed">{p.desc}</p>
                  </div>
                </div>
              </FadeUp>
            )
          })}
        </div>
      </div>
    </section>
  )
}

// ─── CTA ───────────────────────────────────────────────────────────────────

const CtaSection: React.FC = () => (
  <section className="py-24 border-t border-border-default" aria-labelledby="cta-heading">
    <div className="max-w-content mx-auto px-4 tablet:px-10 desktop:px-20">
      <FadeUp>
        <div className="relative rounded-card border border-brand/20 bg-brand/5 px-8 py-16 tablet:px-16 text-center overflow-hidden">
          <div className="absolute inset-0 pointer-events-none"
            style={{ background: 'radial-gradient(ellipse 70% 90% at 50% 110%, rgba(99,102,241,0.10) 0%, transparent 65%)' }}
            aria-hidden="true"
          />
          <div className="relative">
            <p className="text-small font-body text-brand font-medium uppercase tracking-widest mb-5">Ready?</p>
            <h2 id="cta-heading" className="font-heading font-bold text-h1 text-text-primary mb-4 max-w-2xl mx-auto">
              The next agreement you sign could define your company.
            </h2>
            <p className="font-body text-body-lg text-text-muted max-w-lg mx-auto mb-8 leading-relaxed">
              Upload your first agreement and experience Founder Decision Intelligence —
              built for founders who move fast and sign smart.
            </p>
            <div className="flex flex-wrap items-center justify-center gap-4">
              <Link to="/onboarding">
                <Button variant="primary" size="lg" icon={<ArrowRight size={16} />} iconPosition="right">
                  Start Analysis
                </Button>
              </Link>
              <Link to="/workspace">
                <Button variant="secondary" size="lg">View Architecture</Button>
              </Link>
            </div>
          </div>
        </div>
      </FadeUp>
    </div>
  </section>
)

// ─── Footer ────────────────────────────────────────────────────────────────

const LandingFooter: React.FC = () => (
  <footer className="border-t border-border-default py-12" aria-label="Footer">
    <div className="max-w-content mx-auto px-4 tablet:px-10 desktop:px-20">
      <div className="flex flex-col tablet:flex-row items-start justify-between gap-8">
        <div className="flex flex-col gap-3">
          <div className="flex items-center gap-3">
            <div className="w-7 h-7 rounded-btn bg-brand flex items-center justify-center shrink-0">
              <Zap size={14} className="text-white" aria-hidden="true" />
            </div>
            <span className="font-heading font-bold text-body text-text-primary">Pactra</span>
          </div>
          <p className="text-small font-body text-text-muted max-w-xs leading-relaxed">
            Know every decision before you sign.
          </p>
          <p className="text-caption font-mono text-text-disabled">
            Business Context + Contract Intelligence = Decision Intelligence
          </p>
        </div>

        <div className="flex flex-wrap gap-10">
          <div className="flex flex-col gap-3">
            <p className="text-caption font-body font-semibold text-text-muted uppercase tracking-wider">Product</p>
            {[
              { label: 'Features', href: '#features' },
              { label: 'How it Works', href: '#how-it-works' },
              { label: 'Architecture', href: '#about' },
            ].map(({ label, href }) => (
              <a key={label} href={href}
                className="text-small font-body text-text-disabled hover:text-text-primary transition-colors duration-fast focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand rounded">
                {label}
              </a>
            ))}
          </div>
          <div className="flex flex-col gap-3">
            <p className="text-caption font-body font-semibold text-text-muted uppercase tracking-wider">Links</p>
            {[
              { label: 'GitHub', href: '#' },
              { label: 'Privacy', href: '#about' },
              { label: 'Contact', href: 'mailto:hello@pactra.ai' },
            ].map(({ label, href }) => (
              <a key={label} href={href}
                className="text-small font-body text-text-disabled hover:text-text-primary transition-colors duration-fast focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand rounded">
                {label}
              </a>
            ))}
          </div>
        </div>
      </div>

      <div className="mt-10 pt-6 border-t border-border-default flex flex-col tablet:flex-row items-center justify-between gap-3">
        <p className="text-caption font-body text-text-disabled">© 2025 Pactra. All rights reserved.</p>
        <p className="text-caption font-body text-text-disabled">Built for founders who move fast and sign smart.</p>
      </div>
    </div>
  </footer>
)

// ─── Page ──────────────────────────────────────────────────────────────────

export const LandingPage: React.FC = () => (
  <div className="min-h-screen bg-bg-primary flex flex-col">
    <LandingNav />
    <main id="main-content" tabIndex={-1} className="flex-1 focus:outline-none">
      <HeroSection />
      <ProblemSection />
      <HowItWorksSection />
      <WhyPactraSection />
      <PrinciplesSection />
      <CtaSection />
    </main>
    <LandingFooter />
  </div>
)
