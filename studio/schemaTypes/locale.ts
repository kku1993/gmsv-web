import {TranslateIcon} from '@sanity/icons/Translate'
import {defineField, defineType} from 'sanity'

export const localeType = defineType({
  name: 'locale',
  title: 'Locale',
  icon: TranslateIcon,
  type: 'document',
  fields: [
    defineField({
      name: 'name',
      title: 'Name',
      type: 'string',
      validation: (r) => r.required(),
    }),
    defineField({
      name: 'tag',
      title: 'Language Tag',
      type: 'string',
      description: 'IANA tag (e.g. en, zh-Hant)',
      validation: (r) => r.required(),
    }),
    defineField({
      name: 'fallback',
      title: 'Fallback Locale',
      type: 'reference',
      to: [{type: 'locale'}],
      description: 'Locale to fall back to when a translation is missing.',
    }),
    defineField({
      name: 'default',
      title: 'Default Locale',
      type: 'boolean',
      description: 'Mark the primary locale. Only one locale should have this set.',
    }),
  ],
  preview: {select: {title: 'name', subtitle: 'tag'}},
})
