import { useEffect, useRef, useState } from 'react'
import {
  autoUpdate,
  computePosition,
  flip,
  inline,
  offset,
  shift,
} from '@floating-ui/dom'
import './Blog.css'

function getSelectedArticleText() {
  const selection = window.getSelection()

  if (!selection || selection.rangeCount === 0) {
    return null
  }

  const text = selection.toString().trim().replace(/\s+/g, ' ')

  if (text.length < 12) {
    return null
  }

  const range = selection.getRangeAt(0)
  const container = range.commonAncestorContainer
  const element =
    container.nodeType === Node.ELEMENT_NODE
      ? container
      : container.parentElement

  if (!element?.closest('.blog-markdown')) {
    return null
  }

  const rect = range.getBoundingClientRect()

  if (!rect.width && !rect.height) {
    return null
  }

  return {
    text: text.slice(0, 1200),
    range,
    rect,
    contextElement: element,
  }
}

function BlogSelectionAsk() {
  const [selectedText, setSelectedText] = useState('')
  const floatingRef = useRef(null)
  const selectionInfoRef = useRef(null)

  useEffect(() => {
    const updateSelection = () => {
      window.setTimeout(() => {
        const selectionInfo = getSelectedArticleText()

        if (!selectionInfo) {
          selectionInfoRef.current = null
          setSelectedText('')
          return
        }

        selectionInfoRef.current = selectionInfo
        setSelectedText(selectionInfo.text)
      }, 0)
    }

    const clearSelection = () => {
      selectionInfoRef.current = null
      setSelectedText('')
    }

    const handleKeyDown = (event) => {
      if (event.key === 'Escape') {
        clearSelection()
        window.getSelection()?.removeAllRanges()
      }
    }

    document.addEventListener('mouseup', updateSelection)
    document.addEventListener('keyup', updateSelection)
    document.addEventListener('keydown', handleKeyDown)
    window.addEventListener('scroll', clearSelection, { passive: true })
    window.addEventListener('resize', clearSelection)

    return () => {
      document.removeEventListener('mouseup', updateSelection)
      document.removeEventListener('keyup', updateSelection)
      document.removeEventListener('keydown', handleKeyDown)
      window.removeEventListener('scroll', clearSelection)
      window.removeEventListener('resize', clearSelection)
    }
  }, [])

  useEffect(() => {
    const floatingElement = floatingRef.current
    const selectionInfo = selectionInfoRef.current

    if (!floatingElement || !selectionInfo) {
      return undefined
    }

    const virtualReference = {
      getBoundingClientRect: () => selectionInfo.range.getBoundingClientRect(),
      getClientRects: () => selectionInfo.range.getClientRects(),
      contextElement: selectionInfo.contextElement,
    }

    const updatePosition = () => {
      computePosition(virtualReference, floatingElement, {
        placement: 'top',
        strategy: 'fixed',
        middleware: [inline(), offset(10), flip(), shift({ padding: 12 })],
      }).then(({ x, y, strategy }) => {
        Object.assign(floatingElement.style, {
          position: strategy,
          left: `${x}px`,
          top: `${y}px`,
        })
      })
    }

    const cleanup = autoUpdate(
      virtualReference,
      floatingElement,
      updatePosition,
    )

    updatePosition()

    return cleanup
  }, [selectedText])

  if (!selectedText) {
    return null
  }

  const handleAskAI = () => {
    window.dispatchEvent(
      new CustomEvent('portfolio:chat-ask', {
        detail: {
          prompt: `Explain this selected part from the current article in simple, practical terms:\n\n"${selectedText}"`,
        },
      }),
    )

    window.getSelection()?.removeAllRanges()
    selectionInfoRef.current = null
    setSelectedText('')
  }

  return (
    <button
      ref={floatingRef}
      className="blog-selection-ask"
      type="button"
      onClick={handleAskAI}
      aria-label="Ask AI about selected text"
    >
      Ask AI
    </button>
  )
}

export default BlogSelectionAsk
