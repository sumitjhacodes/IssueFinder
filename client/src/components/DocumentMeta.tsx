import { useEffect } from 'react'
import { useLocation } from 'react-router-dom'
import { absoluteUrl } from '../utils/siteUrl'
import { getJsonLdForPath, getSeoForPath, normalizePathname } from '../constants/seo'

const JSON_LD_ATTR = 'data-issuefinder-jsonld'

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

function setRobots(noindex: boolean) {
  upsertMeta('name', 'robots', noindex ? 'noindex, follow' : 'index, follow')
}

function clearJsonLd() {
  document.querySelectorAll(`script[${JSON_LD_ATTR}]`).forEach((el) => el.remove())
}

function injectJsonLd(blocks: Record<string, unknown>[]) {
  clearJsonLd()
  for (const block of blocks) {
    const script = document.createElement('script')
    script.type = 'application/ld+json'
    script.setAttribute(JSON_LD_ATTR, 'true')
    script.textContent = JSON.stringify(block)
    document.head.appendChild(script)
  }
}

/**
 * Per-route title, description, canonical, Open Graph, Twitter, robots, and JSON-LD.
 */
export default function DocumentMeta() {
  const { pathname } = useLocation()

  useEffect(() => {
    const path = normalizePathname(pathname)
    const seo = getSeoForPath(path)
    const url = absoluteUrl(path)

    document.title = seo.title
    upsertMeta('name', 'description', seo.description)
    setRobots(Boolean(seo.noindex))

    upsertLinkCanonical(url)
    upsertMeta('property', 'og:url', url)
    upsertMeta('property', 'og:title', seo.title)
    upsertMeta('property', 'og:description', seo.description)
    upsertMeta('name', 'twitter:title', seo.title)
    upsertMeta('name', 'twitter:description', seo.description)

    injectJsonLd(getJsonLdForPath(path))
  }, [pathname])

  return null
}
