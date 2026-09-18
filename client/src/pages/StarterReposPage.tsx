import React, { useCallback } from 'react'
import { Link, useSearchParams } from 'react-router-dom'
import StarterRepoList from '../components/StarterRepoList'
import SeoFaq from '../components/SeoFaq'
import { useFetchStarterRepos } from '../hooks/useFetchStarterRepos'
import {
  STARTER_MAX_PUSH_AGE_DAYS,
  STARTER_MAX_STARS,
  STARTER_MIN_STARS,
} from '../utils/starterRepoQuery'
import { STARTER_FAQS } from '../constants/seo'

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

const PER_PAGE = 24

const StarterReposPage: React.FC = () => {
  const [searchParams, setSearchParams] = useSearchParams()
  const language = searchParams.get('language')
  const hasGoodFirst = searchParams.get('goodFirst') === '1'
  const page = Math.max(1, Number(searchParams.get('page') || '1') || 1)

  const { data, isLoading, error } = useFetchStarterRepos(language, hasGoodFirst, page, PER_PAGE)

  const sync = useCallback(
    (next: { language?: string | null; hasGoodFirst?: boolean; page?: number }) => {
      const params = new URLSearchParams()
      const lang = next.language !== undefined ? next.language : language
      const gfi = next.hasGoodFirst !== undefined ? next.hasGoodFirst : hasGoodFirst
      const p = next.page !== undefined ? next.page : 1

      if (lang) params.set('language', lang)
      if (gfi) params.set('goodFirst', '1')
      if (p > 1) params.set('page', String(p))

      setSearchParams(params, { replace: true })
    },
    [language, hasGoodFirst, setSearchParams]
  )

  const repos = data?.items ?? []
  const hasNextPage = (data?.total_count ?? 0) > page * PER_PAGE

  return (
    <main className="page-shell py-10 sm:py-14">
      <header className="mb-8 max-w-2xl">
        <p className="font-sans text-sm font-medium uppercase tracking-[0.18em] text-ink-muted">
          For new contributors
        </p>
        <h1 className="mt-3 font-display text-4xl text-ink dark:text-white sm:text-5xl">
          Beginner-friendly open source projects
        </h1>
        <p className="mt-3 font-sans text-base leading-relaxed text-ink-muted sm:text-lg">
          Quieter than mega-repos: mid-size ({STARTER_MIN_STARS.toLocaleString()}–
          {STARTER_MAX_STARS.toLocaleString()} stars), pushed in the last{' '}
          {STARTER_MAX_PUSH_AGE_DAYS} days, not archived, forks ≥ 5. Expand a repo to load its open
          issues (that list is not limited to unassigned).
        </p>
        <p className="mt-3 font-sans text-sm text-ink-muted">
          Learn how to choose projects in our{' '}
          <Link
            to="/learn/beginner-friendly-open-source-projects"
            className="font-medium text-ink underline decoration-paper-line underline-offset-4 hover:decoration-ink dark:text-zinc-200"
          >
            beginner-friendly projects guide
          </Link>
          . Looking for popular projects by language?{' '}
          <Link
            to="/repositories"
            className="font-medium text-ink underline decoration-paper-line underline-offset-4 hover:decoration-ink dark:text-zinc-200"
          >
            Browse Repos
          </Link>
          .
        </p>
      </header>

      <div className="mb-3 flex flex-wrap gap-2">
        {LANGUAGES.map((lang) => {
          const active = language === lang.key || (lang.key === null && !language)
          return (
            <button
              key={lang.label}
              type="button"
              onClick={() => sync({ language: lang.key, page: 1 })}
              className={`rounded-md border px-3 py-1.5 font-sans text-sm font-medium transition-colors ${
                active
                  ? 'border-ink bg-ink text-white dark:border-white dark:bg-white dark:text-ink'
                  : 'border-paper-line text-ink-muted hover:border-zinc-400 hover:text-ink dark:border-zinc-700 dark:hover:border-zinc-500 dark:hover:text-white'
              }`}
            >
              {lang.label}
            </button>
          )
        })}
      </div>

      <div className="mb-8 flex flex-wrap items-center gap-3">
        <button
          type="button"
          onClick={() => sync({ hasGoodFirst: !hasGoodFirst, page: 1 })}
          className={`rounded-md border px-3 py-1.5 font-sans text-sm font-medium transition-colors ${
            hasGoodFirst
              ? 'border-ink bg-ink text-white dark:border-white dark:bg-white dark:text-ink'
              : 'border-paper-line text-ink-muted hover:border-zinc-400 hover:text-ink dark:border-zinc-700 dark:hover:border-zinc-500 dark:hover:text-white'
          }`}
        >
          Has good-first issues
        </button>
        <span className="font-sans text-xs text-ink-muted">
          {isLoading ? 'Loading…' : `${repos.length} shown · sorted by recent activity`}
        </span>
      </div>

      <StarterRepoList
        repos={repos}
        isLoading={isLoading}
        error={error}
        page={page}
        hasNextPage={Boolean(hasNextPage)}
        onPageChange={(next) => sync({ page: next })}
      />

      <div className="mx-auto max-w-2xl">
        <SeoFaq items={STARTER_FAQS} />
      </div>
    </main>
  )
}

export default StarterReposPage
