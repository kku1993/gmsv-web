import {ImagesIcon} from '@sanity/icons/Images'
import {defineArrayMember, defineField, defineType} from 'sanity'

export const gallery = defineType({
  name: 'gallery',
  title: 'Gallery',
  type: 'document',
  icon: ImagesIcon,
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
      description: 'Unique URL-friendly identifier. Must be unique across all galleries.',
      options: {source: 'title'},
      validation: (rule) =>
        rule.required().custom(async (slug, context) => {
          if (!slug?.current) return true

          const client = context.getClient({apiVersion: '2026-08-18'})
          const id = context.document?._id?.replace(/^drafts\./, '')

          const existing = await client.fetch(
            `count(*[_type == "gallery" && slug.current == $slug && _id != $id])`,
            {slug: slug.current, id},
          )

          return existing === 0 || 'Slug already exists on another gallery'
        }),
    }),
    defineField({
      name: 'date',
      title: 'Date',
      type: 'date',
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: 'coverPhoto',
      title: 'Cover Photo',
      type: 'image',
      options: {hotspot: true},
      validation: (rule) => rule.required(),
      fields: [
        defineField({
          name: 'alt',
          title: 'Alternative Text',
          type: 'string',
          validation: (rule) => rule.required().warning('Alt text is important for accessibility'),
        }),
      ],
    }),
    defineField({
      name: 'photos',
      title: 'Photos',
      type: 'array',
      description: 'The collection of photos shown inside this gallery.',
      of: [
        defineArrayMember({
          name: 'photo',
          title: 'Photo',
          type: 'image',
          options: {hotspot: true},
          fields: [
            defineField({
              name: 'alt',
              title: 'Alternative Text',
              type: 'string',
              validation: (rule) =>
                rule.required().warning('Alt text is important for accessibility'),
            }),
          ],
        }),
      ],
      validation: (rule) => rule.min(1).error('Add at least one photo'),
    }),
  ],
  preview: {
    select: {title: 'title', slug: 'slug.current', date: 'date', photos: 'photos', media: 'coverPhoto'},
    prepare: ({title, slug, date, photos, media}) => {
      const count = Array.isArray(photos) ? photos.length : 0
      return {
        title: title ?? 'Untitled',
        subtitle: [date, `${count} photo${count === 1 ? '' : 's'}`, slug && `/${slug}`]
          .filter(Boolean)
          .join(' · '),
        media,
      }
    },
  },
})
