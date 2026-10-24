import type { IconName } from '../components/Icon'

export interface Project {
  title: string
  summary: string
  icon: IconName
  /** Optional external link, e.g. a case study. */
  href?: string
}

export const projectsIntro = {
  eyebrow: 'Projects',
  title: 'Who we protect',
  lead: "Small offices that hold sensitive data but don't have a security team of their own.",
}

export const projects: Project[] = [
  { title: 'Dentist offices', summary: '[Short summary of this project]', icon: 'tooth' },
  { title: 'Law firms', summary: '[Short summary of this project]', icon: 'scales' },
  { title: 'Home businesses', summary: '[Short summary of this project]', icon: 'home' },
  { title: 'Retail shops', summary: '[Short summary of this project]', icon: 'store' },
]
