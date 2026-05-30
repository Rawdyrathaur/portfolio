/* ========================
   OPEN SOURCE EXPERIENCE CONTENT
======================== */

import organicMapsLogo from "../assets/organic-maps.svg"
import kubeStellarLogo from "../assets/KubeStellar.png"

export const sectionTitle = "Open Source Experience"

export const sectionSubtitle =
  "Hands-on contributions to real-world open-source projects through Android development, QA testing, bug hunting, and issue reporting."

const experience = [
  {
    id: 1,
    company: "Organic Maps",
    badge: "Open Source Android",
    link: "https://organicmaps.app",
    logo: organicMapsLogo,
    logoAlt: "Organic Maps logo",
    fallbackIcon: "🗺️",
    role: "Open Source Android Contributor",
    location: "Remote",
    short:
      "Contributed to Organic Maps, a privacy-focused open-source maps application, by working on Android development, feature improvements, and bug fixes.",
    detailed: `Contributed part-time to the Organic Maps open-source project, mainly focusing on Android development using Java 18.

Key contributions include:
• Worked on Android feature improvements in a real production-level mobile codebase
• Identified and fixed bugs affecting app functionality and user experience
• Followed clean, minimal, and maintainable coding practices
• Used Git-based open-source workflows for contribution and collaboration
• Gained practical experience with production-quality Android development

This experience helped me understand how real open-source mobile applications are built, reviewed, maintained, and improved for actual users.`,
  },
  {
    id: 2,
    company: "KubeStellar Console",
    badge: "QA & Issue Reporting",
    link: "https://github.com/kubestellar/console",
    logo: kubeStellarLogo,
    logoAlt: "KubeStellar logo",
    fallbackIcon: "☸️",
    role: "Open Source QA Contributor",
    location: "Remote",
    short:
      "Participated in KubeStellar Console by testing the Kubernetes dashboard, hunting bugs, and raising useful issues.",
    detailed: `Participated in the KubeStellar Console open-source project with a focus on QA, bug hunting, and issue reporting.

Key contributions include:
• Explored the Kubernetes console interface to understand feature behavior
• Tested workflows and identified bugs or unexpected behavior
• Raised clear and useful issues to help maintainers improve the project
• Showcased QA skills through manual testing, observation, and issue documentation
• Built familiarity with Kubernetes dashboard tooling and open-source collaboration

This experience strengthened my ability to test real-world developer tools, communicate technical problems clearly, and contribute beyond code through quality-focused open-source participation.`,
  },
]

export default experience