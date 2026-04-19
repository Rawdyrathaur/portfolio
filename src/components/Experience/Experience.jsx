/* ========================
   EXPERIENCE COMPONENT
======================== */

import experience from '../../content/experience'
import { useReadMode } from '../../hooks/useReadMode'
import './Experience.css'

function Experience() {
  const { mode } = useReadMode()
  return (
    <section className="experience">
      <p className="experience__label">EXPERIENCE</p>

      {experience.map((item) => (
        <div className="experience__item" key={item.id}>
          <div className="experience__header">
            <div className="experience__left">
              <span className="experience__company">{item.company}</span>
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