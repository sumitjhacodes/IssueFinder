import { describe, expect, it } from 'vitest'
import { absoluteUrl, SITE_ORIGIN } from '../src/utils/siteUrl'

describe('absoluteUrl', () => {
  it('uses origin for root and strips trailing slashes', () => {
    expect(absoluteUrl('/')).toBe(SITE_ORIGIN)
    expect(absoluteUrl('')).toBe(SITE_ORIGIN)
    expect(absoluteUrl('/issues')).toBe(`${SITE_ORIGIN}/issues`)
    expect(absoluteUrl('/learn/')).toBe(`${SITE_ORIGIN}/learn`)
  })
})
