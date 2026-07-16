import React, { useState, useCallback, useRef } from 'react'
import { useNavigate } from 'react-router-dom'
import { motion, AnimatePresence, useReducedMotion } from 'framer-motion'
import { Upload as UploadIcon, FileText, X, AlertCircle, CheckCircle2 } from 'lucide-react'
import { cn } from '@/lib/utils'
import { Button } from '@/components/ui/Button'
import { PageContainer } from '@/components/layout/PageContainer'
import { useAgreements } from '@/hooks/useAgreements'
import { inferAgreementType } from '@/lib/sampleAnalysis'
import { extractTextFromFile } from '@/lib/extractText'

function usePrefersReducedMotion() {
  return useReducedMotion() ?? false
}

const MAX_FILE_SIZE = 10 * 1024 * 1024 // 10MB — per 06_DECISION_FLOWS.md
const ACCEPTED_TYPES = ['application/pdf', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document', 'text/plain']
const ACCEPTED_EXTENSIONS = ['.pdf', '.docx', '.txt']

type UploadState = 'idle' | 'uploading' | 'success' | 'error'

function isAcceptedFile(file: File): boolean {
  const ext = '.' + file.name.split('.').pop()?.toLowerCase()
  return ACCEPTED_TYPES.includes(file.type) || ACCEPTED_EXTENSIONS.includes(ext)
}

function formatBytes(bytes: number): string {
  if (bytes < 1024) return `${bytes} B`
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(0)} KB`
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`
}

