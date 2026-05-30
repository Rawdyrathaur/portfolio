/* ========================
   EXPERIENCE COMPONENT
======================== */

import { useState } from 'react'

import experience from '../../content/experience'
import { useReadMode } from '../../hooks/useReadMode'
import './Experience.css'

function ExperienceLogo({ logo, logoAlt, fallbackIcon }) {
  const [loaded, setLoaded] = useState(false)
  const [failed, setFailed] = useState(false)

  return (
    <span className="experience__logo" aria-hidden="true">
      {(!loaded || failed) && (
        <span className="experience__logoFallback">{fallbackIcon}</span>
      )}

      {logo && !failed && (
        <img
          src={logo}
          alt={logoAlt}
          onLoad={() => setLoaded(true)}
          onError={() => setFailed(true)}
          className={`experience__logoImage ${
            loaded ? 'experience__logoImage--loaded' : ''
          }`}
        />
      )}
    </span>
  )
}

function Experience() {
  const { mode } = useReadMode()
  return (
    <section className="experience">
      <p className="experience__label">EXPERIENCE</p>

      {experience.map((item) => (
        <div className="experience__item" key={item.id}>
          <div className="experience__header">
            <div className="experience__left">
              <div className="experience__companyRow">
                <ExperienceLogo
                  logo={item.logo}
                  logoAlt={item.logoAlt}
                  fallbackIcon={item.fallbackIcon}
                />
                <span className="experience__company">{item.company}</span>
              </div>
              {item.badge && (
                <span className="experience__badge">{item.badge}</span>
              )}
              {item.link && (
                <a
                  className="experience__link"
                  href={item.link}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  link
                </a>
              )}
            </div>
            <div className="experience__right">
              <span className="experience__role">{item.role}</span>
              <span className="experience__location">, {item.location}</span>
            </div>
          </div>

          <p className="experience__body">
            {mode === 'short' ? item.short : item.detailed}
          </p>
        </div>
      ))}
    </section>
  )
}

export default Experience