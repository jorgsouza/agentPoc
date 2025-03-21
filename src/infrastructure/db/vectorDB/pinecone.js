import dotenv from "dotenv";
import axios from "axios";
import { generateEmbedding } from "../../config/gemini.js"; // ✅ Importação corrigida

dotenv.config();

const PINECONE_API_KEY = process.env.PINECONE_API_KEY;
const PINECONE_ENVIRONMENT = process.env.PINECONE_ENVIRONMENT;
const PINECONE_INDEX = process.env.PINECONE_INDEX;

if (!PINECONE_API_KEY || !PINECONE_ENVIRONMENT || !PINECONE_INDEX) {
  throw new Error("🔴 Erro: Variáveis de ambiente do Pinecone não foram carregadas!");
}

export async function initializePinecone() {
  console.log("📌 Inicializando Pinecone...");
  // Simulação de inicialização (substitua pela lógica real se necessário)
  return true;
}

export async function searchEmbedding(query) {
  try {
    console.log("📌 Enviando consulta para Pinecone:", query);
    
    // 🔹 Chamada correta para gerar embedding
    const embedding = await generateEmbedding(query);

    console.log("✅ Embedding gerado com sucesso:", embedding);
    return embedding;
  } catch (error) {
    console.error("❌ Erro ao processar consulta:", error.message);
    throw error;
  }
}

export async function storeEmbedding(fileName, embedding) {
  // Infrastructure-specific logic for storing embeddings
  // ...existing code...
}
