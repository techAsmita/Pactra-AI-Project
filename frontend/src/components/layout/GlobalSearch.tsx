import React, { useState, useEffect, useRef, useCallback } from 'react'
import { useNavigate } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import { Search, FileText, X, ArrowRight, AlertTriangle, Building2, Gavel } from 'lucide-react'
import { createPortal } from 'react-dom'
import { cn } from '@/lib/utils'
import { Badge } from '@/components/ui/Badge'
import { useAgreements } from '@/hooks/useAgreements'
import { useFounderContext } from '@/hooks/useFounderContext'

interface SearchResult {
  id: string
  type: 'agreement' | 'clause' | 'decision' | 'risk' | 'company'
  title: string
  subtitle: string
  href: string
  badge?: React.ReactNode
}

interface GlobalSearchProps {
  open: boolean
  onClose: () => void
}

export const GlobalSearch: React.FC<GlobalSearchProps> = ({ open, onClose }) => {
  const navigate = useNavigate()
  const { agreements } = useAgreements()
  const { context } = useFounderContext()
  const [query, setQuery] = useState('')
  const [selected, setSelected] = useState(0)
  const inputRef = useRef<HTMLInputElement>(null)

  useEffect(() => {
    if (open) { setQuery(''); setSelected(0); setTimeout(() => inputRef.current?.focus(), 50) }
  }, [open])

  useEffect(() => {
    if (!open) return
    const handler = (e: KeyboardEvent) => { if (e.key === 'Escape') onClose() }
    document.addEventListener('keydown', handler)
    return () => document.removeEventListener('keydown', handler)
  }, [open, onClose])

  const results: SearchResult[] = React.useMemo(() => {
    if (!query.trim()) return []
    const q = query.toLowerCase()
    const out: SearchResult[] = []

    agreements.forEach(a => {
      // Contract names
      if (a.name.toLowerCase().includes(q) || a.type.toLowerCase().includes(q)) {
        out.push({
          id: a.id, type: 'agreement',
          title: a.name, subtitle: a.type,
          href: a.analysis ? `/contracts/${a.id}/decision` : `/contracts/${a.id}/analysis`,
          badge: a.decision ? <Badge type="decision" value={a.decision} size="sm" /> : <Badge type="status" value={a.status} size="sm" />,
        })
      }
      // Clauses
      a.analysis?.clauses.forEach(c => {
        if (c.title.toLowerCase().includes(q) || c.reference.toLowerCase().includes(q)) {
          out.push({
            id: `${a.id}-${c.id}`, type: 'clause',
            title: `${c.reference} — ${c.title}`,
            subtitle: `in ${a.name}`,
            href: `/contracts/${a.id}/decision`,
            badge: <Badge type="risk" value={c.severity} size="sm" />,
          })
        }
      })
      // Decisions — match by outcome (e.g. "negotiate", "sign") against agreements that reached that decision
      if (a.decision && a.decision.toLowerCase().includes(q)) {
        out.push({
          id: `${a.id}-decision`, type: 'decision',
          title: `${a.decision} — ${a.name}`,
          subtitle: a.confidence !== undefined ? `${a.confidence}% confidence` : 'Decision',
          href: `/contracts/${a.id}/decision`,
          badge: <Badge type="decision" value={a.decision} size="sm" />,
        })
      }
      // Risks — match against flagged key risks within the analysis
      a.analysis?.keyRisks.forEach((risk, i) => {
        if (risk.toLowerCase().includes(q)) {
          out.push({
            id: `${a.id}-risk-${i}`, type: 'risk',
            title: risk,
            subtitle: `in ${a.name}`,
            href: `/contracts/${a.id}/decision`,
            badge: a.riskLevel ? <Badge type="risk" value={a.riskLevel} size="sm" /> : undefined,
          })
        }
      })
    })

    // Companies — the founder's own business context
    if (context.companyName && context.companyName.toLowerCase().includes(q)) {
      out.push({
        id: 'company-self', type: 'company',
        title: context.companyName,
        subtitle: context.industry || 'Your company',
        href: '/settings',
      })
    }

    return out.slice(0, 8)
  }, [query, agreements, context])

  const handleSelect = useCallback((href: string) => {
    navigate(href); onClose()
  }, [navigate, onClose])

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'ArrowDown') { e.preventDefault(); setSelected(s => Math.min(s + 1, results.length - 1)) }
    if (e.key === 'ArrowUp') { e.preventDefault(); setSelected(s => Math.max(s - 1, 0)) }
    if (e.key === 'Enter' && results[selected]) handleSelect(results[selected].href)
  }

  const typeIcon = { agreement: FileText, clause: Gavel, decision: Gavel, risk: AlertTriangle, company: Building2 }

  return createPortal(
    <AnimatePresence>
      {open && (
        <>
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            transition={{ duration: 0.15 }}
            className="fixed inset-0 z-40 bg-bg-primary/70 backdrop-blur-sm"
            onClick={onClose} aria-hidden="true" />
          <motion.div initial={{ opacity: 0, scale: 0.97, y: -8 }} animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.97 }} transition={{ duration: 0.2, ease: [0, 0, 0.2, 1] }}
            className="fixed top-24 left-1/2 -translate-x-1/2 z-50 w-full max-w-xl px-4"
            role="dialog" aria-label="Global search" aria-modal="true">
            <div className="rounded-modal border border-border-default bg-bg-secondary shadow-elv-4 overflow-hidden">
              {/* Input */}
              <div className="flex items-center gap-3 px-4 py-3.5 border-b border-border-default">
                <Search size={16} className="text-text-muted shrink-0" aria-hidden="true" />
                <input
                  ref={inputRef}
                  value={query}
                  onChange={e => { setQuery(e.target.value); setSelected(0) }}
                  onKeyDown={handleKeyDown}
                  placeholder="Search contracts, clauses, decisions, risks, companies…"
                  className="flex-1 bg-transparent text-body text-text-primary placeholder:text-text-disabled outline-none font-body"
                  aria-label="Search"
                  aria-autocomplete="list"
                />
                {query && (
                  <button onClick={() => setQuery('')} className="text-text-muted hover:text-text-primary transition-colors duration-fast">
                    <X size={14} aria-hidden="true" />
                  </button>
                )}
                <kbd className="text-caption font-mono bg-bg-surface border border-border-default px-1.5 py-0.5 rounded text-text-muted">Esc</kbd>
              </div>

              {/* Results */}
              {query.trim() && (
                <div className="py-2 max-h-80 overflow-y-auto">
                  {results.length === 0 ? (
                    <div className="px-4 py-8 text-center">
                      <p className="text-body font-body text-text-muted">No results for "{query}"</p>
                      <p className="text-small font-body text-text-disabled mt-1">Try searching for a contract name or clause type</p>
                    </div>
                  ) : (
                    results.map((result, i) => {
                      const Icon = typeIcon[result.type]
                      return (
                        <div
                          key={result.id}
                          className={cn(
                            'flex items-center gap-3 px-4 py-3 cursor-pointer transition-colors duration-fast',
                            selected === i ? 'bg-bg-surface' : 'hover:bg-bg-surface',
                          )}
                          onClick={() => handleSelect(result.href)}
                          onMouseEnter={() => setSelected(i)}
                        >
                          <div className="w-8 h-8 rounded-btn bg-bg-card-hover flex items-center justify-center shrink-0">
                            <Icon size={14} className="text-text-muted" aria-hidden="true" />
                          </div>
                          <div className="flex-1 min-w-0">
                            <p className="text-small font-body font-medium text-text-primary truncate">{result.title}</p>
                            <p className="text-caption font-body text-text-muted truncate">{result.subtitle}</p>
                          </div>
                          <div className="flex items-center gap-2 shrink-0">
                            {result.badge}
                            <ArrowRight size={12} className="text-text-disabled" aria-hidden="true" />
                          </div>
                        </div>
                      )
                    })
                  )}
                </div>
              )}

              {!query.trim() && (
                <div className="px-4 py-6 text-center">
                  <p className="text-small font-body text-text-muted">Search contracts, clauses, decisions, risks, and companies</p>
                  <div className="flex items-center justify-center gap-4 mt-3">
                    <span className="text-caption font-mono text-text-disabled">↑↓ navigate</span>
                    <span className="text-caption font-mono text-text-disabled">↵ open</span>
                    <span className="text-caption font-mono text-text-disabled">Esc close</span>
                  </div>
                </div>
              )}
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>,
    document.body,
  )
}
