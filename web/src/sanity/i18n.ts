export const DEFAULT_LOCALE = 'en'

export const LOCALES = [
  {id: 'en', title: 'English'},
  {id: 'zh-Hant', title: '繁體中文'},
] as const

export type LocaleId = (typeof LOCALES)[number]['id']

export function isLocaleId(value: string | undefined): value is LocaleId {
  return !!value && (LOCALES as readonly {id: string}[]).some((l) => l.id === value)
}

// Default locale lives at root (no prefix); other locales are prefixed.
export function localePrefix(locale: LocaleId): string {
  return locale === DEFAULT_LOCALE ? '' : `/${locale}`
}

// Build a URL for a page in a given locale.
export function pagePath(locale: LocaleId, slug: string): string {
  const prefix = localePrefix(locale)
  return `${prefix}/${slug}`
}
