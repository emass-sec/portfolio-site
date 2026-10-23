import { ContactForm } from '../components/ContactForm'
import { Section } from '../components/Section'

export function Contact() {
  return (
    <Section id="contact" eyebrow="Get in touch" title="Contact">
      <div className="grid gap-12 md:grid-cols-[2fr_3fr]">
        <p className="text-lg text-slate-300">
          Placeholder. Tell visitors what to include in a message and how quickly you usually reply.
        </p>
        <ContactForm />
      </div>
    </Section>
  )
}
