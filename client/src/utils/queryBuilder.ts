export type IssueKind =
  | 'all'
  | 'good-first'
  | 'help-wanted'
  | 'bug'
  | 'documentation'

export type QueryBuilderParams = {
  searchTerm?: string
  selectedLanguage?: string | null
  selectedLastActivity?: string | null
  selectedRepo?: string | null
  selectedKind?: IssueKind | null
  selectedCategories?: string[]
  selectedDifficulty?: string | null
  selectedLabels?: string[]
  selectedType?: string | null
  selectedFramework?: string | null
  selectedLicense?: string | null
}

/** URL/UI slug → GitHub language name */
export const GITHUB_LANGUAGE_NAMES: Record<string, string> = {
  python: 'Python',
  typescript: 'TypeScript',
  javascript: 'JavaScript',
  rust: 'Rust',
  go: 'Go',
  java: 'Java',
  cpp: 'C++',
  c: 'C',
  csharp: 'C#',
  php: 'PHP',
  ruby: 'Ruby',
  swift: 'Swift',
  kotlin: 'Kotlin',
  solidity: 'Solidity',
}

/** Popular enough to be maintained, low enough that every language still returns results */
export const MIN_REPO_STARS = 100

function formatDate(date: Date): string {
  const y = date.getFullYear()
  const m = String(date.getMonth() + 1).padStart(2, '0')
  const d = String(date.getDate()).padStart(2, '0')
  return `${y}-${m}-${d}`
}

function labelForKind(kind: IssueKind | null | undefined): string | null {
  switch (kind) {
    case 'good-first':
      return 'good first issue'
    case 'help-wanted':
      return 'help wanted'
    case 'bug':
      return 'bug'
    case 'documentation':
      return 'documentation'
    case 'all':
    case null:
    case undefined:
      return null
    default:
      return null
  }
}

function resolveLabel(params: QueryBuilderParams): string | null {
  if (params.selectedKind != null) return labelForKind(params.selectedKind)

  if (params.selectedDifficulty === 'intermediate') return 'help wanted'
  if (params.selectedDifficulty === 'beginner') return 'good first issue'
  if (params.selectedCategories?.length && !params.selectedCategories.includes('all')) {
    return params.selectedCategories[0]
  }
  if (params.selectedType) return params.selectedType
  if (params.selectedLabels?.length) return params.selectedLabels[0]

  // Default: beginner-friendly labeled issues
  return 'good first issue'
}

function activityDays(selected: string | null | undefined): number | null {
  switch (selected) {
    case 'last-week':
      return 7
    case 'last-2weeks':
      return 14
    case 'last-month':
      return 30
    case 'last-3months':
      return 90
    case 'any':
    case null:
    case undefined:
      return null
    default:
      return null
  }
}

export function toGitHubLanguageQualifier(slugOrName: string): string {
  const key = slugOrName.trim().toLowerCase()
  const name = GITHUB_LANGUAGE_NAMES[key] ?? slugOrName.trim()
  if (/[^a-zA-Z0-9]/.test(name)) return `language:"${name}"`
  return `language:${name}`
}

/**
 * Open issues on popular repos, with optional label + language.
 * Avoid stacking filters that zero out results.
 */
export function buildGitHubQuery(params: QueryBuilderParams): string {
  const parts = ['is:open', 'is:issue', `stars:>${MIN_REPO_STARS - 1}`]

  const label = resolveLabel(params)
  if (label) parts.push(`label:"${label}"`)

  if (params.selectedRepo?.trim()) {
    parts.push(`repo:${params.selectedRepo.trim()}`)
  }

  const days = activityDays(params.selectedLastActivity)
  if (days != null) {
    parts.push(`updated:>${formatDate(new Date(Date.now() - days * 24 * 60 * 60 * 1000))}`)
  }

  if (params.selectedLanguage) {
    parts.push(toGitHubLanguageQualifier(params.selectedLanguage))
  }

  if (params.selectedFramework) {
    parts.push(params.selectedFramework)
  }

  if (params.searchTerm?.trim()) {
    parts.push(params.searchTerm.trim())
  }

  return parts.join(' ')
}
