import React, { useMemo, useCallback } from 'react'
import { Link, useSearchParams } from 'react-router-dom'
import IssueList from '../components/IssueList'
import {
  buildGitHubQuery,
  CATEGORY_TO_KIND,
  type IssueKind,
} from '../utils/queryBuilder'
import { useSearch } from '../contexts/SearchContext'

const LANGUAGES = [
  { key: null, label: 'All' },
  { key: 'python', label: 'Python' },
  { key: 'typescript', label: 'TypeScript' },
  { key: 'javascript', label: 'JavaScript' },
  { key: 'rust', label: 'Rust' },
  { key: 'go', label: 'Go' },
  { key: 'java', label: 'Java' },
  { key: 'cpp', label: 'C++' },
  { key: 'c', label: 'C' },
  { key: 'csharp', label: 'C#' },
  { key: 'php', label: 'PHP' },
  { key: 'ruby', label: 'Ruby' },
  { key: 'swift', label: 'Swift' },
  { key: 'kotlin', label: 'Kotlin' },
] as const

const KINDS: { key: IssueKind; label: string }[] = [
  { key: 'good-first', label: 'Good first' },
  { key: 'help-wanted', label: 'Help wanted' },
  { key: 'all', label: 'All issues' },
  { key: 'bug', label: 'Bugs' },
  { key: 'documentation', label: 'Docs' },
  { key: 'feature', label: 'Features' },
  { key: 'enhancement', label: 'Enhancement' },
  { key: 'refactor', label: 'Refactor' },
  { key: 'testing', label: 'Testing' },
  { key: 'performance', label: 'Performance' },
  { key: 'security', label: 'Security' },
]

const VALID_KINDS = new Set<IssueKind>(KINDS.map((k) => k.key))

function kindFromParam(raw: string | null): IssueKind {
  if (raw && VALID_KINDS.has(raw as IssueKind)) {
    return raw as IssueKind
  }
  return 'good-first'
}

/** Accept legacy ?category=good first issue links from Categories page */
function kindFromCategoryParam(raw: string | null): IssueKind | null {
  if (!raw) return null
  const mapped = CATEGORY_TO_KIND[raw.trim().toLowerCase()]
  return mapped ?? null
}

function normalizeRepo(raw: string | null): string | null {
  if (!raw) return null
  const trimmed = raw.trim()
  if (!/^[A-Za-z0-9_.-]+\/[A-Za-z0-9_.-]+$/.test(trimmed)) return null
  return trimmed
}

const IssuesPage: React.FC = () => {
  const { submittedSearch } = useSearch()
  const [searchParams, setSearchParams] = useSearchParams()
  const language = searchParams.get('language')
  const categoryParam = searchParams.get('category')
  const kindFromCategory = kindFromCategoryParam(categoryParam)
  const kind = kindFromCategory ?? kindFromParam(searchParams.get('kind'))
  const repo = normalizeRepo(searchParams.get('repo'))

  const sync = useCallback(
    (next: { language?: string | null; kind?: IssueKind; repo?: string | null }) => {
      const params = new URLSearchParams()
      const lang = next.language !== undefined ? next.language : language
      const k = next.kind !== undefined ? next.kind : kind
      const r = next.repo !== undefined ? next.repo : repo

      if (lang) params.set('language', lang)
      // Persist kind when not the GFI default so links stay shareable
      if (k && k !== 'good-first') params.set('kind', k)
      if (r) params.set('repo', r)
      // Drop legacy category once user picks an explicit kind/language

      setSearchParams(params, { replace: true })
    },
    [language, kind, repo, setSearchParams]
  )

  const query = useMemo(
    () =>
      buildGitHubQuery({
        searchTerm: submittedSearch || undefined,
        selectedLanguage: language,
        selectedKind: kind,
        selectedRepo: repo,
        // Repo-scoped: show that repo's open issues. Otherwise require recent updates on active repos.
        selectedLastActivity: repo ? 'any' : 'last-month',
      }),
    [submittedSearch, language, kind, repo]
  )

  const kindLabel = KINDS.find((k) => k.key === kind)?.label ?? 'Good first'
  const languageLabel = LANGUAGES.find((l) => l.key === language)?.label ?? 'All'

  return (
    <main className="page-shell max-w-3xl py-10 sm:py-14">
      <header className="mb-8">
        <h1 className="font-display text-4xl text-ink dark:text-white">Issues</h1>
        <p className="mt-1 text-sm text-ink-muted">
          {repo
            ? `Open issues in ${repo}.`
            : 'Unassigned · updated in the last 30 days · non-archived repos with 100+ stars.'}
        </p>
        {repo && (
          <div className="mt-4 flex flex-wrap items-center gap-3 rounded-xl border border-paper-line bg-white px-4 py-3 dark:border-zinc-800 dark:bg-zinc-900">
            <p className="font-sans text-sm text-ink-muted">
              Filtered to{' '}
              <span className="font-medium text-ink dark:text-white">{repo}</span>
            </p>
            <button
              type="button"
              onClick={() => sync({ repo: null })}
              className="font-sans text-sm font-medium text-ink underline decoration-paper-line underline-offset-4 hover:decoration-ink dark:text-zinc-200"
            >
              Clear repo
            </button>
            <Link
              to="/starter"
              className="font-sans text-sm font-medium text-ink-muted underline-offset-4 hover:underline dark:text-zinc-400"
            >
              Back to Starter
            </Link>
          </div>
        )}
      </header>

      <div className="mb-3 flex flex-wrap gap-2">
        {KINDS.map((k) => {
          const active = kind === k.key
          return (
            <button
              key={k.key}
              type="button"
              onClick={() => sync({ kind: k.key })}
              className={`rounded-md border px-3 py-1.5 text-sm font-medium transition-colors ${
                active
                  ? 'border-ink bg-ink text-white dark:border-white dark:bg-white dark:text-zinc-900'
                  : 'border-paper-line text-ink-muted hover:border-zinc-300 hover:text-ink dark:border-zinc-700 dark:hover:border-zinc-500'
              }`}
            >
              {k.label}
            </button>
          )
        })}
      </div>

      <div className="mb-8 flex flex-wrap gap-1.5">
        {LANGUAGES.map((lang) => {
          const active = language === lang.key || (!language && lang.key === null)
          return (
            <button
              key={lang.label}
              type="button"
              onClick={() => sync({ language: lang.key })}
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

      <IssueList
        key={query}
        query={query}
        kindLabel={kindLabel}
        languageLabel={repo ? repo : languageLabel}
      />
    </main>
  )
}

export default IssuesPage
