import { Section } from '../components/Section'
import { about } from '../content/about'

export function About() {
  return (
    <Section id="about" eyebrow="Who I am" title={about.heading}>
      <div className="grid gap-12 md:grid-cols-[3fr_2fr]">
        <div className="space-y-5 text-lg text-slate-300">
          {about.paragraphs.map((p) => (
            <p key={p}>{p}</p>
          ))}
        </div>
        <dl className="grid grid-cols-3 gap-4 md:grid-cols-1">
          {about.highlights.map((item) => (
            <div key={item.label} className="rounded-2xl border border-white/10 bg-white/[0.03] p-5">
              <dt className="text-sm text-slate-400">{item.label}</dt>
              <dd className="mt-1 font-display text-3xl font-semibold text-white">{item.value}</dd>
            </div>
          ))}
        </dl>
      </div>
    </Section>
  )
}
