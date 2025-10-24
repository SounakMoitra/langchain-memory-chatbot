import { ChatGoogleGenerativeAI, GoogleGenerativeAIEmbeddings } from "@langchain/google-genai";
import 'dotenv/config';

export const model = new ChatGoogleGenerativeAI({
  model: "gemini-2.5-pro",
  maxOutputTokens: 2048,
  apiKey: process.env.GOOGLE_API_KEY,
});

export const embeddings = new GoogleGenerativeAIEmbeddings({
  model: "gemini-embedding-001",
  apiKey: process.env.GOOGLE_API_KEY,
});
