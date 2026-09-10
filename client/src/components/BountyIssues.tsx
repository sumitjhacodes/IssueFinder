import React, { useEffect, useMemo, useState } from 'react'
import { useFetchIssues } from '../hooks/useFetchIssues'
import {
  buildBountyQuery,
  parseBountyReward,
  detectBountyPlatform,
  BOUNTY_SOURCES,
  type BountySource,
} from '../utils/bountyQuery'
import { MIN_REPO_STARS } from '../utils/queryBuilder'

const LANGUAGES = [
  { key: null, label: 'All' },
  { key: 'python', label: 'Python' },
  { key: 'typescript', label: 'TypeScript' },
  { key: 'javascript', label: 'JavaScript' },
  { key: 'rust', label: 'Rust' },
  { key: 'go', label: 'Go' },
  { key: 'java', label: 'Java' },
  { key: 'cpp', label: 'C++' },
  { key: 'solidity', label: 'Solidity' },
] as const

type BountyIssuesProps = {
  className?: string
}

function repoLabel(repositoryUrl: string): string {
  const parts = repositoryUrl.replace('https://api.github.com/repos/', '').split('/')
  return parts.length >= 2 ? `${parts[0]}/${parts[1]}` : ''
}

function timeAgo(updated?: string, created?: string): string {
  const raw = updated || created
  if (!raw) return ''
  const days = Math.floor((Date.now() - new Date(raw).getTime()) / 86400000)
  if (days <= 0) return 'today'
  if (days === 1) return 'yesterday'
  if (days < 7) return `${days}d ago`
  if (days < 30) return `${Math.floor(days / 7)}w ago`
  return `${Math.floor(days / 30)}mo ago`
}

