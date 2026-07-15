import React from 'react'
import { Outlet, useParams, useNavigate, useLocation } from 'react-router-dom'
import { motion } from 'framer-motion'
import { ArrowLeft, FileText } from 'lucide-react'
import { cn } from '@/lib/utils'
import { Badge } from '@/components/ui/Badge'
import { ContractProgress } from '@/components/ui/ContractProgress'
import { useAgreements } from '@/hooks/useAgreements'

const TABS = [
  { label: 'Analysis',    path: 'analysis' },
  { label: 'Decision',    path: 'decision' },
  { label: 'Negotiation', path: 'negotiate' },
]

function timeAgo(iso: string): string {
  const diff = Date.now() - new Date(iso).getTime()
  const mins = Math.floor(diff / 60000)
  if (mins < 1) return 'just now'
  if (mins < 60) return `${mins}m ago`
  const hrs = Math.floor(mins / 60)
  if (hrs < 24) return `${hrs}h ago`
  return `${Math.floor(hrs / 24)}d ago`
}

export const AgreementWorkspacePage: React.FC = () => {
  const { id } = useParams<{ id: string }>()
  const navigate = useNavigate()
  const location = useLocation()
  const { getAgreement } = useAgreements()
  const agreement = id ? getAgreement(id) : undefined

  const activeTab = TABS.find(t => location.pathname.endsWith(t.path))?.path ?? 'analysis'

  return (
    <div className="flex flex-col min-h-full">
      {/* Workspace sticky header */}
      <div className="sticky top-[72px] z-10 bg-bg-primary/95 backdrop-blur-md border-b border-border-default">
        <div className="max-w-content mx-auto px-4 tablet:px-10 desktop:px-20">

          {/* Decision Snapshot — always visible per spec */}
          <div className="flex items-center justify-between gap-4 pt-3 pb-2 flex-wrap">
            <div className="flex items-center gap-3 min-w-0">
              <button
                onClick={() => navigate('/contracts')}
                className="flex items-center justify-center w-8 h-8 rounded-btn text-text-muted hover:text-text-primary hover:bg-bg-surface transition-all duration-fast focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand shrink-0"
                aria-label="Back to contracts"
              >
                <ArrowLeft size={16} aria-hidden="true" />
              </button>
              <FileText size={14} className="text-text-muted shrink-0" aria-hidden="true" />
              <span className="font-body text-small font-medium text-text-primary truncate max-w-[180px] tablet:max-w-xs">
                {agreement?.name ?? 'Agreement'}
              </span>
              <span className="text-text-disabled text-caption hidden tablet:block">·</span>
              <span className="text-caption font-body text-text-muted hidden tablet:block">{agreement?.type}</span>
            </div>

            {/* Snapshot: confidence + risk + updated */}
            <div className="flex items-center gap-3 shrink-0 flex-wrap">
              {agreement?.confidence !== undefined && (
                <div className="flex items-center gap-1.5">
                  <span className="text-caption font-body text-text-muted">Confidence</span>
                  <span className="font-mono text-small font-bold text-text-primary">{agreement.confidence}%</span>
                </div>
              )}
              {agreement?.riskLevel && (
                <Badge type="risk" value={agreement.riskLevel} size="sm" />
              )}
              {agreement?.decision
                ? <Badge type="decision" value={agreement.decision} size="sm" />
                : agreement?.status && <Badge type="status" value={agreement.status} size="sm" />
              }
              {agreement?.updatedAt && (
                <span className="text-caption font-mono text-text-muted hidden tablet:block">
                  {timeAgo(agreement.updatedAt)}
                </span>
              )}
            </div>
          </div>

          {agreement && (
            <div className="pb-3">
              <ContractProgress agreement={agreement} />
            </div>
          )}

          {/* Tab nav */}
          <div className="flex items-center gap-6">
            {TABS.map(tab => (
              <button
                key={tab.path}
                onClick={() => navigate(`/contracts/${id}/${tab.path}`)}
                className={cn(
                  'text-small font-body font-medium pb-3 transition-colors duration-fast',
                  'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand',
                  activeTab === tab.path
                    ? 'text-text-primary border-b-2 border-brand'
                    : 'text-text-muted hover:text-text-secondary',
                )}
              >
                {tab.label}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Tab content */}
      <motion.div
        key={activeTab}
        initial={{ opacity: 0, y: 4 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.25 }}
        className="flex-1"
      >
        <Outlet />
      </motion.div>
    </div>
  )
}
