import fetch from 'node-fetch';

export class GeminiProvider {
  static name = 'Gemini';

  static async generateEmbedding(text) {
    const response = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/embedding-001:embedContent?key=${process.env.GEMINI_API_KEY}`,
      {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          model: 'models/embedding-001',
          content: { parts: [{ text }] }
        })
      }
    );
    const data = await response.json();
    if (!data.embedding?.values) {
      throw new Error('Gemini API returned no embedding.');
    }
    return data.embedding.values;
  }
}
