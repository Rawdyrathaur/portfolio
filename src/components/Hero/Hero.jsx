/* ========================
   HERO COMPONENT
======================== */

import './Hero.css'
import profile from '../../assets/mypic.webp'

function Hero() {
  return (
    <section className="hero">
      <div className="hero__image-wrapper">
        <img src={profile} alt="Manish" className="hero__image" />
      </div>
      <h1 className="hero__name">Manish Rathaur</h1>
      <p className="hero__tagline">
        I learn by doing — explored tools, built systems, made mistakes, and always
        cared more about how things work than where I learned it.
      </p>
      <div className="hero__meta-row">
        <div className="hero__status-badge" aria-label="Open to work status">
          <span className="hero__status-dot" aria-hidden="true" />
          <span>Open to work</span>
        </div>
        <div className="hero__location" aria-label="Location India">
          <svg
            className="hero__location-icon"
            viewBox="0 0 24 24"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
            aria-hidden="true"
          >
            <path
              d="M12 21s7-6.2 7-11a7 7 0 1 0-14 0c0 4.8 7 11 7 11Z"
              stroke="currentColor"
              strokeWidth="1.6"
            />
            <circle cx="12" cy="10" r="2.6" fill="currentColor" />
          </svg>
          <span>India</span>
        </div>
        <div className="hero__work-pref" aria-label="Work preference Remote Hybrid">
          <svg
            className="hero__work-pref-icon"
            viewBox="0 0 24 24"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
            aria-hidden="true"
          >
            <path
              d="M8 7V5.8C8 4.8 8.8 4 9.8 4h4.4c1 0 1.8.8 1.8 1.8V7"
              stroke="currentColor"
              strokeWidth="1.6"
              strokeLinecap="round"
            />
            <rect
              x="3.5"
              y="7"
              width="17"
              height="10.5"
              rx="2.2"
              stroke="currentColor"
              strokeWidth="1.6"
            />
            <path
              d="M3.5 12.2h17"
              stroke="currentColor"
              strokeWidth="1.6"
              strokeLinecap="round"
            />
          </svg>
          <span>Remote · Hybrid</span>
        </div>
      </div>
    </section>
  )
}

export default Hero