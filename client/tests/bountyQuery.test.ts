import { describe, expect, it } from 'vitest'
import {
  BOUNTY_MAX_AGE_DAYS,
  buildBountyQuery,
  detectBountyPlatform,
  hasMoneyReward,
  isFreshBounty,
  parseBountyReward,
} from '../src/utils/bountyQuery'
import { MIN_REPO_STARS } from '../src/utils/queryBuilder'

describe('buildBountyQuery', () => {
  it('requires open unassigned recently updated bounty-labeled issues', () => {
    const q = buildBountyQuery({ source: 'bounty' })
    expect(q).toContain('is:open')
    expect(q).toContain('is:issue')
    expect(q).toContain('no:assignee')
    expect(q).toContain('label:bounty')
    expect(q).toContain(`stars:>${MIN_REPO_STARS - 1}`)
    expect(q).toMatch(/updated:>\d{4}-\d{2}-\d{2}/)
  })

  it('uses platform-specific filters', () => {
    expect(buildBountyQuery({ source: 'algora' })).toContain('"algora.io"')
    expect(buildBountyQuery({ source: 'issuehunt' })).toContain('label:issuehunt')
    expect(buildBountyQuery({ source: 'bountysource' })).toContain('label:bountysource')
  })
})

describe('parseBountyReward / hasMoneyReward', () => {
  it('parses fiat amounts and rejects token-only text', () => {
    expect(parseBountyReward('Fix bug $250')).toEqual({ display: '$250', amount: 250 })
    expect(parseBountyReward('Reward €100')).toEqual({ display: '€100', amount: 100 })
    expect(parseBountyReward('Pay ₹5000')).toEqual({ display: '₹5000', amount: 5000 })
    expect(hasMoneyReward('Bounty: 100 RTC tokens')).toBe(false)
    expect(hasMoneyReward('Cash bounty $50', [{ name: 'bounty' }])).toBe(true)
  })
})

describe('isFreshBounty', () => {
  it(`is true within ${BOUNTY_MAX_AGE_DAYS} days and false when older`, () => {
    const fresh = new Date(Date.now() - 10 * 86400000).toISOString()
    const stale = new Date(Date.now() - (BOUNTY_MAX_AGE_DAYS + 5) * 86400000).toISOString()
    expect(isFreshBounty(fresh)).toBe(true)
    expect(isFreshBounty(stale)).toBe(false)
    expect(isFreshBounty(undefined, undefined)).toBe(false)
  })
})

describe('detectBountyPlatform', () => {
  it('detects known platforms from text and labels', () => {
    expect(detectBountyPlatform('paid via algora.io')).toBe('Algora')
    expect(detectBountyPlatform('fix', [{ name: 'issuehunt' }])).toBe('IssueHunt')
    expect(detectBountyPlatform('generic bounty')).toBe('Bounty')
  })
})
