import type { GuideDoc } from './types'

export const howToContributeGuide: GuideDoc = {
  slug: 'how-to-contribute-to-open-source',
  path: '/learn/how-to-contribute-to-open-source',
  eyebrow: 'Pillar guide',
  title: 'How to contribute to open source',
  intro:
    'Open source contribution means improving public software — fixing bugs, writing docs, reviewing code, or shipping features — so others can use and build on the work. This guide covers a practical path from zero to your first merged pull request.',
  sections: [
    {
      heading: 'What counts as an open source contribution?',
      paragraphs: [
        'Code is only one path. Documentation fixes, tests, translations, issue triage, and design feedback all help maintainers. If a project publishes a LICENSE that allows modification and distribution, and accepts changes through GitHub (or similar), you can contribute.',
        'Start with changes that are small, reversible, and easy to review. Maintainers merge focused PRs faster than large rewrites from newcomers.',
      ],
      bullets: [
        'Bug fixes and typo corrections in docs or UI copy',
        'Tests for existing behavior',
        'Accessibility and performance improvements that are scoped clearly',
        'Answering questions in issues when you have verified knowledge',
      ],
    },
    {
      heading: 'Skills you need before you start',
      paragraphs: [
        'You do not need to be a senior engineer. You do need a GitHub account, basic Git (clone, branch, commit, push), and enough of the project’s language to make a safe change. Reading skill matters more than writing speed at the beginning.',
        'Spend an evening on Git fundamentals if branching still feels fuzzy. Most rejected first PRs fail on process — wrong branch, missing CLA, noisy commits — not on genius-level algorithms.',
      ],
    },
    {
      heading: 'How to find a project and an issue',
      paragraphs: [
        'Prefer active repositories: recent pushes, open issues that get replies, and clear CONTRIBUTING docs. Avoid abandoned repos where your PR will sit forever.',
        'IssueFinder surfaces unassigned issues updated in the last 30 days on non-archived repos with 100+ stars, plus quieter starter projects and cash bounties. Use labels like good first issue and help wanted, then read the issue body carefully before claiming work.',
      ],
      bullets: [
        'Confirm the issue is still open and unassigned',
        'Skim CONTRIBUTING.md and the PR template',
        'Comment once to say you want to work on it — then actually start',
        'If the description is vague, ask one clarifying question before coding',
      ],
    },
    {
      heading: 'The contribution workflow',
      paragraphs: [
        'Fork the repository, clone your fork, create a branch named after the fix, implement the smallest change that solves the issue, test locally, and open a pull request that links the issue (Fixes #123). Respond politely to review comments; maintainers are often volunteers.',
        'After your first merge, look for a slightly harder issue in the same repo. Context compounds — your second PR is usually faster than your first.',
      ],
    },
    {
      heading: 'Etiquette that gets PRs merged',
      paragraphs: [
        'Do not demand reviews. Do not refactor unrelated files “while you are there.” Do not open drive-by PRs that ignore project conventions. Do celebrate small wins and thank reviewers.',
        'If a maintainer closes your PR, ask what would make a follow-up acceptable — or take the feedback to the next issue. Reputation in open source is earned through reliability.',
      ],
    },
  ],
  faqs: [
    {
      question: 'Can beginners contribute to open source?',
      answer:
        'Yes. Start with documentation or good first issues on active projects. Use IssueFinder to filter unassigned, recently updated tickets.',
    },
    {
      question: 'How long until my first PR merges?',
      answer:
        'Anywhere from a day to a few weeks depending on maintainer availability. Small, well-tested changes merge fastest.',
    },
    {
      question: 'Should I contribute for free or chase bounties?',
      answer:
        'Both are valid. Learn the workflow on unpaid good first issues, then try bounty issues once you are comfortable with PRs.',
    },
  ],
  ctaPrimary: { to: '/issues?kind=good-first', label: 'Find good first issues' },
  ctaSecondary: { to: '/beginner-guide', label: 'Step-by-step checklist' },
}

