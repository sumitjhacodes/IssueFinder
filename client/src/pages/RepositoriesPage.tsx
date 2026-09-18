import React, { useState, useEffect } from 'react'
import { Link, useSearchParams } from 'react-router-dom'
import FiltersPanel from '../components/FiltersPanel'
import RepositoryList from '../components/RepositoryList'

const RepositoriesPage: React.FC = () => {
  const [searchParams] = useSearchParams()
  const [selectedLanguage, setSelectedLanguage] = useState<string | null>(null)
  const [selectedLicense, setSelectedLicense] = useState<string | null>(null)
  const [showMobileFilters, setShowMobileFilters] = useState<boolean>(false)

  useEffect(() => {
    const languageParam = searchParams.get('language')
    if (languageParam) {
      setSelectedLanguage(languageParam)
    }
  }, [searchParams])

  return (
    <main className="mx-auto max-w-7xl px-4 py-8">
      <header className="mb-8 space-y-3">
        <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4">
          <div className="flex-1">
            <h1 className="font-display text-3xl font-medium text-ink dark:text-white">
              Popular repositories for contributors
            </h1>
            <p className="mt-2 max-w-2xl text-sm text-ink-muted">
              Popular repos by language (50+ stars, not archived). Want quieter mid-size repos pushed
              in the last 30 days? Try{' '}
              <Link to="/starter" className="font-medium text-accent hover:underline">
                beginner-friendly starter projects
              </Link>
              .
            </p>
          </div>
          <Link
            to="/issues"
            className="inline-flex items-center gap-2 rounded-lg border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 transition-colors hover:bg-gray-50 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-300 dark:hover:bg-gray-700"
          >
            Browse issues
          </Link>
        </div>
      </header>

      <div className="mb-4 flex justify-end md:hidden">
        <button
          type="button"
          onClick={() => setShowMobileFilters((prev) => !prev)}
          className="inline-flex items-center gap-2 rounded-full border border-slate-300 bg-white px-3 py-1.5 text-xs font-medium text-slate-700 transition hover:border-slate-400 hover:text-slate-900 focus:outline-none focus-visible:ring-2 focus-visible:ring-slate-200 dark:border-gray-700 dark:bg-gray-800 dark:text-slate-200 dark:hover:border-gray-600 dark:hover:text-white"
        >
          {showMobileFilters ? 'Hide filters' : 'Show filters'}
        </button>
      </div>

      {showMobileFilters ? (
        <div className="mb-6 md:hidden">
          <FiltersPanel
            className="rounded-2xl"
            selectedLanguage={selectedLanguage}
            onChangeLanguage={setSelectedLanguage}
            selectedLicense={selectedLicense}
            onChangeLicense={setSelectedLicense}
          />
        </div>
      ) : null}

      <div className="grid grid-cols-1 gap-6 md:grid-cols-12">
        <aside className="hidden md:col-span-3 md:block">
          <FiltersPanel
            className="rounded-2xl md:sticky md:top-4"
            selectedLanguage={selectedLanguage}
            onChangeLanguage={setSelectedLanguage}
            selectedLicense={selectedLicense}
            onChangeLicense={setSelectedLicense}
          />
        </aside>
        <div className="md:col-span-9">
          <RepositoryList
            className="rounded-2xl"
            language={selectedLanguage}
            license={selectedLicense}
          />
        </div>
      </div>
    </main>
  )
}

export default RepositoriesPage
