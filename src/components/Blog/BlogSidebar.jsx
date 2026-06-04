import { useState } from 'react'
import './Blog.css'

function BlogSidebar() {
  const [activePanel, setActivePanel] = useState(null)

  const togglePanel = (panel) => {
    setActivePanel((currentPanel) => (currentPanel === panel ? null : panel))
  }

  return (
    <aside className="blog-sidebar blog-sidebar--compact">
      <p className="blog-sidebar__eyebrow">Manish's Blog</p>

      <h2 className="blog-sidebar__title blog-sidebar__title--compact">
        Code · AI · Open Source
      </h2>

      <div className="blog-mini-actions">
        <button
          className="blog-mini-button"
          type="button"
          onClick={() => togglePanel('subscribe')}
          aria-expanded={activePanel === 'subscribe'}
        >
          ✉ Subscribe
        </button>

        <button
          className="blog-mini-button"
          type="button"
          onClick={() => togglePanel('follow')}
          aria-expanded={activePanel === 'follow'}
        >
          ↗ Follow
        </button>
      </div>

      {activePanel === 'subscribe' && (
        <div className="blog-sidebar__panel">
          <h3>Subscribe</h3>
          <p>
            Newsletter is coming soon. For now, follow my updates through my
            portfolio and social links.
          </p>
        </div>
      )}

      {activePanel === 'follow' && (
        <div className="blog-sidebar__panel">
          <h3>Follow</h3>
          <a href="https://github.com/Rawdyrathaur" target="_blank" rel="noreferrer">
            GitHub
          </a>
          <a href="https://www.linkedin.com/" target="_blank" rel="noreferrer">
            LinkedIn
          </a>
          <a href="https://x.com/" target="_blank" rel="noreferrer">
            X / Twitter
          </a>
        </div>
      )}
    </aside>
  )
}

export default BlogSidebar
