import { Section, SectionHeading } from '../components/Section'
import { faq, faqIntro } from '../content/faq'

export function Faq() {
  return (
    <Section id="faq" labelledBy="faq-title">
      <SectionHeading id="faq-title" eyebrow={faqIntro.eyebrow} title={faqIntro.title} />
      <div className="mt-10 border-t border-line">
        {faq.map((item) => (
          <details key={item.question} className="group border-b border-line">
            <summary className="flex cursor-pointer list-none items-center justify-between gap-6 py-5 font-display text-lg font-semibold [&::-webkit-details-marker]:hidden">
              {item.question}
              <span
                className="flex-none font-mono text-xl text-forest transition-transform group-open:rotate-45"
                aria-hidden="true"
              >
                +
              </span>
            </summary>
            <p className="max-w-[760px] pb-6 text-[17px] leading-relaxed text-lichen">{item.answer}</p>
          </details>
        ))}
      </div>
    </Section>
  )
}
