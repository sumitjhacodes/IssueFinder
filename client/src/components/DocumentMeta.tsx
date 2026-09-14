import { useEffect } from 'react'
import { useLocation } from 'react-router-dom'

export const SITE_ORIGIN = 'https://issuefinder.fun'

/** Prefer no trailing slash so canonical matches the live URL browsers use. */
export function absoluteUrl(pathname: string): string {
  if (!pathname || pathname === '/') return SITE_ORIGIN
  const clean = pathname.endsWith('/') ? pathname.slice(0, -1) : pathname
  return `${SITE_ORIGIN}${clean}`
}

function upsertLinkCanonical(href: string) {
  let el = document.querySelector<HTMLLinkElement>('link[rel="canonical"]')
  if (!el) {
    el = document.createElement('link')
    el.rel = 'canonical'
    document.head.appendChild(el)
  }
  el.href = href
}

function upsertMeta(attr: 'property' | 'name', key: string, content: string) {
  let el = document.querySelector<HTMLMetaElement>(`meta[${attr}="${key}"]`)
  if (!el) {
    el = document.createElement('meta')
    el.setAttribute(attr, key)
    document.head.appendChild(el)
  }
  el.content = content
}

/**
 * Keeps canonical + og:url aligned with the live page URL (SPA-safe).
 */
export default function DocumentMeta() {
  const { pathname } = useLocation()

  useEffect(() => {
    const url = absoluteUrl(pathname)
    upsertLinkCanonical(url)
    upsertMeta('property', 'og:url', url)
  }, [pathname])

  return null
}
