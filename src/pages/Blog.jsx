import { useMemo, useState } from 'react'
import Fuse from 'fuse.js'
import BlogCard from '../components/Blog/BlogCard'
import BlogSearch from '../components/Blog/BlogSearch'
import SEO from '../components/SEO/SEO'
import { getSortedBlogPosts } from '../content/blog/posts'
import '../components/Blog/Blog.css'

function getAllTags(posts) {
  return Array.from(
    new Set(posts.flatMap((post) => [post.category, ...(post.tags || [])]).filter(Boolean)),
  ).sort()
}

function filterPosts(posts, searchQuery, selectedTag) {
  const tagFilteredPosts =
    selectedTag === 'all'
      ? posts
      : posts.filter((post) =>
          [post.category, ...(post.tags || [])].includes(selectedTag),
        )

  if (!searchQuery.trim()) {
    return tagFilteredPosts
  }

  const fuse = new Fuse(tagFilteredPosts, {
    keys: ['title', 'subtitle', 'summary', 'category', 'tags'],
    threshold: 0.35,
    ignoreLocation: true,
  })

  return fuse.search(searchQuery).map((result) => result.item)
}

function Blog() {
  const posts = getSortedBlogPosts()
  const [searchQuery, setSearchQuery] = useState('')
  const [selectedTag, setSelectedTag] = useState('all')

  const tags = useMemo(() => getAllTags(posts), [posts])

  const visiblePosts = useMemo(
    () => filterPosts(posts, searchQuery, selectedTag),
    [posts, searchQuery, selectedTag],
  )

  const featuredPost = visiblePosts.find((post) => post.featured)
  const regularPosts = visiblePosts.filter((post) => !post.featured)

  return (
    <main className="blog-page blog-page--index">
      <SEO
        title="Blog"
        description="Technical articles, project breakdowns, open-source lessons, and AI engineering notes by Manish Rathaur."
        path="/blog"
      />

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

        <BlogSearch
          searchQuery={searchQuery}
          onSearchChange={setSearchQuery}
          selectedTag={selectedTag}
          onTagChange={setSelectedTag}
          tags={tags}
          resultCount={visiblePosts.length}
        />

        {visiblePosts.length === 0 ? (
          <div className="blog-empty-state">
            <h2>No articles found.</h2>
            <p>
              Try a different search term or reset the selected tag filter.
            </p>
          </div>
        ) : (
          <>
            {featuredPost && (
              <section className="blog-featured">
                <p className="blog-section-label">Featured</p>
                <BlogCard post={featuredPost} />
              </section>
            )}

            <section className="blog-list">
              <p className="blog-section-label">Recent Posts</p>

              {regularPosts.length > 0 ? (
                regularPosts.map((post) => (
                  <BlogCard key={post.slug} post={post} />
                ))
              ) : (
                <div className="blog-empty-state blog-empty-state--compact">
                  <h2>No more articles yet.</h2>
                  <p>More verified posts will be added here soon.</p>
                </div>
              )}
            </section>
          </>
        )}
      </section>
    </main>
  )
}

export default Blog
