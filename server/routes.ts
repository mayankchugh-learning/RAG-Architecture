import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { api } from "@shared/routes";
import { z } from "zod";
import { setupAuth, registerAuthRoutes } from "./replit_integrations/auth";
import { registerObjectStorageRoutes } from "./replit_integrations/object_storage";
import { generateEmbedding, generateCompletion } from "./lib/openai";
import { db } from "./db";
import { documentChunks, documents } from "@shared/schema";
import { sql, eq, cosineDistance, desc, gt } from "drizzle-orm";
import { ObjectStorageService } from "./replit_integrations/object_storage/objectStorage";
import * as pdfParse from "pdf-parse";

export async function registerRoutes(
  httpServer: Server,
  app: Express
): Promise<Server> {
  // Auth & Storage Integrations
  await setupAuth(app);
  registerAuthRoutes(app);
  registerObjectStorageRoutes(app);

  const objectStorage = new ObjectStorageService();

  // Documents
  app.get(api.documents.list.path, async (req, res) => {
    const docs = await storage.getDocuments();
    res.json(docs);
  });

  app.post(api.documents.create.path, async (req, res) => {
    try {
      const input = api.documents.create.input.parse(req.body);
      const doc = await storage.createDocument(input);
      res.status(201).json(doc);
    } catch (err) {
      if (err instanceof z.ZodError) {
        return res.status(400).json({ message: err.errors[0].message });
      }
      throw err;
    }
  });

  app.post(api.documents.process.path, async (req, res) => {
    const docId = Number(req.params.id);
    const doc = await storage.getDocument(docId);
    if (!doc) return res.status(404).json({ message: "Document not found" });

    // Start processing in background (or await for MVP simplicity)
    // For a real app, use a queue. Here we await to show immediate errors, or fire & forget.
    // We'll await for MVP to keep it simple, but set status first.
    await storage.updateDocumentStatus(docId, "processing");

    (async () => {
      try {
        // 1. Download file
        const file = await objectStorage.getObjectEntityFile(doc.storagePath);
        const [buffer] = await file.download();

        // 2. Parse PDF
        let textContent = "";
        if (doc.contentType === "application/pdf") {
          const data = await (pdfParse as any).default(buffer);
          textContent = data.text;
        } else {
          // Fallback for text files
          textContent = buffer.toString("utf-8");
        }

        // 3. Chunk text
        const chunks = splitTextIntoChunks(textContent, 1000);

        // 4. Generate embeddings and save
        const chunkData = [];
        for (let i = 0; i < chunks.length; i++) {
          const embedding = await generateEmbedding(chunks[i]);
          chunkData.push({
            documentId: docId,
            content: chunks[i],
            chunkIndex: i,
            embedding,
          });
        }
        await storage.createDocumentChunks(chunkData);

        // 5. Update status
        await storage.updateDocumentStatus(docId, "ready");
      } catch (error) {
        console.error("Processing error:", error);
        await storage.updateDocumentStatus(docId, "failed");
      }
    })();

    res.json({ status: "processing_started" });
  });

  app.delete(api.documents.delete.path, async (req, res) => {
    await storage.deleteDocument(Number(req.params.id));
    res.status(204).send();
  });

  // Chats
  app.get(api.chats.list.path, async (req: any, res) => {
    if (!req.isAuthenticated()) return res.status(401).send();
    const chats = await storage.getChats(req.user.claims.sub);
    res.json(chats);
  });

  app.post(api.chats.create.path, async (req: any, res) => {
    if (!req.isAuthenticated()) return res.status(401).send();
    const chat = await storage.createChat({
      userId: req.user.claims.sub,
      title: req.body.title,
    });
    res.status(201).json(chat);
  });

  app.get(api.chats.get.path, async (req, res) => {
    const chatId = Number(req.params.id);
    const chat = await storage.getChat(chatId);
    if (!chat) return res.status(404).json({ message: "Chat not found" });
    const messages = await storage.getMessages(chatId);
    res.json({ chat, messages });
  });

  app.post(api.chats.message.path, async (req, res) => {
    const chatId = Number(req.params.id);
    const content = req.body.content;

    // Save user message
    const userMessage = await storage.createMessage({
      chatId,
      role: "user",
      content,
    });

    // RAG Logic
    const embedding = await generateEmbedding(content);
    
    // Perform similarity search
    // Note: Drizzle cosineDistance is available in 0.31+ or via sql operator
    const similarity = sql<number>`1 - (${documentChunks.embedding} <=> ${JSON.stringify(embedding)})`;
    
    const similarChunks = await db.select({
      content: documentChunks.content,
      similarity,
      filename: documents.filename
    })
    .from(documentChunks)
    .innerJoin(documents, eq(documentChunks.documentId, documents.id))
    .where(gt(similarity, 0.5)) // Threshold
    .orderBy(desc(similarity))
    .limit(5);

    // Construct context
    const context = similarChunks.map(c => `Source (${c.filename}): ${c.content}`).join("\n\n");
    const systemPrompt = `You are a helpful assistant for Anglo Eastern. Use the following context to answer the user's question. If the answer is not in the context, say you don't know.\n\nContext:\n${context}`;

    // Generate response (Streaming)
    const stream = await generateCompletion([
      { role: "system", content: systemPrompt },
      { role: "user", content }
    ]);

    // Set headers for streaming
    res.setHeader("Content-Type", "text/plain");
    res.setHeader("Transfer-Encoding", "chunked");

    // Send user message ID first (optional, or just stream content)
    // Here we just stream the content of the assistant response
    let fullResponse = "";
    
    for await (const chunk of stream) {
      const text = chunk.choices[0]?.delta?.content || "";
      if (text) {
        fullResponse += text;
        res.write(text);
      }
    }
    
    // Save assistant message after streaming
    await storage.createMessage({
      chatId,
      role: "assistant",
      content: fullResponse,
    });

    res.end();
  });

  return httpServer;
}

function splitTextIntoChunks(text: string, chunkSize: number): string[] {
  const chunks = [];
  let currentChunk = "";
  const sentences = text.split(/(?<=[.?!])\s+/);

  for (const sentence of sentences) {
    if ((currentChunk + sentence).length > chunkSize) {
      chunks.push(currentChunk);
      currentChunk = sentence;
    } else {
      currentChunk += (currentChunk ? " " : "") + sentence;
    }
  }
  if (currentChunk) chunks.push(currentChunk);
  return chunks;
}
