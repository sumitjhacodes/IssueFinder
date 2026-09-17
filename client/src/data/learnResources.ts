export type LearnArticle = {
  title: string
  source: string
  description: string
  href: string
  tag: 'Essentials' | 'Practice' | 'Workflow' | 'Mindset'
}

export type LearnVideo = {
  title: string
  channel: string
  description: string
  duration: string
  /** Single video id (omit when embedding a playlist) */
  youtubeId?: string
  /** Playlist id — embeds the full series (e.g. Piyush Garg BootCamp) */
  playlistId?: string
  /** Thumbnail fallback video id when embedding a playlist */
  thumbId?: string
  region: 'india' | 'global'
}

/** Curated external reading for first-time (and returning) OSS contributors. */
export const LEARN_ARTICLES: LearnArticle[] = [
  {
    title: 'How to Contribute to Open Source',
    source: 'Open Source Guides',
    description:
      'The canonical walkthrough — what counts as a contribution, how to find projects, and how to open a PR maintainers will review.',
    href: 'https://opensource.guide/how-to-contribute/',
    tag: 'Essentials',
  },
  {
    title: 'Contributing to open source',
    source: 'GitHub Docs',
    description:
      'Official end-to-end example: find a labeled issue, fork, branch, push, and open a pull request on a real GitHub repo.',
    href: 'https://docs.github.com/en/get-started/exploring-projects-on-github/contributing-to-open-source',
    tag: 'Essentials',
  },
  {
    title: 'First Contributions',
    source: 'GitHub',
    description:
      'A hands-on practice repo. Follow the README and land a real pull request in minutes — perfect before a “real” issue.',
    href: 'https://github.com/firstcontributions/first-contributions',
    tag: 'Practice',
  },
  {
    title: 'How to Contribute to Open Source Projects – A Beginner’s Guide',
    source: 'freeCodeCamp',
    description:
      'Long-form blog covering etiquette, finding good first issues, and the full fork → PR loop without fluff.',
    href: 'https://www.freecodecamp.org/news/how-to-contribute-to-open-source-projects-beginners-guide/',
    tag: 'Essentials',
  },
  {
    title: 'New to open source? Here’s everything you need to get started',
    source: 'The GitHub Blog',
    description:
      'GitHub’s 2025 newcomer guide — pick a project, read the repo norms, contribute beyond code, and land your first PR.',
    href: 'https://github.blog/open-source/new-to-open-source-heres-everything-you-need-to-get-started/',
    tag: 'Essentials',
  },
  {
    title: 'How to make your first contribution to an open source project',
    source: 'whitep4nth3r',
    description:
      'Practical first-contribution playbook: vet the community, pick a small issue, open a clear PR, and contribute beyond code.',
    href: 'https://whitep4nth3r.com/blog/how-to-make-your-first-open-source-contribution/',
    tag: 'Workflow',
  },
  {
    title: 'How to Contribute to Open Source for the First Time',
    source: 'Codably',
    description:
      'Why big-name repos are the wrong first target, how to pick beginner issues, and the exact workflow maintainers expect.',
    href: 'https://codably.dev/open-source/how-to-contribute-to-open-source-for-the-first-time',
    tag: 'Workflow',
  },
  {
    title: 'First Timers Only',
    source: 'firsttimersonly.com',
    description:
      'Why “first timers only” issues exist, and how maintainers signal that newcomers are welcome.',
    href: 'https://www.firsttimersonly.com/',
    tag: 'Mindset',
  },
  {
    title: 'Basic Git Workflow',
    source: 'freeCodeCamp Contribute',
    description:
      'Branch naming, syncing upstream, conventional commits, and pushing a clean PR — the habits that keep forks healthy.',
    href: 'https://contribute.freecodecamp.org/basic-git-workflow/',
    tag: 'Workflow',
  },
]

/** Complete-guide style YouTube videos (embedded on the Learn page). */
export const LEARN_VIDEOS: LearnVideo[] = [
  {
    title: 'Contributing To Open Source – Beginner’s Guide',
    channel: 'freeCodeCamp.org',
    description:
      'A full beginner path: finding issues, talking to maintainers, earning trust with small PRs, and shipping real work.',
    youtubeId: 'mklEhT_RLos',
    duration: '~2.5 hr',
    region: 'global',
  },
  {
    title: 'Open Source Crash Course – Beginner Guide to Open Source',
    channel: 'Piyush Garg',
    description:
      'Crash course on finding projects, making real contributions, and shipping your first PRs.',
    youtubeId: 'o6xikISiz2w',
    duration: 'Guide',
    region: 'india',
  },
  {
    title: 'Start Open Source Contribution – A Complete Guide',
    channel: "Coder's Gyan",
    description:
      'Hindi complete guide to starting open source — from picking issues to opening a pull request.',
    youtubeId: 'P_qAjDlfwrY',
    duration: 'Guide',
    region: 'india',
  },
  {
    title: 'Open Source for Beginners – How to Contribute',
    channel: 'Saumya Singh',
    description:
      'Beginner-friendly walkthrough of contributing to open source and landing meaningful PRs.',
    youtubeId: '2do4WZ0e8UU',
    duration: 'Guide',
    region: 'india',
  },
  {
    title: 'Making a first open source contribution',
    channel: 'Harkirat Singh',
    description:
      'Live walkthrough helping someone land their first PR — practical and India-friendly.',
    youtubeId: 'hj3oQU1z4P0',
    duration: '~32 min',
    region: 'india',
  },
  {
    title: 'How to make a Pull Request and Open Source contribution',
    channel: 'Hitesh Choudhary',
    description:
      'Clear PR workflow from an Indian educator — fork, change, push, and open the request cleanly.',
    youtubeId: 'mqJIGIxRkEs',
    duration: '~20 min',
    region: 'india',
  },
  {
    title: 'Complete Git and GitHub course in Hindi',
    channel: 'Chai aur Code',
    description:
      'Deep Git + GitHub in Hindi, including a dedicated section on open source contribution.',
    youtubeId: 'q8EevlEpQ2A',
    duration: '~2.7 hr',
    region: 'india',
  },
  {
    title: 'Git Tutorial for Beginners: Learn Git in One Video',
    channel: 'CodeWithHarry',
    description:
      'Hindi-friendly Git fundamentals so you’re ready before your first contribution.',
    youtubeId: 'AB3J8ufDYHQ',
    duration: '~1 hr',
    region: 'india',
  },
  {
    title: 'How To Get Started With Open Source',
    channel: 'Web Dev Simplified',
    description:
      'Terminal walkthrough of fork, clone, branch, commit, push, and opening a pull request on GitHub.',
    youtubeId: 'GbqSvJs-6W4',
    duration: '~20 min',
    region: 'global',
  },
  {
    title: 'How to Contribute to Open Source for Beginners',
    channel: 'Treehouse',
    description:
      'Short, clear fork-to-PR steps if you want the workflow without a long course.',
    youtubeId: 'YaToH3s_-nQ',
    duration: '~15 min',
    region: 'global',
  },
  {
    title: 'Git & GitHub Crash Course',
    channel: 'Traversy Media',
    description:
      'Branching, committing, and pushing — the Git basics every first contribution depends on.',
    youtubeId: 'vA5TTz6BXhY',
    duration: '~1 hr',
    region: 'global',
  },
]
