import type { IconName } from '../components/Icon'

export interface Service {
  title: string
  summary: string
  icon: IconName
  /** Shown behind a "What's included" toggle on the card. */
  includes: string[]
}

export const servicesIntro = {
  eyebrow: 'Services',
  title: 'Cybersecurity that makes business sense',
  lead: "Every business depends on technology, but few small or home-based businesses have a dedicated security team. We combine strategic consulting with hands-on technical expertise, tailored to your technology, resources, and goals.",
  includesLabel: "What's included",
  scopeNote: 'Technical reviews are scoped to the systems and activities agreed before work begins.',
}

export const services: Service[] = [
  {
    title: 'Cybersecurity consulting',
    summary:
      'Make informed decisions about your security. We evaluate your current approach, identify priorities, and develop practical recommendations aligned with your business and risk exposure.',
    icon: 'chat',
    includes: [
      'Evaluating existing cybersecurity practices and safeguards',
      'Identifying security priorities and improvement opportunities',
      'Developing practical security recommendations',
      'Reviewing security policies, procedures, and responsibilities',
      'Supporting technology and security-related decisions',
      'Establishing a roadmap for ongoing security improvements',
    ],
  },
  {
    title: 'Security assessments and risk reviews',
    summary:
      'Get a clearer picture of your weaknesses and exposure. We review systems, configurations, and practices, then recommend improvements based on risk and business impact.',
    icon: 'target',
    includes: [
      'Reviewing existing security controls and configurations',
      'Identifying weaknesses and gaps in security practices',
      'Evaluating access controls and account protections',
      'Reviewing backup and recovery safeguards',
      'Assessing relevant vulnerabilities and potential exposure',
      'Documenting findings and actionable recommendations',
      'Prioritizing remediation based on risk and business needs',
    ],
  },
  {
    title: 'Technical security reviews',
    summary:
      'Look beyond surface-level checklists. We examine technical controls, configurations, and access permissions to find weaknesses that might otherwise go unnoticed.',
    icon: 'search',
    includes: [
      'System and application security configurations',
      'User accounts, privileges, and access controls',
      'Patch management and vulnerability remediation practices',
      'Network security and system exposure',
      'Endpoint protections and device security',
      'Logging, monitoring, and security visibility',
      'Backup protections and recovery considerations',
    ],
  },
  {
    title: 'Security planning and improvement',
    summary:
      'Turn findings into a practical plan. We help set priorities, evaluate safeguards, and choose measures that strengthen your security over time.',
    icon: 'route',
    includes: [
      'Prioritizing security improvements',
      'Developing remediation roadmaps',
      'Evaluating proposed safeguards and technical solutions',
      'Reviewing security policies and procedures',
      'Establishing security improvement objectives',
      'Advising on implementation and validating changes where included',
    ],
  },
  {
    title: 'Security awareness and guidance',
    summary:
      "Technology alone can't eliminate risk. We help you and your team recognize common threats and adopt safer day-to-day habits.",
    icon: 'users',
    includes: [
      'Recognizing phishing and suspicious activity',
      'Account security and authentication',
      'Handling sensitive information',
      'Safe technology use at the office and at home',
    ],
  },
  {
    title: 'Ongoing cybersecurity support',
    summary:
      "Security isn't a one-time project. As your business and technology change, we help you review priorities, evaluate new concerns, and plan next steps.",
    icon: 'shieldCheck',
    includes: [
      'Periodic reviews of security priorities',
      'Evaluating new concerns as they come up',
      'Planning further improvements',
      'Scope and frequency set around your business',
    ],
  },
]
