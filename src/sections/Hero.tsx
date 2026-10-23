import { motion } from 'motion/react'
import { lazy, Suspense, useState } from 'react'
import { site } from '../content/site'
import { useReducedMotion } from '../hooks/useReducedMotion'

// Three.js is the heaviest dependency, so it loads after the text has painted.
const HeroScene = lazy(() => import('../three/HeroScene'))

function supportsWebGL(): boolean {
  try {
    const canvas = document.createElement('canvas')
    return Boolean(canvas.getContext('webgl2') ?? canvas.getContext('webgl'))
  } catch {
    return false
  }
}

export function Hero() {
  const reducedMotion = useReducedMotion()
  const [webgl] = useState(supportsWebGL)

  return (
    <section id="top" className="relative flex min-h-svh items-center overflow-hidden">
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,rgba(56,189,248,0.12),transparent_60%)]" />
      {webgl && (
        <div className="absolute inset-0 opacity-40 md:left-1/3 md:opacity-70">
          <Suspense fallback={null}>
            <HeroScene animate={!reducedMotion} />
          </Suspense>
        </div>
      )}

      <div className="relative mx-auto w-full max-w-6xl px-6 pt-16">
        <motion.div
          className="max-w-2xl"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: 'easeOut' }}
        >
          <p className="font-mono text-xs uppercase tracking-[0.2em] text-accent-400">{site.tagline}</p>
          <h1 className="mt-4 font-display text-5xl font-semibold leading-tight text-white md:text-7xl">
            {site.name}
          </h1>
          <p className="mt-6 text-lg text-slate-300 md:text-xl">{site.intro}</p>
          <div className="mt-10 flex flex-wrap gap-4">
            <a
              href={site.primaryCta.href}
              className="rounded-full bg-accent-500 px-6 py-3 text-sm font-medium text-ink-950 transition hover:bg-accent-400"
            >
              {site.primaryCta.label}
            </a>
            <a
              href={site.secondaryCta.href}
              className="rounded-full border border-white/15 px-6 py-3 text-sm font-medium text-white transition hover:border-white/40"
            >
              {site.secondaryCta.label}
            </a>
          </div>
        </motion.div>
      </div>
    </section>
  )
}
