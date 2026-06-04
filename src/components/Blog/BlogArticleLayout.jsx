import BlogSidebar from './BlogSidebar'
import './Blog.css'

function BlogArticleLayout({ children }) {
  return (
    <main className="blog-page blog-page--article">
      <BlogSidebar />

      <article className="blog-article-shell">
        <a className="blog-back" href="/blog">← Back to Blog</a>
        {children}
      </article>
    </main>
  )
}

export default BlogArticleLayout
