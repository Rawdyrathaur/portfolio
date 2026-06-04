import type { BlogPost } from '../types'
import { BlogCard } from './BlogCard'

export type BlogIndexProps = {
  posts: BlogPost[]
  emptyTitle?: string
  emptyDescription?: string
  getPostHref?: (post: BlogPost) => string
}

export function BlogIndex({
  posts,
  emptyTitle = 'No articles published yet.',
  emptyDescription = 'Articles will appear here when they are ready.',
  getPostHref,
}: BlogIndexProps) {
  const publishedPosts = posts.filter((post) => post.status !== 'draft')

  if (publishedPosts.length === 0) {
    return (
      <section className="mrt-blog-empty">
        <h2>{emptyTitle}</h2>
        <p>{emptyDescription}</p>
      </section>
    )
  }

  return (
    <section className="mrt-blog-index">
      {publishedPosts.map((post) => (
        <BlogCard
          key={post.slug}
          post={post}
          href={getPostHref?.(post)}
        />
      ))}
    </section>
  )
}