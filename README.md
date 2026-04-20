# Portfolio RAG System — Complete Workflow Guide

> A full-stack personal AI assistant for your portfolio with voice mode, streaming TTS, and free multi-provider LLM fallback using LiteLLM.

---

## Table of Contents

1. [What We Are Building](#what-we-are-building)
2. [Full Architecture Overview](#full-architecture-overview)
3. [Step 1 — Knowledge Base](#step-1--knowledge-base)
4. [Step 2 — RAG Pipeline](#step-2--rag-pipeline)
5. [Step 3 — Voice Mode (Streaming TTS)](#step-3--voice-mode-streaming-tts)
6. [Step 4 — LiteLLM (Free Multi-Provider Gateway)](#step-4--litellm-free-multi-provider-gateway)
7. [Step 5 — Deployment](#step-5--deployment)
8. [Cost Breakdown](#cost-breakdown)
9. [Final File Structure](#final-file-structure)

---

## What We Are Building

A portfolio website where visitors can:
- **Ask questions** about your projects, skills, and experience
- **Hear answers read aloud** naturally in voice mode (low latency)
- **Never hit a rate limit** — uses Groq → Gemini → Grok as fallback (all free)
- **Deploy for free** — Vercel (frontend) + Supabase (vector DB) + Render (LiteLLM)

![Architecture](https://img.shields.io/badge/Stack-Next.js%20%2B%20LiteLLM%20%2B%20Supabase-purple?style=for-the-badge)
![Cost](https://img.shields.io/badge/Monthly%20Cost-%240%20to%20%2410-green?style=for-the-badge)
![License](https://img.shields.io/badge/LLMs-Free%20Open%20Source-blue?style=for-the-badge)

---

## Full Architecture Overview

```
Visitor's Browser
       │
       ▼
┌─────────────────────┐
│   Vercel (free)     │  ← Next.js frontend + API routes
│                     │
│  /api/rag           │  ← embeds query, retrieves, generates
│  /api/tts           │  ← converts sentence to audio
│  /api/ingest        │  ← one-time knowledge base seeding
└────────┬────────────┘
         │
    ┌────┴────┐
    │         │
    ▼         ▼
Supabase   LiteLLM Proxy (Render free)
pgvector   ┌────────────────────────┐
(free)     │  Groq  → primary       │
           │  Gemini → fallback 1   │
           │  Grok  → fallback 2    │
           └────────────────────────┘
```

---

## Step 1 — Knowledge Base

### What content to include

| Category | Priority | Why |
|----------|----------|-----|
| Projects | Must-have | #1 most asked about |
| Work experience | Must-have | Recruiters always ask |
| Skills & tools | Must-have | "Do you know X?" |
| About / bio | Must-have | "Tell me about yourself" |
| FAQs | Nice-to-have | Pre-written = perfect retrieval |
| Blog posts | Nice-to-have | Shows depth of thinking |
| Education | Nice-to-have | Rarely retrieved but needed |
| Contact & links | Nice-to-have | "How do I reach you?" |

### JSON Format for Each Entry

```json
{
  "id": "proj_01",
  "type": "project",
  "title": "Real-time Delivery Tracker",
  "summary": "A live map dashboard for a logistics startup showing driver locations.",
  "problem": "Dispatchers had no visibility into driver locations.",
  "stack": ["React", "Node.js", "Socket.io", "Mapbox"],
  "role": "Solo full-stack developer",
  "outcome": "Reduced dispatch calls by 40%",
  "url": "https://github.com/you/tracker",
  "content": "Real-time Delivery Tracker. A live map dashboard for a logistics startup. Built with React, Node.js, Socket.io and Mapbox. Reduced dispatch calls by 40%."
}
```

> **Key rule:** Always add a `content` field that merges all text into one string. This is what gets embedded for search.

### Chunking Rules

```
✅ One concept per chunk
✅ ~300 tokens per chunk
✅ Add metadata (type, tags, date)
❌ Never mix bio + skills in one chunk
❌ Never dump full blog posts (summarise instead)
```

### Generate Embeddings

```bash
npm install openai @supabase/supabase-js
```

```javascript
// scripts/ingest.js
import OpenAI from 'openai';
import { createClient } from '@supabase/supabase-js';
import knowledge from './knowledge-base.json' assert { type: 'json' };

const openai = new OpenAI();
const supabase = createClient(process.env.SUPABASE_URL, process.env.SUPABASE_SERVICE_KEY);

for (const entry of knowledge) {
  const { data } = await openai.embeddings.create({
    model: 'text-embedding-3-small',   // cheapest, great quality
    input: entry.content,
  });

  await supabase.from('knowledge').upsert({
    id: entry.id,
    type: entry.type,
    title: entry.title,
    content: entry.content,
    embedding: data[0].embedding,
  });

  console.log(`✅ Embedded: ${entry.title}`);
}
```

---

## Step 2 — RAG Pipeline

```
User Question
      │
      ▼
Embed the query (same model as knowledge base)
      │
      ▼
Cosine similarity search in Supabase pgvector
      │  (returns top 3 most relevant chunks)
      ▼
Build augmented prompt:
  [System: you are a portfolio assistant]
  [Context: chunk1 + chunk2 + chunk3]
  [User: original question]
      │
      ▼
Send to LiteLLM → Groq / Gemini / Grok
      │
      ▼
Stream answer token by token
```

### Supabase Setup

```sql
-- Run once in Supabase SQL editor
create extension if not exists vector;

create table knowledge (
  id        text primary key,
  type      text,
  title     text,
  content   text,
  embedding vector(1536)
);

-- Fast similarity search index
create index on knowledge
  using ivfflat (embedding vector_cosine_ops)
  with (lists = 10);
```

### RAG API Route

```javascript
// app/api/rag/route.js
import OpenAI from 'openai';
import { createClient } from '@supabase/supabase-js';

const openai = new OpenAI({ baseURL: 'http://localhost:4000/v1', apiKey: 'sk-anything' });
const supabase = createClient(process.env.SUPABASE_URL, process.env.SUPABASE_SERVICE_KEY);

export async function POST(req) {
  const { query } = await req.json();

  // Step 1: Embed the user's question
  const embedRes = await openai.embeddings.create({
    model: 'text-embedding-3-small',
    input: query,
  });
  const queryEmbedding = embedRes.data[0].embedding;

  // Step 2: Find top 3 relevant chunks
  const { data: chunks } = await supabase.rpc('match_knowledge', {
    query_embedding: queryEmbedding,
    match_count: 3,
  });

  const context = chunks.map(c => c.content).join('\n\n');

  // Step 3: Generate answer (streaming)
  const stream = await openai.chat.completions.create({
    model: 'chat',
    stream: true,
    messages: [
      {
        role: 'system',
        content: `You are a helpful assistant for a developer's portfolio.
Answer only based on the context provided. Be conversational and friendly.
Context:\n${context}`,
      },
      { role: 'user', content: query },
    ],
  });

  // Step 4: Stream back to frontend
  return new Response(stream.toReadableStream());
}
```

---

## Step 3 — Voice Mode (Streaming TTS)

### Why Low Latency Matters

```
❌ Bad approach:  Wait for full answer → send all text → TTS → 5-8 sec delay
✅ Good approach: First sentence ready → TTS immediately → user hears in ~0.8 sec
```

### How It Works

```
RAG streams tokens
       │
       ▼
Sentence Chunker  ← splits on  .  ?  !
  (collects tokens until sentence complete)
       │
       ▼  (fires immediately, doesn't wait for full answer)
TTS API  ← OpenAI tts-1 (~300ms per sentence)
       │
       ▼
Browser Audio Queue  ← plays chunks back-to-back, no gaps
       │
       ▼
User hears natural speech  ← ~0.8 sec from question to first word
```

### Sentence Chunker

```javascript
// utils/sentenceChunker.js
export function createSentenceChunker(onSentence) {
  let buffer = '';

  return function push(token) {
    buffer += token;
    const match = buffer.match(/^(.*?[.?!])\s+([\s\S]*)$/);
    if (match) {
      onSentence(match[1].trim());  // fire complete sentence
      buffer = match[2];            // keep remainder
    }
  };
}

export function flush(buffer, onSentence) {
  if (buffer.trim()) onSentence(buffer.trim());
}
```

### TTS API Route

```javascript
// app/api/tts/route.js
import OpenAI from 'openai';
const client = new OpenAI();

export async function POST(req) {
  const { text } = await req.json();

  const audio = await client.audio.speech.create({
    model: 'tts-1',       // fastest | use tts-1-hd for better quality
    voice: 'nova',        // options: alloy | echo | fable | onyx | nova | shimmer
    input: text,
    response_format: 'mp3',
  });

  const buffer = Buffer.from(await audio.arrayBuffer());
  return new Response(buffer, {
    headers: { 'Content-Type': 'audio/mpeg' },
  });
}
```

### Audio Queue (No Gaps Between Sentences)

```javascript
// utils/audioQueue.js
export function createAudioQueue() {
  const ctx = new AudioContext();
  let nextStartTime = ctx.currentTime;

  async function enqueue(arrayBuffer) {
    const decoded = await ctx.decodeAudioData(arrayBuffer);
    const source = ctx.createBufferSource();
    source.buffer = decoded;
    source.connect(ctx.destination);
    const startAt = Math.max(nextStartTime, ctx.currentTime);
    source.start(startAt);
    nextStartTime = startAt + decoded.duration;  // chain with no gap
  }

  function stop() { ctx.close(); }

  return { enqueue, stop };
}
```

### Voice Button Component

```jsx
// components/VoiceButton.jsx
import { useState, useRef } from 'react';
import { createSentenceChunker, flush } from '../utils/sentenceChunker';
import { createAudioQueue } from '../utils/audioQueue';

export default function VoiceButton({ query }) {
  const [active, setActive] = useState(false);
  const queueRef = useRef(null);

  async function handleClick() {
    if (active) {
      queueRef.current?.stop();
      setActive(false);
      return;
    }
    setActive(true);

    const queue = createAudioQueue();  // must create inside click handler
    queueRef.current = queue;

    const chunker = createSentenceChunker(async (sentence) => {
      const res = await fetch('/api/tts', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ text: sentence }),
      });
      const buf = await res.arrayBuffer();
      queue.enqueue(buf);
    });

    // Stream RAG answer and push tokens to chunker
    const res = await fetch('/api/rag', {
      method: 'POST',
      body: JSON.stringify({ query }),
    });

    const reader = res.body.getReader();
    const decoder = new TextDecoder();
    let remainder = '';

    while (true) {
      const { done, value } = await reader.read();
      if (done) {
        flush(remainder, async (s) => {
          const r = await fetch('/api/tts', { method: 'POST', body: JSON.stringify({ text: s }) });
          queue.enqueue(await r.arrayBuffer());
        });
        break;
      }
      const token = decoder.decode(value, { stream: true });
      remainder += token;
      chunker(token);
    }

    setActive(false);
  }

  return (
    <button
      onClick={handleClick}
      style={{
        padding: '8px 20px',
        borderRadius: '20px',
        border: '1px solid currentColor',
        background: active ? '#534AB7' : 'transparent',
        color: active ? 'white' : 'inherit',
        cursor: 'pointer',
        fontSize: '14px',
      }}
    >
      {active ? '⏹ Stop' : '🔊 Read aloud'}
    </button>
  );
}
```

> **Gotcha:** Always create `AudioContext` inside the click handler — browsers block it if created on page load.

---

## Step 4 — LiteLLM (Free Multi-Provider Gateway)

### What Is LiteLLM?

```
Without LiteLLM:           With LiteLLM:
                           
Your App → Groq API        Your App → LiteLLM → Groq   (primary)
Your App → Gemini API                         → Gemini (if Groq busy)
Your App → Grok API                           → Grok   (last backup)

3 different code formats    1 format, auto-switching
Manual fallback logic       Automatic fallback
```

Think of it as **one plug for all AI providers**.

### Free Tier Limits (All Three Combined)

| Provider | Free RPM | Free RPD | Notes |
|----------|----------|----------|-------|
| **Groq** | 30 req/min | 14,400/day | Fastest inference |
| **Gemini 2.5 Flash** | 10 req/min | 1,500/day | High quality |
| **Grok (xAI)** | — | 10,000/month | Good fallback |

Combined = handles **50+ concurrent portfolio visitors** for free.

### LiteLLM Config File

```yaml
# config.yaml
model_list:
  # Primary: Groq (fastest, 30 RPM free)
  - model_name: chat
    litellm_params:
      model: groq/mixtral-8x7b-32768
      api_key: ${GROQ_API_KEY}

  # Fallback 1: Gemini (10 RPM free)
  - model_name: chat
    litellm_params:
      model: gemini/gemini-2.5-flash
      api_key: ${GEMINI_API_KEY}

  # Fallback 2: Grok (10K calls/month free)
  - model_name: chat
    litellm_params:
      model: xai/grok-2
      api_key: ${XAI_API_KEY}

router_settings:
  routing_strategy: usage-based-routing-v2
  fallbacks:
    - groq/mixtral-8x7b-32768:
        - gemini/gemini-2.5-flash
        - xai/grok-2
    - gemini/gemini-2.5-flash:
        - xai/grok-2
  num_retries: 2
```

### Run LiteLLM

```bash
# Install
pip install litellm[proxy]

# Run locally (development)
litellm --config config.yaml --port 4000

# Your app now calls:
# http://localhost:4000/v1  ← instead of any provider directly
```

### Docker (for deployment)

```dockerfile
# Dockerfile
FROM python:3.11-slim
RUN pip install litellm[proxy]
COPY config.yaml .
EXPOSE 4000
CMD ["litellm", "--config", "config.yaml", "--port", "4000"]
```

---

## Step 5 — Deployment

### Where Everything Lives

```
┌─────────────────────────────────────────────┐
│                   Vercel (free)             │
│  ┌──────────────┐   ┌────────────────────┐  │
│  │  Next.js UI  │   │   API Routes       │  │
│  │  chat widget │   │  /api/rag          │  │
│  │  voice button│   │  /api/tts          │  │
│  └──────────────┘   │  /api/ingest       │  │
│                     └────────────────────┘  │
└───────────────┬─────────────────────────────┘
                │
       ┌────────┴────────┐
       │                 │
       ▼                 ▼
Supabase (free)    Render (free)
pgvector DB        LiteLLM Proxy
500 MB storage     Docker container
```

### Step-by-Step Deployment

#### 1. Supabase — Vector Database

```bash
# Go to supabase.com → New project → SQL Editor → run:

create extension if not exists vector;

create table knowledge (
  id        text primary key,
  type      text,
  title     text,
  content   text,
  embedding vector(1536)
);

create index on knowledge
  using ivfflat (embedding vector_cosine_ops)
  with (lists = 10);
```

Copy your **Project URL** and **service_role key** from Settings → API.

#### 2. Scaffold Next.js Project

```bash
npx create-next-app@latest my-portfolio \
  --typescript --tailwind --app

cd my-portfolio
npm install openai @supabase/supabase-js ai
```

#### 3. Set Environment Variables

Create `.env.local` locally:

```env
OPENAI_API_KEY=sk-...
SUPABASE_URL=https://xxxx.supabase.co
SUPABASE_SERVICE_KEY=eyJ...
GROQ_API_KEY=gsk_...
GEMINI_API_KEY=AIza...
XAI_API_KEY=xai-...
INGEST_SECRET=any-random-string
```

> ⚠️ Add `.env.local` to `.gitignore` — never commit API keys.

In Vercel dashboard → Project → Settings → Environment Variables → add the same keys.

#### 4. Deploy to Vercel

```bash
npm install -g vercel
vercel          # first deploy
vercel --prod   # production deploy
```

Or connect GitHub repo → every push to `main` auto-deploys.

#### 5. Deploy LiteLLM to Render

```
1. Go to render.com → New → Web Service
2. Connect your GitHub repo (with Dockerfile)
3. Set environment variables (GROQ_API_KEY, GEMINI_API_KEY, XAI_API_KEY)
4. Deploy → copy your Render URL (e.g. https://litellm-xxx.onrender.com)
5. Update LITELLM_BASE_URL in Vercel env vars
```

#### 6. Seed the Knowledge Base (One Time)

```bash
# After deploying, run this once:
curl -X POST https://your-project.vercel.app/api/ingest \
  -H "Content-Type: application/json" \
  -H "x-ingest-secret: your-ingest-secret" \
  -d @knowledge-base.json

# Expected response:
# { "inserted": 24 }
```

Re-run whenever you update your portfolio content.

#### 7. Verify Everything Works

```bash
# Test RAG answer
curl -X POST https://your-project.vercel.app/api/rag \
  -H "Content-Type: application/json" \
  -d '{"query": "What projects have you built?"}'

# Test TTS (saves to test.mp3)
curl -X POST https://your-project.vercel.app/api/tts \
  -H "Content-Type: application/json" \
  -d '{"text": "Hello, I am your portfolio assistant."}' \
  --output test.mp3
```

---

## Cost Breakdown

### Monthly estimate for a personal portfolio (~500 queries/month)

| Service | Free Tier | Cost |
|---------|-----------|------|
| Vercel (frontend + API) | Unlimited for personal | **$0** |
| Supabase (pgvector) | 500 MB, forever free | **$0** |
| Render (LiteLLM proxy) | 750 hours/month free | **$0** |
| Groq API (LLM) | 14,400 req/day free | **$0** |
| Gemini API (fallback) | 1,500 req/day free | **$0** |
| Grok API (fallback) | 10,000 req/month free | **$0** |
| OpenAI TTS (`tts-1`) | $0.015 per 1K chars | **~$2.25** |
| OpenAI Embeddings | $0.02 per 1M tokens | **~$0.01** |

**Total: ~$2–3/month** (only TTS has a cost, everything else is free)

> To make TTS free too: use **Piper TTS** (open source, self-hosted on Render free tier).

---

## Final File Structure

```
my-portfolio/
├── app/
│   ├── page.tsx                  ← main portfolio page
│   ├── api/
│   │   ├── rag/route.ts          ← RAG pipeline
│   │   ├── tts/route.ts          ← text to speech
│   │   └── ingest/route.ts       ← knowledge base seeding
│   └── components/
│       ├── ChatWidget.tsx         ← chat UI
│       └── VoiceButton.tsx        ← voice mode button
├── utils/
│   ├── sentenceChunker.js        ← splits stream into sentences
│   └── audioQueue.js             ← plays audio chunks in order
├── data/
│   └── knowledge-base.json       ← your portfolio content
├── litellm/
│   ├── config.yaml               ← Groq + Gemini + Grok config
│   └── Dockerfile                ← for Render deployment
├── scripts/
│   └── ingest.js                 ← run once to seed Supabase
├── .env.local                    ← API keys (never commit!)
├── .gitignore
└── package.json
```

---

## Quick Reference — All Free Tier Limits

```
Groq:    30 req/min  |  14,400 req/day   |  No credit card
Gemini:  10 req/min  |   1,500 req/day   |  No credit card
Grok:     — req/min  |  10,000 req/month |  No credit card
Vercel:  Unlimited deployments for personal projects
Supabase: 500 MB database, forever free
Render:  750 hours/month free (enough for 1 always-on service)
```

---

*Built with Next.js · LiteLLM · Supabase pgvector · OpenAI TTS · Groq · Gemini · Vercel · Render*