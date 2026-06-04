import { getAdjacentBlogPosts, getRelatedBlogPosts } from '../../content/blog/posts'
import './Blog.css'

function BlogPostFooter({ post }) {
  const { previousPost, nextPost } = getAdjacentBlogPosts(post.slug)
  const relatedPosts = getRelatedBlogPosts(post)

  return (
    <footer className="blog-post-footer">
      {(previousPost || nextPost) && (
        <nav className="blog-post-nav" aria-label="Article navigation">
          {previousPost ? (
            <a className="blog-post-nav__card" href={`/blog/${previousPost.slug}`}>
              <span>Previous</span>
              <strong>{previousPost.title}</strong>
            </a>
          ) : (
            <div />
          )}

          {nextPost ? (
            <a className="blog-post-nav__card blog-post-nav__card--next" href={`/blog/${nextPost.slug}`}>
              <span>Next</span>
              <strong>{nextPost.title}</strong>
            </a>
          ) : (
            <div />
          )}
        </nav>
      )}

      {relatedPosts.length > 0 && (
        <section className="blog-related" aria-label="Related articles">
          <p className="blog-section-label">Related Articles</p>

          <div className="blog-related__grid">
            {relatedPosts.map((relatedPost) => (
              <a
                key={relatedPost.slug}
                className="blog-related__card"
                href={`/blog/${relatedPost.slug}`}
              >
                <span>{relatedPost.category || 'Article'}</span>
                <strong>{relatedPost.title}</strong>
                <small>{relatedPost.readingTime || relatedPost.readTime || 'Read article'}</small>
              </a>
            ))}
          </div>
        </section>
      )}

      <a className="blog-post-footer__back" href="/blog">
        View all articles →
      </a>
    </footer>
  )
}

export default BlogPostFooter
