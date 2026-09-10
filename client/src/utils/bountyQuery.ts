import { toGitHubLanguageQualifier, MIN_REPO_STARS } from './queryBuilder'

export type BountySource = 'bounty' | 'bountysource' | 'issuehunt' | 'algora'

export const BOUNTY_SOURCES: { key: BountySource; label: string }[] = [
  { key: 'bounty', label: 'Bounty label' },
  { key: 'bountysource', label: 'Bountysource' },
  { key: 'issuehunt', label: 'IssueHunt' },
  { key: 'algora', label: 'Algora' },
]

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

/**
 * Real paid-issue discovery via GitHub Search.
 */
export function buildBountyQuery(params: BountyQueryParams = {}): string {
  const source = params.source ?? 'bounty'
  const parts = ['is:open', 'is:issue']

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

    // Prefer the largest cash amount found
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
