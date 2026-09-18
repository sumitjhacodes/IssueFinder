import React from 'react'

type FaqItem = { question: string; answer: string }

type SeoFaqProps = {
  title?: string
  items: FaqItem[]
  className?: string
}

/** Indexable FAQ accordion (pairs with FAQ JSON-LD). Answers stay in the DOM for crawlers. */
const SeoFaq: React.FC<SeoFaqProps> = ({
  title = 'Frequently asked questions',
  items,
  className = 'mt-12 border-t border-paper-line pt-10 dark:border-zinc-800',
}) => {
  return (
    <section className={className}>
      <h2 className="font-display text-2xl font-medium text-ink dark:text-white">{title}</h2>
      <div className="mt-6 divide-y divide-paper-line border-y border-paper-line dark:divide-zinc-800 dark:border-zinc-800">
        {items.map((item) => (
          <details key={item.question} className="group py-1">
            <summary className="flex cursor-pointer list-none items-center justify-between gap-4 py-4 font-medium text-ink outline-none marker:content-none dark:text-white [&::-webkit-details-marker]:hidden">
              <span className="text-left text-sm sm:text-base">{item.question}</span>
              <span
                className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full border border-paper-line text-ink-muted transition group-open:rotate-45 dark:border-zinc-700"
                aria-hidden
              >
                <svg className="h-3.5 w-3.5" viewBox="0 0 14 14" fill="none" stroke="currentColor">
                  <path d="M7 1v12M1 7h12" strokeWidth="1.75" strokeLinecap="round" />
                </svg>
              </span>
            </summary>
            <p className="pb-4 pr-10 text-sm leading-relaxed text-ink-muted">{item.answer}</p>
          </details>
        ))}
      </div>
    </section>
  )
}

export default SeoFaq
