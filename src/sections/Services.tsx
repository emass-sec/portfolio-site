import { motion } from 'motion/react'
import { Icon } from '../components/Icon'
import { Section, SectionHeading } from '../components/Section'
import { services, servicesIntro } from '../content/services'

export function Services() {
  return (
    <Section id="services" labelledBy="services-title">
      <div className="flex flex-wrap items-end justify-between gap-5">
        <SectionHeading id="services-title" eyebrow={servicesIntro.eyebrow} title={servicesIntro.title} />
        <p className="max-w-[400px] text-[17px] leading-relaxed text-lichen">{servicesIntro.lead}</p>
      </div>
      <div className="mt-12 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {services.map((service, i) => (
          <motion.article
            key={service.title}
            className="flex flex-col gap-[18px] rounded-card border border-line bg-white p-7"
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: i * 0.08 }}
          >
            <div className="flex items-start justify-between">
              <span className="flex size-[52px] items-center justify-center rounded-[14px] bg-sage-200 text-forest">
                <Icon name={service.icon} size={26} />
              </span>
              <span className="font-mono text-xs text-moss" aria-hidden="true">
                {String(i + 1).padStart(2, '0')}
              </span>
            </div>
            <h3 className="font-display text-[22px] font-semibold tracking-[-0.015em]">{service.title}</h3>
            <p className="text-[15px] leading-relaxed text-lichen">{service.summary}</p>
          </motion.article>
        ))}
      </div>
    </Section>
  )
}
