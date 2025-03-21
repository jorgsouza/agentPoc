import { DomainError } from '../../infrastructure/errors/ErrorHandler.js';
import { getEmbedding } from '../services/EmbeddingService.js';
import axios from 'axios';

export class AIAgent {
  constructor(apiKey, model = 'gemini-2.0-flash') {
    this.apiKey = apiKey;
    this.model = model;
    this.baseUrl = 'https://generativelanguage.googleapis.com/v1beta';
  }

  async analyze(prompt) {
    try {
      const response = await axios.post(
        `${this.baseUrl}/models/${this.model}:generateContent?key=${this.apiKey}`,
        { contents: [{ parts: [{ text: prompt }] }] }
      );

      return response.data?.candidates?.[0]?.content?.parts?.[0]?.text || 'No response generated';
    } catch (error) {
      throw new DomainError('AI analysis failed', { 
        error: error.message,
        model: this.model
      });
    }
  }

  async getEmbedding(text) {
    return await getEmbedding(text);
  }
}
