import fetch from 'node-fetch';

export class DockerLocalProvider {
  static name = 'DockerLocal';

  static async generateEmbedding(text) {
    const response = await fetch(
      `http://localhost:5000/generate-embedding`,
      {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ text })
      }
    );
    const data = await response.json();
    if (!data.embedding) {
      throw new Error('Docker local service returned no embedding.');
    }
    return data.embedding;
  }
}
