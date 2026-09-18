import { describe, expect, it } from 'vitest'
import {
  FILTER_LANGUAGES,
  ISSUE_KIND_FILTERS,
  LICENSE_FILTERS,
  VALID_ISSUE_KINDS,
} from '../src/constants/filters'

describe('filter constants', () => {
  it('exposes a null All language option first', () => {
    expect(FILTER_LANGUAGES[0]?.key).toBeNull()
    expect(FILTER_LANGUAGES.length).toBeGreaterThan(5)
  })

  it('keeps issue kinds aligned with the validator set', () => {
    expect(ISSUE_KIND_FILTERS.map((k) => k.key).sort()).toEqual(
      [...VALID_ISSUE_KINDS].sort()
    )
  })

  it('includes common open-source licenses', () => {
    expect(LICENSE_FILTERS.some((l) => l.key === 'mit')).toBe(true)
  })
})
