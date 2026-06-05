export const socialLinks = {
  github: 'https://github.com/your-username',
  linkedin: 'https://www.linkedin.com/in/your-profile/',
  twitter: 'https://x.com/your-handle',
  kaggle: 'https://www.kaggle.com/your-username',
  resume: '/resumes/your-resume.pdf',
  email: 'you@example.com',
}

export const contactHref = `https://mail.google.com/mail/?view=cm&fs=1&to=${encodeURIComponent(
  socialLinks.email,
)}&su=${encodeURIComponent('Portfolio Contact')}&body=${encodeURIComponent(
  'Hi,\n\nI saw your portfolio and wanted to connect.\n\nThanks!',
)}`
