import { TagIcon } from './BlogTagIcon'
function formatDate(date) {
  if (!date) return null

  return new Date(date).toLocaleDateString('en', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  })
}

function BlogPostHeader({ post }) {
  const publishedDate = formatDate(post.date)
  const updatedDate = post.updatedAt && post.updatedAt !== post.date
    ? formatDate(post.updatedAt)
    : null

  return (
    <header className="blog-post-header">
      <div className="blog-post-header__meta">
        {post.category && <span>{post.category}</span>}
        {post.readTime && <span>{post.readTime}</span>}
        {publishedDate && <time dateTime={post.date}>{publishedDate}</time>}
      </div>

      <h1>{post.title}</h1>

      {(post.subtitle || post.summary) && (
        <p className="blog-post-header__subtitle">
          {post.subtitle || post.summary}
        </p>
      )}

      {post.tags?.length > 0 && (
        <div className="blog-post-header__tags" aria-label="Article tags">
          {post.tags.map((tag) => (
            <span key={tag} style={{ display: "inline-flex", alignItems: "center" }}><TagIcon tag={tag} />{tag}</span>
          ))}
        </div>
      )}

      {updatedDate && (
        <p className="blog-post-header__updated">
          Updated on {updatedDate}
        </p>
      )}
    </header>
  )
}

export default BlogPostHeader
