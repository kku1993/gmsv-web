import {PlayIcon} from '@sanity/icons/Play'
import {defineField, defineType} from 'sanity'

export const podcast = defineType({
  name: 'podcast',
  title: 'Podcast',
  type: 'document',
  icon: PlayIcon,
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
      description: 'Unique URL-friendly identifier. Must be unique across all podcasts.',
      options: {source: 'title'},
      validation: (rule) =>
        rule.required().custom(async (slug, context) => {
          if (!slug?.current) return true

          const client = context.getClient({apiVersion: '2026-08-18'})
          const id = context.document?._id?.replace(/^drafts\./, '')

          const existing = await client.fetch(
            `count(*[_type == "podcast" && slug.current == $slug && _id != $id])`,
            {slug: slug.current, id},
          )

          return existing === 0 || 'Slug already exists on another podcast'
        }),
    }),
    defineField({
      name: 'date',
      title: 'Date',
      type: 'date',
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: 'youtubeLink',
      title: 'YouTube Link',
      type: 'url',
      description: 'URL of the podcast episode on YouTube.',
      validation: (rule) =>
        rule
          .uri({scheme: ['http', 'https']})
          .required()
          .error('Must be a valid URL starting with http:// or https://'),
    }),
    defineField({
      name: 'bannerPhoto',
      title: 'Banner Photo',
      type: 'image',
      description: 'Optional banner image for the podcast episode.',
      options: {hotspot: true},
      fields: [
        defineField({
          name: 'alt',
          title: 'Alternative Text',
          type: 'string',
          validation: (rule) => rule.required().warning('Alt text is important for accessibility'),
        }),
      ],
    }),
  ],
  preview: {
    select: {title: 'title', slug: 'slug.current', date: 'date'},
    prepare: ({title, slug, date}) => ({
      title: title ?? 'Untitled',
      subtitle: [date, slug && `/${slug}`].filter(Boolean).join(' · '),
    }),
  },
})
