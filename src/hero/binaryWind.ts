// "Binary wind": a Rocky Mountain peak drawn on a 2D canvas, with 0s and 1s
// blowing off the summit like wind-driven snow. Lazy-loaded by the Hero.

export interface BinaryWindOptions {
  /** Draw one still frame instead of animating. */
  still: boolean
  wind?: number
  density?: number
  trees?: boolean
}

interface Particle {
  x: number
  y: number
  vx: number
  vy: number
  life: number
  max: number
  glyph: '0' | '1'
  /** Depth layer: 0 far, 1 mid, 2 near. */
  size: 0 | 1 | 2
  seed: number
}

type Point = [number, number]

const MAX_PARTICLES = 1400
const FOREST = '#1F4D36'

/** Small seeded PRNG (mulberry32), so the ridges look the same on every load. */
function rng(seed: number) {
  let a = seed >>> 0
  return () => {
    a = (a + 0x6d2b79f5) >>> 0
    let t = a
    t = Math.imul(t ^ (t >>> 15), t | 1)
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61)
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296
  }
}

/** Turns normalised control points into a jagged ridge line in pixels. */
function ridge(pts: Point[], w: number, h: number, jag: number, seed: number): Point[] {
  const r = rng(seed)
  const out: Point[] = []
  for (let i = 0; i < pts.length - 1; i++) {
    const [x0, y0] = pts[i]
    const [x1, y1] = pts[i + 1]
    const n = 6
    for (let k = 0; k < n; k++) {
      const f = k / n
      const edge = k === 0 ? 0 : 1
      out.push([(x0 + (x1 - x0) * f) * w, (y0 + (y1 - y0) * f) * h + (r() - 0.5) * jag * h * edge])
    }
  }
  const last = pts[pts.length - 1]
  out.push([last[0] * w, last[1] * h])
  return out
}

function ridgePath(c: CanvasRenderingContext2D, pts: Point[], h: number) {
  c.beginPath()
  c.moveTo(pts[0][0], h + 2)
  for (const p of pts) c.lineTo(p[0], p[1])
  c.lineTo(pts[pts.length - 1][0], h + 2)
  c.closePath()
}

function fillRidge(c: CanvasRenderingContext2D, pts: Point[], h: number, fill: string | CanvasGradient) {
  ridgePath(c, pts, h)
  c.fillStyle = fill
  c.fill()
}

