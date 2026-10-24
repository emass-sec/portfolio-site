// Point clouds the hero particles settle into. Each builder places exactly
// `count` points and gives every point a short resting dash and a glow (how
// close to white it burns). World units: the shapes fit in roughly ±1.8 by ±1.1.

export type HeroShape = 'range' | 'shield' | 'magnifier' | 'globe'

export interface ShapeCloud {
  /** Rest positions, xyz per point. */
  pos: Float32Array
  /** Each point's resting dash, from tail to head, xyz per point. */
  dash: Float32Array
  /** 0 draws the point green, 1 draws it white. */
  glow: Float32Array
}

/** Small seeded PRNG (mulberry32), so every shape looks the same on every load. */
export function rng(seed: number) {
  let a = seed >>> 0
  return () => {
    a = (a + 0x6d2b79f5) >>> 0
    let t = a
    t = Math.imul(t ^ (t >>> 15), t | 1)
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61)
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296
  }
}

/** Seeded 2D value noise on a 64×64 lattice, roughly 0..1. */
function valueNoise(seed: number) {
  const r = rng(seed)
  const size = 64
  const grid = Float32Array.from({ length: size * size }, r)
  const at = (x: number, y: number) => grid[(((y % size) + size) % size) * size + (((x % size) + size) % size)]
  const smooth = (t: number) => t * t * (3 - 2 * t)
  return (x: number, y: number) => {
    const x0 = Math.floor(x)
    const y0 = Math.floor(y)
    const fx = smooth(x - x0)
    const fy = smooth(y - y0)
    const a = at(x0, y0) + (at(x0 + 1, y0) - at(x0, y0)) * fx
    const b = at(x0, y0 + 1) + (at(x0 + 1, y0 + 1) - at(x0, y0 + 1)) * fx
    return a + (b - a) * fy
  }
}

const smoothstep = (a: number, b: number, x: number) => {
  const t = Math.min(1, Math.max(0, (x - a) / (b - a)))
  return t * t * (3 - 2 * t)
}

/** Writes points into a cloud, normalising each dash to the given length. */
function writer(count: number) {
  const cloud: ShapeCloud = {
    pos: new Float32Array(count * 3),
    dash: new Float32Array(count * 3),
    glow: new Float32Array(count),
  }
  let i = 0
  const put = (x: number, y: number, z: number, dx: number, dy: number, dz: number, len: number, glow: number) => {
    if (i >= count) return
    const k = len / (Math.hypot(dx, dy, dz) || 1)
    cloud.pos.set([x, y, z], i * 3)
    cloud.dash.set([dx * k, dy * k, dz * k], i * 3)
    cloud.glow[i] = Math.min(1, Math.max(0, glow))
    i++
  }
  return { cloud, put, filled: () => i }
}

/** Splits `count` into parts by weight, with the remainder on the last part. */
function split(count: number, weights: number[]) {
  const total = weights.reduce((a, b) => a + b, 0)
  const parts = weights.map((w) => Math.floor((count * w) / total))
  parts[parts.length - 1] += count - parts.reduce((a, b) => a + b, 0)
  return parts
}

/* ------------------------------------------------------------------ range */

// The Front Range seen from the plains, with Pikes Peak as the broad, tallest
// massif. [x, z, height, x spread, back spread, front spread]; +z faces the
// viewer, so south is on the left.
const PEAKS: [number, number, number, number, number, number][] = [
  [0.1, -0.06, 1.0, 0.5, 0.5, 0.36], // Pikes Peak
  [-0.62, -0.02, 0.5, 0.28, 0.36, 0.3], // Almagre Mountain
  [-1.1, -0.14, 0.4, 0.3, 0.34, 0.3], // Mount Rosa ridge
  [-1.52, -0.02, 0.28, 0.3, 0.3, 0.28],
  [0.7, -0.22, 0.5, 0.24, 0.3, 0.28], // Devils Playground
  [1.16, -0.06, 0.36, 0.3, 0.34, 0.3], // Rampart Range
  [1.56, -0.26, 0.3, 0.3, 0.3, 0.3],
  [-0.5, 0.44, 0.24, 0.3, 0.2, 0.16], // Cheyenne Mountain
  [0.46, 0.46, 0.16, 0.26, 0.2, 0.15], // foothills
  [1.04, 0.44, 0.14, 0.3, 0.2, 0.15],
  [-0.3, -0.62, 0.3, 0.5, 0.2, 0.26], // ranges behind
  [0.98, -0.64, 0.28, 0.46, 0.2, 0.26],
]
const RANGE_X = 1.78
const RANGE_Z = 0.8
const RANGE_HEIGHT = 0.95

