import fetch from 'node-fetch';

export class InternalServerProvider {
  static name = 'InternalServer';

  static async generateEmbedding(text) {
    const modelName = process.env.MODEL_NAME; // Obtém o modelo do .env
    if (!modelName) {
      throw new Error('MODEL_NAME is not defined in the environment variables.');
    }

    const response = await fetch(
      `${process.env.INTERNAL_SERVER_URL}/generate-embedding`,
      {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ text, model: modelName }) // Inclui o modelo na requisição
      }
    );

    const data = await response.json();
    if (!data.embedding) {
      throw new Error('Internal server returned no embedding.');
    }
    return data.embedding;
  }
}
