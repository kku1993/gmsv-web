// One-shot migration: create person documents from the crawled about page
// (name, role, url only — images are left empty for editors to upload via Studio)
// and patch the English "about" page to reference them in order.
//
// Run with: node --env-file=../web/.env scripts/migrate-about-people.mjs
import {createClient} from '@sanity/client'
import {readFileSync} from 'node:fs'
import {homedir} from 'node:os'
import {join} from 'node:path'

const projectId = process.env.VITE_SANITY_PROJECT_ID
const dataset = process.env.VITE_SANITY_DATASET

if (!projectId || !dataset) {
  throw new Error('Missing VITE_SANITY_PROJECT_ID or VITE_SANITY_DATASET')
}

// Prefer an explicit write token; fall back to the Sanity CLI session token
// stored in ~/.config/sanity/config.json (created by `sanity login`).
function resolveToken() {
  if (process.env.SANITY_WRITE_TOKEN) return process.env.SANITY_WRITE_TOKEN
  try {
    const cfg = JSON.parse(
      readFileSync(join(homedir(), '.config', 'sanity', 'config.json'), 'utf8'),
    )
    if (cfg.authToken) return cfg.authToken
  } catch {
    // ignore — fall through to error below
  }
  throw new Error(
    'No auth token found. Run `npx sanity login` first, or set SANITY_WRITE_TOKEN.',
  )
}

const token = resolveToken()

const client = createClient({
  projectId,
  dataset,
  apiVersion: '2026-08-18',
  useCdn: false,
  token,
})

// People extracted from /home/kku/projects/gmsv-web-crawl/site/about/index.md
// Order matches the source page. Image is intentionally omitted; editors upload
// portraits via Studio. Two decorative Unsplash images and the "Contact me"
// section are not modeled as people.
const people = [
  {name: 'Michelle Cheng', role: 'Chair', url: 'https://www.linkedin.com/in/siliconvalleymichelle/'},
  {name: 'Hsianghe Lee', role: 'Co-President', url: 'https://www.linkedin.com/in/hsiang-he-lee-598ba952/'},
  {name: 'Maggie Li', role: 'Co-President', url: 'https://www.linkedin.com/in/maggielisv'},
  {name: 'Tim Liao', role: 'Vice President', url: 'https://www.linkedin.com/in/mrliaotim/'},
  {name: 'Terry Yang', role: 'Vice President', url: 'https://www.linkedin.com/in/terry-yang-3b138722/'},
  {name: 'Raymond Chen', role: 'Board', url: 'https://www.linkedin.com/in/raymond-y-chen-a703986/'},
  {name: 'Kevin Ku', role: 'Board', url: 'https://www.linkedin.com/in/kku1993/'},
  {name: 'Scully Wu', role: 'Board', url: 'https://www.linkedin.com/in/scullywang'},
  {name: 'Cece Zhao', role: 'Board', url: 'https://www.linkedin.com/in/cece-zhao/'},
  {name: 'Robin Tan', role: 'Board', url: 'https://www.linkedin.com/in/packaging-guru/'},
  {name: 'Carrie Lin', role: 'Board', url: 'https://www.linkedin.com/in/carrieclin'},
  {name: 'Emil Chang', role: 'Legal Consultant', url: null},
  {name: 'Joyce Yu', role: 'Chief Finance Officer', url: 'https://www.linkedin.com/in/tsechia-yu-25a9a561'},
  {name: 'Chiayi Li', role: 'Secretary General', url: 'https://www.linkedin.com/in/chiayi-li-615002a1/'},
  {name: 'Brandon Kuo', role: 'Impact Specialist', url: 'https://www.linkedin.com/in/brandon-lichi-kuo/'},
  {name: 'Elisa Feng', role: 'High School Intern', url: 'https://www.linkedin.com/in/elisa-feng-940007303/'},
  {name: 'Chih-Kai Cheng', role: 'Advisor', url: 'https://www.linkedin.com/in/chih-kai-cheng-8b81bbbb'},
  {name: 'Limin Hu', role: 'Advisor', url: 'https://www.linkedin.com/in/limin-hu-b0a9022'},
  {name: 'David Kuo', role: 'Advisor', url: 'https://www.linkedin.com/in/david-kuo-b656a15/'},
  {name: 'Jesse Shiah', role: 'Advisor', url: 'https://www.linkedin.com/in/jesse-shiah/'},
  {name: 'Lawrence Yen', role: 'Advisor', url: 'https://www.linkedin.com/in/lawrence-mihc/'},
]

async function main() {
  console.log(`Creating ${people.length} person documents…`)

  const created = []
  for (const p of people) {
    const doc = {
      _type: 'person',
      name: p.name,
      role: p.role,
      ...(p.url ? {url: p.url} : {}),
    }
    const createdDoc = await client.create(doc)
    created.push({_key: Math.random().toString(36).slice(2), _ref: createdDoc._id, _type: 'reference'})
    console.log(`  ✓ ${p.name} — ${p.role} → ${createdDoc._id}`)
  }

  console.log('\nPatching the "about" page (en) with people references…')
  const about = await client.fetch(
    `*[_type == "page" && language == "en" && slug.current == "about"][0]{_id}`,
  )
  if (!about?._id) {
    throw new Error('Could not find the English "about" page. Create it in Studio first.')
  }

  await client.patch(about._id).set({people: created}).commit()
  console.log(`  ✓ Patched ${about._id} with ${created.length} people references.`)
  console.log('\nDone.')
}

main().catch((err) => {
  console.error(err)
  process.exit(1)
})
