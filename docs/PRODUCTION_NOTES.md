# Production Notes

A short checklist for daily production updates in this portfolio.

## 1. Before every push

Always run:

    npm run check
    git status

Only push when lint, blog validation, and build pass.

## 2. Safe daily workflow

    git status
    npm run check
    git add .
    git commit -m "clear message here"
    git push

If temporary files exist, do not blindly use `git add .`. Check first with:

    git status

## 3. Blog article workflow

Blog content lives here:

    src/content/blog/posts.jsx
    src/content/blog/articles/

Hide an article from production:

    status: 'draft'

Publish an article:

    status: 'published'

Published articles appear in:

    /blog
    /rss.xml
    /sitemap.xml

## 4. Hide dummy or preview article

Before pushing production, check:

    grep -n "ui-preview-article\|UI Preview Article" public/sitemap.xml public/rss.xml || true

Good result: no output.

## 5. Feed generation

RSS, sitemap, and robots are generated before build.

Manual command:

    npm run generate:feeds

Generated files:

    public/rss.xml
    public/sitemap.xml
    public/robots.txt

## 6. Blog validation

Run:

    npm run validate:blog

It checks:

    duplicate slugs
    missing title
    missing date
    missing summary
    invalid status
    empty published article body
    missing tags/category

## 7. Chatbot rules

There is only one chatbot UI.

Behavior:

    /              -> Portfolio Assistant
    /blog          -> Blog Assistant
    /blog/:slug    -> Article Assistant

Do not create a second chatbot UI unless absolutely necessary.

## 8. Current AI article features

    Selected text -> Ask AI
    Code block    -> Explain
    Article page  -> Article-aware chatbot

All should reuse the existing chatbot and backend.

## 9. CSS safety rule

Avoid broad global CSS.

Bad:

    html[data-theme="dark"] span {}
    html[data-theme="dark"] a {}
    html[data-theme="dark"] button {}

Good:

    .blog-card__date {}
    .cw-answer {}
    .blog-markdown p {}

Broad selectors can break navbar icons, theme toggle, buttons, and SVG colors.

## 10. Performance rule

Keep heavy features lazy-loaded.

Important files:

    src/App.jsx
    src/components/Blog/BlogCodeBlock.jsx
    src/components/ChatWidget/ChatAnswer.jsx

After adding a library, check bundle size:

    npm run build
    ls -lh dist/assets | sort -k5 -h | tail -20

## 11. Reports and temporary files

Do not commit temporary reports unless needed.

Usually safe to remove:

    rm -rf reports

## 12. If something breaks

Check changes:

    git status
    git diff

Revert one file:

    git restore path/to/file

Undo last commit but keep changes:

    git reset --soft HEAD~1

## 13. Production mindset

Before pushing, ask:

    Is this real content?
    Is dummy content hidden?
    Does light/dark mode work?
    Is mobile responsive?
    Does npm run check pass?
    Will this look good on Vercel?
