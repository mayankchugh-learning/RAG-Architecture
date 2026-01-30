import OpenAI from "openai";

export async function generateEmbedding(text: string): Promise<number[]> {
  if (!process.env.OPENAI_API_KEY) {
    throw new Error("OPENAI_API_KEY is not set. Please add it to Secrets.");
  }
  const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });
  const response = await openai.embeddings.create({
    model: "text-embedding-3-small",
    input: text,
    encoding_format: "float",
  });
  return response.data[0].embedding;
}

export async function generateCompletion(messages: any[]) {
  if (!process.env.OPENAI_API_KEY) {
    throw new Error("OPENAI_API_KEY is not set. Please add it to Secrets.");
  }
  const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });
  return await openai.chat.completions.create({
    model: "gpt-4o",
    messages: messages,
    stream: true,
  });
}
