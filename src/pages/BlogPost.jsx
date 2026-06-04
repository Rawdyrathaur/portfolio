import BlogSidebar from '../components/Blog/BlogSidebar'
import { getBlogPostBySlug } from '../content/blogPosts'
import '../components/Blog/Blog.css'

function BlogPost() {
  const slug = window.location.pathname.replace('/blog/', '')
  const post = getBlogPostBySlug(slug)

  if (!post) {
    return (
      <main className="blog-page">
        <BlogSidebar />
        <article className="blog-article">
          <a className="blog-back" href="/blog">← Back to Blog</a>
          <h1>Post not found</h1>
          <p>The article you are looking for does not exist yet.</p>
        </article>
      </main>
    )
  }

  return (
    <main className="blog-page">
      <BlogSidebar />

      <article className="blog-article">
        <a className="blog-back" href="/blog">← Back to Blog</a>

        <header className="blog-article__header">
          <p className="blog-article__meta">
            {post.category} · {post.readTime} ·{' '}
            {new Date(post.date).toLocaleDateString('en', {
              year: 'numeric',
              month: 'long',
              day: 'numeric',
            })}
          </p>

          <h1>{post.title}</h1>
          <p>{post.summary}</p>
        </header>

        <div className="blog-article__content">
          {post.content.map((section) => (
            <section key={section.heading}>
              <h2>{section.heading}</h2>
              <p>{section.body}</p>
            </section>
          ))}
        </div>
      </article>
    </main>
  )
}

export default BlogPost
