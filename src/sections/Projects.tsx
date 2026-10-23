import { Icon } from '../components/Icon'
import { Section, SectionHeading } from '../components/Section'
import { projects, projectsIntro } from '../content/projects'

// A different mountain silhouette along the bottom of each card's banner.
const ridges = [
  'M0 70V48l40-22 30 16 45-34 40 30 35-18 50 26 60-20v44Z',
  'M0 70V40l55-26 35 22 40-30 45 34 40-14 45 20 40-12v36Z',
  'M0 70V52l35-14 45 20 50-40 40 26 40-10 45 18 45-24v42Z',
  'M0 70V44l45 10 40-34 40 24 50-28 40 32 45-14 40 12v24Z',
]

export function Projects() {
  return (
    <Section id="projects" labelledBy="projects-title">
      <SectionHeading
        id="projects-title"
        eyebrow={projectsIntro.eyebrow}
        title={projectsIntro.title}
        lead={projectsIntro.lead}
      />
      <div className="mt-12 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {projects.map((project, i) => {
          const body = (
            <>
              <div className="relative flex h-[180px] items-center justify-center bg-sage-300">
                <svg
                  width="100%"
                  height="70"
                  viewBox="0 0 300 70"
                  preserveAspectRatio="none"
                  aria-hidden="true"
                  className="absolute bottom-0 left-0"
                >
                  <path d={ridges[i % ridges.length]} fill="#C6D6C1" />
                </svg>
                <span className="relative flex size-16 items-center justify-center rounded-[18px] bg-white text-forest">
                  <Icon name={project.icon} size={30} strokeWidth={1.6} />
                </span>
              </div>
              <div className="flex flex-col gap-2 px-6 pt-[22px] pb-[26px]">
                <h3 className="font-display text-xl font-semibold">{project.title}</h3>
                <p className="text-sm leading-[1.55] text-moss">{project.summary}</p>
              </div>
            </>
          )
          const className =
            'flex flex-col overflow-hidden rounded-card border border-line bg-white text-ink no-underline transition hover:-translate-y-1 hover:border-line-strong'
          return project.href ? (
            <a key={project.title} href={project.href} className={className} target="_blank" rel="noreferrer">
              {body}
            </a>
          ) : (
            <article key={project.title} className={className}>
              {body}
            </article>
          )
        })}
      </div>
    </Section>
  )
}
