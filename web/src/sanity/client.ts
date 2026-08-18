import {createClient} from '@sanity/client'

export const projectId = import.meta.env.VITE_SANITY_PROJECT_ID
export const dataset = import.meta.env.VITE_SANITY_DATASET

if (!projectId || !dataset) {
  throw new Error(
    'Missing VITE_SANITY_PROJECT_ID or VITE_SANITY_DATASET. Add them to web/.env',
  )
}

export const client = createClient({
  projectId,
  dataset,
  apiVersion: '2026-08-18',
  useCdn: true,
})
