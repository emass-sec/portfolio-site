import { useEffect, useRef } from 'react'
import { useReducedMotion } from '../hooks/useReducedMotion'
import { type BlockPattern, type Pattern, blockPatterns } from './blockPatterns'

interface BlockMatrixProps {
  pattern: BlockPattern
  /** Light blocks on a dark card, or forest blocks on a light one. */
  tone: 'light' | 'dark'
  cols?: number
  rows?: number
  className?: string
}

const tones = {
  light: { off: [17, 36, 26, 0.07], on: [31, 77, 54] },
  dark: { off: [255, 255, 255, 0.08], on: [143, 220, 174] },
} as const

/** The frame shown when motion is reduced: a moment where every pattern reads well. */
const STILL_TIME = 1.1
const FRAME_MS = 1000 / 30

/**
 * A grid of small squares that light up in a looping pattern. Drawn on a canvas, at 30fps, and
 * only while it is on screen.
 */
export function BlockMatrix({ pattern, tone, cols = 12, rows = 6, className = '' }: BlockMatrixProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const still = useReducedMotion()

  useEffect(() => {
    const canvas = canvasRef.current
    const ctx = canvas?.getContext('2d')
    if (!canvas || !ctx) return
    const fn: Pattern = blockPatterns[pattern]
    const { off, on } = tones[tone]
    let cell = 0
    let gap = 0

    const resize = () => {
      const dpr = Math.min(window.devicePixelRatio || 1, 2)
      const width = canvas.clientWidth
      cell = width / cols
      gap = Math.max(1.5, cell * 0.2)
      canvas.width = Math.round(width * dpr)
      canvas.height = Math.round(cell * rows * dpr)
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0)
    }

    const draw = (t: number) => {
      ctx.clearRect(0, 0, canvas.width, canvas.height)
      const size = cell - gap
      const radius = Math.min(2.5, size * 0.22)
      for (let r = 0; r < rows; r++) {
        for (let c = 0; c < cols; c++) {
          const v = fn(c / (cols - 1), r / (rows - 1), t)
          const x = c * cell + gap / 2
          const y = r * cell + gap / 2
          ctx.fillStyle = `rgb(${off[0]} ${off[1]} ${off[2]} / ${off[3]})`
          ctx.beginPath()
          ctx.roundRect(x, y, size, size, radius)
          ctx.fill()
          if (v > 0.02) {
            ctx.fillStyle = `rgb(${on[0]} ${on[1]} ${on[2]} / ${(v * 0.95).toFixed(3)})`
            ctx.fill()
          }
        }
      }
    }

    resize()
    draw(STILL_TIME)
    const resizer = new ResizeObserver(() => {
      resize()
      draw(still ? STILL_TIME : performance.now() / 1000)
    })
    resizer.observe(canvas)
    if (still) return () => resizer.disconnect()

    let frame = 0
    let last = 0
    const tick = (now: number) => {
      frame = requestAnimationFrame(tick)
      if (now - last < FRAME_MS) return
      last = now
      draw(now / 1000)
    }
    const visibility = new IntersectionObserver(([entry]) => {
      cancelAnimationFrame(frame)
      if (entry.isIntersecting) frame = requestAnimationFrame(tick)
    })
    visibility.observe(canvas)

    return () => {
      cancelAnimationFrame(frame)
      visibility.disconnect()
      resizer.disconnect()
    }
  }, [pattern, tone, cols, rows, still])

  return (
    <canvas
      ref={canvasRef}
      aria-hidden="true"
      className={`block w-full ${className}`}
      style={{ aspectRatio: `${cols} / ${rows}` }}
    />
  )
}
