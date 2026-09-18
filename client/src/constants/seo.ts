import { PRODUCT_NAME } from './brand'
import { absoluteUrl, SITE_ORIGIN } from '../utils/siteUrl'

export type SeoEntry = {
  title: string
  description: string
  /** When true, emit robots noindex,follow */
  noindex?: boolean
}

/** Public paths included in sitemap + prerender (no query strings). */
export const PUBLIC_SEO_PATHS = [
  '/',
  '/issues',
  '/starter',
  '/bounty',
  '/repositories',
  '/learn',
  '/beginner-guide',
  '/categories',
  '/learn/how-to-contribute-to-open-source',
  '/learn/good-first-issues',
  '/learn/how-to-make-your-first-pull-request',
  '/learn/open-source-bounties',
  '/learn/beginner-friendly-open-source-projects',
] as const

export type PublicSeoPath = (typeof PUBLIC_SEO_PATHS)[number]

const DEFAULT_SEO: SeoEntry = {
  title: `${PRODUCT_NAME} – Unassigned issues, starter repos & cash bounties`,
  description:
    'Find unassigned GitHub issues updated in the last 30 days on non-archived repos (100+ stars), mid-size starter projects pushed recently, and cash bounties. Filter by language.',
}

export const SEO_BY_PATH: Record<string, SeoEntry> = {
  '/': DEFAULT_SEO,
  '/issues': {
    title: `Good First Issues & Unassigned GitHub Issues | ${PRODUCT_NAME}`,
    description:
      'Browse unassigned beginner-friendly GitHub issues updated in the last 30 days. Filter by good first issue, help wanted, language, and more — then open them on GitHub.',
  },
  '/starter': {
    title: `Beginner-Friendly Open Source Projects | ${PRODUCT_NAME}`,
    description:
      'Discover mid-size starter repos (100–2500 stars) pushed in the last 30 days. Quieter than mega-projects — expand a repo and pick an open issue to contribute.',
  },
  '/bounty': {
    title: `Open Source Bounties & Paid GitHub Issues | ${PRODUCT_NAME}`,
    description:
      'Find unassigned GitHub issues with cash bounties ($, €, £, ₹) updated in the last 45 days. Confirm payout on GitHub or the bounty platform before you start.',
  },
  '/repositories': {
    title: `Popular Repositories for Contributors | ${PRODUCT_NAME}`,
    description:
      'Browse popular GitHub repositories by language and jump into open issues that match your stack.',
  },
  '/learn': {
    title: `Learn Open Source Contribution | ${PRODUCT_NAME}`,
    description:
      'Guides, videos, and articles on how to contribute to open source — from good first issues to your first pull request and paid bounties.',
  },
  '/beginner-guide': {
    title: `How to Land Your First Open Source PR | ${PRODUCT_NAME}`,
    description:
      'Step-by-step checklist: set up Git, find a beginner-friendly issue, fork, commit, and open a pull request maintainers will review.',
  },
  '/categories': {
    title: `Browse Issues by Category | ${PRODUCT_NAME}`,
    description:
      'Explore GitHub issues by category — good first issue, help wanted, bugs, docs, features, and more — then filter by language.',
  },
  '/search': {
    title: `Search Results | ${PRODUCT_NAME}`,
    description: 'Search results for GitHub issues on IssueFinder.',
    noindex: true,
  },
  '/learn/how-to-contribute-to-open-source': {
    title: `How to Contribute to Open Source (Beginner Guide) | ${PRODUCT_NAME}`,
    description:
      'A practical guide to open source contribution: find projects, pick good first issues, communicate with maintainers, and ship your first pull request.',
  },
  '/learn/good-first-issues': {
    title: `What Are Good First Issues? How to Find Them | ${PRODUCT_NAME}`,
    description:
      'Learn what good first issues are, how to evaluate them, and how to find unassigned beginner-friendly GitHub tickets with IssueFinder.',
  },
  '/learn/how-to-make-your-first-pull-request': {
    title: `How to Make Your First Pull Request on GitHub | ${PRODUCT_NAME}`,
    description:
      'Fork, branch, commit, and open your first GitHub pull request — with tips maintainers actually want to see.',
  },
  '/learn/open-source-bounties': {
    title: `Open Source Bounties: Get Paid to Contribute | ${PRODUCT_NAME}`,
    description:
      'How open source bounties work, how to find paid GitHub issues, and how to claim payouts after your PR is merged.',
  },
  '/learn/beginner-friendly-open-source-projects': {
    title: `Beginner-Friendly Open Source Projects | ${PRODUCT_NAME}`,
    description:
      'How to choose quieter mid-size projects for your first contributions — and browse starter repos filtered for new contributors.',
  },
}

export function normalizePathname(pathname: string): string {
  if (!pathname || pathname === '/') return '/'
  const clean = pathname.endsWith('/') ? pathname.slice(0, -1) : pathname
  return clean || '/'
}

export function getSeoForPath(pathname: string): SeoEntry {
  const path = normalizePathname(pathname)
  return SEO_BY_PATH[path] ?? DEFAULT_SEO
}

export type JsonLd = Record<string, unknown>

export function websiteJsonLd(): JsonLd {
  return {
    '@context': 'https://schema.org',
    '@type': 'WebSite',
    name: PRODUCT_NAME,
    url: SITE_ORIGIN,
    description: DEFAULT_SEO.description,
  }
}

