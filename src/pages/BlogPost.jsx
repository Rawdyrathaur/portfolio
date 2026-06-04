import BlogArticleLayout from '../components/Blog/BlogArticleLayout'
import BlogMarkdown from '../components/Blog/BlogMarkdown'
import BlogPostFooter from '../components/Blog/BlogPostFooter'
import BlogPostHeader from '../components/Blog/BlogPostHeader'
import { getBlogPostBySlug } from '../content/blog/posts'
import '../components/Blog/Blog.css'

function BlogPost() {
  const slug = window.location.pathname.replace('/blog/', '')
  const post = getBlogPostBySlug(slug)

  if (!post) {
    return (
      <BlogArticleLayout>
        <div className="blog-empty-state">
          <h1>Post not found</h1>
          <p>
            This article is not published yet, or the URL is incorrect.
          </p>
        </div>
      </BlogArticleLayout>
    )
  }

  return (
    <BlogArticleLayout>
      <BlogPostHeader post={post} />
      <BlogMarkdown content={post.body} />
      <BlogPostFooter post={post} />
    </BlogArticleLayout>
  )
}

export default BlogPost
