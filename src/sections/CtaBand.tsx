import { Section } from '../components/Section'
import { ctaBand } from '../content/site'

export function CtaBand() {
  return (
    <Section labelledBy="cta-title">
      <div className="relative flex flex-col items-start gap-5 overflow-hidden rounded-band bg-forest px-[clamp(24px,6vw,80px)] pt-[clamp(48px,7vw,88px)] pb-[clamp(120px,14vw,170px)] text-white">
        <svg
          width="100%"
          height="160"
          viewBox="0 0 1200 160"
          preserveAspectRatio="none"
          aria-hidden="true"
          className="absolute bottom-0 left-0"
        >
          <path
            d="M0 160V110l120-40 90 30 140-80 70 36 60-18 150 70 110-56 70 22 120-74 90 50 80-26 100 60v76Z"
            fill="rgba(255,255,255,0.07)"
          />
          <path d="M0 160v-24l160-34 110 22 150-50 120 40 140-30 160 44 130-30 230 50v12Z" fill="rgba(255,255,255,0.09)" />
        </svg>
        <span className="relative font-mono text-xs tracking-[0.1em] text-[#CFE0D2] uppercase">{ctaBand.eyebrow}</span>
        <h2
          id="cta-title"
          className="relative max-w-[680px] font-display text-[clamp(34px,4.6vw,58px)] leading-[1.04] font-semibold tracking-[-0.03em]"
        >
          {ctaBand.title}
        </h2>
        <p className="relative max-w-[520px] text-lg leading-relaxed text-[#D9E6DB]">{ctaBand.body}</p>
        <a
          href={ctaBand.cta.href}
          className="btn relative mt-2 bg-white text-ink hover:bg-sage-100"
        >
          {ctaBand.cta.label}
        </a>
      </div>
    </Section>
  )
}
