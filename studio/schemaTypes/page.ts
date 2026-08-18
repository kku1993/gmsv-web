import {defineArrayMember, defineField, defineType} from 'sanity'

export const page = defineType({
  name: 'page',
  title: 'Page',
  type: 'document',
  fields: [
    defineField({
      name: 'title',
      title: 'Title',
      type: 'string',
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: 'slug',
      title: 'Slug',
      type: 'slug',
      options: {source: 'title'},
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: 'excerpt',
      title: 'Excerpt',
      type: 'string',
      description: 'Short summary used in listings and meta descriptions.',
      options: {maxLength: 160},
    }),
    defineField({
      name: 'body',
      title: 'Body',
      type: 'array',
      of: [defineArrayMember({type: 'block'})],
    }),
    defineField({
      name: 'people',
      title: 'People',
      type: 'array',
      description: 'Team members shown on this page (e.g. the About page).',
      of: [defineArrayMember({type: 'reference', to: [{type: 'person'}]})],
    }),
    // Managed by @sanity/document-internationalization — set automatically from the
    // language picker, hidden from editors.
    defineField({
      name: 'language',
      title: 'Language',
      type: 'string',
      readOnly: true,
      hidden: true,
    }),
  ],
  preview: {
    select: {title: 'title', slug: 'slug.current', language: 'language'},
    prepare: ({title, slug, language}) => ({
      title: title ?? 'Untitled',
      subtitle: [language?.toUpperCase(), slug && `/${slug}`].filter(Boolean).join(' · '),
    }),
  },
})
