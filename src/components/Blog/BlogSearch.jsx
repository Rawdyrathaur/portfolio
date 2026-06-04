import './Blog.css'

function BlogSearch({
  searchQuery,
  onSearchChange,
  selectedTag,
  onTagChange,
  tags = [],
  resultCount = 0,
}) {
  return (
    <section className="blog-search" aria-label="Search and filter articles">
      <div className="blog-search__top">
        <label className="blog-search__label" htmlFor="blog-search-input">
          Search articles
        </label>

        <span className="blog-search__count">
          {resultCount} {resultCount === 1 ? 'article' : 'articles'}
        </span>
      </div>

      <input
        id="blog-search-input"
        className="blog-search__input"
        type="search"
        value={searchQuery}
        onChange={(event) => onSearchChange(event.target.value)}
        placeholder="Search by title, topic, tag, or summary..."
      />

      {tags.length > 0 && (
        <div className="blog-search__tags" aria-label="Filter by tag">
          <button
            className={`blog-search__tag ${selectedTag === 'all' ? 'blog-search__tag--active' : ''}`}
            type="button"
            onClick={() => onTagChange('all')}
          >
            All
          </button>

          {tags.map((tag) => (
            <button
              key={tag}
              className={`blog-search__tag ${selectedTag === tag ? 'blog-search__tag--active' : ''}`}
              type="button"
              onClick={() => onTagChange(tag)}
            >
              {tag}
            </button>
          ))}
        </div>
      )}
    </section>
  )
}

export default BlogSearch