/** Starts the scene on `canvas` and returns a function that stops it. */
export function startBinaryWind(canvas: HTMLCanvasElement, options: BinaryWindOptions): () => void {
  const ctx = canvas.getContext('2d')
  if (!ctx) return () => {}

  const windSetting = options.wind ?? 1.2
  const density = options.density ?? 1.6
  const trees = options.trees ?? true

  let w = 0
  let h = 0
  let dpr = 1
  let scale = 1
  let t = 0
  let bg: HTMLCanvasElement | null = null
  let summit: Point[] = []
  let parts: Particle[] = []
  let gust = { x: -9999, y: -9999, s: 0 }
  let raf = 0
  let visible = true

  // Renders the static mountains once per size to an offscreen canvas.
  function layout() {
    w = Math.max(1, canvas.clientWidth)
    h = Math.max(1, canvas.clientHeight)
    dpr = Math.min(2, window.devicePixelRatio || 1)
    canvas.width = Math.round(w * dpr)
    canvas.height = Math.round(h * dpr)
    scale = Math.max(0.6, Math.min(1.25, w / 1200))

    const off = document.createElement('canvas')
    off.width = canvas.width
    off.height = canvas.height
    const c = off.getContext('2d')
    if (!c) return
    c.setTransform(dpr, 0, 0, dpr, 0, 0)

    const sky = c.createLinearGradient(0, 0, 0, h)
    sky.addColorStop(0, '#E3ECDF')
    sky.addColorStop(0.7, '#F1F5EE')
    sky.addColorStop(1, '#F5F7F2')
    c.fillStyle = sky
    c.fillRect(0, 0, w, h)

    const far = ridge([[0, 0.56], [0.09, 0.47], [0.18, 0.53], [0.29, 0.42], [0.4, 0.5], [0.5, 0.44], [0.6, 0.49], [0.76, 0.38], [0.87, 0.47], [1, 0.41]], w, h, 0.025, 11)
    fillRidge(c, far, h, '#D2DFCE')
    const mid = ridge([[0, 0.7], [0.12, 0.58], [0.23, 0.65], [0.35, 0.52], [0.45, 0.6], [0.53, 0.55], [0.8, 0.6], [0.9, 0.52], [1, 0.58]], w, h, 0.03, 23)
    fillRidge(c, mid, h, '#ABC3AA')

    const peakY = 0.16
    const main = ridge([[0, 0.86], [0.14, 0.75], [0.26, 0.8], [0.38, 0.64], [0.46, 0.56], [0.53, 0.44], [0.585, 0.33], [0.625, 0.24], [0.665, peakY], [0.7, 0.23], [0.745, 0.31], [0.8, 0.4], [0.86, 0.47], [0.93, 0.57], [1, 0.62]], w, h, 0.018, 37)
    const body = c.createLinearGradient(0, peakY * h, 0, h)
    body.addColorStop(0, '#5B826A')
    body.addColorStop(1, '#335F47')
    fillRidge(c, main, h, body)

    const pk = main.reduce((a, p) => (p[1] < a[1] ? p : a), main[0])

    // Shaded east face.
    c.save()
    c.beginPath()
    c.moveTo(pk[0], h + 2)
    for (const p of main) c.lineTo(p[0], p[1])
    c.lineTo(w, h + 2)
    c.closePath()
    c.clip()
    c.beginPath()
    c.moveTo(pk[0], pk[1])
    c.lineTo(pk[0] + w * 0.02, h * 0.45)
    c.lineTo(pk[0] - w * 0.03, h + 2)
    c.lineTo(w + 2, h + 2)
    c.lineTo(w + 2, 0)
    c.closePath()
    c.fillStyle = 'rgba(23, 59, 41, 0.38)'
    c.fill()
    c.restore()

    // Snow cap, clipped to the mountain.
    c.save()
    ridgePath(c, main, h)
    c.clip()
    const sr = rng(51)
    c.beginPath()
    c.moveTo(pk[0] - w * 0.2, 0)
    c.lineTo(pk[0] + w * 0.2, 0)
    const steps = 14
    for (let i = 0; i <= steps; i++) {
      const f = i / steps
      const x = pk[0] + w * 0.13 - f * w * 0.26
      const dip = Math.sin(f * Math.PI) * 0.07 + 0.06
      c.lineTo(x, pk[1] + h * dip + (sr() - 0.5) * h * 0.05)
    }
    c.closePath()
    c.fillStyle = '#F7FAF5'
    c.fill()
    c.beginPath()
    c.moveTo(pk[0], pk[1])
    c.lineTo(pk[0] + w * 0.14, pk[1] + h * 0.3)
    c.lineTo(pk[0] + w * 0.2, 0)
    c.closePath()
    c.fillStyle = 'rgba(160, 186, 170, 0.45)'
    c.fill()
    c.restore()

    // Pine-forest foreground.
    const near = ridge([[0, 0.9], [0.18, 0.85], [0.34, 0.89], [0.5, 0.83], [0.66, 0.88], [0.82, 0.84], [1, 0.88]], w, h, 0.015, 71)
    fillRidge(c, near, h, FOREST)
    if (trees) {
      const tr = rng(97)
      c.fillStyle = FOREST
      for (let x = -10; x < w + 10; x += 9 + tr() * 16) {
        const i = Math.min(near.length - 2, Math.max(0, Math.floor((x / w) * (near.length - 1))))
        const y = near[i][1] + 4
        const th = (14 + tr() * 26) * scale
        const tw = th * 0.38
        c.beginPath()
        c.moveTo(x, y - th)
        c.lineTo(x + tw, y)
        c.lineTo(x - tw, y)
        c.closePath()
        c.fill()
      }
    }

    bg = off
    summit = main.filter((p) => p[0] > pk[0] - w * 0.05 && p[0] < pk[0] + w * 0.07)
    if (!summit.length) summit = [pk]
    parts = []
  }

  function spawn() {
    const s = summit[Math.floor(Math.random() * summit.length)]
    const wind = windSetting * scale
    const depth = Math.random()
    parts.push({
      x: s[0] + (Math.random() - 0.5) * 6,
      y: s[1] - Math.random() * 4,
      vx: wind * (0.4 + Math.random() * 0.8),
      vy: -(0.15 + Math.random() * 0.7) * scale,
      life: 0,
      max: 220 + Math.random() * 320,
      glyph: Math.random() < 0.5 ? '0' : '1',
      size: depth < 0.55 ? 0 : depth < 0.88 ? 1 : 2,
      seed: Math.random() * 1000,
    })
  }

  // Advances the particles one frame along a sine flow field.
  function step() {
    t++
    const wind = windSetting * scale
    const rate = density * (w / 1200) * 1.6
    let n = Math.floor(rate) + (Math.random() < rate % 1 ? 1 : 0)
    while (n-- > 0 && parts.length < MAX_PARTICLES) spawn()
    const keep: Particle[] = []
    for (const p of parts) {
      const a = Math.sin(p.x * 0.006 + t * 0.012 + p.seed) + Math.cos(p.y * 0.009 - t * 0.009)
      p.vy += a * 0.018 * scale - 0.0025
      p.vx += (wind * (1 + 0.35 * Math.sin(t * 0.004 + p.seed)) - p.vx) * 0.02
      p.vy *= 0.985
      if (gust.s > 0.02) {
        const dx = p.x - gust.x
        const dy = p.y - gust.y
        const d2 = dx * dx + dy * dy
        if (d2 < 22000) {
          const d = Math.sqrt(d2) || 1
          const f = (1 - d / 148) * gust.s * 1.4
          p.vx += (dx / d) * f + f * 0.4
          p.vy += (dy / d) * f
        }
      }
      p.x += p.vx
      p.y += p.vy
      p.life++
      if (Math.random() < 0.008) p.glyph = p.glyph === '0' ? '1' : '0'
      if (p.life < p.max && p.x < w + 30 && p.y > -30 && p.y < h + 30) keep.push(p)
    }
    parts = keep
    gust.s *= 0.93
  }

  function draw() {
    if (!ctx || !bg) return
    ctx.setTransform(1, 0, 0, 1, 0, 0)
    ctx.drawImage(bg, 0, 0)
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0)
    const sizes = [10, 12.5, 16].map((s) => s * scale)
    ctx.textAlign = 'center'
    ctx.textBaseline = 'middle'
    ctx.lineWidth = 1
    for (let b = 0; b < 3; b++) {
      ctx.font = `${b === 2 ? 500 : 400} ${sizes[b].toFixed(1)}px "JetBrains Mono", ui-monospace, monospace`
      for (const p of parts) {
        if (p.size !== b) continue
        const k = p.life / p.max
        const alpha = Math.pow(Math.sin(Math.PI * k), 0.7) * (b === 0 ? 0.45 : b === 1 ? 0.7 : 0.9)
        if (alpha < 0.02) continue
        // A faint streak behind each glyph.
        ctx.strokeStyle = `rgba(31, 77, 54, ${(alpha * 0.22).toFixed(3)})`
        ctx.beginPath()
        ctx.moveTo(p.x - p.vx * 7, p.y - p.vy * 7)
        ctx.lineTo(p.x - p.vx * 1.5, p.y - p.vy * 1.5)
        ctx.stroke()
        ctx.fillStyle = `rgba(23, 59, 41, ${alpha.toFixed(3)})`
        ctx.fillText(p.glyph, p.x, p.y)
      }
    }
  }

  // With reduced motion, run the simulation ahead and show one settled frame.
  function drawStill() {
    layout()
    for (let i = 0; i < 500; i++) step()
    draw()
  }

  function loop() {
    step()
    draw()
    raf = requestAnimationFrame(loop)
  }

  function play() {
    if (!raf && visible && !document.hidden) raf = requestAnimationFrame(loop)
  }

  function pause() {
    cancelAnimationFrame(raf)
    raf = 0
  }

  function onMove(e: PointerEvent) {
    const r = canvas.getBoundingClientRect()
    gust = { x: e.clientX - r.left, y: e.clientY - r.top, s: 1 }
  }

  function onVisibility() {
    if (document.hidden) pause()
    else play()
  }

  const resize = new ResizeObserver(() => (options.still ? drawStill() : layout()))
  resize.observe(canvas)

  if (options.still) {
    drawStill()
    // The glyphs use a web font; redraw once it has loaded.
    void document.fonts?.ready.then(drawStill)
    return () => resize.disconnect()
  }

  layout()
  // Only animate while the hero is on screen and the tab is visible.
  const io = new IntersectionObserver(([entry]) => {
    visible = entry.isIntersecting
    if (visible) play()
    else pause()
  })
  io.observe(canvas)
  canvas.addEventListener('pointermove', onMove)
  document.addEventListener('visibilitychange', onVisibility)
  play()

  return () => {
    pause()
    resize.disconnect()
    io.disconnect()
    canvas.removeEventListener('pointermove', onMove)
    document.removeEventListener('visibilitychange', onVisibility)
  }
}
