import { describe, expect, it } from 'vitest'
import {
  buildStarterRepoQuery,
  STARTER_MAX_STARS,
  STARTER_MIN_STARS,
} from '../src/utils/starterRepoQuery'

describe('buildStarterRepoQuery', () => {
  it('targets mid-size non-archived original repos with a recent push', () => {
    const q = buildStarterRepoQuery()
    expect(q).toContain(`stars:${STARTER_MIN_STARS}..${STARTER_MAX_STARS}`)
    expect(q).toContain('forks:>=5')
    expect(q).toContain('fork:false')
    expect(q).toContain('archived:false')
    expect(q).toMatch(/pushed:>\d{4}-\d{2}-\d{2}/)
  })

  it('adds language and optional good-first-issues filter', () => {
    const q = buildStarterRepoQuery({ language: 'python', hasGoodFirst: true })
    expect(q).toContain('language:Python')
    expect(q).toContain('good-first-issues:>0')
  })
})
