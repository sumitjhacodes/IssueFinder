import { toGitHubLanguageQualifier, MIN_REPO_STARS } from './queryBuilder'

export type BountySource = 'bounty' | 'bountysource' | 'issuehunt' | 'algora'

export const BOUNTY_SOURCES: { key: BountySource; label: string }[] = [
  { key: 'bounty', label: 'Bounty label' },
  { key: 'bountysource', label: 'Bountysource' },
  { key: 'issuehunt', label: 'IssueHunt' },
  { key: 'algora', label: 'Algora' },
]

/** Drop stale listings that look open but are no longer workable */
export const BOUNTY_MAX_AGE_DAYS = 45

export type BountyQueryParams = {
  source?: BountySource
  language?: string | null
  popularOnly?: boolean
}

export type ParsedReward = {
  /** Display string e.g. "$600" */
  display: string
  /** Numeric amount for sorting (best-effort USD) */
  amount: number
}

function formatDate(date: Date): string {
  const y = date.getFullYear()
  const m = String(date.getMonth() + 1).padStart(2, '0')
  const d = String(date.getDate()).padStart(2, '0')
  return `${y}-${m}-${d}`
}

/**
 * Real paid-issue discovery via GitHub Search.
 * Prefer recently updated + unassigned so results stay available.
 */
export function buildBountyQuery(params: BountyQueryParams = {}): string {
  const source = params.source ?? 'bounty'
  const since = new Date(Date.now() - BOUNTY_MAX_AGE_DAYS * 24 * 60 * 60 * 1000)

  const parts = [
    'is:open',
    'is:issue',
    'no:assignee',
    `updated:>${formatDate(since)}`,
  ]

  switch (source) {
    case 'bountysource':
      parts.push('label:bountysource')
      break
    case 'issuehunt':
      parts.push('label:issuehunt')
      break
    case 'algora':
      parts.push('"algora.io"')
      break
    case 'bounty':
    default:
      parts.push('label:bounty')
      break
  }

  const popular = params.popularOnly !== false
  if (popular && source === 'bounty') {
    parts.push(`stars:>${MIN_REPO_STARS - 1}`)
  }

  if (params.language) {
    parts.push(toGitHubLanguageQualifier(params.language))
  }

  return parts.join(' ')
}

/**
 * Only fiat / cash rewards — not tokens (RTC, MRG, etc.).
 * Looks at title, labels, and optional issue body.
 */
export function parseBountyReward(
  title: string,
  labels: Array<{ name?: string }> = [],
  body?: string | null
): ParsedReward | null {
  const blob = [title, ...labels.map((l) => l.name || ''), body || ''].join(' ')

  const patterns: Array<{ re: RegExp; currency: string }> = [
    { re: /\$\s*([\d,]+(?:\.\d{1,2})?)/, currency: 'USD' },
    { re: /([\d,]+(?:\.\d{1,2})?)\s*(?:USD|US\$)\b/i, currency: 'USD' },
    { re: /€\s*([\d,]+(?:\.\d{1,2})?)/, currency: 'EUR' },
    { re: /([\d,]+(?:\.\d{1,2})?)\s*EUR\b/i, currency: 'EUR' },
    { re: /£\s*([\d,]+(?:\.\d{1,2})?)/, currency: 'GBP' },
    { re: /([\d,]+(?:\.\d{1,2})?)\s*GBP\b/i, currency: 'GBP' },
    { re: /₹\s*([\d,]+(?:\.\d{1,2})?)/, currency: 'INR' },
    { re: /([\d,]+(?:\.\d{1,2})?)\s*INR\b/i, currency: 'INR' },
  ]

  let best: ParsedReward | null = null

  for (const { re, currency } of patterns) {
    const match = blob.match(re)
    if (!match) continue
    const amount = parseFloat(match[1].replace(/,/g, ''))
    if (!Number.isFinite(amount) || amount < 1) continue

    const display =
      currency === 'USD'
        ? `$${formatMoney(amount)}`
        : currency === 'EUR'
          ? `€${formatMoney(amount)}`
          : currency === 'GBP'
            ? `£${formatMoney(amount)}`
            : `₹${formatMoney(amount)}`

    if (!best || amount > best.amount) {
      best = { display, amount }
    }
  }

  return best
}

function formatMoney(n: number): string {
  return Number.isInteger(n) ? String(n) : n.toFixed(2).replace(/\.00$/, '')
}

export function hasMoneyReward(
  title: string,
  labels: Array<{ name?: string }> = [],
  body?: string | null
): boolean {
  return parseBountyReward(title, labels, body) !== null
}

/** True when the issue was updated within the bounty freshness window */
export function isFreshBounty(updatedAt?: string, createdAt?: string): boolean {
  const raw = updatedAt || createdAt
  if (!raw) return false
  const ageDays = (Date.now() - new Date(raw).getTime()) / 86400000
  return ageDays <= BOUNTY_MAX_AGE_DAYS
}

export function detectBountyPlatform(
  title: string,
  labels: Array<{ name?: string }> = [],
  body?: string
): string {
  const blob = `${title} ${labels.map((l) => l.name || '').join(' ')} ${body || ''}`.toLowerCase()
  if (blob.includes('algora')) return 'Algora'
  if (blob.includes('bountysource') || labels.some((l) => /bountysource/i.test(l.name || ''))) {
    return 'Bountysource'
  }
  if (blob.includes('issuehunt') || labels.some((l) => /issuehunt/i.test(l.name || ''))) {
    return 'IssueHunt'
  }
  if (blob.includes('gitcoin')) return 'Gitcoin'
  if (blob.includes('polar')) return 'Polar'
  return 'Bounty'
}
