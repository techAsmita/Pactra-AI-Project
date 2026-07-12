import React, { useEffect, useState, useCallback, useRef } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { motion, AnimatePresence, useReducedMotion } from 'framer-motion'
import { Check, ArrowRight, Lock, FileText, Brain, User } from 'lucide-react'
import { cn } from '@/lib/utils'
import { PageContainer } from '@/components/layout/PageContainer'
import { Badge } from '@/components/ui/Badge'
import { Button } from '@/components/ui/Button'
import { useAgreements } from '@/hooks/useAgreements'
import { useFounderContext } from '@/hooks/useFounderContext'
import { generateSampleAnalysis } from '@/lib/sampleAnalysis'

function usePrefersReducedMotion() { return useReducedMotion() ?? false }

type AgentPhase = 'waiting' | 'initializing' | 'reading' | 'analyzing' | 'completed'

const AGENTS = [
  { id: 'legal',       emoji: '🧠', name: 'Legal Advisor',        personality: 'Precise' },
  { id: 'financial',   emoji: '💰', name: 'Financial Strategist', personality: 'Analytical' },
  { id: 'growth',      emoji: '📈', name: 'Growth Advisor',       personality: 'Forward-looking' },
  { id: 'negotiation', emoji: '🤝', name: 'Negotiation Coach',    personality: 'Practical' },
  { id: 'decision',    emoji: '⚡', name: 'Decision Engine',      personality: 'Neutral' },
]

const STREAM_TEMPLATES: Record<string, string[]> = {
  legal:       ['Parsing contract structure…', 'Cross-referencing liability clauses…', 'Liability and renewal terms identified'],
  financial:   ['Calculating financial exposure…', 'Reviewing payment terms…', 'Cash flow impact estimated'],
  growth:      ['Evaluating strategic alignment…', 'Checking for exclusivity restrictions…', 'Growth implications mapped'],
  negotiation: ['Identifying leverage points…', 'Drafting negotiation priorities…', 'Negotiation strategy ready'],
  decision:    ['Synthesizing all agent inputs…', 'Weighing founder risk appetite…', 'Recommendation finalized'],
}

const agentStatusLabel: Record<AgentPhase, string> = {
  waiting: '', initializing: 'Initializing…', reading: 'Reading clauses…', analyzing: 'Analyzing…', completed: 'Completed',
}

const TRUST_INDICATORS = [
  { icon: Lock,     text: 'Your agreement stays private' },
  { icon: FileText, text: 'Original document preserved' },
  { icon: Brain,    text: 'Analysis uses your business context' },
  { icon: User,     text: 'Final decision remains yours' },
]

const AGENT_SLOT = 1100

