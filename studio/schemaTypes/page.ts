import {defineField, defineType} from 'sanity'

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
      name: 'body',
      title: 'Body',
      type: 'markdown',
      description: 'Markdown-formatted page content. Drag images into the editor or click the bottom bar to upload them.',
      options: {
        // Inserts uploaded images as Sanity asset URLs sized for body-width display.
        imageUrl: (imageAsset) => `${imageAsset.url}?w=800`,
      },
    }),
    defineField({
      name: 'bannerImage',
      title: 'Banner Image',
      type: 'image',
      description: 'Optional banner image shown at the top of the page.',
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
    select: {title: 'title', slug: 'slug.current', media: 'bannerImage'},
    prepare: ({title, slug, media}) => ({
      title: title ?? 'Untitled',
      subtitle: slug && `/${slug}`,
      media,
    }),
  },
})
