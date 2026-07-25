#!/usr/bin/env python3
"""
sync_knowledge.py — Auto-syncs portfolio knowledge base from two sources:

  1. src/content/*.jsx  → reads your frontend data (projects, experience, profile)
     and generates the corresponding .md files in backend/knowledge/

  2. GitHub API         → fetches your public repos and appends them to projects.md
     (reads public repos — no token required)

  3. src/content/blog/  → reads any blog post files and updates blogs.md

Run manually:    python scripts/sync_knowledge.py
Auto-run:        GitHub Action triggers this on every push to main

After updating knowledge files, call POST /reload on the backend to
re-index the RAG without restarting the server.
"""

import json
import os
import re
import sys
import urllib.request
import urllib.error
from pathlib import Path
from datetime import datetime

# ── Paths ─────────────────────────────────────────────────
REPO_ROOT     = Path(__file__).resolve().parent.parent
KNOWLEDGE_DIR = REPO_ROOT / "backend" / "knowledge"
CONTENT_DIR   = REPO_ROOT / "src" / "content"
BLOG_DIR      = CONTENT_DIR / "blog"

GITHUB_USERNAME = "Rawdyrathaur"
BACKEND_URL     = os.getenv("BACKEND_URL", "https://msrathaur-manish-portfolio-api.hf.space")
RELOAD_SECRET   = os.getenv("RAG_RELOAD_SECRET", "")   # Set this in GitHub Secrets

KNOWLEDGE_DIR.mkdir(parents=True, exist_ok=True)

print(f"[sync] Starting knowledge base sync — {datetime.now().strftime('%Y-%m-%d %H:%M:%S')}")
print(f"[sync] Knowledge dir: {KNOWLEDGE_DIR}")


# ══════════════════════════════════════════════════════════
#  HELPER: Safe HTTP GET
# ══════════════════════════════════════════════════════════

def http_get(url: str, headers: dict = None) -> dict | list | None:
    req = urllib.request.Request(url, headers=headers or {})
    req.add_header("User-Agent", "portfolio-rag-sync/1.0")
    try:
        with urllib.request.urlopen(req, timeout=10) as resp:
            return json.loads(resp.read().decode())
    except Exception as e:
        print(f"[sync] HTTP GET failed for {url}: {e}")
        return None


# ══════════════════════════════════════════════════════════
#  STEP 1: Fetch GitHub public repos
# ══════════════════════════════════════════════════════════

def fetch_github_repos() -> list[dict]:
    print(f"[sync] Fetching GitHub repos for @{GITHUB_USERNAME}...")
    url  = f"https://api.github.com/users/{GITHUB_USERNAME}/repos?per_page=100&sort=updated"
    data = http_get(url)
    if not data:
        print("[sync] Could not fetch GitHub repos — skipping")
        return []

    repos = []
    for r in data:
        if r.get("fork"):          # skip forks
            continue
        if r.get("private"):       # skip private (shouldn't appear but just in case)
            continue
        repos.append({
            "name":        r.get("name", ""),
            "description": r.get("description") or "",
            "language":    r.get("language") or "Not specified",
            "stars":       r.get("stargazers_count", 0),
            "url":         r.get("html_url", ""),
            "topics":      r.get("topics", []),
            "updated":     r.get("updated_at", "")[:10],
        })

    print(f"[sync] Found {len(repos)} public repos (non-fork)")
    return repos


# ══════════════════════════════════════════════════════════
#  STEP 2: Sync about.md from profile.jsx
# ══════════════════════════════════════════════════════════

def sync_about():
    """about.md is maintained manually — skip auto-overwrite to preserve hand-crafted content."""
    about_path = KNOWLEDGE_DIR / "about.md"
    if about_path.exists():
        print("[sync] about.md exists — skipping (manually maintained)")
    else:
        print("[sync] about.md missing — creating default")
        about_path.write_text("""# About Manish Singh Rathaur

## Who is Manish
Manish Singh Rathaur is a Final Year B.Tech student in Computer Science and Engineering
at Graphic Era Hill University, Bhimtal, Uttarakhand. Graduating July 2026.
Actively seeking full-time software engineering roles.

## Contact
Email: manish.rathaur.dev@gmail.com
GitHub: https://github.com/Rawdyrathaur
LinkedIn: https://www.linkedin.com/in/manish-rathaur-80b40b24a/
Portfolio: https://www.manishrathaur.tech/
""", encoding="utf-8")


# ══════════════════════════════════════════════════════════
#  STEP 3: Sync projects.md — keep curated + append GitHub repos
# ══════════════════════════════════════════════════════════

# Projects already covered in the hand-crafted knowledge base (skip to avoid duplicates)
KNOWN_PROJECTS = {"tab_story", "tab story", "omnisupport", "omnisupport-ai", "carbon_pulse", "carbon pulse"}

def repo_is_known(repo_name: str) -> bool:
    name_lower = repo_name.lower().replace("-", "_").replace(" ", "_")
    return any(kw in name_lower for kw in KNOWN_PROJECTS)


