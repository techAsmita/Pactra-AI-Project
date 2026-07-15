import React, { useState, useMemo, useEffect } from 'react'
import { useNavigate, useSearchParams } from 'react-router-dom'
import { motion } from 'framer-motion'
import { Plus, FileText, ArrowRight, ArrowUpDown } from 'lucide-react'
import { cn } from '@/lib/utils'
import { PageContainer } from '@/components/layout/PageContainer'
import { Button } from '@/components/ui/Button'
import { Input } from '@/components/ui/Input'
import { Badge } from '@/components/ui/Badge'
import { EmptyState } from '@/components/ui/EmptyState'
import { useAgreements } from '@/hooks/useAgreements'
import type { Agreement, AgreementStatus } from '@/types'

type Tab = 'active' | 'archived'
type SortKey = 'name' | 'date' | 'decision'

function timeAgo(iso: string): string {
  const diff = Date.now() - new Date(iso).getTime()
  const mins = Math.floor(diff / 60000)
  if (mins < 1) return 'just now'
  if (mins < 60) return `${mins}m ago`
  const hrs = Math.floor(mins / 60)
  if (hrs < 24) return `${hrs}h ago`
  return `${Math.floor(hrs / 24)}d ago`
}

const ACTIVE_STATUSES: AgreementStatus[] = ['uploaded','parsing','context_confirmed','analyzing','decision_ready','negotiating','completed']

