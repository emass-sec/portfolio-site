import type { IconName } from '../components/Icon'

export interface Service {
  title: string
  summary: string
  icon: IconName
}

export const servicesIntro = {
  eyebrow: 'Services',
  title: 'Security help sized for a small business',
  lead: 'From a one-time check-up to an ongoing watch over your systems, pick the level of help that fits.',
}

export const services: Service[] = [
  {
    title: 'Quick Consultations',
    summary:
      'Feeling overwhelmed by constant breach headlines? Spend 90 minutes with us for simple explanations and tailored recommendations for your business.',
    icon: 'chat',
  },
  {
    title: 'Full Risk Assessments',
    summary:
      'Curious how your security would stand up to real attackers? We simulate one, find the weak spots and hand you actionable fixes.',
    icon: 'target',
  },
  {
    title: 'Digital Forensics',
    summary: "Clicked on an email you shouldn't have? We examine your network for signs of earlier intrusion attempts.",
    icon: 'search',
  },
  {
    title: 'Ongoing Monitoring',
    summary: "Let us keep a watchful eye on your business's systems to detect, prevent and respond to security threats.",
    icon: 'eye',
  },
]
