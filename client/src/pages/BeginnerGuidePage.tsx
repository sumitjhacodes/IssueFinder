import React from 'react'
import { Link } from 'react-router-dom'

const steps = [
  {
    n: '01',
    title: 'Set up your environment',
    description: 'Install Git, create a GitHub account, and get a local editor ready.',
    details: [
      'Install Git on your computer',
      'Create a free GitHub account',
      'Set up SSH keys for secure authentication',
      'Install your preferred code editor (VS Code, IntelliJ, etc.)',
      'Learn basic Git commands (clone, commit, push, pull)',
    ],
  },
  {
    n: '02',
    title: 'Find a beginner-friendly issue',
    description: 'Look for issues labeled good first issue, beginner-friendly, or help wanted.',
    details: [
      'Use IssueFinder to search beginner-friendly issues',
      'Filter by Good first or Help wanted',
      'Prefer issues with a clear description',
      'Check the issue is still open and unassigned',
      'Read the project’s contributing guidelines',
    ],
    action: { to: '/issues?kind=good-first', label: 'Browse good first issues' },
  },
  {
    n: '03',
    title: 'Fork and clone the repository',
    description: 'Create your own copy of the project and download it locally.',
    details: [
      'Click Fork on the repository page',
      'Clone your fork: git clone <your-fork-url>',
      'Add the original repo as upstream: git remote add upstream <original-url>',
      'Create a branch: git checkout -b fix/issue-description',
      'Make sure you’re working on the latest code',
    ],
    code: 'git checkout -b fix/issue-description',
  },
  {
    n: '04',
    title: 'Make your changes',
    description: 'Read the code, understand the issue, and implement a focused fix.',
    details: [
      'Read the project README and documentation',
      'Understand the codebase structure',
      'Write clean code that matches project conventions',
      'Add comments only where they help',
      'Test your changes thoroughly',
      'Follow the project’s coding style guide',
    ],
  },
  {
    n: '05',
    title: 'Test and commit',
    description: 'Confirm everything works, then commit with a clear message.',
    details: [
      'Run the project’s test suite if it has one',
      'Test your changes manually',
      'Commit with a descriptive message',
      'Keep commits focused and atomic',
      'Write messages that explain why, not only what',
    ],
    code: 'git commit -m "Fix: description of the change"',
  },
  {
    n: '06',
    title: 'Open a pull request',
    description: 'Submit your branch for review and work with maintainers.',
    details: [
      'Push your branch: git push origin fix/issue-description',
      'Click New Pull Request on GitHub',
      'Write a clear PR description of your changes',
      'Reference the issue: Fixes #123 or Closes #123',
      'Respond to review feedback',
      'Update the PR if maintainers request changes',
    ],
    code: 'git push -u origin fix/issue-description',
  },
]

const tips = [
  {
    title: 'Start small',
    description:
      'Begin with documentation fixes, typos, or small bugs. They’re the fastest way to learn the workflow.',
  },
  {
    title: 'Read before you code',
    description:
      'Read the issue, docs, and nearby code before changing anything. Most wasted PRs skip this step.',
  },
  {
    title: 'Ask questions',
    description:
      'Comment on the issue if something is unclear. Maintainers would rather answer early than reject late.',
  },
  {
    title: 'Match the style',
    description:
      'Follow the project’s existing patterns and lint rules. Consistency matters more than personal taste.',
  },
  {
    title: 'Be patient',
    description:
      'Maintainers are often volunteers. Reviews can take days. Keep learning while you wait.',
  },
  {
    title: 'Ship small wins',
    description:
      'Every merged PR counts. Your first merge is the hard part — after that the path is clearer.',
  },
]

const languages = [
  { label: 'Python', q: 'python' },
  { label: 'TypeScript', q: 'typescript' },
  { label: 'JavaScript', q: 'javascript' },
  { label: 'Rust', q: 'rust' },
  { label: 'Go', q: 'go' },
  { label: 'Java', q: 'java' },
  { label: 'C++', q: 'cpp' },
  { label: 'C', q: 'c' },
  { label: 'C#', q: 'csharp' },
  { label: 'PHP', q: 'php' },
  { label: 'Ruby', q: 'ruby' },
  { label: 'Swift', q: 'swift' },
  { label: 'Kotlin', q: 'kotlin' },
]

