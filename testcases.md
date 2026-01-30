# Test Cases: Enterprise RAG System

These test cases are designed to validate the core requirements of the Enterprise RAG system.

## 1. Authentication & Access Control
| Test Case ID | Description | Expected Result | Status |
|--------------|-------------|-----------------|--------|
| TC-01 | Attempt to access `/api/documents` without logging in. | System returns `401 Unauthorized`. | Pending |
| TC-02 | Log in via Replit Auth. | User is redirected to home page and session is established. | Pending |
| TC-03 | Access Knowledge Base as an authenticated user. | List of documents is visible. | Pending |

## 2. Ingestion Pipeline
| Test Case ID | Description | Expected Result | Status |
|--------------|-------------|-----------------|--------|
| TC-04 | Upload a valid PDF document. | Document appears in list with "Pending" status. | Pending |
| TC-05 | Trigger document processing. | Status changes from "Processing" to "Ready". | Pending |
| TC-06 | Verify chunks in database. | `document_chunks` table contains text and embeddings for the PDF. | Pending |
| TC-07 | Delete a document. | Document and its associated chunks are removed from DB and Storage. | Pending |

## 3. RAG & Chat Functionality
| Test Case ID | Description | Expected Result | Status |
|--------------|-------------|-----------------|--------|
| TC-08 | Submit a query related to an uploaded document. | Assistant provides a relevant answer based on the PDF content. | Pending |
| TC-09 | Submit a query NOT in the document (Hallucination check). | Assistant states it doesn't know the answer based on the context. | Pending |
| TC-10 | Verify streaming response. | Assistant content appears incrementally in the UI. | Pending |

## 4. Sensitivity & Classification
| Test Case ID | Description | Expected Result | Status |
|--------------|-------------|-----------------|--------|
| TC-11 | Set document sensitivity to "Red". | Metadata is updated in the database. | Pending |
| TC-12 | Verify sensitivity visibility in UI. | Classification badge is correctly displayed on the document card. | Pending |
