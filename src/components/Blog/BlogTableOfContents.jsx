import GithubSlugger from 'github-slugger'
import './Blog.css'

function extractHeadings(markdown = '') {
  const slugger = new GithubSlugger()

  return markdown
    .split('\n')
    .map((line) => {
      const match = /^(#{2,3})\s+(.+)$/.exec(line.trim())

      if (!match) return null

      const level = match[1].length
      const title = match[2].replace(/[#`*_]/g, '').trim()

      return {
        id: slugger.slug(title),
        title,
        level,
      }
    })
    .filter(Boolean)
}

function BlogTableOfContents({ content }) {
  const headings = extractHeadings(content)

  if (headings.length === 0) {
    return null
  }

  return (
    <aside className="blog-toc" aria-label="Table of contents">
      <p className="blog-toc__label">Contents</p>

      <nav>
        {headings.map((heading) => (
          <a
            key={heading.id}
            className={`blog-toc__link blog-toc__link--h${heading.level}`}
            href={`#${heading.id}`}
          >
            {heading.title}
          </a>
        ))}
      </nav>
    </aside>
  )
}

export default BlogTableOfContents
