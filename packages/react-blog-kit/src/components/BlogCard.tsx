import type { BlogPost } from '../types'

export type BlogCardProps = {
  post: BlogPost
  href?: string
}

export function BlogCard({ post, href }: BlogCardProps) {
  const targetHref = href || `/blog/${post.slug}`

  return (
    <a className="mrt-blog-card" href={targetHref}>
      <div className="mrt-blog-card__meta">
        <span>{post.category || 'Article'}</span>
        {post.readingTime && <span>{post.readingTime}</span>}
      </div>

      <h2>{post.title}</h2>

      {(post.summary || post.subtitle) && (
        <p>{post.summary || post.subtitle}</p>
      )}

      <span className="mrt-blog-card__read">Read article →</span>
    </a>
  )
}