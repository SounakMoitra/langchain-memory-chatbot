import { model } from "../config/gemini.config.js";
import { store } from "../memory/vectorStore.js";
import { ChatPromptTemplate } from "@langchain/core/prompts";

const prompt = ChatPromptTemplate.fromMessages([
  [
    "system",
    "You are a helpful assistant generating output strictly in Markdown format. Use the provided context to answer.",
  ],
  ["assistant", "Context:\n {context}"],
  ["human", "{input}"],
]);

const chain = prompt.pipe(model);

export const chatHandler = async (req, res) => {
  try {
    const { message } = req.body;
    if (!message || typeof message !== "string") {
      return res
        .status(400)
        .json({ error: "Message must be a non-empty string." });
    }

    const contexts = await store.similaritySearchWithScore(message, 2);

    let finalContext = "";

    contexts.forEach((context) => {
      if (
        context[0]?.pageContent &&
        typeof context[0].pageContent === "string"
      ) {
        finalContext += context[0].pageContent + " ";
      }
    });

    const response = await chain.invoke({
      input: message,
      context: finalContext,
    });
    if (!response || !response.content) {
      throw new Error("No response from Gemini.");
    }

    // Store only valid strings in memory
    await store.addDocuments([
      { pageContent: `${message} ${response.content}` },
    ]);
    res.send({ data: response.content });
  } catch (err) {
    console.error("Chat Error:", err);
    res.status(500).json({ error: err.message || "Internal error" });
  }
};
