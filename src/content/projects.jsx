/* ========================
   PROJECTS CONTENT
======================== */

import profile from './profile'

const projects = [
  {
    id: 1,
    title: 'Tab Story',
    tag: 'Chrome Extension',
    liveTag: 'Live on Chrome Web Store',
    description:
      'AI-powered browser tab manager built with 100% local AI, crash recovery system, and real active users.',
    tech: ['JavaScript', 'Chrome Extension MV3', 'Chrome Built-in AI API'],
    buttons: [
      {
        label: 'Live Demo',
        href: 'https://chromewebstore.google.com/detail/tab-story/nhjglpjgddjcjafdabmepgalnaejnleb',
      },
      {
        label: 'GitHub',
        href: 'https://github.com/Rawdyrathaur/Tab_story',
      },
    ],
  },
  {
    id: 2,
    title: 'Carbon Pulse',
    tag: 'Microservices',
    description:
      '3-service carbon footprint tracker with Spring Boot, Node.js and React, IEA-compliant calculations, and circuit breaker patterns validated across 50+ test scenarios.',
    tech: ['Spring Boot', 'Java', 'Node.js', 'React', 'Docker', 'JUnit'],
    buttons: [
      {
        label: 'Live Demo',
        disabled: true,
      },
      {
        label: 'GitHub',
        href: 'https://github.com/Rawdyrathaur/OmniSupport-AI',
      },
    ],
  },
  {
    id: 3,
    title: 'OmniSupport AI',
    tag: 'Distributed Systems',
    description:
      '6-service Spring Boot microservices platform with JWT security, Kafka async pipeline, and full Docker Compose orchestration.',
    tech: ['Java', 'Spring Boot', 'Kafka', 'PostgreSQL', 'Docker', 'Eureka'],
    buttons: [
      {
        label: 'GitHub',
        href: profile.links.github,
      },
    ],
  },
]

export default projects
