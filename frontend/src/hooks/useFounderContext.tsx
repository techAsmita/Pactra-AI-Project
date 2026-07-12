import React, { createContext, useContext, useState, useCallback } from 'react'
import type { FundingStage, RiskAppetite } from '@/types'

export interface FounderContextData {
  founderName: string
  founderEmail: string
  companyName: string
  industry: string
  fundingStage: FundingStage | ''
  teamSize: string
  revenueRange: string
  riskAppetite: RiskAppetite | ''
  currentGoal: string
  isComplete: boolean
}

const EMPTY_CONTEXT: FounderContextData = {
  founderName: '',
  founderEmail: '',
  companyName: '',
  industry: '',
  fundingStage: '',
  teamSize: '',
  revenueRange: '',
  riskAppetite: '',
  currentGoal: '',
  isComplete: false,
}

const STORAGE_KEY = 'pactra_founder_context'

interface FounderContextValue {
  context: FounderContextData
  updateContext: (patch: Partial<FounderContextData>) => void
  completeContext: () => void
  resetContext: () => void
}

const FounderContext = createContext<FounderContextValue | null>(null)

function loadFromStorage(): FounderContextData {
  try {
    const raw = sessionStorage.getItem(STORAGE_KEY)
    if (raw) return { ...EMPTY_CONTEXT, ...JSON.parse(raw) }
  } catch {}
  return EMPTY_CONTEXT
}

export const FounderContextProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [context, setContext] = useState<FounderContextData>(loadFromStorage)

  const persist = useCallback((next: FounderContextData) => {
    setContext(next)
    try { sessionStorage.setItem(STORAGE_KEY, JSON.stringify(next)) } catch {}
  }, [])

  const updateContext = useCallback((patch: Partial<FounderContextData>) => {
    setContext(prev => {
      const next = { ...prev, ...patch }
      try { sessionStorage.setItem(STORAGE_KEY, JSON.stringify(next)) } catch {}
      return next
    })
  }, [])

  const completeContext = useCallback(() => {
    setContext(prev => {
      const next = { ...prev, isComplete: true }
      try { sessionStorage.setItem(STORAGE_KEY, JSON.stringify(next)) } catch {}
      return next
    })
  }, [])

  const resetContext = useCallback(() => { persist(EMPTY_CONTEXT) }, [persist])

  return (
    <FounderContext.Provider value={{ context, updateContext, completeContext, resetContext }}>
      {children}
    </FounderContext.Provider>
  )
}

export const useFounderContext = (): FounderContextValue => {
  const ctx = useContext(FounderContext)
  if (!ctx) throw new Error('useFounderContext must be used within FounderContextProvider')
  return ctx
}
