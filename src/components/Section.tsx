import { motion } from 'motion/react'
import type { ReactNode } from 'react'

interface SectionProps {
  id?: string
  labelledBy: string
  className?: string
  children: ReactNode
}

/** A page section that fades up as it scrolls into view. */
export function Section({ id, labelledBy, className = '', children }: SectionProps) {
  return (
    <section id={id} className={`scroll-mt-20 px-6 pt-24 md:pt-30 ${className}`} aria-labelledby={labelledBy}>
      <motion.div
        className="mx-auto max-w-[1200px]"
        initial={{ opacity: 0, y: 24 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: '-80px' }}
        transition={{ duration: 0.6, ease: 'easeOut' }}
      >
        {children}
      </motion.div>
    </section>
  )
}

interface SectionHeadingProps {
  id: string
  eyebrow: string
  title: string
  lead?: string
  centered?: boolean
}

export function SectionHeading({ id, eyebrow, title, lead, centered = false }: SectionHeadingProps) {
  return (
    <div className={`flex max-w-[640px] flex-col gap-4 ${centered ? 'mx-auto items-center text-center' : ''}`}>
      <span className={`chip ${centered ? 'self-center' : ''}`}>{eyebrow}</span>
      <h2 id={id} className="heading-2">
        {title}
      </h2>
      {lead && <p className="text-[17px] leading-relaxed text-lichen">{lead}</p>}
    </div>
  )
}
