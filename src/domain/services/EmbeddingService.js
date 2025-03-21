import axios from "axios";
import dotenv from "dotenv";

dotenv.config();

const GEMINI_API_KEY = process.env.GEMINI_API_KEY;

/**
 * Generates an embedding for the given text using the Gemini API.
 * @param {string} text - The text to generate an embedding for.
 * @returns {Promise<number[]>} - The embedding vector.
 */
export async function generateTextEmbedding(text) {
  if (!GEMINI_API_KEY) {
    throw new Error("🔴 Error: Gemini API Key not found in .env!");
  }

  try {
    const response = await axios.post(
      `https://generativelanguage.googleapis.com/v1beta/models/embedding-001:embedContent?key=${GEMINI_API_KEY}`,
      { content: { parts: [{ text }] } }
    );

    return response.data?.embedding?.values || [];
  } catch (error) {
    console.error("❌ Error generating embedding:", error.response?.data || error.message);
    throw error;
  }
}

export async function getEmbedding(text) {
  return generateTextEmbedding(text);
}