function rangeHeight(noise: (x: number, y: number) => number, x: number, z: number) {
  // Smooth maximum of the peaks, so their ridges flow into each other.
  let sum = Math.exp(12 * 0.1 * Math.exp(-(z * z) / 0.2))
  for (const [px, pz, ph, sx, sb, sf] of PEAKS) {
    const dx = (x - px) / sx
    const dz = (z - pz) / (z > pz ? sf : sb)
    sum += Math.exp(12 * ph * Math.exp(-(dx * dx + dz * dz)))
  }
  // Each flat term adds exp(0) = 1; take those back off so the plains sit at 0.
  let h = Math.log(Math.max(1, sum - PEAKS.length)) / 12
  // Pikes Peak's broad summit: flatten the very top.
  h = h > 0.93 ? 0.93 + (h - 0.93) * 0.35 : h
  // Ridged noise for rock and erosion, and long gullies running down the faces.
  let ridged = 0
  let amp = 0.5
  let freq = 2.6
  for (let o = 0; o < 4; o++) {
    const n = 1 - Math.abs(noise(x * freq + 11, z * freq + 5) * 2 - 1)
    ridged += n * n * amp
    amp *= 0.5
    freq *= 2.1
  }
  const gully = noise(x * 9 + 3, z * 2.4 + 17) - 0.5
  h = h * (0.78 + ridged * 0.42) + gully * 0.1 * h * h + ridged * 0.025
  // Fade out at the edges of the block.
  return h * smoothstep(RANGE_X, RANGE_X - 0.3, Math.abs(x)) * smoothstep(RANGE_Z, RANGE_Z - 0.25, Math.abs(z))
}

function buildRange(count: number): ShapeCloud {
  const r = rng(14115)
  const noise = valueNoise(37)
  const { cloud, put, filled } = writer(count)
  let maxH = 0
  for (let x = -RANGE_X; x <= RANGE_X; x += 0.02) {
    for (let z = -RANGE_Z; z <= RANGE_Z; z += 0.02) maxH = Math.max(maxH, rangeHeight(noise, x, z))
  }
  const height = (x: number, z: number) => rangeHeight(noise, x, z) / maxH
  const e = 0.006
  while (filled() < count) {
    const x = (r() * 2 - 1) * RANGE_X
    const z = (r() * 2 - 1) * RANGE_Z
    const h = height(x, z)
    const gx = ((height(x + e, z) - height(x - e, z)) / (2 * e)) * RANGE_HEIGHT
    const gz = ((height(x, z + e) - height(x, z - e)) / (2 * e)) * RANGE_HEIGHT
    const slope = Math.hypot(gx, gz)
    // Keep the plains sparse and the peaks and steep faces dense.
    if (r() > 0.12 + h * 0.6 + Math.min(1, slope) * 0.35) continue
    // Dashes run downhill, like snowmelt; flat ground gets a random heading.
    let dx = -gx
    let dz = -gz
    let dy = -(gx * gx + gz * gz)
    if (slope < 0.08) {
      const a = r() * Math.PI * 2
      dx = Math.cos(a)
      dz = Math.sin(a)
      dy = 0
    }
    const snow = smoothstep(0.5, 0.8, h + (r() - 0.5) * 0.12)
    put(x, h * RANGE_HEIGHT - 0.42, z, dx, dy, dz, 0.022 + r() * 0.016, snow + r() * 0.06)
  }
  return cloud
}

/* ----------------------------------------------------------------- shield */

// The MasNet logo shield (Logo.tsx), traced from its 32×36 SVG viewBox.
function shieldOutline(): [number, number][] {
  const pts: [number, number][] = [
    [16, 1.5],
    [29.5, 6.5],
    [29.5, 17],
  ]
  // c0 8.6 -5.6 14.6 -13.5 17.5, from (29.5, 17).
  const bez = (t: number, a: number, b: number, c: number, d: number) =>
    (1 - t) ** 3 * a + 3 * (1 - t) ** 2 * t * b + 3 * (1 - t) * t * t * c + t ** 3 * d
  for (let k = 1; k <= 16; k++) {
    const t = k / 16
    pts.push([bez(t, 29.5, 29.5, 23.9, 16), bez(t, 17, 25.6, 31.6, 34.5)])
  }
  for (let k = pts.length - 2; k >= 1; k--) pts.push([32 - pts[k][0], pts[k][1]])
  return pts
}