export const goodFirstIssuesGuide: GuideDoc = {
  slug: 'good-first-issues',
  path: '/learn/good-first-issues',
  eyebrow: 'Finding issues',
  title: 'What are good first issues (and how to find them)',
  intro:
    'A good first issue is a GitHub ticket maintainers intentionally mark as suitable for newcomers — usually small scope, clear acceptance criteria, and limited codebase knowledge required. Here is how to evaluate and find them.',
  sections: [
    {
      heading: 'Why the “good first issue” label exists',
      paragraphs: [
        'Maintainers want help but cannot onboard everyone personally. Labeling issues reduces noise: newcomers get a runway; maintainers get smaller reviews. The label is a signal, not a guarantee — always read the issue and surrounding code.',
      ],
    },
    {
      heading: 'How to tell if an issue is actually beginner-friendly',
      paragraphs: [
        'Look for a clear description of the current vs expected behavior, links to relevant files, and recent activity on the repo. Red flags include vague “make it better” tasks, issues with long heated threads, or tickets last updated years ago on archived projects.',
      ],
      bullets: [
        'Unassigned and still open',
        'Updated recently (IssueFinder defaults to the last 30 days)',
        'Repo not archived, with enough stars to suggest a living community',
        'You can restate the fix in one sentence before coding',
      ],
    },
    {
      heading: 'Where to browse good first issues',
      paragraphs: [
        'GitHub search works, but it is easy to land on stale or assigned tickets. IssueFinder’s Issues page defaults to good first issues that are unassigned and recently updated on non-archived repos with 100+ stars. Filter by language to match your stack.',
        'Also check help wanted when you are ready for slightly harder work, and Starter projects when mega-repos feel overwhelming.',
      ],
    },
    {
      heading: 'Before you write code',
      paragraphs: [
        'Comment that you are taking the issue only if you can start soon. Reproduce the bug or confirm the docs gap. Read CONTRIBUTING for branch naming, lint commands, and CLA requirements. Then implement the smallest fix.',
      ],
    },
  ],
  faqs: [
    {
      question: 'Are all good first issues easy?',
      answer:
        'No. Some are mislabeled. If setup alone takes hours, pick another ticket — that is a normal part of learning.',
    },
    {
      question: 'What if someone else is already assigned?',
      answer:
        'Leave it. IssueFinder focuses on unassigned issues so you do not fight for the same work.',
    },
  ],
  ctaPrimary: { to: '/issues?kind=good-first', label: 'Browse good first issues' },
  ctaSecondary: { to: '/starter', label: 'Try starter projects' },
}

export const firstPrGuide: GuideDoc = {
  slug: 'how-to-make-your-first-pull-request',
  path: '/learn/how-to-make-your-first-pull-request',
  eyebrow: 'Pull requests',
  title: 'How to make your first pull request on GitHub',
  intro:
    'A pull request (PR) proposes your commits for review and merge. This walkthrough covers fork-to-merge with the habits that make maintainers say yes.',
  sections: [
    {
      heading: 'Fork, clone, and branch',
      paragraphs: [
        'Click Fork on the upstream repository, clone your fork, and add the original remote as upstream if you will sync later. Create a branch from the default branch with a descriptive name such as fix/typo-readme or fix/issue-123.',
      ],
      bullets: [
        'git clone <your-fork-url>',
        'git checkout -b fix/short-description',
        'Keep the branch focused on one issue',
      ],
    },
    {
      heading: 'Make a reviewable change',
      paragraphs: [
        'Match existing style. Avoid drive-by refactors. Run the project’s lint and test commands when documented. Commit with a message that explains why, not only what.',
      ],
    },
    {
      heading: 'Open the pull request',
      paragraphs: [
        'Push your branch and open a PR against the upstream default branch. Fill the template. Reference the issue with Fixes #123 or Closes #123. Describe how you tested. Screenshots help for UI changes.',
        'Expect review comments. Push follow-up commits to the same branch — the PR updates automatically. Stay polite and specific when you disagree.',
      ],
    },
    {
      heading: 'After merge',
      paragraphs: [
        'Delete your branch, pull upstream changes into your fork, and pick a related issue while context is fresh. Your second PR teaches more than any tutorial.',
      ],
    },
  ],
  faqs: [
    {
      question: 'Should I open a draft PR?',
      answer:
        'Draft PRs are useful when you want early feedback. Mark ready for review when tests pass and the description is complete.',
    },
    {
      question: 'What if CI fails?',
      answer:
        'Read the log, fix the failure locally, and push again. Do not ask for merge while required checks are red.',
    },
  ],
  ctaPrimary: { to: '/issues?kind=good-first', label: 'Find an issue to PR' },
  ctaSecondary: { to: '/beginner-guide', label: 'Full beginner checklist' },
}

