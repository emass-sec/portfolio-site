import { Section } from '../components/Section'
import { businessSense } from '../content/site'

export function BusinessSense() {
  return (
    <Section labelledBy="business-sense-title">
      <div className="grid items-start gap-6 card-gloss rounded-band p-[clamp(28px,5vw,64px)] lg:grid-cols-2 lg:gap-16">
        <h2 id="business-sense-title" className="heading-2">
          {businessSense.title}
        </h2>
        <div className="flex flex-col gap-4 lg:pt-2">
          {businessSense.paragraphs.map((p) => (
            <p key={p} className="text-[17px] leading-[1.7] text-lichen">
              {p}
            </p>
          ))}
        </div>
      </div>
    </Section>
  )
}
