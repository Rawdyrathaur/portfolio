import { useState } from 'react'
import './Blog.css'

function copyToClipboard(text) {
  if (navigator.clipboard && window.isSecureContext) {
    return navigator.clipboard.writeText(text)
  }

  const textarea = document.createElement('textarea')
  textarea.value = text
  textarea.setAttribute('readonly', '')
  textarea.style.position = 'fixed'
  textarea.style.left = '-9999px'

  document.body.appendChild(textarea)
  textarea.select()
  document.execCommand('copy')
  document.body.removeChild(textarea)

  return Promise.resolve()
}

function CopyIcon() {
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true">
      <rect x="9" y="9" width="11" height="11" rx="2" />
      <path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1" />
    </svg>
  )
}

function CheckIcon() {
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true">
      <path d="M20 6 9 17l-5-5" />
    </svg>
  )
}

function ShareIcon() {
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true">
      <circle cx="18" cy="5" r="3" />
      <circle cx="6" cy="12" r="3" />
      <circle cx="18" cy="19" r="3" />
      <path d="M8.6 10.7 15.4 6.3" />
      <path d="M8.6 13.3 15.4 17.7" />
    </svg>
  )
}

function ArrowUpIcon() {
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true">
      <path d="M12 19V5" />
      <path d="m5 12 7-7 7 7" />
    </svg>
  )
}

function BlogShareActions({ post }) {
  const [copied, setCopied] = useState(false)

  const handleCopyLink = async () => {
    await copyToClipboard(window.location.href)
    setCopied(true)
    window.setTimeout(() => setCopied(false), 1600)
  }

  const handleShare = async () => {
    if (!navigator.share) {
      handleCopyLink()
      return
    }

    try {
      await navigator.share({
        title: post.title,
        text: post.summary || post.subtitle || post.title,
        url: window.location.href,
      })
    } catch {
      // User cancelled native share.
    }
  }

  return (
    <div className="blog-side-actions" aria-label="Article actions">
      <button
        type="button"
        onClick={handleCopyLink}
        aria-label={copied ? 'Link copied' : 'Copy article link'}
        title={copied ? 'Copied' : 'Copy link'}
      >
        {copied ? <CheckIcon /> : <CopyIcon />}
        <span className="blog-side-actions__sr">
          {copied ? 'Copied' : 'Copy link'}
        </span>
      </button>

      <button
        type="button"
        onClick={handleShare}
        aria-label="Share article"
        title="Share article"
      >
        <ShareIcon />
        <span className="blog-side-actions__sr">Share article</span>
      </button>

      <button
        type="button"
        onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
        aria-label="Back to top"
        title="Back to top"
      >
        <ArrowUpIcon />
        <span className="blog-side-actions__sr">Back to top</span>
      </button>
    </div>
  )
}

export default BlogShareActions
