import fetch from 'node-fetch';

export class OpenAIProvider {
  static name = 'OpenAI';

  static async generateEmbedding(text) {
    const response = await fetch(
      `https://api.openai.com/v1/embeddings`,
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${process.env.OPENAI_API_KEY}`
        },
        body: JSON.stringify({
          model: 'text-embedding-ada-002',
          input: text
        })
      }
    );
    const data = await response.json();
    if (!data.data?.[0]?.embedding) {
      throw new Error('OpenAI API returned no embedding.');
    }
    return data.data[0].embedding;
  }
}
