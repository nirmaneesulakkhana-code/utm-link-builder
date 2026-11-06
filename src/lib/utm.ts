export interface UtmParams {
  source: string
  medium: string
  campaign: string
  content: string
  term: string
}

/**
 * Standardizes a UTM value: lowercase, spaces and hyphens become underscores,
 * anything other than letters, numbers, underscores and dots is removed.
 * Keeps reporting clean ("Summer Sale" and "summer-sale" both become "summer_sale").
 */
export function normalizeValue(value: string): string {
  return value
    .trim()
    .toLowerCase()
    .replace(/[\s-]+/g, '_')
    .replace(/[^a-z0-9_.]/g, '')
    .replace(/_+/g, '_')
    .replace(/^_|_$/g, '')
}

export function validateLandingUrl(raw: string): string | null {
  const value = raw.trim()
  if (!value) return 'Landing page URL is required.'
  let url: URL
  try {
    url = new URL(value)
  } catch {
    return 'Enter a complete URL, including https:// (for example https://example.com/products).'
  }
  if (url.protocol !== 'http:' && url.protocol !== 'https:') {
    return 'The URL must start with http:// or https://.'
  }
  if (!url.hostname.includes('.') && url.hostname !== 'localhost') {
    return 'The URL needs a valid domain, such as example.com.'
  }
  return null
}

/**
 * Builds the tracking URL. Existing query parameters and #fragments on the
 * landing page are preserved; any existing utm_* parameters are replaced.
 */
export function buildUtmUrl(landing: string, p: UtmParams): string | null {
  if (validateLandingUrl(landing)) return null
  const url = new URL(landing.trim())
  for (const key of [...url.searchParams.keys()]) {
    if (key.toLowerCase().startsWith('utm_')) url.searchParams.delete(key)
  }
  const pairs: [string, string][] = [
    ['utm_source', p.source],
    ['utm_medium', p.medium],
    ['utm_campaign', p.campaign],
    ['utm_content', p.content],
    ['utm_term', p.term],
  ]
  for (const [k, v] of pairs) {
    const value = v.trim()
    if (value) url.searchParams.set(k, value)
  }
  return url.toString()
}
