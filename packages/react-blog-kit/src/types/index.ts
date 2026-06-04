export type BlogPostStatus = 'draft' | 'published'

export type BlogPost = {
  slug: string
  title: string
  subtitle?: string
  summary?: string
  date: string
  updatedAt?: string
  status?: BlogPostStatus
  category?: string
  tags?: string[]
  featured?: boolean
  readingTime?: string
  body: string
}

export type BlogAIPayload = {
  type: 'article' | 'selection' | 'code'
  post?: BlogPost
  selectedText?: string
  code?: string
  language?: string
  prompt: string
}