function buildShield(count: number): ShapeCloud {
  const r = rng(36)
  const { cloud, put } = writer(count)
  const toX = (sx: number) => ((sx - 16) / 13.5) * 0.82
  const toY = (sy: number) => ((17.6 - sy) / 16.5) * 1.06
  const bulge = (x: number, y: number) => 0.24 * (1 - (x / 0.82) ** 2) - 0.06 * y * y - 0.08
  const outline = shieldOutline()
  const inside = (sx: number, sy: number) => {
    let hit = false
    for (let a = 0, b = outline.length - 1; a < outline.length; b = a++) {
      const [ax, ay] = outline[a]
      const [bx, by] = outline[b]
      if (ay > sy !== by > sy && sx < ((bx - ax) * (sy - ay)) / (by - ay) + ax) hit = !hit
    }
    return hit
  }
  // Perimeter lengths, for even spacing along the rim.
  const seg = outline.map((p, k) => {
    const q = outline[(k + 1) % outline.length]
    return Math.hypot(q[0] - p[0], q[1] - p[1])
  })
  const perimeter = seg.reduce((a, b) => a + b, 0)
  const [face, rim, slashA, slashB] = split(count, [50, 22, 18, 10])

  for (let n = 0; n < face; ) {
    const sx = 2.5 + r() * 27
    const sy = 1.5 + r() * 33
    if (!inside(sx, sy)) continue
    const x = toX(sx)
    const y = toY(sy)
    // Dashes stand out of the face along its normal, like fur.
    put(x, y, bulge(x, y), (0.48 * x) / 0.67, 0.12 * y, 1, 0.026 + r() * 0.012, r() * 0.12)
    n++
  }
  for (let n = 0; n < rim; n++) {
    let d = r() * perimeter
    let k = 0
    while (d > seg[k]) d -= seg[k++]
    const p = outline[k]
    const q = outline[(k + 1) % outline.length]
    const f = d / seg[k]
    const x = toX(p[0] + (q[0] - p[0]) * f)
    const y = toY(p[1] + (q[1] - p[1]) * f)
    const z = bulge(x, y) + (r() - 0.5) * 0.12
    // Outward normal of this edge, in world space.
    put(x, y, z, q[1] - p[1], q[0] - p[0], 0, 0.03 + r() * 0.01, 0.45 + r() * 0.2)
  }
  // The two slashes across the logo.
  const slash = (n: number, x0: number, y0: number, x1: number, y1: number, width: number, glow: number) => {
    for (let k = 0; k < n; k++) {
      const t = r()
      const off = (r() - 0.5) * width
      const len = Math.hypot(x1 - x0, y1 - y0)
      const sx = x0 + (x1 - x0) * t + (-(y1 - y0) / len) * off
      const sy = y0 + (y1 - y0) * t + ((x1 - x0) / len) * off
      const x = toX(sx)
      const y = toY(sy)
      put(x, y, bulge(x, y) + 0.03, toX(x1) - toX(x0), toY(y1) - toY(y0), 0, 0.03, glow + r() * 0.1)
    }
  }
  slash(slashA, 5, 25, 27, 11.5, 3.2, 0.85)
  slash(slashB, 10, 28.5, 28.5, 17, 2, 0.6)
  return cloud
}

/* -------------------------------------------------------------- magnifier */

function buildMagnifier(count: number): ShapeCloud {
  const r = rng(404)
  const { cloud, put } = writer(count)
  const cx = -0.26
  const cy = 0.3
  const R = 0.62
  const tube = 0.085
  const [ring, handle, collar, lens, glare] = split(count, [40, 24, 6, 22, 8])
  for (let n = 0; n < ring; n++) {
    const u = r() * Math.PI * 2
    const v = r() * Math.PI * 2
    const nx = Math.cos(v) * Math.cos(u)
    const ny = Math.cos(v) * Math.sin(u)
    const nz = Math.sin(v)
    put(cx + (R + tube * Math.cos(v)) * Math.cos(u), cy + (R + tube * Math.cos(v)) * Math.sin(u), tube * nz, nx, ny, nz, 0.028, 0.25 + Math.max(0, nz) * 0.4)
  }
  // The handle leaves the ring at the lower right.
  const ax = Math.SQRT1_2
  const ay = -Math.SQRT1_2
  const sx = cx + (R + tube) * ax
  const sy = cy + (R + tube) * ay
  const tube3 = (n: number, from: number, to: number, radius: (t: number) => number, glow: number) => {
    for (let k = 0; k < n; k++) {
      const t = from + r() * (to - from)
      const a = r() * Math.PI * 2
      const rad = radius(t)
      // Perpendiculars to the handle axis: (-ay, ax, 0) and (0, 0, 1).
      const nx = -ay * Math.cos(a)
      const ny = ax * Math.cos(a)
      const nz = Math.sin(a)
      put(sx + ax * t + nx * rad, sy + ay * t + ny * rad, nz * rad, nx, ny, nz, 0.028, glow + r() * 0.1)
    }
  }
  tube3(handle, 0.12, 0.95, (t) => 0.1 + t * 0.025, 0.12)
  tube3(collar, 0, 0.12, () => 0.125, 0.55)
  for (let n = 0; n < lens; ) {
    const x = (r() * 2 - 1) * R
    const y = (r() * 2 - 1) * R
    const d2 = (x * x + y * y) / ((R - 0.07) * (R - 0.07))
    if (d2 > 1) continue
    const side = r() < 0.5 ? -1 : 1
    put(cx + x, cy + y, side * 0.05 * (1 - d2), x, y, side * 2, 0.018, 0.04)
    n++
  }
  // A curved glint across the glass.
  for (let n = 0; n < glare; n++) {
    const a = Math.PI * (0.58 + r() * 0.3)
    const rad = R * (0.62 + (r() - 0.5) * 0.08)
    put(cx + Math.cos(a) * rad, cy + Math.sin(a) * rad, 0.05, -Math.sin(a), Math.cos(a), 0, 0.03, 0.95)
  }
  return cloud
}

