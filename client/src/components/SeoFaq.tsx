import React from 'react'

type FaqItem = { question: string; answer: string }

type SeoFaqProps = {
  title?: string
  items: FaqItem[]
}

/** Indexable FAQ block for product pages (pairs with FAQ JSON-LD). */
const SeoFaq: React.FC<SeoFaqProps> = ({ title = 'Frequently asked questions', items }) => {
  return (
    <section className="mt-12 border-t border-paper-line pt-10 dark:border-zinc-800">
      <h2 className="font-display text-2xl font-medium text-ink dark:text-white">{title}</h2>
      <dl className="mt-8 space-y-6">
        {items.map((item) => (
          <div key={item.question}>
            <dt className="font-medium text-ink dark:text-white">{item.question}</dt>
            <dd className="mt-1 text-sm leading-relaxed text-ink-muted">{item.answer}</dd>
          </div>
        ))}
      </dl>
    </section>
  )
}

export default SeoFaq
