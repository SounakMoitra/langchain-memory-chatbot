import { MemoryVectorStore } from "langchain/vectorstores/memory";
import { embeddings } from "../config/gemini.config.js";

export const store = new MemoryVectorStore(embeddings);
