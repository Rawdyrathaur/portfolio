# Portfolio Project

This repository contains the code for a portfolio project built using React and Vite. The project showcases various components and features, including a theme toggle, read mode, and integration with multiple APIs.

## Live Diagram

You can view the live system design diagram for this project below:

![System Design Diagram](https://excalidraw.com/#json=-ITz3wuusgeWy7xXojPeZ,j594q_CJgeP8RNO0UzjOog)

## Features
- Dark and Light Theme Toggle
- Read Mode Context
- Integration with ChromaDB for context retrieval
- LLM Router Layer for handling multiple free-tier APIs

## Project Structure
```
backend/
├── main.py                # Entry point for the backend
├── bifrost_router.py      # LLM Router logic
├── rag.py                 # ChromaDB integration for context retrieval
├── .env                   # Environment variables (API keys, etc.)
├── requirements.txt       # Python dependencies
└── utils/
    ├── response_utils.py  # Utility functions for response normalization
    └── logger.py          # Logging utilities

src/
├── App.jsx                # Main React component
├── components/            # React components
│   ├── Navbar/            # Navbar component
│   ├── Hero/              # Hero section
│   ├── ThemeToggle/       # Theme toggle logic
│   └── ReadMode/          # Read mode logic
└── styles/                # Global styles
```

## Workflow Diagram

Below is the enhanced workflow diagram for the LLM Router process, providing a clear and detailed understanding of how user queries are processed:

```mermaid
flowchart TD
    classDef frontend fill:#e1f5fe,stroke:#01579b,stroke-width:2px,color:#000
    classDef rag fill:#fff3e0,stroke:#e65100,stroke-width:2px,color:#000
    classDef router fill:#f3e5f5,stroke:#6a1b9a,stroke-width:2px,color:#000
    classDef llm fill:#e8f5e9,stroke:#1b5e20,stroke-width:2px,color:#000
    classDef success fill:#c8e6c9,stroke:#2e7d32,stroke-width:2px,color:#000
    classDef error fill:#ffcdd2,stroke:#c62828,stroke-width:2px,color:#000

    A[User Query]:::frontend -->|1. Send Query| B[POST /query]:::rag
    B -->|2. Retrieve Context| C[Retrieve Context\nfrom ChromaDB]:::rag
    C -->|3. Combine Query + Context| D[Query + Context]:::router

    D -->|4. Route to Primary LLM| E{OpenAI GPT-4}:::llm
    E -->|Success| H[Normalize Response]:::success
    E -->|Fail| F{Anthropic Claude}:::llm
    F -->|Success| H
    F -->|Fail| G{Cohere Command}:::llm
    G -->|Success| H
    G -->|Fail| I[Error: All LLMs Failed]:::error

    H -->|5. Return Response| Z[Display Response]:::frontend
    I -->|5. Return Error| Z

    %% Additional Notes
    %% - The process ensures fallback mechanisms for high availability.
    %% - Normalization guarantees consistent response formatting.
```

### Explanation of the Workflow

1. **User Query**:
   - The user submits a query through the frontend interface.
   - The query is sent to the backend via a `POST /query` API call.

2. **Retrieve Context**:
   - The backend retrieves relevant context for the query using ChromaDB.
   - This ensures that the LLMs have the necessary information to generate accurate responses.

3. **Combine Query + Context**:
   - The query and retrieved context are combined into a single input for the LLM Router.

4. **LLM Routing**:
   - The router first sends the input to the primary LLM (OpenAI GPT-4).
   - If the primary LLM fails (e.g., timeout, rate limit), the router falls back to secondary LLMs (Anthropic Claude, Cohere Command).

5. **Normalize Response**:
   - The response from the LLM is normalized to ensure consistent formatting.

6. **Display Response**:
   - The normalized response is sent back to the frontend and displayed to the user.
   - If all LLMs fail, an error message is returned instead.

### Key Features of the Workflow
- **Fallback Mechanism**:
  - Ensures high availability by routing queries to multiple LLMs in case of failures.
- **Context-Aware Responses**:
  - Integrates ChromaDB to provide relevant context for more accurate responses.
- **Error Handling**:
  - Returns a user-friendly error message if all LLMs fail.
- **Scalability**:
  - The architecture can easily accommodate additional LLMs or context sources in the future.

## Getting Started

### Prerequisites
- Node.js
- Python 3.9+

### Installation
1. Clone the repository:
   ```bash
   git clone https://github.com/your-username/portfolio.git
   ```
2. Navigate to the project directory:
   ```bash
   cd portfolio
   ```
3. Install frontend dependencies:
   ```bash
   npm install
   ```
4. Navigate to the backend directory:
   ```bash
   cd backend
   ```
5. Install backend dependencies:
   ```bash
   pip install -r requirements.txt
   ```

### Running the Project
1. Start the backend server:
   ```bash
   python main.py
   ```
2. Start the frontend development server:
   ```bash
   npm run dev
   ```

## License
This project is licensed under the MIT License.