import type { IconName } from '../components/Icon'

export interface Service {
  title: string
  icon: IconName
  /** One line on what the service gets you, shown under the title. */
  lead: string
  body?: string
  listIntro?: string
  list?: string[]
  /** A short note under the list, e.g. what you receive or how the work is scoped. */
  note?: string
}

export const servicesIntro = {
  eyebrow: 'Services',
  title: "Cybersecurity Services for Denver's Small Businesses",
  lead: 'Every service is tailored to your technology, resources, and objectives.',
}

export const services: Service[] = [
  {
    title: 'Cybersecurity Consulting and Advisory',
    icon: 'chat',
    lead: 'Make confident decisions about your security priorities and investments.',
    listIntro: 'Areas of focus include:',
    list: [
      'Evaluating your current security practices',
      'Identifying gaps and improvement opportunities',
      'Recommending changes that fit your business needs and risks',
      'Reviewing security policies, procedures, and responsibilities',
      'Advising on security-related technology choices',
    ],
  },
  {
    title: 'Security Assessments and Risk Reviews',
    icon: 'target',
    lead: 'Understand where your business may be exposed and what to address first.',
    body: 'We review relevant systems, configurations, and processes to find weaknesses and rank them by real-world risk and business impact.',
    note: 'You receive documented findings and clear remediation recommendations.',
  },
  {
    title: 'Technical Security Reviews',
    icon: 'search',
    lead: "Good policies aren't enough. Technical controls must also work as intended.",
    listIntro: 'Depending on scope, reviews may examine:',
    list: [
      'System and application configurations',
      'User accounts, privileges, and access controls',
      'Patch management and vulnerability remediation',
      'Network security and system exposure',
      'Endpoint and device protection',
      'Logging, monitoring, and visibility',
      'Backup protection and recovery',
    ],
    note: 'Each review covers only the systems and activities agreed on before work begins.',
  },
  {
    title: 'Security Planning and Improvement',
    icon: 'plan',
    lead: 'Turn findings into an actionable plan.',
    body: 'We build an achievable roadmap that accounts for risk, operations, resources, and technical dependencies.',
    listIntro: 'Support may include:',
    list: [
      'Prioritizing improvements',
      'Choosing safeguards and technical solutions',
      'Setting security goals',
      'Advising on implementation and validating changes',
    ],
  },
  {
    title: 'Security Awareness and Best Practices',
    icon: 'people',
    lead: 'Help your team recognize threats, protect business information, and adopt safer day-to-day habits.',
    body: 'Topics may include phishing, account security and authentication, handling sensitive information, and spotting suspicious activity.',
  },
  {
    title: 'Ongoing Cybersecurity Support',
    icon: 'shieldCheck',
    lead: 'Security needs change as your business grows.',
    body: 'Through ongoing advisory engagements, we help you respond to new concerns and plan further improvements, within an agreed scope.',
  },
]
