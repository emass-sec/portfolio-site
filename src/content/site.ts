// Site-wide copy. Everything a fork needs to rebrand lives in src/content.

import type { HeroShape } from '../hero/shapes'

export const site = {
  name: 'MasNet Cybersecurity',
  wordmark: 'MASNET',
  wordmarkSub: 'Cybersecurity',
  // The second half is hidden on narrow screens so the chip stays on one line.
  eyebrow: { place: 'Denver, Colorado', focus: 'Security for small business' },
  // The highlighted words are drawn in the accent colour.
  headline: { before: 'Cybersecurity advice for ', highlight: 'mom-and-pop', after: ' businesses' },
  intro:
    "Fifteen years in security, including thirteen protecting the nation's critical infrastructure, now working for small and medium-sized businesses across the Denver area.",
  primaryCta: { label: 'Book a 90-minute consult', href: '#contact' },
  secondaryCta: { label: 'See services', href: '#services' },
  navCta: { label: 'Get in touch', href: '#contact' },
  heroImageLabel:
    'Glowing particles forming the Colorado Front Range around Pikes Peak. Clicking morphs them into the MasNet shield, a magnifying glass and a globe.',
  // The hero's particle shapes, in order. The first one shows on load.
  heroShapes: [
    { shape: 'range', label: 'Pikes Peak · 14,115 ft' },
    { shape: 'shield', label: 'Full risk assessments' },
    { shape: 'magnifier', label: 'Digital forensics' },
    { shape: 'globe', label: 'Ongoing monitoring' },
  ] satisfies { shape: HeroShape; label: string }[],
  heroMorph: { cursor: 'Click to morph', button: 'Show the next shape' },
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
