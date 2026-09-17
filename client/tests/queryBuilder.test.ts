import { describe, expect, it } from 'vitest'
import {
  buildGitHubQuery,
  CATEGORY_TO_KIND,
  MIN_REPO_STARS,
  toGitHubLanguageQualifier,
} from '../src/utils/queryBuilder'

describe('toGitHubLanguageQualifier', () => {
  it('maps known slugs to GitHub language names', () => {
    expect(toGitHubLanguageQualifier('typescript')).toBe('language:TypeScript')
    expect(toGitHubLanguageQualifier('cpp')).toBe('language:"C++"')
    expect(toGitHubLanguageQualifier('csharp')).toBe('language:"C#"')
  })
})

describe('CATEGORY_TO_KIND', () => {
  it('maps category page labels to issue kind slugs', () => {
    expect(CATEGORY_TO_KIND['good first issue']).toBe('good-first')
    expect(CATEGORY_TO_KIND['help wanted']).toBe('help-wanted')
    expect(CATEGORY_TO_KIND.bug).toBe('bug')
    expect(CATEGORY_TO_KIND.feature).toBe('feature')
  })
})

describe('buildGitHubQuery', () => {
  it('requires open unassigned issues on non-archived popular repos by default', () => {
    const q = buildGitHubQuery({ selectedKind: 'good-first', selectedLastActivity: 'last-month' })
    expect(q).toContain('is:open')
    expect(q).toContain('is:issue')
    expect(q).toContain('no:assignee')
    expect(q).toContain('archived:false')
    expect(q).toContain(`stars:>${MIN_REPO_STARS - 1}`)
    expect(q).toContain('label:"good first issue"')
    expect(q).toMatch(/updated:>\d{4}-\d{2}-\d{2}/)
  })

  it('skips stars, archived, assignee, and language when scoped to a repo', () => {
    const q = buildGitHubQuery({
      selectedRepo: 'owner/repo',
      selectedKind: 'bug',
      selectedLanguage: 'python',
      selectedLastActivity: 'any',
    })
    expect(q).toContain('repo:owner/repo')
    expect(q).toContain('label:"bug"')
    expect(q).not.toContain('no:assignee')
    expect(q).not.toContain('archived:false')
    expect(q).not.toContain('stars:>')
    expect(q).not.toContain('language:')
    expect(q).not.toMatch(/updated:>/)
  })

  it('omits label when kind is all', () => {
    const q = buildGitHubQuery({ selectedKind: 'all', selectedLastActivity: 'last-month' })
    expect(q).not.toMatch(/label:/)
    expect(q).toContain('no:assignee')
  })

  it('prefers selectedCategories over kind', () => {
    const q = buildGitHubQuery({
      selectedKind: 'bug',
      selectedCategories: ['documentation'],
      selectedLastActivity: 'any',
    })
    expect(q).toContain('label:"documentation"')
    expect(q).not.toContain('label:"bug"')
  })

  it('includes language and search term for global searches', () => {
    const q = buildGitHubQuery({
      selectedKind: 'help-wanted',
      selectedLanguage: 'rust',
      searchTerm: 'async',
      selectedLastActivity: 'last-week',
    })
    expect(q).toContain('language:Rust')
    expect(q).toContain('async')
    expect(q).toContain('label:"help wanted"')
  })
})
