# NPM Package Plan: @manishrathaur/react-blog-kit

A production-ready React blog kit for developer portfolios.

This package should extract the reusable blog system from the portfolio without including personal content, private data, dummy articles, portfolio-specific links, or hardcoded Manish-specific branding.

## Package Name

Recommended package name:

    @manishrathaur/react-blog-kit

Alternative names:

    @manishrathaur/blog-kit
    @manishrathaur/dev-blog-kit
    @manishrathaur/portfolio-blog-kit

Best choice:

    @manishrathaur/react-blog-kit

## Goal

Build a reusable React blog system that any developer can install and use inside a portfolio, documentation site, or personal website.

The package should provide:

    Blog listing
    Blog cards
    Article layout
    Markdown rendering
    Table of contents
    Search and filters
    Code block rendering
    Copy code action
    Optional AI hooks
    Responsive layout
    Light/dark theme support

## What Must Not Be Included

Do not include:

    Personal articles
    Dummy preview articles
    Private backend URLs
    Personal email
    Hardcoded social links
    Portfolio-specific routes
    Vercel-specific assumptions
    Manish-specific content inside components

The package must be content-agnostic.

## Design Philosophy

The package should be:

    UI-first
    Content-agnostic
    Theme-friendly
    Framework-light
    Integration-friendly
    Safe by default

The host app should control:

    Routing
    Content source
    Backend
    AI behavior
    SEO
    RSS/sitemap generation
    Theme variables

## Example API

Basic blog page:

    import { BlogIndex, BlogProvider } from '@manishrathaur/react-blog-kit'

    function BlogPage() {
      return (
        <BlogProvider posts={posts}>
          <BlogIndex />
        </BlogProvider>
      )
    }

Article page:

    import { BlogArticle } from '@manishrathaur/react-blog-kit'

    function BlogPostPage({ post }) {
      return (
        <BlogArticle
          post={post}
          onAskAI={(payload) => {
            openChatbot(payload)
          }}
        />
      )
    }

## Core Components

    BlogProvider
    BlogIndex
    BlogArticle
    BlogCard
    BlogSearch
    BlogTagFilter
    BlogMarkdown
    BlogCodeBlock
    BlogTableOfContents
    BlogPostHeader
    BlogPostFooter
    BlogEmptyState
    BlogSelectionAsk

## Core Hooks

    useBlogPosts
    useBlogSearch
    useBlogTags
    useReadingProgress
    useSelectedText
    useBlogAI

## BlogPost Type

    export type BlogPost = {
      slug: string
      title: string
      subtitle?: string
      summary?: string
      date: string
      updatedAt?: string
      status?: 'draft' | 'published'
      category?: string
      tags?: string[]
      featured?: boolean
      readingTime?: string
      body: string
    }

## AI Payload Type

    export type BlogAIPayload = {
      type: 'article' | 'selection' | 'code'
      post?: BlogPost
      selectedText?: string
      code?: string
      language?: string
      prompt: string
    }

## Recommended Folder Structure

    packages/react-blog-kit/
    ├── src/
    │   ├── components/
    │   │   ├── BlogIndex.tsx
    │   │   ├── BlogArticle.tsx
    │   │   ├── BlogCard.tsx
    │   │   ├── BlogMarkdown.tsx
    │   │   ├── BlogCodeBlock.tsx
    │   │   ├── BlogSearch.tsx
    │   │   ├── BlogTableOfContents.tsx
    │   │   └── BlogEmptyState.tsx
    │   ├── hooks/
    │   ├── types/
    │   ├── styles/
    │   └── index.ts
    ├── package.json
    ├── tsconfig.json
    ├── vite.config.ts
    ├── README.md
    └── CHANGELOG.md

## Styling Strategy

Use package-specific class names:

    .mrt-blog
    .mrt-blog-card
    .mrt-blog-article
    .mrt-blog-code
    .mrt-blog-search
    .mrt-blog-toc

Avoid global selectors.

Bad:

    body {}
    span {}
    button {}
    html[data-theme='dark'] a {}

Good:

    .mrt-blog-card {}
    .mrt-blog-article p {}
    .mrt-blog-code button {}

## Theme Strategy

Use CSS variables so users can customize the design:

    :root {
      --mrt-blog-bg: transparent;
      --mrt-blog-text: #d4d4d4;
      --mrt-blog-muted: #8a8f98;
      --mrt-blog-accent: #8fd6dd;
      --mrt-blog-border: rgba(255, 255, 255, 0.1);
    }

## AI Strategy

AI must be optional.

Correct:

    <BlogArticle
      post={post}
      onAskAI={(payload) => myChatbot.ask(payload)}
    />

Wrong:

    fetch('https://my-personal-backend.com/chat')

Never hardcode a personal backend inside the package.

## Dependencies

Keep dependencies minimal.

Likely dependencies:

    react-markdown
    remark-gfm
    rehype-sanitize
    github-slugger
    fuse.js
    @floating-ui/dom
    prismjs

Peer dependencies:

    react
    react-dom

## Build Strategy

Use Vite library mode.

Expected outputs:

    ESM build
    TypeScript declarations
    CSS file
    package exports map

## Package Quality Checklist

Before publishing:

    No personal content
    No dummy article
    No hardcoded backend URL
    No global CSS pollution
    TypeScript types included
    README includes examples
    Build passes
    Package size checked
    Dark/light theme tested
    Mobile tested
    AI hooks are optional

## README Sections

The package README should include:

    Installation
    Basic usage
    BlogPost type
    Markdown article example
    Search/filter usage
    AI integration example
    Theme customization
    Accessibility notes
    License

## Publishing Flow

Local package test:

    npm run build
    npm pack

Test the package in another React app before publishing.

Publish:

    npm publish --access public

Make sure the npm account can publish under the @manishrathaur scope.

## Versioning

Use semantic versioning:

    0.1.0 initial alpha
    0.2.0 improved API
    1.0.0 stable public release

Start with:

    0.1.0

## First Milestone

Do not extract everything at once.

Start with:

    BlogCard
    BlogIndex
    BlogMarkdown
    BlogCodeBlock
    Types
    Basic CSS

Then add:

    TOC
    Search
    Selected text Ask AI
    Code Explain action
    RSS helpers

## Final Positioning

Short package description:

    A production-ready React blog kit for developer portfolios with markdown, search, code blocks, TOC, theme support, and optional AI actions.