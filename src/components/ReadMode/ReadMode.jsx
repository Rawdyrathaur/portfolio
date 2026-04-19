/* ========================
   READ MODE COMPONENT
======================== */

import './ReadMode.css'
import { useReadMode } from '../../hooks/useReadMode'

function ReadMode() {
  const { mode: active, setMode: setActive } = useReadMode()

  const handleClick = (e, mode) => {
    const btn = e.currentTarget
    const ripple = document.createElement('span')
    const rect = btn.getBoundingClientRect()
    const size = Math.max(rect.width, rect.height)
    const x = e.clientX - rect.left - size / 2
    const y = e.clientY - rect.top - size / 2

    ripple.style.width = ripple.style.height = `${size}px`
    ripple.style.left = `${x}px`
    ripple.style.top = `${y}px`
    ripple.classList.add('ripple')

    btn.appendChild(ripple)
    setTimeout(() => ripple.remove(), 600)

    setActive(mode)
  }

  return (
    <div className="readmode">
      <button
        className={`readmode__btn ${active === 'short' ? 'readmode__btn--active' : ''}`}
        onClick={(e) => handleClick(e, 'short')}
      >
        2 Min. read
      </button>
      <button
        className={`readmode__btn ${active === 'detailed' ? 'readmode__btn--active' : ''}`}
        onClick={(e) => handleClick(e, 'detailed')}
      >
        10 Min. read
      </button>
    </div>
  )
}

export default ReadMode