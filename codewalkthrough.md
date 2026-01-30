# Code Walkthrough: Enterprise RAG Architecture

This document provides a technical overview of how the Enterprise RAG system is implemented in this codebase.

## 1. Data Layer (`shared/schema.ts`)
The schema defines the core entities using Drizzle ORM:
- **`users` & `sessions`**: Managed by Replit Auth for secure session handling.
- **`documents`**: Tracks metadata for uploaded PDFs, including storage paths and sensitivity levels (Red, Amber, Green).
- **`document_chunks`**: Stores text fragments along with their high-dimensional vector embeddings (`vector(1536)`).
- **`chats` & `messages`**: Persists conversation history for individual users.

## 2. RAG Ingestion Pipeline (`server/routes.ts`)
When a document is uploaded:
1.  **Storage**: The file is saved to Replit Object Storage.
2.  **Parsing**: `pdf-parse` extracts raw text from the PDF buffer.
3.  **Chunking**: Text is split into manageable semantic blocks (~1000 characters).
4.  **Embedding**: Each chunk is sent to OpenAI's `text-embedding-3-small` model.
5.  **Persistence**: Chunks and their vectors are stored in PostgreSQL via `pgvector`.

## 3. Retrieval & Generation (`server/routes.ts`)
During a chat interaction:
1.  **Vector Search**: The user's query is converted to an embedding. We use the `<=>` (cosine distance) operator in PostgreSQL to find the top 5 most relevant chunks.
2.  **Context Construction**: Retrieved chunks are injected into a system prompt.
3.  **Augmented Generation**: The prompt is sent to `gpt-4o` with streaming enabled.
4.  **Source Attribution**: The assistant includes source filenames in the context to ensure transparency.

## 4. Frontend Architecture
- **State Management**: Uses `@tanstack/react-query` for robust data fetching and cache invalidation.
- **Components**:
    - `ObjectUploader`: Handles the two-step presigned URL upload flow directly to storage.
    - `useAuth`: Manages the OIDC authentication lifecycle.
    - `ChatWindow`: Handles real-time message rendering.
- **Routing**: Client-side routing via `wouter`.
