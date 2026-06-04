import ReactMarkdown from 'react-markdown'
import remarkGfm from 'remark-gfm'
import rehypeSlug from 'rehype-slug'
import rehypeAutolinkHeadings from 'rehype-autolink-headings'
import rehypeHighlight from 'rehype-highlight'
import './Blog.css'

const markdownComponents = {
  a({ href = '', children, ...props }) {
    const isExternalLink = href.startsWith('http')

    return (
      <a
        href={href}
        target={isExternalLink ? '_blank' : undefined}
        rel={isExternalLink ? 'noreferrer' : undefined}
        {...props}
      >
        {children}
      </a>
    )
  },

  img({ alt = '', ...props }) {
    return (
      <figure className="blog-markdown__figure">
        <img loading="lazy" alt={alt} {...props} />
        {alt && <figcaption>{alt}</figcaption>}
      </figure>
    )
  },

  table({ children, ...props }) {
    return (
      <div className="blog-markdown__table-wrapper">
        <table {...props}>{children}</table>
      </div>
    )
  },

  pre({ children, ...props }) {
    return (
      <pre className="blog-markdown__pre" {...props}>
        {children}
      </pre>
    )
  },
}

function BlogMarkdown({ content = '' }) {
  if (!content.trim()) {
    return (
      <div className="blog-empty-state">
        <h2>No article content yet.</h2>
        <p>
          This article shell is ready. Add verified markdown content when the post
          is ready to publish.
        </p>
      </div>
    )
  }

  return (
    <div className="blog-markdown">
      <ReactMarkdown
        remarkPlugins={[remarkGfm]}
        rehypePlugins={[
          rehypeSlug,
          [rehypeAutolinkHeadings, { behavior: 'wrap' }],
          rehypeHighlight,
        ]}
        components={markdownComponents}
      >
        {content}
      </ReactMarkdown>
    </div>
  )
}

export default BlogMarkdown
