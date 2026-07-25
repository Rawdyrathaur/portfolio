import ReactMarkdown from 'react-markdown'
import remarkGfm from 'remark-gfm'
import rehypeSanitize from 'rehype-sanitize'
import './ChatWidget.css'

function ChatAnswer({ text, sources = [], related = [] }) {
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
