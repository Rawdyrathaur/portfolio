import BlogArticleLayout from '../components/Blog/BlogArticleLayout'
import BlogMarkdown from '../components/Blog/BlogMarkdown'
import BlogPostFooter from '../components/Blog/BlogPostFooter'
import BlogPostHeader from '../components/Blog/BlogPostHeader'
import BlogTableOfContents from '../components/Blog/BlogTableOfContents'
import BlogReadingProgress from '../components/Blog/BlogReadingProgress'
import BlogShareActions from '../components/Blog/BlogShareActions'
import BlogSelectionAsk from '../components/Blog/BlogSelectionAsk'
import SEO from '../components/SEO/SEO'
import { getBlogPostBySlug } from '../content/blog/posts'
import { siteMetadata } from '../content/site/metadata'
import '../components/Blog/Blog.css'

function BlogPost() {
  const slug = window.location.pathname.replace('/blog/', '')
  const post = getBlogPostBySlug(slug)

  if (!post) {
    return (
      <BlogArticleLayout>
        <div className="blog-empty-state">
          <h1>Post not found</h1>
          <p>This article is not published yet, or the URL is incorrect.</p>
        </div>
      </BlogArticleLayout>
    )
  }

  const pageUrl = `${siteMetadata.baseUrl}/blog/${post.slug}`
  const imageUrl = post.image?.startsWith('http')
    ? post.image
    : `${siteMetadata.baseUrl}${post.image || siteMetadata.defaultImage}`

  const videoStructuredData = (post.videos || []).map((video) => ({
    '@type': 'VideoObject',
    name: video.title,
    description: video.description,
    thumbnailUrl: [video.thumbnail || imageUrl],
    uploadDate: video.uploadDate || post.date,
    contentUrl: video.url,
    embedUrl: video.url,
  }))


  const articleStructuredData = {
    '@context': 'https://schema.org',
    '@graph': [
      {
        '@type': 'BlogPosting',
        mainEntityOfPage: {
          '@type': 'WebPage',
          '@id': pageUrl,
        },
        headline: post.title,
        description: post.summary || post.subtitle,
        image: [imageUrl],
        author: {
          '@type': 'Person',
          name: siteMetadata.author,
          url: siteMetadata.baseUrl,
        },
        publisher: {
          '@type': 'Person',
          name: siteMetadata.author,
          url: siteMetadata.baseUrl,
        },
        datePublished: post.date,
        dateModified: post.updatedAt || post.date,
        articleSection: post.category,
        keywords: (post.tags || []).join(', '),
        url: pageUrl,
      },
      ...videoStructuredData,
    ],
  }

  return (
    <>
      <BlogReadingProgress />

      <BlogArticleLayout
        aside={
          <aside className="blog-right-rail" aria-label="Article tools">
            <BlogTableOfContents content={post.body} />
            <BlogShareActions post={post} />
          </aside>
        }
      >
        <SEO
          title={post.title}
          description={post.summary || post.subtitle}
          path={`/blog/${post.slug}`}
          image={post.image}
          type="article"
          publishedTime={post.date}
          modifiedTime={post.updatedAt}
          tags={post.tags}
          structuredData={articleStructuredData}
        />

        <BlogPostHeader post={post} />
        <BlogMarkdown content={post.body} />
        <BlogSelectionAsk />
        <BlogPostFooter post={post} />
      </BlogArticleLayout>
    </>
  )
}

export default BlogPost
