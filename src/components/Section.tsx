import { motion } from 'motion/react'
import type { ReactNode } from 'react'
import type { SectionId } from '../content/site'

interface SectionProps {
  id: SectionId
  eyebrow: string
  title: string
  children: ReactNode
}

export function Section({ id, eyebrow, title, children }: SectionProps) {
  return (
    <section id={id} className="scroll-mt-20 py-24 md:py-32" aria-labelledby={`${id}-title`}>
      <motion.div
        className="mx-auto max-w-6xl px-6"
        initial={{ opacity: 0, y: 24 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: '-80px' }}
        transition={{ duration: 0.6, ease: 'easeOut' }}
      >
        <p className="font-mono text-xs uppercase tracking-[0.2em] text-accent-400">{eyebrow}</p>
        <h2 id={`${id}-title`} className="mt-3 font-display text-3xl font-semibold text-white md:text-4xl">
          {title}
        </h2>
        <div className="mt-12">{children}</div>
      </motion.div>
    </section>
  )
}
