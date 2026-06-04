import { createServer } from 'vite'

const server = await createServer({
  logLevel: 'error',
  server: {
    middlewareMode: true,
  },
  appType: 'custom',
})

try {
  const blogModule = await server.ssrLoadModule('/src/content/blog/posts.jsx')
  const posts = blogModule.getSortedBlogPosts()
  const errors = []
  const seenSlugs = new Set()
  const allowedStatus = new Set(['draft', 'published'])

  for (const post of posts) {
    const label = post.slug || post.title || 'Unknown post'

    if (!post.slug) {
      errors.push(`${label}: missing slug`)
    }

    if (post.slug && seenSlugs.has(post.slug)) {
      errors.push(`${label}: duplicate slug "${post.slug}"`)
    }

    if (post.slug) {
      seenSlugs.add(post.slug)
    }

    if (!post.title) {
      errors.push(`${label}: missing title`)
    }

    if (!post.date) {
      errors.push(`${label}: missing date`)
    }

    if (!post.summary && !post.subtitle) {
      errors.push(`${label}: missing summary or subtitle`)
    }

    if (!post.status || !allowedStatus.has(post.status)) {
      errors.push(`${label}: invalid status. Use "draft" or "published"`)
    }

    if (post.status === 'published' && !post.body?.trim()) {
      errors.push(`${label}: published post has empty body`)
    }

    if (!post.category) {
      errors.push(`${label}: missing category`)
    }

    if (!Array.isArray(post.tags)) {
      errors.push(`${label}: tags must be an array`)
    }
  }

  if (errors.length > 0) {
    console.error('\nBlog content validation failed:\n')

    for (const error of errors) {
      console.error(`- ${error}`)
    }

    console.error('\nFix these issues before publishing.\n')
    process.exitCode = 1
  } else {
    console.log(`Blog content validation passed. Checked ${posts.length} post(s).`)
  }
} finally {
  await server.close()
}
