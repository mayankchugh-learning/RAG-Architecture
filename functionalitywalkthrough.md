# Functionality Walkthrough

## User Features

### 1. Secure Authentication
- Access is restricted to authenticated users via Replit Auth.
- Users can log in using their organizational credentials via OIDC.

### 2. Knowledge Base Management
- **Upload**: Support for PDF ingestion.
- **Classification**: Documents can be tagged with sensitivity levels (Red, Amber, Green) to align with enterprise security standards.
- **Status Tracking**: Visual indicators for "Pending", "Processing", and "Ready" states.

### 3. AI-Powered Chat
- **Contextual Responses**: The bot answers questions based *only* on the uploaded knowledge base.
- **Streaming UI**: Responses are streamed in real-time for a responsive experience.
- **Chat History**: Previous conversations are saved and can be revisited.

## Technical Capabilities
- **Semantic Search**: Uses vector embeddings instead of simple keyword matching to understand the *meaning* of user queries.
- **Hybrid Storage**: Combines structured metadata (PostgreSQL) with unstructured file storage (Object Storage).
- **Scalable Pipeline**: The ingestion engine handles PDF parsing and embedding generation in a background process.
