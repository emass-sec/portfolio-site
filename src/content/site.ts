// Site-wide copy. Everything a fork needs to rebrand lives in src/content.

export const site = {
  name: 'MasNet Cybersecurity',
  wordmark: 'MASNET',
  wordmarkSub: 'Cybersecurity',
  // The second half is hidden on narrow screens so the chip stays on one line.
  eyebrow: { place: 'Denver, Colorado', focus: 'Security for small and home businesses' },
  // The highlighted words are drawn in the accent colour.
  headline: { before: 'Practical cybersecurity. ', highlight: 'Clear guidance.', after: ' Stronger defenses.' },
  intro:
    "Cybersecurity shouldn't be complicated, confusing, or out of reach for small and home-based businesses. MasNet helps businesses across the Denver area understand their risks, strengthen their defenses, and make informed decisions about protecting their systems, data, and operations.",
  primaryCta: { label: 'Discuss your security needs', href: '#contact' },
  secondaryCta: { label: 'Explore our services', href: '#services' },
  navCta: { label: 'Get in touch', href: '#contact' },
  heroImageLabel:
    'Illustrated Rocky Mountain peak with streams of binary zeros and ones blowing off the summit like wind-driven snow',
  heroLocation: { title: 'Based in Denver', detail: '39.74° N · 104.99° W · 5,280 ft' },
  // "MAS" in binary.
  heroBadge: '01001101 01000001 01010011',
  stats: [
    { value: '6', label: 'Services, from strategic advice to hands-on technical reviews' },
    { value: '5', label: 'Steps from understanding your business to reviewing progress' },
    { value: '1', label: "Conversation to get started. You don't need a defined project" },
  ],
  footerNote: 'Denver, Colorado',
}

export const ctaBand = {
  eyebrow: 'Not sure where to start?',
  title: "Let's talk about your cybersecurity",
  body: "You don't have to know exactly what your business needs before starting a conversation. Whether you have a specific concern or want a clearer picture of your overall security, we can help you explore the next steps.",
  cta: { label: 'Discuss your security needs', href: '#contact' },
}

export const navLinks = [
  { id: 'services', label: 'Services' },
  { id: 'approach', label: 'Approach' },
  { id: 'about', label: 'About' },
  { id: 'faq', label: 'FAQ' },
  { id: 'contact', label: 'Contact' },
] as const

export type SectionId = (typeof navLinks)[number]['id']
