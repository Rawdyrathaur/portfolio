import './Blog.css'

function BlogVideo({ src = '', title = 'Video preview' }) {
  if (!src) return null

  return (
    <figure className="blog-video">
      <video
        className="blog-video__player"
        controls
        preload="metadata"
        playsInline
      >
        <source src={src} type="video/mp4" />
        Your browser does not support the video tag.
      </video>

      {title && <figcaption>{title}</figcaption>}
    </figure>
  )
}

export default BlogVideo
