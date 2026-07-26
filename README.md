# Portfolio Project

A React + Vite portfolio with an AI assistant that answers questions about my work using RAG.

## Personal Information Notice

This repository contains personal portfolio content. Contact details and similar personal information are intended for legitimate enquiries only. Please ask for permission before reusing, republishing, or redistributing any personal details from this repo or the live site.

## Setup & Local Development

This project uses secure environment variables to manage API keys and credentials. You must set up your local environment before running the backend.

1. **Copy the template file:**
   Inside the `backend/` directory, copy the `.env.example` file to a new file named `.env`:
   ```bash
   cp backend/.env.example backend/.env
   ```

2. **Fill in your secrets:**
   Open `backend/.env` and replace the placeholder strings with your actual credentials:
   - `GROQ_API_KEY`: Your Groq LLM API key.
   - `GITHUB_APP_ID`: Your GitHub App ID.
   - `GITHUB_INSTALLATION_ID`: Your GitHub App Installation ID.
   - `GITHUB_WEBHOOK_SECRET`: The webhook secret used for verifying GitHub events.
   - `GITHUB_PRIVATE_KEY`: Your GitHub App's private key (ensure newlines are formatted as `\n` if placed on a single line).

3. **Run the Backend:**
   The backend will perform a validation check on startup. If any required variables are missing, it will gracefully exit with a clear error message.
   ```bash
   cd backend
   uvicorn main:app --reload
   ```
