import React from 'react'
import { LICENSE_FILTERS, REPO_FILTER_LANGUAGES } from '../constants/filters'

type FiltersPanelProps = {
  className?: string
  selectedLanguage: string | null
  onChangeLanguage: (language: string | null) => void
  selectedLicense: string | null
  onChangeLicense: (license: string | null) => void
}

/** Compact language + license filters for the Repositories page. */
const FiltersPanel: React.FC<FiltersPanelProps> = ({
  className = '',
  selectedLanguage,
  onChangeLanguage,
  selectedLicense,
  onChangeLicense,
}) => {
  const hasActive = Boolean(selectedLanguage || selectedLicense)

  return (
    <aside
      className={`rounded-lg border border-paper-line bg-white dark:border-zinc-800 dark:bg-zinc-900 ${className}`}
    >
      <div className="p-4 sm:p-5">
        <div className="mb-5 flex items-center justify-between border-b border-paper-line pb-3 dark:border-zinc-800">
          <h2 className="text-sm font-semibold uppercase tracking-wide text-ink-muted">Filters</h2>
          {hasActive ? (
            <button
              type="button"
              onClick={() => {
                onChangeLanguage(null)
                onChangeLicense(null)
              }}
              className="text-xs font-medium text-accent hover:underline"
            >
              Clear
            </button>
          ) : null}
        </div>

        <div className="space-y-5">
          <div>
            <p className="mb-2 text-xs font-semibold uppercase tracking-wide text-ink-muted">
              Language
            </p>
            <div className="flex max-h-48 flex-col gap-1 overflow-y-auto pr-1">
              {REPO_FILTER_LANGUAGES.map((lang) => {
                const active =
                  selectedLanguage === lang.key || (lang.key === null && !selectedLanguage)
                return (
                  <button
                    key={lang.label}
                    type="button"
                    onClick={() => onChangeLanguage(lang.key)}
                    className={`rounded-md px-3 py-1.5 text-left text-sm transition-colors ${
                      active
                        ? 'bg-ink text-white dark:bg-white dark:text-ink'
                        : 'text-ink-muted hover:bg-zinc-100 dark:hover:bg-zinc-800'
                    }`}
                  >
                    {lang.label}
                  </button>
                )
              })}
            </div>
          </div>

          <div>
            <p className="mb-2 text-xs font-semibold uppercase tracking-wide text-ink-muted">
              License
            </p>
            <div className="flex flex-col gap-1">
              {LICENSE_FILTERS.map((license) => {
                const active =
                  selectedLicense === license.key || (license.key === null && !selectedLicense)
                return (
                  <button
                    key={license.label}
                    type="button"
                    onClick={() => onChangeLicense(license.key)}
                    className={`rounded-md px-3 py-1.5 text-left text-sm transition-colors ${
                      active
                        ? 'bg-ink text-white dark:bg-white dark:text-ink'
                        : 'text-ink-muted hover:bg-zinc-100 dark:hover:bg-zinc-800'
                    }`}
                  >
                    {license.label}
                  </button>
                )
              })}
            </div>
          </div>
        </div>
      </div>
    </aside>
  )
}

export default FiltersPanel
