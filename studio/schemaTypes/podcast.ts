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
  ],
  preview: {
    select: {title: 'title', date: 'date'},
    prepare: ({title, date}) => ({
      title: title ?? 'Untitled',
      subtitle: date,
    }),
  },
})
