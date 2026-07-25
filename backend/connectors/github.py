import os
import logging
import requests

logger = logging.getLogger(__name__)

GITHUB_USERNAME = "Rawdyrathaur"
GITHUB_API_URL = "https://api.github.com"

def get_github_chunks() -> list[dict]:
    """
    Fetches GitHub profile and top repositories for the user,
    formatting them as RAG chunks.
    """
    token = os.getenv("GITHUB_TOKEN")
    headers = {}
    if token:
        headers["Authorization"] = f"token {token}"
        
    chunks = []
    
    try:
        # 1. Fetch user profile
        user_resp = requests.get(f"{GITHUB_API_URL}/users/{GITHUB_USERNAME}", headers=headers)
        if user_resp.status_code == 200:
            user_data = user_resp.json()
            profile_text = f"GitHub Profile: {user_data.get('name', GITHUB_USERNAME)}\n"
            profile_text += f"Bio: {user_data.get('bio', '')}\n"
            profile_text += f"Followers: {user_data.get('followers', 0)}\n"
            profile_text += f"Public Repos: {user_data.get('public_repos', 0)}\n"
            profile_text += f"Company: {user_data.get('company', '')}\n"
            profile_text += f"Location: {user_data.get('location', '')}\n"
            
            chunks.append({
                "id": f"github_profile::{GITHUB_USERNAME}",
                "text": profile_text.strip(),
                "source": "github_profile",
                "heading": "GitHub Profile",
                "title": f"{GITHUB_USERNAME} Profile",
                "type": "profile",
                "url": user_data.get('html_url', f"https://github.com/{GITHUB_USERNAME}"),
                "source_type": "github",
                "content_type": "profile",
                "visibility": "public",
                "trust_level": "verified",
                "timestamp": user_data.get("updated_at", ""),
                "last_updated": user_data.get("updated_at", "")
            })
            
        # 2. Fetch public repos
        repos_resp = requests.get(f"{GITHUB_API_URL}/users/{GITHUB_USERNAME}/repos?sort=stargazers_count&direction=desc&per_page=10", headers=headers)
        if repos_resp.status_code == 200:
            repos_data = repos_resp.json()
            for repo in repos_data:
                if repo.get("fork"): continue # Skip forks if you prefer, or leave them
                
                repo_text = f"Repository: {repo.get('name')}\n"
                repo_text += f"Description: {repo.get('description', '')}\n"
                repo_text += f"Language: {repo.get('language', '')}\n"
                repo_text += f"Stars: {repo.get('stargazers_count', 0)}\n"
                repo_text += f"Topics: {', '.join(repo.get('topics', []))}\n"
                
                chunks.append({
                    "id": f"github_repo::{repo.get('name')}",
                    "text": repo_text.strip(),
                    "source": "github_repos",
                    "heading": f"Repo: {repo.get('name')}",
                    "title": repo.get("name"),
                    "type": "repo",
                    "url": repo.get('html_url', ''),
                    "source_type": "github",
                    "content_type": "repo",
                    "visibility": "public",
                    "trust_level": "verified",
                    "timestamp": repo.get("updated_at", ""),
                    "last_updated": repo.get("updated_at", "")
                })
    except Exception as e:
        logger.warning(f"Failed to fetch GitHub data: {e}")
        
    return chunks
