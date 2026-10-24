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
          {about.paragraphs.map((p) => (
            <p key={p} className="text-[17px] leading-[1.7] text-lichen">
              {p}
            </p>
          ))}
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

      <div className="mt-[72px] flex flex-col gap-6">
        <h3 className="font-display text-[26px] font-semibold tracking-[-0.02em]">{about.teamHeading}</h3>
        <ul className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {about.team.map((member, i) => (
            <li key={member.name} className="flex items-center gap-4 rounded-card border border-line bg-white p-6">
              <span
                className={`flex size-14 flex-none items-center justify-center rounded-full font-display text-lg font-semibold ${
                  i === 0 ? 'bg-forest text-white' : 'bg-sage-300 text-forest'
                }`}
                aria-hidden="true"
              >
                {member.initials}
              </span>
              <div className="flex flex-col gap-[3px]">
                <span className="font-semibold">{member.name}</span>
                <span className="text-sm text-lichen">{member.role}</span>
              </div>
            </li>
          ))}
        </ul>
      </div>
    </Section>
  )
}
