import uiPreviewArticle from './articles/ui-preview-article.md?raw'

export const blogPosts = [
  {
    slug: 'ui-preview-article',
    title: 'UI Preview Article',
    subtitle: 'Temporary article for testing the blog reading experience.',
    date: '2026-06-04',
    updatedAt: '2026-06-04',
    category: 'UI Preview',
    tags: ['Markdown', 'Design', 'Preview'],
    featured: true,
    status: 'published',
    summary:
      'A temporary dummy article used only to test typography, spacing, markdown rendering, tables, quotes, and code blocks.',
    body: uiPreviewArticle,
  },
]

function calculateReadingTime(markdown = '') {
  const wordsPerMinute = 200
  const words = markdown.trim().split(/\s+/).filter(Boolean).length
  const minutes = Math.max(1, Math.ceil(words / wordsPerMinute))

  return `${minutes} min read`
}

function withComputedFields(post) {
  const body = post.body || ''

  return {
    status: 'draft',
    tags: [],
    featured: false,
    body,
    ...post,
    readTime: post.readTime || calculateReadingTime(body),
  }
}

export function getPublishedBlogPosts() {
  return blogPosts
    .map(withComputedFields)
    .filter((post) => post.status === 'published')
}

export function getSortedBlogPosts() {
  return [...getPublishedBlogPosts()].sort(
    (a, b) => new Date(b.date) - new Date(a.date),
  )
}

export function getBlogPostBySlug(slug) {
  return getPublishedBlogPosts().find((post) => post.slug === slug)
}
