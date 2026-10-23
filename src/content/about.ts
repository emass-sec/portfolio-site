export interface TeamMember {
  name: string
  role: string
  initials: string
}

export const about = {
  eyebrow: 'About',
  heading: 'A lifelong passion for technology',
  paragraphs: [
    "Technology isn't just our business, it's our lifelong passion. From the moment our founder touched a keyboard in the 1990s, he was hooked.",
    "With over 15 years of professional experience, including 13 years protecting our nation's most critical infrastructure, our leadership is a seasoned veteran in technology security. Now small and medium-sized businesses in the Denver area can benefit from that expertise.",
  ],
  certificationsHeading: 'Certifications and experience',
  certifications: [
    'Enterprise Penetration Testing',
    'Hacker Techniques, Tools and Incident Handling',
    'Advanced Incident Response',
    'Threat Hunting and Digital Forensics',
    'Industrial Control Systems Security',
    'Continuous Defensive Operations',
    'Vendor Risk Assessments',
    'Employee Security Awareness Training',
    'SMB Network Security Architecture',
    'Microsoft 365 and Azure Identity Security',
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
