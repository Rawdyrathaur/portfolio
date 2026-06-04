import { useState } from 'react'
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter'
import { vscDarkPlus } from 'react-syntax-highlighter/dist/esm/styles/prism'
import './Blog.css'

function copyTextToClipboard(text) {
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

function BlogCodeBlock({ language = 'text', code = '' }) {
  const [copied, setCopied] = useState(false)
  const normalizedLanguage = language || 'text'
  const cleanCode = code.replace(/\n$/, '')

  const handleCopy = async () => {
    try {
      await copyTextToClipboard(cleanCode)
      setCopied(true)

      window.setTimeout(() => {
        setCopied(false)
      }, 1600)
    } catch {
      setCopied(false)
    }
  }

  return (
    <figure className="blog-code-block">
      <figcaption className="blog-code-block__header">
        <span className="blog-code-block__language">{normalizedLanguage}</span>

        <button
          className="blog-code-block__copy"
          type="button"
          onClick={handleCopy}
          aria-label="Copy code"
        >
          {copied ? 'Copied' : 'Copy'}
        </button>
      </figcaption>

      <SyntaxHighlighter
        language={normalizedLanguage}
        style={vscDarkPlus}
        wrapLongLines={false}
        PreTag="div"
        customStyle={{
          margin: 0,
          padding: '1.1rem 0',
          background: '#1e1e1e',
          fontSize: '0.95rem',
          lineHeight: '1.7',
          borderRadius: '0 0 16px 16px',
        }}
        codeTagProps={{
          style: {
            fontFamily:
              '"Cascadia Code", "Fira Code", "Inconsolata", Consolas, monospace',
          },
        }}
      >
        {cleanCode}
      </SyntaxHighlighter>
    </figure>
  )
}

export default BlogCodeBlock
