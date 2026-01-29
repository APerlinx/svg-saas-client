import { logger } from '../services/logger'

function parseSvgSize(svgText: string): { width: number; height: number } {
  try {
    const doc = new DOMParser().parseFromString(svgText, 'image/svg+xml')
    const svg = doc.querySelector('svg')
    if (!svg) return { width: 512, height: 512 }

    const widthAttr = svg.getAttribute('width')
    const heightAttr = svg.getAttribute('height')
    const viewBox = svg.getAttribute('viewBox')

    const parseNumber = (v: string | null): number | null => {
      if (!v) return null
      const m = v.match(/[0-9.]+/)
      if (!m) return null
      const n = Number(m[0])
      return Number.isFinite(n) ? n : null
    }

    const w = parseNumber(widthAttr)
    const h = parseNumber(heightAttr)
    if (w && h) return { width: w, height: h }

    if (viewBox) {
      const parts = viewBox.split(/\s+/).map((p) => Number(p))
      if (parts.length === 4 && parts.every((n) => Number.isFinite(n))) {
        const vbW = parts[2]
        const vbH = parts[3]
        if (vbW > 0 && vbH > 0) return { width: vbW, height: vbH }
      }
    }

    return { width: 512, height: 512 }
  } catch {
    return { width: 512, height: 512 }
  }
}

export function downloadBlob(blob: Blob, filename: string) {
  const objectUrl = URL.createObjectURL(blob)
  const link = document.createElement('a')
  link.href = objectUrl
  link.download = filename
  document.body.appendChild(link)
  link.click()
  document.body.removeChild(link)
  window.setTimeout(() => URL.revokeObjectURL(objectUrl), 1000)
}

export async function svgTextToPngBlob(svgText: string): Promise<Blob> {
  const { width, height } = parseSvgSize(svgText)
  const canvasW = Math.min(Math.max(Math.round(width), 64), 2048)
  const canvasH = Math.min(Math.max(Math.round(height), 64), 2048)

  const blob = new Blob([svgText], { type: 'image/svg+xml' })
  const url = URL.createObjectURL(blob)

  try {
    const img = new Image()
    img.decoding = 'async'

    await new Promise<void>((resolve, reject) => {
      img.onload = () => resolve()
      img.onerror = () => reject(new Error('Failed to load SVG into image'))
      img.src = url
    })

    const canvas = document.createElement('canvas')
    canvas.width = canvasW
    canvas.height = canvasH

    const ctx = canvas.getContext('2d')
    if (!ctx) throw new Error('Canvas not supported')

    ctx.clearRect(0, 0, canvasW, canvasH)
    ctx.drawImage(img, 0, 0, canvasW, canvasH)

    const out = await new Promise<Blob>((resolve, reject) => {
      canvas.toBlob((b) => {
        if (!b) reject(new Error('Failed to create PNG blob'))
        else resolve(b)
      }, 'image/png')
    })

    return out
  } catch (err) {
    logger.error('Failed to convert SVG to PNG', err)
    throw err
  } finally {
    URL.revokeObjectURL(url)
  }
}
