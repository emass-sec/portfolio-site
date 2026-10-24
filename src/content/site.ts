// Site-wide copy. Everything a fork needs to rebrand lives in src/content.

import type { HeroShape } from '../hero/shapes'

export const site = {
  name: 'MasNet Cybersecurity',
  wordmark: 'MASNET',
  wordmarkSub: 'Cybersecurity',
  // The second half is hidden on narrow screens so the chip stays on one line.
  eyebrow: { place: 'Denver, Colorado', focus: 'Security for small business' },
  // Each phrase starts its own line on phones and never breaks on wider screens. The highlighted one is drawn in the accent colour.
  headline: { phrases: ['Practical Cybersecurity.', 'Clear Guidance.', 'Stronger Defenses.'], highlight: 1 },
  lead: "Cybersecurity shouldn't be complicated or out of reach.",
  intro:
    "MasNet Cybersecurity helps Denver's small businesses understand their risks, protect their systems and data, and make informed security decisions. We combine strategic consulting with hands-on technical expertise.",
  primaryCta: { label: 'Discuss Your Security Needs', href: '#contact' },
  secondaryCta: { label: 'Explore Our Services', href: '#services' },
  navCta: { label: 'Get in touch', href: '#contact' },
  heroImageLabel:
    'Glowing particles forming the Colorado Front Range around Pikes Peak. Clicking morphs them into the MasNet shield, a magnifying glass and a globe.',
  // The hero's particle shapes, in order. The first one shows on load.
  heroShapes: [
    { shape: 'range', label: 'Pikes Peak · 14,115 ft' },
    { shape: 'shield', label: 'Security assessments' },
    { shape: 'magnifier', label: 'Technical security reviews' },
    { shape: 'globe', label: 'Ongoing support' },
  ] satisfies { shape: HeroShape; label: string }[],
  heroMorph: { cursor: 'Click to morph', button: 'Show the next shape' },
  heroLocation: { title: 'Based in Denver', detail: '39.74° N · 104.99° W · 5,280 ft' },
  // "MAS" in binary.
  heroBadge: '01001101 01000001 01010011',
  // Shown directly under the hero scene.
  stats: [
    { value: '2 decades', label: 'Professional experience in technology and security' },
    { value: '15', label: "Years protecting the nation's most critical infrastructure" },
    { value: '1', label: 'Conversation with plain-English answers for your business' },
  ],
  footerNote: 'Denver, Colorado',
}

// The short "why" block between the hero and the services.
export const businessSense = {
  title: 'Cybersecurity That Makes Business Sense',
  paragraphs: [
    'Small businesses depend on technology but may lack dedicated cybersecurity resources. Knowing which risks matter most and where to invest in protection can be challenging.',
    'We help you assess your current protections, address weaknesses, and decide what to do next.',
  ],
}

export const navLinks = [
  { id: 'services', label: 'Services' },
  { id: 'approach', label: 'Our Approach' },
  { id: 'about', label: 'About' },
  { id: 'contact', label: 'Contact' },
] as const

export type SectionId = (typeof navLinks)[number]['id']
