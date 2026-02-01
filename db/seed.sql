-- Data Manipulation Language (DML)
-- Sample data for initializing the RAG system.

-- 1. Insert a mock user (Optional, usually handled by Auth)
-- INSERT INTO users (id, email, first_name, last_name) 
-- VALUES ('user_123', 'admin@example.com', 'Admin', 'User')
-- ON CONFLICT DO NOTHING;

-- 2. Insert a sample document record
INSERT INTO documents (filename, original_name, content_type, size, storage_path, status, sensitivity)
VALUES ('handbook.pdf', 'Employee Handbook 2024', 'application/pdf', 524288, '/objects/uploads/sample-uuid', 'ready', 'green');

-- 3. Insert sample chunks for the document
-- Note: Embeddings are typically generated via script, this is a placeholder
INSERT INTO document_chunks (document_id, content, chunk_index)
VALUES 
(1, 'The standard working hours are 9:00 AM to 5:00 PM, Monday through Friday.', 0),
(1, 'Employees are entitled to 20 days of paid annual leave per calendar year.', 1);

-- 4. Create a sample chat
INSERT INTO chats (user_id, title)
VALUES ('user_123', 'Inquiry about leave policy');

-- 5. Add messages to the chat
INSERT INTO messages (chat_id, role, content)
VALUES 
(1, 'user', 'What is the annual leave policy?'),
(1, 'assistant', 'According to the handbook, employees are entitled to 20 days of paid annual leave per calendar year.');
