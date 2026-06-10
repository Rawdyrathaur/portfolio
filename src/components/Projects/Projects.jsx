import './Projects.css'

const projects = [
  {
    id: 1,
    name: 'Tab Story',
    badge: 'Chrome Extension',
    liveLink: 'https://chromewebstore.google.com/detail/tab-story/nhjglpjgddjcjafdabmepgalnaejnleb',
    githubLink: 'https://github.com/Rawdyrathaur/Tab_story',
    description:
      'AI-powered browser tab manager built with 100% local AI, crash recovery system, and real active users. Zero data leaves the device.',
    tags: [
      { name: 'JavaScript', icon: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/javascript/javascript-original.svg' },
      { name: 'Chrome Extension MV3', icon: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/chrome/chrome-original.svg' },
      { name: 'Chrome AI API', icon: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/chrome/chrome-original.svg' },
    ],
    stats: [
      { value: 'Real', label: 'Active Users' },
      { value: '100%', label: 'Local AI' },
      { value: 'Zero', label: 'Data Sent' },
    ],
  },
  {
    id: 2,
    name: 'Carbon Pulse',
    badge: 'Microservices',
    liveLink: 'https://co-2-gamma.vercel.app/',
    demoVideo: 'https://www.youtube.com/watch?v=c8UEOE1E4zc',
    githubLink: null,
    description:
      '3-service carbon footprint tracker with Spring Boot, Node.js and React, IEA-compliant calculations, and circuit breaker patterns validated across 50+ test scenarios.',
    tags: [
      { name: 'Spring Boot', icon: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/spring/spring-original.svg' },
      { name: 'Java', icon: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/java/java-original.svg' },
      { name: 'Node.js', icon: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/nodejs/nodejs-original.svg' },
      { name: 'React', icon: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/react/react-original.svg' },
      { name: 'Docker', icon: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/docker/docker-original.svg' },
      { name: 'JUnit', icon: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/java/java-original.svg' },
    ],
    stats: [
      { value: '3', label: 'Microservices' },
      { value: '50+', label: 'Test Scenarios' },
      { value: '100%', label: 'IEA Compliant' },
    ],
  },
  {
    id: 3,
    name: 'OmniSupport AI',
    badge: 'Distributed Systems',
    liveLink: null,
    githubLink: 'https://github.com/Rawdyrathaur/OmniSupport-AI',
    description:
      '6-service Spring Boot microservices platform with JWT security, Kafka async pipeline, and full Docker Compose orchestration.',
    tags: [
      { name: 'Java', icon: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/java/java-original.svg' },
      { name: 'Spring Boot', icon: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/spring/spring-original.svg' },
      { name: 'Kafka', icon: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/apachekafka/apachekafka-original.svg' },
      { name: 'PostgreSQL', icon: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/postgresql/postgresql-original.svg' },
      { name: 'Docker', icon: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/docker/docker-original.svg' },
      { name: 'Eureka', icon: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/spring/spring-original.svg' },
    ],
    stats: [
      { value: '6', label: 'Microservices' },
      { value: 'High', label: 'Throughput' },
      { value: '100%', label: 'Secure' },
    ],
  },
]

export default function Projects() {
  return (
    <section className="projects">
      <p className="projects__label">PROJECTS</p>

      {projects.map((project) => (
        <div className="projects__item" key={project.id}>

          <div className="projects__header">
            <div className="projects__left">
              <div className="projects__logo">
                <span className="projects__logo-fallback">
                  {project.name.charAt(0)}
                </span>
              </div>
              <span className="projects__name">{project.name}</span>
              <span className="projects__badge">{project.badge}</span>
            </div>
            <div className="projects__right">
              {project.liveLink && (
                <a
                  className="projects__link projects__icon-link"
                  href={project.liveLink}
                  target="_blank"
                  rel="noopener noreferrer"
                  title="Live Demo"
                  aria-label="Live Demo"
                >
                  <svg className="projects__icon" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
                    <path d="M14 3h7v7" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
                    <path d="M10 14L21 3" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
                    <path d="M21 21H3V3h7" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                </a>
              )}
              {project.demoVideo && (
                <a
                  className="projects__btn projects__btn--video"
                  href={project.demoVideo}
                  target="_blank"
                  rel="noopener noreferrer"
                  title="Demo video"
                  aria-label="Demo video"
                >
                  <svg
                    className="projects__video-icon"
                    viewBox="0 0 24 24"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                    aria-hidden="true"
                  >
                    <path d="M3 5v14a2 2 0 0 0 2 2h14V3H5a2 2 0 0 0-2 2z" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round" />
                    <path d="M10 8.5v7l6-3.5-6-3.5z" fill="currentColor" />
                  </svg>
                </a>
              )}
              {project.githubLink && (
                <a
                  className="projects__link projects__icon-link"
                  href={project.githubLink}
                  target="_blank"
                  rel="noopener noreferrer"
                  title="GitHub"
                  aria-label="GitHub"
                >
                  <img
                    src="https://cdn.jsdelivr.net/gh/devicons/devicon/icons/github/github-original.svg"
                    alt="GitHub"
                    title="GitHub"
                    className="projects__github-icon"
                    width="18"
                    height="18"
                  />
                </a>
              )}
            </div>
          </div>

          <p className="projects__body">{project.description}</p>

          <div className="projects__tags">
            {project.tags.map((tag) => (
              <span className="projects__tag" key={tag.name}>
                <img src={tag.icon} alt={tag.name} className="projects__tag-icon" />
                {tag.name}
              </span>
            ))}
          </div>

          <div className="projects__stats">
            {project.stats.map((stat) => (
              <div className="projects__stat" key={stat.label}>
                <span className="projects__stat-value">{stat.value}</span>
                <span className="projects__stat-label">{stat.label}</span>
              </div>
            ))}
          </div>

        </div>
      ))}
    </section>
  )
}