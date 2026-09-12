import React, { useMemo } from 'react'
import { Link } from 'react-router-dom'
import { PRODUCT_NAME, TAGLINE } from '../constants/brand'
import { useFetchIssues } from '../hooks/useFetchIssues'
import { buildGitHubQuery } from '../utils/queryBuilder'

const PREVIEW_COUNT = 3

const fallbackIssues = [
  {
    id: 'f1',
    html_url: '/issues',
    repo: 'facebook / react',
    title: 'Improve docs for concurrent features',
    meta: 'updated today',
  },
  {
    id: 'f2',
    html_url: '/issues',
    repo: 'vercel / next.js',
    title: 'Clarify error message for missing env vars',
    meta: 'updated yesterday',
  },
  {
    id: 'f3',
    html_url: '/issues',
    repo: 'rust-lang / rust',
    title: 'Help wanted: polish compiler diagnostics',
    meta: 'updated 2d ago',
  },
]

function formatUpdated(dateString?: string, createdAt?: string): string {
  const raw = dateString || createdAt
  if (!raw) return 'recently'
  const days = Math.floor((Date.now() - new Date(raw).getTime()) / 86400000)
  if (days <= 0) return 'updated today'
  if (days === 1) return 'updated yesterday'
  if (days < 7) return `updated ${days}d ago`
  return `updated ${Math.floor(days / 7)}w ago`
}

function formatRepo(repositoryUrl: string): string {
  const parts = repositoryUrl.split('/').slice(-2)
  return parts.length >= 2 ? `${parts[0]} / ${parts[1]}` : repositoryUrl
}

const Hero: React.FC = () => {
  const previewQuery = useMemo(
    () => buildGitHubQuery({ selectedKind: 'good-first', selectedLastActivity: 'any' }),
    []
  )
  const { data, isLoading } = useFetchIssues(previewQuery, 1, 20)

  const live = useMemo(() => {
    const items = data?.items?.slice(0, PREVIEW_COUNT) ?? []
    return items.map((issue) => ({
      id: String(issue.id),
      html_url: issue.html_url,
      repo: formatRepo(issue.repository_url),
      title: issue.title,
      meta: formatUpdated(issue.updated_at, issue.created_at),
    }))
  }, [data])

  const previewIssues = live.length > 0 ? live : fallbackIssues
  const isLive = live.length > 0

  return (
    <section className="relative overflow-hidden border-b border-paper-line dark:border-zinc-800">
      <div className="page-shell pb-14 pt-16 sm:pb-20 sm:pt-24">
        <div className="mx-auto max-w-2xl text-center">
          <p className="font-sans text-sm font-medium tracking-wide text-ink-muted">{PRODUCT_NAME}</p>
          <h1 className="mt-5 font-display text-5xl leading-[1.08] text-ink dark:text-white sm:text-6xl">
            Stop hunting for issues.
            <span className="mt-1 block italic text-ink-muted dark:text-zinc-400">
              Start landing PRs.
            </span>
          </h1>
          <p className="mx-auto mt-6 max-w-lg font-sans text-base leading-relaxed text-ink-muted sm:text-lg">
            {TAGLINE}
          </p>
          <div className="mx-auto mt-9 flex w-full max-w-md flex-row flex-wrap items-center justify-center gap-3">
            <Link to="/issues?kind=good-first" className="btn-primary min-w-[10.5rem] flex-1 px-5 py-3.5 sm:flex-none">
              Find my next issue
            </Link>
            <Link to="/bounty" className="btn-secondary min-w-[10.5rem] flex-1 px-5 py-3.5 sm:flex-none">
              Browse paid bounties
            </Link>
          </div>
          <p className="mt-5 font-sans text-sm text-ink-muted">
            New to open source?{' '}
            <Link
              to="/beginner-guide"
              className="font-medium text-ink underline decoration-paper-line underline-offset-4 hover:decoration-ink dark:text-zinc-200"
            >
              Read the guide
            </Link>
          </p>
        </div>

        <div className="mx-auto mt-16 max-w-3xl">
          <div className="overflow-hidden rounded-2xl border border-paper-line bg-white dark:border-zinc-800 dark:bg-zinc-900">
            <div className="flex items-center justify-between border-b border-paper-line px-5 py-3.5 dark:border-zinc-800">
              <span className="font-sans text-xs font-medium text-ink-muted">Live preview</span>
              <span className="rounded-full border border-paper-line px-2 py-0.5 font-sans text-[11px] font-medium uppercase tracking-wide text-ink-muted dark:border-zinc-700">
                {isLive ? 'From GitHub' : isLoading ? 'Loading' : 'Samples'}
              </span>
            </div>
            <ul className="divide-y divide-paper-line dark:divide-zinc-800">
              {isLoading && !isLive
                ? Array.from({ length: PREVIEW_COUNT }).map((_, i) => (
                    <li key={i} className="animate-pulse px-5 py-4">
                      <div className="h-3 w-28 rounded bg-zinc-200 dark:bg-zinc-700" />
                      <div className="mt-2 h-5 w-3/4 rounded bg-zinc-200 dark:bg-zinc-700" />
                    </li>
                  ))
                : previewIssues.map((issue) => (
                    <li key={issue.id}>
                      {issue.html_url.startsWith('http') ? (
                        <a
                          href={issue.html_url}
                          target="_blank"
                          rel="noreferrer"
                          className="block px-5 py-4 text-left transition hover:bg-zinc-50 dark:hover:bg-zinc-800/50"
                        >
                          <p className="font-sans text-sm font-medium text-ink-muted">{issue.repo}</p>
                          <p className="mt-1 font-display text-xl text-ink dark:text-white">{issue.title}</p>
                          <p className="mt-1.5 font-sans text-xs text-ink-muted">{issue.meta}</p>
                        </a>
                      ) : (
                        <Link
                          to={issue.html_url}
                          className="block px-5 py-4 text-left transition hover:bg-zinc-50 dark:hover:bg-zinc-800/50"
                        >
                          <p className="font-sans text-sm font-medium text-ink-muted">{issue.repo}</p>
                          <p className="mt-1 font-display text-xl text-ink dark:text-white">{issue.title}</p>
                          <p className="mt-1.5 font-sans text-xs text-ink-muted">{issue.meta}</p>
                        </Link>
                      )}
                    </li>
                  ))}
            </ul>
            <div className="border-t border-paper-line px-5 py-3.5 text-center dark:border-zinc-800">
              <Link
                to="/issues?kind=good-first"
                className="font-sans text-sm font-medium text-ink underline-offset-4 hover:underline dark:text-zinc-200"
              >
                See all matching issues →
              </Link>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}

export default Hero
