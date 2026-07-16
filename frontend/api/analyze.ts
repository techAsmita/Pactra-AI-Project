import type { VercelRequest, VercelResponse } from '@vercel/node'

interface RequestBody {
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

interface AiAnalysisResult {
  summary: string
  explanationBullets: string[]
  keyRisks: string[]
  opportunities: string[]
}

const GROQ_URL = 'https://api.groq.com/openai/v1/chat/completions'
const MODEL = 'llama-3.3-70b-versatile'

export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (req.method !== 'POST') {
    res.status(405).json({ error: 'Method not allowed' })
    return
  }

  const apiKey = process.env.GROQ_API_KEY
  if (!apiKey) {
    res.status(503).json({ error: 'AI analysis is not configured on this deployment.' })
    return
  }

  const body = req.body as RequestBody
  if (!body?.contractText || body.contractText.trim().length < 100) {
    res.status(400).json({ error: 'Not enough document text to analyze.' })
    return
  }

  const businessContext = [
    body.companyName && `Company: ${body.companyName}`,
    body.industry && `Industry: ${body.industry}`,
    body.fundingStage && `Funding stage: ${body.fundingStage}`,
    body.riskAppetite && `Risk appetite: ${body.riskAppetite}`,
    body.currentGoal && `Current goal: ${body.currentGoal}`,
  ].filter(Boolean).join('\n')

  const prompt = `You are a contract analysis assistant for startup founders. A decision engine has already determined the recommendation below from a separate risk model — your job is ONLY to explain and support that existing recommendation in plain, specific language grounded in the actual contract text. Do NOT propose a different decision.

FOUNDER'S BUSINESS CONTEXT:
${businessContext || 'Not provided.'}

DECISION ALREADY MADE: ${body.decision}
RISK LEVEL: ${body.riskLevel}
CONFIDENCE: ${body.confidence}%

CONTRACT TEXT (may be truncated):
"""
${body.contractText}
"""

Respond with ONLY a JSON object in this exact shape, no other text:
{
  "summary": "2-3 sentence plain-language summary of the contract and why the ${body.decision} recommendation fits, referencing specific real terms from the text",
  "explanationBullets": ["exactly 4 short bullets explaining why this recommendation was made, each grounded in something specific from the contract text or business context"],
  "keyRisks": ["2-4 specific risks found in THIS contract's actual language"],
  "opportunities": ["2-3 specific positive/favorable terms or opportunities found in THIS contract's actual language"]
}`

  try {
    const controller = new AbortController()
    const timeout = setTimeout(() => controller.abort(), 12000)

    const groqRes = await fetch(GROQ_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${apiKey}`,
      },
      body: JSON.stringify({
        model: MODEL,
        messages: [{ role: 'user', content: prompt }],
        response_format: { type: 'json_object' },
        temperature: 0.4,
        max_tokens: 700,
      }),
      signal: controller.signal,
    })
    clearTimeout(timeout)

    if (!groqRes.ok) {
      res.status(502).json({ error: `AI provider error (${groqRes.status})` })
      return
    }

    const data = await groqRes.json()
    const content = data?.choices?.[0]?.message?.content
    if (!content) {
      res.status(502).json({ error: 'No content returned from AI provider.' })
      return
    }

    const parsed = JSON.parse(content) as AiAnalysisResult
    if (!parsed.summary || !Array.isArray(parsed.explanationBullets)) {
      res.status(502).json({ error: 'AI response was not in the expected shape.' })
      return
    }

    res.status(200).json(parsed)
  } catch (err) {
    res.status(500).json({ error: err instanceof Error ? err.message : 'Unknown error' })
  }
}
