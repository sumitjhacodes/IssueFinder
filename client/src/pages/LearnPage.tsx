import React, { useState } from 'react'
import { Link } from 'react-router-dom'
import { LEARN_ARTICLES, LEARN_VIDEOS, type LearnVideo } from '../data/learnResources'

type LearnTab = 'videos' | 'articles'

const tagClass =
  'font-sans text-[11px] font-medium uppercase tracking-wide text-accent dark:text-teal-300'

function embedSrc(video: LearnVideo): string {
  if (video.playlistId) {
    return `https://www.youtube-nocookie.com/embed/videoseries?list=${video.playlistId}&autoplay=1&rel=0`
  }
  return `https://www.youtube-nocookie.com/embed/${video.youtubeId}?autoplay=1&rel=0`
}

function thumbSrc(video: LearnVideo): string {
  const id = video.thumbId || video.youtubeId
  return `https://i.ytimg.com/vi/${id}/hqdefault.jpg`
}

const VideoEmbed: React.FC<{ video: LearnVideo; priority?: boolean }> = ({ video, priority }) => {
  const [active, setActive] = useState(false)

  return (
    <article className="min-w-0">
      <div className="overflow-hidden rounded-xl border border-paper-line bg-zinc-950 dark:border-zinc-800">
        <div className="relative aspect-video w-full">
          {active ? (
            <iframe
              title={video.title}
              src={embedSrc(video)}
              className="absolute inset-0 h-full w-full"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
              allowFullScreen
              loading={priority ? 'eager' : 'lazy'}
            />
          ) : (
            <button
              type="button"
              onClick={() => setActive(true)}
              className="group absolute inset-0 w-full"
              aria-label={`Play ${video.title}`}
            >
              <img
                src={thumbSrc(video)}
                alt=""
                className="h-full w-full object-cover opacity-90 transition group-hover:opacity-100"
                loading={priority ? 'eager' : 'lazy'}
              />
              <span className="absolute inset-0 bg-gradient-to-t from-black/55 via-black/10 to-transparent" />
              <span className="absolute inset-0 flex items-center justify-center">
                <span className="flex h-14 w-14 items-center justify-center rounded-full bg-white/95 text-ink shadow-soft transition group-hover:scale-105">
                  <svg className="ml-0.5 h-6 w-6" viewBox="0 0 24 24" fill="currentColor" aria-hidden>
                    <path d="M8 5.14v13.72L19 12 8 5.14z" />
                  </svg>
                </span>
              </span>
              <span className="absolute bottom-3 left-3 flex gap-1.5">
                <span className="rounded bg-black/70 px-2 py-0.5 font-sans text-[11px] font-medium tracking-tight text-white">
                  {video.duration}
                </span>
                {video.region === 'india' ? (
                  <span className="rounded bg-accent/90 px-2 py-0.5 font-sans text-[11px] font-medium tracking-tight text-white">
                    India
                  </span>
                ) : null}
              </span>
            </button>
          )}
        </div>
      </div>
      <h3 className="mt-4 font-display text-xl font-medium text-ink dark:text-white">{video.title}</h3>
      <p className="mt-1 font-sans text-sm text-ink-muted">{video.channel}</p>
      <p className="mt-2 font-sans text-sm leading-relaxed text-ink-muted">{video.description}</p>
    </article>
  )
}

const FEATURED_VIDEO_ID = 'mklEhT_RLos'

