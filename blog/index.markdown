---
layout: home
title: "Manish's Coding Journey"
---

<!-- Back Link Portal -->
<a class="back-link" href="https://manishrathaur.tech" target="_blank" style="display: inline-flex; align-items: center; gap: 0.45rem; color: silver !important; text-decoration: none !important; font-size: 0.82rem; margin-bottom: 2rem; font-family: -apple-system, BlinkMacSystemFont, sans-serif;">
  <i class="fas fa-arrow-left" style="font-size: 0.72rem;"></i> Back to manishrathaur.tech
</a>

<!-- Topic Matrix Heading Configuration -->
<p class="section-heading" style="font-size: 0.72rem; letter-spacing: 3px; text-transform: uppercase; color: #00b1c9; margin: 0 0 1.5rem; padding-bottom: 0.6rem; border-bottom: 1px solid rgba(0,177,201,0.25); font-family: monospace;">Browse by Topic</p>

<!-- Modular Topics Category Layout Grid System -->
<div class="categories-grid" style="display: grid; grid-template-columns: repeat(auto-fill, minmax(145px, 1fr)); gap: 0.8rem; margin-bottom: 2.5rem;">
  
  <a class="cat-card" href="{{ '/categories/#python' | relative_url }}" style="background: rgba(255,255,255,0.03) !important; border: 1px solid rgba(255,255,255,0.08) !important; border-radius: 6px; padding: 1.3rem 0.9rem 1rem; text-align: center; text-decoration: none !important; display: block;">
    <span style="color: #3776AB; font-size: 1.6rem; display: block;"><i class="fab fa-python"></i></span>
    <span class="cat-name" style="font-size: 0.83rem; font-weight: 600; color: lightgrey; display: block; margin-top: 0.5rem; font-family: -apple-system, BlinkMacSystemFont, sans-serif;">Python</span>
    <span class="cat-count" style="font-size: 0.67rem; color: silver; font-family: -apple-system, BlinkMacSystemFont, sans-serif;">{{ site.categories['python'].size | default: 0 }} posts</span>
  </a>

  <a class="cat-card" href="{{ '/categories/#dsa' | relative_url }}" style="background: rgba(255,255,255,0.03) !important; border: 1px solid rgba(255,255,255,0.08) !important; border-radius: 6px; padding: 1.3rem 0.9rem 1rem; text-align: center; text-decoration: none !important; display: block;">
    <span style="color: #00b1c9; font-size: 1.6rem; display: block;"><i class="fas fa-project-diagram"></i></span>
    <span class="cat-name" style="font-size: 0.83rem; font-weight: 600; color: lightgrey; display: block; margin-top: 0.5rem; font-family: -apple-system, BlinkMacSystemFont, sans-serif;">DSA</span>
    <span class="cat-count" style="font-size: 0.67rem; color: silver; font-family: -apple-system, BlinkMacSystemFont, sans-serif;">{{ site.categories['dsa'].size | default: 0 }} posts</span>
  </a>

  <a class="cat-card" href="{{ '/categories/#machine-learning' | relative_url }}" style="background: rgba(255,255,255,0.03) !important; border: 1px solid rgba(255,255,255,0.08) !important; border-radius: 6px; padding: 1.3rem 0.9rem 1rem; text-align: center; text-decoration: none !important; display: block;">
    <span style="color: #ec4899; font-size: 1.6rem; display: block;"><i class="fas fa-brain"></i></span>
    <span class="cat-name" style="font-size: 0.83rem; font-weight: 600; color: lightgrey; display: block; margin-top: 0.5rem; font-family: -apple-system, BlinkMacSystemFont, sans-serif;">Machine Learning</span>
    <span class="cat-count" style="font-size: 0.67rem; color: silver; font-family: -apple-system, BlinkMacSystemFont, sans-serif;">{{ site.categories['machine-learning'].size | default: 0 }} posts</span>
  </a>

  <a class="cat-card" href="{{ '/categories/#web-development' | relative_url }}" style="background: rgba(255,255,255,0.03) !important; border: 1px solid rgba(255,255,255,0.08) !important; border-radius: 6px; padding: 1.3rem 0.9rem 1rem; text-align: center; text-decoration: none !important; display: block;">
    <span style="color: #10b981; font-size: 1.6rem; display: block;"><i class="fas fa-code"></i></span>
    <span class="cat-name" style="font-size: 0.83rem; font-weight: 600; color: lightgrey; display: block; margin-top: 0.5rem; font-family: -apple-system, BlinkMacSystemFont, sans-serif;">Web Dev</span>
    <span class="cat-count" style="font-size: 0.67rem; color: silver; font-family: -apple-system, BlinkMacSystemFont, sans-serif;">{{ site.categories['web-development'].size | default: 0 }} posts</span>
  </a>

</div>

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
