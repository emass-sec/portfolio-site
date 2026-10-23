import { Section } from '../components/Section'
import { projects } from '../content/projects'

export function Projects() {
  return (
    <Section id="projects" eyebrow="Selected work" title="Projects">
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {projects.map((project) => {
          const body = (
            <>
              <h3 className="font-display text-xl font-semibold text-white">{project.title}</h3>
              <p className="mt-3 text-slate-400">{project.summary}</p>
              <ul className="mt-5 flex flex-wrap gap-2">
                {project.tags.map((tag, i) => (
                  <li key={`${tag}-${i}`} className="rounded-full bg-white/5 px-3 py-1 font-mono text-xs text-slate-300">
                    {tag}
                  </li>
                ))}
              </ul>
            </>
          )
          const className =
            'block rounded-2xl border border-white/10 bg-white/[0.03] p-6 transition hover:-translate-y-1 hover:border-accent-400/40'
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
