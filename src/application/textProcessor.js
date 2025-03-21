async function generateEmbedding(text) {
  const API_URL = `https://generativelanguage.googleapis.com/v1beta/models/embedding-001:embedContent?key=${process.env.GEMINI_API_KEY}`;
  
  const requestData = {
      model: "models/embedding-001",
      content: { parts: [{ text }] },
  };

  console.log("📌 Enviando payload para Gemini:", JSON.stringify(requestData, null, 2));

  try {
      const response = await axios.post(API_URL, requestData, {
          headers: { "Content-Type": "application/json" },
      });

      const embeddingValues = response.data.embedding.values;
      
      console.log("✅ Embedding gerado com sucesso:", embeddingValues);
      return embeddingValues;
  } catch (error) {
      console.error("❌ Erro ao gerar embedding:", error.response?.data || error.message);
      throw error;
  }
}

// 🔹 Certifique-se de exportar a função corretamente
module.exports = { generateEmbedding };
