import { describe, expect, it } from 'vitest'
import {
  getJsonLdForPath,
  getSeoForPath,
  normalizePathname,
  PUBLIC_SEO_PATHS,
} from '../src/constants/seo'

describe('seo helpers', () => {
  it('normalizes trailing slashes', () => {
    expect(normalizePathname('/learn/')).toBe('/learn')
    expect(normalizePathname('/')).toBe('/')
  })

  it('returns dedicated meta for public routes', () => {
    for (const path of PUBLIC_SEO_PATHS) {
      const seo = getSeoForPath(path)
      expect(seo.title.length).toBeGreaterThan(10)
      expect(seo.description.length).toBeGreaterThan(40)
    }
  })

  it('noindexes search results', () => {
    expect(getSeoForPath('/search').noindex).toBe(true)
  })

  it('adds HowTo JSON-LD on beginner guide', () => {
    const blocks = getJsonLdForPath('/beginner-guide')
    expect(blocks.some((b) => b['@type'] === 'HowTo')).toBe(true)
  })

  it('adds FAQ + breadcrumbs on learn guides', () => {
    const blocks = getJsonLdForPath('/learn/good-first-issues')
    expect(blocks.some((b) => b['@type'] === 'FAQPage')).toBe(true)
    expect(blocks.some((b) => b['@type'] === 'BreadcrumbList')).toBe(true)
  })
})
