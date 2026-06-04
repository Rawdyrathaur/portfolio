import './Blog.css'

function BlogSidebar() {
  return (
    <aside className="blog-sidebar">
      <p className="blog-sidebar__eyebrow">Manish's Blog</p>

      <h2 className="blog-sidebar__title">
        Writing about code, AI, and open source.
      </h2>

      <p className="blog-sidebar__text">
        Practical notes from building projects, fixing bugs, learning AI systems,
        and contributing to real-world codebases.
      </p>

      <div className="blog-sidebar__block">
        <h3>Subscribe</h3>
        <p>Newsletter coming soon. For now, follow my work online.</p>
      </div>

      <div className="blog-sidebar__block">
        <h3>Follow</h3>
        <a href="https://github.com/Rawdyrathaur" target="_blank" rel="noreferrer">GitHub</a>
        <a href="https://www.linkedin.com/" target="_blank" rel="noreferrer">LinkedIn</a>
        <a href="https://x.com/" target="_blank" rel="noreferrer">X / Twitter</a>
      </div>
    </aside>
  )
}

export default BlogSidebar
