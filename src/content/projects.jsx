/* ========================
   PROJECTS CONTENT
======================== */

import profile from './profile'

const projects = [
  {
    id: 1,
    title: 'Tabrevo',
    tag: 'Chrome Extension · Web App',
    liveTag: 'Live on Chrome Web Store',
    description:
      'Local-first browser follow-up system with Chrome side-panel and companion web app. Keeps pages, notes, and scheduled reminders together with optional cloud sync.',
    tech: ['TypeScript', 'React', 'Chrome Extension MV3', 'IndexedDB', 'Node.js', 'PostgreSQL'],
    buttons: [
      {
        label: 'Live Demo',
        href: 'https://chromewebstore.google.com/detail/tabrevo/hgikoojlccdklfmhcmhgoefjiinffmni',
      },
      {
        label: 'GitHub',
        href: 'https://github.com/Rawdyrathaur/Tab_story',
      },
      {
        label: 'Website',
        href: 'https://tabrevo.duckdns.org/',
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
