/* ========================
   APP COMPONENT
======================== */

import { lazy, Suspense, useEffect, useState } from 'react'
import './styles/index.css'
import { ReadModeProvider } from './context/ReadModeContext'
import Hero from './components/Hero/Hero'
import Navbar from './components/Navbar/Navbar'
import ThemeToggle from './components/ThemeToggle/ThemeToggle'
import ReadMode from './components/ReadMode/ReadMode'
import Projects from './components/Projects/Projects'
import Experience from './components/Experience/Experience'
import ChatWidget from './components/ChatWidget/ChatWidget'

const Blog = lazy(() => import('./pages/Blog'))
const BlogPost = lazy(() => import('./pages/BlogPost'))

function App() {
  const [currentPath, setCurrentPath] = useState(window.location.pathname)

  useEffect(() => {
    const updatePath = () => {
      setCurrentPath(window.location.pathname)
    }

    const handleInternalNavigation = (event) => {
      if (
        event.defaultPrevented ||
        event.button !== 0 ||
        event.metaKey ||
        event.ctrlKey ||
        event.shiftKey ||
        event.altKey
      ) {
        return
      }

      const link = event.target.closest('a[href]')

      if (!link) return

      const url = new URL(link.href)

      const isExternal = url.origin !== window.location.origin
      const opensNewTab = link.target && link.target !== '_self'
      const isFile = url.pathname.startsWith('/resumes/')

      if (isExternal || opensNewTab || isFile || link.hasAttribute('download')) {
        return
      }

      const nextPath = `${url.pathname}${url.search}${url.hash}`
      const rawHref = link.getAttribute('href') || ''

      const isSamePageHashLink =
        rawHref.startsWith('#') ||
        (
          url.pathname === window.location.pathname &&
          url.search === window.location.search &&
          url.hash
        )

      if (isSamePageHashLink) {
        return
      }

      event.preventDefault()
      window.history.pushState({}, '', nextPath)
      setCurrentPath(url.pathname)
      window.scrollTo({ top: 0, behavior: 'instant' })
    }

    window.addEventListener('popstate', updatePath)
    document.addEventListener('click', handleInternalNavigation)

    return () => {
      window.removeEventListener('popstate', updatePath)
      document.removeEventListener('click', handleInternalNavigation)
    }
  }, [])

  const isBlogPage = currentPath === '/blog'
  const isBlogPostPage = currentPath.startsWith('/blog/')

  return (
    <ReadModeProvider>
      <Navbar />
      <ThemeToggle />

      <Suspense fallback={<div className="page-loading">Loading…</div>}>
        {isBlogPage && <Blog />}

        {isBlogPostPage && <BlogPost />}

        {!isBlogPage && !isBlogPostPage && (
          <main>
            <Hero />
            <ReadMode />
            <Experience />
            <Projects />
          </main>
        )}
      </Suspense>

      <ChatWidget
        key={
          currentPath.startsWith('/blog/')
            ? 'article-assistant'
            : currentPath === '/blog'
              ? 'blog-assistant'
              : 'portfolio-assistant'
        }
        currentPath={currentPath}
      />
    </ReadModeProvider>
  )
}

export default App
