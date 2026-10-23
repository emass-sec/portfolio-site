export interface Service {
  title: string
  summary: string
  points: string[]
}

export const services: Service[] = [
  {
    title: 'Security assessments',
    summary: 'Placeholder. What the engagement covers and the outcome for the client.',
    points: ['Scope point one', 'Scope point two', 'Scope point three'],
  },
  {
    title: 'Network architecture',
    summary: 'Placeholder. Design, segmentation and hardening of client networks.',
    points: ['Scope point one', 'Scope point two', 'Scope point three'],
  },
  {
    title: 'Cloud and infrastructure',
    summary: 'Placeholder. Secure cloud setup, automation and monitoring.',
    points: ['Scope point one', 'Scope point two', 'Scope point three'],
  },
]
