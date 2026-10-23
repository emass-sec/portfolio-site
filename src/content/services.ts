import type { IconName } from '../components/Icon'

export interface Service {
  title: string
  summary: string
  icon: IconName
}

export const servicesIntro = {
  eyebrow: 'Services',
  title: 'Cybersecurity services',
}

export const services: Service[] = [
  {
    title: 'Cybersecurity consulting',
    summary: 'Practical guidance to help your business understand risks and make informed security decisions.',
    icon: 'chat',
  },
  {
    title: 'Security assessments',
    summary: 'Identify security weaknesses, evaluate risks, and prioritize improvements.',
    icon: 'target',
  },
  {
    title: 'Technical security reviews',
    summary: 'Examine systems, configurations, and security controls to uncover potential vulnerabilities.',
    icon: 'search',
  },
  {
    title: 'Security planning',
    summary: 'Develop practical strategies to strengthen your defenses and improve your security posture.',
    icon: 'route',
  },
  {
    title: 'Security awareness',
    summary: 'Help your employees recognize threats and adopt safer security practices.',
    icon: 'users',
  },
]
