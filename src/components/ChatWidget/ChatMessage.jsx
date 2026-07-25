import { lazy, Suspense } from 'react'
import './ChatWidget.css'

const ChatAnswer = lazy(() => import('./ChatAnswer'))

function ChatMessage({ role, text, sources, related }) {
  if (role !== 'assistant') {
    return <span>{text}</span>
  }

  return (
    <Suspense fallback={<span>{text}</span>}>
      <ChatAnswer text={text} sources={sources} related={related} />
    </Suspense>
  )
}

export default ChatMessage
