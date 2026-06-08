import { useState } from 'react'
import Lightbox from 'yet-another-react-lightbox'
import Zoom from 'yet-another-react-lightbox/plugins/zoom'
import Fullscreen from 'yet-another-react-lightbox/plugins/fullscreen'
import Download from 'yet-another-react-lightbox/plugins/download'
import 'yet-another-react-lightbox/styles.css'
import './Blog.css'

function BlogImage({ src = '', alt = '', title = '', ...props }) {
  const [open, setOpen] = useState(false)

  if (!src) return null

  const caption = title || alt
  const isGif = /\.gif(\?.*)?$/i.test(src)

  return (
    <>
      <figure className={`blog-markdown__figure blog-markdown__figure--zoomable ${isGif ? "blog-markdown__figure--gif" : ""}`}>
        <button
          className="blog-markdown__image-button"
          type="button"
          onClick={() => setOpen(true)}
          aria-label={alt ? `Open image: ${alt}` : 'Open image preview'}
        >
          <img
            src={src}
            alt={alt}
            loading="lazy"
            decoding="async"
            {...props}
          />

          <span className="blog-markdown__image-zoom-label">
            Click to zoom
          </span>
        </button>

        {caption && <figcaption>{caption}</figcaption>}
      </figure>

      <Lightbox
        open={open}
        close={() => setOpen(false)}
        slides={[
          {
            src,
            alt,
            title: caption,
          },
        ]}
        plugins={[Zoom, Fullscreen, Download]}
        carousel={{ finite: true }}
        zoom={{
          maxZoomPixelRatio: 3,
          scrollToZoom: true,
        }}
      />
    </>
  )
}

export default BlogImage
