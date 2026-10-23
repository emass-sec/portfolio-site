import { Section, SectionHeading } from '../components/Section'
import { testimonials, testimonialsIntro } from '../content/testimonials'

export function Testimonials() {
  return (
    <Section labelledBy="clients-title">
      <SectionHeading id="clients-title" eyebrow={testimonialsIntro.eyebrow} title={testimonialsIntro.title} centered />
      <div className="mt-10 grid gap-4 md:grid-cols-3">
        {testimonials.map((t, i) => {
          // The middle card is filled in forest green.
          const featured = i === 1
          return (
            <figure
              key={t.name}
              className={`flex flex-col justify-between gap-7 rounded-card p-[30px] ${
                featured ? 'bg-forest text-white' : 'border border-line bg-white'
              }`}
            >
              <blockquote className="font-display text-xl leading-[1.45] tracking-[-0.01em]">“{t.quote}”</blockquote>
              <figcaption className="flex items-center gap-3">
                <span
                  className={`flex size-10 items-center justify-center rounded-full text-sm font-semibold ${
                    featured ? 'bg-white/15 text-white' : 'bg-sage-300 text-forest'
                  }`}
                  aria-hidden="true"
                >
                  {t.initials}
                </span>
                <span className="text-[15px] font-semibold">{t.name}</span>
              </figcaption>
            </figure>
          )
        })}
      </div>
    </Section>
  )
}
