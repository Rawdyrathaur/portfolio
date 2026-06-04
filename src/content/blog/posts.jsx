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
    status: 'draft',
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


export function getAdjacentBlogPosts(slug) {
  const posts = getSortedBlogPosts()
  const currentIndex = posts.findIndex((post) => post.slug === slug)

  if (currentIndex === -1) {
    return {
      previousPost: null,
      nextPost: null,
    }
  }

  return {
    previousPost: posts[currentIndex + 1] || null,
    nextPost: posts[currentIndex - 1] || null,
  }
}

export function getRelatedBlogPosts(currentPost, limit = 3) {
  if (!currentPost) return []

  const currentTags = new Set(currentPost.tags || [])

  return getSortedBlogPosts()
    .filter((post) => post.slug !== currentPost.slug)
    .map((post) => {
      const tagScore = (post.tags || []).filter((tag) => currentTags.has(tag)).length
      const categoryScore = post.category === currentPost.category ? 2 : 0

      return {
        post,
        score: tagScore + categoryScore,
      }
    })
    .filter((item) => item.score > 0)
    .sort((a, b) => b.score - a.score)
    .slice(0, limit)
    .map((item) => item.post)
}
