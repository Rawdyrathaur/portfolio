/* ========================
   APP COMPONENT
======================== */

import './styles/index.css'
import { ReadModeProvider } from './context/ReadModeContext'
import Hero from './components/Hero/Hero'
import Navbar from './components/Navbar/Navbar'
import ThemeToggle from './components/ThemeToggle/ThemeToggle'
import ReadMode from './components/ReadMode/ReadMode'
import Experience from './components/Experience/Experience'
import ChatWidget from './components/ChatWidget/ChatWidget'
import Blog from './pages/Blog'
import BlogPost from './pages/BlogPost'

function App() {
  const currentPath = window.location.pathname
  const isBlogPage = currentPath === '/blog'
  const isBlogPostPage = currentPath.startsWith('/blog/')

  return (
    <ReadModeProvider>
      <Navbar />
      <ThemeToggle />

      {isBlogPage && <Blog />}

      {isBlogPostPage && <BlogPost />}

      {!isBlogPage && !isBlogPostPage && (
        <main>
          <Hero />
          <ReadMode />
          <Experience />
          <ChatWidget />
        </main>
      )}
    </ReadModeProvider>
  )
}

export default App
