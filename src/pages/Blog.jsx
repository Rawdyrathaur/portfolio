import BlogSidebar from '../components/Blog/BlogSidebar'
import BlogCard from '../components/Blog/BlogCard'
import { getSortedBlogPosts } from '../content/blog/posts'
import '../components/Blog/Blog.css'

function Blog() {
  const posts = getSortedBlogPosts()
  const featuredPost = posts.find((post) => post.featured)
  const regularPosts = posts.filter((post) => !post.featured)

  return (
    <main className="blog-page">
      <BlogSidebar />

      <section className="blog-main">
        <a className="blog-back" href="/">← Back to Portfolio</a>

        <div className="blog-hero">
          <p className="blog-hero__eyebrow">Latest Writing</p>
          <h1>Notes from my developer journey.</h1>
          <p>
            Technical articles, project breakdowns, open-source lessons,
            and AI engineering notes.
          </p>
        </div>

        {featuredPost && (
          <section className="blog-featured">
            <p className="blog-section-label">Featured</p>
            <BlogCard post={featuredPost} />
          </section>
        )}

        <section className="blog-list">
          <p className="blog-section-label">Recent Posts</p>
          {regularPosts.map((post) => (
            <BlogCard key={post.slug} post={post} />
          ))}
        </section>
      </section>
    </main>
  )
}

export default Blog
