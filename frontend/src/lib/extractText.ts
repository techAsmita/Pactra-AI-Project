import * as pdfjsLib from 'pdfjs-dist'
import mammoth from 'mammoth'

// Vite-friendly worker setup — bundles the worker file and gives pdf.js a
// real URL to it, rather than relying on a CDN or manual public/ copy.
pdfjsLib.GlobalWorkerOptions.workerSrc = new URL(
  'pdfjs-dist/build/pdf.worker.mjs',
  import.meta.url,
).toString()

const MAX_CHARS = 12000 // keep prompt size sane and fast regardless of document length

async function extractFromPdf(file: File): Promise<string> {
  const buffer = await file.arrayBuffer()
  const pdf = await pdfjsLib.getDocument({ data: buffer }).promise
  let text = ''
  const pageCount = Math.min(pdf.numPages, 20) // cap pages for very long documents
  for (let i = 1; i <= pageCount; i++) {
    const page = await pdf.getPage(i)
    const content = await page.getTextContent()
    text += content.items.map((item: any) => ('str' in item ? item.str : '')).join(' ') + '\n\n'
    if (text.length > MAX_CHARS) break
  }
  return text.slice(0, MAX_CHARS)
}

async function extractFromDocx(file: File): Promise<string> {
  const buffer = await file.arrayBuffer()
  const result = await mammoth.extractRawText({ arrayBuffer: buffer })
  return result.value.slice(0, MAX_CHARS)
}

async function extractFromText(file: File): Promise<string> {
  const text = await file.text()
  return text.slice(0, MAX_CHARS)
}

/**
 * Extracts plain text from an uploaded contract file for real AI analysis.
 * Returns an empty string (never throws) if extraction fails — callers
 * should treat that as "fall back to simulated analysis," not an error.
 */
export async function extractTextFromFile(file: File): Promise<string> {
  try {
    const name = file.name.toLowerCase()
    if (name.endsWith('.pdf')) return await extractFromPdf(file)
    if (name.endsWith('.docx')) return await extractFromDocx(file)
    if (name.endsWith('.txt')) return await extractFromText(file)
    return ''
  } catch {
    // Scanned/image-only PDFs, corrupt files, unsupported encodings, etc.
    // Silently fall back — the simulated analysis pipeline still works fine.
    return ''
  }
}
