export const SLUG_MAX_LENGTH = 96

export function slugify(input: string, maxLength = SLUG_MAX_LENGTH): string {
  return input
    .normalize('NFKD')
    .replace(/[̀-ͯ]/g, '') // strip combining marks (U+0300–U+036F)
    .toLowerCase()
    .replace(/['"‘’“”]/g, '')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '')
    .slice(0, maxLength)
    .replace(/-+$/g, '')
}
