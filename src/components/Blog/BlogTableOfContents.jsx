import { useEffect, useMemo, useState } from 'react'
import { stripTableOfContentsSection } from './blogMarkdownUtils'
import './Blog.css'

function extractHeadings(markdown) {
  if (!markdown) return []
  return markdown
    .split('\n')
    .map((line) => {
      const match = /^(#{2,3})\s+(.+)$/.exec(line.trim())
      if (!match) return null
      const level = match[1].length
      const title = match[2].replace(/[#`*_]/g, '').trim()
      return { title, level }
    })
    .filter(Boolean)
}

function findHeadingElement(title) {
  const all = document.querySelectorAll('h2, h3')
  for (const el of all) {
    if (el.textContent.trim() === title) return el
  }
  return null
}

function BlogTableOfContentsInner({ headings }) {
  const [activeIndex, setActiveIndex] = useState(0)

  useEffect(() => {
    const elements = headings.map((h) => findHeadingElement(h.title)).filter(Boolean)
    if (elements.length === 0) return
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            const idx = elements.indexOf(entry.target)
            if (idx !== -1) setActiveIndex(idx)
          }
        })
      },
      { rootMargin: '-80px 0px -60% 0px', threshold: 0 }
    )
    elements.forEach((el) => observer.observe(el))
    return () => observer.disconnect()
  }, [headings])

  function handleClick(e, heading, i) {
    e.preventDefault()
    const el = findHeadingElement(heading.title)
    if (el) {
      el.scrollIntoView({ behavior: 'smooth', block: 'start' })
      setActiveIndex(i)
    }
  }

  return (
    <aside className="blog-toc" aria-label="Table of contents">
      <p className="blog-toc__label">Contents</p>
      <nav>
        {headings.map((heading, i) => (
          <a
            key={i}
            className={
              'blog-toc__link blog-toc__link--h' +
              heading.level +
              (activeIndex === i ? ' blog-toc__link--active' : '')
            }
            href="#"
            onClick={(e) => handleClick(e, heading, i)}
          >
            {heading.title}
          </a>
        ))}
      </nav>
    </aside>
  )
}

function BlogTableOfContents({ content }) {
  const headings = useMemo(
    () => extractHeadings(stripTableOfContentsSection(content)),
    [content]
  )
  if (headings.length === 0) return null
  return <BlogTableOfContentsInner key={headings.length} headings={headings} />
}

export default BlogTableOfContents
