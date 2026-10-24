import { ContactForm } from '../components/ContactForm'
import { Icon } from '../components/Icon'
import { Section } from '../components/Section'
import { contact } from '../content/contact'

export function Contact() {
  return (
    <Section id="contact" labelledBy="contact-title" className="pb-24 md:pb-30">
      <div className="grid items-start gap-12 lg:grid-cols-2">
        <div className="flex flex-col gap-5">
          <span className="chip">{contact.eyebrow}</span>
          <h2 id="contact-title" className="heading-2">
            {contact.heading}
          </h2>
          {contact.paragraphs.map((p) => (
            <p key={p} className="text-[17px] leading-relaxed text-lichen">
              {p}
            </p>
          ))}
          <div className="flex flex-col gap-3 pt-1">
            <p className="text-sm font-semibold text-ink">{contact.listIntro}</p>
            <ul className="flex flex-col gap-2.5">
              {contact.list.map((item) => (
                <li key={item} className="flex gap-2.5 text-[15px] leading-snug text-lichen">
                  <Icon name="check" size={18} strokeWidth={2} className="mt-px flex-none text-forest" />
                  {item}
                </li>
              ))}
            </ul>
          </div>
          <dl className="mt-3 border-t border-line">
            {contact.details.map((item) => (
              <div key={item.label} className="flex gap-4 border-b border-line py-4">
                <dt className="w-24 flex-none pt-[3px] font-mono text-xs tracking-[0.08em] text-moss uppercase">
                  {item.label}
                </dt>
                <dd>{item.value}</dd>
              </div>
            ))}
          </dl>
        </div>
        <ContactForm />
      </div>
    </Section>
  )
}
