import React from 'react'
import { Link } from 'react-router-dom'
import Hero from '../components/Hero'
import { TAGLINE, BUY_ME_A_COFFEE_URL } from '../constants/brand'

const steps = [
  {
    n: '01',
    title: 'Pick your stack',
    detail: 'Filter by language and issue type — good first, help wanted, bugs, or everything open.',
  },
  {
    n: '02',
    title: 'Only fresh work',
    detail: 'We surface issues updated recently and still unassigned — not tickets that sat for a year.',
  },
  {
    n: '03',
    title: 'Open on GitHub and ship',
    detail: 'One click to the issue. Contribute whether it’s your first PR or your fiftieth.',
  },
]

const languages = [
  { label: 'Python', q: 'python' },
  { label: 'TypeScript', q: 'typescript' },
  { label: 'JavaScript', q: 'javascript' },
  { label: 'Rust', q: 'rust' },
  { label: 'Go', q: 'go' },
  { label: 'Java', q: 'java' },
  { label: 'C++', q: 'cpp' },
  { label: 'Ruby', q: 'ruby' },
]

const HomePage: React.FC = () => {
  return (
    <>
      <Hero />

      <main>
        {/* Why it exists */}
        <section className="border-t border-paper-line bg-white dark:border-zinc-800 dark:bg-zinc-950">
          <div className="mx-auto max-w-5xl px-4 py-16 sm:px-6 sm:py-20">
            <div className="mx-auto max-w-2xl text-center">
              <h2 className="font-display text-3xl font-medium text-ink dark:text-white sm:text-4xl">
                GitHub is noisy. Your next PR shouldn’t be.
              </h2>
              <p className="mt-4 text-lg leading-relaxed text-ink-muted">
                GitHub search is noisy. IssueFinder shows open, unassigned issues that were updated
                recently — so beginners and regular contributors both find real work faster.
              </p>
            </div>
          </div>
        </section>

        {/* How it works */}
        <section className="border-t border-paper-line dark:border-zinc-800">
          <div className="mx-auto max-w-5xl px-4 py-16 sm:px-6 sm:py-20">
            <p className="text-center text-sm font-semibold uppercase tracking-[0.2em] text-accent">
              How it works
            </p>
            <h2 className="mt-3 text-center font-display text-3xl font-medium text-ink dark:text-white">
              Three steps. One contribution.
            </h2>
            <div className="mt-12 grid gap-10 sm:grid-cols-3 sm:gap-8">
              {steps.map((step) => (
                <div key={step.n}>
                  <span className="font-display text-3xl font-medium text-zinc-200 dark:text-zinc-700">
                    {step.n}
                  </span>
                  <h3 className="mt-3 font-display text-xl font-medium text-ink dark:text-white">
                    {step.title}
                  </h3>
                  <p className="mt-2 text-sm leading-relaxed text-ink-muted">{step.detail}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Languages */}
        <section className="border-t border-paper-line bg-white dark:border-zinc-800 dark:bg-zinc-950">
          <div className="mx-auto max-w-5xl px-4 py-16 sm:px-6 sm:py-20">
            <div className="flex flex-col items-start justify-between gap-4 sm:flex-row sm:items-end">
              <div>
                <h2 className="font-display text-3xl font-medium text-ink dark:text-white">
                  Start with your language
                </h2>
                <p className="mt-2 max-w-md text-ink-muted">
                  Jump into fresh issues in the stack you already write every day.
                </p>
              </div>
              <Link
                to="/issues"
                className="text-sm font-semibold text-accent transition hover:text-accent-dark"
              >
                Browse all languages →
              </Link>
            </div>
            <div className="mt-8 grid grid-cols-2 gap-3 sm:grid-cols-4">
              {languages.map((lang) => (
                <Link
                  key={lang.q}
                  to={`/issues?language=${lang.q}`}
                  className="group rounded-lg border border-paper-line bg-paper px-4 py-5 transition hover:border-zinc-300 hover:bg-white dark:border-zinc-800 dark:bg-zinc-900 dark:hover:border-zinc-600"
                >
                  <span className="font-display text-lg font-medium text-ink transition group-hover:text-accent dark:text-white">
                    {lang.label}
                  </span>
                </Link>
              ))}
            </div>
          </div>
        </section>

        {/* Closing CTA */}
        <section className="border-t border-paper-line dark:border-zinc-800">
          <div className="mx-auto max-w-5xl px-4 py-20 text-center sm:px-6 sm:py-24">
            <h2 className="font-display text-3xl font-medium text-ink dark:text-white sm:text-4xl">
              Ready when you are.
            </h2>
            <p className="mx-auto mt-4 max-w-lg text-lg text-ink-muted">{TAGLINE}</p>
            <div className="mt-8 flex flex-col items-center justify-center gap-3 sm:flex-row">
              <Link to="/issues" className="btn-primary px-7 py-3">
                Browse fresh issues
              </Link>
              <Link to="/categories" className="btn-secondary px-7 py-3">
                Explore categories
              </Link>
            </div>
            <p className="mx-auto mt-10 max-w-md text-sm leading-relaxed text-ink-muted">
              Built in spare time and kept free.{' '}
              <a
                href={BUY_ME_A_COFFEE_URL}
                target="_blank"
                rel="noreferrer"
                className="inline-flex items-center rounded-md border border-accent/40 bg-accent/10 px-2.5 py-0.5 font-medium text-ink underline-offset-2 transition hover:border-accent hover:bg-accent/15 dark:border-accent/50 dark:bg-accent/10 dark:text-white dark:hover:bg-accent/20"
              >
                Buy me a coffee
              </a>{' '}
              if IssueFinder helped you — no pressure at all.
            </p>
          </div>
        </section>
      </main>
    </>
  )
}

export default HomePage
