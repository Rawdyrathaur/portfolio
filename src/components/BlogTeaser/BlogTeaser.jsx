import './BlogTeaser.css'

export default function BlogTeaser() {
  return (
    <section className="blog-teaser">
      <div className="blog-teaser__inner">
        <div className="blog-teaser__label-row">
          <svg
            className="blog-teaser__icon"
            width="18"
            height="18"
            viewBox="0 0 24 24"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
            aria-hidden="true"
          >
            <path
              d="M12 20h9"
              stroke="currentColor"
              strokeWidth="1.5"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
            <path
              d="M16.5 3.5a2.121 2.121 0 0 1 3 3L7 19l-4 1 1-4L16.5 3.5z"
              stroke="currentColor"
              strokeWidth="1.5"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>

          <p className="blog-teaser__label">WRITING</p>
        </div>

        <div className="blog-teaser__text-group">
          <p className="blog-teaser__text">
            Occasionally I write about engineering, open source, and things I've built.
          </p>
          <a href="/blog" className="blog-teaser__link">
            Read the blog →
          </a>
        </div>
      </div>
    </section>
  )
}