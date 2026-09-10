import React, { useMemo, useCallback } from 'react'
import { useSearchParams } from 'react-router-dom'
import IssueList from '../components/IssueList'
import { buildGitHubQuery, type IssueKind } from '../utils/queryBuilder'
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
]

function kindFromParam(raw: string | null): IssueKind {
  if (
    raw === 'all' ||
    raw === 'help-wanted' ||
    raw === 'bug' ||
    raw === 'documentation' ||
    raw === 'good-first'
  ) {
    return raw
  }
  // Default: beginner-friendly issues on popular repos
  return 'good-first'
}

const IssuesPage: React.FC = () => {
  const { submittedSearch } = useSearch()
  const [searchParams, setSearchParams] = useSearchParams()
  const language = searchParams.get('language')
  const kind = kindFromParam(searchParams.get('kind'))

  const sync = useCallback(
    (next: { language?: string | null; kind?: IssueKind }) => {
      const params = new URLSearchParams()
      const lang = next.language !== undefined ? next.language : language
      const k = next.kind !== undefined ? next.kind : kind

      if (lang) params.set('language', lang)
      // Persist kind when not the GFI default so links stay shareable
      if (k && k !== 'good-first') params.set('kind', k)

      setSearchParams(params, { replace: true })
    },
    [language, kind, setSearchParams]
  )

  const query = useMemo(
    () =>
      buildGitHubQuery({
        searchTerm: submittedSearch || undefined,
        selectedLanguage: language,
        selectedKind: kind,
        // No date filter by default — same as GFI curated popular repos
        selectedLastActivity: kind === 'all' ? 'last-month' : 'any',
      }),
    [submittedSearch, language, kind]
  )

  const kindLabel = KINDS.find((k) => k.key === kind)?.label ?? 'Good first'
  const languageLabel = LANGUAGES.find((l) => l.key === language)?.label ?? 'All'

  return (
    <main className="mx-auto max-w-3xl px-4 py-8 sm:px-6 sm:py-10">
      <header className="mb-7">
        <h1 className="font-display text-3xl font-medium text-ink dark:text-white">Issues</h1>
        <p className="mt-1 text-sm text-ink-muted">
          Browse by language — open issues on popular repos with 100+ stars.
        </p>
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

      <IssueList key={query} query={query} kindLabel={kindLabel} languageLabel={languageLabel} />
    </main>
  )
}

export default IssuesPage
