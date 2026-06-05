# Template Release Checklist

Use this before making the repository public as a reusable starter.

## Required checks

Run:

    npm run check
    git status

## Files users must configure

    .env
    backend/.env
    src/config/socials.js
    src/content/profile.jsx
    src/content/site/metadata.js
    public/resumes/

## Do not commit

    .env
    backend/.env
    API keys
    private tokens
    real secrets
    local reports
    virtual environments

## Safe to keep

    .env.example
    backend/.env.example
    backend/tests/.env.test.example

## Final review

Check these before publishing:

    README.md is clear
    TEMPLATE_SETUP.md is clear
    chatbot backend URL is configurable
    personal links are placeholders
    RSS and sitemap build successfully
    no private keys are committed
