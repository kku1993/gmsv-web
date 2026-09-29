import {defineConfig} from 'sanity'
import {structureTool} from 'sanity/structure'
import {visionTool} from '@sanity/vision'
import {markdownSchema} from 'sanity-plugin-markdown'
import {slugOnPublish} from './actions/slugOnPublish'
import {schemaTypes} from './schemaTypes'

export default defineConfig({
  name: 'default',
  title: 'gmsv-web',

  projectId: 'aqo7zrnm',
  dataset: 'production',

  plugins: [structureTool(), visionTool(), markdownSchema()],

  schema: {
    types: schemaTypes,
  },

  document: {
    actions: (prev, context) => {
      const schemaType = context.schema.get(context.schemaType)
      const hasSlugField =
        schemaType &&
        'fields' in schemaType &&
        schemaType.fields.some((field) => field.name === 'slug')

      return prev.map((action) =>
        action.action === 'publish' && hasSlugField ? slugOnPublish(action) : action,
      )
    },
  },
})
