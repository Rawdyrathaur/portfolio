function BlogCard({ post }) {
  return (
    <a className={`blog-card ${post.featured ? 'blog-card--featured' : ''}`} href={`/blog/${post.slug}`}>
      <div className="blog-card__top">
        <span className="blog-card__category">{post.category}</span>
        <span className="blog-card__readtime">{post.readTime}</span>
      </div>

      <h2>{post.title}</h2>

      <p>{post.summary}</p>

      <div className="blog-card__footer">
        <time dateTime={post.date}>
          {new Date(post.date).toLocaleDateString('en', {
            year: 'numeric',
            month: 'long',
            day: 'numeric',
          })}
        </time>

        <span className="blog-card__read">Read article →</span>
      </div>
    </a>
  )
}

export default BlogCard
