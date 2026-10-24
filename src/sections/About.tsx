import { Section } from '../components/Section'
import { about } from '../content/about'

export function About() {
  return (
    <Section id="about" labelledBy="about-title">
      <div className="grid items-start gap-12 lg:grid-cols-2">
        <div className="flex flex-col gap-5">
          <span className="chip">{about.eyebrow}</span>
          <h2 id="about-title" className="heading-2">
            {about.heading}
          </h2>
          <p className="text-[17px] leading-[1.7] text-lichen">{about.intro}</p>
          <h3 className="pt-3 font-display text-[22px] leading-[1.25] font-semibold tracking-[-0.015em]">
            {about.context.title}
          </h3>
          <p className="text-[17px] leading-[1.7] text-lichen">{about.context.body}</p>
        </div>
        <div className="flex flex-col gap-5">
          <div className="flex flex-col gap-3 rounded-3xl bg-forest p-8 text-white">
            <h3 className="font-display text-[22px] font-semibold tracking-[-0.015em]">{about.individual.title}</h3>
            <p className="text-[17px] leading-[1.7] text-[#D9E6DB]">{about.individual.body}</p>
          </div>
          <div className="flex flex-col gap-5 rounded-3xl border border-line bg-white p-8">
            <h3 className="font-display text-xl font-semibold">{about.certificationsHeading}</h3>
            <ul className="flex flex-wrap gap-2">
              {about.certifications.map((cert) => (
                <li key={cert} className="rounded-full bg-sage-100 px-3.5 py-2 text-sm text-[#1E3328]">
                  {cert}
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </Section>
  )
}
