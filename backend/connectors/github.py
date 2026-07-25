import os
import time
import jwt
import logging
import requests

logger = logging.getLogger(__name__)

GITHUB_USERNAME = "Rawdyrathaur"
GITHUB_API_URL = "https://api.github.com"

def get_installation_token() -> str:
    """Generate a GitHub App installation access token using JWT."""
    app_id = os.getenv("GITHUB_APP_ID")
    private_key = os.getenv("GITHUB_PRIVATE_KEY")
    installation_id = os.getenv("GITHUB_INSTALLATION_ID")
    
    # Fallback to standard token if app details are missing
    if not (app_id and private_key and installation_id):
        token = os.getenv("GITHUB_TOKEN")
        if token:
            logger.info("Using standard GITHUB_TOKEN fallback.")
            return token
        logger.warning("No GitHub credentials found in environment.")
        return ""

    logger.info(f"Generating GitHub App token for app {app_id}, installation {installation_id}...")
    
    # Fix private key formatting if passed via single-line env var
    if "-----BEGIN" in private_key and "\n" not in private_key:
        private_key = private_key.replace("\\n", "\n")

    # Generate JWT
    now = int(time.time())
    payload = {
        "iat": now - 60,
        "exp": now + (10 * 60),
        "iss": app_id
    }
    encoded_jwt = jwt.encode(payload, private_key, algorithm="RS256")
    
    # Exchange JWT for installation token
    headers = {
        "Authorization": f"Bearer {encoded_jwt}",
        "Accept": "application/vnd.github.v3+json"
    }
    resp = requests.post(
        f"{GITHUB_API_URL}/app/installations/{installation_id}/access_tokens",
        headers=headers
    )
    
    if resp.status_code == 201:
        return resp.json().get("token", "")
    
    logger.error(f"Failed to generate installation token: {resp.status_code} {resp.text}")
    return ""


def format_repo_chunk(repo: dict) -> dict:
    """Format a single GitHub repository into a RAG chunk."""
    repo_text = f"Repository: {repo.get('name')}\n"
    repo_text += f"Description: {repo.get('description', '')}\n"
    repo_text += f"Language: {repo.get('language', '')}\n"
    repo_text += f"Stars: {repo.get('stargazers_count', 0)}\n"
    repo_text += f"Topics: {', '.join(repo.get('topics', []))}\n"
    
    return {
        "id": f"github_repo::{repo.get('name')}",
        "text": repo_text.strip(),
        "source": "github_repos",
        "heading": f"Repo: {repo.get('name')}",
        "title": repo.get("name"),
        "type": "repo",
        "url": repo.get('html_url', ''),
        "source_type": "github",
        "content_type": "repo",
        "visibility": "public" if not repo.get('private') else "private",
        "trust_level": "verified",
        "timestamp": repo.get("updated_at", ""),
        "last_updated": repo.get("updated_at", "")
    }


def get_github_chunks() -> list[dict]:
    """
    Fetches GitHub profile and repositories using the Installation Token.
    Returns the formatted RAG chunks.
    """
    token = get_installation_token()
    headers = {"Accept": "application/vnd.github.v3+json"}
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
            
        # 2. Fetch repos
        # We query for installation repos if using an App, else public user repos
        app_id = os.getenv("GITHUB_APP_ID")
        if app_id and token:
            repos_url = f"{GITHUB_API_URL}/installation/repositories?per_page=100"
            repos_resp = requests.get(repos_url, headers=headers)
            if repos_resp.status_code == 200:
                repos_data = repos_resp.json().get("repositories", [])
            else:
                repos_data = []
        else:
            repos_url = f"{GITHUB_API_URL}/users/{GITHUB_USERNAME}/repos?sort=stargazers_count&direction=desc&per_page=100"
            repos_resp = requests.get(repos_url, headers=headers)
            repos_data = repos_resp.json() if repos_resp.status_code == 200 else []

        for repo in repos_data:
            if repo.get("fork"): continue
            chunks.append(format_repo_chunk(repo))

    except Exception as e:
        logger.warning(f"Failed to fetch GitHub data: {e}")
        
    return chunks
