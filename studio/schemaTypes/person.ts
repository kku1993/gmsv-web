import {UserIcon} from '@sanity/icons/User'
import {defineArrayMember, defineField, defineType} from 'sanity'

export const person = defineType({
  name: 'person',
  title: 'Person',
  type: 'document',
  icon: UserIcon,
  fields: [
    defineField({
      name: 'name',
      title: 'Name',
      type: 'string',
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: 'role',
      title: 'Role',
      type: 'string',
      description: 'Title or role, e.g. "Chair", "Co-President", "Advisor".',
    }),
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
          validation: (rule) => rule.required().warning('Alt text is important for accessibility'),
        }),
      ],
    }),
    defineField({
      name: 'url',
      title: 'URL',
      type: 'url',
      description: 'External link, e.g. a LinkedIn profile.',
      validation: (rule) =>
        rule.uri({scheme: ['http', 'https']}).error('Must be a valid URL starting with http:// or https://'),
    }),
  ],
  preview: {
    select: {name: 'name', role: 'role', media: 'image'},
    prepare: ({name, role, media}) => ({
      title: name ?? 'Untitled',
      subtitle: role,
      media,
    }),
  },
})
