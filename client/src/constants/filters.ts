import type { IssueKind } from '../utils/queryBuilder'

export type FilterOption<T extends string | null = string | null> = {
  key: T
  label: string
}

/** Core languages used on Issues, Starter, and related chips. */
export const FILTER_LANGUAGES: FilterOption[] = [
  { key: null, label: 'All' },
  { key: 'python', label: 'Python' },
  { key: 'typescript', label: 'TypeScript' },
  { key: 'javascript', label: 'JavaScript' },
  { key: 'rust', label: 'Rust' },
  { key: 'go', label: 'Go' },
  { key: 'java', label: 'Java' },
  { key: 'cpp', label: 'C++' },
  { key: 'c', label: 'C' },
  { key: 'csharp', label: 'C#' },
  { key: 'php', label: 'PHP' },
  { key: 'ruby', label: 'Ruby' },
  { key: 'swift', label: 'Swift' },
  { key: 'kotlin', label: 'Kotlin' },
]

/** Broader language list for repository browsing. */
export const REPO_FILTER_LANGUAGES: FilterOption[] = [
  { key: null, label: 'Any language' },
  { key: 'javascript', label: 'JavaScript' },
  { key: 'typescript', label: 'TypeScript' },
  { key: 'python', label: 'Python' },
  { key: 'java', label: 'Java' },
  { key: 'c', label: 'C' },
  { key: 'cpp', label: 'C++' },
  { key: 'csharp', label: 'C#' },
  { key: 'go', label: 'Go' },
  { key: 'rust', label: 'Rust' },
  { key: 'php', label: 'PHP' },
  { key: 'ruby', label: 'Ruby' },
  { key: 'swift', label: 'Swift' },
  { key: 'kotlin', label: 'Kotlin' },
  { key: 'html', label: 'HTML' },
  { key: 'css', label: 'CSS' },
  { key: 'shell', label: 'Shell' },
  { key: 'dart', label: 'Dart' },
  { key: 'scala', label: 'Scala' },
  { key: 'r', label: 'R' },
]

export const ISSUE_KIND_FILTERS: { key: IssueKind; label: string }[] = [
  { key: 'good-first', label: 'Good first' },
  { key: 'help-wanted', label: 'Help wanted' },
  { key: 'all', label: 'All issues' },
  { key: 'bug', label: 'Bugs' },
  { key: 'documentation', label: 'Docs' },
  { key: 'feature', label: 'Features' },
  { key: 'enhancement', label: 'Enhancement' },
  { key: 'refactor', label: 'Refactor' },
  { key: 'testing', label: 'Testing' },
  { key: 'performance', label: 'Performance' },
  { key: 'security', label: 'Security' },
]

export const VALID_ISSUE_KINDS = new Set<IssueKind>(ISSUE_KIND_FILTERS.map((k) => k.key))

export const LICENSE_FILTERS: FilterOption[] = [
  { key: null, label: 'Any license' },
  { key: 'mit', label: 'MIT' },
  { key: 'apache-2.0', label: 'Apache 2.0' },
  { key: 'gpl-3.0', label: 'GPL 3.0' },
  { key: 'bsd-3-clause', label: 'BSD 3-Clause' },
  { key: 'mpl-2.0', label: 'Mozilla 2.0' },
  { key: 'agpl-3.0', label: 'AGPL 3.0' },
  { key: 'lgpl-3.0', label: 'LGPL 3.0' },
]

export const DIFFICULTY_FILTERS = [
  {
    key: 'beginner',
    label: 'Beginner friendly',
    description: 'Perfect for first-time contributors',
  },
  {
    key: 'intermediate',
    label: 'Intermediate',
    description: 'Some experience recommended',
  },
  {
    key: 'advanced',
    label: 'Advanced',
    description: 'Deeper codebase knowledge needed',
  },
] as const
