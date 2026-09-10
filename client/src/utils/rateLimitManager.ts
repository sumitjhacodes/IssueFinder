/**
 * GitHub search rate-limit helpers.
 * IMPORTANT: X-RateLimit-Reset is present on every response and is normally in the
 * future — that alone does NOT mean we are rate-limited. Only remaining === 0 does.
 */

const RATE_LIMIT_STORAGE_KEY = 'github_rate_limit_reset'
const RATE_LIMIT_REMAINING_KEY = 'github_rate_limit_remaining'

export function getRateLimitResetTime(): number | null {
  try {
    const stored = localStorage.getItem(RATE_LIMIT_STORAGE_KEY)
    if (!stored) return null
    const resetTime = parseInt(stored, 10)
    if (resetTime <= Date.now()) {
      clearRateLimitInfo()
      return null
    }
    return resetTime
  } catch {
    return null
  }
}

export function getRateLimitRemaining(): number | null {
  try {
    const stored = localStorage.getItem(RATE_LIMIT_REMAINING_KEY)
    if (stored === null) return null
    return parseInt(stored, 10)
  } catch {
    return null
  }
}

/** True only when the last response reported 0 remaining and reset is still ahead */
export function isRateLimited(): boolean {
  const remaining = getRateLimitRemaining()
  if (remaining === null) return false
  if (remaining > 0) return false
  const resetTime = getRateLimitResetTime()
  return resetTime !== null && Date.now() < resetTime
}

export function getTimeUntilReset(): number {
  const resetTime = getRateLimitResetTime()
  if (!resetTime) return 0
  return Math.max(0, resetTime - Date.now())
}

export function updateRateLimitInfo(headers: Headers): void {
  try {
    const remaining = headers.get('X-RateLimit-Remaining')
    const reset = headers.get('X-RateLimit-Reset')

    if (remaining !== null) {
      localStorage.setItem(RATE_LIMIT_REMAINING_KEY, remaining)
    }

    // Only persist a blocking reset window when we are actually out of quota
    if (remaining === '0' && reset !== null) {
      localStorage.setItem(RATE_LIMIT_STORAGE_KEY, String(parseInt(reset, 10) * 1000))
    } else if (remaining !== null && parseInt(remaining, 10) > 0) {
      localStorage.removeItem(RATE_LIMIT_STORAGE_KEY)
    }
  } catch {
    /* ignore */
  }
}

export function clearRateLimitInfo(): void {
  try {
    localStorage.removeItem(RATE_LIMIT_STORAGE_KEY)
    localStorage.removeItem(RATE_LIMIT_REMAINING_KEY)
  } catch {
    /* ignore */
  }
}

export function waitForRateLimitReset(): Promise<void> {
  return new Promise((resolve) => {
    const waitTime = getTimeUntilReset()
    if (waitTime === 0) {
      clearRateLimitInfo()
      resolve()
      return
    }
    setTimeout(() => {
      clearRateLimitInfo()
      resolve()
    }, waitTime + 1000)
  })
}
