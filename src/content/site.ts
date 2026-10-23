// Site-wide copy. Everything a fork needs to rebrand lives in src/content.

export const site = {
  name: 'MasNet Cybersecurity',
  wordmark: 'MASNET',
  wordmarkSub: 'Cybersecurity',
  eyebrow: 'Denver, Colorado · Security for small business',
  // The highlighted words are drawn in the accent colour.
  headline: { before: 'Cybersecurity advice for ', highlight: 'mom-and-pop', after: ' businesses' },
  intro:
    "Fifteen years in security, including thirteen protecting the nation's critical infrastructure, now working for small and medium-sized businesses across the Denver area.",
  primaryCta: { label: 'Book a 90-minute consult', href: '#contact' },
  secondaryCta: { label: 'See services', href: '#services' },
  navCta: { label: 'Get in touch', href: '#contact' },
  heroImageLabel:
    'Illustrated Rocky Mountain peak with streams of binary zeros and ones blowing off the summit like wind-driven snow',
  heroLocation: { title: 'Based in Denver', detail: '39.74° N · 104.99° W · 5,280 ft' },
  // "MAS" in binary.
  heroBadge: '01001101 01000001 01010011',
  stats: [
    { value: '15+', label: 'Years of professional experience in technology and security' },
    { value: '13', label: "Years protecting the nation's most critical infrastructure" },
    { value: '90 min', label: 'A first consultation, with plain-English answers for your business' },
  ],
  footerNote: 'Denver, Colorado',
}

export const ctaBand = {
  eyebrow: 'Start with one conversation',
  title: 'Ready to secure your business?',
  body: 'Book a 90-minute consultation for simple explanations and recommendations tailored to your business.',
  cta: { label: 'Get in touch', href: '#contact' },
}

export const navLinks = [
  { id: 'services', label: 'Services' },
  { id: 'projects', label: 'Projects' },
  { id: 'about', label: 'About' },
  { id: 'contact', label: 'Contact' },
] as const

export type SectionId = (typeof navLinks)[number]['id']
