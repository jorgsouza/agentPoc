import dotenv from "dotenv";
import { Pinecone } from "@pinecone-database/pinecone";
import { getEmbedding } from "../../domain/services/EmbeddingService.js";
import { askAgent } from "../../config/agent.js";

dotenv.config();

// Initialize the Pinecone client correctly with the new API
const pinecone = new Pinecone({
  apiKey: process.env.PINECONE_API_KEY,
});

const index = pinecone.Index(process.env.PINECONE_INDEX);

/**
 * Performs a search in Pinecone based on a user query.
 * @param {string} query - User's question.
 */
export async function searchConfluenceDocs(query) {
  // console.log(`🔎 Searching for an answer to: "${query}"`);

  try {
    // Generate embedding for the question
    const queryEmbedding = await getEmbedding(query);

    // Query Pinecone
    const queryResponse = await index.query({
      vector: queryEmbedding,
      topK: 3,
      includeMetadata: true,
    });

    if (!queryResponse.matches || !queryResponse.matches.length) {
      console.log("⚠️ No relevant documents found.");
      return "I couldn't find relevant information in the knowledge base to answer your question.";
    }

    // Get the texts of the found documents
    const documents = queryResponse.matches.map((match) => match.metadata.text).join("\n\n");

    // Build the final question for the Agent
    const prompt = `
    Here are some relevant documents extracted from Confluence:

    ${documents}

    Question: ${query}

    Respond based on these documents in Brazilian Portuguese.
    `;

    // console.log("🤖 Sending question to the Agent...");
    const response = await askAgent(prompt);

    return response;
  } catch (error) {
    console.error("❌ Error while searching documents:", error);
    return "An error occurred while querying the knowledge base. Please try again later.";
  }
}