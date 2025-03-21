import { getHistoryContext, addToHistory } from "../conversationContext.js";
import axios from "axios";
import dotenv from "dotenv";
import { askAgent as askAgentService } from "./AgentService.js";

dotenv.config();

const GEMINI_API_KEY = process.env.GEMINI_API_KEY;

if (!GEMINI_API_KEY) {
  throw new Error("🔴 Error: Gemini API Key not found in .env!");
}

export async function askAgent(query) {
  return await askAgentService(query);
}

async function callGeminiAPI(query, context) {
  try {
    const payload = {
      contents: [{
        parts: [{
          text: context ? `${context}\n\n${query}` : query
        }]
      }]
    };

    const response = await axios.post(
      `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${GEMINI_API_KEY}`,
      payload
    );

    return response.data?.candidates?.[0]?.content?.parts?.[0]?.text || "No response generated.";
  } catch (error) {
    throw new Error(`Failed to get response from Gemini: ${error.message}`);
  }
}
