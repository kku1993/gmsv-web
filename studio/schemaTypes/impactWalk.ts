import {ImagesIcon} from '@sanity/icons/Images'
import {defineArrayMember, defineField, defineType} from 'sanity'

export const impactWalk = defineType({
  name: 'impactWalk',
  title: 'Impact Walk',
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
      name: 'items',
      title: 'Items',
      type: 'array',
      description: 'Ordered collection of images, each with an optional caption.',
      of: [
        defineArrayMember({
          type: 'object',
          name: 'impactWalkItem',
          title: 'Impact Walk Item',
          fields: [
            defineField({
              name: 'image',
              title: 'Image',
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
              validation: (rule) => rule.required(),
            }),
            defineField({
              name: 'description',
              title: 'Description',
              type: 'text',
              rows: 3,
            }),
          ],
          preview: {
            select: {media: 'image', title: 'description'},
            prepare: ({media, title}) => ({
              title: title ?? 'Untitled item',
              media,
            }),
          },
        }),
      ],
      validation: (rule) => rule.min(1).error('Add at least one item'),
    }),
  ],
  preview: {
    select: {title: 'title', itemCount: 'items'},
    prepare: ({title, itemCount}) => ({
      title: title ?? 'Untitled',
      subtitle: `${itemCount?.length ?? 0} item${itemCount?.length === 1 ? '' : 's'}`,
    }),
  },
})
