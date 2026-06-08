import unityGameJourneyArticle from './articles/from-playing-games-to-building-one.md?raw'
import uiPreviewArticle from './articles/ui-preview-article.md?raw'

export const blogPosts = [
  {
    slug: 'from-playing-games-to-building-one',
    title: 'From Playing Games to Building One: Our First Unity Game Development Journey',
    subtitle: 'A student-led Unity FPS game journey covering ProBuilder level design, Rigidbody physics, FPS controller movement, NavMesh AI, Meshy AI assets, optimization, and version-control lessons.',
    date: '2026-06-08',
    updatedAt: '2026-06-08',
    category: 'Game Development',
    tags: [
      'Unity',
      'Game Development',
      'FPS Controller',
      'Rigidbody',
      'NavMesh AI',
      'ProBuilder',
      'Meshy AI',
      'Optimization',
      'Student Project',
    ],
    featured: true,
    status: 'published',
    image:
      'https://res.cloudinary.com/dxclnybhc/image/upload/f_auto,q_auto,w_1200/v1780926497/Screenshot_2026-06-08_at_4.05.42_PM_gssf22.png',
    videos: [
      {
        title: 'Game concept and first playable idea preview',
        description:
          'A short gameplay preview showing the core idea of the Unity FPS game project.',
        url: 'https://res.cloudinary.com/dxclnybhc/video/upload/v1780927692/WhatsApp_Video_2026-05-23_at_13.36.37_1_mdwhxx.mp4',
        thumbnail:
          'https://res.cloudinary.com/dxclnybhc/image/upload/f_auto,q_auto,w_1200/v1780926497/Screenshot_2026-06-08_at_4.05.42_PM_gssf22.png',
        uploadDate: '2026-06-08',
      },
      {
        title: 'FPS controller movement preview',
        description:
          'A short video preview of the first-person controller movement inside the Unity project.',
        url: 'https://res.cloudinary.com/dxclnybhc/video/upload/v1780925758/Convert_to_MP4_project_-_June_08_2026_at_18.59.12_nylls5.mp4',
        thumbnail:
          'https://res.cloudinary.com/dxclnybhc/image/upload/f_auto,q_auto,w_1200/v1780926497/Screenshot_2026-06-08_at_4.05.42_PM_gssf22.png',
        uploadDate: '2026-06-08',
      },
    ],
    faq: [
      {
        question: 'What was the hardest part of building our first Unity game?',
        answer:
          'The hardest part was making physics, movement, AI navigation, assets, level design, optimization, and teamwork connect together without breaking the game.',
      },
      {
        question: 'What did we learn from Rigidbody?',
        answer:
          'We learned that Rigidbody movement should respect Unity physics timing. Moving a physics object directly with transform.position created unstable behavior, while physics-aware movement made the controller more stable.',
      },
      {
        question: 'Why did we use ProBuilder?',
        answer:
          'We used ProBuilder because it helped us build and adjust the level directly inside Unity, making greyboxing, scale testing, rooms, corridors, and movement flow easier to iterate.',
      },
      {
        question: 'Why did we use NavMesh AI?',
        answer:
          'We used NavMesh AI because our game needed intelligent characters that could move through the environment, follow paths, avoid obstacles, and react to targets instead of moving in a straight line.',
      },
      {
        question: 'Why did we use Meshy AI?',
        answer:
          'We used Meshy AI because we needed 3D assets but were not trained 3D modelers. It helped us generate base meshes quickly, but the assets still needed cleanup, optimization, and Unity integration.',
      },
      {
        question: 'What is the biggest lesson from this Unity project?',
        answer:
          'The biggest lesson is that game development is not only about writing code. It is about connecting design, physics, assets, AI, performance, testing, teamwork, and iteration into one playable experience.',
      },
    ],
    summary:
      'A personal Unity FPS game development journey about building a first-person controller, learning Rigidbody physics, designing levels with ProBuilder, creating NavMesh AI, using Meshy AI assets, optimizing performance, and handling version-control problems as a student team.',
    body: unityGameJourneyArticle,
  },
  {
    slug: 'ui-preview-article',
    title: 'UI Preview Article',
    subtitle: 'Temporary article for testing the blog reading experience.',
    date: '2026-06-04',
    updatedAt: '2026-06-04',
    category: 'UI Preview',
    tags: ['Markdown', 'Design', 'Preview'],
    featured: true,
    status: 'draft',
    summary:
      'A temporary dummy article used only to test typography, spacing, markdown rendering, tables, quotes, and code blocks.',
    body: uiPreviewArticle,
  },
]

function calculateReadingTime(markdown = '') {
  const wordsPerMinute = 200
  const words = markdown.trim().split(/\s+/).filter(Boolean).length
  const minutes = Math.max(1, Math.ceil(words / wordsPerMinute))

  return `${minutes} min read`
}

function withComputedFields(post) {
  let body = post.body || ''
  if (body.startsWith('---')) {
    const end = body.indexOf('---', 3)
    if (end !== -1) body = body.slice(end + 3).trimStart()
  }

  return {
    status: 'draft',
    tags: [],
    featured: false,
    body,
    ...post,
    readTime: post.readTime || calculateReadingTime(body),
  }
}

export function getPublishedBlogPosts() {
  return blogPosts
    .map(withComputedFields)
    .filter((post) => post.status === 'published')
}

export function getSortedBlogPosts() {
  return [...getPublishedBlogPosts()].sort(
    (a, b) => new Date(b.date) - new Date(a.date),
  )
}

export function getBlogPostBySlug(slug) {
  return getPublishedBlogPosts().find((post) => post.slug === slug)
}


export function getAdjacentBlogPosts(slug) {
  const posts = getSortedBlogPosts()
  const currentIndex = posts.findIndex((post) => post.slug === slug)

  if (currentIndex === -1) {
    return {
      previousPost: null,
      nextPost: null,
    }
  }

  return {
    previousPost: posts[currentIndex + 1] || null,
    nextPost: posts[currentIndex - 1] || null,
  }
}

export function getRelatedBlogPosts(currentPost, limit = 3) {
  if (!currentPost) return []

  const currentTags = new Set(currentPost.tags || [])

  return getSortedBlogPosts()
    .filter((post) => post.slug !== currentPost.slug)
    .map((post) => {
      const tagScore = (post.tags || []).filter((tag) => currentTags.has(tag)).length
      const categoryScore = post.category === currentPost.category ? 2 : 0

      return {
        post,
        score: tagScore + categoryScore,
      }
    })
    .filter((item) => item.score > 0)
    .sort((a, b) => b.score - a.score)
    .slice(0, limit)
    .map((item) => item.post)
}