export const UploadPage: React.FC = () => {
  const navigate = useNavigate()
  const reduced = usePrefersReducedMotion()
  const { createAgreement } = useAgreements()
  const inputRef = useRef<HTMLInputElement>(null)

  const [isDragging, setIsDragging] = useState(false)
  const [state, setState] = useState<UploadState>('idle')
  const [progress, setProgress] = useState(0)
  const [file, setFile] = useState<File | null>(null)
  const [error, setError] = useState<string | null>(null)

  const validateAndStart = useCallback((f: File) => {
    setError(null)

    if (!isAcceptedFile(f)) {
      setError('Only PDF, DOCX, and TXT files are supported.')
      setState('error')
      return
    }
    if (f.size > MAX_FILE_SIZE) {
      setError('File exceeds 10MB limit. Try compressing your document.')
      setState('error')
      return
    }

    setFile(f)
    setState('uploading')
    setProgress(0)

    // Simulated upload progress — replace with real upload call in production
    const interval = setInterval(() => {
      setProgress(prev => {
        const next = prev + Math.random() * 22 + 8
        if (next >= 100) {
          clearInterval(interval)
          setState('success')
          return 100
        }
        return next
      })
    }, 180)
  }, [])

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault()
    setIsDragging(false)
    const dropped = e.dataTransfer.files?.[0]
    if (dropped) validateAndStart(dropped)
  }, [validateAndStart])

  const handleFileSelect = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const selected = e.target.files?.[0]
    if (selected) validateAndStart(selected)
  }, [validateAndStart])

  const handleRetry = useCallback(() => {
    setState('idle')
    setError(null)
    setFile(null)
    setProgress(0)
  }, [])

  const hasSubmitted = useRef(false)
  const [extracting, setExtracting] = useState(false)

  const handleContinue = useCallback(async () => {
    if (!file || hasSubmitted.current) return
    hasSubmitted.current = true
    setExtracting(true)
    // Best-effort text extraction for real AI analysis — never blocks or
    // breaks the flow. An empty result just means simulated analysis runs.
    const rawText = await extractTextFromFile(file)
    setExtracting(false)
    const agreement = createAgreement({
      fileName: file.name,
      fileSize: file.size,
      type: inferAgreementType(file.name),
      rawText,
    })
    // Route through Founder Context Review before analysis
    navigate(`/contracts/new/context?id=${agreement.id}`)
  }, [file, createAgreement, navigate])

  return (
    <PageContainer className="py-10 max-w-2xl">
      <h1 className="font-heading text-h1 text-text-primary">Upload Agreement</h1>
      <p className="text-body text-text-muted mt-2 font-body">
        Pactra accepts PDF, DOCX, and TXT files up to 10MB.
      </p>

      <div className="mt-10">
        <AnimatePresence mode="wait">
          {(state === 'idle' || state === 'error') && (
            <motion.div
              key="dropzone"
              initial={reduced ? { opacity: 1 } : { opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.3 }}
            >
              <div
                onDragOver={(e) => { e.preventDefault(); setIsDragging(true) }}
                onDragLeave={() => setIsDragging(false)}
                onDrop={handleDrop}
                onClick={() => inputRef.current?.click()}
                role="button"
                tabIndex={0}
                onKeyDown={(e) => { if (e.key === 'Enter' || e.key === ' ') inputRef.current?.click() }}
                className={cn(
                  'flex flex-col items-center justify-center gap-4 text-center cursor-pointer',
                  'rounded-card border-2 border-dashed p-16 transition-all duration-normal',
                  'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand',
                  isDragging
                    ? 'border-brand bg-brand/5 scale-[1.01]'
                    : state === 'error'
                      ? 'border-crimson/40 bg-crimson/5'
                      : 'border-border-default bg-bg-secondary hover:border-border-hover hover:bg-bg-card-hover',
                )}
              >
                <div className={cn(
                  'w-16 h-16 rounded-card flex items-center justify-center transition-colors duration-normal',
                  isDragging ? 'bg-brand/15' : 'bg-bg-surface',
                )}>
                  {state === 'error' ? (
                    <AlertCircle size={28} className="text-crimson" aria-hidden="true" />
                  ) : (
                    <UploadIcon size={28} className={isDragging ? 'text-brand' : 'text-text-muted'} aria-hidden="true" />
                  )}
                </div>
                <div>
                  <p className="font-body text-body font-medium text-text-primary mb-1">
                    {isDragging ? 'Drop to upload' : 'Drag your agreement here'}
                  </p>
                  <p className="text-small text-text-muted font-body">
                    or click to browse · PDF, DOCX, TXT · up to 10MB
                  </p>
                </div>
                <input
                  ref={inputRef}
                  type="file"
                  accept=".pdf,.docx,.txt"
                  onChange={handleFileSelect}
                  className="hidden"
                  aria-label="Choose file to upload"
                />
              </div>

              {state === 'error' && error && (
                <motion.div
                  initial={{ opacity: 0, y: -4 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="flex items-center gap-2 mt-3 text-crimson"
                >
                  <AlertCircle size={14} className="shrink-0" aria-hidden="true" />
                  <p className="text-small font-body">{error}</p>
                </motion.div>
              )}
            </motion.div>
          )}

          {state === 'uploading' && file && (
            <motion.div
              key="uploading"
              initial={reduced ? { opacity: 1 } : { opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.3 }}
              className="rounded-card border border-border-default bg-bg-secondary p-8"
            >
              <div className="flex items-center gap-4 mb-5">
                <div className="w-12 h-12 rounded-card bg-brand/10 flex items-center justify-center shrink-0">
                  <FileText size={22} className="text-brand" aria-hidden="true" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="font-body text-body font-medium text-text-primary truncate">{file.name}</p>
                  <p className="text-small text-text-muted font-body">{formatBytes(file.size)}</p>
                </div>
              </div>
              <div className="w-full h-2 rounded-badge bg-bg-primary overflow-hidden">
                <motion.div
                  className="h-full bg-brand rounded-badge"
                  animate={{ width: `${progress}%` }}
                  transition={{ duration: reduced ? 0 : 0.2, ease: 'easeOut' }}
                />
              </div>
              <p className="text-caption font-mono text-text-muted mt-2 text-right">
                {Math.min(100, Math.round(progress))}%
              </p>
            </motion.div>
          )}

          {state === 'success' && file && (
            <motion.div
              key="success"
              initial={reduced ? { opacity: 1 } : { opacity: 0, scale: 0.97 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.35, ease: [0, 0, 0.2, 1] }}
              className="rounded-card border border-success/30 bg-success/5 p-8"
            >
              <div className="flex items-center gap-4">
                <motion.div
                  initial={reduced ? {} : { scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ type: 'spring', stiffness: 300, damping: 18 }}
                  className="w-12 h-12 rounded-card bg-success/15 flex items-center justify-center shrink-0"
                >
                  <CheckCircle2 size={22} className="text-success" aria-hidden="true" />
                </motion.div>
                <div className="flex-1 min-w-0">
                  <p className="font-body text-body font-medium text-text-primary truncate">{file.name}</p>
                  <p className="text-small text-success font-body">Upload complete · {formatBytes(file.size)}</p>
                </div>
                <Button
                  variant="ghost"
                  size="sm"
                  icon={<X size={14} />}
                  onClick={handleRetry}
                  aria-label="Remove file and choose another"
                />
              </div>
              <Button variant="primary" size="lg" className="w-full mt-6" onClick={handleContinue} loading={extracting}>
                {extracting ? 'Reading document…' : 'Begin Analysis'}
              </Button>
            </motion.div>
          )}
        </AnimatePresence>

        {state === 'error' && (
          <Button variant="secondary" size="md" className="mt-4" onClick={handleRetry}>
            Try Again
          </Button>
        )}
      </div>
    </PageContainer>
  )
}
