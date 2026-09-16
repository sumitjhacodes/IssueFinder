import { useEffect, useRef, useState } from 'react'

export type RepoOpenIssue = {
  id: number
  number: number
  title: string
  html_url: string
  created_at: string
  updated_at?: string
  comments?: number
  labels: Array<{ name?: string; color?: string }>
}

type UseFetchRepoOpenIssuesResult = {
  issues: RepoOpenIssue[]
  isLoading: boolean
  error: Error | null
}

/**
 * Open issues for one repo — no stars/date filters (Starter "View issues" expand).
 */
export function useFetchRepoOpenIssues(repoFullName: string | null): UseFetchRepoOpenIssuesResult {
  const [issues, setIssues] = useState<RepoOpenIssue[]>([])
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<Error | null>(null)
  const abortRef = useRef<AbortController | null>(null)

  useEffect(() => {
    if (!repoFullName) {
      setIssues([])
      setError(null)
      setIsLoading(false)
      return
    }

    if (abortRef.current) abortRef.current.abort()
    const controller = new AbortController()
    abortRef.current = controller

    async function fetchIssues() {
      setIsLoading(true)
      setError(null)
      try {
        const encoded = encodeURIComponent(`repo:${repoFullName} is:open is:issue`)
        const url = `https://api.github.com/search/issues?q=${encoded}&sort=updated&order=desc&per_page=20`

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

        const json = await response.json()
        setIssues((json.items ?? []) as RepoOpenIssue[])
      } catch (err: unknown) {
        if ((err as { name?: string })?.name === 'AbortError') return
        setError(err as Error)
        setIssues([])
      } finally {
        setIsLoading(false)
      }
    }

    fetchIssues()

    return () => {
      controller.abort()
    }
  }, [repoFullName])

  return { issues, isLoading, error }
}
