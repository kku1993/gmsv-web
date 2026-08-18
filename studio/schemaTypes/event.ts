import {CalendarIcon} from '@sanity/icons/Calendar'
import {defineField, defineType} from 'sanity'

const TIME_REGEX = /^([01]\d|2[0-3]):[0-5]\d$/

export const event = defineType({
  name: 'event',
  title: 'Event',
  type: 'document',
  icon: CalendarIcon,
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
      description: 'Unique URL-friendly identifier. Must be unique across all events.',
      options: {source: 'title'},
      validation: (rule) =>
        rule.required().custom(async (slug, context) => {
          if (!slug?.current) return true

          const client = context.getClient({apiVersion: '2026-08-18'})
          const id = context.document?._id?.replace(/^drafts\./, '')

          const existing = await client.fetch(
            `count(*[_type == "event" && slug.current == $slug && _id != $id])`,
            {slug: slug.current, id},
          )

          return existing === 0 || 'Slug already exists on another event'
        }),
    }),
    defineField({
      name: 'date',
      title: 'Date',
      type: 'date',
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: 'startTime',
      title: 'Start Time',
      type: 'string',
      description: '24-hour time in HH:MM format, e.g. 18:30.',
      validation: (rule) =>
        rule
          .required()
          .regex(TIME_REGEX)
          .error('Use 24-hour HH:MM format, e.g. 18:30'),
    }),
    defineField({
      name: 'endTime',
      title: 'End Time',
      type: 'string',
      description: '24-hour time in HH:MM format, e.g. 20:30.',
      validation: (rule) =>
        rule
          .required()
          .regex(TIME_REGEX)
          .error('Use 24-hour HH:MM format, e.g. 20:30')
          .custom((endTime, context) => {
            const startTime = context.document?.startTime
            if (startTime && endTime && endTime < startTime) {
              return 'End time must be at or after the start time'
            }
            return true
          }),
    }),
    defineField({
      name: 'locationName',
      title: 'Location Name',
      type: 'string',
      description: 'Venue or place name, e.g. "Community Center".',
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: 'locationAddress',
      title: 'Location Address',
      type: 'text',
      description: 'Street address of the venue. Use line breaks for multi-line addresses.',
      rows: 3,
    }),
    defineField({
      name: 'description',
      title: 'Description',
      type: 'markdown',
      description: 'Markdown-formatted description of the event.',
    }),
    defineField({
      name: 'bannerPhoto',
      title: 'Banner Photo',
      type: 'image',
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
    select: {title: 'title', slug: 'slug.current', date: 'date', media: 'bannerPhoto'},
    prepare: ({title, slug, date, media}) => ({
      title: title ?? 'Untitled',
      subtitle: [date, slug && `/${slug}`].filter(Boolean).join(' · '),
      media,
    }),
  },
})