export const bountiesGuide: GuideDoc = {
  slug: 'open-source-bounties',
  path: '/learn/open-source-bounties',
  eyebrow: 'Paid work',
  title: 'Open source bounties: get paid to contribute',
  intro:
    'Bounties attach cash rewards to GitHub issues. You still contribute through the normal PR process — payment comes from a platform or maintainer after acceptance. Treat bounty amounts as provisional until you verify the rules.',
  sections: [
    {
      heading: 'How bounties usually work',
      paragraphs: [
        'An issue is posted with a reward and conditions (who can claim, deadlines, quality bar). You solve it via a merged PR, then submit a claim on the bounty platform or follow maintainer instructions. Payouts may require KYC or specific wallets depending on the platform.',
      ],
    },
    {
      heading: 'Finding paid GitHub issues',
      paragraphs: [
        'IssueFinder’s Bounties page lists unassigned issues that mention cash amounts ($, €, £, or ₹) and were updated in the last 45 days. Always open the GitHub issue and linked bounty page to confirm the reward is still active before investing time.',
      ],
      bullets: [
        'Verify the amount and currency on the source of truth',
        'Check whether the issue is still unassigned',
        'Read claim steps before you write code',
        'Prefer bounties on repos you can actually set up locally',
      ],
    },
    {
      heading: 'Skills and risk',
      paragraphs: [
        'Bounty issues are often harder than good first issues. Start with unpaid beginner tickets to learn the workflow, then take bounties sized to your experience. If two people submit PRs, platforms and maintainers decide — there is no guarantee you get paid for unfinished work.',
      ],
    },
  ],
  faqs: [
    {
      question: 'Are open source bounties legit?',
      answer:
        'Many are, but scams exist. Trust established platforms and well-known orgs. Never pay money to “unlock” a bounty.',
    },
    {
      question: 'Can beginners take bounties?',
      answer:
        'Smaller bounties on familiar stacks are possible. Build confidence on good first issues first if GitHub PRs are new to you.',
    },
  ],
  ctaPrimary: { to: '/bounty', label: 'Browse open bounties' },
  ctaSecondary: { to: '/issues?kind=good-first', label: 'Practice on good first issues' },
}

export const starterProjectsGuide: GuideDoc = {
  slug: 'beginner-friendly-open-source-projects',
  path: '/learn/beginner-friendly-open-source-projects',
  eyebrow: 'Choosing projects',
  title: 'Beginner-friendly open source projects',
  intro:
    'Huge repositories can overwhelm new contributors — slow reviews, complex setup, and fierce competition for issues. Mid-size “starter” projects often offer a better first experience.',
  sections: [
    {
      heading: 'What makes a project beginner-friendly?',
      paragraphs: [
        'Clear README and CONTRIBUTING, responsive maintainers, recent commits, and issues labeled for newcomers. Stars alone are a weak signal; activity and communication quality matter more.',
      ],
    },
    {
      heading: 'Why IssueFinder Starter uses mid-size repos',
      paragraphs: [
        'Starter projects on IssueFinder are non-archived repos with 100–2500 stars, a push in the last 30 days, and at least five forks. That range tends to mean real users without the noise of mega-org monorepos. Expand a repo on the Starter page to load its open issues.',
      ],
    },
    {
      heading: 'How to choose your first repo',
      paragraphs: [
        'Pick a language you already write. Run the app or library locally before promising a fix. Skim open PRs to see how maintainers review. If setup fails after a genuine attempt, switch projects — sunk time is not a virtue.',
      ],
      bullets: [
        'Filter Starter by language',
        'Optionally require repos that have good-first issues',
        'Read one merged PR to learn expectations',
        'Start with docs or a tiny bug before features',
      ],
    },
  ],
  faqs: [
    {
      question: 'Should I contribute to Kubernetes on day one?',
      answer:
        'Usually not. Learn the PR workflow on a quieter project, then grow into larger codebases.',
    },
    {
      question: 'Where do I browse starter repos?',
      answer:
        'Use IssueFinder’s Starter page, then jump into Issues when you want a global good-first feed.',
    },
  ],
  ctaPrimary: { to: '/starter', label: 'Browse starter projects' },
  ctaSecondary: { to: '/repositories', label: 'Popular repos by language' },
}

export const ALL_GUIDES: GuideDoc[] = [
  howToContributeGuide,
  goodFirstIssuesGuide,
  firstPrGuide,
  bountiesGuide,
  starterProjectsGuide,
]

export function guideBySlug(slug: string): GuideDoc | undefined {
  return ALL_GUIDES.find((g) => g.slug === slug)
}
