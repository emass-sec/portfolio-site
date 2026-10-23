export interface TeamMember {
  name: string
  role: string
  initials: string
}

export const about = {
  eyebrow: 'About',
  heading: 'Practical expertise. Informed decisions. Meaningful improvements.',
  paragraphs: [
    "Cybersecurity is hard to manage when you're balancing it against limited time, competing priorities, and the daily work of running a business. Knowing which issues matter most takes more than a checklist or another security tool.",
    'MasNet connects business priorities with technical reality. A weakness has to be understood in context: how it affects your business, what would make it exploitable, which safeguards already exist, and what fixing it would achieve.',
    "Whether you run a small office or a business from your home in the Denver area, we start by understanding how you work, then recommend safeguards that fit, without adding complexity you don't need.",
  ],
  focusHeading: 'Our focus is on helping you',
  focus: [
    'Understand your current security posture',
    'Identify and evaluate meaningful security risks',
    'Prioritize improvements based on context and business impact',
    'Make informed decisions about security measures and technology',
    'Develop a practical approach to ongoing security improvement',
  ],
  teamHeading: 'Our team',
  // Placeholders apart from the founder, to be replaced.
  team: [
    { name: 'Eric M', role: 'Founder', initials: 'EM' },
    { name: 'Joey Jones', role: 'Project Manager', initials: 'JJ' },
    { name: 'Billy Bob', role: 'Senior Security Engineer', initials: 'BB' },
    { name: 'Chris P Bacon', role: 'Junior Security Engineer', initials: 'CB' },
  ] satisfies TeamMember[],
}