export const ContractsPage: React.FC = () => {
  const navigate = useNavigate()
  const { agreements } = useAgreements()
  const [searchParams] = useSearchParams()
  const [tab, setTab] = useState<Tab>(searchParams.get('tab') === 'archived' ? 'archived' : 'active')
  const [search, setSearch] = useState('')
  const [sortKey, setSortKey] = useState<SortKey>('date')

  // Stay reactive to ?tab= changes (e.g. from a toast's "View Archive" action)
  // even when this page is already mounted, not just on first load.
  useEffect(() => {
    const t = searchParams.get('tab')
    if (t === 'archived' || t === 'active') setTab(t)
  }, [searchParams])

  const filtered = useMemo(() => {
    let list = agreements.filter(a =>
      tab === 'active' ? ACTIVE_STATUSES.includes(a.status) : a.status === 'archived'
    )
    if (search.trim()) {
      const q = search.toLowerCase()
      list = list.filter(a =>
        a.name.toLowerCase().includes(q) ||
        a.type.toLowerCase().includes(q) ||
        a.decision?.toLowerCase().includes(q)
      )
    }
    return [...list].sort((a, b) => {
      if (sortKey === 'name') return a.name.localeCompare(b.name)
      if (sortKey === 'decision') return (a.decision ?? '').localeCompare(b.decision ?? '')
      return new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime()
    })
  }, [agreements, tab, search, sortKey])

  const isAnalyzed = (a: Agreement) =>
    a.status === 'decision_ready' || a.status === 'negotiating' || a.status === 'completed'

  return (
    <PageContainer className="py-10">
      <div className="flex items-start justify-between flex-wrap gap-4 mb-8">
        <div>
          <h1 className="font-heading text-h1 text-text-primary">Contracts</h1>
          <p className="text-body text-text-muted mt-1 font-body">
            Every agreement you've analyzed, in one place.
          </p>
        </div>
        <Button variant="primary" size="md" icon={<Plus size={16} />} onClick={() => navigate('/contracts/new')}>
          Upload New Agreement
        </Button>
      </div>

      {/* Tabs */}
      <div className="flex items-center gap-6 border-b border-border-default mb-6">
        {(['active', 'archived'] as Tab[]).map(t => (
          <button
            key={t}
            onClick={() => setTab(t)}
            className={cn(
              'text-small font-body font-medium pb-3 capitalize transition-colors duration-fast',
              'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand',
              tab === t
                ? 'text-text-primary border-b-2 border-brand'
                : 'text-text-muted hover:text-text-secondary',
            )}
          >
            {t}
          </button>
        ))}
      </div>

      {/* Search + Sort */}
      <div className="flex items-center gap-3 mb-5 flex-wrap">
        <div className="flex-1 min-w-[200px] max-w-sm">
          <Input
            label="Search"
            hideLabel
            placeholder="Search agreements…"
            value={search}
            onChange={e => setSearch(e.target.value)}
          />
        </div>
        <div className="flex items-center gap-1">
          {(['date', 'name', 'decision'] as SortKey[]).map(key => (
            <button
              key={key}
              onClick={() => setSortKey(key)}
              className={cn(
                'flex items-center gap-1.5 px-3 h-9 rounded-btn text-caption font-body capitalize transition-all duration-fast',
                'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand',
                sortKey === key
                  ? 'bg-brand/15 text-brand border border-brand/30'
                  : 'text-text-muted hover:bg-bg-surface border border-transparent',
              )}
            >
              <ArrowUpDown size={11} aria-hidden="true" />
              {key}
            </button>
          ))}
        </div>
      </div>

      {filtered.length === 0 ? (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="rounded-card border border-border-default bg-bg-secondary"
        >
          <EmptyState
            icon={<FileText size={44} strokeWidth={1.5} />}
            headline={search ? `No results for "${search}"` : tab === 'active' ? 'No active agreements' : 'No archived agreements'}
            description={search ? 'Try a different search term.' : 'Upload your first agreement to get started.'}
            ctaLabel={!search ? 'Upload Agreement' : undefined}
            onCta={!search ? () => navigate('/contracts/new') : undefined}
          />
        </motion.div>
      ) : (
        <div className="flex flex-col gap-2">
          {/* Table header */}
          <div className="hidden tablet:grid grid-cols-[1fr_140px_120px_100px_44px] gap-4 px-4 pb-2">
            {['Agreement', 'Type', 'Decision', 'Updated', ''].map((h, i) => (
              <p key={i} className="text-caption font-body text-text-muted font-semibold uppercase tracking-widest">{h}</p>
            ))}
          </div>
          {filtered.map((agreement, i) => (
            <motion.div
              key={agreement.id}
              initial={{ opacity: 0, y: 6 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.25, delay: i * 0.04 }}
              onClick={() => navigate(isAnalyzed(agreement)
                ? `/contracts/${agreement.id}/decision`
                : `/contracts/${agreement.id}/analysis`
              )}
              role="button"
              tabIndex={0}
              onKeyDown={(e) => {
                if (e.key === 'Enter' || e.key === ' ') {
                  e.preventDefault()
                  navigate(isAnalyzed(agreement)
                    ? `/contracts/${agreement.id}/decision`
                    : `/contracts/${agreement.id}/analysis`
                  )
                }
              }}
              className={cn(
                'grid tablet:grid-cols-[1fr_140px_120px_100px_44px] gap-4 items-center',
                'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand focus-visible:ring-inset',
                'px-4 py-3.5 rounded-card border border-border-default bg-bg-secondary',
                'hover:border-border-hover hover:bg-bg-card-hover',
                'transition-all duration-fast cursor-pointer',
              )}
            >
              <div className="flex items-center gap-3 min-w-0">
                <div className="w-8 h-8 rounded-btn bg-brand/10 flex items-center justify-center shrink-0">
                  <FileText size={14} className="text-brand" aria-hidden="true" />
                </div>
                <p className="text-small font-body font-medium text-text-primary truncate">{agreement.name}</p>
              </div>
              <p className="text-small font-body text-text-muted truncate hidden tablet:block">{agreement.type}</p>
              <div className="hidden tablet:flex">
                {agreement.decision
                  ? <Badge type="decision" value={agreement.decision} size="sm" />
                  : <Badge type="status" value={agreement.status} size="sm" />
                }
              </div>
              <p className="text-small font-mono text-text-muted hidden tablet:block">{timeAgo(agreement.updatedAt)}</p>
              <ArrowRight size={14} className="text-text-muted justify-self-center hidden tablet:block" aria-hidden="true" />
              {/* Mobile: show badge below name */}
              <div className="tablet:hidden flex items-center gap-2">
                {agreement.decision
                  ? <Badge type="decision" value={agreement.decision} size="sm" />
                  : <Badge type="status" value={agreement.status} size="sm" />
                }
                <span className="text-caption font-mono text-text-muted">{timeAgo(agreement.updatedAt)}</span>
              </div>
            </motion.div>
          ))}
        </div>
      )}
    </PageContainer>
  )
}