export function organizationJsonLd(): JsonLd {
  return {
    '@context': 'https://schema.org',
    '@type': 'Organization',
    name: PRODUCT_NAME,
    url: SITE_ORIGIN,
    logo: `${SITE_ORIGIN}/icon-512x512.png`,
  }
}

export function breadcrumbJsonLd(
  items: { name: string; path: string }[]
): JsonLd {
  return {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: items.map((item, index) => ({
      '@type': 'ListItem',
      position: index + 1,
      name: item.name,
      item: absoluteUrl(item.path),
    })),
  }
}

export function howtoJsonLd(): JsonLd {
  return {
    '@context': 'https://schema.org',
    '@type': 'HowTo',
    name: 'Land your first open source pull request',
    description:
      'Set up your environment, find a beginner-friendly issue, fork the repo, make a focused change, and open a pull request.',
    step: [
      {
        '@type': 'HowToStep',
        position: 1,
        name: 'Set up your environment',
        text: 'Install Git, create a GitHub account, and get a local editor ready.',
      },
      {
        '@type': 'HowToStep',
        position: 2,
        name: 'Find a beginner-friendly issue',
        text: 'Look for unassigned good first issue or help wanted tickets on active repos.',
        url: absoluteUrl('/issues?kind=good-first'),
      },
      {
        '@type': 'HowToStep',
        position: 3,
        name: 'Fork and clone the repository',
        text: 'Fork on GitHub, clone your fork, and create a focused branch.',
      },
      {
        '@type': 'HowToStep',
        position: 4,
        name: 'Make your changes',
        text: 'Read the docs and nearby code, then implement a small, testable fix.',
      },
      {
        '@type': 'HowToStep',
        position: 5,
        name: 'Test and commit',
        text: 'Run tests if available and commit with a clear message.',
      },
      {
        '@type': 'HowToStep',
        position: 6,
        name: 'Open a pull request',
        text: 'Push your branch, open a PR that references the issue, and respond to review.',
      },
    ],
  }
}

export function faqJsonLd(faqs: { question: string; answer: string }[]): JsonLd {
  return {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: faqs.map((faq) => ({
      '@type': 'Question',
      name: faq.question,
      acceptedAnswer: {
        '@type': 'Answer',
        text: faq.answer,
      },
    })),
  }
}

/** FAQ copy shared by product pages (also rendered in UI). */
export const ISSUES_FAQS = [
  {
    question: 'What issues does IssueFinder show?',
    answer:
      'By default, unassigned open issues updated in the last 30 days on non-archived GitHub repos with 100+ stars. You can filter by good first issue, help wanted, bugs, docs, and more.',
  },
  {
    question: 'How do I find good first issues?',
    answer:
      'Open the Issues page and keep the Good first filter selected, optionally pick a language, then open a ticket on GitHub to comment and contribute.',
  },
  {
    question: 'Are these issues free to work on?',
    answer:
      'Yes — standard open source issues are unpaid unless marked as a bounty. For paid work, use the Bounties page.',
  },
]

export const STARTER_FAQS = [
  {
    question: 'What is a starter project on IssueFinder?',
    answer:
      'A mid-size, non-archived repo with 100–2500 stars, pushed in the last 30 days, and at least 5 forks — quieter than mega-repos for new contributors.',
  },
  {
    question: 'How do I find beginner-friendly open source projects?',
    answer:
      'Use the Starter page, filter by language, and optionally require repos that have good-first issues. Expand a repo to load its open issues.',
  },
]

export const BOUNTY_FAQS = [
  {
    question: 'What are open source bounties?',
    answer:
      'Paid GitHub issues that offer cash ($, €, £, or ₹) for a merged fix. IssueFinder lists unassigned bounty-tagged issues updated in the last 45 days.',
  },
  {
    question: 'How do I claim a bounty?',
    answer:
      'Solve the issue, open a PR, and follow the bounty platform or maintainer instructions after acceptance. Always confirm the payout terms on GitHub before you start.',
  },
]

export const LEARN_FAQS = [
  {
    question: 'How do I start contributing to open source?',
    answer:
      'Learn Git basics, pick a good first issue on an active project, make a small change, and open a pull request. IssueFinder’s guides and Issues browser walk you through each step.',
  },
  {
    question: 'Where should beginners look for issues?',
    answer:
      'Start with good first issue and help wanted labels on repos that are not archived and still receive updates. IssueFinder filters for unassigned, recently updated tickets.',
  },
]

export function getJsonLdForPath(pathname: string): JsonLd[] {
  const path = normalizePathname(pathname)
  const blocks: JsonLd[] = []

  if (path === '/') {
    blocks.push(websiteJsonLd(), organizationJsonLd())
  }

  if (path === '/beginner-guide') {
    blocks.push(howtoJsonLd())
  }

  if (path === '/issues') {
    blocks.push(faqJsonLd(ISSUES_FAQS))
  }
  if (path === '/starter') {
    blocks.push(faqJsonLd(STARTER_FAQS))
  }
  if (path === '/bounty') {
    blocks.push(faqJsonLd(BOUNTY_FAQS))
  }
  if (path === '/learn' || path.startsWith('/learn/')) {
    blocks.push(faqJsonLd(LEARN_FAQS))
  }

  if (path.startsWith('/learn/')) {
    const guideName =
      SEO_BY_PATH[path]?.title.replace(` | ${PRODUCT_NAME}`, '') ?? 'Guide'
    blocks.push(
      breadcrumbJsonLd([
        { name: 'Home', path: '/' },
        { name: 'Learn', path: '/learn' },
        { name: guideName, path },
      ])
    )
  }

  return blocks
}
