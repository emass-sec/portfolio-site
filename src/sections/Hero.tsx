import { motion } from 'motion/react'
import { Fragment, useEffect, useRef, useState } from 'react'
import { Icon } from '../components/Icon'
import { site } from '../content/site'
import type { ParticleHero } from '../hero/particleHero'
import { useReducedMotion } from '../hooks/useReducedMotion'

const glass = 'border border-white/15 bg-night/60 text-snow backdrop-blur-sm'

/** The particle scene and its controls. Its drawing code loads after the text has painted. */
function HeroScene({ still }: { still: boolean }) {
  const canvas = useRef<HTMLCanvasElement>(null)
  const cursor = useRef<HTMLDivElement>(null)
  const scene = useRef<ParticleHero | null>(null)
  const [shape, setShape] = useState(0)

  useEffect(() => {
    let cancelled = false
    void import('../hero/particleHero').then(({ startParticleHero }) => {
      if (cancelled || !canvas.current) return
      setShape(0)
      scene.current = startParticleHero(canvas.current, {
        shapes: site.heroShapes.map((s) => s.shape),
        still,
        cursor: cursor.current,
        onShapeChange: setShape,
      })
    })
    return () => {
      cancelled = true
      scene.current?.stop()
      scene.current = null
    }
  }, [still])

  const current = site.heroShapes[shape]

  return (
    <>
      <canvas ref={canvas} role="img" aria-label={site.heroImageLabel} className="block h-full w-full cursor-pointer" />
      <div
        ref={cursor}
        aria-hidden="true"
        className="pointer-events-none absolute top-0 left-0 flex size-[76px] items-center justify-center rounded-full border border-white/30 bg-forest/45 px-3 text-center font-mono text-[9px] leading-[1.35] tracking-[0.14em] text-snow uppercase opacity-0 backdrop-blur-[2px] transition-opacity duration-200"
      >
        {site.heroMorph.cursor}
      </div>
      <button
        type="button"
        onClick={() => scene.current?.next()}
        aria-label={`${current.label}. ${site.heroMorph.button}`}
        title={site.heroMorph.button}
        className={`absolute top-5 left-5 flex items-center gap-2 rounded-full px-3.5 py-2 font-mono text-[11px] tracking-[0.08em] uppercase transition-colors hover:border-mint/60 ${glass}`}
      >
        <span className="size-[7px] rounded-full bg-mint shadow-[0_0_8px_var(--color-mint)]" aria-hidden="true" />
        {current.label}
        <Icon name="morph" size={14} strokeWidth={1.8} className="text-mint" />
      </button>
    </>
  )
}

export function Hero() {
  const reducedMotion = useReducedMotion()
  const { headline } = site

  return (
    <section id="top" className="px-6 pt-8 md:pt-10">
      <motion.div
        className="mx-auto flex max-w-[1280px] flex-col items-center"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, ease: 'easeOut' }}
      >
        <span className="chip self-center">
          <span className="size-[7px] rounded-full bg-forest" aria-hidden="true" />
          {site.eyebrow.place}
          <span className="hidden sm:inline">· {site.eyebrow.focus}</span>
        </span>

        <div className="relative mt-5 h-[clamp(340px,38vw,540px)] w-full overflow-hidden rounded-hero border border-line bg-night">
          <HeroScene still={reducedMotion} />
          <div className={`pointer-events-none absolute bottom-5 left-5 flex items-center gap-2.5 rounded-[14px] px-4 py-3 ${glass}`}>
            <Icon name="mountain" size={20} strokeWidth={1.8} className="text-mint" />
            <div className="flex flex-col gap-0.5 text-left">
              <span className="text-[13px] font-semibold">{site.heroLocation.title}</span>
              <span className="font-mono text-[11px] text-sage-300/80">{site.heroLocation.detail}</span>
            </div>
          </div>
          <div
            className={`pointer-events-none absolute top-5 right-5 hidden rounded-full px-3.5 py-2 font-mono text-[11px] tracking-[0.08em] text-sage-300/80 lg:block ${glass}`}
            aria-hidden="true"
          >
            {site.heroBadge}
          </div>
        </div>
      </motion.div>

      <dl className="mx-auto grid max-w-[1200px] gap-4 pt-10 sm:grid-cols-3">
        {site.stats.map((stat) => (
          <div key={stat.value} className="flex flex-col-reverse justify-end gap-1.5 border-t border-line-strong px-1 py-2">
            <dt className="text-[15px] text-lichen">{stat.label}</dt>
            <dd className="font-display text-[44px] font-semibold tracking-[-0.03em] text-forest">{stat.value}</dd>
          </div>
        ))}
      </dl>

      <motion.div
        className="mx-auto flex max-w-[920px] flex-col items-center gap-[22px] pt-20 text-center md:pt-24"
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: '-80px' }}
        transition={{ duration: 0.7, ease: 'easeOut' }}
      >
        <h1 className="font-display text-[clamp(38px,5.6vw,70px)] leading-[1.04] font-semibold tracking-[-0.035em]">
          {headline.phrases.map((phrase, i) => (
            <Fragment key={phrase}>
              {i > 0 && ' '}
              <span className={`block sm:inline sm:whitespace-nowrap ${i === headline.highlight ? 'text-forest' : ''}`}>{phrase}</span>
            </Fragment>
          ))}
        </h1>
        <p className="font-display text-[clamp(20px,2vw,26px)] leading-[1.35] font-semibold tracking-[-0.015em] text-fern">
          {site.lead}
        </p>
        <p className="max-w-[680px] text-[clamp(17px,1.6vw,19px)] leading-[1.6] text-lichen">{site.intro}</p>
        <div className="flex flex-wrap justify-center gap-3 pt-1.5">
          <a href={site.primaryCta.href} className="btn-primary">
            {site.primaryCta.label}
          </a>
          <a href={site.secondaryCta.href} className="btn-secondary">
            {site.secondaryCta.label}
          </a>
        </div>
      </motion.div>
    </section>
  )
}
