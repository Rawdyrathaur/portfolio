import './Blog.css'
function BlogArticleLayout({ children, aside = null }) {
  return (
    <main className={`blog-page blog-page--article ${aside ? 'blog-page--with-toc' : ''}`}>
      <article className="blog-article-shell">
        <a className="blog-back" href="/blog">← Back to Blog</a>
        {children}
      </article>
      {aside && (
        <div className="blog-right-rail">
          {aside}
        </div>
      )}
    </main>
  )
}
export default BlogArticleLayout
