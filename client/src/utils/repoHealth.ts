export type RepoHealthInfo = {
  isHealthy: boolean
  /** true when we could not verify (rate limit / network) — keep the issue visible */
  unknown?: boolean
  stars: number
  forks: number
  pushedAt: string | null
}

/** Align with search query: stars:>19 and recently active code */
export const HEALTH_THRESHOLDS = {
  minStars: 20,
  minForks: 5,
  maxDaysSincePush: 45,
} as const

type GitHubRepoResponse = {
  stargazers_count: number
  forks_count: number
  archived: boolean
  disabled?: boolean
  pushed_at: string | null
}

const memory = new Map<string, { health: RepoHealthInfo; expiresAt: number }>()
const MEMORY_TTL = 6 * 60 * 60 * 1000
const STORAGE_PREFIX = 'ih_repo_health_v2:'

export function evaluateRepoHealth(repoData: GitHubRepoResponse): boolean {
  if (repoData.archived || repoData.disabled) return false

  const daysSincePush = repoData.pushed_at
    ? (Date.now() - new Date(repoData.pushed_at).getTime()) / (1000 * 60 * 60 * 24)
    : Infinity

  if (daysSincePush > HEALTH_THRESHOLDS.maxDaysSincePush) return false

  return (
    repoData.stargazers_count >= HEALTH_THRESHOLDS.minStars ||
    repoData.forks_count >= HEALTH_THRESHOLDS.minForks
  )
}

function readCache(repoUrl: string): RepoHealthInfo | null {
  const mem = memory.get(repoUrl)
  if (mem && mem.expiresAt > Date.now()) return mem.health

  try {
    const raw = localStorage.getItem(STORAGE_PREFIX + repoUrl)
    if (!raw) return null
    const parsed = JSON.parse(raw) as { health: RepoHealthInfo; expiresAt: number }
    if (!parsed?.health || parsed.expiresAt < Date.now()) return null
    memory.set(repoUrl, parsed)
    return parsed.health
  } catch {
    return null
  }
}

function writeCache(repoUrl: string, health: RepoHealthInfo): void {
  const entry = { health, expiresAt: Date.now() + MEMORY_TTL }
  memory.set(repoUrl, entry)
  try {
    localStorage.setItem(STORAGE_PREFIX + repoUrl, JSON.stringify(entry))
  } catch {
    /* ignore */
  }
}

export async function fetchRepositoryHealth(repoUrl: string): Promise<RepoHealthInfo> {
  const cached = readCache(repoUrl)
  if (cached) return cached

  const unknown: RepoHealthInfo = {
    isHealthy: true,
    unknown: true,
    stars: 0,
    forks: 0,
    pushedAt: null,
  }

  try {
    const parts = repoUrl.replace('https://api.github.com/repos/', '').split('/')
    if (parts.length < 2) {
      return { isHealthy: false, stars: 0, forks: 0, pushedAt: null }
    }

    const [owner, repo] = parts
    const response = await fetch(`https://api.github.com/repos/${owner}/${repo}`, {
      headers: { Accept: 'application/vnd.github+json', 'User-Agent': 'IssueFinder' },
    })

    if (response.status === 403 || response.status === 429) {
      return unknown
    }

    if (!response.ok) {
      return { isHealthy: false, stars: 0, forks: 0, pushedAt: null }
    }

    const repoData: GitHubRepoResponse = await response.json()
    const health: RepoHealthInfo = {
      isHealthy: evaluateRepoHealth(repoData),
      stars: repoData.stargazers_count,
      forks: repoData.forks_count,
      pushedAt: repoData.pushed_at,
    }
    writeCache(repoUrl, health)
    return health
  } catch {
    return unknown
  }
}

/** Parallel health checks with a small concurrency cap (avoids sequential N+1 lag). */
export async function fetchRepositoryHealthBatch(
  repoUrls: string[],
  concurrency = 6
): Promise<Record<string, RepoHealthInfo>> {
  const uniqueUrls = Array.from(new Set(repoUrls.filter(Boolean)))
  const results: Record<string, RepoHealthInfo> = {}
  let index = 0

  async function worker() {
    while (index < uniqueUrls.length) {
      const i = index++
      const url = uniqueUrls[i]
      results[url] = await fetchRepositoryHealth(url)
    }
  }

  const workers = Array.from({ length: Math.min(concurrency, uniqueUrls.length) }, () => worker())
  await Promise.all(workers)
  return results
}
