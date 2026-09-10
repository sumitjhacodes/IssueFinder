import React, { useEffect, useMemo, useState } from 'react'
import { useFetchIssues, type GithubIssueItem } from '../hooks/useFetchIssues'
import { MIN_REPO_STARS } from '../utils/queryBuilder'

type IssueListProps = {
  className?: string
  query: string
  kindLabel?: string
  languageLabel?: string | null
}

type RepoGroup = {
  key: string
  owner: string
  name: string
  htmlUrl: string
  issues: GithubIssueItem[]
}

function parseRepo(repositoryUrl: string): { owner: string; name: string; key: string } {
  const parts = repositoryUrl.replace('https://api.github.com/repos/', '').split('/')
  const owner = parts[0] || ''
  const name = parts[1] || ''
  return { owner, name, key: `${owner}/${name}` }
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

function groupByRepo(items: GithubIssueItem[]): RepoGroup[] {
  const map = new Map<string, RepoGroup>()
  for (const issue of items) {
    const { owner, name, key } = parseRepo(issue.repository_url)
    if (!key || key === '/') continue
    let group = map.get(key)
    if (!group) {
      group = {
        key,
        owner,
        name,
        htmlUrl: `https://github.com/${owner}/${name}`,
        issues: [],
      }
      map.set(key, group)
    }
    group.issues.push(issue)
  }
  return Array.from(map.values()).sort((a, b) => b.issues.length - a.issues.length)
}

/**
 * goodfirstissue.dev-style layout: repos first, issues nested underneath.
 */
const IssueList: React.FC<IssueListProps> = ({
  className = '',
  query,
  kindLabel = 'Issues',
  languageLabel,
}) => {
  const [page, setPage] = useState(1)
  const [openRepos, setOpenRepos] = useState<Record<string, boolean>>({})
  const perPage = 50
  const { data, isLoading, error } = useFetchIssues(query, page, perPage)

  useEffect(() => {
    setPage(1)
    setOpenRepos({})
  }, [query])

  const items = data?.items ?? []
  const groups = useMemo(() => groupByRepo(items), [items])
  const totalCount = data?.total_count ?? 0
  const totalPages = Math.min(Math.max(1, Math.ceil(totalCount / perPage)), 20)
  const showSkeleton = isLoading && items.length === 0
  const displayError = error && !error.message.toLowerCase().includes('rate limit') ? error : null
  const rateLimitMsg = error?.message.toLowerCase().includes('rate limit') ? error.message : null

  useEffect(() => {
    if (groups.length === 0) return
    setOpenRepos((prev) => {
      const next: Record<string, boolean> = { ...prev }
      groups.forEach((g, i) => {
        if (next[g.key] === undefined) next[g.key] = i < 5
      })
      return next
    })
  }, [groups])

  const scopeBits = [
    languageLabel && languageLabel !== 'All' ? languageLabel : null,
    `★${MIN_REPO_STARS}+`,
    'popular repos',
  ].filter(Boolean)

  return (
    <section className={className}>
      <div className="mb-5 flex flex-wrap items-baseline justify-between gap-x-4 gap-y-1 border-b border-paper-line pb-4 dark:border-zinc-800">
        <div>
          <h2 className="font-display text-xl font-medium text-ink dark:text-white">
            {kindLabel}
            {languageLabel && languageLabel !== 'All' ? (
              <span className="text-ink-muted"> · {languageLabel}</span>
            ) : null}
          </h2>
          <p className="mt-0.5 text-sm text-ink-muted">{scopeBits.join(' · ')}</p>
        </div>
        <p className="tabular-nums text-sm text-ink-muted" aria-live="polite">
          {showSkeleton || (isLoading && !data)
            ? 'Loading…'
            : rateLimitMsg
              ? rateLimitMsg
              : displayError
                ? displayError.message
                : `${totalCount.toLocaleString()} issues · ${groups.length} repos`}
        </p>
      </div>

      {showSkeleton && (
        <ul className="space-y-4">
          {Array.from({ length: 4 }).map((_, i) => (
            <li key={i} className="animate-pulse rounded-lg border border-paper-line p-4 dark:border-zinc-800">
              <div className="h-4 w-48 rounded bg-zinc-200 dark:bg-zinc-800" />
              <div className="mt-3 h-3 w-full rounded bg-zinc-100 dark:bg-zinc-800" />
              <div className="mt-2 h-3 w-2/3 rounded bg-zinc-100 dark:bg-zinc-800" />
            </li>
          ))}
        </ul>
      )}

      {!showSkeleton && displayError && items.length === 0 && (
        <div className="py-14 text-center">
          <p className="text-ink dark:text-white">Couldn’t load issues</p>
          <button type="button" className="btn-secondary mt-3" onClick={() => window.location.reload()}>
            Retry
          </button>
        </div>
      )}

      {!showSkeleton && !displayError && items.length === 0 && (
        <p className="py-14 text-center text-sm text-ink-muted">
          {rateLimitMsg || 'No issues found. Try another language or All issues.'}
        </p>
      )}

      {groups.length > 0 && (
        <ul className={`space-y-3 ${isLoading ? 'opacity-60' : ''}`}>
          {groups.map((group) => {
            const open = !!openRepos[group.key]
            return (
              <li
                key={group.key}
                className="overflow-hidden rounded-lg border border-paper-line bg-white dark:border-zinc-800 dark:bg-zinc-900"
              >
                <button
                  type="button"
                  onClick={() =>
                    setOpenRepos((prev) => ({ ...prev, [group.key]: !open }))
                  }
                  className="flex w-full items-start justify-between gap-3 px-4 py-3.5 text-left transition hover:bg-zinc-50 dark:hover:bg-zinc-800/60"
                >
                  <div className="min-w-0">
                    <p className="font-medium text-ink dark:text-white">
                      <span className="text-ink-muted">{group.owner}</span>
                      <span className="mx-1 text-ink-muted">/</span>
                      {group.name}
                    </p>
                    <p className="mt-1 text-xs text-ink-muted">
                      {group.issues.length} issue{group.issues.length === 1 ? '' : 's'} on this page
                      {' · '}
                      updated {timeAgo(group.issues[0]?.updated_at, group.issues[0]?.created_at)}
                    </p>
                  </div>
                  <span className="shrink-0 rounded-md bg-zinc-100 px-2 py-1 text-xs font-medium text-ink dark:bg-zinc-800 dark:text-zinc-200">
                    {group.issues.length}
                  </span>
                </button>

                {open && (
                  <ul className="border-t border-paper-line dark:border-zinc-800">
                    {group.issues.map((issue) => (
                      <li key={issue.id} className="border-b border-paper-line last:border-0 dark:border-zinc-800">
                        <a
                          href={issue.html_url}
                          target="_blank"
                          rel="noreferrer"
                          className="block px-4 py-3 transition hover:bg-zinc-50 dark:hover:bg-zinc-800/40"
                        >
                          <p className="text-[15px] leading-snug text-ink dark:text-zinc-100">
                            {issue.title}
                          </p>
                          <p className="mt-1 text-xs text-ink-muted">
                            #{issue.number} · {timeAgo(issue.updated_at, issue.created_at)}
                            {typeof issue.comments === 'number' && issue.comments > 0
                              ? ` · ${issue.comments} comments`
                              : ''}
                          </p>
                        </a>
                      </li>
                    ))}
                    <li className="px-4 py-2.5">
                      <a
                        href={`${group.htmlUrl}/issues?q=is%3Aopen+label%3A%22good+first+issue%22`}
                        target="_blank"
                        rel="noreferrer"
                        className="text-xs font-medium text-accent hover:underline"
                      >
                        View repo on GitHub →
                      </a>
                    </li>
                  </ul>
                )}
              </li>
            )
          })}
        </ul>
      )}

      {items.length > 0 && totalPages > 1 && (
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

export default IssueList
