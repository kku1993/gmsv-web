// Extract a YouTube video ID from a variety of URL formats (watch, youtu.be,
// embed, shorts). Returns null when no ID can be found.
export function youtubeId(url: string | null | undefined): string | null {
  if (!url) return null
  try {
    const u = new URL(url)
    const host = u.hostname.replace(/^www\./, '')
    if (host === 'youtu.be') {
      const id = u.pathname.slice(1)
      return id || null
    }
    if (host.endsWith('youtube.com')) {
      if (u.pathname === '/watch') return u.searchParams.get('v')
      const m = /^\/(embed|shorts|live)\/([\w-]+)/.exec(u.pathname)
      if (m) return m[2]
    }
  } catch {
    // Not a URL — fall through to regex match against the raw string.
  }
  const m = /([\w-]{11})/.exec(url)
  return m ? m[1] : null
}
