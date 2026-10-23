export interface Question {
  question: string
  answer: string
}

export const faqIntro = {
  eyebrow: 'FAQ',
  title: 'Frequently asked questions',
}

export const faq: Question[] = [
  {
    question: 'Is cybersecurity consulting only for large businesses?',
    answer:
      "No. Small and home-based businesses benefit from understanding their risks, evaluating existing safeguards, and making informed security decisions. Consulting helps identify the right improvements without assuming every business needs the same tools, staff, or level of investment.",
  },
  {
    question: 'Do I need to know what services I need before contacting MasNet?',
    answer:
      "No. If you're unsure where to start, a conversation about your business, technology, and concerns will help establish the right next steps.",
  },
  {
    question: 'Does MasNet provide both strategic advice and technical assistance?',
    answer:
      'Yes. MasNet combines strategic cybersecurity guidance with hands-on technical expertise. The specific assessment, implementation, and validation work depends on the scope agreed for each engagement.',
  },
  {
    question: 'Can you help us prioritize security issues?',
    answer:
      'Yes. A useful review looks beyond the severity rating of an individual finding, to factors like exposure, exploitability, existing safeguards, business impact, and the effort needed to fix it.',
  },
  {
    question: 'Will an assessment eliminate our cybersecurity risks?',
    answer:
      'No assessment can eliminate all risk. It identifies weaknesses, evaluates exposure, and informs decisions about the right safeguards and fixes. Security remains an ongoing process.',
  },
  {
    question: 'Do you work with businesses that already have an IT provider?',
    answer:
      "Yes. Security consulting can complement your existing IT support with security-focused assessment, advice, and technical expertise. Whether an engagement fits depends on the services you need and what your IT provider already covers.",
  },
]
