import { lazy, Suspense } from 'react'
import './ChatWidget.css'

const ChatAnswer = lazy(() => import('./ChatAnswer'))

function ChatMessage({ role, text }) {
  if (role !== 'assistant') {
    return <span>{text}</span>
  }

  return (
    <Suspense fallback={<span>{text}</span>}>
      <ChatAnswer text={text} />
    </Suspense>
  )
}

export default ChatMessage
