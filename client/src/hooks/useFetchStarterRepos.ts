import { useEffect, useRef, useState } from 'react'
import { buildStarterRepoQuery } from '../utils/starterRepoQuery'

export type StarterRepository = {
  id: number
  full_name: string
  name: string
  owner: {
    login: string
    avatar_url: string
  }
  html_url: string
  description: string | null
  stargazers_count: number
  forks_count: number
  language: string | null
  open_issues_count: number
  updated_at: string
  pushed_at: string
  topics: string[]
  license: {
    key: string | null
    name: string | null
    spdx_id: string | null
  } | null
}

type GithubRepositoriesResponse = {
  total_count: number
  incomplete_results: boolean
  items: StarterRepository[]
}

type UseFetchStarterReposResult = {
  data: GithubRepositoriesResponse | null
  isLoading: boolean
  error: Error | null
}

export function useFetchStarterRepos(
  language: string | null,
  hasGoodFirst: boolean,
  page: number = 1,
  perPage: number = 24
): UseFetchStarterReposResult {
  const [data, setData] = useState<GithubRepositoriesResponse | null>(null)
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<Error | null>(null)
  const abortRef = useRef<AbortController | null>(null)

  useEffect(() => {
    if (abortRef.current) {
      abortRef.current.abort()
    }
    const controller = new AbortController()
    abortRef.current = controller

    async function fetchRepos() {
      setIsLoading(true)
      setError(null)
      try {
        const query = buildStarterRepoQuery({ language, hasGoodFirst })
        const url = `https://api.github.com/search/repositories?q=${encodeURIComponent(query)}&sort=updated&order=desc&page=${page}&per_page=${perPage}`

        const response = await fetch(url, {
          method: 'GET',
          headers: {
            Accept: 'application/vnd.github+json',
            'User-Agent': 'IssueFinder',
          },
          signal: controller.signal,
        })

        if (!response.ok) {
          throw new Error(`GitHub API error: ${response.status} ${response.statusText}`)
        }

        const json: GithubRepositoriesResponse = await response.json()
        const items = (json.items ?? []).filter((repo) => repo.open_issues_count > 0)

        setData({
          ...json,
          items,
        })
      } catch (err: unknown) {
        if ((err as { name?: string })?.name === 'AbortError') return
        setError(err as Error)
      } finally {
        setIsLoading(false)
      }
    }

    fetchRepos()

    return () => {
      controller.abort()
    }
  }, [language, hasGoodFirst, page, perPage])

  return { data, isLoading, error }
}
