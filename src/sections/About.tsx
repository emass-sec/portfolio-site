import { Icon } from '../components/Icon'
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
          <h3 className="font-display text-xl font-semibold">{about.focusHeading}</h3>
          <ul className="flex flex-col gap-3">
            {about.focus.map((item) => (
              <li key={item} className="flex items-start gap-3 text-[15px] leading-relaxed text-[#1E3328]">
                <Icon name="shieldCheck" size={20} className="mt-0.5 flex-none text-forest" />
                {item}
              </li>
            ))}
          </ul>
        </div>
      </div>
    </Section>
  )
}
