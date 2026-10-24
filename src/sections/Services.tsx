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
      <div className="mt-12 border-b border-line">
        {services.map((service, i) => (
          <motion.article
            key={service.title}
            className="grid gap-6 border-t border-line py-10 lg:grid-cols-[5fr_7fr] lg:gap-16"
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: '-60px' }}
            transition={{ duration: 0.5 }}
          >
            <div className="flex items-start gap-5">
              <span className="flex size-[52px] flex-none items-center justify-center tile-gloss rounded-[14px] text-forest">
                <Icon name={service.icon} size={26} />
              </span>
              <div className="flex flex-col gap-2.5">
                <span className="font-mono text-xs text-moss" aria-hidden="true">
                  {String(i + 1).padStart(2, '0')}
                </span>
                <h3 className="font-display text-[24px] leading-[1.2] font-semibold tracking-[-0.015em]">
                  {service.title}
                </h3>
                <p className="text-[17px] leading-relaxed text-fern">{service.lead}</p>
              </div>
            </div>
            <div className="flex flex-col gap-4 lg:pt-7">
              {service.body && <p className="text-[16px] leading-relaxed text-lichen">{service.body}</p>}
              {service.list && (
                <div className="flex flex-col gap-3">
                  {service.listIntro && <p className="text-sm font-semibold text-ink">{service.listIntro}</p>}
                  <ul className="grid gap-x-6 gap-y-2.5 sm:grid-cols-2">
                    {service.list.map((item) => (
                      <li key={item} className="flex gap-2.5 text-[15px] leading-snug text-lichen">
                        <Icon name="check" size={18} strokeWidth={2} className="mt-px flex-none text-forest" />
                        {item}
                      </li>
                    ))}
                  </ul>
                </div>
              )}
              {service.note && (
                <p className="border-l-2 border-sage-300 pl-3.5 text-[15px] leading-relaxed text-moss">{service.note}</p>
              )}
            </div>
          </motion.article>
        ))}
      </div>
    </Section>
  )
}
