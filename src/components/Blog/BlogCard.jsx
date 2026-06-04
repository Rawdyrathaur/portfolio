function BlogCard({ post }) {
  return (
    <a className="blog-card" href={`/blog/${post.slug}`}>
      <div className="blog-card__meta">
        <span>{post.category}</span>
        <span>{post.readTime}</span>
      </div>

      <h2>{post.title}</h2>
      <p>{post.summary}</p>

      <span className="blog-card__date">
        {new Date(post.date).toLocaleDateString('en', {
          year: 'numeric',
          month: 'long',
          day: 'numeric',
        })}
      </span>
    </a>
  )
}

export default BlogCard
