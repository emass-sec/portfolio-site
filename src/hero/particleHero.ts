// The hero's particle scene: a few thousand glowing dashes that settle into a
// 3D shape, starting with the Front Range around Pikes Peak. The cursor stirs
// the dashes and burns them white; a click (or the label button) sends them
// flying into the next shape. Drawn with raw WebGL, no 3D library, and
// lazy-loaded by the Hero.

import { buildShape, rng, type HeroShape, type ShapeCloud } from './shapes'

export interface ParticleHeroOptions {
  /** The shapes to cycle through, first one shown on load. */
  shapes: HeroShape[]
  /** Draw still frames only: no drift, no cursor effects, instant morphs. */
  still: boolean
  /** A "click to morph" bubble that follows the pointer over the canvas. */
  cursor?: HTMLElement | null
  onShapeChange?: (index: number) => void
}

export interface ParticleHero {
  /** Morph into the next shape. */
  next(): void
  stop(): void
}

const FOV = (34 * Math.PI) / 180
const TAN = Math.tan(FOV / 2)
/** How far each shape sways from facing the viewer, in radians. */
const SWAY: Record<HeroShape, number> = { range: 0.3, shield: 0.45, magnifier: 0.5, globe: 0 }
/** Radius of the cursor's reach, in world units. */
const REACH = 0.3

const PARTICLE_VS = `
attribute vec3 aPos;
attribute vec3 aDash;
attribute vec2 aInfo;
uniform mat4 uMvp;
uniform vec2 uHalf;
uniform float uThick;
uniform float uMaxSize;
uniform vec2 uDepth;
varying vec2 vSeg;
varying float vSize;
varying float vGlow;
varying float vAlpha;
void main() {
  vec4 head = uMvp * vec4(aPos, 1.0);
  vec4 tail = uMvp * vec4(aPos - aDash, 1.0);
  vec2 sh = head.xy / head.w * uHalf;
  vec2 seg = sh - tail.xy / tail.w * uHalf;
  float len = length(seg);
  float room = uMaxSize - uThick * 2.0 - 2.0;
  if (len > room) seg *= room / len;
  vec2 mid = sh - seg * 0.5;
  float size = length(seg) + uThick * 2.0 + 2.0;
  gl_Position = vec4(mid / uHalf * head.w, head.z, head.w);
  gl_PointSize = size;
  vSeg = vec2(seg.x, -seg.y) * 0.5;
  vSize = size;
  vGlow = aInfo.x;
  float far = clamp((head.w - uDepth.x) / uDepth.y, 0.0, 1.0);
  vAlpha = (0.6 + 0.4 * aInfo.y) * mix(1.0, 0.3, far);
}`

const PARTICLE_FS = `
precision mediump float;
uniform vec3 uColor;
uniform vec3 uHot;
uniform float uLine;
varying vec2 vSeg;
varying float vSize;
varying float vGlow;
varying float vAlpha;
void main() {
  vec2 p = (gl_PointCoord - 0.5) * vSize;
  vec2 ab = vSeg * 2.0;
  vec2 ap = p + vSeg;
  float h = clamp(dot(ap, ab) / max(dot(ab, ab), 0.0001), 0.0, 1.0);
  float d = length(ap - ab * h);
  float core = 1.0 - smoothstep(uLine * 0.5 - 0.5, uLine * 0.5 + 0.8, d);
  if (core <= 0.0) discard;
  vec3 col = mix(uColor, uHot, vGlow);
  gl_FragColor = vec4(col * core * mix(0.35, 1.0, h) * vAlpha, 1.0);
}`

// A full-screen triangle with the dark backdrop and its green haze.
const BACKDROP_VS = `
attribute vec2 aCorner;
void main() { gl_Position = vec4(aCorner, 0.0, 1.0); }`

const BACKDROP_FS = `
precision mediump float;
uniform vec2 uRes;
void main() {
  vec2 uv = gl_FragCoord.xy / uRes;
  vec2 d = (uv - vec2(0.5, 0.5)) * vec2(uRes.x / uRes.y, 1.0);
  float haze = exp(-dot(d, d) * 3.2);
  vec3 col = vec3(0.035, 0.082, 0.058) + vec3(0.07, 0.24, 0.14) * haze;
  col *= 1.0 - 0.35 * smoothstep(0.45, 1.1, length((uv - 0.5) * 2.0));
  gl_FragColor = vec4(col, 1.0);
}`

