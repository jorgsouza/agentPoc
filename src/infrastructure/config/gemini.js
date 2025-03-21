import dotenv from 'dotenv';
import { AIProviderService } from '../../domain/services/AIProviderService.js';
import { GeminiProvider } from '../providers/GeminiProvider.js';
import { OpenAIProvider } from '../providers/OpenAIProvider.js';
import { InternalServerProvider } from '../providers/InternalServerProvider.js';
import { DockerLocalProvider } from '../providers/DockerLocalProvider.js';

dotenv.config();

const aiProviderService = new AIProviderService([
  GeminiProvider,
  OpenAIProvider,
  InternalServerProvider,
  DockerLocalProvider
]);

export async function generateEmbedding(text) {
  try {
    // For testing purposes, return mock embedding
    if (process.env.NODE_ENV === 'test') {
      return [0.1, 0.2, 0.3];
    }

    return await aiProviderService.generateEmbedding(text);
  } catch (error) {
    console.error('Error generating embedding:', error);
    throw error;
  }
}
