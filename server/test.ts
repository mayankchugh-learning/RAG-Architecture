import { db } from "./db";
import { storage } from "./storage";
import { generateEmbedding } from "./lib/openai";
import { documents, documentChunks } from "@shared/schema";
import { eq } from "drizzle-orm";

async function runTests() {
  console.log("🚀 Starting Enterprise RAG Test Suite...");

  try {
    // Test 1: Storage Layer
    console.log("Testing storage layer...");
    const testDoc = await storage.createDocument({
      filename: "test.pdf",
      originalName: "Test Document",
      contentType: "application/pdf",
      size: 1024,
      storagePath: "/objects/test-uuid",
      sensitivity: "green",
      status: "pending"
    });
    console.log("✅ Document creation successful");

    // Test 2: OpenAI Embedding (requires API key)
    if (process.env.OPENAI_API_KEY) {
      console.log("Testing OpenAI Embedding API...");
      const embedding = await generateEmbedding("Hello Anglo Eastern");
      console.log(`✅ Embedding generated (length: ${embedding.length})`);
      
      await storage.createDocumentChunks([{
        documentId: testDoc.id,
        content: "Hello Anglo Eastern",
        chunkIndex: 0,
        embedding
      }]);
      console.log("✅ Vector chunk storage successful");
    } else {
      console.warn("⚠️ Skipping OpenAI tests: OPENAI_API_KEY not set");
    }

    // Cleanup
    await storage.deleteDocument(testDoc.id);
    console.log("✅ Cleanup successful");
    
    console.log("\n✨ All backend unit tests passed!");
  } catch (error) {
    console.error("❌ Test failed:", error);
    process.exit(1);
  }
}

runTests();
