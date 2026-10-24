import { BlockMatrix } from '../components/BlockMatrix'
import { Section, SectionHeading } from '../components/Section'
import { approach } from '../content/approach'

export function Approach() {
  return (
    <Section id="approach" labelledBy="approach-title">
      <SectionHeading id="approach-title" eyebrow={approach.eyebrow} title={approach.title} lead={approach.lead} />
      <ol className="mt-12 grid gap-4 sm:grid-cols-2 lg:grid-cols-5">
        {approach.steps.map((step, i) => {
          // Cards alternate light and dark, starting light.
          const dark = i % 2 === 1
          return (
            <li
              key={step.title}
              className={`flex flex-col gap-3.5 rounded-card p-6 ${dark ? 'card-gloss-dark gloss-hover-dark text-white' : 'card-gloss gloss-hover'}`}
            >
              <BlockMatrix pattern={step.pattern} tone={dark ? 'dark' : 'light'} className="mb-2" />
              <span
                className={`flex size-9 items-center justify-center rounded-full font-mono text-sm ${dark ? 'tile-gloss text-forest' : 'knob-gloss text-white'}`}
                aria-hidden="true"
              >
                {i + 1}
              </span>
              <h3 className="font-display text-xl font-semibold tracking-[-0.01em]">{step.title}</h3>
              <p className={`text-[15px] leading-relaxed ${dark ? 'text-[#D9E6DB]' : 'text-lichen'}`}>{step.body}</p>
            </li>
          )
        })}
      </ol>
    </Section>
  )
}
