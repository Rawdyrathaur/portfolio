/* ========================
   THEME TOGGLE COMPONENT
======================== */

import { useState, useEffect, useId } from 'react'
import './ThemeToggle.css'

function ThemeToggle() {
  const id = useId()

  // Fix 1: Lazy initializer with SSR guard
  const [isDark, setIsDark] = useState(
    typeof window !== 'undefined'
      ? window.matchMedia('(prefers-color-scheme: dark)').matches
      : false
  )

  // Fix 4: Add system theme listener
  useEffect(() => {
    const mq = window.matchMedia('(prefers-color-scheme: dark)')
    const handler = (e) => setIsDark(e.matches)
    mq.addEventListener('change', handler)
    return () => mq.removeEventListener('change', handler)
  }, [])

  const toggleTheme = () => {
    setIsDark((prev) => {
      const newTheme = !prev
      document.documentElement.setAttribute('data-theme', newTheme ? 'dark' : 'light')
      return newTheme
    })
  }

  return (
    <button
      className={`theme-toggle ${isDark ? 'theme-toggle--dark' : ''}`}
      onClick={toggleTheme}
      title="Toggle Theme"
      aria-label="Toggle Theme"
    >
      <svg width="24" height="24" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
        {/* Fix 2: Unique mask ID */}
        <mask id={`moon-mask-${id}`}>
          <rect x="0" y="0" width="24" height="24" fill="white" />
          <circle cx="12" cy="12" r="6" fill="black" />
        </mask>
        <circle cx="12" cy="12" r="10" fill="currentColor" mask={`url(#moon-mask-${id})`} />
      </svg>
    </button>
  )
}

export default ThemeToggle