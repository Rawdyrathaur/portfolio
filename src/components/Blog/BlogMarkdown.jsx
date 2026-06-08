import ReactMarkdown from 'react-markdown'
import remarkGfm from 'remark-gfm'
import rehypeSlug from 'rehype-slug'
import rehypeAutolinkHeadings from 'rehype-autolink-headings'
import BlogCodeBlock from './BlogCodeBlock'
import BlogVideo from './BlogVideo'
import BlogImage from './BlogImage'
import { stripTableOfContentsSection } from './blogMarkdownUtils'
import './Blog.css'

const markdownComponents = {
  a({ href = '', children, ...props }) {
    const isExternalLink = href.startsWith('http')
    const isVideoLink = /\.(mp4|webm|mov)(\?.*)?$/i.test(href)

    if (isVideoLink) {
      return (
        <BlogVideo
          src={href}
          title={String(children)}
        />
      )
    }

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

  img({ alt = '', src = '', title = '', ...props }) {
    return (
      <BlogImage
        src={src}
        alt={alt}
        title={title}
        {...props}
      />
    )
  },

  table({ children, ...props }) {
    return (
      <div className="blog-markdown__table-wrapper">
        <table {...props}>{children}</table>
      </div>
    )
  },

  pre({ children }) {
    return children
  },

  code({ className = '', children, ...props }) {
    const languageMatch = /language-(\w+)/.exec(className)
    const code = String(children).replace(/\n$/, '')

    if (!languageMatch) {
      return (
        <code className={className} {...props}>
          {children}
        </code>
      )
    }

    return (
      <BlogCodeBlock
        language={languageMatch[1]}
        code={code}
      />
    )
  },
}

function renderVideoShortcodes(markdown = '') {
  return markdown.replace(
    /^::video\{src="([^"]+)"(?:\s+title="([^"]*)")?\}\s*$/gm,
    (_, src, title = 'Video preview') => {
      const label = title || 'Video preview'
      return `[${label}](${src})`
    },
  )
}

function BlogMarkdown({ content = '' }) {
  const sanitizedContent = renderVideoShortcodes(stripTableOfContentsSection(content))

  if (!sanitizedContent.trim()) {
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
        ]}
        components={markdownComponents}
      >
        {sanitizedContent}
      </ReactMarkdown>
    </div>
  )
}

export default BlogMarkdown
