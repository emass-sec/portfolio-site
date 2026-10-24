import type { BlockPattern } from '../components/blockPatterns'

export const approach: {
  eyebrow: string
  title: string
  lead: string
  /** Each step's block animation is picked to echo the step. */
  steps: { title: string; pattern: BlockPattern; body: string }[]
} = {
  eyebrow: 'Our Approach',
  title: 'Five Steps to Better Security',
  lead: 'Effective security starts with understanding your business and its risks.',
  steps: [
    {
      title: 'Understand',
      pattern: 'ripple',
      body: 'Discuss your business, technology, existing safeguards, and security concerns.',
    },
    {
      title: 'Assess',
      pattern: 'scan',
      body: 'Review the agreed systems, configurations, controls, and practices for weaknesses.',
    },
    {
      title: 'Prioritize',
      pattern: 'bars',
      body: 'Decide what needs attention now and what can wait, based on business impact, not technical severity ratings alone.',
    },
    {
      title: 'Improve',
      pattern: 'wave',
      body: 'Get clear findings and actionable recommendations. Where the engagement includes it, we also help implement and validate changes.',
    },
    {
      title: 'Review',
      pattern: 'chevron',
      body: 'Revisit priorities as your technology, operations, and risks change.',
    },
  ],
}
