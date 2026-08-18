// Format an ISO date string (YYYY-MM-DD) as a readable date.
export function formatDate(iso: string | null | undefined): string {
  if (!iso) return ''
  const date = new Date(`${iso}T00:00:00`)
  if (Number.isNaN(date.getTime())) return iso
  return date.toLocaleDateString('en-US', {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  })
}

// Format a 24-hour HH:MM time string as a 12-hour time with am/pm.
export function formatTime(time: string | null | undefined): string {
  if (!time) return ''
  const match = /^([01]\d|2[0-3]):([0-5]\d)$/.exec(time)
  if (!match) return time
  const [, hh, mm] = match
  let hour = Number(hh)
  const ampm = hour >= 12 ? 'pm' : 'am'
  hour = hour % 12
  if (hour === 0) hour = 12
  return `${hour}:${mm}${ampm}`
}

// Format a time range, e.g. "6:30pm – 8:30pm".
export function formatTimeRange(
  start: string | null | undefined,
  end: string | null | undefined,
): string {
  const s = formatTime(start)
  const e = formatTime(end)
  if (s && e) return `${s} – ${e}`
  return s || e || ''
}
