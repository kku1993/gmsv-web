// One-off importer: scrape galleries from goodmorningsv.org (Squarespace) and
// create `gallery` documents in Sanity, uploading all images as assets.
// Usage: node import-galleries.mjs [--dry]
import {createClient} from '@sanity/client'
import crypto from 'node:crypto'
import fs from 'node:fs'
import os from 'node:os'
import path from 'node:path'

const SITE = 'https://www.goodmorningsv.org'
const DRY = process.argv.includes('--dry')

const cfg = JSON.parse(
  fs.readFileSync(path.join(os.homedir(), '.config/sanity/config.json'), 'utf8'),
)
const client = createClient({
  projectId: 'aqo7zrnm',
  dataset: 'production',
  apiVersion: '2026-08-18',
  token: cfg.authToken,
  useCdn: false,
})

// Site-wide assets that appear on every page (header logo, favicon).
const SKIP = /favicon\.ico|GMSVnewlogo/i
// content/v1/<siteId>/<assetId>/<filename> — asset ids are uuid OR legacy alphanumeric.
const IMG_RE = /content\/v1\/[a-z0-9]+\/[A-Za-z0-9_-]+\/[^"'?&)\\< &]+/g

const slugify = (t) =>
  t
    .toLowerCase()
    .normalize('NFKD')
    .replace(/[^\p{L}\p{N}]+/gu, '-')
    .replace(/^-+|-+$/g, '')

const basename = (p) =>
  decodeURIComponent(p.split('/').pop() || '')
    .replace(/\+/g, ' ')
    .toLowerCase()

function extractPageImages(html) {
  const out = []
  const seen = new Set()
  for (const m of html.matchAll(IMG_RE)) {
    const p = m[0]
    const key = p.toLowerCase()
    if (seen.has(key) || SKIP.test(p)) continue
    seen.add(key)
    out.push(p)
  }
  return out
}

async function uploadImage(pathname, filename) {
  const url = `https://images.squarespace-cdn.com/${pathname}`
  // Exclude webp/avif from Accept so the CDN returns the original encoding.
  const res = await fetch(url, {headers: {Accept: 'image/jpeg,image/png,image/gif'}})
  if (!res.ok) throw new Error(`GET ${url} -> ${res.status}`)
  const buf = Buffer.from(await res.arrayBuffer())
  return client.assets.upload('image', buf, {filename})
}

async function main() {
  const list = await (await fetch(`${SITE}/gallery?format=json`)).json()
  const items = list.items ?? []
  console.log(`${items.length} galleries found on ${SITE}/gallery`)

  for (const item of items) {
    const title = item.title?.trim() || 'Untitled gallery'
    const slug = slugify(title)

    const existing = await client.fetch(
      'count(*[_type == "gallery" && slug.current == $slug])',
      {slug},
    )
    if (existing) {
      console.log(`SKIP "${title}" — slug ${slug} already exists`)
      continue
    }

    const html = await (await fetch(`${SITE}${item.fullUrl}`)).text()
    const pageImgs = extractPageImages(html)

    // Ordered photo paths: portfolio cover (assetUrl) first, then page images,
    // deduped by decoded filename (same file can have different asset ids).
    const paths = []
    const seenBase = new Set()
    const add = (p) => {
      const b = basename(p)
      if (!b || seenBase.has(b) || SKIP.test(b)) return
      seenBase.add(b)
      paths.push(p)
    }
    if (item.assetUrl) add(new URL(item.assetUrl).pathname.replace(/^\//, ''))
    pageImgs.forEach(add)

    console.log(`"${title}" -> /gallery/${slug} — ${paths.length} image(s)`)

    if (DRY) {
      paths.forEach((p) => console.log(`   ${basename(p)}`))
      continue
    }

    const assets = []
    for (const p of paths) {
      const asset = await uploadImage(p, basename(p))
      assets.push(asset)
      process.stdout.write(`   uploaded ${basename(p)}\n`)
    }

    const photos = assets.map((a) => ({
      _type: 'photo',
      _key: crypto.randomBytes(6).toString('hex'),
      asset: {_type: 'reference', _ref: a._id},
      alt: title,
    }))

    await client.create({
      _type: 'gallery',
      title,
      slug: {_type: 'slug', current: slug},
      coverPhoto: {_type: 'image', asset: {_type: 'reference', _ref: assets[0]._id}, alt: title},
      photos,
    })
    console.log(`   CREATED gallery "${slug}"`)
  }
}

main().catch((e) => {
  console.error(e)
  process.exit(1)
})
