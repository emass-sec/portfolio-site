import { Section, SectionHeading } from '../components/Section'
import { approachIntro, steps } from '../content/approach'

export function Approach() {
  return (
    <Section id="approach" labelledBy="approach-title">
      <SectionHeading
        id="approach-title"
        eyebrow={approachIntro.eyebrow}
        title={approachIntro.title}
        lead={approachIntro.lead}
      />
      <ol className="mt-12 grid gap-4 sm:grid-cols-2 lg:grid-cols-5">
        {steps.map((step, i) => (
          <li key={step.title} className="flex flex-col gap-3 rounded-card border border-line bg-white p-6">
            <span
              className="flex size-10 items-center justify-center rounded-full bg-sage-200 font-mono text-sm text-forest"
              aria-hidden="true"
            >
              {String(i + 1).padStart(2, '0')}
            </span>
            <h3 className="font-display text-xl font-semibold">{step.title}</h3>
            <p className="text-sm leading-[1.55] text-lichen">{step.summary}</p>
          </li>
        ))}
      </ol>
    </Section>
  )
}
