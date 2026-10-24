export interface Testimonial {
  quote: string
  name: string
  initials: string
}

export const testimonialsIntro = {
  eyebrow: 'Clients',
  title: 'What our clients say',
}

// Placeholders, to be replaced with real client quotes.
export const testimonials: Testimonial[] = [
  {
    quote: 'The team at MasNet made sure our business was fully protected from the bad guys!',
    name: 'Emmett Marsh',
    initials: 'EM',
  },
  {
    quote: 'MasNet gave us the security peace of mind we needed, so we can focus on our core business.',
    name: 'Lindsey Beumer',
    initials: 'LB',
  },
  {
    quote: 'Running my home business securely is a pleasure now. We get the same level of security as the big guys.',
    name: 'Keith Finley',
    initials: 'KF',
  },
]
