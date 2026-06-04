function BlogPostFooter({ post }) {
  return (
    <footer className="blog-post-footer">
      {post.tags?.length > 0 && (
        <div className="blog-post-footer__tags">
          {post.tags.map((tag) => (
            <span key={tag}>#{tag}</span>
          ))}
        </div>
      )}

      <a href="/blog">View all articles →</a>
    </footer>
  )
}

export default BlogPostFooter
