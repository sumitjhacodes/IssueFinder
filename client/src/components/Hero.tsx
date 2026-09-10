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
    <section className="relative overflow-hidden">
      <div
        className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_70%_55%_at_50%_-10%,rgba(13,148,136,0.14),transparent_55%),linear-gradient(180deg,#fafafa_0%,#f4f4f5_100%)] dark:bg-[radial-gradient(ellipse_70%_55%_at_50%_-10%,rgba(45,212,191,0.12),transparent_55%),linear-gradient(180deg,#09090b_0%,#18181b_100%)]"
        aria-hidden
      />
      <div className="relative mx-auto max-w-5xl px-4 pb-10 pt-16 sm:px-6 sm:pb-14 sm:pt-20">
        <div className="mx-auto max-w-3xl text-center">
          <p className="font-display text-2xl font-medium tracking-tight text-ink dark:text-white sm:text-3xl">
            {PRODUCT_NAME}
          </p>
          <h1 className="mt-5 font-display text-4xl font-medium leading-[1.12] text-ink sm:text-5xl dark:text-white">
            Stop hunting for issues.
            <span className="block text-ink-muted dark:text-zinc-400">Start landing PRs.</span>
          </h1>
          <p className="mx-auto mt-6 max-w-xl text-lg text-ink-muted sm:text-xl dark:text-zinc-400">
            {TAGLINE}
          </p>
          <div className="mt-9 flex flex-col items-stretch justify-center gap-3 sm:flex-row sm:items-center">
            <Link
              to="/issues?kind=good-first"
              className="inline-flex items-center justify-center rounded-md bg-ink px-8 py-3.5 font-sans text-[15px] font-medium tracking-[-0.01em] text-white transition hover:bg-zinc-800 dark:bg-white dark:text-ink dark:hover:bg-zinc-200"
            >
              Find my next issue
            </Link>
            <Link
              to="/bounty"
              className="inline-flex items-center justify-center rounded-md border border-paper-line bg-white px-8 py-3.5 font-sans text-[15px] font-medium tracking-[-0.01em] text-ink transition hover:bg-zinc-50 dark:border-zinc-700 dark:bg-zinc-900 dark:text-zinc-100 dark:hover:bg-zinc-800"
            >
              Browse paid bounties
            </Link>
          </div>
          <p className="mt-4 text-sm text-ink-muted">
            New to open source?{' '}
            <Link
              to="/beginner-guide"
              className="font-semibold text-ink underline-offset-4 hover:underline dark:text-zinc-200"
            >
              Read the guide
            </Link>
          </p>
        </div>

        <div className="mx-auto mt-14 max-w-3xl">
          <div className="overflow-hidden rounded-xl border border-paper-line/80 bg-white/90 shadow-soft dark:border-zinc-700/80 dark:bg-zinc-900/90">
            <div className="flex items-center justify-between border-b border-paper-line px-4 py-3 dark:border-zinc-800">
              <span className="text-xs font-medium text-ink-muted">Live preview</span>
              <span className="text-xs font-medium text-accent">
                {isLive ? 'From GitHub' : isLoading ? 'Loading…' : 'Samples'}
              </span>
            </div>
            <ul className="divide-y divide-paper-line dark:divide-zinc-800">
              {isLoading && !isLive
                ? Array.from({ length: PREVIEW_COUNT }).map((_, i) => (
                    <li key={i} className="animate-pulse px-4 py-4">
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
                          className="block px-4 py-4 text-left hover:bg-zinc-50 dark:hover:bg-zinc-800/60"
                        >
                          <p className="text-sm font-semibold text-ink dark:text-zinc-100">{issue.repo}</p>
                          <p className="mt-1 font-display text-lg font-medium text-ink dark:text-white">
                            {issue.title}
                          </p>
                          <p className="mt-1.5 text-xs text-ink-muted">{issue.meta}</p>
                        </a>
                      ) : (
                        <Link to={issue.html_url} className="block px-4 py-4 text-left hover:bg-zinc-50 dark:hover:bg-zinc-800/60">
                          <p className="text-sm font-semibold text-ink dark:text-zinc-100">{issue.repo}</p>
                          <p className="mt-1 font-display text-lg font-medium text-ink dark:text-white">
                            {issue.title}
                          </p>
                          <p className="mt-1.5 text-xs text-ink-muted">{issue.meta}</p>
                        </Link>
                      )}
                    </li>
                  ))}
            </ul>
            <div className="border-t border-paper-line bg-zinc-50/80 px-4 py-3 text-center dark:border-zinc-800 dark:bg-zinc-950/50">
              <Link to="/issues?kind=good-first" className="text-sm font-semibold text-accent hover:text-accent-dark">
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