/* ------------------------------------------------------------------ globe */

function buildGlobe(count: number): ShapeCloud {
  const r = rng(2026)
  const { cloud, put } = writer(count)
  const R = 0.82
  const [grid, surface, orbits, nodes] = split(count, [52, 14, 28, 6])
  const lats = [-60, -36, -12, 12, 36, 60].map((d) => (d * Math.PI) / 180)
  for (let n = 0; n < grid; n++) {
    const jitter = (r() - 0.5) * 0.02
    if (r() < 0.5) {
      // A latitude line; the dash follows it east.
      const lat = lats[Math.floor(r() * lats.length)] + jitter
      const lon = r() * Math.PI * 2
      put(R * Math.cos(lat) * Math.cos(lon), R * Math.sin(lat), R * Math.cos(lat) * Math.sin(lon), -Math.sin(lon), 0, Math.cos(lon), 0.03, 0.15 + r() * 0.1)
    } else {
      // A meridian; the dash follows it north.
      const lon = (Math.floor(r() * 12) / 12) * Math.PI * 2 + jitter
      const lat = (r() - 0.5) * Math.PI
      put(R * Math.cos(lat) * Math.cos(lon), R * Math.sin(lat), R * Math.cos(lat) * Math.sin(lon), -Math.sin(lat) * Math.cos(lon), Math.cos(lat), -Math.sin(lat) * Math.sin(lon), 0.03, 0.1 + r() * 0.1)
    }
  }
  for (let n = 0; n < surface; n++) {
    const y = r() * 2 - 1
    const a = r() * Math.PI * 2
    const s = Math.sqrt(1 - y * y)
    put(R * s * Math.cos(a), R * y, R * s * Math.sin(a), s * Math.cos(a), y, s * Math.sin(a), 0.02, r() * 0.08)
  }
  // Two tilted orbits, with a few bright nodes riding them.
  const rings = [
    { radius: 1.18, tilt: 1.15, turn: 0.35 },
    { radius: 1.04, tilt: -1.0, turn: -0.5 },
  ]
  const onRing = (ring: (typeof rings)[number], a: number) => {
    const x = Math.cos(a) * ring.radius
    const z0 = Math.sin(a) * ring.radius
    const y = z0 * Math.sin(ring.tilt)
    const z = z0 * Math.cos(ring.tilt)
    const tx = -Math.sin(a)
    const tz0 = Math.cos(a)
    const c = Math.cos(ring.turn)
    const s = Math.sin(ring.turn)
    return {
      p: [x * c - y * s, x * s + y * c, z] as const,
      t: [tx * c - tz0 * Math.sin(ring.tilt) * s, tx * s + tz0 * Math.sin(ring.tilt) * c, tz0 * Math.cos(ring.tilt)] as const,
    }
  }
  for (let n = 0; n < orbits; n++) {
    const { p, t } = onRing(rings[n % 2], r() * Math.PI * 2)
    put(p[0] + (r() - 0.5) * 0.02, p[1] + (r() - 0.5) * 0.02, p[2], t[0], t[1], t[2], 0.034, 0.4 + r() * 0.2)
  }
  const anchors = [0.4, 2.1, 3.9, 5.2].map((a, k) => onRing(rings[k % 2], a).p)
  for (let n = 0; n < nodes; n++) {
    const [x, y, z] = anchors[n % anchors.length]
    const dx = r() - 0.5
    const dy = r() - 0.5
    const dz = r() - 0.5
    const k = (0.05 * Math.cbrt(r())) / (Math.hypot(dx, dy, dz) || 1)
    put(x + dx * k, y + dy * k, z + dz * k, dx, dy, dz, 0.016, 0.9)
  }
  return cloud
}

const builders: Record<HeroShape, (count: number) => ShapeCloud> = {
  range: buildRange,
  shield: buildShield,
  magnifier: buildMagnifier,
  globe: buildGlobe,
}

export function buildShape(shape: HeroShape, count: number): ShapeCloud {
  return builders[shape](count)
}
