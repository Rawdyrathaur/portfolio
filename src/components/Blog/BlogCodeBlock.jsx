import { useEffect, useRef, useState } from 'react'
import Prism from 'prismjs'
import 'prismjs/components/prism-markup'
import 'prismjs/components/prism-css'
import 'prismjs/components/prism-clike'
import 'prismjs/components/prism-csharp'
import 'prismjs/components/prism-javascript'
import 'prismjs/components/prism-jsx'
import 'prismjs/components/prism-typescript'
import 'prismjs/components/prism-tsx'
import 'prismjs/components/prism-python'
import 'prismjs/components/prism-bash'
import 'prismjs/components/prism-json'
import './Blog.css'

const LANGUAGE_ALIASES = {
  js: 'javascript',
  jsx: 'jsx',
  ts: 'typescript',
  tsx: 'tsx',
  py: 'python',
  python: 'python',
  bash: 'bash',
  sh: 'bash',
  shell: 'bash',
  css: 'css',
  json: 'json',
  cs: 'csharp',
  csharp: 'csharp',
  'c#': 'csharp',
}

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
  const codeRef = useRef(null)
  const cleanCode = code.replace(/\n$/, '')
  const normalizedLanguage = LANGUAGE_ALIASES[language] || language || 'text'

  useEffect(() => {
    if (codeRef.current && Prism.languages[normalizedLanguage]) {
      Prism.highlightElement(codeRef.current)
    }
  }, [cleanCode, normalizedLanguage])

  const handleCopy = async () => {
    try {
      await copyTextToClipboard(cleanCode)
      setCopied(true)
      window.setTimeout(() => setCopied(false), 1600)
    } catch {
      setCopied(false)
    }
  }

  return (
    <figure className="blog-code-block">
      <figcaption className="blog-code-block__header">
        <span className="blog-code-block__language">{language || 'text'}</span>

        <button
          className="blog-code-block__copy"
          type="button"
          onClick={handleCopy}
          aria-label="Copy code"
        >
          {copied ? 'Copied' : 'Copy'}
        </button>
      </figcaption>

      <pre className="blog-code-block__fallback">
        <code
          ref={codeRef}
          className={`language-${normalizedLanguage}`}
        >
          {cleanCode}
        </code>
      </pre>
    </figure>
  )
}

export default BlogCodeBlock
