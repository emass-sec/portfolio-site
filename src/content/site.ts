// Site-wide copy. Everything a fork needs to rebrand lives in src/content.

export const site = {
  name: 'Your Company',
  tagline: 'Network and security engineering',
  intro:
    'Placeholder intro. Replace this with one or two sentences about who you are and what you do for clients.',
  primaryCta: { label: 'Start a conversation', href: '#contact' },
  secondaryCta: { label: 'See services', href: '#services' },
  footerNote: 'Placeholder footer note.',
}

export const navLinks = [
  { id: 'services', label: 'Services' },
  { id: 'projects', label: 'Projects' },
  { id: 'about', label: 'About' },
  { id: 'contact', label: 'Contact' },
] as const

export type SectionId = (typeof navLinks)[number]['id']