def sync_projects(repos: list[dict]):
    projects_path = KNOWLEDGE_DIR / "projects.md"

    # Read existing content (keep the curated projects, trim GitHub auto-section)
    existing = ""
    if projects_path.exists():
        existing = projects_path.read_text(encoding="utf-8")
        # Remove old auto-generated block if any
        marker = "\n\n---\n\n## GitHub Repositories (Auto-Synced)"
        if marker in existing:
            existing = existing[:existing.index(marker)]

    # Build GitHub repos section for repos not already covered
    new_repos = [r for r in repos if not repo_is_known(r["name"])]

    github_section = ""
    if new_repos:
        lines = ["\n\n---\n\n## GitHub Repositories (Auto-Synced)\n"]
        lines.append(f"*Last updated: {datetime.now().strftime('%Y-%m-%d')}*\n")
        for r in new_repos:
            lines.append(f"\n### {r['name']}")
            if r["description"]:
                lines.append(r["description"])
            lines.append(f"- Language: {r['language']}")
            if r["topics"]:
                lines.append(f"- Topics: {', '.join(r['topics'])}")
            lines.append(f"- Stars: {r['stars']}")
            lines.append(f"- GitHub: {r['url']}")
            lines.append(f"- Last updated: {r['updated']}")
        github_section = "\n".join(lines)
        print(f"[sync] Appending {len(new_repos)} additional GitHub repos to projects.md")
    else:
        print("[sync] No new GitHub repos to append (all already covered)")

    projects_path.write_text(existing + github_section, encoding="utf-8")
    print(f"[sync] projects.md synced")


# ══════════════════════════════════════════════════════════
#  STEP 4: Sync blogs.md from src/content/blog/
# ══════════════════════════════════════════════════════════

def extract_blog_frontmatter(content: str) -> dict:
    """Very simple frontmatter extractor for --- delimited YAML or export const."""
    meta = {"title": "", "date": "", "tags": [], "summary": ""}

    # Try --- YAML frontmatter
    if content.startswith("---"):
        end = content.find("---", 3)
        if end > 0:
            fm = content[3:end]
            for line in fm.splitlines():
                if ":" in line:
                    key, _, val = line.partition(":")
                    key = key.strip().lower()
                    val = val.strip().strip('"').strip("'")
                    if key in meta:
                        meta[key] = val
            meta["body"] = content[end + 3:].strip()
            return meta

    # Fallback: just use the raw content
    meta["body"] = content
    return meta


def sync_blogs():
    blogs_path = KNOWLEDGE_DIR / "blogs.md"

    if not BLOG_DIR.exists():
        print("[sync] No blog directory found — keeping existing blogs.md")
        return

    blog_files = sorted(BLOG_DIR.glob("*.md")) + sorted(BLOG_DIR.glob("*.mdx"))

    if not blog_files:
        print("[sync] No blog posts found — keeping existing blogs.md")
        return

    print(f"[sync] Found {len(blog_files)} blog posts")

    lines = ["# Manish's Blog Posts\n"]
    lines.append(f"*Auto-synced on {datetime.now().strftime('%Y-%m-%d')}*\n")
    lines.append(f"Manish has published {len(blog_files)} blog post(s). Read them at https://www.manishrathaur.tech/blog\n")

    for bf in blog_files:
        content = bf.read_text(encoding="utf-8")
        meta    = extract_blog_frontmatter(content)
        title   = meta.get("title") or bf.stem.replace("-", " ").replace("_", " ").title()
        date    = meta.get("date", "")
        tags    = meta.get("tags", [])
        summary = meta.get("summary", "")
        body    = meta.get("body", "")[:600]   # first 600 chars for RAG context

        lines.append(f"\n## Blog Post: {title}")
        if date:
            lines.append(f"Published: {date}")
        if tags:
            tags_str = ", ".join(tags) if isinstance(tags, list) else tags
            lines.append(f"Tags: {tags_str}")
        if summary:
            lines.append(f"\n{summary}")
        if body:
            lines.append(f"\n{body}")
        lines.append(f"\nRead full post: https://www.manishrathaur.tech/blog/{bf.stem}")

    blogs_path.write_text("\n".join(lines), encoding="utf-8")
    print(f"[sync] blogs.md synced with {len(blog_files)} posts")


# ══════════════════════════════════════════════════════════
#  STEP 5: Call /reload on the backend
# ══════════════════════════════════════════════════════════

def trigger_reload():
    print(f"[sync] Triggering RAG reload at {BACKEND_URL}/reload ...")
    headers = {"Content-Type": "application/json"}
    if RELOAD_SECRET:
        headers["X-Reload-Secret"] = RELOAD_SECRET

    req = urllib.request.Request(
        f"{BACKEND_URL}/reload",
        data=b"{}",
        headers=headers,
        method="POST",
    )
    try:
        with urllib.request.urlopen(req, timeout=30) as resp:
            result = json.loads(resp.read().decode())
            print(f"[sync] ✅ Reload successful — {result.get('chunks', '?')} chunks indexed")
    except Exception as e:
        print(f"[sync] ⚠️  Reload call failed: {e}")
        print("[sync] The knowledge files were updated but the backend may need a manual restart.")


# ══════════════════════════════════════════════════════════
#  MAIN
# ══════════════════════════════════════════════════════════

def main():
    repos = fetch_github_repos()

    sync_about()
    sync_projects(repos)
    sync_blogs()

    # contact.md and experience.md are manually maintained — no auto-overwrite
    for static_file in ["contact.md", "experience.md", "skills.md"]:
        path = KNOWLEDGE_DIR / static_file
        if not path.exists():
            print(f"[sync] WARNING: {static_file} is missing from knowledge/")

    trigger_reload()

    print(f"\n[sync] ✅ Sync complete — {datetime.now().strftime('%H:%M:%S')}")


if __name__ == "__main__":
    main()
