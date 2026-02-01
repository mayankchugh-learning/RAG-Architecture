# Infrastructure & Prompt Engineering Guide

## 1. Automation Infrastructure Recommendations

To achieve optimal resilience and scalability for this RAG application, we recommend the following minimum configuration:

### Minimum Configuration
- **Compute**: AWS ECS (Fargate) or GCP Cloud Run for serverless container execution.
- **Database**: Managed PostgreSQL (AWS RDS or GCP Cloud SQL) with `pgvector` enabled.
- **Load Balancer**: Application Load Balancer (ALB) with SSL termination.
- **Autoscaling**: 
  - Scale based on CPU Utilization (>60%) or Request Count.
  - Minimum 2 instances across different Availability Zones (Multi-AZ).

### Terraform Snippet (Conceptual)
```hcl
resource "aws_alb" "main" {
  name            = "rag-lb"
  subnets         = aws_subnet.public.*.id
  security_groups = [aws_security_group.lb.id]
}

resource "aws_appautoscaling_target" "target" {
  max_capacity       = 5
  min_capacity       = 2
  resource_id        = "service/cluster/app"
  scalable_dimension = "ecs:service:DesiredCount"
  service_namespace  = "ecs"
}
```

## 2. Re-Generation Prompts

Use these prompts with an AI agent to recreate or extend this system:

### Prompt 1: Core Architecture
> "Build an Enterprise RAG system using Node.js (Express) and React. Use PostgreSQL with pgvector for the database. Implement a document ingestion pipeline that parses PDFs, chunks text, and generates embeddings using OpenAI text-embedding-3-small. Use Drizzle ORM for database management."

### Prompt 2: Security & Classification
> "Add a sensitivity classification layer to the RAG system. Each document should be tagged as Red, Amber, or Green. Ensure the search retrieval logic respects these tags and cite sources in the chat response."

### Prompt 3: Infrastructure Setup
> "Generate a Dockerfile and docker-compose.yml for a full-stack Node/React app. Include a PostgreSQL container and environment variables for OpenAI and Database connectivity."
