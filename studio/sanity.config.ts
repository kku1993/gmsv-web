import {defineConfig} from 'sanity'
import {structureTool} from 'sanity/structure'
import {visionTool} from '@sanity/vision'
import {documentInternationalization} from '@sanity/document-internationalization'
import {markdownSchema} from 'sanity-plugin-markdown'
import {schemaTypes} from './schemaTypes'

export default defineConfig({
  name: 'default',
  title: 'gmsv-web',

  projectId: 'aqo7zrnm',
  dataset: 'production',

  plugins: [
    structureTool(),
    visionTool(),
    markdownSchema(),
    documentInternationalization({
      // Fetch supported languages from the Content Lake
      supportedLanguages: (client) =>
        client.fetch(`*[_type == "locale"]{ "id": tag, "title": name } | order(id asc)`),
      // Document types to localize
      schemaTypes: ['page'],
    }),
  ],

  schema: {
    types: schemaTypes,
  },
})
