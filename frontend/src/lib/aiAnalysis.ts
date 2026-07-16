export interface AiAnalysisResponse {
  summary: string
  explanationBullets: string[]
  keyRisks: string[]
  opportunities: string[]
}

interface AiAnalysisRequest {
  contractText: string
  companyName?: string
  industry?: string
  fundingStage?: string
  riskAppetite?: string
  currentGoal?: string
  decision: string
  riskLevel: string
  confidence: number
}

const MIN_TEXT_LENGTH = 150 // below this, extraction likely failed or file was near-empty

/**
 * Calls the real AI analysis endpoint. Returns null (never throws) if:
 * - there isn't enough extracted document text to bother
 * - the endpoint isn't available (e.g. running `vite dev` locally without `vercel dev`)
 * - the AI provider errors, times out, or isn't configured on this deployment
 * Callers should treat null exactly the same as "use the simulated result."
 */
export async function requestAiAnalysis(input: AiAnalysisRequest): Promise<AiAnalysisResponse | null> {
  if (!input.contractText || input.contractText.trim().length < MIN_TEXT_LENGTH) return null

  try {
    const controller = new AbortController()
    const timeout = setTimeout(() => controller.abort(), 10000)

    const res = await fetch('/api/analyze', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(input),
      signal: controller.signal,
    })
    clearTimeout(timeout)

    if (!res.ok) return null
    const data = await res.json()
    if (!data?.summary || !Array.isArray(data?.explanationBullets)) return null
    return data as AiAnalysisResponse
  } catch {
    // Network error, endpoint not deployed, timeout, etc. — silent fallback.
    return null
  }
}
