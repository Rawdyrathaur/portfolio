export const blogPosts = [
  {
    slug: "building-my-ai-portfolio-chatbot",
    title: "Building My AI Portfolio Chatbot",
    date: "2026-06-04",
    category: "AI Engineering",
    readTime: "5 min read",
    featured: true,
    summary:
      "How I connected React, FastAPI, RAG, ChromaDB, and Hugging Face Spaces to build an AI-powered portfolio assistant.",
    content: [
      {
        heading: "Why I Built This",
        body:
          "I wanted my portfolio to be more than a static website. I wanted visitors to interact with my work through an AI assistant that understands my projects, skills, and open-source experience.",
      },
      {
        heading: "The Architecture",
        body:
          "The frontend is built with React and Vite. The backend uses FastAPI with a small RAG pipeline powered by local knowledge files and vector search.",
      },
      {
        heading: "What I Learned",
        body:
          "This project helped me understand frontend UX, backend APIs, AI providers, caching, deployment, and real-world reliability issues like cold starts.",
      },
    ],
  },
  {
    slug: "my-open-source-journey",
    title: "My Open Source Journey",
    date: "2026-06-02",
    category: "Open Source",
    readTime: "4 min read",
    featured: false,
    summary:
      "Notes from contributing to production-level open-source projects and learning real-world engineering practices.",
    content: [
      {
        heading: "Starting With Real Codebases",
        body:
          "Open source helped me understand how real teams organize code, review changes, handle issues, and maintain quality over time.",
      },
      {
        heading: "What Changed My Thinking",
        body:
          "Instead of only writing code that works, I started thinking about code that is readable, minimal, reviewable, and useful for other developers.",
      },
    ],
  },
  {
    slug: "fixing-cold-starts-in-ai-projects",
    title: "Fixing Cold Starts in AI Projects",
    date: "2026-05-30",
    category: "Deployment",
    readTime: "3 min read",
    featured: false,
    summary:
      "How I improved startup behavior for my AI backend using caching and better health checks.",
    content: [
      {
        heading: "The Problem",
        body:
          "Free hosting services can sleep after inactivity. For AI apps, this can make the first request slow because embeddings, providers, or vector databases may need to reload.",
      },
      {
        heading: "The Fix",
        body:
          "I used persistent storage, cache checks, and startup logs to avoid rebuilding the knowledge base unnecessarily.",
      },
    ],
  },
]

export function getSortedBlogPosts() {
  return [...blogPosts].sort((a, b) => new Date(b.date) - new Date(a.date))
}

export function getBlogPostBySlug(slug) {
  return blogPosts.find((post) => post.slug === slug)
}
