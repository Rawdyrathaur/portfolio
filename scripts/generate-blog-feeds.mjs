import fs from 'fs/promises'
import path from 'path'
import { createServer } from 'vite'

const OUTPUT_DIR = 'public'
const SITEMAP_PATH = path.join(OUTPUT_DIR, 'sitemap.xml')
const RSS_PATH = path.join(OUTPUT_DIR, 'rss.xml')
const ROBOTS_PATH = path.join(OUTPUT_DIR, 'robots.txt')

const fallbackMetadata = {
  siteName: 'Manish Rathaur Portfolio',
  author: 'Manish Rathaur',
  baseUrl: 'https://www.manishrathaur.tech',
  defaultDescription:
    'Portfolio and technical blog by Manish Rathaur.',
}

function escapeXml(value = '') {
  return String(value)
    .replaceAll('&', '&amp;')
    .replaceAll('<', '&lt;')
    .replaceAll('>', '&gt;')
    .replaceAll('"', '&quot;')
    .replaceAll("'", '&apos;')
}

function normalizeBaseUrl(baseUrl) {
  const normalized = String(baseUrl || '').trim().replace(/\/$/, '')

  if (!/^https?:\/\//.test(normalized)) {
    throw new Error(`Invalid site baseUrl: "${baseUrl}"`)
  }

  return normalized
}

function toDate(value) {
  const date = new Date(value)

  if (Number.isNaN(date.getTime())) {
    return null
  }

  return date
}

function toIsoDate(value, fallbackDate) {
  return (toDate(value) || fallbackDate).toISOString()
}

function toRssDate(value, fallbackDate) {
  return (toDate(value) || fallbackDate).toUTCString()
}

function postUpdatedDate(post) {
  return toDate(post.updatedAt) || toDate(post.date) || new Date(0)
}

function sortPostsByDate(posts) {
  return [...posts].sort(
    (a, b) => postUpdatedDate(b).getTime() - postUpdatedDate(a).getTime(),
  )
}

async function writeFileIfChanged(filePath, nextContent) {
  try {
    const currentContent = await fs.readFile(filePath, 'utf8')

    if (currentContent === nextContent) {
      console.log(`unchanged: ${filePath}`)
      return
    }
  } catch {
    // File does not exist yet.
  }

  await fs.writeFile(filePath, nextContent)
  console.log(`updated: ${filePath}`)
}

async function loadBlogData() {
  const server = await createServer({
    logLevel: 'error',
    server: {
      middlewareMode: true,
    },
    appType: 'custom',
  })

  try {
    const blogModule = await server.ssrLoadModule('/src/content/blog/posts.jsx')

    let siteMetadata = fallbackMetadata

    try {
      const metadataModule = await server.ssrLoadModule('/src/content/site/metadata.js')
      siteMetadata = {
        ...fallbackMetadata,
        ...metadataModule.siteMetadata,
      }
    } catch {
      // Use fallback metadata if the metadata file does not exist.
    }

    return {
      posts: blogModule.getSortedBlogPosts(),
      siteMetadata,
    }
  } finally {
    await server.close()
  }
}

function buildSitemap({ baseUrl, posts, latestContentDate }) {
  const urls = [
    {
      loc: `${baseUrl}/`,
      priority: '1.0',
      changefreq: 'monthly',
      lastmod: latestContentDate.toISOString(),
    },
    {
      loc: `${baseUrl}/blog`,
      priority: '0.8',
      changefreq: 'weekly',
      lastmod: latestContentDate.toISOString(),
    },
    ...posts.map((post) => ({
      loc: `${baseUrl}/blog/${post.slug}`,
      priority: '0.7',
      changefreq: 'monthly',
      lastmod: toIsoDate(post.updatedAt || post.date, latestContentDate),
    })),
  ]

  return `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${urls
  .map(
    (url) => `  <url>
    <loc>${escapeXml(url.loc)}</loc>
    <lastmod>${escapeXml(url.lastmod)}</lastmod>
    <changefreq>${url.changefreq}</changefreq>
    <priority>${url.priority}</priority>
  </url>`,
  )
  .join('\n')}
</urlset>
`
}

function buildRss({ baseUrl, posts, siteMetadata, latestContentDate }) {
  return `<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0" xmlns:atom="http://www.w3.org/2005/Atom">
  <channel>
    <title>${escapeXml(siteMetadata.siteName)}</title>
    <link>${escapeXml(baseUrl)}/blog</link>
    <atom:link href="${escapeXml(baseUrl)}/rss.xml" rel="self" type="application/rss+xml" />
    <description>${escapeXml(siteMetadata.defaultDescription)}</description>
    <language>en</language>
    <lastBuildDate>${latestContentDate.toUTCString()}</lastBuildDate>
    <managingEditor>${escapeXml(siteMetadata.author)}</managingEditor>
    <webMaster>${escapeXml(siteMetadata.author)}</webMaster>
${posts
  .map((post) => {
    const url = `${baseUrl}/blog/${post.slug}`
    const description = post.summary || post.subtitle || ''

    return `    <item>
      <title>${escapeXml(post.title)}</title>
      <link>${escapeXml(url)}</link>
      <guid isPermaLink="true">${escapeXml(url)}</guid>
      <description>${escapeXml(description)}</description>
      <pubDate>${toRssDate(post.date, latestContentDate)}</pubDate>
    </item>`
  })
  .join('\n')}
  </channel>
</rss>
`
}

function buildRobotsTxt({ baseUrl }) {
  return `User-agent: *
Allow: /

Sitemap: ${baseUrl}/sitemap.xml
`
}

const { posts: allPosts, siteMetadata } = await loadBlogData()
const baseUrl = normalizeBaseUrl(siteMetadata.baseUrl)

const publishedPosts = sortPostsByDate(
  allPosts.filter((post) => post.status === 'published'),
)

const latestContentDate =
  publishedPosts.length > 0
    ? postUpdatedDate(publishedPosts[0])
    : new Date()

await fs.mkdir(OUTPUT_DIR, { recursive: true })

await writeFileIfChanged(
  SITEMAP_PATH,
  buildSitemap({
    baseUrl,
    posts: publishedPosts,
    latestContentDate,
  }),
)

await writeFileIfChanged(
  RSS_PATH,
  buildRss({
    baseUrl,
    posts: publishedPosts,
    siteMetadata,
    latestContentDate,
  }),
)

await writeFileIfChanged(
  ROBOTS_PATH,
  buildRobotsTxt({
    baseUrl,
  }),
)

console.log(`Generated feeds for ${publishedPosts.length} published post(s).`)
