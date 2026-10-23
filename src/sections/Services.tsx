import { motion } from 'motion/react'
import { Section } from '../components/Section'
import { services } from '../content/services'

export function Services() {
  return (
    <Section id="services" eyebrow="What I do" title="Services">
      <div className="grid gap-6 md:grid-cols-3">
        {services.map((service, i) => (
          <motion.article
            key={service.title}
            className="rounded-2xl border border-white/10 bg-white/[0.03] p-6 transition-colors hover:border-accent-400/40"
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: i * 0.08 }}
          >
            <h3 className="font-display text-xl font-semibold text-white">{service.title}</h3>
            <p className="mt-3 text-slate-400">{service.summary}</p>
            <ul className="mt-5 space-y-2 text-sm text-slate-300">
              {service.points.map((point) => (
                <li key={point} className="flex gap-2">
                  <span className="text-accent-400" aria-hidden="true">›</span>
                  {point}
                </li>
              ))}
            </ul>
          </motion.article>
        ))}
      </div>
    </Section>
  )
}