function compile(gl: WebGLRenderingContext, vs: string, fs: string) {
  const program = gl.createProgram()
  for (const [type, src] of [
    [gl.VERTEX_SHADER, vs],
    [gl.FRAGMENT_SHADER, fs],
  ] as const) {
    const shader = gl.createShader(type)
    if (!shader || !program) return null
    gl.shaderSource(shader, src)
    gl.compileShader(shader)
    gl.attachShader(program, shader)
  }
  if (!program) return null
  gl.linkProgram(program)
  return gl.getProgramParameter(program, gl.LINK_STATUS) ? program : null
}

/** Shortest signed difference between two angles. */
const wrap = (a: number) => Math.atan2(Math.sin(a), Math.cos(a))

/** Starts the scene on `canvas`. Without WebGL it returns a no-op. */
export function startParticleHero(canvas: HTMLCanvasElement, options: ParticleHeroOptions): ParticleHero {
  const noop = { next() {}, stop() {} }
  const gl = canvas.getContext('webgl', { alpha: false, antialias: false, depth: false, powerPreference: 'low-power' })
  if (!gl || !options.shapes.length) return noop
  const particles = compile(gl, PARTICLE_VS, PARTICLE_FS)
  const backdrop = compile(gl, BACKDROP_VS, BACKDROP_FS)
  if (!particles || !backdrop) return noop

  const { still, cursor, onShapeChange } = options
  const count = canvas.clientWidth < 640 ? 5200 : 9000
  const clouds = new Map<HeroShape, ShapeCloud>()
  const cloudFor = (shape: HeroShape) => {
    let cloud = clouds.get(shape)
    if (!cloud) clouds.set(shape, (cloud = buildShape(shape, count)))
    return cloud
  }

  // Live state per particle.
  const pos = new Float32Array(count * 3)
  const vel = new Float32Array(count * 3)
  const heat = new Float32Array(count)
  const delay = new Float32Array(count)
  const sparkle = new Float32Array(count)
  const random = rng(7)
  for (let i = 0; i < count; i++) sparkle[i] = random()
  // Interleaved for the GPU: head xyz, dash xyz, glow, sparkle.
  const STRIDE = 8
  const data = new Float32Array(count * STRIDE)

  let shapeIndex = 0
  let target = cloudFor(options.shapes[0])
  if (still) {
    pos.set(target.pos)
  } else {
    // Start as a loose cloud that gathers into the range.
    for (let i = 0; i < count; i++) {
      const a = random() * Math.PI * 2
      const y = random() * 2 - 1
      const rad = 1.6 + random() * 1.4
      const s = Math.sqrt(1 - y * y)
      pos.set([Math.cos(a) * s * rad * 1.4, y * rad * 0.7, Math.sin(a) * s * rad], i * 3)
      delay[i] = random() * 0.6
    }
  }

  // GPU buffers.
  const particleBuffer = gl.createBuffer()
  const cornerBuffer = gl.createBuffer()
  gl.bindBuffer(gl.ARRAY_BUFFER, cornerBuffer)
  gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([-1, -1, 3, -1, -1, 3]), gl.STATIC_DRAW)
  gl.bindBuffer(gl.ARRAY_BUFFER, particleBuffer)
  gl.bufferData(gl.ARRAY_BUFFER, data.byteLength, gl.DYNAMIC_DRAW)
  const pointRange = gl.getParameter(gl.ALIASED_POINT_SIZE_RANGE) as Float32Array
  const loc = {
    pos: gl.getAttribLocation(particles, 'aPos'),
    dash: gl.getAttribLocation(particles, 'aDash'),
    info: gl.getAttribLocation(particles, 'aInfo'),
    corner: gl.getAttribLocation(backdrop, 'aCorner'),
    mvp: gl.getUniformLocation(particles, 'uMvp'),
    half: gl.getUniformLocation(particles, 'uHalf'),
    thick: gl.getUniformLocation(particles, 'uThick'),
    line: gl.getUniformLocation(particles, 'uLine'),
    maxSize: gl.getUniformLocation(particles, 'uMaxSize'),
    depth: gl.getUniformLocation(particles, 'uDepth'),
    color: gl.getUniformLocation(particles, 'uColor'),
    hot: gl.getUniformLocation(particles, 'uHot'),
    res: gl.getUniformLocation(backdrop, 'uRes'),
  }

  let w = 1
  let h = 1
  let dpr = 1
  let dist = 4
  /** Raises the scene clear of the location card, in clip-space units. */
  let lift = 0
  let yaw = 0
  let pitch = 0.3
  let spin = 0
  let time = 0
  let last = 0
  let raf = 0
  let visible = true
  // Pointer in canvas pixels, and the bubble's eased position.
  const pointer = { x: 0, y: 0, inside: false, bx: 0, by: 0 }
  // Rotation of the model (pitch after yaw), as a 3×3 row-major matrix.
  const rot = new Float32Array(9)
  const mvp = new Float32Array(16)

  function layout() {
    w = Math.max(1, canvas.clientWidth)
    h = Math.max(1, canvas.clientHeight)
    dpr = Math.min(2, window.devicePixelRatio || 1)
    canvas.width = Math.round(w * dpr)
    canvas.height = Math.round(h * dpr)
    gl?.viewport(0, 0, canvas.width, canvas.height)
    // Back the camera off until the widest shape fits.
    const aspect = w / h
    dist = Math.max(2.05 / (TAN * aspect), 1.32 / TAN)
    lift = aspect < 1 ? 0.16 : 0.05
  }

  function updateMatrices() {
    const cy = Math.cos(yaw)
    const sy = Math.sin(yaw)
    const cp = Math.cos(pitch)
    const sp = Math.sin(pitch)
    // R = Rx(pitch) · Ry(yaw)
    rot.set([cy, 0, sy, sp * sy, cp, -sp * cy, -cp * sy, sp, cp * cy])
    const f = 1 / TAN
    const aspect = w / h
    const near = 0.1
    const far = 50
    const A = (far + near) / (near - far)
    const B = (2 * far * near) / (near - far)
    // Model-view rows are [rot row | translation], with the model at z = -dist.
    const m = [
      [rot[0], rot[1], rot[2], 0],
      [rot[3], rot[4], rot[5], 0],
      [rot[6], rot[7], rot[8], -dist],
    ]
    const rows = [
      m[0].map((v) => (v * f) / aspect),
      m[1].map((v, k) => v * f - m[2][k] * lift),
      m[2].map((v, k) => v * A + (k === 3 ? B : 0)),
      m[2].map((v) => -v),
    ]
    // Column-major for WebGL.
    for (let c = 0; c < 4; c++) for (let r = 0; r < 4; r++) mvp[c * 4 + r] = rows[r][c]
  }

  // One physics step; k scales it to the frame time (1 at 60fps).
  function step(k: number) {
    const shape = options.shapes[shapeIndex]
    time += k / 60
    // The globe turns all the way round; the other shapes sway so they stay readable.
    let yawTarget: number
    let pitchTarget: number
    if (shape === 'globe') {
      spin += 0.0045 * k
      yawTarget = spin
      pitchTarget = 0.12 + Math.sin(time * 0.4) * 0.06
    } else {
      spin = yaw
      yawTarget = Math.sin(time * 0.25) * SWAY[shape]
      pitchTarget = shape === 'range' ? 0.3 : 0.08
    }
    if (pointer.inside) {
      yawTarget += (pointer.x / w - 0.5) * 0.6
      pitchTarget += (pointer.y / h - 0.5) * 0.3
    }
    const ease = 1 - Math.pow(0.95, k)
    yaw += wrap(yawTarget - yaw) * ease
    pitch += (pitchTarget - pitch) * ease
    updateMatrices()

    // The cursor's ray, carried into model space: o + t·d.
    let ox = 0
    let oy = 0
    let oz = 0
    let dx = 0
    let dy = 0
    let dz = 0
    const stirring = pointer.inside
    if (stirring) {
      const nx = (pointer.x / w) * 2 - 1
      const ny = 1 - (pointer.y / h) * 2 - lift
      let vx = nx * TAN * (w / h)
      let vy = ny * TAN
      let vz = -1
      const n = Math.hypot(vx, vy, vz)
      vx /= n
      vy /= n
      vz /= n
      // Transpose of rot undoes the rotation.
      ox = rot[6] * dist
      oy = rot[7] * dist
      oz = rot[8] * dist
      dx = rot[0] * vx + rot[3] * vy + rot[6] * vz
      dy = rot[1] * vx + rot[4] * vy + rot[7] * vz
      dz = rot[2] * vx + rot[5] * vy + rot[8] * vz
    }

    const damp = Math.pow(0.9, k)
    const cool = Math.pow(0.955, k)
    const tp = target.pos
    const wobble = time * 1.3
    for (let i = 0; i < count; i++) {
      const j = i * 3
      let ax = 0
      let ay = 0
      let az = 0
      if (delay[i] > 0) {
        delay[i] -= k / 60
      } else {
        // Spring toward the shape, with a faint shimmer so it never sits frozen.
        const s = sparkle[i] * 6.283
        ax = (tp[j] + Math.sin(wobble + s) * 0.004 - pos[j]) * 0.008
        ay = (tp[j + 1] + Math.cos(wobble * 0.8 + s) * 0.004 - pos[j + 1]) * 0.008
        az = (tp[j + 2] - pos[j + 2]) * 0.008
      }
      if (stirring) {
        const px = pos[j] - ox
        const py = pos[j + 1] - oy
        const pz = pos[j + 2] - oz
        const t = px * dx + py * dy + pz * dz
        const rx = px - t * dx
        const ry = py - t * dy
        const rz = pz - t * dz
        const d2 = rx * rx + ry * ry + rz * rz
        if (d2 < REACH * REACH) {
          const d = Math.sqrt(d2) || 1
          const f = (1 - d / REACH) ** 2
          // Push away from the ray and swirl around it.
          const push = (f * 0.0035) / d
          const swirl = (f * 0.0045) / d
          ax += rx * push + (dy * rz - dz * ry) * swirl
          ay += ry * push + (dz * rx - dx * rz) * swirl
          az += rz * push + (dx * ry - dy * rx) * swirl
          if (f > heat[i]) heat[i] = f
        }
      }
      vel[j] = vel[j] * damp + ax * k
      vel[j + 1] = vel[j + 1] * damp + ay * k
      vel[j + 2] = vel[j + 2] * damp + az * k
      pos[j] += vel[j] * k
      pos[j + 1] += vel[j + 1] * k
      pos[j + 2] += vel[j + 2] * k
      heat[i] *= cool
    }
  }

  function draw() {
    if (!gl) return
    if (still) updateMatrices()
    const td = target.dash
    const tg = target.glow
    for (let i = 0; i < count; i++) {
      const j = i * 3
      const o = i * STRIDE
      data[o] = pos[j]
      data[o + 1] = pos[j + 1]
      data[o + 2] = pos[j + 2]
      // Moving dashes stretch into streaks behind them.
      data[o + 3] = td[j] + vel[j] * 5
      data[o + 4] = td[j + 1] + vel[j + 1] * 5
      data[o + 5] = td[j + 2] + vel[j + 2] * 5
      data[o + 6] = Math.min(1, tg[i] + heat[i] * 1.4)
      data[o + 7] = sparkle[i]
    }

    gl.disable(gl.BLEND)
    gl.useProgram(backdrop)
    gl.bindBuffer(gl.ARRAY_BUFFER, cornerBuffer)
    gl.enableVertexAttribArray(loc.corner)
    gl.vertexAttribPointer(loc.corner, 2, gl.FLOAT, false, 0, 0)
    gl.uniform2f(loc.res, canvas.width, canvas.height)
    gl.drawArrays(gl.TRIANGLES, 0, 3)
    gl.disableVertexAttribArray(loc.corner)

    gl.enable(gl.BLEND)
    gl.blendFunc(gl.ONE, gl.ONE)
    gl.useProgram(particles)
    gl.bindBuffer(gl.ARRAY_BUFFER, particleBuffer)
    gl.bufferSubData(gl.ARRAY_BUFFER, 0, data)
    const bytes = STRIDE * 4
    gl.enableVertexAttribArray(loc.pos)
    gl.vertexAttribPointer(loc.pos, 3, gl.FLOAT, false, bytes, 0)
    gl.enableVertexAttribArray(loc.dash)
    gl.vertexAttribPointer(loc.dash, 3, gl.FLOAT, false, bytes, 12)
    gl.enableVertexAttribArray(loc.info)
    gl.vertexAttribPointer(loc.info, 2, gl.FLOAT, false, bytes, 24)
    gl.uniformMatrix4fv(loc.mvp, false, mvp)
    gl.uniform2f(loc.half, canvas.width / 2, canvas.height / 2)
    gl.uniform1f(loc.thick, 1.5 * dpr)
    gl.uniform1f(loc.line, 1.5 * dpr)
    gl.uniform1f(loc.maxSize, Math.min(64, pointRange[1]))
    gl.uniform2f(loc.depth, dist - 1, 2.2)
    gl.uniform3f(loc.color, 0.16, 0.5, 0.3)
    gl.uniform3f(loc.hot, 0.78, 0.92, 0.84)
    gl.drawArrays(gl.POINTS, 0, count)
  }

  function moveCursor(k: number) {
    if (!cursor) return
    const ease = 1 - Math.pow(0.7, k)
    pointer.bx += (pointer.x - pointer.bx) * ease
    pointer.by += (pointer.y - pointer.by) * ease
    cursor.style.transform = `translate(${pointer.bx.toFixed(1)}px, ${pointer.by.toFixed(1)}px) translate(-50%, -50%)`
  }

  function frame(now: number) {
    const k = last ? Math.min(3, Math.max(0.25, (now - last) / (1000 / 60))) : 1
    last = now
    step(k)
    draw()
    moveCursor(k)
    raf = requestAnimationFrame(frame)
  }

  function play() {
    if (!raf && visible && !document.hidden) {
      last = 0
      raf = requestAnimationFrame(frame)
    }
  }

  function pause() {
    cancelAnimationFrame(raf)
    raf = 0
  }

  function next() {
    shapeIndex = (shapeIndex + 1) % options.shapes.length
    target = cloudFor(options.shapes[shapeIndex])
    onShapeChange?.(shapeIndex)
    if (still) {
      pos.set(target.pos)
      draw()
      return
    }
    // Burst outward, then fly to the new shape in a loose wave.
    for (let i = 0; i < count; i++) {
      const j = i * 3
      const a = random() * Math.PI * 2
      const y = random() * 2 - 1
      const s = Math.sqrt(1 - y * y) * (0.02 + random() * 0.035)
      vel[j] += Math.cos(a) * s
      vel[j + 1] += y * (0.02 + random() * 0.035)
      vel[j + 2] += Math.sin(a) * s
      delay[i] = random() * 0.35
    }
  }

  function onMove(e: PointerEvent) {
    const r = canvas.getBoundingClientRect()
    pointer.x = e.clientX - r.left
    pointer.y = e.clientY - r.top
    if (!pointer.inside) {
      pointer.bx = pointer.x
      pointer.by = pointer.y
    }
    pointer.inside = true
    if (cursor && e.pointerType === 'mouse') cursor.style.opacity = '1'
  }

  function onLeave() {
    pointer.inside = false
    if (cursor) cursor.style.opacity = '0'
  }

  function onVisibility() {
    if (document.hidden) pause()
    else play()
  }

  const resize = new ResizeObserver(() => {
    layout()
    if (still) draw()
  })
  resize.observe(canvas)
  canvas.addEventListener('click', next)
  layout()

  if (still) {
    draw()
    return {
      next,
      stop() {
        resize.disconnect()
        canvas.removeEventListener('click', next)
      },
    }
  }

  // Only animate while the hero is on screen and the tab is visible.
  const io = new IntersectionObserver(([entry]) => {
    visible = entry.isIntersecting
    if (visible) play()
    else pause()
  })
  io.observe(canvas)
  canvas.addEventListener('pointermove', onMove)
  canvas.addEventListener('pointerleave', onLeave)
  canvas.addEventListener('pointercancel', onLeave)
  document.addEventListener('visibilitychange', onVisibility)
  play()

  return {
    next,
    stop() {
      pause()
      resize.disconnect()
      io.disconnect()
      canvas.removeEventListener('click', next)
      canvas.removeEventListener('pointermove', onMove)
      canvas.removeEventListener('pointerleave', onLeave)
      canvas.removeEventListener('pointercancel', onLeave)
      document.removeEventListener('visibilitychange', onVisibility)
    },
  }
}
