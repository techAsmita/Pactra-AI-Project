import React, { createContext, useContext, useState, useCallback } from 'react'
import type { Agreement, AnalysisResult, AgreementStatus } from '@/types'

const STORAGE_KEY = 'pactra_agreements'

interface AgreementsContextValue {
  agreements: Agreement[]
  getAgreement: (id: string) => Agreement | undefined
  createAgreement: (input: { fileName: string; fileSize: number; type: Agreement['type'] }) => Agreement
  updateAgreement: (id: string, patch: Partial<Agreement>) => void
  setStatus: (id: string, status: AgreementStatus) => void
  completeAnalysis: (id: string, analysis: AnalysisResult) => void
  archiveAgreement: (id: string) => void
}

const AgreementsContext = createContext<AgreementsContextValue | null>(null)

function loadFromStorage(): Agreement[] {
  try {
    const raw = sessionStorage.getItem(STORAGE_KEY)
    if (raw) return JSON.parse(raw)
  } catch {
    // ignore corrupt storage
  }
  return []
}

function persist(agreements: Agreement[]) {
  try {
    sessionStorage.setItem(STORAGE_KEY, JSON.stringify(agreements))
  } catch {
    // storage unavailable — in-memory state still works
  }
}

export const AgreementsProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [agreements, setAgreements] = useState<Agreement[]>(loadFromStorage)

  const getAgreement = useCallback((id: string) => {
    return agreements.find(a => a.id === id)
  }, [agreements])

  const createAgreement = useCallback((input: { fileName: string; fileSize: number; type: Agreement['type'] }): Agreement => {
    const now = new Date().toISOString()
    const newAgreement: Agreement = {
      id: `agr_${Date.now()}_${Math.random().toString(36).slice(2, 8)}`,
      name: input.fileName.replace(/\.(pdf|docx|txt)$/i, ''),
      type: input.type,
      status: 'uploaded',
      fileName: input.fileName,
      fileSize: input.fileSize,
      createdAt: now,
      updatedAt: now,
    }
    setAgreements(prev => {
      const next = [newAgreement, ...prev]
      persist(next)
      return next
    })
    return newAgreement
  }, [])

  const updateAgreement = useCallback((id: string, patch: Partial<Agreement>) => {
    setAgreements(prev => {
      const next = prev.map(a => a.id === id ? { ...a, ...patch, updatedAt: new Date().toISOString() } : a)
      persist(next)
      return next
    })
  }, [])

  const setStatus = useCallback((id: string, status: AgreementStatus) => {
    updateAgreement(id, { status })
  }, [updateAgreement])

  const completeAnalysis = useCallback((id: string, analysis: AnalysisResult) => {
    updateAgreement(id, {
      status: 'decision_ready',
      analysis,
      decision: analysis.decision,
      riskLevel: analysis.riskLevel,
      confidence: analysis.confidence,
    })
  }, [updateAgreement])

  const archiveAgreement = useCallback((id: string) => {
    updateAgreement(id, { status: 'archived' })
  }, [updateAgreement])

  return (
    <AgreementsContext.Provider value={{
      agreements, getAgreement, createAgreement, updateAgreement, setStatus, completeAnalysis, archiveAgreement,
    }}>
      {children}
    </AgreementsContext.Provider>
  )
}

export const useAgreements = (): AgreementsContextValue => {
  const ctx = useContext(AgreementsContext)
  if (!ctx) throw new Error('useAgreements must be used within AgreementsProvider')
  return ctx
}
