import React, { useMemo } from 'react'
import { Link } from 'react-router-dom'
import { useSearch } from '../contexts/SearchContext'
import IssueList from '../components/IssueList'
import { buildGitHubQuery } from '../utils/queryBuilder'
import { TAGLINE } from '../constants/brand'

const SearchResultsPage: React.FC = () => {
  const { submittedSearch, clearSearch } = useSearch()

  const query = useMemo(
    () =>
      buildGitHubQuery({
        searchTerm: submittedSearch || undefined,
        selectedLastActivity: 'any',
        selectedKind: 'good-first',
      }),
    [submittedSearch]
  )

  return (
    <main className="mx-auto max-w-3xl px-4 py-8 sm:px-6 sm:py-10">
      <div className="mb-6 flex items-end justify-between gap-4">
        <div>
          <h1 className="font-display text-3xl font-medium text-ink dark:text-white">Search</h1>
          <p className="mt-1 text-sm text-ink-muted">{TAGLINE}</p>
          {submittedSearch && (
            <p className="mt-2 text-sm text-ink-muted">
              Results for <span className="font-semibold text-ink dark:text-zinc-100">“{submittedSearch}”</span>{' '}
              <button type="button" onClick={clearSearch} className="text-accent hover:underline">
                Clear
              </button>
            </p>
          )}
        </div>
        <Link to="/issues" className="btn-secondary">
          Browse
        </Link>
      </div>
      <IssueList query={query} />
    </main>
  )
}

export default SearchResultsPage
