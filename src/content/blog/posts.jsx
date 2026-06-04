export const blogPosts = []

export function getPublishedBlogPosts() {
  return blogPosts.filter((post) => post.status === 'published')
}

export function getSortedBlogPosts() {
  return [...getPublishedBlogPosts()].sort(
    (a, b) => new Date(b.date) - new Date(a.date),
  )
}

export function getBlogPostBySlug(slug) {
  return getPublishedBlogPosts().find((post) => post.slug === slug)
}
