export interface Project {
  title: string
  summary: string
  tags: string[]
  /** Optional external link, e.g. a public repo or case study. */
  href?: string
}

export const projects: Project[] = [
  {
    title: 'Project one',
    summary: 'Placeholder. The problem, what you built, and the result.',
    tags: ['Tag', 'Tag'],
  },
  {
    title: 'Project two',
    summary: 'Placeholder. The problem, what you built, and the result.',
    tags: ['Tag', 'Tag'],
  },
  {
    title: 'Project three',
    summary: 'Placeholder. The problem, what you built, and the result.',
    tags: ['Tag', 'Tag'],
  },
]
