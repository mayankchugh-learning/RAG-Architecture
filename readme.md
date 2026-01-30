# Enterprise RAG System

A secure, enterprise-grade Retrieval-Augmented Generation (RAG) system built with the Anglo Eastern architecture in mind.

## Technical Stack
- **Frontend**: React, Vite, Tailwind CSS, Shadcn UI
- **Backend**: Node.js (Express)
- **Database**: PostgreSQL with `pgvector`
- **ORM**: Drizzle ORM
- **AI**: OpenAI (GPT-4o for completion, text-embedding-3-small for vectors)
- **Storage**: Replit Object Storage
- **Auth**: Replit Auth (OIDC)
- **Parsing**: pdf-parse

## Environment Setup Steps

### 1. Database Configuration
Ensure your PostgreSQL database has the `vector` extension enabled. This is handled automatically by the ingestion scripts, but can be verified via:
```sql
CREATE EXTENSION IF NOT EXISTS vector;
```

### 2. Object Storage
The app requires Replit Object Storage to be provisioned. Ensure the following environment variables are present (Replit handles this when you add the integration):
- `DEFAULT_OBJECT_STORAGE_BUCKET_ID`
- `PRIVATE_OBJECT_DIR`

### 3. OpenAI Credentials
The system requires an OpenAI API key for embeddings and chat generation.
1. Go to **Tools** -> **Secrets**.
2. Add `OPENAI_API_KEY` with your secret key.

### 4. Installation & Deployment
```bash
# Install dependencies
npm install

# Push database schema
npm run db:push

# Start the application
npm run dev
```

## Security Note
This application implements a Sensitivity Classification system (Red/Amber/Green). Ensure that internal access policies are reviewed when moving to a production environment.