const LearnPage: React.FC = () => {
  const [tab, setTab] = useState<LearnTab>('videos')
  const featuredVideo = LEARN_VIDEOS.find((v) => v.youtubeId === FEATURED_VIDEO_ID)
  const indianVideos = LEARN_VIDEOS.filter((v) => v.region === 'india')
  const globalVideos = LEARN_VIDEOS.filter(
    (v) => v.region === 'global' && v.youtubeId !== FEATURED_VIDEO_ID
  )

  return (
    <main className="mx-auto max-w-3xl px-4 py-10 sm:px-6 sm:py-14">
      <header className="mb-10">
        <p className="text-sm font-medium uppercase tracking-[0.18em] text-accent">Learn</p>
        <h1 className="mt-3 font-display text-4xl font-medium text-ink dark:text-white">
          Complete open source guide
        </h1>
        <p className="mt-3 max-w-xl text-base leading-relaxed text-ink-muted">
          Curated articles, blogs, and YouTube walkthroughs — including Indian creators like Piyush
          Garg, Coder&apos;s Gyan, Saumya Singh, Harkirat Singh, and more.
        </p>

        <div
          className="mt-8 grid grid-cols-2 gap-2 rounded-xl border border-paper-line bg-white p-1.5 dark:border-zinc-800 dark:bg-zinc-900"
          role="tablist"
          aria-label="Learn content"
        >
          <button
            type="button"
            role="tab"
            aria-selected={tab === 'videos'}
            onClick={() => setTab('videos')}
            className={`rounded-lg px-3 py-2.5 font-sans text-sm font-medium tracking-tight transition ${
              tab === 'videos'
                ? 'bg-ink text-white dark:bg-white dark:text-ink'
                : 'text-ink-muted hover:text-ink dark:text-zinc-400 dark:hover:text-white'
            }`}
          >
            Video guides
          </button>
          <button
            type="button"
            role="tab"
            aria-selected={tab === 'articles'}
            onClick={() => setTab('articles')}
            className={`rounded-lg px-3 py-2.5 font-sans text-sm font-medium tracking-tight transition ${
              tab === 'articles'
                ? 'bg-ink text-white dark:bg-white dark:text-ink'
                : 'text-ink-muted hover:text-ink dark:text-zinc-400 dark:hover:text-white'
            }`}
          >
            Articles & blogs
          </button>
        </div>

        <p className="mt-4">
          <Link
            to="/beginner-guide"
            className="font-sans text-sm font-medium text-accent hover:underline"
          >
            Prefer a written step-by-step path? →
          </Link>
        </p>
      </header>

      {tab === 'videos' ? (
        <section role="tabpanel" aria-label="Video guides">
          {featuredVideo ? (
            <div className="border-t border-paper-line pt-10 dark:border-zinc-800">
              <h2 className="font-display text-2xl font-medium text-ink dark:text-white">
                Start here
              </h2>
              <p className="mt-2 text-sm text-ink-muted">
                The full beginner path — watch this first, then explore more guides below.
              </p>
              <div className="mt-10">
                <VideoEmbed video={featuredVideo} priority />
              </div>
            </div>
          ) : null}

          <div className="mt-14 border-t border-paper-line pt-10 dark:border-zinc-800">
            <h2 className="font-display text-2xl font-medium text-ink dark:text-white">
              Indian creators
            </h2>
            <p className="mt-2 text-sm text-ink-muted">
              Click play to load each embed. Crash courses and Hindi-friendly walkthroughs.
            </p>
            <div className="mt-10 space-y-12">
              {indianVideos.map((video) => (
                <VideoEmbed key={video.playlistId || video.youtubeId} video={video} />
              ))}
            </div>
          </div>

          <div className="mt-14 border-t border-paper-line pt-10 dark:border-zinc-800">
            <h2 className="font-display text-2xl font-medium text-ink dark:text-white">
              International guides
            </h2>
            <p className="mt-2 text-sm text-ink-muted">
              Longer courses and crisp fork-to-PR demos from global educators.
            </p>
            <div className="mt-10 space-y-12">
              {globalVideos.map((video) => (
                <VideoEmbed key={video.youtubeId} video={video} />
              ))}
            </div>
          </div>
        </section>
      ) : (
        <section role="tabpanel" aria-label="Articles and blogs">
          <div className="border-t border-paper-line pt-10 dark:border-zinc-800">
            <h2 className="font-display text-2xl font-medium text-ink dark:text-white">
              Articles & blogs
            </h2>
            <p className="mt-2 text-sm text-ink-muted">
              Best writing on the internet for getting started — and getting better.
            </p>

            <ul className="mt-10 divide-y divide-paper-line dark:divide-zinc-800">
              {LEARN_ARTICLES.map((article) => (
                <li key={article.href} className="py-7">
                  <p className={tagClass}>{article.tag}</p>
                  <a
                    href={article.href}
                    target="_blank"
                    rel="noreferrer"
                    className="group mt-2 block"
                  >
                    <h3 className="font-display text-xl font-medium text-ink transition group-hover:text-accent dark:text-white dark:group-hover:text-teal-300">
                      {article.title}
                    </h3>
                    <p className="mt-1 font-sans text-sm text-ink-muted">{article.source}</p>
                    <p className="mt-2 font-sans text-sm leading-relaxed text-ink-muted">
                      {article.description}
                    </p>
                    <span className="mt-3 inline-flex font-sans text-sm font-semibold text-accent">
                      Read →
                    </span>
                  </a>
                </li>
              ))}
            </ul>
          </div>
        </section>
      )}

      <section className="mt-12 border-t border-paper-line pt-10 dark:border-zinc-800">
        <h2 className="font-display text-2xl font-medium text-ink dark:text-white">
          Ready to contribute?
        </h2>
        <p className="mt-2 text-sm leading-relaxed text-ink-muted">
          You’ve got the guides. Pick a beginner issue or a quieter starter project and ship.
        </p>
        <div className="mt-5 flex flex-wrap gap-3">
          <Link to="/issues?kind=good-first" className="btn-primary">
            Find beginner issues
          </Link>
          <Link to="/starter" className="btn-secondary">
            Browse starter projects
          </Link>
          <Link to="/beginner-guide" className="btn-secondary">
            Our step-by-step guide
          </Link>
        </div>
      </section>
    </main>
  )
}

export default LearnPage
