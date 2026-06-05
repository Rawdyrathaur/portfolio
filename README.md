# AI Portfolio Starter

A production-ready AI-powered developer portfolio starter built with React, Vite, blog system, theme support, chatbot UI, RSS/sitemap generation, and configurable backend integration.

This template is free to use and customize.

## What is included

- React + Vite portfolio frontend
- responsive portfolio sections
- dark/light theme support
- blog system
- markdown article rendering
- RSS, sitemap, and robots generation
- chatbot UI
- optional AI backend connection
- resume link support
- configurable social/profile links
- production checklist scripts

## What is not included

This template does not include real API keys or private tokens.

You must add your own environment variables locally or in your deployment platform.

## Quick start

Clone the project:

    git clone your-repo-url
    cd your-repo-name

Install dependencies:

    npm install

Create environment file:

    cp .env.example .env

Run locally:

    npm run dev

Before pushing or deploying:

    npm run check

## Configuration

Edit social/profile links:

    src/config/socials.js

Edit public profile content:

    src/content/profile.jsx
    src/content/experience.jsx
    src/content/projects.jsx
    src/content/skills.jsx
    src/content/site/metadata.js

Add your resume:

    public/resumes/

Then update the resume path in:

    src/config/socials.js

## Chatbot backend

The chatbot UI is included.

To connect a backend, set this in `.env`:

    VITE_CHATBOT_BACKEND_URL=https://your-backend-url.com

If this value is empty, the site still works. The chatbot will show a setup message instead of failing.

Backend provider keys belong in:

    backend/.env

Use:

    backend/.env.example

as the reference.

## Blog workflow

Blog content lives in:

    src/content/blog/

Use this to hide an article:

    status: 'draft'

Use this to publish an article:

    status: 'published'

Published articles appear in:

    /blog
    /rss.xml
    /sitemap.xml

## Deploy

Frontend can be deployed to Vercel, Netlify, or any static hosting provider.

Set these environment variables in your hosting dashboard if needed:

    VITE_CHATBOT_BACKEND_URL
    VITE_SITE_URL

The backend should be deployed separately.

## Full setup guide

Read:

    TEMPLATE_SETUP.md

## Safety checklist

Before publishing your version:

    npm run check
    git status

Do not commit:

    .env
    backend/.env
    API keys
    private tokens
    secrets

## License

MIT
