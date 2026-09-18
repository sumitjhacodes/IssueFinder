import React from 'react'
import { Link } from 'react-router-dom'
import Hero from '../components/Hero'
import ContributeToIssueFinder from '../components/ContributeToIssueFinder'
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
    detail:
      'Open, unassigned issues updated in the last 30 days on non-archived repos with 100+ stars.',
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
        <section className="border-b border-paper-line bg-white dark:border-zinc-800 dark:bg-zinc-950">
          <div className="page-shell py-20 sm:py-24">
            <div className="mx-auto max-w-2xl text-center">
              <h2 className="font-display text-4xl text-ink dark:text-white sm:text-5xl">
                GitHub is noisy. Your next PR shouldn’t be.
              </h2>
              <p className="mt-5 font-sans text-lg leading-relaxed text-ink-muted">
                Open, unassigned issues updated in the last 30 days on non-archived repos with 100+
                stars — then open them on GitHub.
              </p>
            </div>
          </div>
        </section>

        <section className="border-b border-paper-line dark:border-zinc-800">
          <div className="page-shell py-20 sm:py-24">
            <p className="text-center font-sans text-xs font-medium uppercase tracking-[0.18em] text-ink-muted">
              How it works
            </p>
            <h2 className="mt-3 text-center font-display text-4xl text-ink dark:text-white">
              Three steps. One contribution.
            </h2>
            <div className="mt-14 grid gap-10 sm:grid-cols-3 sm:gap-8">
              {steps.map((step) => (
                <div key={step.n}>
                  <span className="font-display text-3xl text-zinc-300 dark:text-zinc-700">{step.n}</span>
                  <h3 className="mt-3 font-display text-2xl text-ink dark:text-white">{step.title}</h3>
                  <p className="mt-2 font-sans text-sm leading-relaxed text-ink-muted">{step.detail}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        <section className="border-b border-paper-line bg-white dark:border-zinc-800 dark:bg-zinc-950">
          <div className="page-shell py-20 sm:py-24">
            <div className="flex flex-col items-start justify-between gap-4 sm:flex-row sm:items-end">
              <div>
                <h2 className="font-display text-4xl text-ink dark:text-white">Start with your language</h2>
                <p className="mt-2 max-w-md font-sans text-ink-muted">
                  Unassigned issues updated in the last 30 days, filtered to your language.
                </p>
              </div>
              <Link
                to="/issues"
                className="font-sans text-sm font-medium text-ink underline-offset-4 hover:underline dark:text-zinc-200"
              >
                Browse all languages →
              </Link>
            </div>
            <div className="mt-10 grid grid-cols-2 gap-3 sm:grid-cols-4">
              {languages.map((lang) => (
                <Link
                  key={lang.q}
                  to={`/issues?language=${lang.q}`}
                  className="group rounded-2xl border border-paper-line bg-paper px-4 py-5 transition hover:border-zinc-300 hover:bg-white dark:border-zinc-800 dark:bg-zinc-900 dark:hover:border-zinc-600"
                >
                  <span className="font-display text-xl text-ink dark:text-white">{lang.label}</span>
                </Link>
              ))}
            </div>
          </div>
        </section>

        <section className="border-b border-paper-line dark:border-zinc-800">
          <div className="page-shell py-20 sm:py-24">
            <div className="mx-auto max-w-2xl text-center">
              <h2 className="font-display text-4xl text-ink dark:text-white sm:text-5xl">
                Too crowded on famous repos?
              </h2>
              <p className="mt-5 font-sans text-lg leading-relaxed text-ink-muted">
                Mid-size repos (100–2500 stars), pushed in the last 30 days, not archived — quieter
                than mega-repos. Expand a project to see its open issues.
              </p>
              <div className="mt-9 flex justify-center">
                <Link to="/starter" className="btn-primary">
                  Browse starter projects
                </Link>
              </div>
            </div>
          </div>
        </section>

        <section className="border-b border-paper-line bg-white dark:border-zinc-800 dark:bg-zinc-950">
          <div className="page-shell py-20 sm:py-24">
            <div className="mx-auto max-w-2xl text-center">
              <h2 className="font-display text-4xl text-ink dark:text-white sm:text-5xl">
                New to open source?
              </h2>
              <p className="mt-5 font-sans text-lg leading-relaxed text-ink-muted">
                Read how to contribute to open source, watch curated guides, or follow our checklist
                — then jump into Issues or Starter when you’re ready.
              </p>
              <div className="mt-9 flex flex-wrap justify-center gap-3">
                <Link to="/learn/how-to-contribute-to-open-source" className="btn-primary">
                  How to contribute
                </Link>
                <Link to="/learn" className="btn-secondary">
                  All guides & videos
                </Link>
                <Link to="/beginner-guide" className="btn-secondary">
                  Step-by-step checklist
                </Link>
              </div>
            </div>
          </div>
        </section>

        <ContributeToIssueFinder />

        <section>
          <div className="page-shell py-20 text-center sm:py-24">
            <h2 className="font-display text-4xl text-ink dark:text-white sm:text-5xl">
              Ready when you are.
            </h2>
            <p className="mx-auto mt-5 max-w-lg font-sans text-lg text-ink-muted">{TAGLINE}</p>
            <div className="mx-auto mt-9 flex w-full max-w-sm flex-col gap-3 sm:max-w-none sm:flex-row sm:justify-center">
              <Link to="/issues" className="btn-primary">
                Browse issues
              </Link>
              <Link to="/starter" className="btn-secondary">
                Browse starter projects
              </Link>
            </div>
            <p className="mx-auto mt-10 max-w-md font-sans text-sm leading-relaxed text-ink-muted">
              Built in spare time and kept free.{' '}
              <a
                href={BUY_ME_A_COFFEE_URL}
                target="_blank"
                rel="noreferrer"
                className="btn-coffee btn-coffee-sm align-middle"
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
