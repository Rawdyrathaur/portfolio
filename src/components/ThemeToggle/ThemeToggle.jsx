/* ========================
   THEME TOGGLE COMPONENT
======================== */

import { useState, useEffect } from 'react'
import './ThemeToggle.css'

function ThemeToggle() {
  const [isDark, setIsDark] = useState(
    window.matchMedia('(prefers-color-scheme: dark)').matches
  )

  useEffect(() => {
    document.documentElement.setAttribute('data-theme', isDark ? 'dark' : 'light')
  }, [isDark])

  return (
    <button
      className={`theme-toggle ${isDark ? 'theme-toggle--dark' : ''}`}
      onClick={() => setIsDark(!isDark)}
      title="Toggle Theme"
      aria-label="Toggle Theme"
    >
      <span className="theme-toggle__thumb">
        {isDark ? '🌙' : '☀️'}
      </span>
    </button>
  )
}

export default ThemeToggle