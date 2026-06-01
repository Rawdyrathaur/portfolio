---
layout: home
title: "Manish's Coding Journey"
---

<!-- Back Link Portal -->
<a class="back-link" href="https://manishrathaur.tech" target="_blank" style="display: inline-flex; align-items: center; gap: 0.45rem; color: silver !important; text-decoration: none !important; font-size: 0.82rem; margin-bottom: 2rem; font-family: -apple-system, BlinkMacSystemFont, sans-serif;">
  <i class="fas fa-arrow-left" style="font-size: 0.72rem;"></i> Back to manishrathaur.tech
</a>

<!-- Browse by Topic removed -->

<!-- Recent Posts Publications Layer -->
<p class="section-heading" style="font-size: 0.7rem; letter-spacing: 2.5px; text-transform: uppercase; color: #00b1c9; margin: 2.5rem 0 1.5rem; padding-bottom: 0.6rem; border-bottom: 1px solid rgba(0,177,201,0.25); font-family: monospace;">Recent Publications</p>

<div class="posts-list" style="display: flex; flex-direction: column; border: 1px solid rgba(255,255,255,0.08); border-radius: 6px; overflow: hidden; margin-bottom: 3rem;">
  {% for post in site.posts limit: 5 %}
    <a href="{{ post.url | relative_url }}" style="display: block; padding: 1rem; text-decoration: none !important; border-bottom: 1px solid rgba(255,255,255,0.08); background: transparent; transition: background 0.2s;">
      <span style="font-size: 0.95rem; font-weight: 600; color: lightgrey; display: block; margin-bottom: 0.25rem; font-family: -apple-system, BlinkMacSystemFont, sans-serif;">{{ post.title }}</span>
      <span style="font-size: 0.72rem; color: #666; font-family: monospace;">{{ post.date | date: "%B %d, %Y" }}</span>
    </a>
  {% else %}
    <div style="color: #555; font-style: italic; text-align: center; padding: 2rem; font-family: -apple-system, BlinkMacSystemFont, sans-serif;">No logs written yet. New publications coming soon!</div>
  {% endfor %}
</div>
