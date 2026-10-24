import { Section, SectionHeading } from '../components/Section'
import { approach } from '../content/approach'

export function Approach() {
  return (
    <Section id="approach" labelledBy="approach-title">
      <SectionHeading id="approach-title" eyebrow={approach.eyebrow} title={approach.title} lead={approach.lead} />
      <ol className="mt-12 grid gap-4 sm:grid-cols-2 lg:grid-cols-5">
        {approach.steps.map((step, i) => (
          <li key={step.title} className="flex flex-col gap-3.5 card-gloss gloss-hover rounded-card p-6">
            <span
              className="flex size-9 items-center justify-center knob-gloss rounded-full font-mono text-sm text-white"
              aria-hidden="true"
            >
              {i + 1}
            </span>
            <h3 className="font-display text-xl font-semibold tracking-[-0.01em]">{step.title}</h3>
            <p className="text-[15px] leading-relaxed text-lichen">{step.body}</p>
          </li>
        ))}
      </ol>
    </Section>
  )
}
