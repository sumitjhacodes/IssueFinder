import React from 'react'
import { Link } from 'react-router-dom'
import type { GuideDoc } from '../content/guides/types'
import SeoFaq from './SeoFaq'

type GuideArticleProps = {
  guide: GuideDoc
}

const GuideArticle: React.FC<GuideArticleProps> = ({ guide }) => {
  return (
    <article className="mx-auto max-w-2xl px-4 py-10 sm:px-6 sm:py-14">
      <nav className="font-sans text-sm text-ink-muted" aria-label="Breadcrumb">
        <Link to="/" className="hover:text-ink dark:hover:text-white">
          Home
        </Link>
        <span className="mx-2" aria-hidden>
          /
        </span>
        <Link to="/learn" className="hover:text-ink dark:hover:text-white">
          Learn
        </Link>
        <span className="mx-2" aria-hidden>
          /
        </span>
        <span className="text-ink dark:text-zinc-300">{guide.eyebrow}</span>
      </nav>

      <header className="mt-8 mb-10">
        <p className="text-sm font-medium uppercase tracking-[0.18em] text-accent">
          {guide.eyebrow}
        </p>
        <h1 className="mt-3 font-display text-4xl font-medium text-ink dark:text-white">
          {guide.title}
        </h1>
        <p className="mt-4 max-w-xl text-base leading-relaxed text-ink-muted">{guide.intro}</p>
        <div className="mt-6 flex flex-wrap gap-3">
          <Link to={guide.ctaPrimary.to} className="btn-primary">
            {guide.ctaPrimary.label}
          </Link>
          {guide.ctaSecondary ? (
            <Link to={guide.ctaSecondary.to} className="btn-secondary">
              {guide.ctaSecondary.label}
            </Link>
          ) : null}
        </div>
      </header>

      {guide.sections.map((section) => (
        <section
          key={section.heading}
          className="border-t border-paper-line pt-10 dark:border-zinc-800"
        >
          <h2 className="font-display text-2xl font-medium text-ink dark:text-white">
            {section.heading}
          </h2>
          {section.paragraphs.map((p) => (
            <p
              key={p.slice(0, 48)}
              className="mt-3 text-sm leading-relaxed text-ink-muted sm:text-base"
            >
              {p}
            </p>
          ))}
          {section.bullets?.length ? (
            <ul className="mt-4 space-y-2">
              {section.bullets.map((item) => (
                <li
                  key={item}
                  className="flex gap-2.5 text-sm leading-relaxed text-ink dark:text-zinc-300"
                >
                  <span className="mt-2 h-1 w-1 shrink-0 rounded-full bg-accent" aria-hidden />
                  <span>{item}</span>
                </li>
              ))}
            </ul>
          ) : null}
        </section>
      ))}

      <SeoFaq
        items={guide.faqs}
        className="mt-10 border-t border-paper-line pt-10 dark:border-zinc-800"
      />

      <section className="mt-12 border-t border-paper-line pt-10 dark:border-zinc-800">
        <h2 className="font-display text-2xl font-medium text-ink dark:text-white">
          Ready to contribute?
        </h2>
        <p className="mt-2 text-sm leading-relaxed text-ink-muted">
          Use IssueFinder to find an unassigned issue, then open it on GitHub and ship.
        </p>
        <div className="mt-5 flex flex-wrap gap-3">
          <Link to={guide.ctaPrimary.to} className="btn-primary">
            {guide.ctaPrimary.label}
          </Link>
          <Link to="/beginner-guide" className="btn-secondary">
            Short checklist
          </Link>
          <Link to="/learn" className="btn-secondary">
            More guides
          </Link>
        </div>
      </section>
    </article>
  )
}

export default GuideArticle
