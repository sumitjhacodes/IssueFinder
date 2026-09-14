import React from 'react'
import { Link } from 'react-router-dom'
import type { StarterRepository } from '../hooks/useFetchStarterRepos'

type StarterRepoListProps = {
  repos: StarterRepository[]
  isLoading: boolean
  error: Error | null
  page: number
  hasNextPage: boolean
  onPageChange: (page: number) => void
}

function formatRelative(dateString?: string): string {
  if (!dateString) return 'recently'
  const days = Math.floor((Date.now() - new Date(dateString).getTime()) / 86400000)
  if (days <= 0) return 'pushed today'
  if (days === 1) return 'pushed yesterday'
  if (days < 7) return `pushed ${days}d ago`
  return `pushed ${Math.floor(days / 7)}w ago`
}

const StarterRepoList: React.FC<StarterRepoListProps> = ({
  repos,
  isLoading,
  error,
  page,
  hasNextPage,
  onPageChange,
}) => {
  if (error) {
    return (
      <div className="rounded-2xl border border-red-200 bg-red-50 px-5 py-8 text-center dark:border-red-900/40 dark:bg-red-950/30">
        <p className="font-sans text-sm font-medium text-red-800 dark:text-red-200">
          Couldn’t load starter projects
        </p>
        <p className="mt-1 font-sans text-sm text-red-700 dark:text-red-300">
          {error.message || 'Try again in a moment.'}
        </p>
        <button type="button" className="btn-secondary mt-4" onClick={() => window.location.reload()}>
          Retry
        </button>
      </div>
    )
  }

  if (isLoading) {
    return (
      <ul className="grid gap-4 sm:grid-cols-2">
        {Array.from({ length: 6 }).map((_, i) => (
          <li
            key={i}
            className="animate-pulse rounded-2xl border border-paper-line bg-white p-5 dark:border-zinc-800 dark:bg-zinc-900"
          >
            <div className="flex gap-3">
              <div className="h-11 w-11 rounded-full bg-zinc-200 dark:bg-zinc-700" />
              <div className="flex-1 space-y-2">
                <div className="h-4 w-2/3 rounded bg-zinc-200 dark:bg-zinc-700" />
                <div className="h-3 w-full rounded bg-zinc-200 dark:bg-zinc-700" />
                <div className="h-3 w-4/5 rounded bg-zinc-200 dark:bg-zinc-700" />
              </div>
            </div>
          </li>
        ))}
      </ul>
    )
  }

  if (repos.length === 0) {
    return (
      <div className="rounded-2xl border border-paper-line bg-white px-5 py-12 text-center dark:border-zinc-800 dark:bg-zinc-900">
        <p className="font-display text-2xl text-ink dark:text-white">No matching projects</p>
        <p className="mx-auto mt-2 max-w-md font-sans text-sm text-ink-muted">
          Try another language, or turn off the good-first filter to see more mid-size repos.
        </p>
      </div>
    )
  }

  return (
    <div>
      <ul className="grid gap-4 sm:grid-cols-2">
        {repos.map((repo) => (
          <li
            key={repo.id}
            className="flex flex-col rounded-2xl border border-paper-line bg-white p-5 dark:border-zinc-800 dark:bg-zinc-900"
          >
            <div className="flex items-start gap-3">
              <img
                src={repo.owner.avatar_url}
                alt=""
                className="h-11 w-11 shrink-0 rounded-full border border-paper-line object-cover dark:border-zinc-700"
              />
              <div className="min-w-0 flex-1">
                <div className="flex items-start gap-2">
                  <h3 className="truncate font-sans text-sm font-medium text-ink dark:text-white">
                    {repo.full_name}
                  </h3>
                  <a
                    href={repo.html_url}
                    target="_blank"
                    rel="noreferrer"
                    className="shrink-0 text-ink-muted transition hover:text-ink dark:hover:text-white"
                    aria-label={`Open ${repo.full_name} on GitHub`}
                  >
                    <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14"
                      />
                    </svg>
                  </a>
                </div>
                <p className="mt-1 line-clamp-2 font-sans text-sm leading-relaxed text-ink-muted">
                  {repo.description || 'No description provided.'}
                </p>
              </div>
            </div>

            <div className="mt-4 flex flex-wrap gap-2 font-sans text-xs text-ink-muted">
              {repo.language && (
                <span className="rounded-md border border-paper-line px-2 py-0.5 dark:border-zinc-700">
                  {repo.language}
                </span>
              )}
              <span className="rounded-md border border-paper-line px-2 py-0.5 dark:border-zinc-700">
                {repo.stargazers_count.toLocaleString()} stars
              </span>
              <span className="rounded-md border border-paper-line px-2 py-0.5 dark:border-zinc-700">
                {repo.forks_count.toLocaleString()} forks
              </span>
              <span className="rounded-md border border-paper-line px-2 py-0.5 dark:border-zinc-700">
                {repo.open_issues_count} open issues
              </span>
              <span className="rounded-md border border-paper-line px-2 py-0.5 dark:border-zinc-700">
                {formatRelative(repo.pushed_at || repo.updated_at)}
              </span>
            </div>

            {repo.topics?.length > 0 && (
              <div className="mt-3 flex flex-wrap gap-1.5">
                {repo.topics.slice(0, 5).map((topic) => (
                  <span
                    key={topic}
                    className="rounded-md bg-zinc-100 px-2 py-0.5 font-sans text-[11px] text-ink-muted dark:bg-zinc-800"
                  >
                    #{topic}
                  </span>
                ))}
              </div>
            )}

            <div className="mt-5 flex flex-wrap gap-2">
              <Link
                to={`/issues?repo=${encodeURIComponent(repo.full_name)}&kind=all`}
                className="btn-primary h-10 px-4 text-sm"
              >
                View issues
              </Link>
              <a
                href={repo.html_url}
                target="_blank"
                rel="noreferrer"
                className="btn-secondary h-10 px-4 text-sm"
              >
                Open on GitHub
              </a>
            </div>
          </li>
        ))}
      </ul>

      <div className="mt-8 flex items-center justify-center gap-3">
        <button
          type="button"
          className="btn-secondary h-10 px-4 disabled:opacity-40"
          disabled={page <= 1 || isLoading}
          onClick={() => onPageChange(page - 1)}
        >
          Previous
        </button>
        <span className="font-sans text-sm text-ink-muted">Page {page}</span>
        <button
          type="button"
          className="btn-secondary h-10 px-4 disabled:opacity-40"
          disabled={!hasNextPage || isLoading}
          onClick={() => onPageChange(page + 1)}
        >
          Next
        </button>
      </div>
    </div>
  )
}

export default StarterRepoList
