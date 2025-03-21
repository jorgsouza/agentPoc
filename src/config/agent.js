import dotenv from "dotenv";
import axios from "axios";
import { getHistoryContext } from "../infrastructure/conversationContext.js";
import { askAgent as agentService } from "../infrastructure/services/AgentService.js";

dotenv.config();

const GEMINI_API_KEY = process.env.GEMINI_API_KEY;
const GEMINI_MODEL = process.env.GEMINI_MODEL;

if (!GEMINI_API_KEY) {
  throw new Error("🔴 Error: Gemini API Key not found in .env!");
}

/**
 * Makes a query to the Gemini model and returns a response considering the history.
 * @param {string} query - User's question.
 * @returns {Promise<string>} - Response generated by Gemini.
 */
export async function askAgent(context) {
  const prompt = `
    ${context}

    **IMPORTANTE**: Responda SOMENTE em Português do Brasil.
  `;

  const payload = {
    contents: [{ parts: [{ text: prompt }] }],
  };

  try {
    const response = await axios.post(
      `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${GEMINI_API_KEY}`,
      payload
    );
    return response.data?.candidates?.[0]?.content?.parts?.[0]?.text || "Nenhuma resposta gerada.";
  } catch (error) {
    console.error("❌ Erro ao chamar o Gemini:", error.message);
    throw new Error("Falha na comunicação com o Gemini.");
  }
}

/**
 * Obtains an embedding from the Gemini API for an input text.
 * @param {string} text - Text to be embedded.
 * @returns {Promise<number[]>} - Embedding vector.
 */
export async function getEmbedding(text) {
  try {
    const response = await axios.post(
      `https://generativelanguage.googleapis.com/v1beta/models/embedding-001:embedContent?key=${GEMINI_API_KEY}`,
      { content: { parts: [{ text }] } }
    );

    return response.data?.embedding?.values || [];
  } catch (error) {
    console.error("❌ Error generating embedding:", error.response?.data || error.message);
    return [];
  }
}
