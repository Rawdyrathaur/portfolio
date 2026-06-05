# Template Setup

This is an AI-powered developer portfolio starter.

It includes:

- React + Vite portfolio frontend
- blog system
- dark/light theme
- chatbot UI
- optional AI backend connection
- RSS, sitemap, and robots generation
- resume link support
- configurable social/profile links

This template does not include real API keys.

## 1. Install

Run:

    npm install

## 2. Configure frontend environment

Create a local `.env` file:

    cp .env.example .env

Edit `.env`:

    VITE_CHATBOT_BACKEND_URL=https://your-backend-url.com
    VITE_SITE_URL=https://your-domain.com

If you do not have a chatbot backend yet, leave `VITE_CHATBOT_BACKEND_URL` empty. The site will still run.

Do not commit `.env`.

## 3. Configure profile links

Update:

    src/config/socials.js

Replace:

    GitHub URL
    LinkedIn URL
    Twitter/X URL
    Kaggle URL
    email
    resume path

## 4. Configure site/profile content

Update your public portfolio content in:

    src/content/profile.jsx
    src/content/experience.jsx
    src/content/projects.jsx
    src/content/skills.jsx
    src/content/site/metadata.js

Keep the structure. Replace the text with your own details.

## 5. Add resume

Put your resume PDF in:

    public/resumes/

Then update the resume path in:

    src/config/socials.js

Example:

    resume: '/resumes/your-resume.pdf'

## 6. Blog workflow

Blog content lives in:

    src/content/blog/

Use:

    status: 'draft'

to hide an article.

Use:

    status: 'published'

to publish an article.

Published articles appear in:

    /blog
    /rss.xml
    /sitemap.xml

## 7. Backend setup

If you use the included backend, create:

    backend/.env

from:

    backend/.env.example

Add at least one provider key:

    GROQ_API_KEY=
    GEMINI_API_KEY=
    COHERE_API_KEY=
    MISTRAL_API_KEY=
    TOGETHER_API_KEY=

Do not commit `backend/.env`.

## 8. Run locally

Frontend:

    npm run dev

Production check:

    npm run check

`npm run check` runs lint, blog validation, feed generation, and production build.

## 9. Deploy

Frontend can be deployed to Vercel, Netlify, or any static hosting provider.

Before deploying, set these environment variables in your hosting dashboard:

    VITE_CHATBOT_BACKEND_URL
    VITE_SITE_URL

Backend can be deployed separately to any Python/FastAPI hosting provider.

## 10. Safety checklist

Before pushing:

    npm run check
    git status

Make sure you did not commit:

    .env
    backend/.env
    API keys
    private tokens
    personal secrets

## 11. Recommended customization order

1. Update `src/config/socials.js`
2. Update profile/content files
3. Replace resume
4. Configure `.env`
5. Test with `npm run check`
6. Deploy frontend
7. Connect backend later if needed

## Notes

The chatbot UI is included by default.

The chatbot backend is optional. If no backend URL is configured, the frontend will show a clear message instead of failing silently.
