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
  <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
    <defs>
      <mask id="moon-mask">
        <rect width="16" height="16" fill="white" />
        <circle
          cx={isDark ? 11 : 20}
          cy={4}
          r={5}
          fill="black"
          style={{ transition: "cx 0.5s cubic-bezier(.34,1.56,.64,1)" }}
        />
      </mask>
    </defs>
    <circle
      cx={8} cy={8} r={isDark ? 5 : 4}
      fill="white"
      mask="url(#moon-mask)"
      style={{ transition: "r 0.4s cubic-bezier(.34,1.56,.64,1)" }}
    />
    <g
      stroke="white"
      strokeWidth="1.5"
      strokeLinecap="round"
      style={{ opacity: isDark ? 0 : 1, transition: "opacity 0.3s" }}
    >
      <line x1={8} y1={1} x2={8} y2={2.5} />
      <line x1={8} y1={13.5} x2={8} y2={15} />
      <line x1={1} y1={8} x2={2.5} y2={8} />
      <line x1={13.5} y1={8} x2={15} y2={8} />
      <line x1={3} y1={3} x2={4.1} y2={4.1} />
      <line x1={11.9} y1={3} x2={10.8} y2={4.1} />
      <line x1={3} y1={13} x2={4.1} y2={11.9} />
      <line x1={11.9} y1={13} x2={10.8} y2={11.9} />
    </g>
  </svg>
</span>
    </button>
  )
}

export default ThemeToggle