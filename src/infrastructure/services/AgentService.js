import axios from "axios";
import dotenv from "dotenv";
import { getHistoryContext } from "../conversationContext.js";

dotenv.config();

const GEMINI_API_KEY = process.env.GEMINI_API_KEY;

/**
 * Sends a query to the Gemini API and returns the response.
 * @param {string} query - The user's query.
 * @returns {Promise<string>} - The AI-generated response.
 */
export async function askAgent(query) {
  if (!GEMINI_API_KEY) {
    throw new Error("🔴 Error: Gemini API Key not found in .env!");
  }

  try {
    const context = getHistoryContext();
    const prompt = `
      ${context ? `${context}\n\n` : ''}
      ${query}
      
      **IMPORTANT**: Respond ONLY in Brazilian Portuguese.
    `;
    const payload = {
      contents: [{ parts: [{ text: prompt }] }],
    };

    const response = await axios.post(
      `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${GEMINI_API_KEY}`,
      payload
    );

    return response.data?.candidates?.[0]?.content?.parts?.[0]?.text || "No response generated.";
  } catch (error) {
    console.error("❌ Error calling Gemini:", error.message);
    throw error;
  }
}
