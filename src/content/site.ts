// Site-wide copy. Everything a fork needs to rebrand lives in src/content.

export const site = {
  name: 'MasNet Cybersecurity',
  wordmark: 'MASNET',
  wordmarkSub: 'Cybersecurity',
  // The second half is hidden on narrow screens so the chip stays on one line.
  eyebrow: { place: 'Denver, Colorado', focus: 'Cybersecurity consulting' },
  // The highlighted words are drawn in the accent colour.
  headline: { before: 'A passion for technology. ', highlight: 'A commitment to security.', after: '' },
  intro:
    "Technology has been our lifelong passion. We bring that passion and hands-on expertise to cybersecurity consulting for Denver's small businesses.",
  primaryCta: { label: "Let's talk security", href: '#contact' },
  secondaryCta: { label: 'Our services', href: '#services' },
  navCta: { label: 'Get in touch', href: '#contact' },
  heroImageLabel:
    'Illustrated Rocky Mountain peak with streams of binary zeros and ones blowing off the summit like wind-driven snow',
  heroLocation: { title: 'Based in Denver', detail: '39.74° N · 104.99° W · 5,280 ft' },
  // "MAS" in binary.
  heroBadge: '01001101 01000001 01010011',
  footerNote: 'Denver, Colorado',
}

export const navLinks = [
  { id: 'services', label: 'Services' },
  { id: 'contact', label: 'Contact' },
] as const

export type SectionId = (typeof navLinks)[number]['id']
