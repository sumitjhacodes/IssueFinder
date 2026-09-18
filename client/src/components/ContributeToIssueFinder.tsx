import React from 'react'
import { GITHUB_NEW_ISSUE_URL, GITHUB_REPO_URL, PRODUCT_NAME } from '../constants/brand'

type ContributeToIssueFinderProps = {
  /** Tighter layout for page footers vs home hero sections */
  compact?: boolean
}

/**
 * Invites newcomers to practice their first contribution on IssueFinder itself.
 */
const ContributeToIssueFinder: React.FC<ContributeToIssueFinderProps> = ({ compact }) => {
  return (
    <section
      className={
        compact
          ? 'mt-10 border-t border-paper-line pt-10 dark:border-zinc-800'
          : 'border-b border-paper-line dark:border-zinc-800'
      }
    >
      <div className={compact ? undefined : 'page-shell py-20 sm:py-24'}>
        <div className={compact ? undefined : 'mx-auto max-w-2xl text-center'}>
          <h2
            className={
              compact
                ? 'font-display text-2xl font-medium text-ink dark:text-white'
                : 'font-display text-4xl text-ink dark:text-white sm:text-5xl'
            }
          >
            Start by contributing to {PRODUCT_NAME}
          </h2>
          <p
            className={
              compact
                ? 'mt-2 text-sm leading-relaxed text-ink-muted'
                : 'mt-5 font-sans text-lg leading-relaxed text-ink-muted'
            }
          >
            Want your first open source win today? You can start right here. Browse open issues and
            improvement ideas on {PRODUCT_NAME}, or create an issue if you spotted a bug or have a
            feature idea. Open a pull request — and boom, after review your PR can get merged.
          </p>
          <div
            className={
              compact
                ? 'mt-5 flex flex-wrap gap-3'
                : 'mt-9 flex flex-wrap justify-center gap-3'
            }
          >
            <a
              href={`${GITHUB_REPO_URL}/issues`}
              target="_blank"
              rel="noreferrer"
              className="btn-primary"
            >
              Find {PRODUCT_NAME} issues
            </a>
            <a
              href={GITHUB_NEW_ISSUE_URL}
              target="_blank"
              rel="noreferrer"
              className="btn-secondary"
            >
              Create an issue
            </a>
            <a href={GITHUB_REPO_URL} target="_blank" rel="noreferrer" className="btn-secondary">
              Open the repo & raise a PR
            </a>
          </div>
        </div>
      </div>
    </section>
  )
}

export default ContributeToIssueFinder
