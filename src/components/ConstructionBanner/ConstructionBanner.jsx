/* ========================
   CONSTRUCTION BANNER COMPONENT
======================== */

import './ConstructionBanner.css'

function ConstructionBanner() {
  return (
    <div className="construction-banner">
      <div className="construction-content">
        <div className="construction-sticker">
          <svg
            viewBox="0 0 200 200"
            xmlns="http://www.w3.org/2000/svg"
            className="construction-svg"
          >
            {/* Hard hat */}
            <circle cx="100" cy="60" r="35" fill="#FFD700" stroke="#FFA500" strokeWidth="2" />
            <ellipse cx="100" cy="95" rx="40" ry="12" fill="#FF6B35" />

            {/* Face */}
            <circle cx="85" cy="75" r="4" fill="#000" />
            <circle cx="115" cy="75" r="4" fill="#000" />
            <path
              d="M 95 85 Q 100 90 105 85"
              stroke="#000"
              strokeWidth="2"
              fill="none"
              strokeLinecap="round"
            />

            {/* Tools */}
            <g transform="translate(120, 110)">
              <rect x="0" y="0" width="8" height="40" fill="#8B4513" rx="2" />
              <rect x="0" y="-8" width="30" height="8" fill="#C0C0C0" rx="1" />
            </g>

            {/* Wrench */}
            <g transform="translate(50, 120)">
              <rect x="0" y="0" width="6" height="35" fill="#8B4513" rx="2" />
              <circle cx="3" cy="0" r="6" fill="#C0C0C0" />
            </g>

            {/* Safety cone */}
            <g transform="translate(70, 140)">
              <polygon points="0,0 -15,40 15,40" fill="#FF6B35" stroke="#FFA500" strokeWidth="1" />
              <rect x="-8" y="10" width="16" height="4" fill="#FFFFFF" />
              <rect x="-8" y="20" width="16" height="4" fill="#FFFFFF" />
            </g>
          </svg>
        </div>

        <div className="construction-text">
          <h2 className="construction-title">
            <span className="construction-emoji">🚧</span> Site Under Construction
            <span className="construction-emoji">🚧</span>
          </h2>
          <p className="construction-subtitle">
            More awesome features & sections coming soon! Check back regularly for updates.
          </p>
          <div className="construction-loader">
            <div className="loader-bar"></div>
            <div className="loader-bar"></div>
            <div className="loader-bar"></div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default ConstructionBanner
