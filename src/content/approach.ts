export interface Step {
  title: string
  summary: string
}

export const approachIntro = {
  eyebrow: 'Approach',
  title: 'A clear, practical approach to cybersecurity',
  lead: 'Effective security starts with understanding your business and its actual risks, not a one-size-fits-all checklist.',
}

export const steps: Step[] = [
  {
    title: 'Understand',
    summary:
      'We start with your business, its technology, your existing safeguards, and the concerns you want to address.',
  },
  {
    title: 'Assess',
    summary:
      'We review the agreed systems, configurations, and practices, judging findings in context rather than by severity score alone.',
  },
  {
    title: 'Prioritize',
    summary:
      'Not every issue carries the same risk. We separate urgent concerns from longer-term improvements by impact, exposure, and effort.',
  },
  {
    title: 'Improve',
    summary:
      'You get clear findings and recommendations and, where the engagement includes it, hands-on help fixing selected issues.',
  },
  {
    title: 'Review',
    summary: 'As your technology and operations change, we revisit priorities and plan the next round of improvements.',
  },
]
