export const SITE_ORIGIN = 'https://issuefinder.fun'

/** Prefer no trailing slash so canonical matches the live URL browsers use. */
export function absoluteUrl(pathname: string): string {
  if (!pathname || pathname === '/') return SITE_ORIGIN
  const clean = pathname.endsWith('/') ? pathname.slice(0, -1) : pathname
  return `${SITE_ORIGIN}${clean}`
}
