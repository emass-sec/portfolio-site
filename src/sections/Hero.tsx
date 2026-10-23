import { motion } from 'motion/react'
import { useEffect, useRef } from 'react'
import { Icon } from '../components/Icon'
import { site } from '../content/site'
import { useReducedMotion } from '../hooks/useReducedMotion'

/** The mountain canvas. Its drawing code loads after the text has painted. */
function MountainCanvas({ still }: { still: boolean }) {
  const canvas = useRef<HTMLCanvasElement>(null)

  useEffect(() => {
    let stop: (() => void) | undefined
    let cancelled = false
    void import('../hero/binaryWind').then(({ startBinaryWind }) => {
      if (cancelled || !canvas.current) return
      stop = startBinaryWind(canvas.current, { still })
    })
    return () => {
      cancelled = true
      stop?.()
    }
  }, [still])

  return <canvas ref={canvas} role="img" aria-label={site.heroImageLabel} className="block h-full w-full" />
}

export function Hero() {
  const reducedMotion = useReducedMotion()
  const { headline } = site

  return (
    <section id="top" className="px-6 pt-[72px]">
      <motion.div
        className="mx-auto flex max-w-[920px] flex-col items-center gap-[22px] text-center"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, ease: 'easeOut' }}
      >
        <span className="chip self-center">
          <span className="size-[7px] rounded-full bg-forest" aria-hidden="true" />
          {site.eyebrow.place}
          <span className="hidden sm:inline">· {site.eyebrow.focus}</span>
        </span>
        <h1 className="font-display text-[clamp(40px,6.4vw,78px)] leading-[1.02] font-semibold tracking-[-0.035em]">
          {headline.before}
          <span className="text-forest">{headline.highlight}</span>
          {headline.after}
        </h1>
        <p className="max-w-[640px] text-[clamp(17px,1.6vw,20px)] leading-[1.55] text-lichen">{site.intro}</p>
        <div className="flex flex-wrap justify-center gap-3 pt-1.5">
          <a href={site.primaryCta.href} className="btn-primary">
            {site.primaryCta.label}
          </a>
          <a href={site.secondaryCta.href} className="btn-secondary">
            {site.secondaryCta.label}
          </a>
        </div>
      </motion.div>

      <div className="relative mx-auto mt-14 h-[clamp(360px,46vw,640px)] max-w-[1280px] overflow-hidden rounded-hero border border-line bg-mist">
        <MountainCanvas still={reducedMotion} />
        <div className="absolute bottom-5 left-5 flex items-center gap-2.5 rounded-[14px] border border-line/90 bg-white/90 px-4 py-3 backdrop-blur-sm">
          <Icon name="mountain" size={20} strokeWidth={1.8} className="text-forest" />
          <div className="flex flex-col gap-0.5 text-left">
            <span className="text-[13px] font-semibold">{site.heroLocation.title}</span>
            <span className="font-mono text-[11px] text-lichen">{site.heroLocation.detail}</span>
          </div>
        </div>
        <div
          className="absolute top-5 right-5 hidden rounded-full border border-line/90 bg-white/90 px-3.5 py-2 font-mono text-[11px] tracking-[0.08em] text-fern backdrop-blur-sm sm:block"
          aria-hidden="true"
        >
          {site.heroBadge}
        </div>
      </div>

      <dl className="mx-auto grid max-w-[1200px] gap-4 pt-12 sm:grid-cols-3">
        {site.stats.map((stat) => (
          <div key={stat.value} className="flex flex-col-reverse gap-1.5 border-t border-line-strong px-1 py-2">
            <dt className="text-[15px] text-lichen">{stat.label}</dt>
            <dd className="font-display text-[44px] font-semibold tracking-[-0.03em] text-forest">{stat.value}</dd>
          </div>
        ))}
      </dl>
    </section>
  )
}
