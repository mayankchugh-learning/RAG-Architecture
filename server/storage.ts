import { users, documents, documentChunks, chats, messages, type User, type InsertUser, type Document, type InsertDocument, type DocumentChunk, type Chat, type Message } from "@shared/schema";
import { db } from "./db";
import { eq, desc } from "drizzle-orm";

export interface IStorage {
  getUser(id: string): Promise<User | undefined>;
  getUserByUsername(username: string): Promise<User | undefined>;
  createUser(user: InsertUser): Promise<User>;

  createDocument(doc: InsertDocument): Promise<Document>;
  getDocument(id: number): Promise<Document | undefined>;
  getDocuments(): Promise<Document[]>;
  updateDocumentStatus(id: number, status: string): Promise<Document>;
  deleteDocument(id: number): Promise<void>;

  createDocumentChunks(chunks: {documentId: number, content: string, chunkIndex: number, embedding: number[]}[]): Promise<void>;
  
  createChat(chat: {userId: string, title: string}): Promise<Chat>;
  getChat(id: number): Promise<Chat | undefined>;
  getChats(userId: string): Promise<Chat[]>;
  createMessage(message: {chatId: number, role: string, content: string}): Promise<Message>;
  getMessages(chatId: number): Promise<Message[]>;
}

export class DatabaseStorage implements IStorage {
  async getUser(id: string): Promise<User | undefined> {
    const [user] = await db.select().from(users).where(eq(users.id, id));
    return user;
  }

  async getUserByUsername(username: string): Promise<User | undefined> {
    const [user] = await db.select().from(users).where(eq(users.username, username));
    return user;
  }

  async createUser(insertUser: InsertUser): Promise<User> {
    const [user] = await db.insert(users).values(insertUser).returning();
    return user;
  }

  async createDocument(doc: InsertDocument): Promise<Document> {
    const [document] = await db.insert(documents).values(doc).returning();
    return document;
  }

  async getDocument(id: number): Promise<Document | undefined> {
    const [document] = await db.select().from(documents).where(eq(documents.id, id));
    return document;
  }

  async getDocuments(): Promise<Document[]> {
    return await db.select().from(documents).orderBy(desc(documents.uploadedAt));
  }

  async updateDocumentStatus(id: number, status: string): Promise<Document> {
    const [document] = await db
      .update(documents)
      .set({ status })
      .where(eq(documents.id, id))
      .returning();
    return document;
  }

  async deleteDocument(id: number): Promise<void> {
    await db.delete(documentChunks).where(eq(documentChunks.documentId, id));
    await db.delete(documents).where(eq(documents.id, id));
  }

  async createDocumentChunks(chunks: {documentId: number, content: string, chunkIndex: number, embedding: number[]}[]): Promise<void> {
    if (chunks.length === 0) return;
    await db.insert(documentChunks).values(chunks);
  }

  async createChat(chat: {userId: string, title: string}): Promise<Chat> {
    const [newChat] = await db.insert(chats).values(chat).returning();
    return newChat;
  }

  async getChat(id: number): Promise<Chat | undefined> {
    const [chat] = await db.select().from(chats).where(eq(chats.id, id));
    return chat;
  }

  async getChats(userId: string): Promise<Chat[]> {
    return await db.select().from(chats).where(eq(chats.userId, userId)).orderBy(desc(chats.createdAt));
  }

  async createMessage(message: {chatId: number, role: string, content: string}): Promise<Message> {
    const [newMessage] = await db.insert(messages).values(message).returning();
    return newMessage;
  }

  async getMessages(chatId: number): Promise<Message[]> {
    return await db.select().from(messages).where(eq(messages.chatId, chatId)).orderBy(messages.createdAt);
  }
}

export const storage = new DatabaseStorage();
