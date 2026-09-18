/**
 * Post-build prerender: writes per-route HTML with correct meta + JSON-LD.
 * Crawlable body copy is injected into a visually hidden sibling (not #root)
 * so refresh does not flash a different UI before React mounts.
 */
import { readFileSync, writeFileSync, mkdirSync, existsSync } from 'node:fs'
import { dirname, join } from 'node:path'
import { fileURLToPath } from 'node:url'
import {
  getJsonLdForPath,
  getSeoForPath,
  PUBLIC_SEO_PATHS,
  type PublicSeoPath,
} from '../src/constants/seo'
import { ALL_GUIDES } from '../src/content/guides'
import { absoluteUrl, SITE_ORIGIN } from '../src/utils/siteUrl'

const __dirname = dirname(fileURLToPath(import.meta.url))
const distDir = join(__dirname, '..', 'dist')
const templatePath = join(distDir, 'index.html')

function escapeHtml(text: string): string {
  return text
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
}

function replaceMeta(html: string, path: string): string {
  const seo = getSeoForPath(path)
  const url = absoluteUrl(path)
  const robots = seo.noindex ? 'noindex, follow' : 'index, follow'

  let out = html
  out = out.replace(/<title>[^<]*<\/title>/, `<title>${escapeHtml(seo.title)}</title>`)
  out = out.replace(
    /<meta\s+name="description"\s+content="[^"]*"\s*\/>/,
    `<meta name="description" content="${escapeHtml(seo.description)}" />`
  )
  out = out.replace(
    /<meta\s+name="robots"\s+content="[^"]*"\s*\/>/,
    `<meta name="robots" content="${robots}" />`
  )
  out = out.replace(
    /<link\s+rel="canonical"\s+href="[^"]*"\s*\/>/,
    `<link rel="canonical" href="${url}" />`
  )
  out = out.replace(
    /<meta\s+property="og:url"\s+content="[^"]*"\s*\/>/,
    `<meta property="og:url" content="${url}" />`
  )
  out = out.replace(
    /<meta\s+property="og:title"\s+content="[^"]*"\s*\/>/,
    `<meta property="og:title" content="${escapeHtml(seo.title)}" />`
  )
  out = out.replace(
    /<meta\s+property="og:description"\s+content="[^"]*"\s*\/>/,
    `<meta property="og:description" content="${escapeHtml(seo.description)}" />`
  )
  out = out.replace(
    /<meta\s+name="twitter:title"\s+content="[^"]*"\s*\/>/,
    `<meta name="twitter:title" content="${escapeHtml(seo.title)}" />`
  )
  out = out.replace(
    /<meta\s+name="twitter:description"\s+content="[^"]*"\s*\/>/,
    `<meta name="twitter:description" content="${escapeHtml(seo.description)}" />`
  )

  const jsonLd = getJsonLdForPath(path)
    .map((block) => `<script type="application/ld+json">${JSON.stringify(block)}</script>`)
    .join('\n    ')

  if (jsonLd) {
    out = out.replace('</head>', `    ${jsonLd}\n  </head>`)
  }

  return out
}

function bodyForPath(path: PublicSeoPath): string {
  const seo = getSeoForPath(path)
  const guide = ALL_GUIDES.find((g) => g.path === path)

  if (guide) {
    const sections = guide.sections
      .map((section) => {
        const paras = section.paragraphs.map((p) => `<p>${escapeHtml(p)}</p>`).join('')
        const bullets = section.bullets?.length
          ? `<ul>${section.bullets.map((b) => `<li>${escapeHtml(b)}</li>`).join('')}</ul>`
          : ''
        return `<section><h2>${escapeHtml(section.heading)}</h2>${paras}${bullets}</section>`
      })
      .join('')
    return `<article><h1>${escapeHtml(guide.title)}</h1><p>${escapeHtml(guide.intro)}</p>${sections}</article>`
  }

  const heading = seo.title.split(' | ')[0] ?? seo.title
  return `<div><h1>${escapeHtml(heading)}</h1><p>${escapeHtml(seo.description)}</p><p>Explore <a href="${SITE_ORIGIN}/issues">good first issues</a>, <a href="${SITE_ORIGIN}/starter">starter projects</a>, <a href="${SITE_ORIGIN}/bounty">open source bounties</a>, and <a href="${SITE_ORIGIN}/learn">contribution guides</a>.</p></div>`
}

/** Keep #root empty for React; put crawlable copy off-screen (not display:none). */
function injectSeoBody(html: string, body: string): string {
  const block = `<div id="seo-prerender" style="position:absolute;width:1px;height:1px;padding:0;margin:-1px;overflow:hidden;clip:rect(0,0,0,0);white-space:nowrap;border:0">${body}</div>`
  return html.replace(/<div id="root"><\/div>/, `<div id="root"></div>\n    ${block}`)
}

function outPathForRoute(path: string): string {
  if (path === '/') return join(distDir, 'index.html')
  const segments = path.replace(/^\//, '').split('/')
  return join(distDir, ...segments, 'index.html')
}

function main() {
  if (!existsSync(templatePath)) {
    console.error('dist/index.html missing — run vite build first')
    process.exit(1)
  }

  const template = readFileSync(templatePath, 'utf8')
  let count = 0

  for (const path of PUBLIC_SEO_PATHS) {
    let html = replaceMeta(template, path)
    html = injectSeoBody(html, bodyForPath(path))
    const dest = outPathForRoute(path)
    mkdirSync(dirname(dest), { recursive: true })
    writeFileSync(dest, html, 'utf8')
    count += 1
    console.log(`prerender ${path}`)
  }

  console.log(`Prerendered ${count} routes for ${SITE_ORIGIN}`)
}

main()
