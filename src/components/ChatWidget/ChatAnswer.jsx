import { useCallback, useEffect, useRef, useState } from 'react'
import ReactMarkdown from 'react-markdown'
import remarkGfm from 'remark-gfm'
import rehypeSanitize from 'rehype-sanitize'
import { FaPlay, FaSpinner, FaStop } from 'react-icons/fa'
import './ChatWidget.css'

const BACKEND = 'https://msrathaur-manish-portfolio-api.hf.space'

function ChatAnswer({ text, sources = [], related = [] }) {
  const audioRef = useRef(null)
  const [audioState, setAudioState] = useState('idle')

  const stopAudio = useCallback(() => {
    if (audioRef.current) {
      audioRef.current.pause()
      audioRef.current.currentTime = 0
      audioRef.current = null
    }
    setAudioState('idle')
  }, [])

  useEffect(() => {
    const stopOtherAnswer = () => stopAudio()
    window.addEventListener('portfolio:stop-answer-audio', stopOtherAnswer)
    return () => {
      window.removeEventListener('portfolio:stop-answer-audio', stopOtherAnswer)
      stopAudio()
    }
  }, [stopAudio])

  const toggleAudio = async () => {
    if (audioState === 'loading' || audioState === 'playing') {
      stopAudio()
      return
    }

    window.dispatchEvent(new CustomEvent('portfolio:stop-answer-audio'))
    const audio = new Audio(`${BACKEND}/speak?text=${encodeURIComponent(text)}`)
    audioRef.current = audio
    setAudioState('loading')

    audio.addEventListener('playing', () => setAudioState('playing'), { once: true })
    audio.addEventListener('ended', stopAudio, { once: true })
    audio.addEventListener('error', stopAudio, { once: true })

    try {
      await audio.play()
    } catch {
      stopAudio()
    }
  }

  return (
    <div className="cw-answer">
      <ReactMarkdown
        remarkPlugins={[remarkGfm]}
        rehypePlugins={[rehypeSanitize]}
        components={{
          h1: ({ children }) => <h3>{children}</h3>,
          h2: ({ children }) => <h3>{children}</h3>,
          h3: ({ children }) => <h3>{children}</h3>,
          p: ({ children }) => <p>{children}</p>,
          ul: ({ children }) => <ul>{children}</ul>,
          ol: ({ children }) => <ol>{children}</ol>,
          li: ({ children }) => <li>{children}</li>,
          code: ({ className, children }) => {
            const isBlockCode = Boolean(className)

            if (!isBlockCode) {
              return <code className="cw-answer__inline-code">{children}</code>
            }

            return (
              <pre className="cw-answer__code">
                <code>{children}</code>
              </pre>
            )
          },
          a: ({ href, children }) => (
            <a href={href} target="_blank" rel="noopener noreferrer">
              {children}
            </a>
          ),
        }}
      >
        {text}
      </ReactMarkdown>
      <button
        type="button"
        className="cw-answer__listen"
        onClick={toggleAudio}
        aria-label={audioState === 'playing' ? 'Stop reading answer' : 'Read answer aloud'}
      >
        {audioState === 'loading' && <FaSpinner aria-hidden="true" className="cw-answer__listen-spinner" />}
        {audioState === 'playing' && <FaStop aria-hidden="true" />}
        {audioState === 'idle' && <FaPlay aria-hidden="true" />}
        <span>{audioState === 'loading' ? 'Loading' : audioState === 'playing' ? 'Stop' : 'Listen'}</span>
      </button>
      {sources && sources.length > 0 && (
        <div className="cw-sources">
          <div className="cw-sources-title">Sources</div>
          <div className="cw-sources-list">
            {sources.map((source, index) => (
              <a 
                key={index} 
                href={source.url} 
                className="cw-source-pill" 
                target="_blank" 
                rel="noopener noreferrer"
              >
                {source.title}
              </a>
            ))}
          </div>
        </div>
      )}
      
      {related && related.length > 0 && (
        <div className="cw-related">
          <div className="cw-related-title">Related</div>
          <div className="cw-related-list">
            {related.map((link, index) => (
              <a 
                key={`related-${index}`} 
                href={link.url} 
                className="cw-related-pill" 
                target="_blank" 
                rel="noopener noreferrer"
              >
                {link.title}
              </a>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}

export default ChatAnswer