const BeginnerGuidePage: React.FC = () => {
  return (
    <main className="mx-auto max-w-2xl px-4 py-10 sm:px-6 sm:py-14">
      <header className="mb-12">
        <p className="text-sm font-medium uppercase tracking-[0.18em] text-accent">Guide</p>
        <h1 className="mt-3 font-display text-4xl font-medium text-ink dark:text-white">
          Land your first PR
        </h1>
        <p className="mt-3 max-w-xl text-base leading-relaxed text-ink-muted">
          A complete path from setup to pull request — find a beginner-friendly issue, make a small
          change, and get it merged.
        </p>
        <div className="mt-6 flex flex-wrap gap-3">
          <Link to="/issues?kind=good-first" className="btn-primary">
            Find beginner issues
          </Link>
          <Link to="/issues?kind=help-wanted" className="btn-secondary">
            Help wanted
          </Link>
        </div>
      </header>

      {/* Steps */}
      <section className="border-t border-paper-line pt-10 dark:border-zinc-800">
        <h2 className="font-display text-2xl font-medium text-ink dark:text-white">
          Step by step
        </h2>
        <p className="mt-2 text-sm text-ink-muted">Six steps. Do them in order.</p>

        <ol className="mt-10 space-y-0 divide-y divide-paper-line dark:divide-zinc-800">
          {steps.map((step) => (
            <li key={step.n} className="grid gap-4 py-8 sm:grid-cols-[3.5rem_1fr] sm:gap-6">
              <span className="font-display text-2xl font-medium text-zinc-300 dark:text-zinc-600">
                {step.n}
              </span>
              <div className="min-w-0">
                <h3 className="font-display text-xl font-medium text-ink dark:text-white">
                  {step.title}
                </h3>
                <p className="mt-2 text-sm leading-relaxed text-ink-muted">{step.description}</p>

                <ul className="mt-4 space-y-2">
                  {step.details.map((detail) => (
                    <li
                      key={detail}
                      className="flex gap-2.5 text-sm leading-relaxed text-ink dark:text-zinc-300"
                    >
                      <span className="mt-2 h-1 w-1 shrink-0 rounded-full bg-accent" aria-hidden />
                      <span>{detail}</span>
                    </li>
                  ))}
                </ul>

                {step.code ? (
                  <pre className="mt-4 overflow-x-auto rounded-md border border-paper-line bg-zinc-50 px-3 py-2.5 font-mono text-xs text-ink dark:border-zinc-800 dark:bg-zinc-900 dark:text-zinc-200">
                    <code>{step.code}</code>
                  </pre>
                ) : null}

                {step.action ? (
                  <Link
                    to={step.action.to}
                    className="mt-4 inline-flex text-sm font-semibold text-accent hover:underline"
                  >
                    {step.action.label} →
                  </Link>
                ) : null}
              </div>
            </li>
          ))}
        </ol>
      </section>

      {/* Tips */}
      <section className="border-t border-paper-line pt-10 dark:border-zinc-800">
        <h2 className="font-display text-2xl font-medium text-ink dark:text-white">
          Tips that actually help
        </h2>
        <p className="mt-2 text-sm text-ink-muted">Keep these in mind while you work.</p>

        <dl className="mt-8 space-y-6">
          {tips.map((tip) => (
            <div key={tip.title}>
              <dt className="font-medium text-ink dark:text-white">{tip.title}</dt>
              <dd className="mt-1 text-sm leading-relaxed text-ink-muted">{tip.description}</dd>
            </div>
          ))}
        </dl>
      </section>

      {/* Languages */}
      <section className="mt-12 border-t border-paper-line pt-10 dark:border-zinc-800">
        <h2 className="font-display text-2xl font-medium text-ink dark:text-white">
          Find issues by language
        </h2>
        <p className="mt-2 text-sm text-ink-muted">
          Jump straight into Good first issues for your stack.
        </p>
        <div className="mt-5 flex flex-wrap gap-2">
          {languages.map((lang) => (
            <Link
              key={lang.q}
              to={`/issues?kind=good-first&language=${lang.q}`}
              className="rounded-full border border-paper-line px-3.5 py-1.5 text-sm text-ink-muted transition hover:border-zinc-400 hover:text-ink dark:border-zinc-700 dark:hover:border-zinc-500 dark:hover:text-white"
            >
              {lang.label}
            </Link>
          ))}
        </div>
      </section>

      {/* CTA */}
      <section className="mt-12 border-t border-paper-line pt-10 dark:border-zinc-800">
        <h2 className="font-display text-2xl font-medium text-ink dark:text-white">
          Ready to contribute?
        </h2>
        <p className="mt-2 text-sm leading-relaxed text-ink-muted">
          You’ve got the steps. Pick an issue and open your first PR.
        </p>
        <div className="mt-5 flex flex-wrap gap-3">
          <Link to="/issues?kind=good-first" className="btn-primary">
            Find beginner issues
          </Link>
          <Link to="/categories" className="btn-secondary">
            Browse categories
          </Link>
        </div>
      </section>
    </main>
  )
}

export default BeginnerGuidePage
