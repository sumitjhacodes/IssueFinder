export type GuideSection = {
  heading: string
  paragraphs: string[]
  bullets?: string[]
}

export type GuideDoc = {
  slug: string
  path: string
  eyebrow: string
  title: string
  intro: string
  sections: GuideSection[]
  faqs: { question: string; answer: string }[]
  ctaPrimary: { to: string; label: string }
  ctaSecondary?: { to: string; label: string }
}