export const AnalysisPage: React.FC = () => {
  const { id } = useParams<{ id: string }>()
  const navigate = useNavigate()
  const reduced = usePrefersReducedMotion()
  const { getAgreement, completeAnalysis, setStatus } = useAgreements()
  const { context } = useFounderContext()

  const agreement = id ? getAgreement(id) : undefined

  const [agentPhases, setAgentPhases] = useState<Record<string, AgentPhase>>(
    Object.fromEntries(AGENTS.map(a => [a.id, 'waiting']))
  )
  const [stream, setStream] = useState<{ agent: string; emoji: string; text: string }[]>([])
  const [confidence, setConfidence] = useState(0)
  const [analysisComplete, setAnalysisComplete] = useState(false)

  // One contract = one analysis object. Generate it exactly once per agreement
  // (or reuse the already-stored one) and reference that same object for the
  // live confidence ramp, the final save, and the completed-state summary —
  // never a second independently-generated result.
  const resultRef = useRef<ReturnType<typeof generateSampleAnalysis> | null>(
    agreement?.analysis ?? null
  )
  if (agreement && !resultRef.current) {
    resultRef.current = generateSampleAnalysis()
  }
  const result = resultRef.current

  const finish = useCallback(() => {
    if (!agreement || !result) return
    completeAnalysis(agreement.id, result)
    setConfidence(result.confidence)
    setAnalysisComplete(true)
    // Do NOT auto-redirect — founder clicks "View Decision" per spec
  }, [agreement, completeAnalysis, result])

  useEffect(() => {
    if (!agreement || !result) return
    // If already completed, show the completed state immediately — including
    // a populated agent timeline and summary, never a "waiting" message.
    if (agreement.status === 'decision_ready' && agreement.analysis) {
      setAgentPhases(Object.fromEntries(AGENTS.map(a => [a.id, 'completed'])))
      setConfidence(agreement.analysis.confidence)
      setStream(AGENTS.map(agent => ({
        agent: agent.id,
        emoji: agent.emoji,
        text: STREAM_TEMPLATES[agent.id][2],
      })))
      setAnalysisComplete(true)
      return
    }

    setStatus(agreement.id, 'analyzing')

    if (reduced) {
      finish()
      return
    }

    const timers: ReturnType<typeof setTimeout>[] = []
    const add = (fn: () => void, delay: number) => timers.push(setTimeout(fn, delay))

    AGENTS.forEach((agent, i) => {
      const base = i * AGENT_SLOT
      const templates = STREAM_TEMPLATES[agent.id]

      add(() => setAgentPhases(p => ({ ...p, [agent.id]: 'initializing' })), base)
      add(() => {
        setAgentPhases(p => ({ ...p, [agent.id]: 'reading' }))
        setStream(s => [...s, { agent: agent.id, emoji: agent.emoji, text: templates[0] }])
      }, base + 280)
      add(() => {
        setAgentPhases(p => ({ ...p, [agent.id]: 'analyzing' }))
        setStream(s => [...s, { agent: agent.id, emoji: agent.emoji, text: templates[1] }])
        // Ramp toward the ACTUAL result confidence — never a fixed placeholder.
        setConfidence(Math.round(((i + 0.5) / AGENTS.length) * result.confidence))
      }, base + 600)
      add(() => {
        setAgentPhases(p => ({ ...p, [agent.id]: 'completed' }))
        setStream(s => [...s, { agent: agent.id, emoji: agent.emoji, text: templates[2] }])
        setConfidence(Math.round(((i + 1) / AGENTS.length) * result.confidence))
      }, base + AGENT_SLOT - 100)
    })

    add(finish, AGENTS.length * AGENT_SLOT + 400)

    return () => timers.forEach(clearTimeout)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [agreement?.id])

  if (!agreement) {
    return (
      <PageContainer className="py-10">
        <p className="text-body text-text-muted font-body">Agreement not found.</p>
      </PageContainer>
    )
  }

  return (
    <PageContainer className="py-10 max-w-3xl">
      <div className="flex items-center gap-3 mb-1">
        <FileText size={16} className="text-text-muted" aria-hidden="true" />
        <h1 className="font-heading text-h2 text-text-primary">{agreement.name}</h1>
      </div>
      <p className="text-body text-text-muted font-body mb-4">
        {context.companyName
          ? `Analyzing against ${context.companyName}'s business context`
          : 'Analyzing your agreement'}
      </p>

      {/* Business Context indicator */}
      {(context.companyName || context.fundingStage) && (
        <div className="flex items-center gap-2 flex-wrap mb-6 px-4 py-2.5 rounded-input border border-border-default bg-bg-surface w-fit">
          <span className="text-caption font-body text-text-muted">Analyzing for</span>
          {context.companyName && <span className="text-caption font-body font-semibold text-text-primary">{context.companyName}</span>}
          {context.fundingStage && <span className="text-caption font-body text-text-muted">· {context.fundingStage.toUpperCase()}</span>}
          {context.industry && <span className="text-caption font-body text-text-muted">· {context.industry}</span>}
          {context.riskAppetite && <span className="text-caption font-body text-text-muted">· {context.riskAppetite.charAt(0).toUpperCase() + context.riskAppetite.slice(1)} Risk</span>}
        </div>
      )}

      <div className="rounded-card border border-border-default bg-bg-secondary overflow-hidden mb-6">
        {/* Confidence header */}
        <div className="px-6 py-4 border-b border-border-default bg-bg-surface/60 flex items-center justify-between">
          <Badge type="generic" color={analysisComplete ? 'green' : 'amber'} size="sm">
            {analysisComplete ? 'Decision Ready' : 'Analyzing…'}
          </Badge>
          <div className="flex items-center gap-2">
            <span className="text-caption font-body text-text-muted">Confidence</span>
            <motion.span
              key={confidence}
              initial={reduced ? {} : { opacity: 0 }}
              animate={{ opacity: 1 }}
              className="font-mono text-small font-bold text-text-primary"
            >
              {confidence}%
            </motion.span>
          </div>
        </div>

        <div className="grid tablet:grid-cols-2 divide-y tablet:divide-y-0 tablet:divide-x divide-border-default">
          {/* Agents */}
          <div className="p-5 flex flex-col gap-2">
            <p className="text-caption font-body text-text-muted font-semibold uppercase tracking-widest mb-1">
              AI Agents
            </p>
            {AGENTS.map(agent => {
              const phase = agentPhases[agent.id]
              const isActive = phase === 'initializing' || phase === 'reading' || phase === 'analyzing'
              return (
                <motion.div
                  key={agent.id}
                  animate={{ opacity: phase === 'waiting' ? 0.35 : 1 }}
                  className={cn(
                    'flex items-center gap-3 rounded-input px-3 py-2.5 border transition-colors duration-normal',
                    isActive && 'border-brand/50 bg-brand/5',
                    phase === 'completed' && 'border-border-default bg-bg-surface',
                    phase === 'waiting' && 'border-border-default',
                  )}
                >
                  <span className="text-[16px] shrink-0">{agent.emoji}</span>
                  <div className="flex-1 min-w-0">
                    <p className="text-small font-body text-text-primary truncate">{agent.name}</p>
                    {phase !== 'waiting' && phase !== 'completed' && (
                      <p className="text-caption font-mono text-brand">{agentStatusLabel[phase]}</p>
                    )}
                  </div>
                  {phase === 'completed' && (
                    <motion.div initial={reduced ? {} : { scale: 0 }} animate={{ scale: 1 }}
                      transition={{ type: 'spring', stiffness: 300, damping: 18 }}>
                      <Check size={14} className="text-success shrink-0" aria-hidden="true" />
                    </motion.div>
                  )}
                  {isActive && (
                    <motion.div
                      animate={reduced ? {} : { opacity: [1, 0.25, 1] }}
                      transition={{ duration: 1.1, repeat: Infinity }}
                      className="w-2 h-2 rounded-full bg-brand shrink-0"
                      aria-hidden="true"
                    />
                  )}
                </motion.div>
              )
            })}

            {/* Trust indicators — ambient, below agents */}
            <div className="mt-4 pt-4 border-t border-border-default flex flex-col gap-2">
              {TRUST_INDICATORS.map(({ icon: Icon, text }) => (
                <div key={text} className="flex items-center gap-2">
                  <Icon size={11} className="text-text-disabled shrink-0" aria-hidden="true" />
                  <p className="text-caption font-body text-text-disabled">{text}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Decision Stream */}
          <div className="p-5 flex flex-col">
            <p className="text-caption font-body text-text-muted font-semibold uppercase tracking-widest mb-2">
              Decision Stream
            </p>
            <div className="flex flex-col gap-2 max-h-72 overflow-y-auto pr-1 flex-1">
              {stream.length === 0 && (
                <p className="text-small text-text-disabled font-body italic">Waiting for analysis to begin…</p>
              )}
              <AnimatePresence>
                {stream.map((entry, i) => (
                  <motion.div
                    key={i}
                    initial={reduced ? { opacity: 1 } : { opacity: 0, x: -8 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.2 }}
                    className="border-l-2 border-l-success/50 pl-2.5 py-0.5"
                  >
                    <p className="text-small font-body text-text-secondary leading-snug">
                      <span className="mr-1.5">{entry.emoji}</span>{entry.text}
                    </p>
                  </motion.div>
                ))}
              </AnimatePresence>
            </div>
          </div>
        </div>
      </div>

      {/* Analysis Summary — shown once complete, alongside the agent timeline */}
      <AnimatePresence>
        {analysisComplete && result && (
          <motion.div
            initial={reduced ? { opacity: 1 } : { opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.35 }}
            className="rounded-card border border-border-default bg-bg-secondary p-5 mb-6"
          >
            <p className="text-caption font-body text-text-muted font-semibold uppercase tracking-widest mb-2">
              Analysis Summary
            </p>
            <p className="text-small font-body text-text-secondary leading-relaxed">{result.summary}</p>
          </motion.div>
        )}
      </AnimatePresence>

      {/* View Decision CTA — appears only when done, founder must click */}
      <AnimatePresence>
        {analysisComplete && (
          <motion.div
            initial={reduced ? { opacity: 1 } : { opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, ease: [0, 0, 0.2, 1] }}
            className="flex items-center gap-4"
          >
            <Button
              variant="primary"
              size="lg"
              icon={<ArrowRight size={16} />}
              iconPosition="right"
              onClick={() => navigate(`/contracts/${id}/decision`)}
            >
              View Decision
            </Button>
            <p className="text-small font-body text-text-muted">
              Analysis complete · {confidence}% confidence
            </p>
          </motion.div>
        )}
      </AnimatePresence>
    </PageContainer>
  )
}
