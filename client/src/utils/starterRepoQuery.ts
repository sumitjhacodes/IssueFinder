import { toGitHubLanguageQualifier } from './queryBuilder'

/** Mid-size band: real projects, not mega-crowded */
export const STARTER_MIN_STARS = 100
export const STARTER_MAX_STARS = 2500

/** Recent push = still shipping (proxy for merge activity) */
export const STARTER_MAX_PUSH_AGE_DAYS = 30

export type StarterRepoQueryParams = {
  language?: string | null
  hasGoodFirst?: boolean
}

function formatDate(date: Date): string {
  const y = date.getFullYear()
  const m = String(date.getMonth() + 1).padStart(2, '0')
  const d = String(date.getDate()).padStart(2, '0')
  return `${y}-${m}-${d}`
}

/**
 * Active mid-size repos where newcomers have more room to land a PR
 * than on mega-popular projects.
 */
export function buildStarterRepoQuery(params: StarterRepoQueryParams = {}): string {
  const pushedAfter = new Date(Date.now() - STARTER_MAX_PUSH_AGE_DAYS * 24 * 60 * 60 * 1000)

  const parts = [
    `stars:${STARTER_MIN_STARS}..${STARTER_MAX_STARS}`,
    'forks:>=5',
    'fork:false',
    'archived:false',
    `pushed:>${formatDate(pushedAfter)}`,
  ]

  if (params.language) {
    parts.push(toGitHubLanguageQualifier(params.language))
  }

  if (params.hasGoodFirst) {
    parts.push('good-first-issues:>0')
  }

  return parts.join(' ')
}