const BountyIssues: React.FC<BountyIssuesProps> = ({ className = '' }) => {
  const [source, setSource] = useState<BountySource>('bounty')
  const [language, setLanguage] = useState<string | null>(null)
  const [page, setPage] = useState(1)
  const perPage = 100

  const query = buildBountyQuery({ source, language, popularOnly: true })
  const { data, isLoading, error } = useFetchIssues(query, page, perPage)

  useEffect(() => {
    setPage(1)
  }, [source, language])

  const paidItems = useMemo(() => {
    const raw = data?.items ?? []
    return raw
      .map((issue) => {
        const reward = parseBountyReward(issue.title, issue.labels, issue.body)
        if (!reward) return null
        return { issue, reward }
      })
      .filter((row): row is NonNullable<typeof row> => row !== null)
      .sort((a, b) => b.reward.amount - a.reward.amount)
  }, [data])

  const totalCount = data?.total_count ?? 0
  const totalPages = Math.min(Math.max(1, Math.ceil(totalCount / perPage)), 10)
  const showSkeleton = isLoading && !data
  const displayError = error && !error.message.toLowerCase().includes('rate limit') ? error : null
  const rateLimitMsg = error?.message.toLowerCase().includes('rate limit') ? error.message : null

  return (
    <section className={className}>
      <div className="mb-4 flex flex-wrap gap-2">
        {BOUNTY_SOURCES.map((s) => {
          const active = source === s.key
          return (
            <button
              key={s.key}
              type="button"
              onClick={() => setSource(s.key)}
              className={`rounded-md border px-3 py-1.5 text-sm font-medium transition-colors ${
                active
                  ? 'border-ink bg-ink text-white dark:border-white dark:bg-white dark:text-zinc-900'
                  : 'border-paper-line text-ink-muted hover:border-zinc-300 hover:text-ink dark:border-zinc-700 dark:hover:border-zinc-500'
              }`}
            >
              {s.label}
            </button>
          )
        })}
      </div>

      <div className="mb-6 flex flex-wrap gap-1.5">
        {LANGUAGES.map((lang) => {
          const active = language === lang.key || (!language && lang.key === null)
          return (
            <button
              key={lang.label}
              type="button"
              onClick={() => setLanguage(lang.key)}
              className={`rounded-full px-3 py-1.5 text-sm transition-colors ${
                active
                  ? 'bg-zinc-200 text-ink dark:bg-zinc-700 dark:text-white'
                  : 'text-ink-muted hover:bg-zinc-100 dark:hover:bg-zinc-900'
              }`}
            >
              {lang.label}
            </button>
          )
        })}
      </div>

      <div className="mb-5 flex flex-wrap items-baseline justify-between gap-x-4 gap-y-1 border-b border-paper-line pb-4 dark:border-zinc-800">
        <div>
          <h2 className="font-display text-xl font-medium text-ink dark:text-white">
            Cash bounties
          </h2>
          <p className="mt-0.5 text-sm text-ink-muted">
            Only issues that list a money amount ($, €, £, ₹)
            {source === 'bounty' ? ` · ★${MIN_REPO_STARS}+` : ''} · highest reward first
          </p>
        </div>
        <p className="tabular-nums text-sm text-ink-muted" aria-live="polite">
          {showSkeleton || (isLoading && !data)
            ? 'Loading…'
            : rateLimitMsg
              ? rateLimitMsg
              : displayError
                ? displayError.message
                : `${paidItems.length} with money on this page`}
        </p>
      </div>

      {showSkeleton && (
        <ul className="divide-y divide-paper-line dark:divide-zinc-800">
          {Array.from({ length: 5 }).map((_, i) => (
            <li key={i} className="animate-pulse py-5">
              <div className="h-3 w-40 rounded bg-zinc-200 dark:bg-zinc-800" />
              <div className="mt-3 h-5 w-[80%] rounded bg-zinc-100 dark:bg-zinc-800" />
            </li>
          ))}
        </ul>
      )}

      {!showSkeleton && displayError && paidItems.length === 0 && (
        <div className="py-14 text-center">
          <p className="text-ink dark:text-white">Couldn’t load bounties</p>
          <button type="button" className="btn-secondary mt-3" onClick={() => window.location.reload()}>
            Retry
          </button>
        </div>
      )}

      {!showSkeleton && !displayError && paidItems.length === 0 && (
        <div className="py-14 text-center">
          <p className="text-sm text-ink-muted">
            {rateLimitMsg ||
              'No cash amounts found on this page. Try Next, another source, or another language.'}
          </p>
          {totalPages > 1 && page < totalPages && !rateLimitMsg && (
            <button
              type="button"
              className="btn-secondary mt-4"
              disabled={isLoading}
              onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
            >
              Check next page
            </button>
          )}
        </div>
      )}

      {paidItems.length > 0 && (
        <ul
          className={`divide-y divide-paper-line dark:divide-zinc-800 ${isLoading ? 'opacity-55' : ''}`}
        >
          {paidItems.map(({ issue, reward }) => {
            const platform = detectBountyPlatform(issue.title, issue.labels, issue.body || undefined)
            const labels = (issue.labels || []).filter((l) => l.name).slice(0, 4)
            return (
              <li key={`${issue.id}-${issue.number}`}>
                <a
                  href={issue.html_url}
                  target="_blank"
                  rel="noreferrer"
                  className="group grid gap-3 py-5 transition sm:grid-cols-[1fr_auto] sm:items-start sm:gap-6"
                >
                  <div className="min-w-0">
                    <p className="text-xs font-medium tracking-wide text-ink-muted">
                      {repoLabel(issue.repository_url)}
                      <span className="mx-1.5 text-zinc-300 dark:text-zinc-600">·</span>
                      {platform}
                    </p>
                    <p className="mt-1.5 text-[1.05rem] leading-snug text-ink group-hover:underline dark:text-zinc-50">
                      {issue.title}
                    </p>
                    {labels.length > 0 && (
                      <div className="mt-2.5 flex flex-wrap gap-1.5">
                        {labels.map((l) => (
                          <span
                            key={l.name}
                            className="rounded border border-paper-line px-1.5 py-0.5 text-[11px] text-ink-muted dark:border-zinc-700"
                          >
                            {l.name}
                          </span>
                        ))}
                      </div>
                    )}
                  </div>
                  <div className="shrink-0 text-left sm:text-right">
                    <p className="font-display text-lg font-medium text-ink dark:text-white">
                      {reward.display}
                    </p>
                    <p className="mt-1 text-xs text-ink-muted">
                      #{issue.number} · {timeAgo(issue.updated_at, issue.created_at)}
                    </p>
                  </div>
                </a>
              </li>
            )
          })}
        </ul>
      )}

      {(paidItems.length > 0 || page > 1) && totalPages > 1 && (
        <div className="mt-8 flex items-center justify-between border-t border-paper-line pt-5 dark:border-zinc-800">
          <button
            type="button"
            className="btn-secondary disabled:opacity-40"
            disabled={page <= 1 || isLoading}
            onClick={() => setPage((p) => Math.max(1, p - 1))}
          >
            Previous
          </button>
          <span className="text-sm text-ink-muted">
            {page} / {totalPages}
          </span>
          <button
            type="button"
            className="btn-secondary disabled:opacity-40"
            disabled={page >= totalPages || isLoading}
            onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
          >
            Next
          </button>
        </div>
      )}
    </section>
  )
}

export default BountyIssues
