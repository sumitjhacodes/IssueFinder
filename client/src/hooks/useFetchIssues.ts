import { useEffect, useRef, useState, useMemo } from 'react'
import {
  getIssuesCacheHit,
  setIssuesCached,
  shareInflight,
} from '../utils/requestCache'
import {
  isRateLimited,
  updateRateLimitInfo,
  getRateLimitResetTime,
  clearRateLimitInfo,
} from '../utils/rateLimitManager'

export type GithubIssueItem = {
  id: number
  html_url: string
  title: string
  state: 'open' | 'closed'
  number: number
  repository_url: string
  labels: Array<{ name?: string; color?: string }>
  created_at: string
  updated_at?: string
  comments?: number
}

export type GithubSearchResponse = {
  total_count: number
  incomplete_results: boolean
  items: GithubIssueItem[]
}

type UseFetchIssuesResult = {
  data: GithubSearchResponse | null
  isLoading: boolean
  error: Error | null
}

async function requestIssues(
  query: string,
  page: number,
  perPage: number
): Promise<GithubSearchResponse> {
  const url = `https://api.github.com/search/issues?q=${encodeURIComponent(query)}&sort=updated&order=desc&page=${page}&per_page=${perPage}`

  const response = await fetch(url, {
    method: 'GET',
    headers: {
      Accept: 'application/vnd.github+json',
      'User-Agent': 'IssueFinder',
    },
  })

  updateRateLimitInfo(response.headers)

  if (!response.ok) {
    if (response.status === 403 || response.status === 429) {
      const remaining = response.headers.get('X-RateLimit-Remaining')
      if (remaining === '0' || response.status === 429) {
        throw new Error('Rate limit')
      }
    }
    if (response.status === 422) throw new Error('Invalid search query.')
    if (response.status >= 500) throw new Error('GitHub is temporarily unavailable.')
    throw new Error('Unable to fetch issues.')
  }

  return response.json()
}

function cacheKeyFor(query: string, page: number, perPage: number) {
  return `issues_v2_${query}_${page}_${perPage}`
}

export function prefetchIssues(query: string, page = 1, perPage = 30): void {
  if (!query?.trim() || typeof window === 'undefined' || isRateLimited()) return
  const key = cacheKeyFor(query, page, perPage)
  if (getIssuesCacheHit(key)?.fresh) return

  void shareInflight(key, async () => {
    const json = await requestIssues(query, page, perPage)
    setIssuesCached(key, json)
    return json
  }).catch(() => {})
}

export function useFetchIssues(
  query: string,
  page: number = 1,
  perPage: number = 30
): UseFetchIssuesResult {
  const cacheKey = useMemo(() => cacheKeyFor(query, page, perPage), [query, page, perPage])
  const initial = getIssuesCacheHit<GithubSearchResponse>(cacheKey)

  const [data, setData] = useState<GithubSearchResponse | null>(() => initial?.data ?? null)
  const [isLoading, setIsLoading] = useState(() => !initial?.fresh)
  const [error, setError] = useState<Error | null>(null)
  const abortRef = useRef(false)
  const dataKeyRef = useRef(cacheKey)

  useEffect(() => {
    abortRef.current = false
    dataKeyRef.current = cacheKey

    async function run() {
      setError(null)

      if (!query.trim()) {
        setData({ total_count: 0, incomplete_results: false, items: [] })
        setIsLoading(false)
        return
      }

      const hit = getIssuesCacheHit<GithubSearchResponse>(cacheKey)
      if (hit?.fresh) {
        setData(hit.data)
        setIsLoading(false)
        return
      }

      if (hit) {
        setData(hit.data)
      } else {
        setData(null)
      }

      if (isRateLimited()) {
        setIsLoading(false)
        const reset = getRateLimitResetTime()
        if (reset) {
          const wait = Math.min(reset - Date.now() + 500, 60_000)
          if (wait > 0) {
            window.setTimeout(() => {
              if (!abortRef.current && dataKeyRef.current === cacheKey) void run()
            }, wait)
          }
        }
        return
      }

      setIsLoading(true)

      try {
        const json = await shareInflight(cacheKey, () => requestIssues(query, page, perPage))
        if (abortRef.current || dataKeyRef.current !== cacheKey) return
        setIssuesCached(cacheKey, json)
        setData(json)
      } catch (err) {
        if (abortRef.current || dataKeyRef.current !== cacheKey) return
        const msg = (err as Error).message || ''
        if (msg.includes('Rate limit')) {
          // keep any stale hit; show wait message via error only if empty
          if (!hit) setError(new Error('GitHub rate limit — try again in a minute.'))
        } else {
          setError(err as Error)
          if (!hit) setData({ total_count: 0, incomplete_results: false, items: [] })
        }
      } finally {
        if (!abortRef.current && dataKeyRef.current === cacheKey) setIsLoading(false)
      }
    }

    void run()
    return () => {
      abortRef.current = true
    }
  }, [query, page, perPage, cacheKey])

  // One-time cleanup of older incorrect "always limited" localStorage state
  useEffect(() => {
    try {
      const remaining = localStorage.getItem('github_rate_limit_remaining')
      if (remaining !== null && parseInt(remaining, 10) > 0) {
        clearRateLimitInfo()
      }
    } catch {
      /* ignore */
    }
  }, [])

  return { data, isLoading, error }
}
