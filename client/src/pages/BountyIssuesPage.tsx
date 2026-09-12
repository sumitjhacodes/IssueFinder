import React from 'react'
import { Link } from 'react-router-dom'
import BountyIssues from '../components/BountyIssues'

const BountyIssuesPage: React.FC = () => {
  return (
    <main className="page-shell max-w-3xl py-10 sm:py-14">
      <header className="mb-8">
        <p className="font-sans text-sm font-medium uppercase tracking-[0.18em] text-ink-muted">Bounties</p>
        <h1 className="mt-3 font-display text-4xl text-ink dark:text-white sm:text-5xl">
          Get paid to solve issues
        </h1>
        <p className="mt-3 max-w-xl text-sm leading-relaxed text-ink-muted sm:text-base">
          Only open GitHub issues that list a cash amount ($, €, £, or ₹). Token-only rewards are
          hidden. Always confirm the payout on the issue before you start.
        </p>
        <div className="mt-5 flex flex-wrap gap-3">
          <a href="#bounty-list" className="btn-primary">
            Browse open bounties
          </a>
          <Link to="/issues?kind=good-first" className="btn-secondary">
            Good first issues
          </Link>
        </div>
      </header>

      <section className="mb-10 grid gap-6 border-y border-paper-line py-8 dark:border-zinc-800 sm:grid-cols-3">
        {[
          {
            title: 'Find',
            detail: 'Filter by bounty source and language. Open the issue on GitHub.',
          },
          {
            title: 'Solve',
            detail: 'Fork, fix, and open a pull request that closes the issue.',
          },
          {
            title: 'Claim',
            detail: 'Follow the bounty platform’s claim flow after your PR is accepted.',
          },
        ].map((step) => (
          <div key={step.title}>
            <h2 className="font-display text-lg font-medium text-ink dark:text-white">
              {step.title}
            </h2>
            <p className="mt-1.5 text-sm leading-relaxed text-ink-muted">{step.detail}</p>
          </div>
        ))}
      </section>

      <div id="bounty-list">
        <BountyIssues />
      </div>
    </main>
  )
}

export default BountyIssuesPage
